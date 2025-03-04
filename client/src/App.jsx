import React, { useState, useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import api from "../api";

const SearchSuggestionApp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState("google");
  const [hoveredSuggestion, setHoveredSuggestion] = useState(null);

  const searchEngine = {
    google: "https://www.google.com/search?q=",
    bing: "https://www.bing.com/search?q=",
    brave: "https://search.brave.com/search?q=",
    mozilla: "https://search.brave.com/search?p=",
  };

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  const getSuggestion = async (term) => {
    if (term.length < 1) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.get(`/suggest?p=${term.toLowerCase()}`);
      await api.post("/insert", {
        word: term,
      });

      setSuggestions(res.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedGetSuggestion = debounce(getSuggestion, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedGetSuggestion(value);
  };

  const handleSuggestionClick = (suggestion) => {
    window.location.href = `${searchEngine[selectedEngine]}${suggestion}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gray-600 text-white p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Search Suggestions</h1>
            <p className="text-blue-100 text-sm">
              Find what you're looking for
            </p>
          </div>
          <Search className="w-8 h-8 text-white" />
        </div>

        <div className="p-4">
          <div className="flex space-x-4 mb-4">
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="font-bold w-1/4 p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              {Object.keys(searchEngine).map((engine) => (
                <option key={engine} value={engine}>
                  {engine.charAt(0).toUpperCase() + engine.slice(1)}
                </option>
              ))}
            </select>

            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Enter your search term..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 pl-10 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {isLoading && (
            <div className="text-center text-gray-500 animate-pulse">
              Loading suggestions...
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="min-w-xl border border-gray-200 rounded-lg overflow-hidden shadow-sm max-h-64 overflow-y-auto z-20">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setHoveredSuggestion(index)}
                  onMouseLeave={() => setHoveredSuggestion(null)}
                  className={`
                    flex items-center justify-between p-4 cursor-pointer 
                    transition-all duration-200 ease-in-out
                    ${
                      hoveredSuggestion === index
                        ? "bg-blue-50 text-blue-700"
                        : "bg-white text-gray-700"
                    }
                    hover:bg-blue-50 hover:text-blue-700
                  `}
                >
                  <span className="flex-grow truncate">{suggestion}</span>
                  <ArrowRight
                    className={`
                      w-5 h-5 ml-2 mr-6 transition-transform duration-200
                      ${
                        hoveredSuggestion === index
                          ? "translate-x-1 text-blue-700"
                          : "text-gray-400"
                      }
                    `}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestionApp;
