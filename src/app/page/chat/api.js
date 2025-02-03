import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY; // Use your API key from the environment
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { message } = req.body; // Get the message sent from the frontend

      // Start a new chat session
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      // Send the received message to the Gemini model
      const result = await chatSession.sendMessage(message);

      // Send the response text back to the frontend
      res.status(200).json({ text: result.response.text() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong with the Gemini API." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}