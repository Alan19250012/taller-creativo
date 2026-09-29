import Link from "next/link";
import { obtenerSesion } from "@/lib/auth";
import { Encabezado } from "@/components/tienda/encabezado";
import { Pie } from "@/components/tienda/pie";
import { User, Package } from "lucide-react";

export default async function CuentaLayout({ children }: { children: React.ReactNode }) {
  const sesion = await obtenerSesion();

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="contenedor flex-1 py-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit space-y-1">
            <p className="mb-3 font-semibold">Hola, {sesion?.nombre}</p>
            <Link href="/cuenta" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <User className="h-4 w-4" /> Resumen
            </Link>
            <Link href="/cuenta/pedidos" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
              <Package className="h-4 w-4" /> Mis pedidos
            </Link>
          </aside>
          <div>{children}</div>
        </div>
      </main>
      <Pie />
    </div>
  );
}
