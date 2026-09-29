import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { obtenerConfiguracion } from "@/lib/settings";
import { aTarjeta } from "@/lib/producto";
import { TarjetaProducto } from "@/components/tienda/tarjeta-producto";
import { CarruselBanners } from "@/components/tienda/carrusel-banners";
import { BarraLateral } from "@/components/tienda/barra-lateral";
import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";
import { Revelar } from "@/components/tienda/revelar";

export const dynamic = "force-dynamic";

export default async function Inicio() {
  const [sesion, destacados, tendencia, categorias, articulos, banners, subcategorias, config] =
    await Promise.all([
      obtenerSesion(),
      prisma.producto.findMany({ where: { activo: true, destacado: true }, take: 8 }),
      prisma.producto.findMany({ where: { activo: true }, orderBy: { vendidos: "desc" }, take: 8 }),
      prisma.categoria.findMany({
        where: { activo: true, esPrincipal: true },
        orderBy: { orden: "asc" },
        include: { subcategorias: { where: { activo: true }, orderBy: { orden: "asc" } } }
      }),
      prisma.articulo.findMany({ where: { publicado: true }, orderBy: { creadoEn: "desc" }, take: 3 }),
      prisma.banner.findMany({ where: { activo: true }, orderBy: { orden: "asc" } }),
      prisma.subcategoria.findMany({
        where: { activo: true },
        include: { productos: { where: { activo: true }, select: { vendidos: true } } }
      }),
      obtenerConfiguracion()
    ]);

  const rol = sesion?.rol ?? null;

  // Tendencias: subcategorías ordenadas por ventas de sus productos
  const tendenciasSidebar = subcategorias
    .map((s) => ({
      slug: s.slug,
      nombre: s.nombre,
      ventas: s.productos.reduce((acc, p) => acc + p.vendidos, 0)
    }))
    .sort((a, b) => b.ventas - a.ventas)
    .slice(0, 8);

  // Categorías de la barra lateral: desde la configuración o las 7 primeras
  let menuLateral: { categorias?: string[] } = {};
  try {
    menuLateral = JSON.parse(config.menu_lateral || "{}");
  } catch {
    menuLateral = {};
  }
  const categoriasSidebar = menuLateral.categorias?.length
    ? menuLateral.categorias
        .map((slug) => categorias.find((c) => c.slug === slug))
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
    : categorias.slice(0, 7);

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />

      <main className="flex-1">
        {/* Carrusel de banners (cambio automático) */}
        <CarruselBanners
          banners={banners.map((b) => ({
            id: b.id,
            titulo: b.titulo,
            subtitulo: b.subtitulo,
            imagen: b.imagen,
            enlace: b.enlace
          }))}
        />

        <div className="contenedor grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
          {/* Barra lateral */}
          <BarraLateral
            categorias={categoriasSidebar.map((c) => ({
              slug: c.slug,
              nombre: c.nombre,
              subcategorias: c.subcategorias.map((s) => ({ slug: s.slug, nombre: s.nombre }))
            }))}
            tendencias={tendenciasSidebar}
            destacados={destacados.slice(0, 4).map((p) => ({
              id: p.id,
              slug: p.slug,
              nombre: p.nombre,
              imagen: p.imagen,
              precioMinorista: p.precioMinorista,
              precioDistribuidor: p.precioDistribuidor
            }))}
            rol={rol}
          />

          {/* Contenido principal */}
          <div className="space-y-12">
            {/* Categorías */}
            <Revelar>
              <section>
                <h2 className="mb-6 text-2xl font-bold">Categorías principales</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
                  {categorias.slice(0, 10).map((c) => (
                    <Link
                      key={c.id}
                      href={`/categoria/${c.slug}`}
                      className="tarjeta flex min-h-[80px] items-center justify-center p-4 text-center font-semibold transition hover:border-[var(--color-primario)] hover:text-[var(--color-primario)]"
                    >
                      {c.nombre}
                    </Link>
                  ))}
                </div>
              </section>
            </Revelar>

            {/* Destacados */}
            <Revelar delay={0.1}>
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Productos destacados</h2>
                  <Link href="/catalogo?destacado=1" className="text-sm font-medium text-[var(--color-primario)] hover:underline">
                    Ver todos
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {destacados.map((p) => (
                    <TarjetaProducto key={p.id} producto={aTarjeta(p)} rol={rol} />
                  ))}
                </div>
              </section>
            </Revelar>

            {/* Tendencias / más vendidos */}
            <Revelar delay={0.1}>
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Los más vendidos</h2>
                  <Link href="/catalogo?orden=vendidos" className="text-sm font-medium text-[var(--color-primario)] hover:underline">
                    Ver todos
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {tendencia.map((p) => (
                    <TarjetaProducto key={p.id} producto={aTarjeta(p)} rol={rol} />
                  ))}
                </div>
              </section>
            </Revelar>

            {/* Blog */}
            {articulos.length > 0 && (
              <Revelar delay={0.1}>
                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Blog</h2>
                    <Link href="/blog" className="text-sm font-medium text-[var(--color-primario)] hover:underline">
                      Ver todos
                    </Link>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-3">
                    {articulos.map((a) => (
                      <Link key={a.id} href={`/blog/${a.slug}`} className="tarjeta overflow-hidden transition hover:shadow-md">
                        <div className="flex h-40 items-center justify-center bg-[var(--color-secundario)]/10 text-4xl">
                          {a.imagen ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={a.imagen} alt={a.titulo} className="h-full w-full object-cover" />
                          ) : (
                            "📝"
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold">{a.titulo}</h3>
                          {a.resumen && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{a.resumen}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              </Revelar>
            )}
          </div>
        </div>
      </main>

      <Pie />
    </div>
  );
}
