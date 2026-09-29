import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatoMoneda } from "@/lib/format";
import { Package, ShoppingBag, Users, DollarSign, AlertTriangle, Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [
    totalProductos,
    totalPedidos,
    totalClientes,
    ingresos,
    stockBajo,
    articulos,
    pedidosRecientes,
    pedidosCompletados,
    productosActivos
  ] = await Promise.all([
    prisma.producto.count(),
    prisma.pedido.count(),
    prisma.usuario.count({ where: { rol: { not: "ADMINISTRADOR" } } }),
    prisma.pedido.aggregate({ where: { estado: { in: ["PAGADO", "ENVIADO", "ENTREGADO", "EN_PREPARACION"] } }, _sum: { total: true } }),
    prisma.producto.count({ where: { stock: { lte: 5 } } }),
    prisma.articulo.count(),
    prisma.pedido.findMany({ orderBy: { creadoEn: "desc" }, take: 5, include: { usuario: true } }),
    prisma.pedido.count({ where: { estado: { in: ["PAGADO", "EN_PREPARACION", "ENVIADO", "ENTREGADO"] } } }),
    prisma.producto.findMany({
      where: { activo: true, precioMinorista: { gt: 0 } },
      select: { precioMinorista: true, precioDistribuidor: true }
    })
  ]);

  // ── KPIs calculados (competencia 15: herramientas matemáticas) ──
  const ingresosTotales = ingresos._sum.total ?? 0;
  const ticketPromedio = pedidosCompletados > 0 ? ingresosTotales / pedidosCompletados : 0;
  const margenBrutoPromedio =
    productosActivos.length > 0
      ? (productosActivos.reduce((acc, p) => acc + (p.precioMinorista - p.precioDistribuidor) / p.precioMinorista, 0) /
          productosActivos.length) *
        100
      : 0;
  const tasaCompletados = totalPedidos > 0 ? (pedidosCompletados / totalPedidos) * 100 : 0;

  const tarjetas = [
    { titulo: "Productos", valor: String(totalProductos), icono: Package, color: "text-[var(--color-primario)]" },
    { titulo: "Pedidos", valor: String(totalPedidos), icono: ShoppingBag, color: "text-[var(--color-secundario)]" },
    { titulo: "Clientes", valor: String(totalClientes), icono: Users, color: "text-green-600" },
    { titulo: "Ingresos", valor: formatoMoneda(ingresos._sum.total ?? 0), icono: DollarSign, color: "text-emerald-600" },
    { titulo: "Stock bajo", valor: String(stockBajo), icono: AlertTriangle, color: "text-amber-600" },
    { titulo: "Artículos de blog", valor: String(articulos), icono: Newspaper, color: "text-purple-600" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tarjetas.map((t) => (
          <div key={t.titulo} className="tarjeta flex items-center gap-4 p-5">
            <t.icono className={`h-8 w-8 ${t.color}`} />
            <div>
              <p className="text-sm text-gray-500">{t.titulo}</p>
              <p className="text-xl font-bold">{t.valor}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 font-bold">Indicadores de desempeño (KPIs)</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="tarjeta p-5">
            <p className="text-sm text-gray-500">Ticket promedio</p>
            <p className="text-2xl font-bold">{formatoMoneda(ticketPromedio)}</p>
            <p className="mt-1 text-xs text-gray-400">Ingresos ÷ pedidos completados</p>
          </div>
          <div className="tarjeta p-5">
            <p className="text-sm text-gray-500">Margen bruto promedio</p>
            <p className="text-2xl font-bold">{margenBrutoPromedio.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-gray-400">(minorista − distribuidor) ÷ minorista</p>
          </div>
          <div className="tarjeta p-5">
            <p className="text-sm text-gray-500">Pedidos completados</p>
            <p className="text-2xl font-bold">{tasaCompletados.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-gray-400">Completados ÷ total de pedidos</p>
          </div>
        </div>
      </div>

      <div className="tarjeta p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Pedidos recientes</h2>
          <Link href="/admin/pedidos" className="text-sm text-[var(--color-primario)] hover:underline">Ver todos</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2">Cliente</th>
              <th className="py-2">Fecha</th>
              <th className="py-2">Total</th>
              <th className="py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidosRecientes.map((p) => (
              <tr key={p.id} className="border-b border-gray-100">
                <td className="py-2">{p.usuario.nombre}</td>
                <td className="py-2">{new Date(p.creadoEn).toLocaleDateString("es-MX")}</td>
                <td className="py-2">{formatoMoneda(p.total)}</td>
                <td className="py-2">
                  <span className="etiqueta bg-gray-100 text-gray-700">{p.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
