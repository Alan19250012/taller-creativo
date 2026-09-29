import Link from "next/link";
import { obtenerConfiguracion } from "@/lib/settings";
import { Phone, Mail } from "lucide-react";

export async function Pie() {
  const config = await obtenerConfiguracion();
  const nombre = config.nombre_empresa || "Taller Creativo EK";

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="contenedor grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 text-lg font-bold">{nombre}</h3>
          <p className="text-sm text-gray-600">
            Regalos personalizados y artículos creativos para toda ocasión.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Enlaces</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/catalogo" className="hover:text-[var(--color-primario)]">Catálogo</Link></li>
            <li><Link href="/blog" className="hover:text-[var(--color-primario)]">Blog</Link></li>
            <li><Link href="/cuenta" className="hover:text-[var(--color-primario)]">Mi cuenta</Link></li>
            <li><Link href="/privacidad" className="hover:text-[var(--color-primario)]">Aviso de privacidad</Link></li>
            <li><Link href="/terminos" className="hover:text-[var(--color-primario)]">Términos y condiciones</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Contacto</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            {config.telefono1 && (
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {config.telefono1}</li>
            )}
            {config.telefono2 && (
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {config.telefono2}</li>
            )}
            {config.correo && (
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {config.correo}</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Síguenos</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            {config.facebook && <a href={config.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-gray-100 px-3 py-1 hover:bg-[var(--color-primario)] hover:text-white">Facebook</a>}
            {config.instagram && <a href={config.instagram} target="_blank" rel="noreferrer" className="rounded-full bg-gray-100 px-3 py-1 hover:bg-[var(--color-primario)] hover:text-white">Instagram</a>}
            {config.pinterest && <a href={config.pinterest} target="_blank" rel="noreferrer" className="rounded-full bg-gray-100 px-3 py-1 hover:bg-[var(--color-primario)] hover:text-white">Pinterest</a>}
            {config.tiktok && <a href={config.tiktok} target="_blank" rel="noreferrer" className="rounded-full bg-gray-100 px-3 py-1 hover:bg-[var(--color-primario)] hover:text-white">TikTok</a>}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {nombre}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
