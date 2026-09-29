"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

// Barra de herramientas del catálogo: resumen de resultados + selector de orden.
export function OrdenCatalogo({ base, total }: { base: string; total: number }) {
  const router = useRouter();
  const params = useSearchParams();

  const cambiar = (valor: string) => {
    const p = new URLSearchParams(params.toString());
    if (valor) p.set("orden", valor);
    else p.delete("orden");
    router.push(`${base}?${p.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-900">{total}</span> producto{total === 1 ? "" : "s"}
      </p>

      <label className="flex items-center gap-2 text-sm text-gray-500">
        <ArrowUpDown className="h-4 w-4" />
        <span className="hidden sm:inline">Ordenar por</span>
        <select
          className="input w-auto min-w-[180px]"
          value={params.get("orden") ?? ""}
          onChange={(e) => cambiar(e.target.value)}
        >
          <option value="">Relevancia</option>
          <option value="vendidos">Más vendidos</option>
          <option value="nuevos">Novedades</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="calificacion">Mejor calificados</option>
          <option value="nombre">Nombre A–Z</option>
        </select>
      </label>
    </div>
  );
}
