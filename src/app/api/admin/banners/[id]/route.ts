import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { titulo, subtitulo, imagen, enlace, orden, activo } = await req.json();
  await prisma.banner.update({
    where: { id: params.id },
    data: {
      titulo,
      subtitulo: subtitulo || null,
      imagen: imagen || null,
      enlace: enlace || null,
      orden: Number(orden) || 0,
      activo: activo !== false
    }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  await prisma.banner.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
