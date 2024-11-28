#!/usr/bin/env node
const path = require("path");
const nodemon = require("nodemon");
const readline = require("readline");
const argv = require("minimist")(process.argv.slice(2));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Default configurations
const defaultMysqlUrl = "mysql://root:root@localhost:3306";
const defaultPort = 5000;

// Supported models
const supportedModels = {
  openai: ["gpt-4", "gpt-3.5-turbo", "text-davinci-003"],
  gemini: ["gemini-1.5-flash", "gemini-pro", "gemini-lite"],
};

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

function askForAIUsage() {
  return new Promise((resolve) => {
    rl.question("Do you want to use AI? (yes/no): ", (answer) => {
      resolve(answer.toLowerCase() === "yes");
    });
  });
}

function askForAIModel() {
  return new Promise((resolve) => {
    console.log("Choose the AI model you'd like to use:");
    let counter = 1;
    const modelMap = {};

    console.log("\nOpenAI Models:");
    supportedModels.openai.forEach((model) => {
      console.log(`${counter}. ${model}`);
      modelMap[counter] = { provider: "OpenAI", model };
      counter++;
    });

    console.log("\nGoogle Gemini Models:");
    supportedModels.gemini.forEach((model) => {
      console.log(`${counter}. ${model}`);
      modelMap[counter] = { provider: "Gemini", model };
      counter++;
    });

    rl.question("Enter your choice: ", (choice) => {
      const selectedModel = modelMap[choice];
      if (selectedModel) {
        resolve(selectedModel);
      } else {
        console.log("Invalid choice. Defaulting to OpenAI GPT-4.");
        resolve({ provider: "OpenAI", model: "gpt-4" });
      }
    });
  });
}

function askForAPIKey(provider) {
  return new Promise((resolve) => {
    if (provider === "OpenAI") {
      rl.question("Please enter your OpenAI API Key: ", (apiKey) => {
        resolve(apiKey);
      });
    } else if (provider === "Gemini") {
      rl.question("Please enter your Gemini API Key: ", (apiKey) => {
        resolve(apiKey);
      });
    } else {
      resolve("");
    }
  });
}

async function main() {
  console.log(
    "TIP: You can leverage AI for free by obtaining a Gemini API Key online, which allows up to 15 requests per minute at no cost."
  );

  if (!argv.u) {
    const mysqlUrl = await askForMysqlUrl();
    process.env.MYSQL_URL = mysqlUrl;
  } else {
    process.env.MYSQL_URL = argv.u;
  }

  const port = argv.p || (await askForPort());
  process.env.PORT = port;

  if (argv.model && argv.apikey) {
    process.env.AI_MODEL = argv.model;
    process.env.AI_API_KEY = argv.apikey;

    const isOpenAI = supportedModels.openai.includes(argv.model);
    const isGemini = supportedModels.gemini.includes(argv.model);

    if (isOpenAI) {
      process.env.AI_PROVIDER = "OpenAI";
      console.log(`Using OpenAI model: ${argv.model}`);
    } else if (isGemini) {
      process.env.AI_PROVIDER = "Gemini";
      console.log(`Using Google Gemini model: ${argv.model}`);
    } else {
      console.error("Invalid AI model specified. Exiting...");
      process.exit(1);
    }
  } else {
    const useAI = await askForAIUsage();

    if (useAI) {
      const selectedModel = await askForAIModel();
      process.env.AI_PROVIDER = selectedModel.provider;
      process.env.AI_MODEL = selectedModel.model;

      const apiKey = await askForAPIKey(selectedModel.provider);
      process.env.AI_API_KEY = apiKey;

      console.log(
        `\nSelected AI Model: ${selectedModel.model} (${selectedModel.provider})`
      );
      console.log(`API Key: ${apiKey ? "Provided" : "Not Provided"}`);
    } else {
      console.log("AI will not be used in this setup.");
      process.env.AI_PROVIDER = null;
      process.env.AI_MODEL = null;
      process.env.AI_API_KEY = null;
    }
  }

  const scriptPath = path.resolve(__dirname, "src/index.js");
  nodemon({ script: scriptPath });

  rl.close();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
