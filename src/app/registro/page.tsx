import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";
import { FormularioRegistro } from "@/components/tienda/formulario-registro";

export default function Registro() {
  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="contenedor flex flex-1 items-center justify-center py-16">
        <div className="tarjeta w-full max-w-md p-8">
          <h1 className="mb-6 text-2xl font-bold">Crear cuenta</h1>
          <FormularioRegistro />
        </div>
      </main>
      <Pie />
    </div>
  );
}
