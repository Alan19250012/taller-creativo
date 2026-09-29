import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";
import { CheckoutCliente } from "@/components/tienda/checkout-cliente";

export default function Checkout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="contenedor flex-1 py-8">
        <h1 className="mb-6 text-2xl font-bold">Finalizar compra</h1>
        <CheckoutCliente />
      </main>
      <Pie />
    </div>
  );
}
