import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";
import { CarritoCliente } from "@/components/tienda/carrito-cliente";

export default function Carrito() {
  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="contenedor flex-1 py-8">
        <h1 className="mb-6 text-2xl font-bold">Tu carrito</h1>
        <CarritoCliente />
      </main>
      <Pie />
    </div>
  );
}
