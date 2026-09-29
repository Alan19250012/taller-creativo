"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

interface Sub {
  id: string;
  nombre: string;
  activo: boolean;
}
interface Cat {
  id: string;
  nombre: string;
  activo: boolean;
  subcategorias: Sub[];
}

export function GestionCategorias({
  categorias: iniciales
}: {
  categorias: Cat[];
}) {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Cat[]>(iniciales);
  const [nuevaCat, setNuevaCat] = useState("");
  const [nuevaSub, setNuevaSub] = useState<Record<string, string>>({});

  async function refrescar() {
    router.refresh();
  }

  async function crearCategoria() {
    if (!nuevaCat.trim()) return;
    await fetch("/api/admin/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevaCat })
    });
    setNuevaCat("");
    refrescar();
  }

  async function crearSubcategoria(categoriaId: string) {
    const nombre = nuevaSub[categoriaId];
    if (!nombre?.trim()) return;
    await fetch("/api/admin/subcategorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, categoriaId })
    });
    setNuevaSub((s) => ({ ...s, [categoriaId]: "" }));
    refrescar();
  }

  async function editarCategoria(cat: Cat, cambios: Partial<Cat>) {
    setCategorias((cs) => cs.map((c) => (c.id === cat.id ? { ...c, ...cambios } : c)));
    await fetch(`/api/admin/categorias/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cambios)
    });
  }

  async function editarSubcategoria(sub: Sub, cambios: Partial<Sub>) {
    setCategorias((cs) =>
      cs.map((c) => ({
        ...c,
        subcategorias: c.subcategorias.map((s) => (s.id === sub.id ? { ...s, ...cambios } : s))
      }))
    );
    await fetch(`/api/admin/subcategorias/${sub.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cambios)
    });
  }

  async function eliminarCategoria(id: string) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" });
    refrescar();
  }

  async function eliminarSubcategoria(id: string) {
    if (!confirm("¿Eliminar esta subcategoría?")) return;
    await fetch(`/api/admin/subcategorias/${id}`, { method: "DELETE" });
    refrescar();
  }

  return (
    <div className="space-y-6">
      <div className="tarjeta flex gap-2 p-4">
        <input
          className="input"
          placeholder="Nueva categoría principal…"
          value={nuevaCat}
          onChange={(e) => setNuevaCat(e.target.value)}
        />
        <button onClick={crearCategoria} className="btn-primario shrink-0">
          <Plus className="h-4 w-4" /> Agregar
        </button>
      </div>

      <div className="space-y-4">
        {categorias.map((cat) => (
          <div key={cat.id} className="tarjeta p-5">
            <div className="flex flex-wrap items-center gap-3">
              <input
                className="input max-w-xs font-medium"
                defaultValue={cat.nombre}
                onBlur={(e) => e.target.value !== cat.nombre && editarCategoria(cat, { nombre: e.target.value })}
              />
              <label className="flex items-center gap-1 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={cat.activo}
                  onChange={(e) => editarCategoria(cat, { activo: e.target.checked })}
                />
                Activa
              </label>
              <button onClick={() => eliminarCategoria(cat.id)} className="ml-auto p-2 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {cat.subcategorias.map((sub) => (
                <div key={sub.id} className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1">
                  <input
                    className="w-40 bg-transparent text-sm outline-none"
                    defaultValue={sub.nombre}
                    onBlur={(e) => e.target.value !== sub.nombre && editarSubcategoria(sub, { nombre: e.target.value })}
                  />
                  <label className="flex items-center gap-1 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={sub.activo}
                      onChange={(e) => editarSubcategoria(sub, { activo: e.target.checked })}
                    />
                    Activa
                  </label>
                  <button onClick={() => eliminarSubcategoria(sub.id)} className="p-1 text-red-400 hover:text-red-600">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                className="input max-w-xs"
                placeholder="Nueva subcategoría…"
                value={nuevaSub[cat.id] ?? ""}
                onChange={(e) => setNuevaSub((s) => ({ ...s, [cat.id]: e.target.value }))}
              />
              <button onClick={() => crearSubcategoria(cat.id)} className="btn-borde shrink-0">
                <Plus className="h-4 w-4" /> Subcategoría
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
