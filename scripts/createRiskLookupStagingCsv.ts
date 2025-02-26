import * as fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { parse } from "csv-parse";
import { transform } from "stream-transform";
import { stringify } from "csv-stringify";

const pipelineAsync = promisify(pipeline);

function mapRiskLevel(riskLevel: string): string {
  switch (riskLevel.trim().toLowerCase()) {
    case "marked":
      return "high";
    case "moderate":
    case "moderated":
      return "some";
    case "very low to mild":
      return "low";
    default:
      throw new Error(`Unexpected risk level: ${riskLevel}`);
  }
}

function mapConfidence(confidence: string): string {
  switch (confidence.trim().toLowerCase()) {
    case "high":
      return "high";
    case "moderate":
      return "some";
    case "low":
      return "low";
    default:
      throw new Error(`Unexpected confidence level: ${confidence}`);
  }
}

let currentRiskLookupId: number | null = null;
let seenFactors = new Set<string>();

function transformRecord(record: any): any | null {
  const risk_lookup_id = Number(record["id"]);
  const factor = record["factor"].trim();
  if (!["Midas", "Student", "Teacher"].includes(factor)) {
    throw new Error(`Unexpected factor: ${factor}`);
  }

  const key = `${risk_lookup_id}-${factor}`;

  if (currentRiskLookupId !== risk_lookup_id) {
    currentRiskLookupId = risk_lookup_id;
    seenFactors.clear();
  }

  if (seenFactors.has(factor)) {
    return null;
  }
  seenFactors.add(factor);

  return {
    risk_lookup_id,
    factor,
    value: parseFloat(record["value"]),
    lower: parseFloat(record[".lower"]),
    upper: parseFloat(record[".upper"]),
    hasrisk: record["hasrisk"].trim().toLowerCase() === "yes" ? "true" : "false",
    risklevel: mapRiskLevel(record["risklevel"]),
    confidence: mapConfidence(record["confidence"]),
  };
}

async function main() {
  const inputFilePath = "/home/gabriel/code/data/MIDAS Website/results/midasrisk_lookup.csv";
  const outputFilePath = "/home/gabriel/code/data/MIDAS Website/results/midasrisk_lookup_staging.csv";

  const readStream = fs.createReadStream(inputFilePath);
  const writeStream = fs.createWriteStream(outputFilePath);

  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const transformer = transform((record: any, callback) => {
    try {
      const transformed = transformRecord(record);
      if (transformed === null) {
        return callback();
      }
      callback(null, transformed);
    } catch (err) {
      callback(err instanceof Error ? err : new Error(String(err)));
    }
  });

  const stringifier = stringify({
    header: true,
    columns: [
      "risk_lookup_id",
      "factor",
      "value",
      "lower",
      "upper",
      "hasrisk",
      "risklevel",
      "confidence",
    ],
  });

  await pipelineAsync(
    readStream,
    parser,
    transformer,
    stringifier,
    writeStream
  );

  console.log("Staging CSV created at", outputFilePath);
}

main().catch(err => {
  console.error("Error creating staging CSV:", err);
});
