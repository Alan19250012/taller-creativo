"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function FormularioResena({ productoId }: { productoId: string }) {
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/resenas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productoId, estrellas, comentario })
    });
    if (res.ok) {
      setEnviado(true);
      setComentario("");
    } else {
      const data = await res.json();
      setError(data.error || "No se pudo enviar la reseña.");
    }
  }

  if (enviado) {
    return <p className="text-sm text-green-600">¡Gracias! Tu reseña se envió y será publicada tras revisión.</p>;
  }

  return (
    <form onSubmit={enviar} className="space-y-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setEstrellas(n)}>
            <Star className={`h-6 w-6 ${n <= estrellas ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
          </button>
        ))}
      </div>
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value.slice(0, 200))}
        placeholder="Escribe tu comentario (máx. 200 caracteres)"
        className="input min-h-[80px]"
        required
      />
      <p className="text-right text-xs text-gray-400">{comentario.length}/200</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn-primario">Enviar reseña</button>
    </form>
  );
}
