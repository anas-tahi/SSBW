# 🎨 Tienda Prado — SSBW

> Proyecto final — **Server Side and Browser Web (SSBW)**
> Universidad de Granada · Grado en Ingeniería Informática · **Anas Tahir**

---

## 🌐 Deployments en vivo

| App | URL | Estado |
|-----|-----|--------|
| 🖥️ Express MPA (Tareas 1–8, 13) | [ssbw-app.onrender.com](https://ssbw-app.onrender.com) | ✅ Live |
| ⚛️ React SPA (Tareas 9–10) | [ssbw-react.onrender.com](https://ssbw-react.onrender.com) | ✅ Live |
| 🚀 Astro SSG (Tareas 11–12) | [ssbw-astro.onrender.com](https://ssbw-astro.onrender.com) | ✅ Live |

> ⚠️ Las instancias gratuitas de Render pueden tardar ~50 segundos en arrancar si llevan tiempo inactivas.

---

## 📖 Descripción

Réplica de la [Tienda Prado](https://tiendaprado.com/es/385-impresiones) construida con **tres arquitecturas web distintas**, demostrando distintos enfoques de desarrollo web moderno.

| App | Puerto | Tareas | Tecnologías |
|-----|--------|--------|-------------|
| Express MPA | `:3000` | 1–8, 13 | Express, Nunjucks, PostgreSQL, Prisma |
| React SPA | `:5173` | 9–10 | Vite, React, Tailwind, DaisyUI |
| Astro SSG | `:4321` | 11–12 | Astro, React Islands |

---

## 🏗️ Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                           │
│                                                            │
│  :3000 Express MPA    :5173 React SPA    :4321 Astro SSG  │
│  (Nunjucks + HTML)    (Vite + React)     (Estático)       │
└──────────┬────────────────────┬───────────────────────────┘
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
  │  PostgreSQL 16  │
  └─────────────────┘
```

---

## ✅ Tareas completadas

| Tarea | Descripción | App |
|-------|-------------|-----|
| 1 | Listado de productos | Express MPA |
| 2 | Detalle de producto | Express MPA |
| 3 | Carrito de compra | Express MPA |
| 4 | Checkout y pedido | Express MPA |
| 5 | Registro de usuario | Express MPA |
| 6 | Login / Logout | Express MPA |
| 7 | Perfil de usuario | Express MPA |
| 8 | Panel de administración | Express MPA |
| 9 | SPA con React + Vite | React SPA |
| 10 | Carrusel con Embla | React SPA |
| 11 | Carrusel SSG con Astro | Astro SSG |
| 12 | Páginas estáticas con getStaticPaths | Astro SSG |
| 13 | Docker + Caddy producción | Express MPA |

---

## 🚀 Ejecución local

### Express MPA
```bash
cd anas_tahir_sswb
cp .env.example .env      # rellenar variables
npm install
npx prisma generate
npx prisma migrate dev
npm run dev               # http://localhost:3000
```

### React SPA
```bash
cd anas_tahir_sswb/frontend
npm install
npm run dev               # http://localhost:5173
```

### Astro SSG
```bash
cd astro
npm install
npm run dev               # http://localhost:4321
```

---

## 🔑 Usuarios de prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@tiendaprado.com | admin123 | Admin |
| usuario@tiendaprado.com | user123 | Usuario |
| cliente@tiendaprado.com | cliente123 | Cliente |

---

## 🐳 Producción con Docker

```bash
cd anas_tahir_sswb
cp .env.example .env      # rellenar con credenciales reales
docker compose -f docker-compose-prod.yml up -d
```

Servicios: **PostgreSQL** + **Express** + **Caddy** (reverse proxy HTTPS)

---

## 👤 Autor

**Anas Tahir** · [e.anastahir@go.ugr.es](mailto:e.anastahir@go.ugr.es)
Universidad de Granada · SSBW · 2024–2025

---

## 🇬🇧 English

# Tienda Prado — SSBW

Final project for **Server Side and Browser Web** at the University of Granada.

A replica of the [Prado Museum Store](https://tiendaprado.com) built with three different web architectures.

### Live URLs
- **Express MPA**: https://ssbw-app.onrender.com
- **React SPA**: https://ssbw-react.onrender.com
- **Astro SSG**: https://ssbw-astro.onrender.com

### Tech Stack
- **Backend**: Node.js, Express, Nunjucks, Prisma, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS, DaisyUI, Embla Carousel
- **SSG**: Astro, React Islands
- **DevOps**: Docker, Caddy, Render

### Test Users
| Email | Password | Role |
|-------|----------|------|
| admin@tiendaprado.com | admin123 | Admin |
| usuario@tiendaprado.com | user123 | User |
| cliente@tiendaprado.com | cliente123 | Client |
