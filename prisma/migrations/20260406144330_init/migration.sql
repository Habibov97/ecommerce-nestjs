-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('GOOGLE', 'PHONE', 'FACEBOOK', 'EMAIL');

-- CreateEnum
CREATE TYPE "UserProvider" AS ENUM ('LOCAL', 'FIRABASE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "provider" "UserProvider" NOT NULL DEFAULT 'LOCAL',
    "providerId" TEXT,
    "providerType" "ProviderType" DEFAULT 'EMAIL',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
