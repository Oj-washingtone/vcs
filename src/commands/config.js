import fs from "fs";
import path from "path";

export default function sc_config(options) {
  if (!options.user && !options.email) {
    console.log(
      "Use '-u' for user name or '-e' for email to configure settings."
    );
    return;
  }

  const scDir = path.join(process.cwd(), ".sc");
  const configFilePath = path.join(scDir, "config");

  let config;
  try {
    const configData = fs.readFileSync(configFilePath, "utf-8");
    config = JSON.parse(configData);
  } catch (error) {
    console.error("Error reading or parsing config file:", error);
    return;
  }

  if (options.user) {
    config.user = config.user || {};
    config.user.name = options.user;
    console.log(`User name set to: ${options.user}`);
  }

  if (options.email) {
    config.user = config.user || {};
    config.user.email = options.email;
    console.log(`User email set to: ${options.email}`);
  }

  try {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf-8");
    console.log("Configuration updated successfully.");
  } catch (error) {
    console.error("Error writing to config file:", error);
  }
}
