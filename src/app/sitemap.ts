import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.6 }
  ];

  try {
    const [productos, categorias, articulos] = await Promise.all([
      prisma.producto.findMany({ where: { activo: true }, select: { slug: true, creadoEn: true } }),
      prisma.categoria.findMany({ where: { activo: true }, select: { slug: true } }),
      prisma.articulo.findMany({ where: { publicado: true }, select: { slug: true, actualizadoEn: true } })
    ]);

    for (const p of productos) {
      urls.push({
        url: `${base}/producto/${p.slug}`,
        lastModified: p.creadoEn,
        changeFrequency: "weekly",
        priority: 0.7
      });
    }
    for (const c of categorias) {
      urls.push({ url: `${base}/categoria/${c.slug}`, changeFrequency: "weekly", priority: 0.6 });
    }
    for (const a of articulos) {
      urls.push({
        url: `${base}/blog/${a.slug}`,
        lastModified: a.actualizadoEn,
        changeFrequency: "monthly",
        priority: 0.5
      });
    }
  } catch (e) {
    // Si la BD no está disponible (p. ej. build de Vercel sin conexión),
    // se sirve al menos el sitemap básico con las rutas estáticas.
    console.error("[sitemap] No se pudo leer la BD:", e);
  }

  return urls;
}
