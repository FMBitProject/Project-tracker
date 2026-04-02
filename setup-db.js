const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

async function setup() {
    const sql = postgres(process.env.DATABASE_URL);
    
    try {
        // Create user table (better-auth)
        await sql`
            CREATE TABLE IF NOT EXISTS "user" (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                "emailVerified" TIMESTAMP,
                image TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `;
        console.log('✓ User table created');

        // Create projects table
        await sql`
            CREATE TABLE IF NOT EXISTS "projects" (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                description TEXT,
                user_id TEXT NOT NULL REFERENCES "user"(id),
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `;
        console.log('✓ Projects table created');

        // Create tasks table
        await sql`
            CREATE TABLE IF NOT EXISTS "tasks" (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                project_id UUID NOT NULL REFERENCES "projects"(id) ON DELETE CASCADE,
                user_id TEXT NOT NULL REFERENCES "user"(id),
                title VARCHAR(255) NOT NULL,
                content TEXT,
                priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
                status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'cancelled')),
                progress INTEGER NOT NULL DEFAULT 0,
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `;
        console.log('✓ Tasks table created');

        // Create better-auth session table
        await sql`
            CREATE TABLE IF NOT EXISTS "session" (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `;
        console.log('✓ Session table created');

        // Create better-auth verification table
        await sql`
            CREATE TABLE IF NOT EXISTS "verification" (
                id TEXT PRIMARY KEY,
                identifier TEXT NOT NULL,
                value TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `;
        console.log('✓ Verification table created');

        console.log('\n✓ Database setup complete!');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await sql.end();
    }
}

setup();
