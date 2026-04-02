Database Schema Design: Project Tracker & Timeline
Dokumen ini mendefinisikan struktur database PostgreSQL menggunakan Drizzle ORM. Desain ini dioptimalkan untuk konsistensi data dan performa query sesuai dengan PRD.
1. Enum Definitions
Digunakan untuk memastikan validitas data pada kolom status dan prioritas.
●	Priority Enum: ['low', 'medium', 'high', 'critical']
●	Status Enum: ['todo', 'in_progress', 'review', 'done']
2. Tabel Utama
A. Projects (projects)
Menyimpan informasi utama proyek.
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| id | uuid (PK) | Primary key, default: gen_random_uuid() |
| name | varchar(255) | Nama proyek (Not Null) |
| description | text | Deskripsi atau ringkasan proyek |
| userId | text | Owner proyek (FK ke user.id) |
| createdAt | timestamp | Waktu pembuatan (Default: now()) |
| updatedAt | timestamp | Waktu pembaruan terakhir |
B. Tasks (tasks)
Menyimpan detail tugas teknis.
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| id | uuid (PK) | Primary key |
| projectId | uuid | FK ke projects.id (On Delete Cascade) |
| userId | text | FK ke user.id (Untuk validasi kepemilikan) |
| title | varchar(255) | Judul tugas |
| content | text | Catatan detail Markdown (Auto-save target) |
| priority | enum | Tingkat urgensi (Default: medium) |
| status | enum | Status progres (Default: todo) |
| progress | integer | Persentase (0-100) |
| startDate | timestamp | Waktu mulai tugas |
| endDate | timestamp | Deadline (Trigger Visual Alert jika < 24 jam) |
| createdAt | timestamp | Timestamp audit |
| updatedAt | timestamp | Timestamp audit (Fitur Anti-Lupa) |
3. Better-Auth Schema (Required)
Tabel-tabel ini wajib ada agar integrasi Better-Auth berjalan dengan session-based auth.
●	User: Menyimpan profil pengguna.
●	Session: Mengelola token dan masa berlaku login.
●	Account: Menghubungkan provider OAuth (jika ada).
●	Verification: Menangani verifikasi email/password reset.
4. Drizzle ORM Implementation (TypeScript)
import { pgTable, uuid, text, timestamp, varchar, integer, pgEnum } from "drizzle-orm/pg-core";

// 1. Enums
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'critical']);
export const statusEnum = pgEnum('status', ['todo', 'in_progress', 'review', 'done']);

// 2. Users (Better-Auth Standard)
export const users = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified"),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
});

// 3. Projects
export const projects = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    userId: text("user_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// 4. Tasks
export const tasks = pgTable("tasks", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    userId: text("user_id").notNull().references(() => users.id),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"), 
    priority: priorityEnum("priority").default("medium").notNull(),
    status: statusEnum("status").default("todo").notNull(),
    progress: integer("progress").default(0).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

5. Referensi Teknis
●	Drizzle PG Schema: orm.drizzle.team/docs/column-types/pg
●	Better-Auth Core Schema: docs.better-auth.com/docs/concepts/database
●	PostgreSQL UUID: postgresql.org/docs/current/uuid-ossp.html
