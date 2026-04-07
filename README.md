# 🎨 Tienda Prado - Galería de Arte E-commerce

## 📋 **Descripción General**
Tienda Prado es una plataforma sofisticada de e-commerce para la venta de arte en galería, featuring tecnologías web modernas y experiencia de usuario profesional.

## 🛍️ **¿Qué Hace?**
- **Galería de Arte**: Navega y compra piezas de arte únicas
- **Búsqueda de Productos**: Búsqueda en tiempo real con auto-completado
- **Carrito de Compras**: Gestión de carrito basada en sesiones
- **Autenticación de Usuario**: Sistema seguro de login/registro
- **Procesamiento de Pagos**: Flujo de pago profesional
- **Generación de Facturas**: Facturas digitales con exportación PDF
- **Características de Admin**: Gestión de perfil de usuario

## 🎯 **Características Clave**
- 🔐 **Autenticación JWT** con manejo seguro de cookies
- 🛒 **Carrito de Compras Basado en Sesiones** con actualizaciones en tiempo real
- 🔍 **Búsqueda en Tiempo Real** con auto-completado debounced
- 📄 **Facturas Profesionales** con diseño de tema oscuro
- 📱 **Diseño Responsivo** optimizado para todos los dispositivos
- 🎨 **UI Moderna** con fondos animados y micro-interacciones
- 📊 **Logging Integral** con Winston
- 🗄️ **Integración de Base de Datos** con PostgreSQL y Prisma ORM

## 🛠️ **Stack Tecnológico**
- **Backend**: Express.js + TypeScript
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Frontend**: Plantillas Nunjucks + CSS personalizado
- **Autenticación**: Tokens JWT con hashing de contraseñas bcrypt
- **Generación PDF**: Puppeteer para exportación de facturas
- **Logging**: Winston para seguimiento integral de errores
- **Gestión de Sesiones**: Middleware de sesiones Express

## 🚀 **Para Empezar**

### 🐳 **Modo Docker (Recomendado)**
```bash
1. Clona el repositorio
2. Inicia con Docker: `docker-compose up --build`
3. Visita: `http://localhost:3000`
```

### 💻 **Modo Sin Docker**
```bash
1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Configura variables de entorno en `.env`
4. Ejecuta migraciones de base de datos: `npx prisma migrate dev`
5. Puebla base de datos: `npx prisma db seed`
6. Inicia servidor de desarrollo: `npm run dev`
7. Visita: `http://localhost:3000`
```

### 📦 **Datos de Productos**
- **Fuente**: `/data/products.json` - Datos offline de productos
- **Seed**: `prisma/seed.ts` - Script para poblar la base de datos
- **Uso**: Los productos aparecen sin necesidad de Docker

## 📁 **Estructura del Proyecto**
```
SSBW/
├── 📁 routes/          # Endpoints API y manejadores de rutas
├── 📁 views/           # Plantillas Nunjucks
├── 📁 utils/           # Funciones utilitarias
├── 📁 prisma/          # Esquema y cliente de base de datos
├── 📁 public/           # Assets estáticos e imágenes
└── 📄 index.ts         # Punto de entrada principal del servidor
```

## 🎨 **Filosofía de Diseño**
- **Tema Oscuro**: Esquema de color oscuro profesional con acentos dorados (#c9a84c)
- **Responsivo**: Enfoque de diseño mobile-first
- **Interactivo**: Animaciones suaves y micro-interacciones
- **Accesible**: HTML semántico e interfaces amigables con ARIA
- **Rendimiento**: Consultas optimizadas y carga de assets

## 📊 **Características Completadas (Tareas 1-6)**
✅ **Express & Node.js** - Configuración completa del servidor  
✅ **Base de Datos con Prisma** - Integración PostgreSQL  
✅ **Portada, búsqueda, detalle** - Todas las páginas implementadas  
✅ **Carrito & Logger** - Sistema completo de carrito + logging  
✅ **Autenticación** - Gestión de usuarios basada en JWT  

## 🔮 **Mejoras Futuras**
- Completación de API RESTful
- Migración a SPA React
- Integración de Tailwind CSS
- Despliegue en producción

---

**🎨 Tienda Prado - Donde el Arte Encuentra la Tecnología**
