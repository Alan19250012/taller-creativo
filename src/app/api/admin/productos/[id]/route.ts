import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sesionAdmin } from "@/lib/admin";
import { registrarAuditoria } from "@/lib/auditoria";
import { slugify } from "@/lib/utils";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

  await prisma.talla.deleteMany({ where: { productoId: params.id } });

  const producto = await prisma.producto.update({
    where: { id: params.id },
    data: {
      nombre,
      slug: slugify(nombre),
      descripcion,
      numeroArticulo: numeroArticulo || undefined,
      color: color || null,
      precioMinorista: Number(precioMinorista),
      precioDistribuidor: Number(precioDistribuidor),
      stock: Number(stock) || 0,
      destacado: Boolean(destacado),
      nuevo: Boolean(nuevo),
      liquidacion: Boolean(liquidacion),
      activo: activo !== false,
      imagen: imagen || null,
      categorias: { set: categorias.map((id: string) => ({ id })) },
      subcategorias: { set: subcategorias.map((id: string) => ({ id })) },
      tallas: {
        create: (tallas as { nombre: string; stock: number; extra: number }[])
          .filter((t) => t.nombre)
          .map((t) => ({ nombre: t.nombre, stock: Number(t.stock) || 0, extra: Number(t.extra) || 0 }))
      }
    }
  });

  await registrarAuditoria(admin.id, "PRODUCTO_EDITADO", `Producto "${nombre}" (id ${params.id})`);

  return NextResponse.json({ ok: true, id: producto.id });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  await prisma.producto.delete({ where: { id: params.id } }).catch(() => null);
  await registrarAuditoria(admin.id, "PRODUCTO_ELIMINADO", `Producto id ${params.id}`);

  return NextResponse.json({ ok: true });
}
