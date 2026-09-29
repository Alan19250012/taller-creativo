-- ============================================================
--  Esquema SQL de la tienda Taller Creativo EK (PostgreSQL/Supabase)
--  Pega este archivo completo en: Supabase → SQL Editor → New query → Run
--  Claves primarias en UUID (SQL nativo), generadas por defecto.
-- ============================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Utilidad: convierte un texto legible en un UUID determinista.
-- Permite que los scripts de seed referencien ids estables sin perder UUID.
CREATE OR REPLACE FUNCTION ek_uuid(seed text) RETURNS uuid
LANGUAGE sql IMMUTABLE AS $$ SELECT md5(seed)::uuid $$;

-- ── Usuario ────────────────────────────────────────────────────
CREATE TABLE "Usuario" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "contrasena" TEXT NOT NULL,
  "rol" TEXT NOT NULL DEFAULT 'CLIENTE',
  "telefono" TEXT,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- ── CambioRol (auditoría) ──────────────────────────────────────
CREATE TABLE "CambioRol" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "usuarioId" UUID NOT NULL,
  "rolAnterior" TEXT NOT NULL,
  "rolNuevo" TEXT NOT NULL,
  "adminId" UUID,
  "motivo" TEXT,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CambioRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ── Direccion ──────────────────────────────────────────────────
CREATE TABLE "Direccion" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "usuarioId" UUID NOT NULL,
  "calle" TEXT NOT NULL,
  "ciudad" TEXT NOT NULL,
  "estado" TEXT NOT NULL,
  "cp" TEXT NOT NULL,
  "pais" TEXT NOT NULL DEFAULT 'México',
  CONSTRAINT "Direccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ── Categoria ──────────────────────────────────────────────────
CREATE TABLE "Categoria" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "descripcion" TEXT,
  "imagen" TEXT,
  "orden" INTEGER NOT NULL DEFAULT 0,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "esPrincipal" BOOLEAN NOT NULL DEFAULT true
);
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");
CREATE UNIQUE INDEX "Categoria_slug_key" ON "Categoria"("slug");

-- ── Subcategoria (con jerarquía padre/hija) ────────────────────
CREATE TABLE "Subcategoria" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "orden" INTEGER NOT NULL DEFAULT 0,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "padreId" UUID,
  CONSTRAINT "Subcategoria_padreId_fkey" FOREIGN KEY ("padreId") REFERENCES "Subcategoria"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Subcategoria_slug_key" ON "Subcategoria"("slug");

-- ── Producto ───────────────────────────────────────────────────
CREATE TABLE "Producto" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "descripcion" TEXT NOT NULL,
  "numeroArticulo" TEXT NOT NULL,
  "color" TEXT,
  "destacado" BOOLEAN NOT NULL DEFAULT false,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "nuevo" BOOLEAN NOT NULL DEFAULT false,
  "liquidacion" BOOLEAN NOT NULL DEFAULT false,
  "precioMinorista" DOUBLE PRECISION NOT NULL,
  "precioDistribuidor" DOUBLE PRECISION NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "vendidos" INTEGER NOT NULL DEFAULT 0,
  "calificacion" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "imagen" TEXT,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "Producto_slug_key" ON "Producto"("slug");
CREATE UNIQUE INDEX "Producto_numeroArticulo_key" ON "Producto"("numeroArticulo");

-- ── Talla ──────────────────────────────────────────────────────
CREATE TABLE "Talla" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "productoId" UUID NOT NULL,
  "nombre" TEXT NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "extra" DOUBLE PRECISION NOT NULL DEFAULT 0,
  CONSTRAINT "Talla_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ── Resena ─────────────────────────────────────────────────────
CREATE TABLE "Resena" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "productoId" UUID NOT NULL,
  "usuarioId" UUID NOT NULL,
  "estrellas" INTEGER NOT NULL,
  "comentario" TEXT NOT NULL,
  "aprobada" BOOLEAN NOT NULL DEFAULT false,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Resena_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Resena_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ── Pedido ─────────────────────────────────────────────────────
CREATE TABLE "Pedido" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "usuarioId" UUID NOT NULL,
  "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
  "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "impuesto" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "envio" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "direccionEnvio" TEXT,
  "metodoPago" TEXT,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Pedido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ── DetallePedido ──────────────────────────────────────────────
CREATE TABLE "DetallePedido" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "pedidoId" UUID NOT NULL,
  "productoId" UUID NOT NULL,
  "cantidad" INTEGER NOT NULL,
  "precioUnitario" DOUBLE PRECISION NOT NULL,
  "tipoPrecio" TEXT NOT NULL,
  "talla" TEXT,
  CONSTRAINT "DetallePedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "DetallePedido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ── Factura ────────────────────────────────────────────────────
CREATE TABLE "Factura" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "numero" TEXT NOT NULL,
  "pedidoId" UUID NOT NULL,
  "pdfUrl" TEXT,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Factura_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Factura_numero_key" ON "Factura"("numero");
CREATE UNIQUE INDEX "Factura_pedidoId_key" ON "Factura"("pedidoId");

-- ── Articulo (blog) ────────────────────────────────────────────
CREATE TABLE "Articulo" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "titulo" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "resumen" TEXT,
  "contenido" TEXT NOT NULL,
  "imagen" TEXT,
  "publicado" BOOLEAN NOT NULL DEFAULT false,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "Articulo_slug_key" ON "Articulo"("slug");

-- ── Banner ─────────────────────────────────────────────────────
CREATE TABLE "Banner" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "titulo" TEXT NOT NULL,
  "subtitulo" TEXT,
  "imagen" TEXT,
  "enlace" TEXT,
  "orden" INTEGER NOT NULL DEFAULT 0,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── Configuracion (clave-valor) ────────────────────────────────
CREATE TABLE "Configuracion" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "clave" TEXT NOT NULL,
  "valor" TEXT NOT NULL
);
CREATE UNIQUE INDEX "Configuracion_clave_key" ON "Configuracion"("clave");

-- ── Auditoria (bitácora de acciones de administradores) ─────────
CREATE TABLE "Auditoria" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "adminId" UUID,
  "accion" TEXT NOT NULL,
  "detalle" TEXT,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Auditoria_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ── Tablas puente (relaciones muchos-a-muchos de Prisma) ───────
CREATE TABLE "_CategoriaToProducto" (
  "A" UUID NOT NULL,
  "B" UUID NOT NULL,
  CONSTRAINT "_CategoriaToProducto_AB_pkey" PRIMARY KEY ("A","B")
);
CREATE INDEX "_CategoriaToProducto_B_index" ON "_CategoriaToProducto"("B");
ALTER TABLE "_CategoriaToProducto" ADD CONSTRAINT "_CategoriaToProducto_A_fkey" FOREIGN KEY ("A") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CategoriaToProducto" ADD CONSTRAINT "_CategoriaToProducto_B_fkey" FOREIGN KEY ("B") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_ProductoToSubcategoria" (
  "A" UUID NOT NULL,
  "B" UUID NOT NULL,
  CONSTRAINT "_ProductoToSubcategoria_AB_pkey" PRIMARY KEY ("A","B")
);
CREATE INDEX "_ProductoToSubcategoria_B_index" ON "_ProductoToSubcategoria"("B");
ALTER TABLE "_ProductoToSubcategoria" ADD CONSTRAINT "_ProductoToSubcategoria_A_fkey" FOREIGN KEY ("A") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ProductoToSubcategoria" ADD CONSTRAINT "_ProductoToSubcategoria_B_fkey" FOREIGN KEY ("B") REFERENCES "Subcategoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_CategoriaToSubcategoria" (
  "A" UUID NOT NULL,
  "B" UUID NOT NULL,
  CONSTRAINT "_CategoriaToSubcategoria_AB_pkey" PRIMARY KEY ("A","B")
);
CREATE INDEX "_CategoriaToSubcategoria_B_index" ON "_CategoriaToSubcategoria"("B");
ALTER TABLE "_CategoriaToSubcategoria" ADD CONSTRAINT "_CategoriaToSubcategoria_A_fkey" FOREIGN KEY ("A") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CategoriaToSubcategoria" ADD CONSTRAINT "_CategoriaToSubcategoria_B_fkey" FOREIGN KEY ("B") REFERENCES "Subcategoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
--  DATOS MÍNIMOS DE ARRANQUE
-- ============================================================

-- Configuración de la tienda
INSERT INTO "Configuracion" ("clave","valor") VALUES
('nombre_empresa','Taller Creativo EK'),
('color_primario','#DA1D2A'),
('color_secundario','#244093'),
('telefono1','55 1234 5678'),
('telefono2',''),
('correo','contacto@tallercreativoek.com'),
('facebook','https://facebook.com/tallercreativoek'),
('instagram','https://instagram.com/tallercreativoek'),
('pinterest','https://pinterest.com/tallercreativoek'),
('tiktok','https://tiktok.com/@tallercreativoek'),
('whatsapp','https://wa.me/525512345678'),
('logo_url',''),
('favicon_url','')
ON CONFLICT ("clave") DO NOTHING;

-- Usuario administrador (contraseña "admin123" con hash bcrypt vía pgcrypto)
INSERT INTO "Usuario" ("nombre","email","contrasena","rol","activo","creadoEn")
VALUES ('Administrador','admin@ek.com', crypt('admin123', gen_salt('bf', 10)), 'ADMINISTRADOR', true, now())
ON CONFLICT ("email") DO NOTHING;

-- ============================================================
--  NOTA:
--  Las categorías, subcategorías, productos y banners completos
--  se cargan con:  npm run db:seed  (prisma/seed.ts)
--  o con el archivo supabase/seed.sql (usa ek_uuid()).
-- ============================================================
