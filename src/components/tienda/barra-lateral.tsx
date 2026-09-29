import Link from "next/link";
import { TrendingUp, Sparkles, FolderTree } from "lucide-react";
import { formatoMoneda } from "@/lib/format";

interface CategoriaLateral {
  slug: string;
  nombre: string;
  subcategorias: { slug: string; nombre: string }[];
}

interface TendenciaLateral {
  slug: string;
  nombre: string;
  ventas: number;
}

interface DestacadoLateral {
  id: string;
  slug: string;
  nombre: string;
  imagen: string | null;
  precioMinorista: number;
  precioDistribuidor: number;
}

export function BarraLateral({
  categorias,
  tendencias,
  destacados,
  rol
}: {
  categorias: CategoriaLateral[];
  tendencias: TendenciaLateral[];
  destacados: DestacadoLateral[];
  rol: string | null;
}) {
  const esDistribuidor = rol === "DISTRIBUIDOR" || rol === "ADMINISTRADOR";

  return (
    <aside className="hidden space-y-5 lg:block">
      {/* Categorías */}
      {categorias.length > 0 && (
        <div className="tarjeta p-5">
          <h3 className="mb-3 flex items-center gap-2 font-bold">
            <FolderTree className="h-4 w-4 text-[var(--color-primario)]" /> Categorías
          </h3>
          <ul className="space-y-1 text-sm">
            {categorias.map((c) => (
              <li key={c.slug}>
                <Link href={`/categoria/${c.slug}`} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-gray-50 hover:text-[var(--color-primario)]">
                  <span>{c.nombre}</span>
                  <span className="text-xs text-gray-400">{c.subcategorias.length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tendencias (subcategorías por ventas) */}
      {tendencias.length > 0 && (
        <div className="tarjeta p-5">
          <h3 className="mb-3 flex items-center gap-2 font-bold">
            <TrendingUp className="h-4 w-4 text-[var(--color-primario)]" /> En tendencia
          </h3>
          <ul className="space-y-1 text-sm">
            {tendencias.map((t) => (
              <li key={t.slug}>
                <Link href={`/catalogo?subcategoria=${t.slug}`} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-gray-50 hover:text-[var(--color-primario)]">
                  <span>{t.nombre}</span>
                  <span className="text-xs text-gray-400">{t.ventas} vendidos</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Productos destacados */}
      {destacados.length > 0 && (
        <div className="tarjeta p-5">
          <h3 className="mb-3 flex items-center gap-2 font-bold">
            <Sparkles className="h-4 w-4 text-[var(--color-primario)]" /> Destacados
          </h3>
          <div className="space-y-3">
            {destacados.map((d) => (
              <Link key={d.id} href={`/producto/${d.slug}`} className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {d.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.imagen} alt={d.nombre} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">📦</div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium">{d.nombre}</p>
                  <p className="text-sm font-semibold text-[var(--color-primario)]">
                    {formatoMoneda(esDistribuidor ? d.precioDistribuidor : d.precioMinorista)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
