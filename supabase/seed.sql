-- ============================================================
--  DATOS DE PRUEBA — Taller Creativo EK
--  Ejecuta ESTE archivo DESPUÉS de schema.sql
--  (Supabase → SQL Editor → pegar → Run)
--  Los ids usan ek_uuid() para ser UUID válidos y deterministas.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE OR REPLACE FUNCTION ek_uuid(seed text) RETURNS uuid
LANGUAGE sql IMMUTABLE AS $$ SELECT md5(seed)::uuid $$;

-- ── Usuarios (contraseña: admin123) ───────────────────────────
INSERT INTO "Usuario" ("id","nombre","email","contrasena","rol","activo","creadoEn") VALUES
(ek_uuid('usr-admin'),'Administrador','admin@ek.com', crypt('admin123', gen_salt('bf', 10)), 'ADMINISTRADOR', true, now()),
(ek_uuid('usr-dist'),'Cliente Distribuidor','distribuidor@ek.com', crypt('admin123', gen_salt('bf', 10)), 'DISTRIBUIDOR', true, now()),
(ek_uuid('usr-cliente'),'Cliente Estándar','cliente@ek.com', crypt('admin123', gen_salt('bf', 10)), 'CLIENTE', true, now())
ON CONFLICT ("email") DO NOTHING;

-- ── Categorías principales (10) ───────────────────────────────
INSERT INTO "Categoria" ("id","nombre","slug","descripcion","orden","activo","esPrincipal") VALUES
(ek_uuid('cat-halloween'),'Halloween','halloween','Decoración y regalos de Halloween',0,true,true),
(ek_uuid('cat-ocasiones'),'Ocasiones','ocasiones','Regalos para toda ocasión',1,true,true),
(ek_uuid('cat-wedding'),'Wedding','wedding','Regalos y recuerdos de boda',2,true,true),
(ek_uuid('cat-memorial'),'Memorial','memorial','Recuerdos conmemorativos',3,true,true),
(ek_uuid('cat-himher'),'Him & Her','him-her','Regalos para él y para ella',4,true,true),
(ek_uuid('cat-babykids'),'Baby & Kids','baby-kids','Regalos para bebés y niños',5,true,true),
(ek_uuid('cat-home'),'Home','home','Artículos para el hogar',6,true,true),
(ek_uuid('cat-photo'),'Photo','photo','Regalos personalizados con foto',7,true,true),
(ek_uuid('cat-brand'),'By Brand','by-brand','Por marca y licencias',8,true,true),
(ek_uuid('cat-business'),'Business','business','Regalos corporativos',9,true,true);

-- ── Subcategorías (slug único, prefijo por categoría) ─────────
INSERT INTO "Subcategoria" ("id","nombre","slug","orden","activo") VALUES
-- Halloween
(ek_uuid('sub-hw-destacados'),'Destacados','hw-destacados',0,true),
(ek_uuid('sub-hw-novedades'),'Novedades','hw-novedades',1,true),
(ek_uuid('sub-hw-mas-vendidos'),'Los más vendidos','hw-mas-vendidos',2,true),
(ek_uuid('sub-hw-calabazas'),'Calabazas con luz','hw-calabazas-con-luz',3,true),
(ek_uuid('sub-hw-coleccion'),'Por colección','hw-coleccion',4,true),
(ek_uuid('sub-hw-ninos'),'Para niños','hw-para-ninos',5,true),
(ek_uuid('sub-hw-decoracion'),'Decoración para el hogar','hw-decoracion-hogar',6,true),
(ek_uuid('sub-hw-peanuts'),'PEANUTS®','hw-peanuts',7,true),
(ek_uuid('sub-hw-bolsas-dulces'),'Bolsas para dulces','hw-bolsas-dulces',8,true),
-- Ocasiones
(ek_uuid('sub-oc-temporada'),'De temporada','oc-de-temporada',0,true),
(ek_uuid('sub-oc-cotidianas'),'Ocasiones cotidianas','oc-cotidianas',1,true),
(ek_uuid('sub-oc-bodas'),'Bodas','oc-bodas',2,true),
(ek_uuid('sub-oc-regreso-clases'),'Regreso a clases','oc-regreso-clases',3,true),
(ek_uuid('sub-oc-halloween'),'Halloween','oc-halloween',4,true),
(ek_uuid('sub-oc-navidad'),'Navidad','oc-navidad',5,true),
(ek_uuid('sub-oc-dia-madre'),'Día de la Madre','oc-dia-madre',6,true),
(ek_uuid('sub-oc-graduacion'),'Graduación','oc-graduacion',7,true),
(ek_uuid('sub-oc-cumpleanos'),'Cumpleaños','oc-cumpleanos',8,true),
(ek_uuid('sub-oc-aniversario'),'Aniversario','oc-aniversario',9,true),
(ek_uuid('sub-oc-baby-shower'),'Baby Shower','oc-baby-shower',10,true),
(ek_uuid('sub-oc-recien-nacido'),'Recién nacido','oc-recien-nacido',11,true),
(ek_uuid('sub-oc-comunion'),'Primera Comunión','oc-primera-comunion',12,true),
-- Wedding
(ek_uuid('sub-wd-destacados'),'Destacados','wd-destacados',0,true),
(ek_uuid('sub-wd-novedades'),'Novedades','wd-novedades',1,true),
(ek_uuid('sub-wd-mas-vendidos'),'Los más vendidos','wd-mas-vendidos',2,true),
(ek_uuid('sub-wd-papel-regalo'),'Papel de regalo','wd-papel-regalo',3,true),
(ek_uuid('sub-wd-destinatario'),'Por destinatario','wd-destinatario',4,true),
(ek_uuid('sub-wd-evento'),'Por colección / Evento','wd-evento',5,true),
(ek_uuid('sub-wd-ideas-regalo'),'Ideas de regalo','wd-ideas-regalo',6,true),
(ek_uuid('sub-wd-cajas-relojes'),'Cajas para relojes','wd-cajas-relojes',7,true),
(ek_uuid('sub-wd-copas-vino'),'Copas de vino','wd-copas-vino',8,true),
(ek_uuid('sub-wd-bar-vino'),'Bar y vino','wd-bar-vino',9,true),
-- Memorial
(ek_uuid('sub-mm-destacados'),'Destacados','mm-destacados',0,true),
(ek_uuid('sub-mm-novedades'),'Novedades','mm-novedades',1,true),
(ek_uuid('sub-mm-mas-vendidos'),'Los más vendidos','mm-mas-vendidos',2,true),
(ek_uuid('sub-mm-militar'),'Militar','mm-militar',3,true),
(ek_uuid('sub-mm-urnas'),'Urnas','mm-urnas',4,true),
(ek_uuid('sub-mm-velas'),'Velas y faroles','mm-velas-faroles',5,true),
(ek_uuid('sub-mm-piedras'),'Piedras para jardín','mm-piedras-jardin',6,true),
(ek_uuid('sub-mm-campanas'),'Campanas de viento','mm-campanas-viento',7,true),
(ek_uuid('sub-mm-mascotas'),'Mascotas','mm-mascotas',8,true),
(ek_uuid('sub-mm-fotos'),'Fotos','mm-fotos',9,true),
-- Him & Her
(ek_uuid('sub-hh-ocasion'),'Por ocasión','hh-ocasion',0,true),
(ek_uuid('sub-hh-destinatario'),'Por destinatario','hh-destinatario',1,true),
(ek_uuid('sub-hh-coleccion'),'Por colección','hh-coleccion',2,true),
(ek_uuid('sub-hh-aire-libre'),'Vida al aire libre','hh-aire-libre',3,true),
(ek_uuid('sub-hh-tazas'),'Tazas','hh-tazas',4,true),
(ek_uuid('sub-hh-calcetines'),'Calcetines','hh-calcetines',5,true),
(ek_uuid('sub-hh-cajas-relojes'),'Cajas para relojes','hh-cajas-relojes',6,true),
(ek_uuid('sub-hh-joyeria'),'Joyería','hh-joyeria',7,true),
(ek_uuid('sub-hh-ropa'),'Ropa','hh-ropa',8,true),
-- Baby & Kids
(ek_uuid('sub-bk-eventos'),'Eventos & Destacados','bk-eventos',0,true),
(ek_uuid('sub-bk-colecciones'),'Colecciones','bk-colecciones',1,true),
(ek_uuid('sub-bk-marca'),'Por marca','bk-marca',2,true),
(ek_uuid('sub-bk-mantas'),'Mantas','bk-mantas',3,true),
(ek_uuid('sub-bk-baberos'),'Baberos','bk-baberos',4,true),
(ek_uuid('sub-bk-juguetes'),'Juguetes','bk-juguetes',5,true),
(ek_uuid('sub-bk-peluches'),'Peluches y muñecas','bk-peluches',6,true),
(ek_uuid('sub-bk-mochilas'),'Mochilas','bk-mochilas',7,true),
-- Home
(ek_uuid('sub-hm-oficina'),'Oficina & Artículos para beber','hm-oficina',0,true),
(ek_uuid('sub-hm-cocina'),'Cocina, Bar & Entretenimiento','hm-cocina',1,true),
(ek_uuid('sub-hm-exterior'),'Exterior, Jardín & Decoración','hm-exterior',2,true),
(ek_uuid('sub-hm-tazas'),'Tazas','hm-tazas',3,true),
(ek_uuid('sub-hm-vasos-termicos'),'Vasos térmicos','hm-vasos-termicos',4,true),
(ek_uuid('sub-hm-botellas'),'Botellas de agua','hm-botellas-agua',5,true),
(ek_uuid('sub-hm-tablas'),'Tablas para picar','hm-tablas-picar',6,true),
(ek_uuid('sub-hm-copas-vino'),'Copas de vino','hm-copas-vino',7,true),
(ek_uuid('sub-hm-macetas'),'Macetas','hm-macetas',8,true),
-- Photo
(ek_uuid('sub-ph-destacados'),'Destacados & Por destinatario','ph-destacados',0,true),
(ek_uuid('sub-ph-coleccion'),'Por colección','ph-coleccion',1,true),
(ek_uuid('sub-ph-cabezas'),'Cabezas gigantes personalizadas','ph-cabezas-gigantes',2,true),
(ek_uuid('sub-ph-calcetines'),'Calcetines','ph-calcetines',3,true),
(ek_uuid('sub-ph-rompecabezas'),'Rompecabezas','ph-rompecabezas',4,true),
(ek_uuid('sub-ph-tazas'),'Tazas','ph-tazas',5,true),
(ek_uuid('sub-ph-cojines'),'Cojines y fundas','ph-cojines',6,true),
(ek_uuid('sub-ph-mantas'),'Mantas y frazadas','ph-mantas-frazadas',7,true),
-- By Brand
(ek_uuid('sub-bb-fuerza'),'Fuerza Aérea/Ejército/Marina','bb-fuerza-aerea',0,true),
(ek_uuid('sub-bb-coleccion'),'Por colección','bb-coleccion',1,true),
(ek_uuid('sub-bb-sellos'),'Sellos','bb-sellos',2,true),
(ek_uuid('sub-bb-suzy'),'Suzy Toronto','bb-suzy-toronto',3,true),
-- Business
(ek_uuid('sub-bs-ropa'),'Ropa & Accesorios','bs-ropa',0,true),
(ek_uuid('sub-bs-beber'),'Artículos para beber & Hogar','bs-beber',1,true),
(ek_uuid('sub-bs-aire-libre'),'Aire libre, Ocio & Oficina','bs-aire-libre',2,true),
(ek_uuid('sub-bs-playeras'),'Playeras','bs-playeras',3,true),
(ek_uuid('sub-bs-sudaderas'),'Sudaderas','bs-sudaderas',4,true),
(ek_uuid('sub-bs-tazas'),'Tazas','bs-tazas',5,true),
(ek_uuid('sub-bs-botellas'),'Botellas de agua','bs-botellas-agua',6,true),
(ek_uuid('sub-bs-tecnologia'),'Tecnología','bs-tecnologia',7,true);

-- ── Relación Categoría ↔ Subcategoría ─────────────────────────
INSERT INTO "_CategoriaToSubcategoria" ("A","B") VALUES
-- Halloween
(ek_uuid('cat-halloween'),ek_uuid('sub-hw-destacados')),(ek_uuid('cat-halloween'),ek_uuid('sub-hw-novedades')),(ek_uuid('cat-halloween'),ek_uuid('sub-hw-mas-vendidos')),
(ek_uuid('cat-halloween'),ek_uuid('sub-hw-calabazas')),(ek_uuid('cat-halloween'),ek_uuid('sub-hw-coleccion')),(ek_uuid('cat-halloween'),ek_uuid('sub-hw-ninos')),
(ek_uuid('cat-halloween'),ek_uuid('sub-hw-decoracion')),(ek_uuid('cat-halloween'),ek_uuid('sub-hw-peanuts')),(ek_uuid('cat-halloween'),ek_uuid('sub-hw-bolsas-dulces')),
-- Ocasiones
(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-temporada')),(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-cotidianas')),(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-bodas')),
(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-regreso-clases')),(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-halloween')),(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-navidad')),
(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-dia-madre')),(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-graduacion')),(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-cumpleanos')),
(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-aniversario')),(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-baby-shower')),(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-recien-nacido')),
(ek_uuid('cat-ocasiones'),ek_uuid('sub-oc-comunion')),
-- Wedding
(ek_uuid('cat-wedding'),ek_uuid('sub-wd-destacados')),(ek_uuid('cat-wedding'),ek_uuid('sub-wd-novedades')),(ek_uuid('cat-wedding'),ek_uuid('sub-wd-mas-vendidos')),
(ek_uuid('cat-wedding'),ek_uuid('sub-wd-papel-regalo')),(ek_uuid('cat-wedding'),ek_uuid('sub-wd-destinatario')),(ek_uuid('cat-wedding'),ek_uuid('sub-wd-evento')),
(ek_uuid('cat-wedding'),ek_uuid('sub-wd-ideas-regalo')),(ek_uuid('cat-wedding'),ek_uuid('sub-wd-cajas-relojes')),(ek_uuid('cat-wedding'),ek_uuid('sub-wd-copas-vino')),
(ek_uuid('cat-wedding'),ek_uuid('sub-wd-bar-vino')),
-- Memorial
(ek_uuid('cat-memorial'),ek_uuid('sub-mm-destacados')),(ek_uuid('cat-memorial'),ek_uuid('sub-mm-novedades')),(ek_uuid('cat-memorial'),ek_uuid('sub-mm-mas-vendidos')),
(ek_uuid('cat-memorial'),ek_uuid('sub-mm-militar')),(ek_uuid('cat-memorial'),ek_uuid('sub-mm-urnas')),(ek_uuid('cat-memorial'),ek_uuid('sub-mm-velas')),
(ek_uuid('cat-memorial'),ek_uuid('sub-mm-piedras')),(ek_uuid('cat-memorial'),ek_uuid('sub-mm-campanas')),(ek_uuid('cat-memorial'),ek_uuid('sub-mm-mascotas')),
(ek_uuid('cat-memorial'),ek_uuid('sub-mm-fotos')),
-- Him & Her
(ek_uuid('cat-himher'),ek_uuid('sub-hh-ocasion')),(ek_uuid('cat-himher'),ek_uuid('sub-hh-destinatario')),(ek_uuid('cat-himher'),ek_uuid('sub-hh-coleccion')),
(ek_uuid('cat-himher'),ek_uuid('sub-hh-aire-libre')),(ek_uuid('cat-himher'),ek_uuid('sub-hh-tazas')),(ek_uuid('cat-himher'),ek_uuid('sub-hh-calcetines')),
(ek_uuid('cat-himher'),ek_uuid('sub-hh-cajas-relojes')),(ek_uuid('cat-himher'),ek_uuid('sub-hh-joyeria')),(ek_uuid('cat-himher'),ek_uuid('sub-hh-ropa')),
-- Baby & Kids
(ek_uuid('cat-babykids'),ek_uuid('sub-bk-eventos')),(ek_uuid('cat-babykids'),ek_uuid('sub-bk-colecciones')),(ek_uuid('cat-babykids'),ek_uuid('sub-bk-marca')),
(ek_uuid('cat-babykids'),ek_uuid('sub-bk-mantas')),(ek_uuid('cat-babykids'),ek_uuid('sub-bk-baberos')),(ek_uuid('cat-babykids'),ek_uuid('sub-bk-juguetes')),
(ek_uuid('cat-babykids'),ek_uuid('sub-bk-peluches')),(ek_uuid('cat-babykids'),ek_uuid('sub-bk-mochilas')),
-- Home
(ek_uuid('cat-home'),ek_uuid('sub-hm-oficina')),(ek_uuid('cat-home'),ek_uuid('sub-hm-cocina')),(ek_uuid('cat-home'),ek_uuid('sub-hm-exterior')),
(ek_uuid('cat-home'),ek_uuid('sub-hm-tazas')),(ek_uuid('cat-home'),ek_uuid('sub-hm-vasos-termicos')),(ek_uuid('cat-home'),ek_uuid('sub-hm-botellas')),
(ek_uuid('cat-home'),ek_uuid('sub-hm-tablas')),(ek_uuid('cat-home'),ek_uuid('sub-hm-copas-vino')),(ek_uuid('cat-home'),ek_uuid('sub-hm-macetas')),
-- Photo
(ek_uuid('cat-photo'),ek_uuid('sub-ph-destacados')),(ek_uuid('cat-photo'),ek_uuid('sub-ph-coleccion')),(ek_uuid('cat-photo'),ek_uuid('sub-ph-cabezas')),
(ek_uuid('cat-photo'),ek_uuid('sub-ph-calcetines')),(ek_uuid('cat-photo'),ek_uuid('sub-ph-rompecabezas')),(ek_uuid('cat-photo'),ek_uuid('sub-ph-tazas')),
(ek_uuid('cat-photo'),ek_uuid('sub-ph-cojines')),(ek_uuid('cat-photo'),ek_uuid('sub-ph-mantas')),
-- By Brand
(ek_uuid('cat-brand'),ek_uuid('sub-bb-fuerza')),(ek_uuid('cat-brand'),ek_uuid('sub-bb-coleccion')),(ek_uuid('cat-brand'),ek_uuid('sub-bb-sellos')),(ek_uuid('cat-brand'),ek_uuid('sub-bb-suzy')),
-- Business
(ek_uuid('cat-business'),ek_uuid('sub-bs-ropa')),(ek_uuid('cat-business'),ek_uuid('sub-bs-beber')),(ek_uuid('cat-business'),ek_uuid('sub-bs-aire-libre')),
(ek_uuid('cat-business'),ek_uuid('sub-bs-playeras')),(ek_uuid('cat-business'),ek_uuid('sub-bs-sudaderas')),(ek_uuid('cat-business'),ek_uuid('sub-bs-tazas')),
(ek_uuid('cat-business'),ek_uuid('sub-bs-botellas')),(ek_uuid('cat-business'),ek_uuid('sub-bs-tecnologia'));

-- ── Productos de prueba (con imágenes) ────────────────────────
INSERT INTO "Producto" ("id","nombre","slug","descripcion","numeroArticulo","color","destacado","activo","nuevo","liquidacion","precioMinorista","precioDistribuidor","stock","vendidos","calificacion","imagen","creadoEn") VALUES
(ek_uuid('prod-01'),'Calabaza iluminada personalizada','calabaza-iluminada-personalizada','Calabaza decorativa con luz LED cálida y grabado personalizado.','30374127','Naranja',true,true,true,false,499,379,40,32,4.8,'https://picsum.photos/seed/calabaza/600/600',now()),
(ek_uuid('prod-02'),'Bolsa para dulces PEANUTS®','bolsa-dulces-peanuts','Bolsa reutilizable con diseños oficiales de PEANUTS® para Halloween.','30374128','Multicolor',false,true,false,false,149,109,120,15,4.5,'https://picsum.photos/seed/peanuts/600/600',now()),
(ek_uuid('prod-03'),'Taza personalizada de cumpleaños','taza-personalizada-cumpleanos','Taza de cerámica de 11 oz con nombre y mensaje personalizado.','30374129','Blanco',true,true,false,false,249,179,200,90,4.7,'https://picsum.photos/seed/taza/600/600',now()),
(ek_uuid('prod-04'),'Caja para relojes personalizada','caja-relojes-personalizada','Caja de madera grabada para guardar relojes.','30374130','Madera',true,true,false,true,899,679,30,18,4.9,'https://picsum.photos/seed/caja-reloj/600/600',now()),
(ek_uuid('prod-05'),'Cabeza gigante personalizada','cabeza-gigante-personalizada','Cabeza gigante con tu foto para fiestas y eventos.','30374131','A color',false,true,true,false,1299,999,15,8,4.6,'https://picsum.photos/seed/cabeza-gigante/600/600',now()),
(ek_uuid('prod-06'),'Vela conmemorativa Memorial','vela-conmemorativa','Vela con farol y mensaje personalizado en memoria.','30374132','Blanco',false,true,false,false,349,259,60,22,4.4,'https://picsum.photos/seed/vela/600/600',now()),
(ek_uuid('prod-07'),'Calcetines personalizados con foto','calcetines-personalizados-foto','Calcetines con estampado de fotos o caras.','30374133','Varios',false,true,false,false,199,149,300,75,4.3,'https://picsum.photos/seed/calcetines/600/600',now()),
(ek_uuid('prod-08'),'Manta personalizada con nombre','manta-personalizada-nombre','Manta suave de felpa con nombre o foto.','30374134','Rosa',true,true,false,false,599,449,50,28,4.8,'https://picsum.photos/seed/manta/600/600',now()),
(ek_uuid('prod-09'),'Tabla para picar grabada','tabla-picar-grabada','Tabla de bambú grabada con nombre o mensaje.','30374135','Bambú',false,true,false,false,449,329,70,33,4.5,'https://picsum.photos/seed/tabla/600/600',now()),
(ek_uuid('prod-10'),'Botella de agua personalizada','botella-agua-personalizada','Botella térmica de acero con grabado personalizado.','30374136','Acero',false,true,true,true,329,239,150,60,4.6,'https://picsum.photos/seed/botella/600/600',now()),
(ek_uuid('prod-11'),'Rompecabezas con foto','rompecabezas-foto','Rompecabezas personalizado con tu fotografía favorita.','30374137','A color',false,true,false,false,399,299,40,12,4.2,'https://picsum.photos/seed/rompecabezas/600/600',now()),
(ek_uuid('prod-12'),'Campana de viento conmemorativa','campana-viento-conmemorativa','Campana de viento grabada con mensaje en memoria.','30374138','Plata',false,true,false,false,549,419,25,9,4.7,'https://picsum.photos/seed/campana/600/600',now());

-- ── Relación Producto ↔ Categoría ─────────────────────────────
INSERT INTO "_CategoriaToProducto" ("A","B") VALUES
(ek_uuid('cat-halloween'),ek_uuid('prod-01')),(ek_uuid('cat-halloween'),ek_uuid('prod-02')),
(ek_uuid('cat-home'),ek_uuid('prod-03')),(ek_uuid('cat-home'),ek_uuid('prod-09')),
(ek_uuid('cat-wedding'),ek_uuid('prod-04')),
(ek_uuid('cat-photo'),ek_uuid('prod-05')),(ek_uuid('cat-photo'),ek_uuid('prod-07')),(ek_uuid('cat-photo'),ek_uuid('prod-11')),
(ek_uuid('cat-memorial'),ek_uuid('prod-06')),(ek_uuid('cat-memorial'),ek_uuid('prod-12')),
(ek_uuid('cat-babykids'),ek_uuid('prod-08')),
(ek_uuid('cat-business'),ek_uuid('prod-10'));

-- ── Relación Producto ↔ Subcategoría ──────────────────────────
INSERT INTO "_ProductoToSubcategoria" ("A","B") VALUES
(ek_uuid('prod-01'),ek_uuid('sub-hw-calabazas')),
(ek_uuid('prod-02'),ek_uuid('sub-hw-bolsas-dulces')),
(ek_uuid('prod-03'),ek_uuid('sub-hm-tazas')),
(ek_uuid('prod-04'),ek_uuid('sub-wd-cajas-relojes')),
(ek_uuid('prod-05'),ek_uuid('sub-ph-cabezas')),
(ek_uuid('prod-06'),ek_uuid('sub-mm-velas')),
(ek_uuid('prod-07'),ek_uuid('sub-ph-calcetines')),
(ek_uuid('prod-08'),ek_uuid('sub-bk-mantas')),
(ek_uuid('prod-09'),ek_uuid('sub-hm-tablas')),
(ek_uuid('prod-10'),ek_uuid('sub-bs-botellas')),
(ek_uuid('prod-11'),ek_uuid('sub-ph-rompecabezas')),
(ek_uuid('prod-12'),ek_uuid('sub-mm-campanas'));

-- ── Banners del carrusel (cambian automáticamente) ────────────
INSERT INTO "Banner" ("id","titulo","subtitulo","imagen","enlace","orden","activo","creadoEn") VALUES
(ek_uuid('banner-01'),'Halloween está aquí','Personaliza calabazas con luz y bolsas para dulces','https://picsum.photos/seed/banner-halloween/1600/600','/categoria/halloween',0,true,now()),
(ek_uuid('banner-02'),'Regalos de boda inolvidables','Cajas para relojes, copas grabadas y recuerdos','https://picsum.photos/seed/banner-boda/1600/600','/categoria/wedding',1,true,now()),
(ek_uuid('banner-03'),'Convierte tus fotos en regalos','Tazas, mantas y rompecabezas personalizados','https://picsum.photos/seed/banner-fotos/1600/600','/categoria/photo',2,true,now());

-- ── Artículos del blog ────────────────────────────────────────
INSERT INTO "Articulo" ("id","titulo","slug","resumen","contenido","imagen","publicado","creadoEn","actualizadoEn") VALUES
(ek_uuid('articulo-01'),'Ideas de regalos personalizados para Halloween','ideas-regalos-halloween','Descubre los regalos más originales para esta temporada.','Halloween es la época perfecta para sorprender con regalos únicos. Desde calabazas iluminadas hasta bolsas para dulces, la personalización hace la diferencia.','https://picsum.photos/seed/blog-halloween/800/500',true,now(),now()),
(ek_uuid('articulo-02'),'Cómo elegir el regalo de boda perfecto','elegir-regalo-boda','Una guía rápida para acertar con el regalo ideal.','Elegir un regalo de boda puede ser difícil. Los regalos personalizados como cajas para relojes o copas grabadas son opciones memorables.','https://picsum.photos/seed/blog-boda/800/500',true,now(),now()),
(ek_uuid('articulo-03'),'Personaliza tus fotos en productos únicos','personaliza-fotos-productos','Convierte tus recuerdos en tazas, mantas y rompecabezas.','Tus fotografías favoritas merecen más que vivir en el celular. Convierte tus recuerdos en productos personalizados de alta calidad.','https://picsum.photos/seed/blog-fotos/800/500',true,now(),now());

-- ============================================================
--  LISTO. Ya puedes abrir la tienda y el panel:
--  Tienda: /   ·   Panel: /admin  (admin@ek.com / admin123)
-- ============================================================
