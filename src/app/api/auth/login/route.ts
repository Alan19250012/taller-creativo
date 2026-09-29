import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { firmarToken } from "@/lib/auth";
import { limitar, obtenerIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const { email, contrasena } = await req.json();

  if (!email || !contrasena) {
    return NextResponse.json({ error: "Ingresa correo y contraseña." }, { status: 400 });
  }

  // Limita intentos por IP + correo (anti fuerza bruta).
  const ip = obtenerIp(req);
  const limite = limitar(`login:${ip}:${email.toLowerCase()}`);
  if (!limite.ok) {
    return NextResponse.json(
      { error: `Demasiados intentos. Intenta de nuevo en ${limite.reintentarEn} s.` },
      { status: 429 }
    );
  }

  const usuario = await prisma.usuario.findUnique({ where: { email: email.toLowerCase() } });
  if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
    return NextResponse.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });
  }
  if (!usuario.activo) {
    return NextResponse.json({ error: "Tu cuenta está desactivada." }, { status: 403 });
  }

  const token = await firmarToken({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  });

  const res = NextResponse.json({ ok: true, rol: usuario.rol });
  res.cookies.set("sesion", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production"
  });
  return res;
}
