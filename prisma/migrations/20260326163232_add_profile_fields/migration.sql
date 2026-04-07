-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "actualizado_en" TIMESTAMP,
ADD COLUMN     "biografia" TEXT,
ADD COLUMN     "creado_en" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "fecha_nacimiento" TIMESTAMP,
ADD COLUMN     "genero" CHAR(10),
ADD COLUMN     "idioma" CHAR(5) DEFAULT 'es',
ADD COLUMN     "newsletter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "telefono" CHAR(20);
