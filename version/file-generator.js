const { resolve, dirname } = require("path");
const { writeFileSync, existsSync, readFileSync, mkdirSync } = require("fs");
const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// Helper functions
const getFormattedDate = (date = new Date()) =>
  `${padZero(date.getDate())} ${
    month[date.getMonth()]
  }, ${date.getFullYear()} - ${padZero(date.getHours())}:${padZero(
    date.getMinutes()
  )}`;

// Zero-padding function
const padZero = (num, size = 2) => num.toString().padStart(size, "0");

// Parse command-line arguments
const args = process.argv.slice(2);
const mode = args.includes("--mode") ? args[args.indexOf("--mode") + 1] : "dev";

// Set file paths
const file = resolve(__dirname, "../info.json");
const dir = dirname(file);

let buildVersion = 0;
let infoFileData = {};

// Read existing build version
if (existsSync(file)) {
  try {
    infoFileData = JSON.parse(readFileSync(file, "utf8")) ?? {};
    const currentVersionData = infoFileData?.[mode] ?? {};
    buildVersion = Number(currentVersionData?.version) || 0;
  } catch {
    console.warn(`Warning: Invalid JSON in ${file}. Resetting version.`);
  }
}

// Generate version object
const versionObject = {
  ...infoFileData,
  [mode]: {
    version: padZero(++buildVersion, 3),
    date: getFormattedDate(new Date()),
  },
};

// Ensure directory exists
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

// Write version to file
try {
  writeFileSync(file, JSON.stringify(versionObject, null, 2)); // Pretty print JSON
  console.info("Version file updated:", versionObject);
} catch (error) {
  console.error("Error handling version file:", error);
  process.exit(1);
}
