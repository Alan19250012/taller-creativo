import { prisma } from "./db";

export const COLOR_PRIMARIO_DEFECTO = "#DA1D2A";
export const COLOR_SECUNDARIO_DEFECTO = "#244093";

// Devuelve toda la configuración del sitio como un mapa clave → valor.
export async function obtenerConfiguracion(): Promise<Record<string, string>> {
  const filas = await prisma.configuracion.findMany();
  const mapa: Record<string, string> = {};
  for (const fila of filas) {
    mapa[fila.clave] = fila.valor;
  }
  return mapa;
}

export async function obtenerConfig(clave: string): Promise<string> {
  const fila = await prisma.configuracion.findUnique({ where: { clave } });
  return fila?.valor ?? "";
}
