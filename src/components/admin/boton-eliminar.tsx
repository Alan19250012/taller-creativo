"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

export function BotonEliminar({ url, mensaje }: { url: string; mensaje?: string }) {
  const [cargando, setCargando] = useState(false);

  async function eliminar() {
    if (!confirm(mensaje || "¿Eliminar este registro?")) return;
    setCargando(true);
    await fetch(url, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <button
      onClick={eliminar}
      disabled={cargando}
      className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
      title="Eliminar"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
