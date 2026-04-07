-- CreateTable
CREATE TABLE "usuarios" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "telefono" TEXT,
    "direccion" TEXT,
    "fecha_nacimiento" DATETIME,
    "genero" TEXT,
    "biografia" TEXT,
    "idioma" TEXT NOT NULL DEFAULT 'es',
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" DATETIME
);

-- CreateTable
CREATE TABLE "productos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "título" TEXT NOT NULL,
    "descripción" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "imagen" TEXT NOT NULL
);
