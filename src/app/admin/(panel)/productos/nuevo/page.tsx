import { prisma } from "@/lib/db";
import { FormularioProducto } from "@/components/admin/formulario-producto";

export const dynamic = "force-dynamic";

export default async function NuevoProducto() {
  const [categorias, subcategorias] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { nombre: "asc" } }),
    prisma.subcategoria.findMany({ orderBy: { nombre: "asc" } })
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo producto</h1>
      <FormularioProducto
        categorias={categorias.map((c) => ({ id: c.id, nombre: c.nombre }))}
        subcategorias={subcategorias.map((s) => ({ id: s.id, nombre: s.nombre }))}
      />
    </div>
  );
}
