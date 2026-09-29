import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatoMoneda } from "@/lib/format";
import { BotonEliminar } from "@/components/admin/boton-eliminar";

export const dynamic = "force-dynamic";

export default async function AdminProductos() {
  const productos = await prisma.producto.findMany({ orderBy: { creadoEn: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link href="/admin/productos/nuevo" className="btn-primario">
          <Plus className="h-4 w-4" /> Nuevo producto
        </Link>
      </div>

      <div className="tarjeta overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="p-3">Producto</th>
              <th className="p-3">P. minorista</th>
              <th className="p-3">P. distribuidor</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-b border-gray-100">
                <td className="p-3 font-medium">{p.nombre}</td>
                <td className="p-3">{formatoMoneda(p.precioMinorista)}</td>
                <td className="p-3">{formatoMoneda(p.precioDistribuidor)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <span className={`etiqueta ${p.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <Link href={`/admin/productos/${p.id}`} className="rounded-md p-2 text-gray-400 hover:bg-gray-50 hover:text-[var(--color-secundario)]">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <BotonEliminar url={`/api/admin/productos/${p.id}`} mensaje={`¿Eliminar "${p.nombre}"?`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
