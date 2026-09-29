import { prisma } from "@/lib/db";
import { ListaClientes } from "@/components/admin/lista-clientes";

export const dynamic = "force-dynamic";

export default async function AdminClientes() {
  const usuarios = await prisma.usuario.findMany({
    where: { rol: { not: "ADMINISTRADOR" } },
    include: { pedidos: true },
    orderBy: { creadoEn: "desc" }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Clientes</h1>
      <p className="text-sm text-gray-500">
        Cambia el rol de un cliente a <strong>Distribuidor</strong> (solo tú, como administrador, puedes hacerlo).
      </p>
      <ListaClientes
        clientes={usuarios.map((u) => ({
          id: u.id,
          nombre: u.nombre,
          email: u.email,
          rol: u.rol,
          activo: u.activo,
          pedidos: u.pedidos.length,
          totalGastado: u.pedidos.reduce((acc, p) => acc + p.total, 0)
        }))}
      />
    </div>
  );
}
