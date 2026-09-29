"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { usarCarrito, totalCarrito } from "@/lib/cart-store";
import { formatoMoneda } from "@/lib/format";

export function CarritoCliente() {
  const { items, quitar, actualizarCantidad } = usarCarrito();

  if (items.length === 0) {
    return (
      <div className="tarjeta flex flex-col items-center justify-center gap-3 p-16 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-300" />
        <p className="text-lg font-semibold">Tu carrito está vacío</p>
        <Link href="/catalogo" className="btn-primario">Explorar productos</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item.productoId}-${item.talla}`} className="tarjeta flex items-center gap-4 p-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {item.imagen ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imagen} alt={item.nombre} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">📦</div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">{item.nombre}</p>
            {item.talla && <p className="text-sm text-gray-500">Talla: {item.talla}</p>}
            <p className="text-sm font-semibold text-[var(--color-primario)]">{formatoMoneda(item.precio)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => actualizarCantidad(item.productoId, item.talla, item.cantidad - 1)}
              className="rounded-md border border-gray-300 p-1 hover:bg-gray-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center">{item.cantidad}</span>
            <button
              onClick={() => actualizarCantidad(item.productoId, item.talla, item.cantidad + 1)}
              className="rounded-md border border-gray-300 p-1 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => quitar(item.productoId, item.talla)}
            className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <div className="tarjeta flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{formatoMoneda(totalCarrito(items))}</p>
        </div>
        <Link href="/checkout" className="btn-primario">Ir a pagar</Link>
      </div>
    </div>
  );
}
