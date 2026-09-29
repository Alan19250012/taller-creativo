import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { FormularioProducto } from "@/components/admin/formulario-producto";

export default async function EditarProducto({ params }: { params: { id: string } }) {
  const [producto, categorias, subcategorias] = await Promise.all([
    prisma.producto.findUnique({
      where: { id: params.id },
      include: { tallas: true, categorias: true, subcategorias: true }
    }),
    prisma.categoria.findMany({ orderBy: { nombre: "asc" } }),
    prisma.subcategoria.findMany({ orderBy: { nombre: "asc" } })
  ]);

  if (!producto) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar producto</h1>
      <FormularioProducto
        producto={{
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          numeroArticulo: producto.numeroArticulo,
          color: producto.color,
          precioMinorista: producto.precioMinorista,
          precioDistribuidor: producto.precioDistribuidor,
          stock: producto.stock,
          destacado: producto.destacado,
          nuevo: producto.nuevo,
          liquidacion: producto.liquidacion,
          activo: producto.activo,
          imagen: producto.imagen,
          categorias: producto.categorias.map((c) => ({ id: c.id })),
          subcategorias: producto.subcategorias.map((s) => ({ id: s.id })),
          tallas: producto.tallas.map((t) => ({ nombre: t.nombre, stock: t.stock, extra: t.extra }))
        }}
        categorias={categorias.map((c) => ({ id: c.id, nombre: c.nombre }))}
        subcategorias={subcategorias.map((s) => ({ id: s.id, nombre: s.nombre }))}
      />
    </div>
  );
}
