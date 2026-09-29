import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";
import { registrarAuditoria } from "@/lib/auditoria";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { estado } = await req.json();
  if (!estado) return NextResponse.json({ error: "Falta el estado." }, { status: 400 });

  await prisma.pedido.update({ where: { id: params.id }, data: { estado } });
  await registrarAuditoria(admin.id, "PEDIDO_ESTADO", `Pedido ${params.id} → ${estado}`);

  return NextResponse.json({ ok: true });
}
