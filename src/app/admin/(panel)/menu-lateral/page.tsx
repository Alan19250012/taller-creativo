import { prisma } from "@/lib/db";
import { obtenerConfiguracion } from "@/lib/settings";
import { FormularioMenuLateral } from "@/components/admin/formulario-menu-lateral";

export const dynamic = "force-dynamic";

export default async function AdminMenuLateral() {
  const [categorias, config] = await Promise.all([
    prisma.categoria.findMany({ where: { activo: true, esPrincipal: true }, orderBy: { orden: "asc" } }),
    obtenerConfiguracion()
  ]);

  let menuLateral: { categorias?: string[]; mostrarTendencias?: boolean; mostrarDestacados?: boolean } = {};
  try {
    menuLateral = JSON.parse(config.menu_lateral || "{}");
  } catch {
    menuLateral = {};
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Menú lateral (barra de categorías)</h1>
      <FormularioMenuLateral
        categorias={categorias.map((c) => ({ slug: c.slug, nombre: c.nombre }))}
        config={{
          categorias: menuLateral.categorias ?? [],
          mostrarTendencias: menuLateral.mostrarTendencias !== false,
          mostrarDestacados: menuLateral.mostrarDestacados !== false
        }}
      />
    </div>
  );
}
