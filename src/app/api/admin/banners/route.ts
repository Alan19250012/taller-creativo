import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { titulo, subtitulo, imagen, enlace, orden, activo } = await req.json();
  if (!titulo) return NextResponse.json({ error: "El título es obligatorio." }, { status: 400 });

  const banner = await prisma.banner.create({
    data: {
      titulo,
      subtitulo: subtitulo || null,
      imagen: imagen || null,
      enlace: enlace || null,
      orden: Number(orden) || 0,
      activo: activo !== false
    }
  });

  return NextResponse.json({ ok: true, id: banner.id });
}
