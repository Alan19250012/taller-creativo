import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(texto: string): string {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Estructura de categorías del taller ──────────────────────────
// Cada subcategoría puede ser { nombre } o { nombre, hijas: [...] }
// "hijas" puede contener nombres simples u otros nodos anidados.
type NodoSub = { nombre: string; hijas?: (string | NodoSub)[] };

const CATEGORIAS: { nombre: string; subcats: (string | NodoSub)[] }[] = [
  {
    nombre: "Halloween",
    subcats: [
      "Destacados",
      "Novedades",
      "Los más vendidos",
      "Calabazas con luz",
      "Por colección",
      "Para niños",
      "Decoración para el hogar",
      "PEANUTS®",
      "Bolsas para dulces"
    ]
  },
  {
    nombre: "Ocasiones",
    subcats: [
      {
        nombre: "De temporada",
        hijas: [
          "Regreso a clases",
          "Halloween",
          "Día de Acción de Gracias",
          "Navidad",
          "Día de Galentine",
          "Día de San Valentín",
          "Pascua",
          "Día de la Madre",
          "Día del Padre",
          "Graduación"
        ]
      },
      {
        nombre: "Ocasiones cotidianas",
        hijas: [
          "Aniversario",
          "Baby Shower",
          "Bautizo y Confirmación Infantil",
          "Cumpleaños",
          "Confirmación",
          "Compromiso",
          "Primera Comunión",
          "Bienvenida al hogar",
          "Recién nacido",
          "Religioso",
          "Jubilación"
        ]
      },
      {
        nombre: "Bodas",
        hijas: [
          {
            nombre: "Aniversario / Cumpleaños",
            hijas: ["1.º año", "5.º año", "10.º año", "25.º año", "50.º año"]
          },
          {
            nombre: "Por destinatario",
            hijas: ["Para ella", "Para él", "Para mamá", "Para papá", "Para niñas", "Para niños", "Primer cumpleaños"]
          }
        ]
      }
    ]
  },
  {
    nombre: "Wedding",
    subcats: [
      "Destacados",
      "Novedades",
      "Los más vendidos",
      "Papel de regalo",
      {
        nombre: "Por destinatario",
        hijas: ["Para la novia", "Para el novio", "Para la pareja", "Para damas de honor", "Para caballeros de honor"]
      },
      {
        nombre: "Por colección / Evento",
        hijas: ["Cabezas gigantes personalizadas", "Cuadros y arte de pared", "Recuerdos de boda", "Compromiso", "Despedida de soltera"]
      },
      {
        nombre: "Ideas de regalo",
        hijas: [
          "Bar y vino",
          "Vasos para cerveza",
          "Tapetes para entrada",
          "Entretenimiento",
          "Cocina",
          "Sellos autoentintables",
          "Cajas para relojes",
          "Copas de vino"
        ]
      }
    ]
  },
  {
    nombre: "Memorial",
    subcats: [
      "Destacados",
      "Novedades",
      "Los más vendidos",
      "Militar",
      "Urnas",
      "Por colección",
      "Velas y faroles",
      "Piedras para jardín",
      "Recuerdos especiales",
      "Mascotas",
      "Fotos",
      "Campanas de viento"
    ]
  },
  {
    nombre: "Him & Her",
    subcats: [
      {
        nombre: "Por ocasión",
        hijas: ["Aniversario", "Cumpleaños", "Despedida de soltera", "Compromiso", "Jubilación"]
      },
      {
        nombre: "Por destinatario",
        hijas: [
          "Para mamá/papá",
          "Para abuelos/abuelas",
          "Para esposos/esposas",
          "Para hijos/hijas",
          "Para hermanos/hermanas",
          "Para amigos/amigas",
          "Para la novia",
          "Para damas de honor",
          "Para parejas",
          "Para maestros/maestras"
        ]
      },
      {
        nombre: "Por colección",
        hijas: [
          "Ropa",
          "Cerveza/bar y entretenimiento",
          "Regalos familiares",
          "Gadgets y accesorios",
          "Tazas",
          "Oficina y escritorio",
          "Mascotas",
          "Calcetines",
          "Arte de pared",
          "Cajas para relojes",
          "Joyería",
          "Recuerdos",
          "Cocina",
          "Amor y romance",
          "Macetas y floreros",
          "Suzy Toronto"
        ]
      },
      {
        nombre: "Vida al aire libre",
        hijas: [
          "Regalos para exteriores",
          "Toallas de playa",
          "Toallas refrescantes",
          "Golf",
          "Asados/Parrilladas",
          "Pickleball",
          "Picnic",
          "Deportes",
          "Botellas de agua",
          "Bolsas con cordón",
          "Jardinería",
          "Bolsas de tela"
        ]
      }
    ]
  },
  {
    nombre: "Baby & Kids",
    subcats: [
      {
        nombre: "Eventos & Destacados",
        hijas: [
          "Nuevo para bebés/niños",
          "Los más vendidos",
          "Regalos para niños pequeños",
          "Cabezas gigantes personalizadas",
          "Baby Shower",
          "Recién nacido",
          "Primer cumpleaños",
          "Cumpleaños niños/niñas",
          "Bautizo",
          "Primera Comunión"
        ]
      },
      {
        nombre: "Colecciones",
        hijas: [
          "Bolsas de regalo",
          "Papel de regalo",
          "Baberos",
          "Mantas",
          "Portarretratos",
          "Recuerdos",
          "Decoración de cuarto",
          "Cuentos infantiles",
          "Juguetes",
          "Mochilas",
          "Ropa de cama",
          "Medidores de estatura",
          "Útiles escolares",
          "Equipo para pijamadas",
          "Bancos escalón",
          "Peluches y muñecas",
          "Toallas",
          "Loncheras"
        ]
      },
      { nombre: "Por marca", hijas: [] }
    ]
  },
  {
    nombre: "Home",
    subcats: [
      {
        nombre: "Oficina & Artículos para beber",
        hijas: [
          "Escritorio y oficina",
          "Mousepads",
          "Calendarios con fotos",
          "Sellos autoentintables",
          "Papelería",
          "Tazas",
          "Vasos térmicos",
          "Botellas de agua"
        ]
      },
      {
        nombre: "Cocina, Bar & Entretenimiento",
        hijas: [
          "Mandiles",
          "Moldes de repostería",
          "Portavasos",
          "Tablas para picar",
          "Toallas de cocina",
          "Agarraderas",
          "Regalos de bar y vino",
          "Vasos para cerveza",
          "Hieleras para bebidas",
          "Vajilla y bandejas para servir",
          "Copas de vino"
        ]
      },
      {
        nombre: "Exterior, Jardín & Decoración",
        hijas: [
          "Pancartas y letreros",
          "Toallas de playa",
          "Tapetes para entrada",
          "Banderines",
          "Jardinería",
          "Asados",
          "Decoración para patio",
          "Macetas",
          "Cuadros en lienzo",
          "Retratos de mascotas",
          "Placas y letreros",
          "TwinkleBright LED",
          "Impresiones de arte",
          "Arte de pared para bodas",
          "Ropa de cama y baño"
        ]
      }
    ]
  },
  {
    nombre: "Photo",
    subcats: [
      {
        nombre: "Destacados & Por destinatario",
        hijas: [
          "Novedades",
          "Los más vendidos",
          "Bolsas de regalo",
          "Papel de regalo",
          "Calendarios con fotos",
          "Cabezas gigantes personalizadas",
          "Para ella",
          "Para él",
          "Para bebés y niños"
        ]
      },
      {
        nombre: "Por colección",
        hijas: [
          "Ropa",
          "Bolsas y tote bags",
          "Artículos de bar",
          "Mantas y frazadas",
          "Lienzos y decoración de pared",
          "Portavasos",
          "Cocina y decoración",
          "Conmemorativos",
          "Tazas",
          "Cojines y fundas",
          "Rompecabezas",
          "Calcetines",
          "Vasos térmicos"
        ]
      }
    ]
  },
  {
    nombre: "By Brand",
    subcats: [
      "Fuerza Aérea/Ejército/Marina de EE. UU.",
      { nombre: "Por colección (Subprincipal)", hijas: [] },
      "Sellos",
      "Suzy Toronto"
    ]
  },
  {
    nombre: "Business",
    subcats: [
      {
        nombre: "Ropa & Accesorios",
        hijas: [
          "Playeras",
          "Polos",
          "Sudaderas",
          "Chamarras",
          "Gorras",
          "Bolsas",
          "Accesorios personales",
          "Envoltorios de regalo"
        ]
      },
      {
        nombre: "Artículos para beber & Hogar",
        hijas: ["Tazas", "Botellas de agua", "Vasos térmicos", "Cristalería", "Bar y entretenimiento", "Mantas", "Cocina"]
      },
      {
        nombre: "Aire libre, Ocio & Oficina",
        hijas: [
          "Bolsas",
          "Toallas de playa",
          "Deportes",
          "Accesorios de escritorio",
          "Papelería",
          "Tecnología"
        ]
      }
    ]
  }
];

const CONFIGURACION_INICIAL: Record<string, string> = {
  nombre_empresa: "Taller Creativo EK",
  color_primario: "#DA1D2A",
  color_secundario: "#244093",
  telefono1: "55 1234 5678",
  telefono2: "55 8765 4321",
  correo: "contacto@tallercreativoek.com",
  facebook: "https://facebook.com/tallercreativoek",
  instagram: "https://instagram.com/tallercreativoek",
  pinterest: "https://pinterest.com/tallercreativoek",
  tiktok: "https://tiktok.com/@tallercreativoek",
  whatsapp: "https://wa.me/525512345678",
  logo_url: "",
  favicon_url: ""
};

const PRODUCTOS_DEMO: {
  nombre: string;
  descripcion: string;
  numeroArticulo: string;
  color: string;
  categoria: string;
  subcategoria: string;
  precioMinorista: number;
  precioDistribuidor: number;
  stock: number;
  destacado?: boolean;
  nuevo?: boolean;
  liquidacion?: boolean;
  tallas?: string[];
}[] = [
  {
    nombre: "Calabaza iluminada personalizada",
    descripcion:
      "Calabaza decorativa con luz LED cálida y grabado personalizado. Ideal para Halloween y decoración de temporada.",
    numeroArticulo: "30374127",
    color: "Naranja",
    categoria: "Halloween",
    subcategoria: "Calabazas con luz",
    precioMinorista: 499,
    precioDistribuidor: 379,
    stock: 40,
    destacado: true,
    nuevo: true,
    tallas: ["Chica", "Mediana", "Grande"]
  },
  {
    nombre: "Bolsa para dulces PEANUTS®",
    descripcion:
      "Bolsa reutilizable con diseños oficiales de PEANUTS® para recolectar dulces en Halloween. Material resistente.",
    numeroArticulo: "30374128",
    color: "Multicolor",
    categoria: "Halloween",
    subcategoria: "Bolsas para dulces",
    precioMinorista: 149,
    precioDistribuidor: 109,
    stock: 120,
    tallas: ["Única"]
  },
  {
    nombre: "Taza personalizada de cumpleaños",
    descripcion:
      "Taza de cerámica de 11 oz con nombre y mensaje personalizado. Perfecta para cumpleaños y ocasiones cotidianas.",
    numeroArticulo: "30374129",
    color: "Blanco",
    categoria: "Home",
    subcategoria: "Tazas",
    precioMinorista: 249,
    precioDistribuidor: 179,
    stock: 200,
    destacado: true,
    tallas: ["11 oz", "15 oz"]
  },
  {
    nombre: "Caja para relojes personalizada",
    descripcion:
      "Caja de madera grabada con nombre para guardar relojes. Regalo elegante para bodas, aniversarios y graduación.",
    numeroArticulo: "30374130",
    color: "Madera",
    categoria: "Wedding",
    subcategoria: "Cajas para relojes",
    precioMinorista: 899,
    precioDistribuidor: 679,
    stock: 30,
    destacado: true,
    liquidacion: true
  },
  {
    nombre: "Cabeza gigante personalizada",
    descripcion:
      "Cabeza gigante con tu foto para fiestas y eventos. Impresión de alta calidad y material ligero.",
    numeroArticulo: "30374131",
    color: "A color",
    categoria: "Photo",
    subcategoria: "Cabezas gigantes personalizadas",
    precioMinorista: 1299,
    precioDistribuidor: 999,
    stock: 15,
    nuevo: true,
    tallas: ["Estándar", "Grande"]
  },
  {
    nombre: "Vela conmemorativa Memorial",
    descripcion:
      "Vela con farol y mensaje personalizado en memoria de un ser querido. Luz cálida y duradera.",
    numeroArticulo: "30374132",
    color: "Blanco",
    categoria: "Memorial",
    subcategoria: "Velas y faroles",
    precioMinorista: 349,
    precioDistribuidor: 259,
    stock: 60
  },
  {
    nombre: "Calcetines personalizados con foto",
    descripcion:
      "Calcetines con estampado de fotos o caras. Regalo divertido para él, para ella o para toda la familia.",
    numeroArticulo: "30374133",
    color: "Varios",
    categoria: "Photo",
    subcategoria: "Calcetines",
    precioMinorista: 199,
    precioDistribuidor: 149,
    stock: 300,
    tallas: ["Chico", "Mediano", "Grande"]
  },
  {
    nombre: "Manta personalizada con nombre",
    descripcion:
      "Manta suave de felpa con nombre o foto. Ideal para bebés, recién nacidos y regalos de bienvenida al hogar.",
    numeroArticulo: "30374134",
    color: "Rosa",
    categoria: "Baby & Kids",
    subcategoria: "Mantas",
    precioMinorista: 599,
    precioDistribuidor: 449,
    stock: 50,
    destacado: true,
    tallas: ["Bebé", "Individual", "Matrimonial"]
  },
  {
    nombre: "Tabla para picar grabada",
    descripcion:
      "Tabla de bambú grabada con nombre o mensaje. Perfecta para cocina, bar y entretenimiento.",
    numeroArticulo: "30374135",
    color: "Bambú",
    categoria: "Home",
    subcategoria: "Tablas para picar",
    precioMinorista: 449,
    precioDistribuidor: 329,
    stock: 70
  },
  {
    nombre: "Botella de agua personalizada",
    descripcion:
      "Botella térmica de acero inoxidable con grabado personalizado. Para deportes, oficina y vida al aire libre.",
    numeroArticulo: "30374136",
    color: "Acero",
    categoria: "Business",
    subcategoria: "Botellas de agua",
    precioMinorista: 329,
    precioDistribuidor: 239,
    stock: 150,
    nuevo: true,
    liquidacion: true,
    tallas: ["500 ml", "750 ml", "1 L"]
  },
  {
    nombre: "Rompecabezas con foto",
    descripcion:
      "Rompecabezas personalizado con tu fotografía favorita. Piezas de cartón resistente.",
    numeroArticulo: "30374137",
    color: "A color",
    categoria: "Photo",
    subcategoria: "Rompecabezas",
    precioMinorista: 399,
    precioDistribuidor: 299,
    stock: 40,
    tallas: ["100 piezas", "500 piezas", "1000 piezas"]
  },
  {
    nombre: "Campana de viento conmemorativa",
    descripcion:
      "Campana de viento grabada con mensaje en memoria. Sonido relajante para jardín o interior.",
    numeroArticulo: "30374138",
    color: "Plata",
    categoria: "Memorial",
    subcategoria: "Campanas de viento",
    precioMinorista: 549,
    precioDistribuidor: 419,
    stock: 25
  }
];

const ARTICULOS_BLOG = [
  {
    titulo: "Ideas de regalos personalizados para Halloween",
    resumen: "Descubre los regalos más originales y personalizados para esta temporada de Halloween.",
    contenido:
      "Halloween es la época perfecta para sorprender con regalos únicos. Desde calabazas iluminadas hasta bolsas para dulces con diseño, la personalización hace la diferencia.\n\nEn Taller Creativo EK preparamos artículos con tu nombre, foto o mensaje especial para que esta temporada sea inolvidable. Explora nuestra colección de Halloween y personaliza tu artículo favorito.",
    publicado: true
  },
  {
    titulo: "Cómo elegir el regalo de boda perfecto",
    resumen: "Una guía rápida para acertar con el regalo ideal para la novia, el novio o la pareja.",
    contenido:
      "Elegir un regalo de boda puede ser difícil. Lo más importante es que sea significativo para la pareja.\n\nLos regalos personalizados como cajas para relojes, copas de vino grabadas o cuadros de arte de pared son opciones memorables que perduran en el tiempo.",
    publicado: true
  },
  {
    titulo: "Personaliza tus fotos en productos únicos",
    resumen: "Convierte tus recuerdos en tazas, mantas, rompecabezas y más.",
    contenido:
      "Tus fotografías favoritas merecen más que vivir en el celular. Convierte tus recuerdos en productos personalizados de alta calidad.\n\nDesde tazas hasta rompecabezas, tenemos una gran variedad de opciones para regalar o conservar tus momentos más especiales.",
    publicado: true
  }
];

async function main() {
  console.log("🌱 Iniciando carga de datos...");

  // 1. Configuración
  for (const [clave, valor] of Object.entries(CONFIGURACION_INICIAL)) {
    await prisma.configuracion.upsert({
      where: { clave },
      update: {},
      create: { clave, valor }
    });
  }

  // 2. Usuarios
  const hash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.usuario.upsert({
    where: { email: "admin@ek.com" },
    update: {},
    create: {
      nombre: "Administrador",
      email: "admin@ek.com",
      contrasena: hash,
      rol: "ADMINISTRADOR"
    }
  });
  await prisma.usuario.upsert({
    where: { email: "distribuidor@ek.com" },
    update: {},
    create: {
      nombre: "Cliente Distribuidor",
      email: "distribuidor@ek.com",
      contrasena: hash,
      rol: "DISTRIBUIDOR"
    }
  });
  await prisma.usuario.upsert({
    where: { email: "cliente@ek.com" },
    update: {},
    create: {
      nombre: "Cliente Estándar",
      email: "cliente@ek.com",
      contrasena: hash,
      rol: "CLIENTE"
    }
  });

  // 3. Categorías y subcategorías
  const categoriaPorNombre = new Map<string, string>();
  const subPorNombre = new Map<string, string>();

  for (let i = 0; i < CATEGORIAS.length; i++) {
    const cat = CATEGORIAS[i];
    const slug = slugify(cat.nombre);
    const creada = await prisma.categoria.upsert({
      where: { slug },
      update: { orden: i, nombre: cat.nombre },
      create: { nombre: cat.nombre, slug, orden: i }
    });
    categoriaPorNombre.set(cat.nombre, creada.id);

    async function crearSub(nombre: string, padreId: string | null) {
      const s = slugify(nombre);
      const sub = await prisma.subcategoria.upsert({
        where: { slug: s },
        update: { nombre },
        create: { nombre, slug: s, padreId }
      });
      subPorNombre.set(nombre, sub.id);
      await prisma.categoria.update({
        where: { id: creada.id },
        data: { subcategorias: { connect: { id: sub.id } } }
      });
      return sub.id;
    }

    async function recorrer(nodos: (string | NodoSub)[], padreId: string | null) {
      for (const nodo of nodos) {
        if (typeof nodo === "string") {
          await crearSub(nodo, padreId);
        } else {
          const id = await crearSub(nodo.nombre, padreId);
          if (nodo.hijas && nodo.hijas.length) {
            await recorrer(nodo.hijas, id);
          }
        }
      }
    }

    await recorrer(cat.subcats, null);
  }

  // 4. Productos demo
  for (const p of PRODUCTOS_DEMO) {
    const slug = slugify(p.nombre);
    const catId = categoriaPorNombre.get(p.categoria);
    const subId = subPorNombre.get(p.subcategoria);
    const producto = await prisma.producto.upsert({
      where: { slug },
      update: {},
      create: {
        nombre: p.nombre,
        slug,
        descripcion: p.descripcion,
        numeroArticulo: p.numeroArticulo,
        color: p.color,
        destacado: p.destacado ?? false,
        nuevo: p.nuevo ?? false,
        liquidacion: p.liquidacion ?? false,
        precioMinorista: p.precioMinorista,
        precioDistribuidor: p.precioDistribuidor,
        stock: p.stock,
        categorias: catId ? { connect: { id: catId } } : undefined,
        subcategorias: subId ? { connect: { id: subId } } : undefined
      }
    });
    if (p.tallas && p.tallas.length) {
      for (const t of p.tallas) {
        await prisma.talla.create({
          data: { productoId: producto.id, nombre: t, stock: Math.floor(p.stock / p.tallas.length) }
        });
      }
    }
  }

  // 5. Blog
  for (const a of ARTICULOS_BLOG) {
    const slug = slugify(a.titulo);
    await prisma.articulo.upsert({
      where: { slug },
      update: {},
      create: { ...a, slug }
    });
  }

  // 6. Banners del carrusel
  if ((await prisma.banner.count()) === 0) {
    const banners = [
      {
        titulo: "Halloween está aquí",
        subtitulo: "Personaliza calabazas con luz y bolsas para dulces",
        enlace: "/categoria/halloween",
        orden: 0
      },
      {
        titulo: "Regalos de boda inolvidables",
        subtitulo: "Cajas para relojes, copas grabadas y recuerdos",
        enlace: "/categoria/wedding",
        orden: 1
      },
      {
        titulo: "Convierte tus fotos en regalos",
        subtitulo: "Tazas, mantas, rompecabezas y más",
        enlace: "/categoria/photo",
        orden: 2
      }
    ];
    for (const b of banners) {
      await prisma.banner.create({ data: b });
    }
  }

  console.log("✅ Datos cargados correctamente.");
  console.log("   Admin:      admin@ek.com / admin123");
  console.log("   Distribuidor: distribuidor@ek.com / admin123");
  console.log("   Cliente:      cliente@ek.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
