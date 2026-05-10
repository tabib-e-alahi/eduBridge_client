import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000",
});

export const useAuth = () => authClient.useSession();
