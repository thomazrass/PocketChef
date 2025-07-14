const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runCompletion(imagelinke) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "You are a chef. You know every recipe on earth. Give me 5 different dishes I can make with the ingredients in this picture. Do not give me the entire recipe. Just the name and the ingredient necessary for the recipe.",
          },
          {
            type: "image_url",
            image_url: {
              url: imagelinke,
            },
          },
        ],
      },
    ],
    max_tokens: 1000,
    stream: false,
  });

  return response;
}
module.exports = runCompletion;
