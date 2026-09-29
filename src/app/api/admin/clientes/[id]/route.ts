import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";
import { registrarAuditoria } from "@/lib/auditoria";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { rol, activo } = await req.json();

  const usuario = await prisma.usuario.findUnique({ where: { id: params.id } });
  if (!usuario) return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (typeof activo === "boolean") data.activo = activo;

  if (rol && rol !== usuario.rol) {
    data.rol = rol;
    await prisma.cambioRol.create({
      data: {
        usuarioId: usuario.id,
        rolAnterior: usuario.rol,
        rolNuevo: rol,
        adminId: admin.id,
        motivo: "Cambio desde el panel administrativo"
      }
    });
  }

  await prisma.usuario.update({ where: { id: params.id }, data });

  const cambios: string[] = [];
  if (rol && rol !== usuario.rol) cambios.push(`rol ${usuario.rol} → ${rol}`);
  if (typeof activo === "boolean") cambios.push(activo ? "activado" : "desactivado");
  await registrarAuditoria(admin.id, "CLIENTE_ACTUALIZADO", `Cliente ${usuario.email}: ${cambios.join(", ") || "sin cambios"}`);

  return NextResponse.json({ ok: true });
}
