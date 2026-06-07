# 🎨 Tienda Prado — SSBW

---

## 🇪🇸 Español


> 🌐 **Demo en vivo**: https://ssbw-app.onrender.com

> Proyecto final de la asignatura **Server Side and Browser Web** (SSBW)
> Universidad de Granada — Grado en Ingeniería Informática
> **Autor**: Anas Tahir

### 📌 Descripción

Réplica de la [Tienda Prado](https://tiendaprado.com/es/385-impresiones) construida con **tres arquitecturas web distintas**, demostrando diferentes enfoques de desarrollo web moderno.

| App | Puerto | Tareas | Tecnologías |
|-----|--------|--------|-------------|
| Express MPA | `:3000` | 1–8, 13 | Express, Nunjucks, PostgreSQL, Prisma |
| React SPA | `:5173` | 9–10 | Vite, React, Tailwind, DaisyUI |
| Astro SSG | `:4321` | 11–12 | Astro, React Islands |

### 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                          NAVEGADOR                              │
│                                                                 │
│    :3000 Express MPA      :5173 React SPA    :4321 Astro SSG   │
│    (Nunjucks + HTML)      (Vite + React)     (Estático)        │
└──────────┬────────────────────┬────────────────────────────────-┘
           │                    │
           ▼                    ▼
  ┌─────────────────┐   ┌──────────────┐
  │  Express API    │◄──│  fetch / SWR │
  │  :3000/api      │   └──────────────┘
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │   Prisma ORM    │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  PostgreSQL 16  │  (Docker)
  └─────────────────┘
```

### 📁 Estructura del Proyecto

```
SSBW/
├── anas_tahir_sswb/               ← App principal (Tareas 1–8 + 13)
│   ├── index.ts                   ← Servidor Express
│   ├── docker-compose.yml         ← PostgreSQL en Docker (dev)
│   ├── docker-compose-prod.yml    ← Producción (DB + App + Caddy)
│   ├── Dockerfile                 ← Contenedor Node 24 alpine
│   ├── Caddyfile                  ← Proxy inverso
│   ├── Makefile                   ← Comandos útiles
│   ├── scrap-tp.js                ← Web scraper (Playwright)
│   ├── productos.json             ← 112 productos scrapeados
│   ├── registra_usuarios.ts       ← Script de usuarios de prueba
│   ├── routes/                    ← Controladores MVC
│   │   ├── productos.ts           ← Portada, detalle, búsqueda, carrito
│   │   ├── usuarios.ts            ← Login, logout, JWT
│   │   └── api.productos.ts       ← API JSON para React
│   ├── views/                     ← Plantillas Nunjucks
│   │   ├── base.njk               ← Layout base compartido
│   │   ├── portada.njk            ← Página principal
│   │   ├── detalle.njk            ← Detalle de producto
│   │   ├── carrito.njk            ← Carrito de compra
│   │   └── login.njk              ← Autenticación
│   ├── prisma/
│   │   ├── schema.prisma          ← Modelos Producto + Usuario
│   │   └── seed.ts                ← Carga 112 productos en BD
│   └── frontend/                  ← React SPA (Tareas 9–10)
│       └── src/
│           ├── App.tsx            ← Rutas React Router
│           ├── components/        ← Perritos, Cuadros, Header
│           └── pages/             ← Portada, Tarea9, Carousel...
│
└── astro/                         ← Astro SSG (Tareas 11–12)
    ├── data/productos.json        ← Datos para SSG
    ├── public/images/             ← Imágenes estáticas
    └── src/
        ├── pages/
        │   ├── index.astro        ← Portada
        │   ├── carrousel.astro    ← Galería React Island
        │   ├── ssg.astro          ← 12 productos destacados
        │   └── productos/
        │       └── [slug].astro   ← Detalle estático por producto
        └── components/
            ├── CarrouselSSG.tsx   ← Carousel con props (React)
            ├── CardProducto.astro ← Tarjeta de producto
            └── Welcome.astro      ← Portada Astro
```

### 🚀 Cómo ejecutar

**Primera vez:**
```bash
cd anas_tahir_sswb

docker compose up -d                  # Iniciar PostgreSQL
npm install                           # Dependencias backend
cd frontend && npm install && cd ..   # Dependencias React
cd astro    && npm install && cd ..   # Dependencias Astro

cp .env.example .env                  # Configurar variables
npx prisma migrate dev
npx prisma generate
npm run seed                          # Cargar 112 productos
npm run registrar                     # Crear usuarios de prueba
```

**Cada vez:**
```bash
# Terminal 1
docker compose up -d

# Terminal 2 — Express MPA
npm run dev                    # → http://localhost:3000

# Terminal 3 — React SPA
cd frontend && npm run dev     # → http://localhost:5173

# Terminal 4 — Astro SSG
cd astro    && npm run dev     # → http://localhost:4321
```

**Makefile:**
```bash
make dev        # Iniciar Express
make db-up      # Iniciar PostgreSQL
make seed       # Cargar productos
make registrar  # Crear usuarios
make migrate    # Migrar + generar Prisma
make db-studio  # Abrir Prisma Studio
make prod-up    # Arrancar en producción
```

### 🌐 URLs

| URL | Descripción |
|-----|-------------|
| http://localhost:3000 | MPA — Tienda completa |
| http://localhost:3000/login | Página de login |
| http://localhost:3000/buscar?busqueda=lámina | Búsqueda |
| http://localhost:3000/api/productos | API REST (JSON) |
| http://localhost:5173 | React SPA |
| http://localhost:5173/tarea9 | Perritos + Cuadros |
| http://localhost:5173/carousel | Embla Carousel |
| http://localhost:4321 | Astro SSG |
| http://localhost:4321/ssg | Productos destacados |

### 👤 Usuarios de prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@tiendaprado.com | admin123 | Admin |
| usuario@tiendaprado.com | user123 | Usuario |
| cliente@tiendaprado.com | cliente123 | Cliente |

### 📋 Tareas completadas

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| 1 | Express + Node.js + Nunjucks + Makefile | ✅ |
| 2 | Web Scraping con Playwright (112 productos) | ✅ |
| 3 | PostgreSQL + Docker + Prisma ORM | ✅ |
| 4 | MVC — Portada, búsquedas, detalle | ✅ |
| 5 | Carrito de compra con sesiones | ✅ |
| 6 | Autenticación JWT + bcrypt + cookies | ✅ |
| 8 | UX Login + carrito con DOM template | ✅ |
| 9 | React + Vite + Tailwind + Perritos + Cuadros | ✅ |
| 10 | React Router + Embla Carousel + DaisyUI | ✅ |
| 11 | Astro Framework + React Islands | ✅ |
| 12 | Static Site Generation + getStaticPaths() | ✅ |
| 13 | Dockerfile + docker-compose-prod + Caddy | ✅ |

---

## 🇬🇧 English

> Final project for the **Server Side and Browser Web** (SSBW) course
> University of Granada — Computer Science Degree
> **Author**: Anas Tahir

### 📌 Description

A replica of [Tienda Prado](https://tiendaprado.com/es/385-impresiones) built with **three different web architectures**, demonstrating modern web development approaches.

| App | Port | Tasks | Technologies |
|-----|------|-------|-------------|
| Express MPA | `:3000` | 1–8, 13 | Express, Nunjucks, PostgreSQL, Prisma |
| React SPA | `:5173` | 9–10 | Vite, React, Tailwind, DaisyUI |
| Astro SSG | `:4321` | 11–12 | Astro, React Islands |

### 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           BROWSER                               │
│                                                                 │
│    :3000 Express MPA      :5173 React SPA    :4321 Astro SSG   │
│    (Nunjucks + HTML)      (Vite + React)     (Static)          │
└──────────┬────────────────────┬────────────────────────────────-┘
           │                    │
           ▼                    ▼
  ┌─────────────────┐   ┌──────────────┐
  │  Express API    │◄──│  fetch / SWR │
  │  :3000/api      │   └──────────────┘
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │   Prisma ORM    │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  PostgreSQL 16  │  (Docker)
  └─────────────────┘
```

### 🚀 How to run

**First time:**
```bash
cd anas_tahir_sswb

docker compose up -d                  # Start PostgreSQL
npm install                           # Backend deps
cd frontend && npm install && cd ..   # React deps
cd astro    && npm install && cd ..   # Astro deps

cp .env.example .env                  # Configure variables
npx prisma migrate dev
npx prisma generate
npm run seed                          # Load 112 products
npm run registrar                     # Create test users
```

**Every time:**
```bash
# Terminal 1
docker compose up -d

# Terminal 2 — Express MPA
npm run dev                    # → http://localhost:3000

# Terminal 3 — React SPA
cd frontend && npm run dev     # → http://localhost:5173

# Terminal 4 — Astro SSG
cd astro    && npm run dev     # → http://localhost:4321
```

### 👤 Test Users

| Email | Password | Role |
|-------|---------|------|
| admin@tiendaprado.com | admin123 | Admin |
| usuario@tiendaprado.com | user123 | User |
| cliente@tiendaprado.com | cliente123 | Client |

### ✅ Completed Tasks

| Task | Description | Status |
|------|-------------|--------|
| 1 | Express + Node.js + Nunjucks + Makefile | ✅ |
| 2 | Web Scraping with Playwright (112 products) | ✅ |
| 3 | PostgreSQL + Docker + Prisma ORM | ✅ |
| 4 | MVC — Home, search, product detail | ✅ |
| 5 | Shopping cart with sessions | ✅ |
| 6 | JWT + bcrypt authentication + cookies | ✅ |
| 8 | Login UX improvements + DOM cart | ✅ |
| 9 | React + Vite + Tailwind + Perritos + Cuadros | ✅ |
| 10 | React Router + Embla Carousel + DaisyUI | ✅ |
| 11 | Astro Framework + React Islands | ✅ |
| 12 | Static Site Generation + getStaticPaths() | ✅ |
| 13 | Dockerfile + docker-compose-prod + Caddy | ✅ |

---

*Universidad de Granada — SSBW 2025/2026*
