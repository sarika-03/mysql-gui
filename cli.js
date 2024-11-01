#!/usr/bin/env node
const path = require("path");
const nodemon = require("nodemon");
const readline = require("readline");
const argv = require("minimist")(process.argv.slice(2));

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
  if (!argv.u) {
    const mysqlUrl = await askForMysqlUrl();
    process.env.MYSQL_URL = mysqlUrl;
  } else {
    process.env.MYSQL_URL = argv.u;
  }

  const port = await askForPort();
  process.env.PORT = port;

  const scriptPath = path.resolve(__dirname, "src/index.js");
  nodemon({ script: scriptPath });

  rl.close();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
