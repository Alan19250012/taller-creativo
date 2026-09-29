import { prisma } from "./db";
import { obtenerConfiguracion } from "./settings";
import { generarFacturaPDF } from "./factura";
import { enviarCorreo } from "./correo";
import { formatoFechaCorta } from "./format";

// Completa un pedido en estado PENDIENTE: valida y descuenta stock, lo marca
// PAGADO, emite la factura y envía el PDF por correo. Es idempotente (si el
// pedido ya está PAGADO no repite el trabajo).
export async function completarPedido(pedidoId: string): Promise<{ numero: string; ok: boolean }> {
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: { detalles: { include: { producto: true } }, usuario: true, factura: true }
  });

  if (!pedido) throw new Error("Pedido no encontrado.");
  if (pedido.estado === "PAGADO") {
    return { numero: pedido.factura?.numero ?? "", ok: true };
  }

  let numero = "";
  try {
    numero = await prisma.$transaction(async (tx) => {
      // Revalidar stock dentro de la transacción (evita vender más de lo disponible).
      for (const d of pedido.detalles) {
        const actual = await tx.producto.findUnique({
          where: { id: d.productoId },
          select: { nombre: true, stock: true }
        });
        if (!actual || actual.stock < d.cantidad) {
          throw new Error(`Stock insuficiente para ${actual?.nombre ?? d.productoId}.`);
        }
        if (d.talla) {
          const talla = await tx.talla.findFirst({
            where: { productoId: d.productoId, nombre: d.talla }
          });
          if (talla && talla.stock < d.cantidad) {
            throw new Error(`Stock insuficiente en la talla ${d.talla} de ${actual.nombre}.`);
          }
        }
      }

      // Descontar stock global y por talla, y sumar vendidos.
      for (const d of pedido.detalles) {
        await tx.producto.update({
          where: { id: d.productoId },
          data: { stock: { decrement: d.cantidad }, vendidos: { increment: d.cantidad } }
        });
        if (d.talla) {
          await tx.talla.updateMany({
            where: { productoId: d.productoId, nombre: d.talla },
            data: { stock: { decrement: d.cantidad } }
          });
        }
      }

      const numeroFactura = `EK-${new Date().getFullYear()}-${pedidoId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
      await tx.factura.create({ data: { numero: numeroFactura, pedidoId } });
      await tx.pedido.update({ where: { id: pedidoId }, data: { estado: "PAGADO" } });
      return numeroFactura;
    });
  } catch (e) {
    console.error("[completar-pedido] Error al completar el pedido:", e);
    throw e;
  }

  // Generar y enviar la factura PDF.
  const config = await obtenerConfiguracion();
  const pdf = await generarFacturaPDF({
    numero,
    empresa: config.nombre_empresa || "Taller Creativo EK",
    telefono: config.telefono1 || "-",
    correo: config.correo || "-",
    cliente: pedido.usuario.nombre,
    emailCliente: pedido.usuario.email,
    direccionEnvio: pedido.direccionEnvio || "-",
    fecha: formatoFechaCorta(pedido.creadoEn),
    subtotal: pedido.subtotal,
    impuesto: pedido.impuesto,
    envio: pedido.envio,
    total: pedido.total,
    items: pedido.detalles.map((d) => ({
      nombre: d.producto.nombre,
      talla: d.talla,
      cantidad: d.cantidad,
      precio: d.precioUnitario,
      tipo: d.tipoPrecio
    }))
  });

  await enviarCorreo({
    para: pedido.usuario.email,
    asunto: `Tu factura ${numero} — ${config.nombre_empresa || "Taller Creativo EK"}`,
    html: `<h2>¡Gracias por tu compra!</h2><p>Hola ${pedido.usuario.nombre}, adjuntamos tu factura ${numero}.</p><p>Puedes descargarla también desde tu cuenta.</p>`,
    adjuntos: [{ nombre: `${numero}.pdf`, contenido: pdf }]
  });

  return { numero, ok: true };
}
