import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { formatoMoneda } from "@/lib/format";

export default async function DetallePedido({ params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();
  const pedido = await prisma.pedido.findUnique({
    where: { id: params.id },
    include: { detalles: { include: { producto: true } }, factura: true }
  });

  if (!pedido || pedido.usuarioId !== sesion!.id) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedido {pedido.id.slice(-6).toUpperCase()}</h1>
        {pedido.factura && (
          <a href={`/api/facturas/${pedido.factura.id}/pdf`} className="btn-secundario">
            <Download className="h-4 w-4" /> Descargar factura (PDF)
          </a>
        )}
      </div>

      <div className="tarjeta p-6">
        <p className="text-sm text-gray-500">Estado</p>
        <span className="etiqueta bg-green-100 text-green-700">{pedido.estado}</span>
        <p className="mt-3 text-sm text-gray-500">Envío a</p>
        <p className="text-sm">{pedido.direccionEnvio || "—"}</p>
        {pedido.factura && (
          <p className="mt-3 text-sm text-gray-500">
            Factura: <span className="font-semibold">{pedido.factura.numero}</span>
          </p>
        )}
      </div>

      <div className="tarjeta p-6">
        <h2 className="mb-4 font-bold">Productos</h2>
        <ul className="divide-y divide-gray-100">
          {pedido.detalles.map((d) => (
            <li key={d.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{d.producto.nombre}</p>
                <p className="text-xs text-gray-500">
                  {d.cantidad} × {formatoMoneda(d.precioUnitario)}
                  {d.talla ? ` · Talla ${d.talla}` : ""} · {d.tipoPrecio === "DISTRIBUIDOR" ? "Precio distribuidor" : "Precio minorista"}
                </p>
              </div>
              <span className="font-semibold">{formatoMoneda(d.precioUnitario * d.cantidad)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatoMoneda(pedido.subtotal)}</span></div>
          <div className="flex justify-between"><span>IVA</span><span>{formatoMoneda(pedido.impuesto)}</span></div>
          <div className="flex justify-between"><span>Envío</span><span>{formatoMoneda(pedido.envio)}</span></div>
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatoMoneda(pedido.total)}</span></div>
        </div>
      </div>

      <Link href="/cuenta/pedidos" className="text-sm text-[var(--color-primario)] hover:underline">← Volver a mis pedidos</Link>
    </div>
  );
}
