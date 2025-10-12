import './ChatBot.css';
import { useState, useRef, useEffect } from "react";
import { ChatbotForm } from "./ChatbotForm";
import { ChatBotIcon } from "./ChatBotIcon";
import { ChatMessage } from "./ChatMessage";
import { companyInfo } from "@/components/ChatBot/companyInfo";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const apiUrl = import.meta.env.VITE_GEMINI_API_URL + apiKey;


function ChatBot() {
    const [chatHistory, setChatHistory] = useState([
        { hideInChat: true, role: "model", text: companyInfo }
    ]);
    const [showChatBot, setShowChatBot] = useState(false);
    const chatBodyRef = useRef();

    const generateBotResponse = async (history) => {
        const updateHistory = (text, isError = false) => {
            setChatHistory((prev) => [...prev.filter(msg => msg.text !== "Thinking..."), { role: "model", text, isError }]);
        };

        // updateHistory("Thinking...", "model");
        history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: history })

        };
        try {
            const response = await fetch(apiUrl, requestOptions);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message || 'Something went wrong');

            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
            updateHistory(apiResponseText);
        } catch (error) {
            updateHistory(error.message, true);
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }, [chatHistory]);

    return (
        <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
            <button onClick={() => setShowChatBot((prev) => !prev)} id="chatbot-toggler">
                <span className="material-symbols-outlined">{showChatBot ? "close" : "mode_comment"}
                </span>
            </button>
            <div className="chatbot-popup" >
                {/* {Chatbot Header} */}
                <div className="chat-header " style={{ background: "#82A33D" }}>
                    <div className="header-info">
                        <ChatBotIcon />
                        <h2 className="logo-text pl-3">Chatbot </h2>
                    </div>
                    <button className="material-symbols-outlined" onClick={() => setShowChatBot((prev) => !prev)}>
                        keyboard_arrow_down
                    </button>
                </div>

                {/* {Chatbot Body} */}

                <div ref={chatBodyRef} className="chat-body">
                    <div className="message bot-message">
                        <ChatBotIcon />
                        <p className="message-text">Hello! How can I assist you today?</p>
                    </div>

                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                </div>
                {/* {Chatbot Footer} */}

                <div className="chat-footer">
                    <ChatbotForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
                </div>
            </div>
        </div>
    );
}

export default ChatBot; 