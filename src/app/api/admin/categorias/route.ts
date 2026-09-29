import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { nombre, descripcion, orden } = await req.json();
  if (!nombre) return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });

  const categoria = await prisma.categoria.create({
    data: { nombre, slug: slugify(nombre), descripcion: descripcion || null, orden: Number(orden) || 0 }
  });
  return NextResponse.json({ ok: true, id: categoria.id });
}
