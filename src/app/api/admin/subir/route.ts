import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { sesionAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

// Carpetas permitidas dentro del bucket. Se usa una lista blanca para que el
// valor que llega del navegador no pueda escapar del bucket (p. ej. "../../").
const CARPETAS = ["productos", "banners", "articulos", "marca"] as const;

// Extensión a partir del MIME real detectado en el data URL.
const EXTENSIONES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/avif": "avif"
};

export async function POST(req: Request) {
  const admin = await sesionAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const { archivo, nombre, carpeta: carpetaRecibida } = await req.json();
  if (!archivo) return NextResponse.json({ error: "Sin archivo." }, { status: 400 });

  const carpeta = (CARPETAS as readonly string[]).includes(String(carpetaRecibida))
    ? String(carpetaRecibida)
    : "productos";

  const match = String(archivo).match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  const mime = match ? match[1] : "image/png";
  const buffer = Buffer.from(match ? match[2] : archivo, "base64");

  const extension = EXTENSIONES[mime] ?? "jpg";
  const nombreArchivo = `${Date.now()}-${slugify(nombre || "imagen").slice(0, 40) || "imagen"}.${extension}`;

  // 1) Si Supabase Storage está configurado (recomendado para Vercel), sube ahí.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const bucket = process.env.SUPABASE_BUCKET || "imagenes";
    const ruta = `${carpeta}/${nombreArchivo}`;

    const { error } = await supabase.storage.from(bucket).upload(ruta, buffer, {
      contentType: mime,
      upsert: true
    });

    if (error) {
      // El fallo más habitual con diferencia: el bucket no existe todavía.
      // Antes se devolvía el mensaje crudo de Supabase y el navegador lo
      // descartaba sin mostrarlo, así que el botón parecía no hacer nada.
      const noExiste = /bucket not found/i.test(error.message);
      const mensaje = noExiste
        ? `El bucket "${bucket}" no existe en Supabase Storage. Créalo como público en Storage → New bucket (o cambia SUPABASE_BUCKET).`
        : `No se pudo subir la imagen a Supabase: ${error.message}`;

      console.error("[subir] fallo al subir a Supabase Storage:", {
        bucket,
        ruta,
        mime,
        bytes: buffer.length,
        error: error.message
      });

      return NextResponse.json({ error: mensaje }, { status: noExiste ? 500 : 502 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(ruta);
    return NextResponse.json({ url: data.publicUrl });
  }

  // 2) Fallback local (solo desarrollo; Vercel tiene sistema de archivos de solo lectura).
  const destino = path.join(process.cwd(), "public", "uploads");
  await mkdir(destino, { recursive: true });
  await writeFile(path.join(destino, nombreArchivo), buffer);
  return NextResponse.json({ url: `/uploads/${nombreArchivo}` });
}
