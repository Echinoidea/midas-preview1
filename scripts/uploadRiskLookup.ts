// scripts/uploadRiskLookupStream.ts
import * as fs from "fs";
import { parse } from "csv-parse";
import prisma from "../lib/prisma";

async function main() {
  const filePath = "/home/gabriel/code/data/MIDAS Website/data/web_input_values_new.csv";
  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  );

  const batchSize = 3000;
  let batch: any[] = [];
  let totalInserted = 0;

  // Use a for-await-of loop to stream records from the parser
  for await (const record of parser) {
    // Inside your for-await-of loop in the streaming script:
    const gender = record["gender"].toUpperCase(); // e.g. "FEMALE"
    let ethnicity = record["ethnicity"].trim().toUpperCase();
    if (ethnicity === "OTHER POC" || ethnicity === "OTHERPOC" || ethnicity == "Other POC") {
      ethnicity = "OTHER_POC";
    }
    const ell = record["ell"].toLowerCase() === "yes";
    const schoolLevel = record["schoollevel"].toUpperCase(); // e.g. "ELEMENTARY"
    const mathRisk = record["math_f"].toUpperCase();
    const readingRisk = record["read_f"].toUpperCase();
    const mysaebrsEmo = record["mysaebrs_emo"].toUpperCase();
    const mysaebrsSoc = record["mysaebrs_soc"].toUpperCase();
    const mysaebrsAca = record["mysaebrs_aca"].toUpperCase();
    const saebrsEmo = record["saebrs_emo"].toUpperCase();
    const saebrsSoc = record["saebrs_soc"].toUpperCase();
    const saebrsAca = record["saebrs_aca"].toUpperCase();

    // For officeReferrals and suspensions, "Zero" means false and "One+" means true.
    const officeReferrals = record["odr_f"].toLowerCase() === "one+";
    const suspensions = record["susp_f"].toLowerCase() === "one+";

    // Convert the CSV-provided id to a number
    const id = Number(record["id"]);

    // Map to your RiskLookup object
    const dataRow = {
      id, // Optional: include if you need to preserve the CSV id.
      officeReferrals,
      suspensions,
      gender,
      ethnicity,
      ell,
      schoolLevel,
      mathRisk,
      readingRisk,
      mysaebrsEmo,
      mysaebrsSoc,
      mysaebrsAca,
      saebrsEmo,
      saebrsSoc,
      saebrsAca,
    };

    batch.push(dataRow);

    if (batch.length >= batchSize) {
      // Insert this batch using Prisma’s createMany
      const result = await prisma.riskLookup.createMany({
        data: batch,
        skipDuplicates: true, // if duplicates exist, skip them
      });
      totalInserted += result.count;
      console.log(`Inserted ${result.count} records`);
      batch = [];
    }
  }

  // Insert any remaining records in the final batch.
  if (batch.length > 0) {
    const result = await prisma.riskLookup.createMany({
      data: batch,
      skipDuplicates: true,
    });
    totalInserted += result.count;
    console.log(`Inserted ${result.count} records`);
  }

  console.log(`Total records inserted: ${totalInserted}`);
}

main()
  .catch((error) => {
    console.error("Error uploading RiskLookup data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
