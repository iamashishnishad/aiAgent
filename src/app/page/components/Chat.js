"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Input } from "@headlessui/react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Home() {
  const [formData, setFormData] = useState({
    user_id: "",
    transaction_amount: "",
    num_transactions: "",
    previous_frauds: "",
  });
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const chatContainerRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const detectFraud = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/fraud-detection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      setResponse({ error: "Error in processing the request." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center h-screen font-sans ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-4xl rounded-xl shadow-2xl flex flex-col h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-all p-4 sm:p-6`}>
        <div className="absolute top-4 right-4 sm:p-4">
          <Button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-yellow-400'} focus:outline-none transition-transform duration-300`}
          >
            {darkMode ? <FaSun className="text-white" /> : <FaMoon className="text-gray-800" />}
          </Button>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-8">Fraud Detection</h1>
        <div className="space-y-4">
          {Object.keys(formData).map((key) => (
            <Input
              key={key}
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={key.replace("_", " ").toUpperCase()}
              className={`w-full p-3 rounded-md border ${darkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          ))}
          <Button
            onClick={detectFraud}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg ${darkMode ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-blue-600 text-white hover:bg-blue-700'} font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400`}
          >
            {isLoading ? "Detecting..." : "Detect Fraud"}
          </Button>
        </div>

        {response && (
          <div className="mt-6 p-4 rounded-lg shadow-lg bg-gray-200 text-gray-800">
            <h2 className="text-xl font-bold">Response:</h2>
            <p>Fraud: {response.is_fraud ? "Yes" : "No"}</p>
            <p>Fraud Score: {response.fraud_detection_score}</p>
          </div>
        )}
      </div>
    </div>
  );
}
