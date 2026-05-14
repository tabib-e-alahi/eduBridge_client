import { NextResponse, type NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected routes
    const isUserRoute = pathname.startsWith("/user");
    const isManagerRoute = pathname.startsWith("/manager");
    const isAdminRoute = pathname.startsWith("/admin");
    const isProtectedRoute = isUserRoute || isManagerRoute || isAdminRoute;

    if (isProtectedRoute) {
        // Use the actual backend URL for internal proxy fetches
        // Rewrites do not apply to internal fetch calls in Next.js Middleware on Vercel
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";
        
        const { data: session, error } = await betterFetch<any>(
            `${BACKEND_URL}/api/auth/get-session`,
            {
                headers: {
                    // Pass the cookie from the incoming request to the backend
                    cookie: request.headers.get("cookie") || "",
                },
            }
        );

        // Redirect to login if no session found or error occurs
        if (!session || error) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const user = session.user;
        const role = user.role;
        const status = user.status;

        // Handle Pending Approval for Instructors/Managers
        if (status === "PENDING_APPROVAL" && pathname !== "/pending-approval") {
            return NextResponse.redirect(new URL("/pending-approval", request.url));
        }

        // Role-Based Access Control (RBAC) Safeguards
        if (isUserRoute && role !== "STUDENT") {
            const redirectPath = role === "ADMIN" ? "/admin" : "/manager";
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        if (isManagerRoute && (role !== "MANAGER" && role !== "INSTRUCTOR")) {
            const redirectPath = role === "ADMIN" ? "/admin" : "/user";
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        if (isAdminRoute && role !== "ADMIN") {
            const redirectPath = (role === "MANAGER" || role === "INSTRUCTOR") ? "/manager" : "/user";
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }
    }

    return NextResponse.next();
}

// Config to specify which routes should trigger the proxy safeguard
export const config = {
    matcher: ["/user/:path*", "/manager/:path*", "/admin/:path*"],
};
