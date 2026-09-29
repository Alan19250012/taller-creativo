"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

// Componente de subida de imagen que devuelve la URL vía onChange.
//
// `carpeta` organiza los archivos dentro del bucket (productos/, banners/, …).
// Antes todo se guardaba en "productos/", incluso los banners y el logo.
export function SubirImagen({
  valor,
  onChange,
  etiqueta = "Subir imagen",
  carpeta = "productos",
  maxMB = 8
}: {
  valor: string;
  onChange: (url: string) => void;
  etiqueta?: string;
  carpeta?: "productos" | "banners" | "articulos" | "marca";
  maxMB?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function alSeleccionar(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    // Permite volver a elegir el MISMO archivo: sin esto, el input conserva el
    // valor anterior y el navegador no vuelve a disparar onChange.
    e.target.value = "";
    if (!archivo) return;

    setError("");

    if (!archivo.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    if (archivo.size > maxMB * 1024 * 1024) {
      setError(`La imagen pesa más de ${maxMB} MB. Redúcela e inténtalo de nuevo.`);
      return;
    }

    setCargando(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result as string);
        lector.onerror = () => reject(new Error("No se pudo leer el archivo."));
        lector.readAsDataURL(archivo);
      });

      const res = await fetch("/api/admin/subir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archivo: base64, nombre: archivo.name, carpeta })
      });

      // El endpoint puede devolver HTML (p. ej. una página de error 413), así que
      // no damos por hecho que la respuesta sea JSON.
      const data = await res.json().catch(() => ({}) as { url?: string; error?: string });

      if (!res.ok || !data.url) {
        // Antes este caso se ignoraba en silencio: el botón volvía a su estado
        // normal y parecía que "no pasaba nada".
        setError(data.error || `No se pudo subir la imagen (error ${res.status}).`);
        return;
      }

      onChange(data.url);
    } catch {
      setError("No se pudo subir la imagen. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={alSeleccionar} />
      {valor && (
        <div className="mb-2 flex items-start gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={valor} alt="Vista previa" className="h-20 w-20 rounded-lg border object-contain" />
          <button
            type="button"
            onClick={() => {
              setError("");
              onChange("");
            }}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-red-600"
            aria-label="Quitar imagen"
            title="Quitar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <button type="button" onClick={() => inputRef.current?.click()} disabled={cargando} className="btn-borde">
        <Upload className="h-4 w-4" /> {cargando ? "Subiendo…" : etiqueta}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
