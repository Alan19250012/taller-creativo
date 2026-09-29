"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface CategoriaNav {
  nombre: string;
  slug: string;
  subcategorias: { nombre: string; slug: string }[];
}

export function BarraCategorias({ categorias }: { categorias: CategoriaNav[] }) {
  const [activo, setActivo] = useState<string | null>(null);

  return (
    <nav className="border-t border-gray-200 bg-white">
      <div className="contenedor relative flex items-center gap-1 overflow-x-auto py-2">
        <Link
          href="/catalogo"
          className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold text-[var(--color-primario)] hover:bg-gray-100"
        >
          Todo
        </Link>
        {categorias.map((cat) => (
          <div
            key={cat.slug}
            className="relative"
            onMouseEnter={() => setActivo(cat.slug)}
            onMouseLeave={() => setActivo(null)}
          >
            <Link
              href={`/categoria/${cat.slug}`}
              className="flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[var(--color-primario)]"
            >
              {cat.nombre}
              {cat.subcategorias.length > 0 && <ChevronDown className="h-3 w-3" />}
            </Link>

            {activo === cat.slug && cat.subcategorias.length > 0 && (
              <div className="absolute left-0 top-full z-50 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                {cat.subcategorias.slice(0, 15).map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/catalogo?subcategoria=${sub.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primario)]"
                  >
                    {sub.nombre}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
