import Stripe from "stripe";

let cliente: Stripe | null = null;

// Devuelve el cliente de Stripe si STRIPE_SECRET_KEY está configurada;
// en caso contrario devuelve null (permite el modo "pago simulado").
export function obtenerStripe(): Stripe | null {
  const clave = process.env.STRIPE_SECRET_KEY;
  if (!clave) return null;
  if (!cliente) cliente = new Stripe(clave);
  return cliente;
}
