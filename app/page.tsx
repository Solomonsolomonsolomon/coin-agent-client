"use client";
import React, { useState } from "react";
import api from "./lib/api";
import { useWallet } from "@suiet/wallet-kit";
export default function Home() {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "llm" }[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
 const {address}=useWallet()
  const sampleQuestions = [
    "What is The price of SUI?",
    "How is the price of bitcoin?",
    "Top 10 pools by TVL?",
    "How can I stake tokens?",
  ];

 const handleSend = async (message?: string) => {
   const userMessage = message || inputValue.trim();

   
   if (userMessage) {
     setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
     setIsThinking(true);
     setInputValue("");

     try {

       let modifiedMessage = userMessage;
    
       const keywords = ["transaction", "transfer", "send", "funds", "wallet"];
       const containsKeywords = keywords.some((keyword) =>
         userMessage.toLowerCase().includes(keyword)
       );

       if (containsKeywords) {
         modifiedMessage = `${userMessage}. My wallet address is ${address}.`;
       }

      console.log(modifiedMessage,'modfiied')
       const response = await api.post("/query", { prompt: modifiedMessage });
       let res = response.data[0];
       let llmResponse = "";

       if (res.status === "success" && typeof res.response === "string") {
         llmResponse = res.response;
       }

       setMessages((prev) => [...prev, { text: llmResponse, sender: "llm" }]);
     } catch (error) {
       console.error("Error querying the LLM:", error);
       setMessages((prev) => [
         ...prev,
         {
           text: "Sorry, there was an error. Please try again.",
           sender: "llm",
         },
       ]);
     } finally {
       setIsThinking(false);
     }
   }
 };


  return (
    <div className="h-[90dvh] w-[90dvw] border flex justify-center relative items-center flex-col bg-gray-100">
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto p-4 w-[82dvw] rounded mt-3 bg-gray-100 relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: "url('/atomaLogo.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "300px 200px",
          }}
        ></div>

        {messages.map((message, index) => (
          <div
            key={index}
            className={`relative mb-3 p-3 rounded-md max-w-[40%] opacity-100 ${
              message.sender === "user"
                ? "bg-blue-500 text-white self-end ml-auto text-right"
                : "bg-gray-300 text-black self-start mr-auto text-left"
            }`}
          >
            {message.text}
          </div>
        ))}

        {/* Loading indicator for LLM thinking */}
        {isThinking && (
          <div className="relative mb-3 p-3 rounded-md max-w-[70%] bg-gray-300 text-black self-start mr-auto text-left">
            Please wait...
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="w-[90%] max-w-2xl">
        <div className="flex items-center mt-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Chat with CoinSage..."
            className="flex-grow border-gray-500 border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSend()}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>

        {/* Sample Questions */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {sampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSend(question)}
              className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
