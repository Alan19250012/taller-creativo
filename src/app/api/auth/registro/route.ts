import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { limitar, obtenerIp } from "@/lib/rate-limit";

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const { nombre, email, contrasena } = await req.json();

  if (!nombre || !email || !contrasena) {
    return NextResponse.json({ error: "Todos los campos son obligatorios." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_VALIDO.test(email.trim())) {
    return NextResponse.json({ error: "El correo no tiene un formato válido." }, { status: 400 });
  }
  if (typeof contrasena !== "string" || contrasena.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
  }

  // Limita la creación de cuentas por IP (anti abuso).
  const ip = obtenerIp(req);
  const limite = limitar(`registro:${ip}`, 5);
  if (!limite.ok) {
    return NextResponse.json(
      { error: `Demasiados registros. Intenta de nuevo en ${limite.reintentarEn} s.` },
      { status: 429 }
    );
  }

  const existente = await prisma.usuario.findUnique({ where: { email: email.toLowerCase() } });
  if (existente) {
    return NextResponse.json({ error: "El correo ya está registrado." }, { status: 400 });
  }

  const hash = await bcrypt.hash(contrasena, 10);
  await prisma.usuario.create({
    data: { nombre, email: email.toLowerCase(), contrasena: hash }
  });

  return NextResponse.json({ ok: true });
}
