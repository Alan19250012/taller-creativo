"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FormularioMenuLateral({
  categorias,
  config
}: {
  categorias: { slug: string; nombre: string }[];
  config: { categorias: string[]; mostrarTendencias: boolean; mostrarDestacados: boolean };
}) {
  const router = useRouter();
  const [seleccion, setSeleccion] = useState<string[]>(config.categorias);
  const [mostrarTendencias, setMostrarTendencias] = useState(config.mostrarTendencias);
  const [mostrarDestacados, setMostrarDestacados] = useState(config.mostrarDestacados);
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(false);

  function alternar(slug: string) {
    setSeleccion((s) => {
      if (s.includes(slug)) return s.filter((x) => x !== slug);
      if (s.length >= 7) return s; // máximo 7 categorías
      return [...s, slug];
    });
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    await fetch("/api/admin/configuracion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valores: {
          menu_lateral: JSON.stringify({
            categorias: seleccion,
            mostrarTendencias,
            mostrarDestacados
          })
        }
      })
    });
    setGuardado(true);
    setCargando(false);
    router.refresh();
    setTimeout(() => setGuardado(false), 2500);
  }

  return (
    <form onSubmit={guardar} className="space-y-6">
      <div className="tarjeta p-6">
        <h2 className="mb-2 font-bold">Categorías de la barra lateral (máx. 7)</h2>
        <p className="mb-4 text-sm text-gray-500">
          Selecciona hasta 7 categorías. Si no seleccionas ninguna, se mostrarán las 7 primeras automáticamente.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((c) => (
            <label
              key={c.slug}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${
                seleccion.includes(c.slug) ? "border-[var(--color-primario)] bg-red-50" : "border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={seleccion.includes(c.slug)}
                onChange={() => alternar(c.slug)}
                className="accent-[var(--color-primario)]"
              />
              {c.nombre}
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">{seleccion.length}/7 categorías seleccionadas</p>
      </div>

      <div className="tarjeta space-y-3 p-6">
        <h2 className="font-bold">Secciones de la barra lateral</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={mostrarTendencias}
            onChange={(e) => setMostrarTendencias(e.target.checked)}
          />
          Mostrar &quot;En tendencia&quot; (subcategorías por ventas)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={mostrarDestacados}
            onChange={(e) => setMostrarDestacados(e.target.checked)}
          />
          Mostrar &quot;Productos destacados&quot;
        </label>
      </div>

      {guardado && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">Menú lateral guardado correctamente.</p>}
      <button type="submit" disabled={cargando} className="btn-primario">
        {cargando ? "Guardando…" : "Guardar menú lateral"}
      </button>
    </form>
  );
}
