import Link from "next/link";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { formatoMoneda } from "@/lib/format";

export default async function MisPedidos() {
  const sesion = await obtenerSesion();
  const pedidos = await prisma.pedido.findMany({
    where: { usuarioId: sesion!.id },
    orderBy: { creadoEn: "desc" },
    include: { factura: true, detalles: true }
  });

  if (pedidos.length === 0) {
    return (
      <div className="tarjeta p-16 text-center text-gray-500">
        Aún no tienes pedidos. <Link href="/catalogo" className="text-[var(--color-primario)] hover:underline">Explora el catálogo</Link>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mis pedidos</h1>
      {pedidos.map((p) => (
        <Link key={p.id} href={`/cuenta/pedidos/${p.id}`} className="tarjeta block p-5 transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Pedido {p.id.slice(-6).toUpperCase()}</p>
              <p className="text-sm text-gray-500">{new Date(p.creadoEn).toLocaleDateString("es-MX")}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{formatoMoneda(p.total)}</p>
              <span className={`etiqueta ${
                p.estado === "PAGADO" ? "bg-green-100 text-green-700" :
                p.estado === "CANCELADO" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
              }`}>
                {p.estado}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
