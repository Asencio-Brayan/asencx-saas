/*
  Warnings:

  - The values [ADMIN,CUSTOMER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- First: Migrate existing data to new roles
UPDATE "User" SET "role" = 'SUPER_ADMIN' WHERE "role" = 'ADMIN';
UPDATE "User" SET "role" = 'TENANT_OWNER' WHERE "role" = 'CUSTOMER';

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SUPER_ADMIN', 'TENANT_OWNER', 'TENANT_USER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'TENANT_OWNER';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'TENANT_OWNER';
