import { Prisma } from "@prisma/client";
import { prisma } from "./db";

// Lógica compartida del catálogo: leer los parámetros de búsqueda, construir el
// WHERE y el ORDER BY de Prisma, y obtener las opciones de los filtros. La usan
// tanto /catalogo como /categoria/[slug], para que el comportamiento sea idéntico.

export type Parametros = Record<string, string | string[] | undefined>;

export function texto(sp: Parametros, clave: string): string | undefined {
  const v = sp[clave];
  return typeof v === "string" && v !== "" ? v : undefined;
}

export interface Filtros {
  q?: string;
  categoria?: string;
  subcategoria?: string;
  color?: string;
  talla?: string;
  orden?: string;
  enStock: boolean;
  liquidacion: boolean;
  destacado: boolean;
  precioMin?: number;
  precioMax?: number;
}

export function leerFiltros(sp: Parametros, categoriaFija?: string): Filtros {
  const precioMinRaw = texto(sp, "precioMin");
  const precioMaxRaw = texto(sp, "precioMax");

  return {
    q: texto(sp, "q"),
    categoria: categoriaFija ?? texto(sp, "categoria"),
    subcategoria: texto(sp, "subcategoria"),
    color: texto(sp, "color"),
    talla: texto(sp, "talla"),
    orden: texto(sp, "orden"),
    enStock: sp.enStock === "1",
    liquidacion: sp.liquidacion === "1",
    destacado: sp.destacado === "1",
    precioMin: precioMinRaw ? parseFloat(precioMinRaw) : undefined,
    precioMax: precioMaxRaw ? parseFloat(precioMaxRaw) : undefined
  };
}

export function construirWhere(f: Filtros, colPrecio: string): Prisma.ProductoWhereInput {
  const where: Prisma.ProductoWhereInput = { activo: true };

  if (f.q) where.OR = [{ nombre: { contains: f.q } }, { descripcion: { contains: f.q } }];
  if (f.categoria) where.categorias = { some: { slug: f.categoria } };
  if (f.subcategoria) where.subcategorias = { some: { slug: f.subcategoria } };
  if (f.color) where.color = f.color;
  if (f.talla) where.tallas = { some: { nombre: f.talla } };
  if (f.enStock) where.stock = { gt: 0 };
  if (f.liquidacion) where.liquidacion = true;
  if (f.destacado) where.destacado = true;

  if (f.precioMin != null || f.precioMax != null) {
    const rango: Prisma.FloatFilter = {};
    if (f.precioMin != null) rango.gte = f.precioMin;
    if (f.precioMax != null) rango.lte = f.precioMax;
    (where as Record<string, unknown>)[colPrecio] = rango;
  }

  return where;
}

export function construirOrderBy(
  orden: string | undefined,
  colPrecio: string
): Prisma.ProductoOrderByWithRelationInput {
  switch (orden) {
    case "vendidos":
      return { vendidos: "desc" };
    case "precio-asc":
      return { [colPrecio]: "asc" } as Prisma.ProductoOrderByWithRelationInput;
    case "precio-desc":
      return { [colPrecio]: "desc" } as Prisma.ProductoOrderByWithRelationInput;
    case "nuevos":
      return { creadoEn: "desc" };
    case "calificacion":
      return { calificacion: "desc" };
    case "nombre":
      return { nombre: "asc" };
    default:
      return { creadoEn: "desc" };
  }
}

export interface CategoriaFiltro {
  slug: string;
  nombre: string;
  subcategorias: { slug: string; nombre: string }[];
}

export interface OpcionesFiltros {
  categorias: CategoriaFiltro[];
  colores: string[];
  tallas: string[];
}

// Opciones de los filtros. Si se pasa una categoría fija, los colores y las tallas
// se limitan a los productos de esa categoría (evita ofrecer opciones vacías).
export async function obtenerOpcionesFiltros(categoriaFija?: string): Promise<OpcionesFiltros> {
  const productosDeCategoria = categoriaFija
    ? { activo: true, categorias: { some: { slug: categoriaFija } } }
    : { activo: true };

  const [categorias, colores, tallas] = await Promise.all([
    prisma.categoria.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
      include: { subcategorias: { where: { activo: true }, orderBy: { orden: "asc" } } }
    }),
    prisma.producto.findMany({
      where: { ...productosDeCategoria, color: { not: null } },
      select: { color: true },
      distinct: ["color"]
    }),
    prisma.talla.findMany({
      where: { producto: productosDeCategoria },
      select: { nombre: true },
      distinct: ["nombre"]
    })
  ]);

  return {
    categorias: categorias.map((c) => ({
      slug: c.slug,
      nombre: c.nombre,
      subcategorias: c.subcategorias.map((s) => ({ slug: s.slug, nombre: s.nombre }))
    })),
    colores: colores.map((c) => c.color).filter((c): c is string => Boolean(c)).sort(),
    tallas: tallas.map((t) => t.nombre).sort()
  };
}
