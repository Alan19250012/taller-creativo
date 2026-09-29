import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secreto = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "secreto-de-desarrollo-cambiar");

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("sesion")?.value;

  let rol: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secreto());
      rol = (payload.rol as string) ?? null;
    } catch {
      rol = null;
    }
  }

  // Rutas de administración
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (rol === "ADMINISTRADOR") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }
    if (rol !== "ADMINISTRADOR") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Rutas de cuenta de cliente
  if (pathname.startsWith("/cuenta") && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cuenta/:path*"]
};
