#!/usr/bin/env node
const path = require("path");
const nodemon = require("nodemon");
const argv = require("minimist")(process.argv.slice(2));

if (!argv.u) {
  console.error("Error: Please provide a MySQL URL with -u option.");
  process.exit(1);
}

process.env.MYSQL_URL = argv.u;
process.env.PORT = argv.p || 5000;

const scriptPath = path.resolve(__dirname, "src/index.js");

nodemon({ script: scriptPath });
