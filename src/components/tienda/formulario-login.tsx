"use client";

import { useState } from "react";
import Link from "next/link";

export function FormularioLogin({ redirect }: { redirect?: string }) {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contrasena })
    });
    const data = await res.json();
    if (res.ok) {
      if (data.rol === "ADMINISTRADOR") {
        window.location.href = "/admin";
      } else {
        window.location.href = redirect || "/";
      }
    } else {
      setError(data.error || "Error al iniciar sesión.");
      setCargando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Correo electrónico</label>
        <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Contraseña</label>
        <input type="password" className="input" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={cargando} className="btn-primario w-full">
        {cargando ? "Ingresando…" : "Iniciar sesión"}
      </button>
      <p className="text-center text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-medium text-[var(--color-primario)] hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
