import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SlidersHorizontal, Home } from "lucide-react";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { aTarjeta } from "@/lib/producto";
import {
  leerFiltros,
  construirWhere,
  construirOrderBy,
  obtenerOpcionesFiltros
} from "@/lib/catalogo";
import type { Parametros, CategoriaFiltro } from "@/lib/catalogo";
import { TarjetaProducto } from "@/components/tienda/tarjeta-producto";
import { PanelFiltros } from "@/components/tienda/panel-filtros";
import { OrdenCatalogo } from "@/components/tienda/orden-catalogo";
import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categoria = await prisma.categoria.findUnique({
    where: { slug: params.slug },
    select: { nombre: true, descripcion: true, slug: true }
  });

  if (!categoria) {
    return { title: "Categoría no encontrada", robots: { index: false } };
  }

  return {
    title: categoria.nombre,
    description: categoria.descripcion || `Productos de la categoría ${categoria.nombre}.`,
    alternates: { canonical: `/categoria/${categoria.slug}` }
  };
}

export default async function Categoria({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: Parametros;
}) {
  const [categoria, sesion] = await Promise.all([
    prisma.categoria.findUnique({
      where: { slug: params.slug },
      include: { subcategorias: { where: { activo: true }, orderBy: { orden: "asc" } } }
    }),
    obtenerSesion()
  ]);

  if (!categoria) notFound();

  const esDistribuidor = sesion?.rol === "DISTRIBUIDOR" || sesion?.rol === "ADMINISTRADOR";
  const colPrecio = esDistribuidor ? "precioDistribuidor" : "precioMinorista";

  const filtros = leerFiltros(searchParams, params.slug);
  const where = construirWhere(filtros, colPrecio);
  const orderBy = construirOrderBy(filtros.orden, colPrecio);

  const [productos, total, opciones] = await Promise.all([
    prisma.producto.findMany({ where, orderBy, take: 60 }),
    prisma.producto.count({ where }),
    obtenerOpcionesFiltros(params.slug)
  ]);

  // Solo esta categoría para el desplegable de subcategorías del panel.
  const categoriasPanel: CategoriaFiltro[] = [
    {
      slug: categoria.slug,
      nombre: categoria.nombre,
      subcategorias: categoria.subcategorias.map((s) => ({ slug: s.slug, nombre: s.nombre }))
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />

      {/* Hero de categoría */}
      <section className="bg-gradient-to-r from-[var(--color-primario)] to-[var(--color-secundario)] text-white">
        <div className="contenedor px-4 py-8 sm:py-12">
          <nav className="mb-4 flex items-center gap-1.5 text-sm text-white/70">
            <Link href="/" className="flex items-center gap-1 hover:text-white">
              <Home className="h-3.5 w-3.5" /> Inicio
            </Link>
            <span>/</span>
            <span className="text-white">{categoria.nombre}</span>
          </nav>

          <h1 className="text-3xl font-bold sm:text-4xl">{categoria.nombre}</h1>
          {categoria.descripcion && (
            <p className="mt-3 max-w-2xl text-white/85">{categoria.descripcion}</p>
          )}
          <p className="mt-4 text-sm text-white/70">
            {total} producto{total === 1 ? "" : "s"}
          </p>

          {categoria.subcategorias.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/categoria/${categoria.slug}`}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[var(--color-primario)] transition hover:bg-white/90"
              >
                Todos
              </Link>
              {categoria.subcategorias.map((s) => (
                <Link
                  key={s.id}
                  href={`/categoria/${categoria.slug}?subcategoria=${s.slug}`}
                  className="rounded-full border border-white/40 px-4 py-1.5 text-sm text-white transition hover:bg-white/10"
                >
                  {s.nombre}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="contenedor flex-1 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filtros — escritorio */}
          <aside className="tarjeta hidden h-fit p-5 lg:block">
            <PanelFiltros
              base={`/categoria/${params.slug}`}
              categorias={categoriasPanel}
              colores={opciones.colores}
              tallas={opciones.tallas}
              ocultarCategoria
            />
          </aside>

          <div className="min-w-0">
            {/* Filtros — móvil */}
            <details className="group mb-5 lg:hidden">
              <summary className="btn-borde flex cursor-pointer list-none items-center justify-center gap-2 [&::-webkit-details-marker]:hidden">
                <SlidersHorizontal className="h-4 w-4" /> Filtros
              </summary>
              <div className="tarjeta mt-3 p-5">
                <PanelFiltros
                  base={`/categoria/${params.slug}`}
                  categorias={categoriasPanel}
                  colores={opciones.colores}
                  tallas={opciones.tallas}
                  ocultarCategoria
                />
              </div>
            </details>

            <OrdenCatalogo base={`/categoria/${params.slug}`} total={total} />

            {productos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {productos.map((p) => (
                  <TarjetaProducto key={p.id} producto={aTarjeta(p)} rol={sesion?.rol ?? null} />
                ))}
              </div>
            ) : (
              <div className="tarjeta flex flex-col items-center justify-center gap-2 p-16 text-center">
                <p className="text-3xl">📦</p>
                <p className="font-semibold">No hay productos con esos filtros</p>
                <p className="text-sm text-gray-500">
                  Prueba a quitar algún filtro o a elegir otra subcategoría.
                </p>
                <Link href={`/categoria/${params.slug}`} className="btn-primario mt-3">
                  Quitar filtros
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Pie />
    </div>
  );
}
