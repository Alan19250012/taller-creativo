import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { titulo, resumen, contenido, imagen, publicado } = await req.json();
  await prisma.articulo.update({
    where: { id: params.id },
    data: {
      titulo,
      slug: slugify(titulo),
      resumen: resumen || null,
      contenido,
      imagen: imagen || null,
      publicado: Boolean(publicado)
    }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  await prisma.articulo.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
