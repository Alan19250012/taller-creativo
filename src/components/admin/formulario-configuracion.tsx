"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubirImagen } from "./subir-imagen";

export function FormularioConfiguracion({ config }: { config: Record<string, string> }) {
  const router = useRouter();
  const [valores, setValores] = useState<Record<string, string>>(config);
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(false);

  function set(clave: string, valor: string) {
    setValores((v) => ({ ...v, [clave]: valor }));
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    await fetch("/api/admin/configuracion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valores })
    });
    setGuardado(true);
    setCargando(false);
    router.refresh();
    setTimeout(() => setGuardado(false), 2500);
  }

  const campos: { clave: string; etiqueta: string }[] = [
    { clave: "nombre_empresa", etiqueta: "Nombre de la empresa" },
    { clave: "telefono1", etiqueta: "Teléfono 1" },
    { clave: "telefono2", etiqueta: "Teléfono 2" },
    { clave: "correo", etiqueta: "Correo de la empresa" },
    { clave: "facebook", etiqueta: "Facebook (URL)" },
    { clave: "instagram", etiqueta: "Instagram (URL)" },
    { clave: "pinterest", etiqueta: "Pinterest (URL)" },
    { clave: "tiktok", etiqueta: "TikTok (URL)" },
    { clave: "whatsapp", etiqueta: "WhatsApp (URL)" }
  ];

  return (
    <form onSubmit={guardar} className="space-y-6">
      {/* Colores */}
      <div className="tarjeta p-6">
        <h2 className="mb-4 font-bold">Colores de la marca</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Color principal</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={valores.color_primario || "#DA1D2A"}
                onChange={(e) => set("color_primario", e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border"
              />
              <input
                className="input"
                value={valores.color_primario || ""}
                onChange={(e) => set("color_primario", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Color secundario</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={valores.color_secundario || "#244093"}
                onChange={(e) => set("color_secundario", e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border"
              />
              <input
                className="input"
                value={valores.color_secundario || ""}
                onChange={(e) => set("color_secundario", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logo y favicon */}
      <div className="tarjeta p-6">
        <h2 className="mb-4 font-bold">Logo y favicon</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Logo de la empresa</label>
            <SubirImagen valor={valores.logo_url || ""} onChange={(url) => set("logo_url", url)} etiqueta="Subir logo" carpeta="marca" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Favicon (ícono de pestaña)</label>
            <SubirImagen valor={valores.favicon_url || ""} onChange={(url) => set("favicon_url", url)} etiqueta="Subir favicon" carpeta="marca" />
          </div>
        </div>
      </div>

      {/* Datos de la empresa */}
      <div className="tarjeta p-6">
        <h2 className="mb-4 font-bold">Datos de la empresa</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {campos.map((c) => (
            <div key={c.clave}>
              <label className="mb-1 block text-sm font-medium">{c.etiqueta}</label>
              <input className="input" value={valores[c.clave] || ""} onChange={(e) => set(c.clave, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {guardado && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">Configuración guardada correctamente.</p>}
      <button type="submit" disabled={cargando} className="btn-primario">
        {cargando ? "Guardando…" : "Guardar configuración"}
      </button>
    </form>
  );
}
