import { obtenerConfiguracion } from "@/lib/settings";
import { FormularioConfiguracion } from "@/components/admin/formulario-configuracion";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracion() {
  const config = await obtenerConfiguracion();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configuración del sitio</h1>
      <FormularioConfiguracion config={config} />
    </div>
  );
}
