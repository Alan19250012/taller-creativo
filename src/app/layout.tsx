import type { Metadata, Viewport } from "next";
import "./globals.css";
import { obtenerConfiguracion } from "@/lib/settings";

const NOMBRE_DEFECTO = "Taller Creativo EK";
const DESCRIPCION_DEFECTO =
  "Tienda en línea de regalos personalizados y artículos creativos. Personaliza y compra en línea.";

function urlBase(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

// Lee la configuración de forma resiliente: si la BD no está disponible
// (por ejemplo durante el build de Vercel), devuelve valores por defecto
// en lugar de romper la compilación o el render.
async function configSegura(): Promise<Record<string, string>> {
  try {
    return await obtenerConfiguracion();
  } catch (e) {
    console.error("[layout] No se pudo leer la configuración (¿BD no disponible?):", e);
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await configSegura();
  const nombre = config.nombre_empresa || NOMBRE_DEFECTO;
  const favicon = config.favicon_url || "/favicon.svg";
  const base = new URL(urlBase());

  return {
    metadataBase: base,
    title: {
      default: nombre,
      template: `%s — ${nombre}`
    },
    description: DESCRIPCION_DEFECTO,
    keywords: [
      "regalos personalizados",
      "taller creativo",
      "artículos personalizados",
      "regalos de boda",
      "regalos para toda ocasión",
      "Halloween",
      "Navidad",
      "tienda en línea"
    ],
    applicationName: nombre,
    alternates: { canonical: "/" },
    icons: { icon: favicon, apple: "/logo.svg" },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: base,
      siteName: nombre,
      title: nombre,
      description: DESCRIPCION_DEFECTO,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: nombre }]
    },
    twitter: {
      card: "summary_large_image",
      title: nombre,
      description: DESCRIPCION_DEFECTO,
      images: ["/opengraph-image"]
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DA1D2A"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await configSegura();
  const primario = config.color_primario || "#DA1D2A";
  const secundario = config.color_secundario || "#244093";
  const nombre = config.nombre_empresa || NOMBRE_DEFECTO;

  const organizacion = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: nombre,
    url: urlBase(),
    logo: `${urlBase()}/logo.svg`,
    telephone: config.telefono1 || undefined,
    email: config.correo || undefined,
    sameAs: [config.facebook, config.instagram, config.pinterest, config.tiktok].filter(Boolean)
  };

  return (
    <html lang="es">
      <body
        style={
          {
            "--color-primario": primario,
            "--color-secundario": secundario
          } as React.CSSProperties
        }
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacion) }}
        />
        {children}
      </body>
    </html>
  );
}
