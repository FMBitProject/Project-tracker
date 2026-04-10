import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "https://project-tracker-chi-red.vercel.app",
    plugins: [],
});

export const { signIn, signUp, signOut, useSession } = authClient;
