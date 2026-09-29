"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubirImagen } from "./subir-imagen";

export function FormularioArticulo({
  articulo
}: {
  articulo?: {
    id: string;
    titulo: string;
    resumen: string | null;
    contenido: string;
    imagen: string | null;
    publicado: boolean;
  };
}) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(articulo?.titulo ?? "");
  const [resumen, setResumen] = useState(articulo?.resumen ?? "");
  const [contenido, setContenido] = useState(articulo?.contenido ?? "");
  const [imagen, setImagen] = useState(articulo?.imagen ?? "");
  const [publicado, setPublicado] = useState(articulo?.publicado ?? true);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    const res = await fetch(articulo ? `/api/admin/articulos/${articulo.id}` : "/api/admin/articulos", {
      method: articulo ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, resumen, contenido, imagen, publicado })
    });
    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Error al guardar.");
      setCargando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="tarjeta space-y-4 p-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Título *</label>
        <input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Resumen</label>
        <input className="input" value={resumen} onChange={(e) => setResumen(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Contenido *</label>
        <textarea className="input min-h-[200px]" value={contenido} onChange={(e) => setContenido(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Imagen de portada</label>
        <SubirImagen valor={imagen} onChange={setImagen} carpeta="articulos" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={publicado} onChange={(e) => setPublicado(e.target.checked)} />
        Publicado
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={cargando} className="btn-primario">
          {cargando ? "Guardando…" : "Guardar artículo"}
        </button>
        <button type="button" onClick={() => router.push("/admin/blog")} className="btn-borde">Cancelar</button>
      </div>
    </form>
  );
}
