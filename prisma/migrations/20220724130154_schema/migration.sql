/*
  Warnings:

  - You are about to drop the column `albums` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `artists` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `tracks` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `User` table. All the data in the column will be lost.
  - Made the column `year` on table `Album` required. This step will fail if there are existing NULL values in that column.
  - Made the column `grammy` on table `Artist` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `duration` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "favoriteId" TEXT,
ALTER COLUMN "year" SET NOT NULL;

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "favoriteId" TEXT,
ALTER COLUMN "grammy" SET NOT NULL;

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "albums",
DROP COLUMN "artists",
DROP COLUMN "tracks";

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "favoriteId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hash",
ADD COLUMN     "password" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "Favorite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "Favorite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "Favorite"("id") ON DELETE SET NULL ON UPDATE CASCADE;
