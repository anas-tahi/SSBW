-- Tarea 3: Esquema inicial para PostgreSQL
-- CreateTable
CREATE TABLE "usuarios" (
    "email" CHAR(127) NOT NULL,
    "nombre" CHAR(127) NOT NULL,
    "contraseña" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "telefono" CHAR(20),
    "direccion" TEXT,
    "fecha_nacimiento" TIMESTAMP(3),
    "genero" CHAR(20),
    "biografia" TEXT,
    "idioma" CHAR(5) NOT NULL DEFAULT 'es',
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "título" CHAR(127) NOT NULL,
    "descripción" TEXT NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "imagen" CHAR(127) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);
