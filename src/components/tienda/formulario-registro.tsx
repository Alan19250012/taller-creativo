"use client";

import { useState } from "react";
import Link from "next/link";

export function FormularioRegistro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");
    const res = await fetch("/api/auth/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, contrasena })
    });
    const data = await res.json();
    if (res.ok) {
      window.location.href = "/login?registrado=1";
    } else {
      setError(data.error || "Error al registrarse.");
      setCargando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Nombre completo</label>
        <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Correo electrónico</label>
        <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Contraseña (mín. 8 caracteres)</label>
        <input type="password" className="input" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={cargando} className="btn-primario w-full">
        {cargando ? "Creando cuenta…" : "Crear cuenta"}
      </button>
      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-[var(--color-primario)] hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
