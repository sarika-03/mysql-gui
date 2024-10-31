const path = require("path");
const nodemon = require("nodemon");
const scriptPath = path.resolve(__dirname, "src/index.js");

nodemon({ script: scriptPath });
