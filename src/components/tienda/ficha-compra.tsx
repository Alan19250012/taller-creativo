"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AgregarCarrito } from "./agregar-carrito";
import { formatoMoneda } from "@/lib/format";

interface TallaInfo {
  nombre: string;
  stock: number;
  extra: number;
}

export function FichaCompra({
  producto,
  rol
}: {
  producto: {
    id: string;
    nombre: string;
    imagen: string | null;
    precioMinorista: number;
    precioDistribuidor: number;
    stock: number;
    tallas: TallaInfo[];
  };
  rol: string | null;
}) {
  const esDistribuidor = rol === "DISTRIBUIDOR" || rol === "ADMINISTRADOR";
  const [talla, setTalla] = useState<string | undefined>(producto.tallas[0]?.nombre);

  const base = esDistribuidor ? producto.precioDistribuidor : producto.precioMinorista;
  const extra = producto.tallas.find((t) => t.nombre === talla)?.extra ?? 0;
  const precioFinal = base + extra;
  const stockTalla = producto.tallas.find((t) => t.nombre === talla)?.stock ?? producto.stock;

  return (
    <div className="space-y-5">
      {/* Precio */}
      <div>
        <motion.p
          key={talla ?? "sin-talla"}
          initial={{ scale: 1.08, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="text-3xl font-bold text-[var(--color-primario)]"
        >
          {formatoMoneda(precioFinal)}
        </motion.p>
        {esDistribuidor && (
          <p className="mt-1 text-sm text-gray-500">
            Precio minorista: {formatoMoneda(producto.precioMinorista + extra)}
          </p>
        )}
      </div>

      {/* Tallas */}
      {producto.tallas.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Talla</p>
          <div className="flex flex-wrap gap-2">
            {producto.tallas.map((t) => (
              <button
                key={t.nombre}
                onClick={() => setTalla(t.nombre)}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  talla === t.nombre
                    ? "border-[var(--color-secundario)] bg-[var(--color-secundario)] text-white"
                    : "border-gray-300 hover:border-[var(--color-secundario)]"
                }`}
              >
                {t.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      <AgregarCarrito
        producto={{
          id: producto.id,
          nombre: producto.nombre,
          imagen: producto.imagen,
          precio: precioFinal,
          esDistribuidor
        }}
        stock={stockTalla}
        talla={talla}
        className="max-w-xs"
      />
    </div>
  );
}
