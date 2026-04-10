import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // Pastikan path ini benar ke file db/index.ts kamu
import * as schema from "@/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        }
    }),
    emailAndPassword: {
        enabled: true
    },
    // Wajib didaftarkan karena URL IDX sangat panjang dan unik
    trustedOrigins: [
        "https://3000-firebase-project-tracker-1775093705756.cluster-cd3bsnf6r5bemwki2bxljme5as.cloudworkstations.dev",
        "https://project-tracker-chi-red.vercel.app"
    ],
});