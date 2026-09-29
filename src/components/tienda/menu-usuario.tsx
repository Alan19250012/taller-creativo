"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, Package, LayoutDashboard } from "lucide-react";
import type { SesionUsuario } from "@/lib/auth";

export function MenuUsuario({ sesion }: { sesion: SesionUsuario | null }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function alClicFuera(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("mousedown", alClicFuera);
    return () => document.removeEventListener("mousedown", alClicFuera);
  }, []);

  if (!sesion) {
    return (
      <Link href="/login" className="btn-borde">
        <User className="h-4 w-4" /> Iniciar sesión
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setAbierto((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
      >
        <User className="h-4 w-4" />
        <span className="hidden max-w-[120px] truncate sm:inline">{sesion.nombre}</span>
        {sesion.rol === "DISTRIBUIDOR" && (
          <span className="etiqueta bg-[var(--color-secundario)] text-white">Distribuidor</span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <Link href="/cuenta" onClick={() => setAbierto(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
            <User className="h-4 w-4" /> Mi cuenta
          </Link>
          <Link href="/cuenta/pedidos" onClick={() => setAbierto(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
            <Package className="h-4 w-4" /> Mis pedidos
          </Link>
          {sesion.rol === "ADMINISTRADOR" && (
            <Link href="/admin" onClick={() => setAbierto(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
              <LayoutDashboard className="h-4 w-4" /> Panel administrativo
            </Link>
          )}
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/";
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
