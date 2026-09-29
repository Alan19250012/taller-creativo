import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secreto = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "secreto-de-desarrollo-cambiar");

export interface SesionUsuario {
  id: string;
  nombre: string;
  email: string;
  rol: string; // CLIENTE | DISTRIBUIDOR | ADMINISTRADOR
}

export async function firmarToken(usuario: SesionUsuario): Promise<string> {
  return new SignJWT({ ...usuario })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secreto());
}

export async function verificarToken(token: string): Promise<SesionUsuario | null> {
  try {
    const { payload } = await jwtVerify(token, secreto());
    return payload as unknown as SesionUsuario;
  } catch {
    return null;
  }
}

// Obtiene la sesión del usuario actual desde la cookie httpOnly.
export async function obtenerSesion(): Promise<SesionUsuario | null> {
  const token = cookies().get("sesion")?.value;
  if (!token) return null;
  return verificarToken(token);
}

export async function esDistribuidor(rol?: string | null): Promise<boolean> {
  if (rol) return rol === "DISTRIBUIDOR" || rol === "ADMINISTRADOR";
  const sesion = await obtenerSesion();
  return sesion?.rol === "DISTRIBUIDOR" || sesion?.rol === "ADMINISTRADOR";
}
