-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('host', 'member');

-- AlterTable
ALTER TABLE "SpaceMember" ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'member';
