import type { Metadata } from "next";
import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";
import { obtenerConfiguracion } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad del Taller Creativo EK. Protección de datos personales conforme a la LFPDPPP.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true }
};

export default async function AvisoPrivacidad() {
  const config = await obtenerConfiguracion().catch(() => ({} as Record<string, string>));
  const nombre = config.nombre_empresa || "Taller Creativo EK";

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="contenedor flex-1 py-10">
        <article className="prose mx-auto max-w-3xl text-gray-700">
          <h1 className="text-3xl font-bold text-gray-900">Aviso de Privacidad</h1>
          <p className="text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString("es-MX")}</p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">1. Responsable del tratamiento de datos</h2>
          <p>
            {nombre} (en adelante, &ldquo;el Responsable&rdquo;) es responsable del tratamiento de los datos
            personales que nos proporcione, con domicilio en México y correo de contacto{" "}
            {config.correo || "contacto@tallercreativoek.com"}.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">2. Datos personales que recabamos</h2>
          <p>Para prestar nuestros servicios recabamos: nombre completo, correo electrónico, teléfono, dirección de envío y, en su caso, datos de facturación.</p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">3. Finalidades del tratamiento</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Registrar su cuenta y gestionar su perfil (cliente estándar o distribuidor).</li>
            <li>Procesar pedidos, envíos, pagos y la emisión de facturas.</li>
            <li>Atender solicitudes de soporte, quejas y devoluciones.</li>
            <li>Enviar notificaciones transaccionales (confirmación de compra, estado del pedido).</li>
            <li>Cumplir obligaciones fiscales y legales aplicables.</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">4. Derechos ARCO</h2>
          <p>
            Usted tiene derecho a <strong>Acceder, Rectificar, Cancelar y Oponerse</strong> al tratamiento de sus
            datos personales, así como a revocar el consentimiento otorgado. Puede ejercerlos enviando una solicitud
            a <a className="text-[var(--color-primario)] hover:underline" href={`mailto:${config.correo || "contacto@tallercreativoek.com"}`}>{config.correo || "contacto@tallercreativoek.com"}</a>.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">5. Transferencias de datos</h2>
          <p>
            Sus datos no se venden ni se transfieren a terceros, salvo a los proveedores necesarios para operar el
            servicio (pasarelas de pago, servicios de mensajería y plataformas de correo), siempre bajo las medidas de
            seguridad adecuadas y conforme a la legislación aplicable.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">6. Seguridad de la información</h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger sus datos: cifrado de contraseñas, transmisión
            segura mediante HTTPS y control de acceso basado en roles.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">7. Cambios al aviso</h2>
          <p>
            Cualquier modificación a este aviso se publicará en esta misma página. El uso continuado del sitio implica
            la aceptación de los términos actualizados.
          </p>
        </article>
      </main>
      <Pie />
    </div>
  );
}
