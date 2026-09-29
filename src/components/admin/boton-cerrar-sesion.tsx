"use client";

import { LogOut } from "lucide-react";

export function BotonCerrarSesion() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
      }}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
    >
      <LogOut className="h-4 w-4" /> Cerrar sesión
    </button>
  );
}
