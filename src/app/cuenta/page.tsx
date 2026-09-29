import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { formatoMoneda } from "@/lib/format";

export default async function CuentaResumen() {
  const sesion = await obtenerSesion();
  const [pedidos, usuario] = await Promise.all([
    prisma.pedido.findMany({
      where: { usuarioId: sesion!.id },
      orderBy: { creadoEn: "desc" },
      take: 5
    }),
    prisma.usuario.findUnique({ where: { id: sesion!.id } })
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="tarjeta p-6">
          <p className="text-sm text-gray-500">Total de pedidos</p>
          <p className="text-3xl font-bold">{pedidos.length}</p>
        </div>
        <div className="tarjeta p-6">
          <p className="text-sm text-gray-500">Rol de cuenta</p>
          <p className="text-xl font-bold">
            {usuario?.rol === "DISTRIBUIDOR" ? "Distribuidor" : "Cliente estándar"}
          </p>
        </div>
        <div className="tarjeta p-6">
          <p className="text-sm text-gray-500">Último pedido</p>
          <p className="text-xl font-bold">
            {pedidos[0] ? formatoMoneda(pedidos[0].total) : "—"}
          </p>
        </div>
      </div>

      <div className="tarjeta p-6">
        <h2 className="mb-4 font-bold">Pedidos recientes</h2>
        {pedidos.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no tienes pedidos.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {pedidos.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                <span>Pedido {p.id.slice(-6).toUpperCase()}</span>
                <span className="text-gray-500">{new Date(p.creadoEn).toLocaleDateString("es-MX")}</span>
                <span className="font-semibold">{formatoMoneda(p.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
