import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";
import { registrarAuditoria } from "@/lib/auditoria";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const datos = await req.json();
  const {
    nombre,
    descripcion,
    numeroArticulo,
    color,
    precioMinorista,
    precioDistribuidor,
    stock,
    destacado,
    nuevo,
    liquidacion,
    activo,
    imagen,
    categorias = [],
    subcategorias = [],
    tallas = []
  } = datos;

  if (!nombre || !descripcion || precioMinorista == null || precioDistribuidor == null) {
    return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
  }

  const producto = await prisma.producto.create({
    data: {
      nombre,
      slug: slugify(nombre),
      descripcion,
      numeroArticulo: numeroArticulo || `ART-${Date.now()}`,
      color: color || null,
      precioMinorista: Number(precioMinorista),
      precioDistribuidor: Number(precioDistribuidor),
      stock: Number(stock) || 0,
      destacado: Boolean(destacado),
      nuevo: Boolean(nuevo),
      liquidacion: Boolean(liquidacion),
      activo: activo !== false,
      imagen: imagen || null,
      categorias: { connect: categorias.map((id: string) => ({ id })) },
      subcategorias: { connect: subcategorias.map((id: string) => ({ id })) },
      tallas: {
        create: (tallas as { nombre: string; stock: number; extra: number }[])
          .filter((t) => t.nombre)
          .map((t) => ({ nombre: t.nombre, stock: Number(t.stock) || 0, extra: Number(t.extra) || 0 }))
      }
    }
  });

  await registrarAuditoria(admin.id, "PRODUCTO_CREADO", `Producto "${nombre}" (#${producto.numeroArticulo})`);

  return NextResponse.json({ ok: true, id: producto.id });
}
