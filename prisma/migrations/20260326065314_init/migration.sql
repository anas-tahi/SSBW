-- CreateTable
CREATE TABLE "usuarios" (
    "email" CHAR(127) NOT NULL,
    "nombre" CHAR(127) NOT NULL,
    "contraseña" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,

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
