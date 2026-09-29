"use client";

import { useRouter } from "next/navigation";

const ESTADOS = ["PENDIENTE", "PAGADO", "EN_PREPARACION", "ENVIADO", "ENTREGADO", "CANCELADO", "REEMBOLSADO"];

export function SelectorEstadoPedido({ pedidoId, estado }: { pedidoId: string; estado: string }) {
  const router = useRouter();

  async function cambiar(nuevoEstado: string) {
    await fetch(`/api/admin/pedidos/${pedidoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    router.refresh();
  }

  return (
    <select value={estado} onChange={(e) => cambiar(e.target.value)} className="input w-auto">
      {ESTADOS.map((e) => (
        <option key={e} value={e}>{e}</option>
      ))}
    </select>
  );
}
