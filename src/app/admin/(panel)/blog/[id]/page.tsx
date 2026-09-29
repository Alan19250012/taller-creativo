import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { FormularioArticulo } from "@/components/admin/formulario-articulo";

export default async function EditarArticulo({ params }: { params: { id: string } }) {
  const articulo = await prisma.articulo.findUnique({ where: { id: params.id } });
  if (!articulo) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar artículo</h1>
      <FormularioArticulo
        articulo={{
          id: articulo.id,
          titulo: articulo.titulo,
          resumen: articulo.resumen,
          contenido: articulo.contenido,
          imagen: articulo.imagen,
          publicado: articulo.publicado
        }}
      />
    </div>
  );
}
