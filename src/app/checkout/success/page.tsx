import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";

export default function Exito({
  searchParams
}: {
  searchParams: { pedido?: string; factura?: string };
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="contenedor flex flex-1 items-center justify-center py-16">
        <div className="tarjeta flex flex-col items-center gap-4 p-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
          <h1 className="text-2xl font-bold">¡Gracias por tu compra!</h1>
          <p className="text-gray-600">
            Tu pedido se registró correctamente. Te enviamos la factura por correo.
          </p>
          {searchParams.factura && (
            <p className="rounded-lg bg-gray-100 px-4 py-2 text-sm">
              Factura: <span className="font-semibold">{searchParams.factura}</span>
            </p>
          )}
          <div className="mt-2 flex gap-3">
            <Link href="/cuenta/pedidos" className="btn-primario">Ver mis pedidos</Link>
            <Link href="/catalogo" className="btn-borde">Seguir comprando</Link>
          </div>
        </div>
      </main>
      <Pie />
    </div>
  );
}
