import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { aTarjeta } from "@/lib/producto";
import { TarjetaProducto } from "@/components/tienda/tarjeta-producto";
import { FichaCompra } from "@/components/tienda/ficha-compra";
import { FormularioResena } from "@/components/tienda/formulario-resena";
import { Calificacion } from "@/components/tienda/calificacion";
import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";
import { Revelar } from "@/components/tienda/revelar";
import { formatoFecha } from "@/lib/format";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const producto = await prisma.producto.findUnique({
    where: { slug: params.slug },
    select: { nombre: true, descripcion: true, slug: true, imagen: true }
  });

  if (!producto) {
    return { title: "Producto no encontrado", robots: { index: false } };
  }

  const descripcion = producto.descripcion.slice(0, 160);
  return {
    title: producto.nombre,
    description: descripcion,
    alternates: { canonical: `/producto/${producto.slug}` },
    openGraph: {
      title: producto.nombre,
      description: descripcion,
      type: "website",
      images: producto.imagen ? [{ url: producto.imagen }] : undefined
    }
  };
}

export default async function Producto({ params }: { params: { slug: string } }) {
  const [producto, sesion] = await Promise.all([
    prisma.producto.findUnique({
      where: { slug: params.slug },
      include: {
        tallas: true,
        categorias: true,
        subcategorias: true,
        resenas: { where: { aprobada: true }, include: { usuario: true }, orderBy: { creadoEn: "desc" } }
      }
    }),
    obtenerSesion()
  ]);

  if (!producto || !producto.activo) notFound();

  const relacionados = await prisma.producto.findMany({
    where: {
      activo: true,
      id: { not: producto.id },
      subcategorias: { some: { id: { in: producto.subcategorias.map((s) => s.id) } } }
    },
    take: 4
  });

  const productoJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    image: producto.imagen ?? undefined,
    description: producto.descripcion,
    sku: producto.numeroArticulo,
    offers: {
      "@type": "Offer",
      priceCurrency: "MXN",
      price: producto.precioMinorista,
      availability: producto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    aggregateRating:
      producto.calificacion > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: producto.calificacion,
            reviewCount: producto.resenas.length
          }
        : undefined
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productoJsonLd) }}
      />
      <Encabezado />
      <main className="contenedor flex-1 py-8">
        {/* Migas de pan */}
        <nav className="mb-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-[var(--color-primario)]">Inicio</Link>
          {producto.categorias[0] && (
            <>
              {" / "}
              <Link href={`/categoria/${producto.categorias[0].slug}`} className="hover:text-[var(--color-primario)]">
                {producto.categorias[0].nombre}
              </Link>
            </>
          )}
          {" / "}
          <span className="text-gray-700">{producto.nombre}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Imagen */}
          <Revelar>
            <div className="tarjeta flex aspect-square items-center justify-center overflow-hidden bg-gray-100">
              {producto.imagen ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-400">Sin imagen</span>
              )}
            </div>
          </Revelar>

          {/* Información */}
          <div>
            <h1 className="text-3xl font-bold">{producto.nombre}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Calificacion valor={producto.calificacion} />
              <span className="text-sm text-gray-500">({producto.resenas.length} reseñas)</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Artículo #{producto.numeroArticulo}</p>

            <div className="mt-6">
              <FichaCompra
                producto={{
                  id: producto.id,
                  nombre: producto.nombre,
                  imagen: producto.imagen,
                  precioMinorista: producto.precioMinorista,
                  precioDistribuidor: producto.precioDistribuidor,
                  stock: producto.stock,
                  tallas: producto.tallas.map((t) => ({ nombre: t.nombre, stock: t.stock, extra: t.extra }))
                }}
                rol={sesion?.rol ?? null}
              />
            </div>

            <div className="mt-6">
              <h2 className="mb-2 font-semibold">Descripción</h2>
              <p className="whitespace-pre-line text-gray-700">{producto.descripcion}</p>
            </div>
          </div>
        </div>

        {/* Reseñas */}
        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-bold">Reseñas de clientes</h2>
            {producto.resenas.length > 0 ? (
              <div className="space-y-4">
                {producto.resenas.map((r) => (
                  <div key={r.id} className="tarjeta p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{r.usuario.nombre}</span>
                      <span className="text-xs text-gray-400">{formatoFecha(r.creadoEn)}</span>
                    </div>
                    <Calificacion valor={r.estrellas} className="mt-1" />
                    <p className="mt-2 text-sm text-gray-700">{r.comentario}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold">Deja tu reseña</h2>
            {sesion ? (
              <FormularioResena productoId={producto.id} />
            ) : (
              <p className="text-sm text-gray-500">
                <Link href="/login" className="text-[var(--color-primario)] hover:underline">Inicia sesión</Link> para dejar una reseña.
              </p>
            )}
          </div>
        </section>

        {/* Relacionados */}
        {relacionados.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold">También te puede interesar</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relacionados.map((p) => (
                <TarjetaProducto key={p.id} producto={aTarjeta(p)} rol={sesion?.rol ?? null} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Pie />
    </div>
  );
}
