import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";
import { FormularioLogin } from "@/components/tienda/formulario-login";

export default function Login({
  searchParams
}: {
  searchParams: { redirect?: string; registrado?: string };
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="contenedor flex flex-1 items-center justify-center py-16">
        <div className="tarjeta w-full max-w-md p-8">
          <h1 className="mb-6 text-2xl font-bold">Iniciar sesión</h1>
          {searchParams.registrado === "1" && (
            <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              ¡Cuenta creada! Ya puedes iniciar sesión.
            </p>
          )}
          <FormularioLogin redirect={searchParams.redirect} />
        </div>
      </main>
      <Pie />
    </div>
  );
}
