/*
  Warnings:

  - You are about to drop the column `mysaebrsId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `saebrsId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `MYSaebrs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RiskScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Saebrs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[midasRiskId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherRiskId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentRiskId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `ell` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `officeReferrals` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `suspensions` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "MYSaebrs" DROP CONSTRAINT "MYSaebrs_studentId_fkey";

-- DropForeignKey
ALTER TABLE "RiskScore" DROP CONSTRAINT "RiskScore_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Saebrs" DROP CONSTRAINT "Saebrs_studentId_fkey";

-- DropIndex
DROP INDEX "Student_mysaebrsId_key";

-- DropIndex
DROP INDEX "Student_saebrsId_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "mysaebrsId",
DROP COLUMN "saebrsId",
ADD COLUMN     "midasRiskId" INTEGER,
ADD COLUMN     "riskLookupId" INTEGER,
ADD COLUMN     "studentRiskId" INTEGER,
ADD COLUMN     "teacherRiskId" INTEGER,
DROP COLUMN "ell",
ADD COLUMN     "ell" BOOLEAN NOT NULL,
DROP COLUMN "officeReferrals",
ADD COLUMN     "officeReferrals" BOOLEAN NOT NULL,
DROP COLUMN "suspensions",
ADD COLUMN     "suspensions" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "MYSaebrs";

-- DropTable
DROP TABLE "RiskScore";

-- DropTable
DROP TABLE "Saebrs";

-- DropEnum
DROP TYPE "YesNo";

-- CreateTable
CREATE TABLE "RiskLookup" (
    "id" SERIAL NOT NULL,
    "officeReferrals" BOOLEAN NOT NULL,
    "suspensions" BOOLEAN NOT NULL,
    "gender" "Gender" NOT NULL,
    "ethnicity" "Ethnicity" NOT NULL,
    "ell" BOOLEAN NOT NULL,
    "schoolLevel" "SchoolLevel" NOT NULL,
    "mathRisk" "RiskLevel" NOT NULL,
    "readingRisk" "RiskLevel" NOT NULL,
    "mysaebrsEmo" "RiskLevel" NOT NULL,
    "mysaebrsSoc" "RiskLevel" NOT NULL,
    "mysaebrsAca" "RiskLevel" NOT NULL,
    "saebrsEmo" "RiskLevel" NOT NULL,
    "saebrsSoc" "RiskLevel" NOT NULL,
    "saebrsAca" "RiskLevel" NOT NULL,

    CONSTRAINT "RiskLookup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MidasRisk" (
    "id" SERIAL NOT NULL,
    "riskLookupId" INTEGER NOT NULL,
    "factor" "Factor" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "lower" DOUBLE PRECISION NOT NULL,
    "upper" DOUBLE PRECISION NOT NULL,
    "hasRisk" BOOLEAN NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "confidence" "ConfidenceLevel" NOT NULL,

    CONSTRAINT "MidasRisk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_midasRiskId_key" ON "Student"("midasRiskId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_teacherRiskId_key" ON "Student"("teacherRiskId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentRiskId_key" ON "Student"("studentRiskId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_midasRiskId_fkey" FOREIGN KEY ("midasRiskId") REFERENCES "MidasRisk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_teacherRiskId_fkey" FOREIGN KEY ("teacherRiskId") REFERENCES "MidasRisk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentRiskId_fkey" FOREIGN KEY ("studentRiskId") REFERENCES "MidasRisk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_riskLookupId_fkey" FOREIGN KEY ("riskLookupId") REFERENCES "RiskLookup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MidasRisk" ADD CONSTRAINT "MidasRisk_riskLookupId_fkey" FOREIGN KEY ("riskLookupId") REFERENCES "RiskLookup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
