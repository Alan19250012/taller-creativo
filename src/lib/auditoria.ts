import { prisma } from "./db";

// Registra una acción de administrador en la bitácora de auditoría.
// Nunca lanza: si falla, solo lo reporta en consola para no interrumpir la operación.
export async function registrarAuditoria(adminId: string, accion: string, detalle?: string) {
  try {
    await prisma.auditoria.create({
      data: { adminId, accion, detalle: detalle || null }
    });
  } catch (e) {
    console.error("[auditoria] No se pudo registrar la acción:", e);
  }
}
