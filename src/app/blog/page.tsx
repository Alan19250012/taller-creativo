import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";
import { Revelar } from "@/components/tienda/revelar";
import { formatoFecha } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Ideas, guías y novedades sobre regalos personalizados del Taller Creativo EK.",
  alternates: { canonical: "/blog" }
};

export default async function Blog() {
  const articulos = await prisma.articulo.findMany({
    where: { publicado: true },
    orderBy: { creadoEn: "desc" }
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="contenedor flex-1 py-8">
        <Revelar>
          <h1 className="mb-8 text-3xl font-bold">Blog</h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articulos.map((a) => (
              <Link key={a.id} href={`/blog/${a.slug}`} className="tarjeta overflow-hidden transition hover:shadow-md">
                <div className="flex h-48 items-center justify-center bg-[var(--color-secundario)]/10 text-5xl">
                  {a.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.imagen} alt={a.titulo} className="h-full w-full object-cover" />
                  ) : (
                    "📝"
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400">{formatoFecha(a.creadoEn)}</p>
                  <h2 className="mt-1 font-bold">{a.titulo}</h2>
                  {a.resumen && <p className="mt-2 line-clamp-3 text-sm text-gray-600">{a.resumen}</p>}
                </div>
              </Link>
            ))}
          </div>
        </Revelar>
        {articulos.length === 0 && (
          <div className="tarjeta p-16 text-center text-gray-500">No hay publicaciones todavía.</div>
        )}
      </main>
      <Pie />
    </div>
  );
}
