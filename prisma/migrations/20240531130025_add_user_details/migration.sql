/*
  Warnings:

  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateDeNaissance` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroCarteElecteur` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postNom` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prenom` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "dateDeNaissance" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "numeroCarteElecteur" TEXT NOT NULL,
ADD COLUMN     "postNom" TEXT NOT NULL,
ADD COLUMN     "prenom" TEXT NOT NULL,
ADD COLUMN     "sex" TEXT NOT NULL;
