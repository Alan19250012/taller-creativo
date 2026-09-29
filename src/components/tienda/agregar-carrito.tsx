"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { usarCarrito } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

export function AgregarCarrito({
  producto,
  stock,
  talla,
  className
}: {
  producto: { id: string; nombre: string; imagen: string | null; precio: number; esDistribuidor: boolean };
  stock: number;
  talla?: string;
  className?: string;
}) {
  const agregar = usarCarrito((s) => s.agregar);
  const [agregado, setAgregado] = useState(false);

  const alAgregar = () => {
    if (stock <= 0) return;
    agregar({
      productoId: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen ?? "",
      precio: producto.precio,
      tipoPrecio: producto.esDistribuidor ? "DISTRIBUIDOR" : "MINORISTA",
      talla,
      cantidad: 1
    });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={alAgregar}
      disabled={stock <= 0}
      className={cn(
        "btn mt-2 w-full text-white",
        agregado ? "bg-green-600" : "bg-[var(--color-primario)] hover:opacity-90",
        className
      )}
    >
      {agregado ? (
        <>
          <Check className="h-4 w-4" /> Agregado
        </>
      ) : stock <= 0 ? (
        "Agotado"
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" /> Agregar
        </>
      )}
    </button>
  );
}
