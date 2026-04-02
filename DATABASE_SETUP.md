# Database Setup Guide

## Problem
Sign up tidak berfungsi karena PostgreSQL database tidak running atau tabel belum dibuat.

## Solusi

### Opsi 1: Gunakan Neon (PostgreSQL Cloud - Gratis, Recommended)

1. **Buat akun di [Neon](https://neon.tech)** (gratis, no credit card required)

2. **Buat project baru** dan dapatkan connection string

3. **Update `.env.local`**:
   ```env
   DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/project_tracker?sslmode=require
   ```

4. **Jalankan migrasi**:
   ```bash
   npm run db:push
   ```

5. **Restart dev server**:
   ```bash
   npm run dev
   ```

### Opsi 2: Gunakan PostgreSQL Lokal

#### Ubuntu/Debian:
```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
sudo service postgresql start

# Create database
sudo -u postgres psql
CREATE DATABASE project_tracker;
ALTER USER postgres PASSWORD 'postgres';
\q

# Update .env.local
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/project_tracker

# Run migrations
npm run db:push
```

#### macOS (dengan Homebrew):
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb project_tracker
psql -d project_tracker -c "ALTER USER postgres PASSWORD 'postgres';"

# Update .env.local dan run migrations
npm run db:push
```

### Opsi 3: Gunakan Docker (Jika Tersedia)

```bash
# Start PostgreSQL dengan Docker
docker run -d \
  --name project-tracker-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=project_tracker \
  -p 5432:5432 \
  postgres:15-alpine

# Tunggu database siap (sekitar 5 detik)
sleep 5

# Run migrations
npm run db:push
```

## Verifikasi Setup

Setelah setup database, verifikasi dengan:

```bash
# Cek koneksi database
npm run db:push

# Jika berhasil, akan muncul:
# ✓ The database schema has been updated
```

## Testing Sign Up

1. Start dev server: `npm run dev`
2. Buka `http://localhost:3000/auth/signup`
3. Isi form:
   - Name: Test User
   - Email: test@example.com
   - Password: test1234 (min 8 karakter)
4. Klik "Sign Up"
5. Seharusnya redirect ke signin page dengan pesan sukses

## Troubleshooting

### Error: "connect ECONNREFUSED"
- PostgreSQL tidak running
- Pastikan service PostgreSQL aktif atau gunakan Neon

### Error: "database does not exist"
- Database `project_tracker` belum dibuat
- Jalankan: `createdb project_tracker` atau gunakan Neon

### Error: "password authentication failed"
- Password user postgres salah
- Update `.env.local` dengan password yang benar

### Sign up masih tidak berfungsi?
1. Buka browser console (F12)
2. Lihat error message di Console tab
3. Error dari server akan tampil di Network tab → `/api/auth/email/sign-up`

## Environment Variables Required

```env
# Database (WAJIB)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/project_tracker

# Better-Auth (WAJIB)
BETTER_AUTH_SECRET=your-secret-key-min-32-characters-long
BETTER_AUTH_URL=http://localhost:3000

# Application (Opsional)
NEXT_PUBLIC_APP_NAME=Project Tracker
```
