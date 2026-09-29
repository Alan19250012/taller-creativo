import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Taller Creativo EK",
    short_name: "Taller EK",
    description: "Tienda en línea de regalos personalizados y artículos creativos.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#DA1D2A",
    lang: "es",
    icons: [
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }
    ]
  };
}
