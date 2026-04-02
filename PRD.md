Product Requirements Document (PRD): Project Tracker & Timeline (Final Version)
1. Pendahuluan
Membangun sistem manajemen tugas internal dengan fokus pada visualisasi timeline dan pelacakan detail teknis. Sistem ini memastikan Ferel memiliki single source of truth untuk setiap progres proyek agar tidak ada detail yang terlewat.
2. Stack Teknologi (Evidence-Based Selection)
●	Framework: Next.js 15 (App Router) - Menggunakan React 19 features.
●	Auth: Better-Auth - Type-safe authentication.
●	Database & ORM: PostgreSQL + Drizzle ORM - Performance-first ORM.
●	Styling: Tailwind CSS + shadcn/ui untuk standar UI industri.
●	Containerization: Docker (Multi-stage build).
3. Spesifikasi Frontend (Tailwind & Shadcn)
A. Konfigurasi Visual
●	Theme: Dark/Light mode support menggunakan next-themes.
●	Custom Animation:
@keyframes pulse-red {
  0%, 100% { border-color: rgba(239, 68, 68, 1); box-shadow: 0 0 5px rgba(239, 68, 68, 0.5); }
  50% { border-color: rgba(239, 68, 68, 0.2); box-shadow: 0 0 20px rgba(239, 68, 68, 0.8); }
}
.task-critical { animation: pulse-red 2s infinite; }

B. Komponen Utama Shadcn
1.	DataTable: Untuk manajemen task dalam jumlah banyak.
2.	Date Range Picker: Menentukan startDate dan endDate task secara presisi.
3.	Scroll Area: Untuk konten catatan teknis yang panjang di dalam modal/sheet.
4. Struktur Backend & API (Route Handlers)
Semua API berada di /app/api/... dan menggunakan Next.js Middleware untuk validasi session.
A. Endpoint Definitions
●	GET /api/projects: Fetch projects with tasks summary.
●	POST /api/tasks: Create task dengan validasi Zod schema.
●	PATCH /api/tasks/[id]: Endpoint utama untuk Auto-save konten Markdown.
B. Proteksi Data (Evidence-Based)
// Menggunakan logical check di level database query
const result = await db.select()
  .from(tasks)
  .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)));

5. Containerization & Deployment
A. Dockerfile Optimization
Untuk menjalankan Docker di Next.js 15, next.config.ts harus diatur:
const nextConfig = {
  output: 'standalone', // Penting untuk Docker
};

B. Environment Variables Required (.env)
●	DATABASE_URL: Koneksi Postgres.
●	BETTER_AUTH_SECRET: Key untuk enkripsi session.
●	BETTER_AUTH_URL: Base URL aplikasi (misal: http://localhost:3000).
6. Fitur Anti-Lupa (Kritis)
1.	Markdown Support: Editor tugas mendukung format teknis (code blocks, tables).
2.	Visual Deadlines: Task yang berakhir dalam < 24 jam mendapatkan label "Imminent" dengan warna oranye menyala.
3.	Sync Progress: Trigger otomatis di level database atau API untuk kalkulasi % progres proyek setiap kali task di-update.
7. Rencana Rilis (Milestones)
●	Minggu 1: Inisialisasi Project (Docker, Drizzle Schema, shadcn/ui setup).
●	Minggu 2: Auth System (Better-Auth) & Project CRUD.
●	Minggu 3: Task Timeline Engine (CSS Grid based) & Auto-save Logic.
●	Minggu 4: Testing (UAT), Query Optimization, & Deployment.
Referensi Teknis:
●	Next.js Standalone: nextjs.org/docs/app/api-reference/next-config-js/output
●	Better-Auth Installation: docs.better-auth.com/docs/installation
●	Drizzle CRUD: orm.drizzle.team/docs/select
