import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL || "",
    fetchOptions: { credentials: "include" },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "STUDENT",
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
            },
        },
    },
});

export const useAuth = () => authClient.useSession();
