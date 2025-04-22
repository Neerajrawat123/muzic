/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Space` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Space_code_key" ON "Space"("code");
