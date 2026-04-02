Development Plan: Project Tracker & Timeline
Dokumen ini berisi langkah-langkah teknis mendetail untuk membangun aplikasi sesuai dengan PRD yang telah disepakati.
Fase 1: Persiapan & Inisialisasi
●	[ ] Setup Project: Inisialisasi Next.js 15 dengan App Router, Tailwind CSS, dan TypeScript.
●	[ ] Instalasi Dependency:
○	Database: drizzle-orm, postgres, drizzle-kit.
○	Auth: better-auth.
○	UI: lucide-react, shadcn/ui (Button, Card, Dialog, Calendar, Form).
●	[ ] Konfigurasi Database: Setup koneksi PostgreSQL (Local/Neon/Supabase) dan inisialisasi skema Drizzle.
●	[ ] Autentikasi: Konfigurasi Better-Auth client & server side.
Fase 2: Pengembangan Frontend (UI/UX)
●	[ ] Layouting: Membuat Sidebar navigasi dan Header profil.
●	[ ] Dashboard View:
○	Implementasi Metric Cards (Total Tasks, Overdue, Critical).
○	Project List Grid.
●	[ ] Timeline Component:
○	Membuat grid visual untuk Timeline (Month/Week view).
○	Mapping data task ke dalam horizontal bar.
●	[ ] Task Detail Interface:
○	Membuat Modal untuk detail task.
○	Implementasi Rich Text/Markdown editor untuk bagian content.
Fase 3: Pengembangan Backend & Integrasi
●	[ ] API & Server Actions:
○	CRUD Proyek (Create, Read, Update, Delete).
○	CRUD Task dengan validasi tanggal (start date < end date).
●	[ ] Business Logic:
○	Fungsi kalkulasi progres otomatis.
○	Sistem sorting berdasarkan prioritas critical -> high -> medium -> low.
●	[ ] Middleware: Proteksi route /dashboard dan /project/[id].
Fase 4: Fitur Khusus & Optimasi
●	[ ] Auto-save: Implementasi debounce untuk penyimpanan otomatis pada field content.
●	[ ] Visual Alerts: Menambahkan animasi/highlight pada task berstatus 'Critical' yang mendekati deadline.
●	[ ] Audit Trail: Menampilkan "Last updated" pada setiap komponen task.
Fase 5: Deployment & QA
●	[ ] Testing: Uji coba skenario input data kosong, tanggal yang tidak valid, dan akses ilegal (cross-user).
●	[ ] Deployment: Deploy ke Vercel dan sinkronisasi database production.
Referensi Implementasi:
●	Next.js App Router Patterns
●	Drizzle Relational Queries
●	Better-Auth Integration Guide
