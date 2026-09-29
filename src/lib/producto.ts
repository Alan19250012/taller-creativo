import type { Producto } from "@prisma/client";
import type { DatosProductoTarjeta } from "@/components/tienda/tarjeta-producto";

export function aTarjeta(p: Producto): DatosProductoTarjeta {
  return {
    id: p.id,
    slug: p.slug,
    nombre: p.nombre,
    imagen: p.imagen,
    precioMinorista: p.precioMinorista,
    precioDistribuidor: p.precioDistribuidor,
    calificacion: p.calificacion,
    stock: p.stock,
    color: p.color,
    destacado: p.destacado,
    nuevo: p.nuevo,
    liquidacion: p.liquidacion
  };
}
