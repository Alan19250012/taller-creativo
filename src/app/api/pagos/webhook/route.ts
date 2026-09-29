import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { obtenerStripe } from "@/lib/stripe";
import { completarPedido } from "@/lib/completar-pedido";

// Webhook de Stripe: confirma el pago y completa el pedido (stock + factura + correo).
export async function POST(req: Request) {
  const stripe = obtenerStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe no configurado." }, { status: 500 });
  }

  const firma = req.headers.get("stripe-signature");
  if (!firma) {
    return NextResponse.json({ error: "Falta la firma de Stripe." }, { status: 400 });
  }

  const cuerpo = await req.text();
  let evento: Stripe.Event;
  try {
    evento = stripe.webhooks.constructEvent(cuerpo, firma, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch {
    return NextResponse.json({ error: "Firma de webhook inválida." }, { status: 400 });
  }

  if (evento.type === "checkout.session.completed") {
    const session = evento.data.object as Stripe.Checkout.Session;
    const pedidoId = session.metadata?.pedidoId;
    if (pedidoId) {
      try {
        await completarPedido(pedidoId);
      } catch (e) {
        console.error("[webhook] No se pudo completar el pedido:", e);
        return NextResponse.json({ error: "No se pudo completar el pedido." }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ recibido: true });
}
