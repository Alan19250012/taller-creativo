"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import type { CategoriaFiltro } from "@/lib/catalogo";

export function PanelFiltros({
  base,
  categorias,
  colores,
  tallas,
  ocultarCategoria = false
}: {
  base: string;
  categorias: CategoriaFiltro[];
  colores: string[];
  tallas: string[];
  ocultarCategoria?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const actual = useMemo(() => new URLSearchParams(params.toString()), [params]);

  const actualizar = useCallback(
    (cambios: Record<string, string | null>) => {
      const p = new URLSearchParams(params.toString());
      for (const [clave, valor] of Object.entries(cambios)) {
        if (valor === null || valor === "") p.delete(clave);
        else p.set(clave, valor);
      }
      router.push(`${base}?${p.toString()}`, { scroll: false });
    },
    [params, router, base]
  );

  const activos = Array.from(actual.entries()).filter(
    ([k]) => !["q", "orden", "precioMin", "precioMax"].includes(k)
  );

  const limpiar = () => router.push(base);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-[var(--color-primario)]" /> Filtros
        </h2>
        {activos.length > 0 && (
          <button onClick={limpiar} className="text-xs font-medium text-[var(--color-primario)] hover:underline">
            Limpiar todos
          </button>
        )}
      </div>

      {/* Precio */}
      <div>
        <label className="mb-2 block text-sm font-medium">Precio</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Mín"
            className="input"
            defaultValue={params.get("precioMin") ?? ""}
            onBlur={(e) => actualizar({ precioMin: e.target.value })}
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            min={0}
            placeholder="Máx"
            className="input"
            defaultValue={params.get("precioMax") ?? ""}
            onBlur={(e) => actualizar({ precioMax: e.target.value })}
          />
        </div>
      </div>

      {/* Categoría */}
      {!ocultarCategoria && (
        <div>
          <label className="mb-2 block text-sm font-medium">Categoría</label>
          <select
            className="input"
            value={params.get("categoria") ?? ""}
            onChange={(e) => actualizar({ categoria: e.target.value, subcategoria: null })}
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>{c.nombre}</option>
            ))}
          </select>
        </div>
      )}

      {/* Subcategoría */}
      {categorias.some((c) => c.subcategorias.length > 0) && (
        <div>
          <label className="mb-2 block text-sm font-medium">Subcategoría</label>
          <select
            className="input"
            value={params.get("subcategoria") ?? ""}
            onChange={(e) => actualizar({ subcategoria: e.target.value })}
          >
            <option value="">Todas</option>
            {categorias.flatMap((c) =>
              c.subcategorias.map((s) => (
                <option key={s.slug} value={s.slug}>{s.nombre}</option>
              ))
            )}
          </select>
        </div>
      )}

      {/* Color */}
      {colores.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium">Color</label>
          <div className="flex flex-wrap gap-2">
            {colores.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => actualizar({ color: params.get("color") === c ? null : c })}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  params.get("color") === c
                    ? "border-[var(--color-primario)] bg-[var(--color-primario)] text-white"
                    : "border-gray-300 hover:border-[var(--color-primario)] hover:text-[var(--color-primario)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Talla */}
      {tallas.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium">Talla</label>
          <div className="flex flex-wrap gap-2">
            {tallas.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => actualizar({ talla: params.get("talla") === t ? null : t })}
                className={`rounded-md border px-3 py-1 text-xs transition ${
                  params.get("talla") === t
                    ? "border-[var(--color-secundario)] bg-[var(--color-secundario)] text-white"
                    : "border-gray-300 hover:border-[var(--color-secundario)] hover:text-[var(--color-secundario)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Disponibilidad / etiquetas */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={params.get("enStock") === "1"}
            onChange={(e) => actualizar({ enStock: e.target.checked ? "1" : null })}
          />
          Solo en stock
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={params.get("liquidacion") === "1"}
            onChange={(e) => actualizar({ liquidacion: e.target.checked ? "1" : null })}
          />
          En oferta
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={params.get("destacado") === "1"}
            onChange={(e) => actualizar({ destacado: e.target.checked ? "1" : null })}
          />
          Destacados
        </label>
      </div>

      {/* Chips activos */}
      {activos.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          {activos.map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => actualizar({ [k]: null })}
              className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200"
            >
              {v} <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
