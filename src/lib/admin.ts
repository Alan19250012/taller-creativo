import { obtenerSesion } from "./auth";

// Devuelve la sesión si es administrador, o null si no está autorizado.
export async function sesionAdmin() {
  const sesion = await obtenerSesion();
  if (sesion?.rol !== "ADMINISTRADOR") return null;
  return sesion;
}
