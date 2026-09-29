"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { usarCarrito, cantidadCarrito } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export function IndicadorCarrito() {
  const items = usarCarrito((s) => s.items);
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    setCantidad(cantidadCarrito(items));
  }, [items]);

  return (
    <Link href="/carrito" className="relative p-2 text-gray-700 hover:text-[var(--color-primario)]">
      <ShoppingCart className="h-5 w-5" />
      {cantidad > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primario)] text-xs font-bold text-white">
          {cantidad}
        </span>
      )}
    </Link>
  );
}
