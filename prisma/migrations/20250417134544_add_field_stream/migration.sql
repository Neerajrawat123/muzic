/*
  Warnings:

  - Added the required column `bigPic` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smallPic` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "bigPic" TEXT NOT NULL,
ADD COLUMN     "creator" TEXT NOT NULL,
ADD COLUMN     "smallPic" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
