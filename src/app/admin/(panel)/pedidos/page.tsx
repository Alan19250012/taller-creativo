import { prisma } from "@/lib/db";
import { formatoMoneda } from "@/lib/format";
import { SelectorEstadoPedido } from "@/components/admin/selector-estado-pedido";

export const dynamic = "force-dynamic";

export default async function AdminPedidos() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { creadoEn: "desc" },
    include: { usuario: true, factura: true }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pedidos</h1>
      <div className="tarjeta overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="p-3">Cliente</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Total</th>
              <th className="p-3">Factura</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id} className="border-b border-gray-100">
                <td className="p-3">
                  <p className="font-medium">{p.usuario.nombre}</p>
                  <p className="text-xs text-gray-500">{p.usuario.email}</p>
                </td>
                <td className="p-3">{new Date(p.creadoEn).toLocaleDateString("es-MX")}</td>
                <td className="p-3">{formatoMoneda(p.total)}</td>
                <td className="p-3">
                  {p.factura ? (
                    <a href={`/api/facturas/${p.factura.id}/pdf`} className="text-[var(--color-primario)] hover:underline">
                      {p.factura.numero}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3">
                  <SelectorEstadoPedido pedidoId={p.id} estado={p.estado} />
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">No hay pedidos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
