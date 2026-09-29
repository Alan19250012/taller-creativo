import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { obtenerConfiguracion } from "@/lib/settings";
import { generarFacturaPDF } from "@/lib/factura";
import { formatoFechaCorta } from "@/lib/format";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();
  const factura = await prisma.factura.findUnique({
    where: { id: params.id },
    include: { pedido: { include: { detalles: { include: { producto: true } }, usuario: true } } }
  });

  if (!factura) {
    return NextResponse.json({ error: "Factura no encontrada." }, { status: 404 });
  }

  // Solo el dueño del pedido o un administrador pueden descargarla
  if (sesion?.id !== factura.pedido.usuarioId && sesion?.rol !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const config = await obtenerConfiguracion();
  const pdf = await generarFacturaPDF({
    numero: factura.numero,
    empresa: config.nombre_empresa || "Taller Creativo EK",
    telefono: config.telefono1 || "-",
    correo: config.correo || "-",
    cliente: factura.pedido.usuario.nombre,
    emailCliente: factura.pedido.usuario.email,
    direccionEnvio: factura.pedido.direccionEnvio || "-",
    fecha: formatoFechaCorta(factura.pedido.creadoEn),
    subtotal: factura.pedido.subtotal,
    impuesto: factura.pedido.impuesto,
    envio: factura.pedido.envio,
    total: factura.pedido.total,
    items: factura.pedido.detalles.map((d) => ({
      nombre: d.producto.nombre,
      talla: d.talla,
      cantidad: d.cantidad,
      precio: d.precioUnitario,
      tipo: d.tipoPrecio
    }))
  });

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${factura.numero}.pdf"`
    }
  });
}
