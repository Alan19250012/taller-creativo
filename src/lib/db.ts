import { PrismaClient } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Normalización de DATABASE_URL para Supabase
// ─────────────────────────────────────────────────────────────────────────────
// El "Transaction pooler" de Supabase (Supavisor/PgBouncer, puerto 6543) no
// mantiene la misma conexión física entre transacciones, así que NO puede
// resolver las sentencias preparadas con nombre (s1, s2, ...) que Prisma usa por
// defecto. El resultado es el error de Postgres 26000:
//
//     prepared statement "s1" does not exist
//
// El parámetro `pgbouncer=true` desactiva ese caché de sentencias preparadas.
// Lo añadimos aquí de forma automática para que un despliegue con una variable
// de entorno mal copiada no vuelva a romper la tienda en producción.
function urlConPoolerSeguro(url: string | undefined): string | undefined {
  if (!url) return url;

  try {
    const uri = new URL(url);

    const esPoolerSupabase = uri.hostname.includes("pooler.supabase.com");
    const esPuertoPooler = uri.port === "6543";
    if (!esPoolerSupabase && !esPuertoPooler) return url;

    if (uri.searchParams.get("pgbouncer") !== "true") {
      uri.searchParams.set("pgbouncer", "true");
      console.warn(
        "[db] DATABASE_URL apunta al pooler de Supabase sin `pgbouncer=true`. " +
          "Se añadió automáticamente para evitar el error 26000 " +
          '(prepared statement "s1" does not exist). Añádelo a tu variable de entorno.'
      );
    }

    return uri.toString();
  } catch {
    // Si la URL no es parseable, dejamos que Prisma reporte el error real.
    return url;
  }
}

// Singleton del cliente de Prisma (evita múltiples conexiones en desarrollo).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function crearCliente(): PrismaClient {
  const url = urlConPoolerSeguro(process.env.DATABASE_URL);

  return new PrismaClient(
    url
      ? { datasources: { db: { url } } }
      : undefined
  );
}

export const prisma = globalForPrisma.prisma ?? crearCliente();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
