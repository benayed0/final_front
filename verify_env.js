const fs = require("fs");
const path = require("path");

// Paths to the environment files
const envFilePath = path.resolve(
  __dirname,
  "src/app/environments/environment.ts"
);
const prodEnvFilePath = path.resolve(
  __dirname,
  "src/app/environments/environment.prod.ts"
);

// Function to extract keys from the environment files
function extractKeys(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const match = content.match(/export const environment\s*=\s*{([^}]+)}/);
  if (!match) {
    throw new Error(`Failed to extract environment keys from ${filePath}`);
  }
  const envObjectString = `{${match[1]}}`;
  const envObject = eval(`(${envObjectString})`);
  return Object.keys(envObject);
}

// Compare keys
function compareKeys(keys1, keys2) {
  const missingInProd = keys1.filter((key) => !keys2.includes(key));
  const missingInDev = keys2.filter((key) => !keys1.includes(key));

  return { missingInProd, missingInDev };
}

try {
  const devKeys = extractKeys(envFilePath);
  const prodKeys = extractKeys(prodEnvFilePath);
  const { missingInProd, missingInDev } = compareKeys(devKeys, prodKeys);

  if (missingInProd.length > 0 || missingInDev.length > 0) {
    console.error("\x1b[31m", "Environment key mismatch detected:");
    if (missingInProd.length > 0) {
      console.error(
        "\x1b[31m",
        `Keys missing in production environment: ${missingInProd.join(", ")}`
      );
      process.exit(1);
    }
    if (missingInDev.length > 0) {
      console.error(
        "\x1b[31m",
        `Keys missing in development environment: ${missingInDev.join(", ")}`
      );
    }
    process.exit(1);
  } else {
    console.log("\x1b[32m", "Environment variables are OK.");
  }
} catch (error) {
  console.error(
    "\x1b[31m",
    `Error verifying environment keys: ${error.message}`
  );
  process.exit(1);
}
