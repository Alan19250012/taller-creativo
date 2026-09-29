import { prisma } from "@/lib/db";
import { GestionCategorias } from "@/components/admin/gestion-categorias";

export const dynamic = "force-dynamic";

export default async function AdminCategorias() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { orden: "asc" },
    include: { subcategorias: { orderBy: { orden: "asc" } } }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categorías y subcategorías</h1>
      <p className="text-sm text-gray-500">
        Edita el nombre (haz clic fuera del campo), activa/desactiva o elimina categorías y subcategorías.
      </p>
      <GestionCategorias
        categorias={categorias.map((c) => ({
          id: c.id,
          nombre: c.nombre,
          activo: c.activo,
          subcategorias: c.subcategorias.map((s) => ({ id: s.id, nombre: s.nombre, activo: s.activo }))
        }))}
      />
    </div>
  );
}
