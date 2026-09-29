import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { FormularioBanner } from "@/components/admin/formulario-banner";

export default async function EditarBanner({ params }: { params: { id: string } }) {
  const banner = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!banner) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar banner</h1>
      <FormularioBanner
        banner={{
          id: banner.id,
          titulo: banner.titulo,
          subtitulo: banner.subtitulo,
          imagen: banner.imagen,
          enlace: banner.enlace,
          orden: banner.orden,
          activo: banner.activo
        }}
      />
    </div>
  );
}
