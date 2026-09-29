"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usarCarrito, totalCarrito } from "@/lib/cart-store";
import { formatoMoneda } from "@/lib/format";

export function CheckoutCliente() {
  const router = useRouter();
  const { items, limpiar } = usarCarrito();
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");
  const [cp, setCp] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const subtotal = totalCarrito(items);
  const envio = 99;
  const impuesto = subtotal * 0.16;
  const total = subtotal + envio + impuesto;

  async function realizarPedido(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const direccionEnvio = `${direccion}, ${ciudad}, ${estado}, CP ${cp}${telefono ? ` — Tel: ${telefono}` : ""}`;

    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad, talla: i.talla })),
        direccionEnvio,
        metodoPago: "Tarjeta"
      })
    });

    if (res.status === 401) {
      router.push("/login?redirect=/checkout");
      return;
    }

    const data = await res.json();
    if (res.ok) {
      if (data.url) {
        // Pago con Stripe: redirige al Checkout alojado de Stripe.
        window.location.href = data.url;
        return;
      }
      limpiar();
      router.push(`/checkout/success?pedido=${data.pedidoId}&factura=${encodeURIComponent(data.factura || "")}`);
    } else {
      setError(data.error || "Error al procesar el pedido.");
      setCargando(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="tarjeta p-16 text-center">
        <p className="font-semibold">No hay productos para pagar.</p>
      </div>
    );
  }

  return (
    <form onSubmit={realizarPedido} className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="tarjeta space-y-4 p-6">
        <h2 className="text-lg font-bold">Datos de envío</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input" placeholder="Dirección (calle y número)" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
          <input className="input" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
          <input className="input" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} required />
          <input className="input" placeholder="Código postal" value={cp} onChange={(e) => setCp(e.target.value)} required />
          <input className="input sm:col-span-2" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={cargando} className="btn-primario w-full">
          {cargando ? "Procesando…" : `Pagar ahora — ${formatoMoneda(total)}`}
        </button>
        <p className="text-xs text-gray-500">
          Pago seguro con Stripe (tarjeta). Si Stripe no está configurado, se usa el modo simulado.
        </p>
      </div>

      <div className="tarjeta h-fit p-6">
        <h2 className="mb-4 text-lg font-bold">Resumen</h2>
        <div className="space-y-2 text-sm">
          {items.map((i) => (
            <div key={`${i.productoId}-${i.talla}`} className="flex justify-between">
              <span>{i.nombre} × {i.cantidad}</span>
              <span>{formatoMoneda(i.precio * i.cantidad)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatoMoneda(subtotal)}</span></div>
          <div className="flex justify-between"><span>IVA (16%)</span><span>{formatoMoneda(impuesto)}</span></div>
          <div className="flex justify-between"><span>Envío</span><span>{formatoMoneda(envio)}</span></div>
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatoMoneda(total)}</span></div>
        </div>
      </div>
    </form>
  );
}
