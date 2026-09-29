import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { nombre, orden, activo } = await req.json();
  await prisma.subcategoria.update({
    where: { id: params.id },
    data: {
      ...(nombre ? { nombre, slug: slugify(nombre) } : {}),
      ...(orden !== undefined ? { orden: Number(orden) } : {}),
      ...(activo !== undefined ? { activo: Boolean(activo) } : {})
    }
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  await prisma.subcategoria.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
