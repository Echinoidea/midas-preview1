-- CreateEnum
CREATE TYPE "SchoolLevel" AS ENUM ('MIDDLE', 'ELEMENTARY', 'HIGH');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Ethnicity" AS ENUM ('WHITE', 'HISPANIC', 'OTHER_POC');

-- CreateEnum
CREATE TYPE "YesNo" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'SOME', 'HIGH');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('LOW', 'SOME', 'HIGH');

-- CreateEnum
CREATE TYPE "Factor" AS ENUM ('MIDAS', 'STUDENT', 'TEACHER');

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "schoolLevel" "SchoolLevel" NOT NULL,
    "gradeLevel" INTEGER NOT NULL,
    "classroomId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "ethnicity" "Ethnicity" NOT NULL,
    "ell" "YesNo" NOT NULL,
    "officeReferrals" "YesNo" NOT NULL,
    "suspensions" "YesNo" NOT NULL,
    "mathRisk" "RiskLevel" NOT NULL,
    "readingRisk" "RiskLevel" NOT NULL,
    "mysaebrsId" INTEGER,
    "saebrsId" INTEGER,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MYSaebrs" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER,

    CONSTRAINT "MYSaebrs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saebrs" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER,

    CONSTRAINT "Saebrs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskScore" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "factor" "Factor" NOT NULL,
    "hasRisk" "YesNo" NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "confidence" "ConfidenceLevel" NOT NULL,

    CONSTRAINT "RiskScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentId_key" ON "Student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_mysaebrsId_key" ON "Student"("mysaebrsId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_saebrsId_key" ON "Student"("saebrsId");

-- CreateIndex
CREATE UNIQUE INDEX "MYSaebrs_studentId_key" ON "MYSaebrs"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Saebrs_studentId_key" ON "Saebrs"("studentId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MYSaebrs" ADD CONSTRAINT "MYSaebrs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saebrs" ADD CONSTRAINT "Saebrs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskScore" ADD CONSTRAINT "RiskScore_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
