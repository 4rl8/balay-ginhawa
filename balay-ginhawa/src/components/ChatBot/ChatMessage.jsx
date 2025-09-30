import { ChatBotIcon } from "./ChatBotIcon";

export function ChatMessage({ chat }) {

    return (
        !chat.hideInChat && (
        <div className={`message ${chat.role === "model" ? "bot" : "user"}-message ${chat.isError ? "error" : ""}`}>
            {chat.role === "model" && <ChatBotIcon />}
            <p className="message-text">{chat.text}</p>
        </div>)
    );
}