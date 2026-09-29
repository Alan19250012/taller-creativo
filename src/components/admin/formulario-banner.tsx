"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubirImagen } from "./subir-imagen";

export function FormularioBanner({
  banner
}: {
  banner?: {
    id: string;
    titulo: string;
    subtitulo: string | null;
    imagen: string | null;
    enlace: string | null;
    orden: number;
    activo: boolean;
  };
}) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(banner?.titulo ?? "");
  const [subtitulo, setSubtitulo] = useState(banner?.subtitulo ?? "");
  const [imagen, setImagen] = useState(banner?.imagen ?? "");
  const [enlace, setEnlace] = useState(banner?.enlace ?? "");
  const [orden, setOrden] = useState(String(banner?.orden ?? 0));
  const [activo, setActivo] = useState(banner?.activo ?? true);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    const res = await fetch(banner ? `/api/admin/banners/${banner.id}` : "/api/admin/banners", {
      method: banner ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, subtitulo, imagen, enlace, orden, activo })
    });
    if (res.ok) {
      router.push("/admin/banners");
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
        <label className="mb-1 block text-sm font-medium">Subtítulo</label>
        <input className="input" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Enlace (al hacer clic, ej. /categoria/halloween)</label>
        <input className="input" value={enlace} onChange={(e) => setEnlace(e.target.value)} placeholder="/categoria/…" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Orden (menor = primero)</label>
          <input type="number" className="input" value={orden} onChange={(e) => setOrden(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Imagen de fondo (opcional)</label>
          <SubirImagen valor={imagen} onChange={setImagen} etiqueta="Subir imagen" carpeta="banners" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
        Activo
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={cargando} className="btn-primario">
          {cargando ? "Guardando…" : "Guardar banner"}
        </button>
        <button type="button" onClick={() => router.push("/admin/banners")} className="btn-borde">Cancelar</button>
      </div>
    </form>
  );
}
