import { prisma } from "@/lib/db";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditoriaPage() {
  const registros = await prisma.auditoria.findMany({
    orderBy: { creadoEn: "desc" },
    take: 200,
    include: { admin: { select: { nombre: true, email: true } } }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-7 w-7 text-[var(--color-secundario)]" />
        <h1 className="text-2xl font-bold">Bitácora de auditoría</h1>
      </div>

      <p className="text-sm text-gray-600">
        Registro de las acciones realizadas por los administradores (quién, qué y cuándo).
      </p>

      {registros.length === 0 ? (
        <div className="tarjeta p-16 text-center text-gray-500">
          Aún no hay acciones registradas.
        </div>
      ) : (
        <div className="tarjeta overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Administrador</th>
                <th className="px-4 py-3">Acción</th>
                <th className="px-4 py-3">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.id} className="border-b border-gray-100">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {new Date(r.creadoEn).toLocaleString("es-MX")}
                  </td>
                  <td className="px-4 py-3">
                    {r.admin ? (
                      <div>
                        <p className="font-medium">{r.admin.nombre}</p>
                        <p className="text-xs text-gray-400">{r.admin.email}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="etiqueta bg-[var(--color-secundario)]/10 text-[var(--color-secundario)]">
                      {r.accion}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.detalle || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
