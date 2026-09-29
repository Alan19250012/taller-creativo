"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BannerDatos {
  id: string;
  titulo: string;
  subtitulo: string | null;
  imagen: string | null;
  enlace: string | null;
}

export function CarruselBanners({ banners }: { banners: BannerDatos[] }) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  // Cambio automático del banner cada 4 segundos
  useEffect(() => {
    if (banners.length <= 1 || pausado) return;
    const temporizador = setInterval(() => {
      setIndice((i) => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(temporizador);
  }, [banners.length, pausado]);

  if (banners.length === 0) return null;

  const actual = banners[indice];

  const ir = (delta: number) => setIndice((i) => (i + delta + banners.length) % banners.length);

  return (
    <section
      className="relative flex min-h-[320px] items-center overflow-hidden bg-gradient-to-r from-[var(--color-primario)] to-[var(--color-secundario)] text-white sm:min-h-[400px]"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {/* Imágenes de fondo: se apilan y se cruzan con una transición de opacidad.
          Si un banner no tiene imagen, se ve el degradado de la sección. */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {banners.map((b, i) =>
          b.imagen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={b.id}
              src={b.imagen}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                i === indice ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null
        )}
      </div>

      {/* Velo oscuro: sin él, un texto blanco sobre una foto clara no se lee. */}
      {actual.imagen && <div className="absolute inset-0 z-0 bg-black/45" aria-hidden="true" />}

      <AnimatePresence mode="wait">
        <motion.div
          key={actual.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.5 }}
          className="contenedor relative z-10 py-16 text-center sm:py-24"
        >
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{actual.titulo}</h1>
          {actual.subtitulo && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{actual.subtitulo}</p>
          )}
          {actual.enlace && (
            <div className="mt-8">
              <Link href={actual.enlace} className="btn bg-white text-[var(--color-primario)] hover:bg-gray-100">
                Ver ahora
              </Link>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Flechas */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => ir(-1)}
            aria-label="Banner anterior"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-2 hover:bg-black/40"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => ir(1)}
            aria-label="Banner siguiente"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-2 hover:bg-black/40"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Indicadores */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setIndice(i)}
              aria-label={`Ir al banner ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === indice ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
