import { Resend } from "resend";

// Envía un correo transaccional. Si no hay RESEND_API_KEY, se registra en consola
// (útil para desarrollo local). Para producción define la variable en el entorno.
export async function enviarCorreo({
  para,
  asunto,
  html,
  adjuntos
}: {
  para: string;
  asunto: string;
  html: string;
  adjuntos?: { nombre: string; contenido: Buffer }[];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const remitente = process.env.EMAIL_FROM || process.env.CORREO_REMITENTE || "Taller Creativo EK <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(`📧 [CORREO SIMULADO] Para: ${para} — Asunto: ${asunto}`);
    if (adjuntos?.length) {
      console.log(`   Adjuntos: ${adjuntos.map((a) => a.nombre).join(", ")}`);
    }
    return { simulado: true };
  }

  const resend = new Resend(apiKey);
  const data = await resend.emails.send({
    from: remitente,
    to: para,
    subject: asunto,
    html,
    attachments: adjuntos?.map((a) => ({
      filename: a.nombre,
      content: a.contenido.toString("base64")
    }))
  });

  return data;
}
