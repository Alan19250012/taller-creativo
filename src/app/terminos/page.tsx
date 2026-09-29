import type { Metadata } from "next";
import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";
import { obtenerConfiguracion } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso y venta del Taller Creativo EK.",
  alternates: { canonical: "/terminos" },
  robots: { index: true, follow: true }
};

export default async function Terminos() {
  const config = await obtenerConfiguracion().catch(() => ({} as Record<string, string>));
  const nombre = config.nombre_empresa || "Taller Creativo EK";

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="contenedor flex-1 py-10">
        <article className="prose mx-auto max-w-3xl text-gray-700">
          <h1 className="text-3xl font-bold text-gray-900">Términos y Condiciones</h1>
          <p className="text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString("es-MX")}</p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar este sitio web de {nombre}, usted acepta estos términos y condiciones. Si no está de
            acuerdo, le pedimos no utilizar el sitio.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">2. Uso del sitio y cuentas</h2>
          <p>
            Para comprar es necesario crear una cuenta con información veraz. La cuenta es personal e intransferible.
            El rol de &ldquo;distribuidor&rdquo; (con precio preferente) es asignado exclusivamente por el
            administrador y no puede auto-gestionarse.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">3. Precios y pagos</h2>
          <p>
            Los precios se muestran en pesos mexicanos (MXN) e incluyen el IVA correspondiente. El precio aplicado
            depende del rol de la cuenta (minorista o distribuidor). El pago se procesa mediante pasarelas de pago
            seguras; {nombre} no almacena datos completos de tarjetas.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">4. Envíos y entregas</h2>
          <p>
            El plazo de entrega depende de la personalización del producto y de la zona de envío. El cliente es
            responsable de proporcionar una dirección de entrega correcta y completa.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">5. Devoluciones</h2>
          <p>
            Por tratarse de productos personalizados, no se aceptan devoluciones salvo defectos de fabricación o error
            imputable a {nombre}, en cuyo caso se atenderá la reposición conforme a la legislación aplicable.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">6. Propiedad intelectual</h2>
          <p>
            Todo el contenido del sitio (textos, imágenes, logotipos y diseño) es propiedad de {nombre} o de sus
            licenciantes y está protegido por la legislación de propiedad intelectual.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">7. Limitación de responsabilidad</h2>
          <p>
            {nombre} no será responsable por daños indirectos o incidentales derivados del uso del sitio, ni por
            interrupciones del servicio ajenas a su control.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">8. Legislación aplicable</h2>
          <p>
            Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier controversia, las
            partes se someten a la jurisdicción de los tribunales competentes.
          </p>
        </article>
      </main>
      <Pie />
    </div>
  );
}
