"use client"; // Mark this component as client-side

import { useState, useEffect, useRef } from "react";
import { Button, Input } from "@headlessui/react"; // Using Headless UI's Button and Input
import { FaSun, FaMoon } from "react-icons/fa"; // Import sun and moon icons

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

export default function Home() {
  const [message, setMessage] = useState(""); // Store the user's message
  const [response, setResponse] = useState(""); // Store the API's response
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [history, setHistory] = useState([]); // Store chat history
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  const chatContainerRef = useRef(null); // Reference to chat container for auto-scrolling

  const genAI = new GoogleGenerativeAI("AIzaSyCgl5AGvF1d8tCBlXv__eODxOAXbzTqsnk");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Function to handle form submission and call the Gemini API directly
  const sendMessage = async () => {
    if (!message) return; // If message is empty, do nothing

    setIsLoading(true); // Set loading to true
    try {
      const result = await model.generateContent(message);
      setResponse(result.response.text());
      // Add user message and AI response to chat history
      setHistory((prevHistory) => [
        ...prevHistory,
        { type: "user", text: message },
        { type: "ai", text: result.response.text() },
      ]);
      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error in processing the request.");
    } finally {
      setIsLoading(false); // Reset loading state after the request completes
    }
  };

  // Handle Enter key press for message submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line from being added
      sendMessage(); // Send the message
    }
  };

  // Auto-scroll to the bottom when the chat history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className={`flex items-center justify-center h-screen font-sans ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-4xl rounded-xl shadow-2xl flex flex-col h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-all p-4 sm:p-6`}>
        
        {/* Dark Mode Toggle Button */}
        <div className="absolute top-4 right-4 sm:p-4">
          <Button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-yellow-400'} focus:outline-none transition-transform duration-300`}
          >
            {darkMode ? (
              <FaSun className="text-white" />
            ) : (
              <FaMoon className="text-gray-800" />
            )}
          </Button>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6"
        >
          <h1 className="text-3xl sm:text-5xl font-bold text-center mb-8 transition-transform">AI Agent</h1>

          <div className="space-y-6">
            {history.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} transition-all duration-500 transform ease-in-out`}
                style={{
                  animation: "slideUp 0.5s ease-out",
                }}
              >
                <div
                  className={`p-4 rounded-xl shadow-xl max-w-full sm:max-w-lg ${msg.type === "user" ? "bg-blue-600 text-white" : darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`}
                  style={{ wordWrap: "break-word" }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-t border-gray-300 p-4 sm:p-6">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Update message state
              onKeyDown={handleKeyDown} // Send message on Enter
              placeholder="Type a message..."
              className={`flex-1 p-4 rounded-xl border-2 ${darkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-lg transition-all`}
              style={{ minHeight: "60px" }}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading}
              className={`py-3 px-6 sm:py-4 sm:px-8 rounded-lg ${darkMode ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-blue-600 text-white hover:bg-blue-700'} font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400`}
            >
              {isLoading ? "Loading..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}