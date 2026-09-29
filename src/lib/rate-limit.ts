// Limitador de peticiones en memoria (protección básica contra fuerza bruta).
// Nota: en Vercel (serverless) cada instancia tiene su propio mapa, así que
// es una primera línea de defensa. Para tráfico real, combínalo con Upstash
// Rate Limit o Vercel KV para limitar de forma global.

interface Entrada {
  cuenta: number;
  inicio: number;
}

const mapa = new Map<string, Entrada>();

// Limpia entradas viejas de forma oportunista para no crecer sin control.
const TAMANO_MAX = 5000;
function podar() {
  if (mapa.size < TAMANO_MAX) return;
  const ahora = Date.now();
  for (const [clave, entrada] of mapa) {
    if (ahora - entrada.inicio > 60 * 60 * 1000) mapa.delete(clave);
  }
}

export function limitar(
  clave: string,
  max = 10,
  ventanaMs = 60 * 1000
): { ok: boolean; reintentarEn: number } {
  podar();
  const ahora = Date.now();
  const entrada = mapa.get(clave);

  if (!entrada || ahora - entrada.inicio > ventanaMs) {
    mapa.set(clave, { cuenta: 1, inicio: ahora });
    return { ok: true, reintentarEn: 0 };
  }

  entrada.cuenta += 1;
  if (entrada.cuenta > max) {
    return {
      ok: false,
      reintentarEn: Math.ceil((entrada.inicio + ventanaMs - ahora) / 1000)
    };
  }
  return { ok: true, reintentarEn: 0 };
}

// Obtiene una IP aproximada desde los headers estándar de Vercel/Next.
export function obtenerIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "desconocida";
}
