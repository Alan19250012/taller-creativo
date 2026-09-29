import { NextResponse } from "next/server";
import { obtenerSesion } from "@/lib/auth";

export async function GET() {
  const sesion = await obtenerSesion();
  return NextResponse.json({ usuario: sesion });
}
