"use client";

import { useState } from "react";

export default function AdminLogin() {
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
    if (res.ok && data.rol === "ADMINISTRADOR") {
      window.location.href = "/admin";
    } else if (res.ok) {
      setError("Esta cuenta no tiene permisos de administrador.");
      setCargando(false);
    } else {
      setError(data.error || "Credenciales incorrectas.");
      setCargando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--color-primario)] to-[var(--color-secundario)] p-4">
      <form onSubmit={enviar} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold">Panel administrativo</h1>
        <div className="space-y-4">
          <input type="email" className="input" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" className="input" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={cargando} className="btn-primario w-full">
            {cargando ? "Ingresando…" : "Ingresar"}
          </button>
          <p className="text-center text-xs text-gray-400">
            Credenciales demo: admin@ek.com / admin123
          </p>
        </div>
      </form>
    </div>
  );
}
