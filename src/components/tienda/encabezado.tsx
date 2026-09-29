import Link from "next/link";
import { Search, Phone, Mail } from "lucide-react";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";
import { obtenerConfiguracion } from "@/lib/settings";
import { IndicadorCarrito } from "./indicador-carrito";
import { MenuUsuario } from "./menu-usuario";
import { BarraCategorias } from "./barra-categorias";

export async function Encabezado() {
  const [sesion, config, categorias] = await Promise.all([
    obtenerSesion(),
    obtenerConfiguracion(),
    prisma.categoria.findMany({
      where: { activo: true, esPrincipal: true },
      orderBy: { orden: "asc" },
      take: 11,
      include: { subcategorias: { where: { activo: true }, orderBy: { orden: "asc" } } }
    })
  ]);

  const logo = config.logo_url || "/logo.svg";
  const nombre = config.nombre_empresa || "Taller Creativo EK";

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Barra superior de contacto */}
      <div className="bg-[var(--color-secundario)] text-white">
        <div className="contenedor flex items-center justify-between py-1.5 text-xs">
          <div className="flex items-center gap-4">
            {config.telefono1 && (
              <a href={`tel:${config.telefono1}`} className="flex items-center gap-1 hover:underline">
                <Phone className="h-3 w-3" /> {config.telefono1}
              </a>
            )}
            {config.correo && (
              <a href={`mailto:${config.correo}`} className="hidden items-center gap-1 hover:underline sm:flex">
                <Mail className="h-3 w-3" /> {config.correo}
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            {config.facebook && (
              <a href={config.facebook} target="_blank" rel="noreferrer" className="hover:underline">Facebook</a>
            )}
            {config.instagram && (
              <a href={config.instagram} target="_blank" rel="noreferrer" className="hidden hover:underline sm:inline">Instagram</a>
            )}
            {config.whatsapp && (
              <a href={config.whatsapp} target="_blank" rel="noreferrer" className="hover:underline">WhatsApp</a>
            )}
          </div>
        </div>
      </div>

      {/* Cabecera principal */}
      <div className="contenedor flex items-center gap-4 py-3">
        <Link href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={nombre} className="h-12 w-auto" />
        </Link>

        <form action="/catalogo" className="mx-auto hidden w-full max-w-xl flex-1 md:block">
          <div className="relative">
            <input
              type="search"
              name="q"
              placeholder="Buscar productos…"
              className="input pr-10"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--color-primario)]">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <MenuUsuario sesion={sesion} />
          <IndicadorCarrito />
        </div>
      </div>

      <BarraCategorias
        categorias={categorias.map((c) => ({
          nombre: c.nombre,
          slug: c.slug,
          subcategorias: c.subcategorias.map((s) => ({ nombre: s.nombre, slug: s.slug }))
        }))}
      />
    </header>
  );
}
