import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";
import { formatoFecha } from "@/lib/format";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const articulo = await prisma.articulo.findUnique({
    where: { slug: params.slug },
    select: { titulo: true, resumen: true, slug: true, imagen: true, publicado: true }
  });

  if (!articulo || !articulo.publicado) {
    return { title: "Artículo no encontrado", robots: { index: false } };
  }

  return {
    title: articulo.titulo,
    description: articulo.resumen || articulo.titulo,
    alternates: { canonical: `/blog/${articulo.slug}` },
    openGraph: {
      title: articulo.titulo,
      description: articulo.resumen || articulo.titulo,
      type: "article",
      images: articulo.imagen ? [{ url: articulo.imagen }] : undefined
    }
  };
}

export default async function ArticuloBlog({ params }: { params: { slug: string } }) {
  const articulo = await prisma.articulo.findUnique({ where: { slug: params.slug } });
  if (!articulo || !articulo.publicado) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="contenedor flex-1 py-8">
        <nav className="mb-4 text-sm text-gray-500">
          <Link href="/blog" className="hover:text-[var(--color-primario)]">Blog</Link>
          {" / "}
          <span className="text-gray-700">{articulo.titulo}</span>
        </nav>

        <article className="mx-auto max-w-3xl">
          <p className="text-sm text-gray-400">{formatoFecha(articulo.creadoEn)}</p>
          <h1 className="mt-2 text-4xl font-bold">{articulo.titulo}</h1>
          {articulo.imagen && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={articulo.imagen} alt={articulo.titulo} className="mt-6 w-full rounded-xl object-cover" />
          )}
          <div className="prose mt-8 max-w-none whitespace-pre-line text-gray-700">{articulo.contenido}</div>
        </article>
      </main>
      <Pie />
    </div>
  );
}
