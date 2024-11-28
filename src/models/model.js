const { ChatOpenAI } = require("@langchain/openai");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const getAIModel = (aiModel, apiKey) => {
  if (["gpt-4", "gpt-3.5-turbo", "text-davinci-003"].includes(aiModel)) {
    return new ChatOpenAI({
      openAIApiKey: apiKey,
      temperature: 0.7,
      modelName: aiModel,
    });
  }

  if (["gemini-1.5-flash", "gemini-pro", "gemini-lite"].includes(aiModel)) {
    return new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      temperature: 0.7,
      modelName: aiModel,
    });
  }

  throw new Error(`Unsupported AI model: ${aiModel}`);
};

module.exports = {
  getAIModel,
};
