import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tags,
  Newspaper,
  Users,
  ShoppingBag,
  Settings,
  Image,
  PanelLeft,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { BotonCerrarSesion } from "@/components/admin/boton-cerrar-sesion";

const enlaces = [
  { href: "/admin", etiqueta: "Dashboard", icono: LayoutDashboard },
  { href: "/admin/productos", etiqueta: "Productos", icono: Package },
  { href: "/admin/categorias", etiqueta: "Categorías", icono: Tags },
  { href: "/admin/banners", etiqueta: "Banners", icono: Image },
  { href: "/admin/menu-lateral", etiqueta: "Menú lateral", icono: PanelLeft },
  { href: "/admin/blog", etiqueta: "Blog", icono: Newspaper },
  { href: "/admin/clientes", etiqueta: "Clientes", icono: Users },
  { href: "/admin/pedidos", etiqueta: "Pedidos", icono: ShoppingBag },
  { href: "/admin/auditoria", etiqueta: "Auditoría", icono: ShieldCheck },
  { href: "/admin/configuracion", etiqueta: "Configuración", icono: Settings }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="flex w-64 shrink-0 flex-col bg-[var(--color-secundario)] text-white">
        <div className="border-b border-white/10 p-5">
          <p className="text-lg font-bold">Taller Creativo EK</p>
          <p className="text-xs text-white/60">Panel administrativo</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
            >
              <e.icono className="h-4 w-4" /> {e.etiqueta}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" /> Ver tienda
          </Link>
          <BotonCerrarSesion />
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-6 lg:p-8">{children}</main>
    </div>
  );
}
