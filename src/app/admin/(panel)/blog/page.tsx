import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { BotonEliminar } from "@/components/admin/boton-eliminar";

export const dynamic = "force-dynamic";

export default async function AdminBlog() {
  const articulos = await prisma.articulo.findMany({ orderBy: { creadoEn: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog</h1>
        <Link href="/admin/blog/nuevo" className="btn-primario">
          <Plus className="h-4 w-4" /> Nuevo artículo
        </Link>
      </div>

      <div className="space-y-3">
        {articulos.map((a) => (
          <div key={a.id} className="tarjeta flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{a.titulo}</p>
              <p className="text-xs text-gray-500">{new Date(a.creadoEn).toLocaleDateString("es-MX")}</p>
            </div>
            <div className="flex items-center">
              <span className={`etiqueta mr-2 ${a.publicado ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {a.publicado ? "Publicado" : "Borrador"}
              </span>
              <Link href={`/admin/blog/${a.id}`} className="rounded-md p-2 text-gray-400 hover:bg-gray-50 hover:text-[var(--color-secundario)]">
                <Pencil className="h-4 w-4" />
              </Link>
              <BotonEliminar url={`/api/admin/articulos/${a.id}`} mensaje={`¿Eliminar "${a.titulo}"?`} />
            </div>
          </div>
        ))}
        {articulos.length === 0 && <p className="text-sm text-gray-500">No hay artículos.</p>}
      </div>
    </div>
  );
}
