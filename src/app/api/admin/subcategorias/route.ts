import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { nombre, categoriaId, padreId } = await req.json();
  if (!nombre) return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });

  const sub = await prisma.subcategoria.create({
    data: {
      nombre,
      slug: slugify(nombre),
      padreId: padreId || null,
      categorias: categoriaId ? { connect: { id: categoriaId } } : undefined
    }
  });
  return NextResponse.json({ ok: true, id: sub.id });
}
