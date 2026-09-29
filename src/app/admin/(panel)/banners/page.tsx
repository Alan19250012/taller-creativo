import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { BotonEliminar } from "@/components/admin/boton-eliminar";

export const dynamic = "force-dynamic";

export default async function AdminBanners() {
  const banners = await prisma.banner.findMany({ orderBy: { orden: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-sm text-gray-500">El carrusel de la portada cambia automáticamente cada 4 segundos.</p>
        </div>
        <Link href="/admin/banners/nuevo" className="btn-primario">
          <Plus className="h-4 w-4" /> Nuevo banner
        </Link>
      </div>

      <div className="space-y-3">
        {banners.map((b) => (
          <div key={b.id} className="tarjeta flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{b.titulo}</p>
              <p className="text-xs text-gray-500">
                {b.subtitulo || "Sin subtítulo"} · Orden {b.orden}
              </p>
            </div>
            <div className="flex items-center">
              <span className={`etiqueta mr-2 ${b.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {b.activo ? "Activo" : "Inactivo"}
              </span>
              <Link href={`/admin/banners/${b.id}`} className="rounded-md p-2 text-gray-400 hover:bg-gray-50 hover:text-[var(--color-secundario)]">
                <Pencil className="h-4 w-4" />
              </Link>
              <BotonEliminar url={`/api/admin/banners/${b.id}`} mensaje={`¿Eliminar "${b.titulo}"?`} />
            </div>
          </div>
        ))}
        {banners.length === 0 && <p className="text-sm text-gray-500">No hay banners. Crea uno.</p>}
      </div>
    </div>
  );
}
