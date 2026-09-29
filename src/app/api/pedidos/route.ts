import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { completarPedido } from "@/lib/completar-pedido";
import { obtenerStripe } from "@/lib/stripe";

const IVA = 0.16;
const ENVIO = 99;

export async function POST(req: Request) {
  const sesion = await obtenerSesion();
  if (!sesion) {
    return NextResponse.json({ error: "Debes iniciar sesión para comprar." }, { status: 401 });
  }

  const { items, direccionEnvio, metodoPago } = await req.json();
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  const esDistribuidor = sesion.rol === "DISTRIBUIDOR" || sesion.rol === "ADMINISTRADOR";
  const stripe = obtenerStripe();

  // Validar y calcular precios de forma autoritativa en el servidor.
  interface Linea {
    productoId: string;
    nombre: string;
    talla?: string;
    cantidad: number;
    precio: number;
  }
  const lineas: Linea[] = [];
  let subtotal = 0;
  for (const item of items) {
    const producto = await prisma.producto.findUnique({
      where: { id: String(item.productoId) },
      include: { tallas: true }
    });
    if (!producto || !producto.activo) {
      return NextResponse.json({ error: `Producto no disponible: ${item.productoId}` }, { status: 400 });
    }
    const cantidad = Number(item.cantidad);
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return NextResponse.json({ error: `Cantidad inválida para ${producto.nombre}.` }, { status: 400 });
    }
    const base = esDistribuidor ? producto.precioDistribuidor : producto.precioMinorista;
    const tallaNombre = typeof item.talla === "string" ? item.talla : undefined;
    const talla = producto.tallas.find((t) => t.nombre === tallaNombre);
    const extra = talla?.extra ?? 0;
    const precio = base + extra;
    subtotal += precio * cantidad;
    lineas.push({ productoId: producto.id, nombre: producto.nombre, talla: tallaNombre, cantidad, precio });
  }

  const impuesto = subtotal * IVA;
  const total = subtotal + impuesto + ENVIO;

  // Crear el pedido en estado PENDIENTE. El stock se valida aquí y se descuenta
  // al momento del pago (Stripe webhook) o de forma simulada si no hay Stripe.
  let pedidoId = "";
  let error: string | null = null;
  try {
    pedidoId = await prisma.$transaction(async (tx) => {
      for (const l of lineas) {
        const actual = await tx.producto.findUnique({
          where: { id: l.productoId },
          select: { nombre: true, stock: true }
        });
        if (!actual || actual.stock < l.cantidad) {
          throw new Error(`Stock insuficiente para ${actual?.nombre ?? l.productoId}.`);
        }
        if (l.talla) {
          const talla = await tx.talla.findFirst({
            where: { productoId: l.productoId, nombre: l.talla }
          });
          if (talla && talla.stock < l.cantidad) {
            throw new Error(`Stock insuficiente en la talla ${l.talla} de ${actual.nombre}.`);
          }
        }
      }

      const creado = await tx.pedido.create({
        data: {
          usuarioId: sesion.id,
          estado: "PENDIENTE",
          subtotal,
          impuesto,
          envio: ENVIO,
          total,
          direccionEnvio: direccionEnvio || "Por confirmar",
          metodoPago: metodoPago || (stripe ? "Tarjeta (Stripe)" : "Pago simulado"),
          detalles: {
            create: lineas.map((l) => ({
              productoId: l.productoId,
              cantidad: l.cantidad,
              precioUnitario: l.precio,
              tipoPrecio: esDistribuidor ? "DISTRIBUIDOR" : "MINORISTA",
              talla: l.talla
            }))
          }
        }
      });
      return creado.id;
    });
  } catch (e) {
    error = e instanceof Error ? e.message : "No fue posible procesar el pedido.";
  }
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // 1) Pago real con Stripe (si está configurado).
  if (stripe) {
    try {
      const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const itemsPago: Stripe.Checkout.SessionCreateParams.LineItem[] = lineas.map((l) => ({
        price_data: {
          currency: "mxn",
          product_data: { name: l.talla ? `${l.nombre} (${l.talla})` : l.nombre },
          unit_amount: Math.round(l.precio * 100)
        },
        quantity: l.cantidad
      }));
      // Se agregan IVA y envío para que Stripe cobre el total exacto del pedido.
      itemsPago.push({
        price_data: { currency: "mxn", product_data: { name: "IVA (16%)" }, unit_amount: Math.round(impuesto * 100) },
        quantity: 1
      });
      itemsPago.push({
        price_data: { currency: "mxn", product_data: { name: "Envío" }, unit_amount: Math.round(ENVIO * 100) },
        quantity: 1
      });

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: sesion.email,
        line_items: itemsPago,
        metadata: { pedidoId },
        success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/checkout`
      });

      return NextResponse.json({ ok: true, pedidoId, url: session.url });
    } catch (e) {
      console.error("[pedidos] Error al crear sesión de Stripe:", e);
      return NextResponse.json({ error: "No se pudo iniciar el pago con Stripe." }, { status: 500 });
    }
  }

  // 2) Fallback: pago simulado (para desarrollo sin claves de Stripe).
  try {
    const resultado = await completarPedido(pedidoId);
    return NextResponse.json({ ok: true, pedidoId, factura: resultado.numero });
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : "No fue posible procesar el pedido.";
    return NextResponse.json({ error: mensaje }, { status: 400 });
  }
}
