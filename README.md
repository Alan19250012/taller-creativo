# Taller Creativo EK — Tienda en línea (Vercel + Supabase)

Tienda online completa, **lista para desplegar en Vercel** y con **Supabase** como base de datos PostgreSQL y almacenamiento de imágenes.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend + API | Next.js 14 (App Router, rutas API) en **Vercel** |
| Base de datos | **Supabase** (PostgreSQL) + Prisma |
| Almacenamiento | **Supabase Storage** (logo, favicon, productos, banners, blog) |
| Autenticación | JWT (jose) + bcrypt (roles: cliente / distribuidor / administrador) |
| Correos | Resend (factura PDF con pdfkit) |
| Pagos | **Stripe Checkout** (webhook de confirmación) + fallback simulado |
| Pruebas | Vitest (unitarias) |

## Características principales

- **Precios por rol**: el cliente estándar ve solo el precio minorista; el distribuidor ve ambos. El cambio a distribuidor **solo lo hace el administrador** (con auditoría en `CambioRol`).
- **Panel administrativo completo** (`/admin`): dashboard, productos (precios dobles, tallas, stock), categorías/subcategorías, blog 100 % editable, clientes (cambio de rol), pedidos (cambios de estado), banners (cambio automático), menú lateral y configuración del sitio.
- **Personalización visual**: logo, favicon y colores (#DA1D2A y #244093) editables desde el panel.
- **Filtros completos** del catálogo, **barra lateral** con tendencias, **carrusel de banners** automático.
- **Factura PDF** generada automáticamente y enviada por correo (Resend).
- **Base de datos segura**: claves primarias **UUID** nativas, contraseñas con bcrypt, precios calculados en el servidor, validación y descuento de stock **atómico** (transacción), limitación de intentos (anti fuerza bruta) y protección de rutas por rol.
- **SEO completo**: `sitemap.xml`, `robots.txt`, manifest PWA, Open Graph/Twitter, imagen OG automática, metadatos por página y datos estructurados JSON-LD (Organization + Product).
- **Animaciones**: carrusel de banners automático, tarjetas con hover, revelado al hacer scroll y transiciones suaves (Framer Motion).
- **Bitácora de auditoría** (`/admin/auditoria`): registra las acciones de los administradores (quién, qué y cuándo).
- **Páginas legales**: Aviso de privacidad (`/privacidad`) y Términos y condiciones (`/terminos`).
- **KPIs del dashboard**: ticket promedio, margen bruto y tasa de pedidos completados.
- **Contenerización y CI**: `Dockerfile`, `docker-compose.yml` y flujo de CI en GitHub Actions (typecheck + tests + build).

---

## 1. Configurar Supabase

1. Crea un proyecto en https://supabase.com (gratis).
2. En **Project Settings → Database → Connection string**, copia la cadena **"Session pooler"** o **"Direct connection"** (URL con puerto `5432`). La usarás en `DATABASE_URL`. Es la que permite `prisma db push`, `db seed` y las **transacciones interactivas** (validación de stock). El *Transaction pooler* (6543) solo es útil a escala en serverless y **no** soporta transacciones interactivas ni migraciones.
3. En **Project Settings → API**, copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
4. Crea un **bucket público** para imágenes:
   - Ve a **Storage → New bucket**, nombre `imagenes`.
   - Marca el bucket como **Public**.

## 2. Variables de entorno

Copia `.env.example` a `.env` y completa:

```env
DATABASE_URL="postgresql://...pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://TU-PROYECTO.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
SUPABASE_BUCKET="imagenes"
JWT_SECRET="cambia-este-secreto"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
RESEND_API_KEY=""
EMAIL_FROM="Taller Creativo EK <pedidos@tudominio.com>"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

## 3. Ejecutar localmente

```bash
cd TallerC
npm install
npm run db:push      # crea las tablas en Supabase (PostgreSQL)
npm run db:seed      # carga categorías, productos, banners y usuarios de ejemplo
npm run dev
```

Abre http://localhost:3000

### Credenciales de ejemplo (creadas por el seed)

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@ek.com | admin123 |
| Distribuidor | distribuidor@ek.com | admin123 |
| Cliente | cliente@ek.com | admin123 |

Panel: http://localhost:3000/admin

## 4. Desplegar en Vercel

1. Sube esta carpeta a un repositorio de GitHub/GitLab.
2. En https://vercel.com → **Add New → Project** → importa el repositorio.
3. Framework: **Next.js**. No necesitas cambiar el build command (usa el `package.json`).
4. En **Environment Variables**, define las mismas variables de la sección 2 (con los valores de producción).
5. Despliega. Vercel ejecutará `npm install` (con `prisma generate`) y `npm run build` automáticamente.

> ⚠️ **Migraciones en producción**: antes de desplegar, crea las tablas en Supabase ejecutando `npm run db:push` y `npm run db:seed` desde tu máquina apuntando a la base de producción. También puedes hacerlo desde una consola con `DATABASE_URL` de producción.

6. Configura tu **dominio** en Vercel (Project Settings → Domains).

## 5. Correos (Resend)

1. Crea cuenta en https://resend.com y verifica tu dominio (SPF/DKIM).
2. Define `RESEND_API_KEY` y `CORREO_REMITENTE` en las variables de Vercel.
3. Si `RESEND_API_KEY` está vacía, los correos se registran en consola (modo simulado).

## 6. Pagos (Stripe)

El checkout usa **Stripe Checkout** (pago con tarjeta) cuando `STRIPE_SECRET_KEY` está definida:

1. El cliente crea el pedido (estado `PENDIENTE`) y recibe una URL de pago de Stripe.
2. Al pagar, Stripe llama al **webhook** `POST /api/pagos/webhook`, que verifica la firma y completa el pedido (marca `PAGADO`, descuenta stock, emite la factura PDF y la envía por correo).

Configura en `.env`:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET` (configura el endpoint del webhook en el dashboard de Stripe apuntando a `https://tu-dominio/api/pagos/webhook`)

Si `STRIPE_SECRET_KEY` está vacía, el checkout usa **pago simulado** (para desarrollo local sin claves).

## 7. Pruebas

```bash
npm test        # ejecuta las pruebas unitarias con Vitest
```

## 8. Docker y CI

- **Docker**: `Dockerfile` (imagen de producción) y `docker-compose.yml` (PostgreSQL + app) para desarrollo.
- **CI**: `.github/workflows/ci.yml` ejecuta typecheck, pruebas y build en cada push/PR.

## Notas sobre Vercel

- **Sistema de archivos de solo lectura**: las imágenes se suben a **Supabase Storage** (no al disco). La ruta `src/app/api/admin/subir/route.ts` ya usa Supabase Storage cuando `SUPABASE_URL` está definida; si no, usa el disco local (solo útil en desarrollo).
- **`serverComponentsExternalPackages`**: ya configurado para `pdfkit`, `@prisma/client` y `bcryptjs`, necesarios en funciones serverless.
- El modelo de datos está en español: `Usuario`, `Producto`, `Categoria`, `Subcategoria`, `Pedido`, `DetallePedido`, `Factura`, `Articulo`, `Banner`, `Configuracion`, `CambioRol`, `Talla`, `Resena`, `Direccion`.
