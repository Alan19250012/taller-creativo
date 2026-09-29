import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { titulo, resumen, contenido, imagen, publicado } = await req.json();
  if (!titulo || !contenido) {
    return NextResponse.json({ error: "Título y contenido son obligatorios." }, { status: 400 });
  }

  const articulo = await prisma.articulo.create({
    data: {
      titulo,
      slug: slugify(titulo),
      resumen: resumen || null,
      contenido,
      imagen: imagen || null,
      publicado: Boolean(publicado)
    }
  });

  return NextResponse.json({ ok: true, id: articulo.id });
}
