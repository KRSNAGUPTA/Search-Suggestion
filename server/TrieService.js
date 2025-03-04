import Word from "./WordModel.js";
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
    this.freq = 0;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, frequency = 1) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEnd = true;
    node.freq += frequency;
  }

  searchPrefix(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) return null;
      node = node.children[char];
    }
    return node;
  }

  getSuggestions(prefix) {
    const node = this.searchPrefix(prefix);
    if (!node) return [];

    const suggestions = [];
    const dfs = (currNode, currWord) => {
      if (currNode.isEnd) {
        suggestions.push({ word: currWord, freq: currNode.freq });
      }
      for (const char in currNode.children) {
        dfs(currNode.children[char], currWord + char);
      }
    };

    dfs(node, prefix);
    return suggestions.sort((a, b) => b.freq - a.freq).map((item) => item.word);
  }
}

class TrieService {
  constructor() {
    this.trie = new Trie();
  }

  async loadWordsFromDB(WordModel) {
    console.log("Loading words from database...");
    const words = await Word.find();
    words.forEach(({ word, freq }) => {
      this.trie.insert(word, freq);
    });
    console.log("Trie initialized with database words.");
  }

  async addWord(word, WordModel) {
    this.trie.insert(word);
    try {
      await WordModel.findOneAndUpdate(
        { word },
        { $inc: { freq: 1 } },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("Failed to insert word in DB:", err);
    }
  }

  getSuggestions(prefix) {
    return this.trie.getSuggestions(prefix);
  }
}

export default TrieService;
