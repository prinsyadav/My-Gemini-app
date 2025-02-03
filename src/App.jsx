import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "https://python-backend-dj73.onrender.com";

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      // Add these debug logs
      // console.log("Response status:", response.status);
      const rawText = await response.text();
      // Get raw response text
      // console.log("Raw response:", rawText);

      // Try parsing JSON
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${rawText}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          content: `Error: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Ask me anything</h1>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}-message`}>
            <div className="message-bubble">
              {message.type === "ai" ? (
                <div className="ai-content">
                  {message.content.split("\n").map((line, i) => {
                    // Handle markdown-style bold text
                    const formattedLine = line.replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>"
                    );
                    return (
                      <p
                        key={i}
                        dangerouslySetInnerHTML={{ __html: formattedLine }}
                        style={{ margin: line.trim() ? "0.5em 0" : "0.2em 0" }}
                      />
                    );
                  })}
                </div>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message">
            <div className="message-bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <form className="input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
