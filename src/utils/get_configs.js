import fs from "fs";
import path from "path";

export function getUserConfig() {
  const scDir = path.join(process.cwd(), ".sc");
  const configFilePath = path.join(scDir, "config");

  let config;
  try {
    const configData = fs.readFileSync(configFilePath, "utf-8");
    config = JSON.parse(configData);
  } catch (error) {
    console.error("Error reading or parsing config file:", error);
    return null;
  }

  if (config.user && config.user.name && config.user.email) {
    return {
      name: config.user.name,
      email: config.user.email,
    };
  } else {
    console.error("User name or email is not configured.");
    return null;
  }
}
