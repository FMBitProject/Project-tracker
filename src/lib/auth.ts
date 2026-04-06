import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // Pastikan ini mengarah ke file db kamu (src/db/index.ts)
import * as schema from "@/db/schema"; // Mengambil semua tabel dari schema

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
    // Tambahkan ini supaya aman di Project IDX
    trustedOrigins: [
        "https://3000-firebase-project-tracker-1775093705756.cluster-cd3bsnf6r5bemwki2bxljme5as.cloudworkstations.dev"
    ],
});