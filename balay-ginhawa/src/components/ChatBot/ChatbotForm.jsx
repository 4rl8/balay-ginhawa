
import { useRef } from "react";

export const ChatbotForm = ({chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";
        console.log("User Message:", userMessage);
        //update user message to chat history
        setChatHistory(history => [...history, { role: 'user', text: userMessage }]);
        setTimeout(() => {
            setChatHistory(history => [...history, { role: 'model', text: "Thinking..." }]);
            generateBotResponse([...chatHistory, { role: 'user', text:`Using the details provided above, please address this query: ${userMessage}` }]);
        }, 600);

    };

    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input type="text" className="message-input" placeholder="Type a message..." required ref={inputRef} />
            <button className="material-symbols-outlined">
                arrow_upward
            </button>
        </form>
    );

}
