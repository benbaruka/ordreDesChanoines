import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const pathname = request.nextUrl.pathname;

  // Vérification si l'utilisateur est authentifié
  const isAuth = Boolean(token);
  const isPublicPath = ["/signin", "/"].includes(pathname);

  // Si l'utilisateur est authentifié et essaie d'aller sur /signin, on le redirige vers /dashboard
  if (isAuth && pathname === "/signin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
  if (!isAuth && !isPublicPath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Si l'utilisateur est authentifié et se trouve déjà sur /dashboard, on ne redirige pas
  if (isAuth && pathname === "/dashboard") {
    return NextResponse.next(); // On ne fait rien ici car l'utilisateur est déjà sur le dashboard
  }

  return NextResponse.next(); // Sinon on continue normalement
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|images|api).*)"],
};
