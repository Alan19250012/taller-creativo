"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ItemCarrito {
  productoId: string;
  nombre: string;
  imagen: string;
  precio: number;
  tipoPrecio: "MINORISTA" | "DISTRIBUIDOR";
  talla?: string;
  cantidad: number;
}

interface CarritoEstado {
  items: ItemCarrito[];
  agregar: (item: ItemCarrito) => void;
  quitar: (productoId: string, talla?: string) => void;
  actualizarCantidad: (productoId: string, talla: string | undefined, cantidad: number) => void;
  limpiar: () => void;
}

export const usarCarrito = create<CarritoEstado>()(
  persist(
    (set, get) => ({
      items: [],
      agregar: (item) =>
        set((s) => {
          const idx = s.items.findIndex(
            (i) => i.productoId === item.productoId && i.talla === item.talla
          );
          if (idx >= 0) {
            const items = [...s.items];
            items[idx] = { ...items[idx], cantidad: items[idx].cantidad + item.cantidad };
            return { items };
          }
          return { items: [...s.items, item] };
        }),
      quitar: (productoId, talla) =>
        set((s) => ({
          items: s.items.filter((i) => !(i.productoId === productoId && i.talla === talla))
        })),
      actualizarCantidad: (productoId, talla, cantidad) =>
        set((s) => ({
          items:
            cantidad <= 0
              ? s.items.filter((i) => !(i.productoId === productoId && i.talla === talla))
              : s.items.map((i) =>
                  i.productoId === productoId && i.talla === talla ? { ...i, cantidad } : i
                )
        })),
      limpiar: () => set({ items: [] })
    }),
    { name: "carrito-ek" }
  )
);

export function totalCarrito(items: ItemCarrito[]): number {
  return items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
}

export function cantidadCarrito(items: ItemCarrito[]): number {
  return items.reduce((acc, i) => acc + i.cantidad, 0);
}
