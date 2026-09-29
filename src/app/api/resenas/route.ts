import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth";

export async function POST(req: Request) {
  const sesion = await obtenerSesion();
  if (!sesion) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const { productoId, estrellas, comentario } = await req.json();
  if (!productoId || !estrellas || !comentario) {
    return NextResponse.json({ error: "Faltan datos." }, { status: 400 });
  }
  if (estrellas < 1 || estrellas > 5) {
    return NextResponse.json({ error: "Las estrellas deben ser de 1 a 5." }, { status: 400 });
  }
  if (comentario.length > 200) {
    return NextResponse.json({ error: "El comentario supera 200 caracteres." }, { status: 400 });
  }

  await prisma.resena.create({
    data: {
      productoId,
      usuarioId: sesion.id,
      estrellas,
      comentario,
      aprobada: false
    }
  });

  return NextResponse.json({ ok: true });
}
