// scripts/uploadMidasRiskStream.ts
import * as fs from "fs";
import { parse } from "csv-parse";
import prisma from "../lib/prisma";

// Mapping function for risk level values from the CSV.
function mapRiskLevel(riskLevel: string): string {
  const rl = riskLevel.trim().toLowerCase();
  if (rl === "marked") return "HIGH";
  if (rl === "moderate" || rl === "moderated") return "SOME";
  if (rl === "very low to mild") return "LOW";
  // Fallback, in case unexpected value comes in.
  return rl.toUpperCase();
}

function mapConfidence(confidence: string): string {
  // Adjust mapping as needed. For now, we'll assume confidence values are already acceptable.
  return confidence.trim().toUpperCase();
}

async function main() {
  const filePath = "/home/gabriel/code/data/MIDAS Website/results/midasrisk_lookup.csv";
  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  );

  const batchSize = 1000;
  let batch: any[] = [];
  let totalInserted = 0;


  let counter = 0;
  // Process the CSV stream line by line.
  for await (const record of parser) {
    // Parse and convert values from the CSV:
    const riskLookupId = Number(record["id"]);
    const factor = record["factor"].trim().toUpperCase(); // Expecting "Midas", "Student", or "Teacher"
    const value = Number(record["value"]);
    const lower = Number(record[".lower"]);
    const upper = Number(record[".upper"]);
    // We ignore ".width" if not needed.
    const hasRisk = record["hasrisk"].trim().toLowerCase() === "yes";
    // Map risklevel using our custom mapping
    const riskLevel = mapRiskLevel(record["risklevel"]);
    // Map confidence (if needed)
    const confidence = mapConfidence(record["confidence"]);

    const dataRow = {
      riskLookupId,
      factor,
      value,
      lower,
      upper,
      hasRisk,
      riskLevel,
      confidence,
    };

    batch.push(dataRow);

    if (batch.length >= batchSize) {
      const result = await prisma.midasRisk.createMany({
        data: batch,
        skipDuplicates: true,
      });
      totalInserted += result.count;
      console.log(`${counter} Inserted ${result.count} records; total: ${totalInserted}`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    const result = await prisma.midasRisk.createMany({
      data: batch,
      skipDuplicates: true,
    });
    totalInserted += result.count;
    console.log(`${counter} (final batches) Inserted ${result.count} records; total: ${totalInserted}`);
  }

  counter += 1;

  console.log(`Total records inserted: ${totalInserted}`);
}

main()
  .catch((error) => {
    console.error("Error uploading MidasRisk data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

