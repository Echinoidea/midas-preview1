import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper function to normalize values to match Enums
function mapEnum(value: string, enumObject: any): any {
  const formattedValue = value.trim().toUpperCase().replace(/\s+/g, "_");
  if (formattedValue === "ONE_OR_MORE") return true;
  if (formattedValue === "ZERO") return false;
  if (!(formattedValue in enumObject)) {
    throw new Error(`Unexpected value: ${value}`);
  }
  return enumObject[formattedValue];
}

// Boolean parsing helper
function parseBoolean(value: string): boolean {
  return value.trim().toLowerCase() === "yes" || value.trim().toLowerCase() === "one or more";
}

// Enums
const SchoolLevel = { MIDDLE: "MIDDLE", ELEMENTARY: "ELEMENTARY", HIGH: "HIGH" };
const Gender = { MALE: "MALE", FEMALE: "FEMALE" };
const Ethnicity = { WHITE: "WHITE", HISPANIC: "HISPANIC", OTHER_POC: "OTHER_POC" };
const RiskLevel = { LOW: "LOW", SOME: "SOME", HIGH: "HIGH" };

const CHUNK_SIZE = 500;

// Function to create a risk key for lookup
function getRiskKeyFromRecord(record: any): string {
  return JSON.stringify({
    officeReferrals: parseBoolean(record["odr_f"]),
    suspensions: parseBoolean(record["susp_f"]),
    gender: mapEnum(record["gender"], Gender),
    ethnicity: mapEnum(record["ethnicity"], Ethnicity),
    ell: parseBoolean(record["ell"]),
    schoolLevel: mapEnum(record["schoollevel"], SchoolLevel),
    mathRisk: mapEnum(record["math_f"], RiskLevel),
    readingRisk: mapEnum(record["read_f"], RiskLevel),
    mysaebrsEmo: mapEnum(record["mysaebrs_emo"], RiskLevel),
    mysaebrsSoc: mapEnum(record["mysaebrs_soc"], RiskLevel),
    mysaebrsAca: mapEnum(record["mysaebrs_aca"], RiskLevel),
    saebrsEmo: mapEnum(record["saebrs_emo"], RiskLevel),
    saebrsSoc: mapEnum(record["saebrs_soc"], RiskLevel),
    saebrsAca: mapEnum(record["saebrs_aca"], RiskLevel),
  });
}

export async function POST(request: Request) {
  try {
    const records = await request.json();
    if (!Array.isArray(records)) {
      return NextResponse.json({ message: "Invalid input format. Expected an array of objects." }, { status: 400 });
    }

    console.log(`Processing ${records.length} records in batches of ${CHUNK_SIZE}...`);

    const chunks = [];
    for (let i = 0; i < records.length; i += CHUNK_SIZE) {
      chunks.push(records.slice(i, i + CHUNK_SIZE));
    }

    let totalInserted = 0;

    for (const chunk of chunks) {
      console.log(`Processing batch of ${chunk.length} students...`);

      // Collect unique risk keys from the batch
      const uniqueRiskKeys = new Set<string>();
      for (const record of chunk) {
        uniqueRiskKeys.add(getRiskKeyFromRecord(record));
      }
      const uniqueKeysArray = Array.from(uniqueRiskKeys);
      const riskConditions = uniqueKeysArray.map(key => JSON.parse(key));

      // Query RiskLookup for matching rows
      const riskLookups = await prisma.riskLookup.findMany({
        where: { OR: riskConditions },
      });

      // Build a map: risk key → RiskLookup row
      const riskLookupMap = new Map<string, any>();
      for (const risk of riskLookups) {
        const key = JSON.stringify({
          officeReferrals: risk.officeReferrals,
          suspensions: risk.suspensions,
          gender: risk.gender,
          ethnicity: risk.ethnicity,
          ell: risk.ell,
          schoolLevel: risk.schoolLevel,
          mathRisk: risk.mathRisk,
          readingRisk: risk.readingRisk,
          mysaebrsEmo: risk.mysaebrsEmo,
          mysaebrsSoc: risk.mysaebrsSoc,
          mysaebrsAca: risk.mysaebrsAca,
          saebrsEmo: risk.saebrsEmo,
          saebrsSoc: risk.saebrsSoc,
          saebrsAca: risk.saebrsAca,
        });
        riskLookupMap.set(key, risk);
      }

      // Query for all MidasRisk rows for these riskLookups
      const riskLookupIds = riskLookups.map(r => r.id);
      const midasRisks = await prisma.midasRisk.findMany({
        where: { riskLookupId: { in: riskLookupIds } },
      });

      // Build a map: riskLookupId → { MIDAS, STUDENT, TEACHER }
      const midasRiskMap = new Map<number, { [factor: string]: any }>();
      for (const risk of midasRisks) {
        if (!midasRiskMap.has(risk.riskLookupId)) {
          midasRiskMap.set(risk.riskLookupId, {});
        }
        midasRiskMap.get(risk.riskLookupId)![risk.factor] = risk;
      }

      // Process student upserts
      const upsertQueries = chunk
        .map((record) => {
          try {
            const studentId = record["studentid"];
            const riskKey = getRiskKeyFromRecord(record);
            const riskLookup = riskLookupMap.get(riskKey);

            if (!riskLookup) {
              console.error(`❌ No RiskLookup found for student: ${studentId}`);
              return null;
            }

            const risksForLookup = midasRiskMap.get(riskLookup.id);
            if (
              !risksForLookup ||
              !risksForLookup["MIDAS"] ||
              !risksForLookup["STUDENT"] ||
              !risksForLookup["TEACHER"]
            ) {
              console.error(`❌ Missing risk factors for student: ${studentId}`);
              return null;
            }

            return prisma.student.upsert({
              where: { studentId },
              update: {
                schoolId: 1,
                schoolLevel: mapEnum(record["schoollevel"], SchoolLevel),
                gradeLevel: Number(record["gradelevel"]),
                classroomId: record["classroom"],
                gender: mapEnum(record["gender"], Gender),
                ethnicity: mapEnum(record["ethnicity"], Ethnicity),
                ell: parseBoolean(record["ell"]),
                officeReferrals: parseBoolean(record["odr_f"]),
                suspensions: parseBoolean(record["susp_f"]),
                mathRisk: mapEnum(record["math_f"], RiskLevel),
                readingRisk: mapEnum(record["read_f"], RiskLevel),
                midasRiskId: risksForLookup["MIDAS"].id,
                studentRiskId: risksForLookup["STUDENT"].id,
                teacherRiskId: risksForLookup["TEACHER"].id,
                riskLookupId: riskLookup.id,
              },
              create: {
                schoolId: 1,
                schoolLevel: mapEnum(record["schoollevel"], SchoolLevel),
                gradeLevel: Number(record["gradelevel"]),
                classroomId: record["classroom"],
                studentId,
                gender: mapEnum(record["gender"], Gender),
                ethnicity: mapEnum(record["ethnicity"], Ethnicity),
                ell: parseBoolean(record["ell"]),
                officeReferrals: parseBoolean(record["odr_f"]),
                suspensions: parseBoolean(record["susp_f"]),
                mathRisk: mapEnum(record["math_f"], RiskLevel),
                readingRisk: mapEnum(record["read_f"], RiskLevel),
                midasRiskId: risksForLookup["MIDAS"].id,
                studentRiskId: risksForLookup["STUDENT"].id,
                teacherRiskId: risksForLookup["TEACHER"].id,
                riskLookupId: riskLookup.id,
              },
            });
          } catch (err) {
            console.error(`❌ Error processing student ${record["studentid"]}:`, err);
            return null;
          }
        })
        .filter(
          (query): query is ReturnType<typeof prisma.student.upsert> => query !== null
        );

      if (upsertQueries.length === 0) continue;

      console.log(`Executing transaction for ${upsertQueries.length} students...`);
      const updatedStudents = await prisma.$transaction(upsertQueries);
      totalInserted += updatedStudents.length;
    }

    console.log(`✅ Successfully inserted/updated ${totalInserted} students.`);
    return NextResponse.json({ message: "Upload successful", count: totalInserted });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Error processing data", error }, { status: 500 });
  }
}
