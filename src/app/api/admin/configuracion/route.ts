import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";
import { registrarAuditoria } from "@/lib/auditoria";

// Recibe { valores: { clave: valor, ... } } y actualiza la configuración del sitio.
export async function PUT(req: Request) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { valores } = await req.json();
  if (!valores || typeof valores !== "object") {
    return NextResponse.json({ error: "Sin valores." }, { status: 400 });
  }

  for (const [clave, valor] of Object.entries(valores)) {
    await prisma.configuracion.upsert({
      where: { clave },
      update: { valor: String(valor) },
      create: { clave, valor: String(valor) }
    });
  }

  await registrarAuditoria(admin.id, "CONFIGURACION_ACTUALIZADA", `Claves actualizadas: ${Object.keys(valores).join(", ")}`);

  return NextResponse.json({ ok: true });
}
