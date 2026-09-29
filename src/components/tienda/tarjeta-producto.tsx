"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calificacion } from "./calificacion";
import { AgregarCarrito } from "./agregar-carrito";
import { formatoMoneda } from "@/lib/format";

export interface DatosProductoTarjeta {
  id: string;
  slug: string;
  nombre: string;
  imagen: string | null;
  precioMinorista: number;
  precioDistribuidor: number;
  calificacion: number;
  stock: number;
  color: string | null;
  destacado: boolean;
  nuevo: boolean;
  liquidacion: boolean;
}

export function TarjetaProducto({
  producto,
  rol
}: {
  producto: DatosProductoTarjeta;
  rol: string | null;
}) {
  const esDistribuidor = rol === "DISTRIBUIDOR" || rol === "ADMINISTRADOR";
  const precio = esDistribuidor ? producto.precioDistribuidor : producto.precioMinorista;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="tarjeta group relative flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      <Link href={`/producto/${producto.slug}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        {producto.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">Sin imagen</div>
        )}
        {producto.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-full bg-gray-900/85 px-3 py-1 text-sm font-semibold text-white">
              Agotado
            </span>
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {producto.nuevo && <span className="etiqueta bg-[var(--color-secundario)] text-white">Nuevo</span>}
          {producto.liquidacion && <span className="etiqueta bg-[var(--color-primario)] text-white">Oferta</span>}
          {producto.destacado && <span className="etiqueta bg-amber-400 text-black">Destacado</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Calificacion valor={producto.calificacion} />
        <Link href={`/producto/${producto.slug}`} className="line-clamp-2 font-medium hover:text-[var(--color-primario)]">
          {producto.nombre}
        </Link>
        {producto.color && <p className="text-xs text-gray-500">Color: {producto.color}</p>}

        <div className="mt-auto">
          <p className="text-lg font-bold">{formatoMoneda(precio)}</p>
          {esDistribuidor && (
            <p className="text-xs text-gray-500">
              Minorista: {formatoMoneda(producto.precioMinorista)}
            </p>
          )}
        </div>

        <AgregarCarrito
          producto={{ id: producto.id, nombre: producto.nombre, imagen: producto.imagen, precio, esDistribuidor }}
          stock={producto.stock}
        />
      </div>
    </motion.article>
  );
}
