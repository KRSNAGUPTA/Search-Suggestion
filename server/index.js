import express from "express";
import ConnectDB from "./ConnectDB.js";
import TrieService from "./TrieService.js";
import dotenv from "dotenv";
import cors from "cors";
import Word from "./WordModel.js";
dotenv.config();
const trieService = new TrieService();
trieService.loadWordsFromDB(Word)
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
ConnectDB();

app.get("/", (req, res) => {
  return res.status(200).json("API is working");
});
app.post("/insert", async (req, res) => {
  console.log("Adding word....")
  const { word } = req.body;
  console.log("Got body:", req.body);

  if (!word) {
    return res.status(400).json({ message: "Word not provided" });
  }

  try {
    trieService.addWord(word, Word);
    console.log( `Word ${word} added`)
    return res.status(200).json({ message: `Added ${word}` });
  } catch (error) {
    console.error("Failed to insert word:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/suggest", (req, res) => {
  const { p } = req.query;
  console.log(`\nGot query: ${p}`)
  if (!p) {
    return res.status(400).json({
      message: "Prefix not provided",
    });
  }
  const suggestion = trieService.getSuggestions(p);

  res.status(200).json(suggestion);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
