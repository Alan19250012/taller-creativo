"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatoMoneda } from "@/lib/format";

interface Cliente {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  totalGastado: number;
  pedidos: number;
}

export function ListaClientes({ clientes: iniciales }: { clientes: Cliente[] }) {
  const router = useRouter();
  const [clientes, setClientes] = useState(iniciales);

  async function cambiar(id: string, cambios: Partial<Cliente>) {
    setClientes((cs) => cs.map((c) => (c.id === id ? { ...c, ...cambios } : c)));
    await fetch(`/api/admin/clientes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cambios)
    });
    router.refresh();
  }

  return (
    <div className="tarjeta overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="p-3">Cliente</th>
            <th className="p-3">Rol</th>
            <th className="p-3">Pedidos</th>
            <th className="p-3">Total gastado</th>
            <th className="p-3">Activo</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id} className="border-b border-gray-100">
              <td className="p-3">
                <p className="font-medium">{c.nombre}</p>
                <p className="text-xs text-gray-500">{c.email}</p>
              </td>
              <td className="p-3">
                <select
                  value={c.rol}
                  onChange={(e) => cambiar(c.id, { rol: e.target.value })}
                  className={`input w-auto ${
                    c.rol === "DISTRIBUIDOR" ? "border-[var(--color-secundario)] text-[var(--color-secundario)]" : ""
                  }`}
                >
                  <option value="CLIENTE">Cliente estándar</option>
                  <option value="DISTRIBUIDOR">Distribuidor</option>
                </select>
              </td>
              <td className="p-3">{c.pedidos}</td>
              <td className="p-3">{formatoMoneda(c.totalGastado)}</td>
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={c.activo}
                  onChange={(e) => cambiar(c.id, { activo: e.target.checked })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
