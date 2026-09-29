import type { Metadata } from "next";
import { SlidersHorizontal } from "lucide-react";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { aTarjeta } from "@/lib/producto";
import {
  leerFiltros,
  construirWhere,
  construirOrderBy,
  obtenerOpcionesFiltros
} from "@/lib/catalogo";
import type { Parametros } from "@/lib/catalogo";
import { TarjetaProducto } from "@/components/tienda/tarjeta-producto";
import { PanelFiltros } from "@/components/tienda/panel-filtros";
import { OrdenCatalogo } from "@/components/tienda/orden-catalogo";
import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora todos los productos personalizados del Taller Creativo EK.",
  alternates: { canonical: "/catalogo" }
};

export default async function Catalogo({ searchParams }: { searchParams: Parametros }) {
  const filtros = leerFiltros(searchParams);

  const sesion = await obtenerSesion();
  const esDistribuidor = sesion?.rol === "DISTRIBUIDOR" || sesion?.rol === "ADMINISTRADOR";
  const colPrecio = esDistribuidor ? "precioDistribuidor" : "precioMinorista";

  const where = construirWhere(filtros, colPrecio);
  const orderBy = construirOrderBy(filtros.orden, colPrecio);

  const [productos, total, opciones] = await Promise.all([
    prisma.producto.findMany({ where, orderBy, take: 60 }),
    prisma.producto.count({ where }),
    obtenerOpcionesFiltros()
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="contenedor flex-1 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {filtros.q ? `Resultados para "${filtros.q}"` : "Catálogo"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {total} producto{total === 1 ? "" : "s"} disponible{total === 1 ? "" : "s"}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filtros — escritorio */}
          <aside className="tarjeta hidden h-fit p-5 lg:block">
            <PanelFiltros
              base="/catalogo"
              categorias={opciones.categorias}
              colores={opciones.colores}
              tallas={opciones.tallas}
            />
          </aside>

          <div className="min-w-0">
            {/* Filtros — móvil (plegables, sin JavaScript) */}
            <details className="group mb-5 lg:hidden">
              <summary className="btn-borde flex cursor-pointer list-none items-center justify-center gap-2 [&::-webkit-details-marker]:hidden">
                <SlidersHorizontal className="h-4 w-4" /> Filtros
              </summary>
              <div className="tarjeta mt-3 p-5">
                <PanelFiltros
                  base="/catalogo"
                  categorias={opciones.categorias}
                  colores={opciones.colores}
                  tallas={opciones.tallas}
                />
              </div>
            </details>

            <OrdenCatalogo base="/catalogo" total={total} />

            {productos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {productos.map((p) => (
                  <TarjetaProducto key={p.id} producto={aTarjeta(p)} rol={sesion?.rol ?? null} />
                ))}
              </div>
            ) : (
              <div className="tarjeta flex flex-col items-center justify-center gap-2 p-16 text-center">
                <p className="text-3xl">🔍</p>
                <p className="font-semibold">No se encontraron productos</p>
                <p className="text-sm text-gray-500">Prueba con otros filtros o términos de búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Pie />
    </div>
  );
}
