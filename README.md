# 🎨 Tienda Prado - E-commerce Art Gallery

## 📋 **Overview**
Tienda Prado is a sophisticated e-commerce platform for art gallery sales, featuring modern web technologies and professional user experience.

## 🛍️ **What It Does**
- **Art Gallery**: Browse and purchase unique artwork pieces
- **Product Search**: Real-time search with auto-complete functionality  
- **Shopping Cart**: Session-based cart management
- **User Authentication**: Secure login/registration system
- **Payment Processing**: Professional checkout flow
- **Invoice Generation**: Digital invoices with PDF export
- **Admin Features**: User profile management

## 🎯 **Key Features**
- 🔐 **JWT Authentication** with secure cookie handling
- 🛒 **Session-based Shopping Cart** with real-time updates
- 🔍 **Real-time Search** with debounced auto-complete
- 📄 **Professional Invoices** with dark theme design
- 📱 **Responsive Design** optimized for all devices
- 🎨 **Modern UI** with animated backgrounds and micro-interactions
- 📊 **Comprehensive Logging** with Winston
- 🗄️ **Database Integration** with PostgreSQL and Prisma ORM

## 🛠️ **Technology Stack**
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: Nunjucks templates + custom CSS
- **Authentication**: JWT tokens with bcrypt password hashing
- **PDF Generation**: Puppeteer for invoice exports
- **Logging**: Winston for comprehensive error tracking
- **Session Management**: Express session middleware

## 🚀 **Getting Started**
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`
6. Visit: `http://localhost:3000`

## 📁 **Project Structure**
```
SSBW/
├── 📁 routes/          # API endpoints and route handlers
├── 📁 views/           # Nunjucks templates
├── 📁 utils/           # Utility functions
├── 📁 prisma/          # Database schema and client
├── 📁 public/           # Static assets and images
└── 📄 index.ts         # Main server entry point
```

## 🎨 **Design Philosophy**
- **Dark Theme**: Professional dark color scheme with gold accents (#c9a84c)
- **Responsive**: Mobile-first design approach
- **Interactive**: Smooth animations and micro-interactions
- **Accessible**: Semantic HTML and ARIA-friendly interfaces
- **Performance**: Optimized database queries and asset loading

## 📊 **Completed Features (Tareas 1-6)**
✅ **Express & Node.js** - Complete server setup  
✅ **Database with Prisma** - PostgreSQL integration  
✅ **Portada, búsqueda, detalle** - All pages implemented  
✅ **Carrito & Logger** - Full cart system + logging  
✅ **Authentication** - JWT-based user management  

## 🔮 **Future Enhancements**
- RESTful API completion
- React SPA migration
- Tailwind CSS integration
- Production deployment

---

**🎨 Tienda Prado - Where Art Meets Technology**
