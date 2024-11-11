#!/usr/bin/env node
const path = require("path");
const nodemon = require("nodemon");
const readline = require("readline");
const { execSync } = require("child_process");
const argv = require("minimist")(process.argv.slice(2));

const MIN_NODE_VERSION = 16;
const MIN_NPM_VERSION = 8;
const [majorVersion] = process.versions.node.split(".").map(Number);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const defaultMysqlUrl = "mysql://root:root@localhost:3306";
const defaultPort = 5000;

function askForMysqlUrl() {
  return new Promise((resolve) => {
    rl.question(
      `Would you like to use the default MySQL URL (${defaultMysqlUrl})? (yes/no) `,
      (answer) => {
        if (answer.toLowerCase() === "yes") {
          resolve(defaultMysqlUrl);
        } else {
          rl.question("Please enter your MySQL URL: ", (customUrl) => {
            resolve(customUrl);
          });
        }
      }
    );
  });
}
function askForPort() {
  return new Promise((resolve) => {
    rl.question(
      `Please enter the PORT (default is ${defaultPort}): `,
      (portAnswer) => {
        if (portAnswer.trim() === "") {
          resolve(defaultPort);
        } else {
          const portNumber = parseInt(portAnswer, 10);
          resolve(isNaN(portNumber) ? defaultPort : portNumber);
        }
      }
    );
  });
}

async function main() {
  if (majorVersion < MIN_NODE_VERSION) {
    console.error(`Node.js version ${MIN_NODE_VERSION} or higher is required.`);
    process.exit(1);
  }
  try {
    const npmVersion = execSync("npm --version").toString().trim();
    const [npmMajorVersion] = npmVersion.split(".").map(Number);
    if (npmMajorVersion < MIN_NPM_VERSION) {
      console.error(`npm version ${MIN_NPM_VERSION} or higher is required.`);
      process.exit(1);
    }
  } catch (error) {
    console.error(
      "Failed to check npm version. Ensure npm is installed and accessible."
    );
    process.exit(1);
  }

  if (!argv.u) {
    const mysqlUrl = await askForMysqlUrl();
    process.env.URL = mysqlUrl;
  } else {
    process.env.URL = argv.u;
  }

  if (!argv.p) {
    const port = await askForPort();
    process.env.PORT = port;
  } else {
    process.env.PORT = argv.p;
  }

  const scriptPath = path.resolve(__dirname, "src/index.js");
  nodemon({ script: scriptPath });

  rl.close();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
