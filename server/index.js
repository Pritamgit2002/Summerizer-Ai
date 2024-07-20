const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function runPrompt(prompt, task) {
  const taskPrompts = {
    summarizeParagraph: `Summarize the following text: ${prompt}`,
    summarizeBulletPoints: `Summarize the following text into concise bullet points with Analyze the sentiment and Identify the main topics and Only extract the key words in brief also in bullet points: ${prompt}`,
    sentimentAnalysis: `Analyze the sentiment of the following text: ${prompt}`,
    topicIdentification: `Identify the main topics in the following text: ${prompt}`,
    keywordExtraction: `Only extract the key words from the following text: ${prompt}`,
  };

  const result = await model.generateContent(taskPrompts[task]);
  const response = await result.response;
  const text = await response.text();
  return text;
}

app.post("/api/summarize/paragraph", async (req, res) => {
  try {
    const { prompt } = req.body;
    const summary = await runPrompt(prompt, "summarizeParagraph");
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/summarize/bulletpoints", async (req, res) => {
  try {
    const { prompt } = req.body;
    const summary = await runPrompt(prompt, "summarizeBulletPoints");
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/sentiment", async (req, res) => {
  try {
    const { prompt } = req.body;
    const sentiment = await runPrompt(prompt, "sentimentAnalysis");
    res.json({ sentiment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/topics", async (req, res) => {
  try {
    const { prompt } = req.body;
    const topics = await runPrompt(prompt, "topicIdentification");
    res.json({ topics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/keywords", async (req, res) => {
  try {
    const { prompt } = req.body;
    const keywords = await runPrompt(prompt, "keywordExtraction");
    res.json({ keywords });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
