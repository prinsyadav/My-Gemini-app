// import { useState } from "react";
// import "./App.css";

// function App() {
//   const [query, setQuery] = useState("");
//   const [result, setResult] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSearch = async () => {
//     // Clear previous states
//     setError("");
//     setResult("");

//     if (!query.trim()) {
//       setError("Please enter a query.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch("http://127.0.0.1:5000/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: query }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "An error occurred");
//       }

//       const data = await response.json();
//       setResult(data.response);
//     } catch (error) {
//       console.error("Error:", error);
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <h1>Python tutor</h1>

//       <div className="search-container">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Enter your query..."
//           className="search-box"
//         />

//         <button
//           onClick={handleSearch}
//           disabled={isLoading}
//           className="search-button"
//         >
//           {isLoading ? "Searching..." : "Search"}
//         </button>

//         {error && <div className="error-message">{error}</div>}
//       </div>

//       {result && (
//         <div className="result">
//           {/* Split response by newlines and render with formatting */}
//           {result.split("\n").map((line, index) => {
//             // Handle markdown-style bold text
//             const boldText = line.replace(
//               /\*\*(.*?)\*\*/g,
//               "<strong>$1</strong>"
//             );

//             return (
//               <p
//                 key={index}
//                 dangerouslySetInnerHTML={{ __html: boldText }}
//                 style={{ margin: line.trim() ? "0.5em 0" : "0.2em 0" }}
//               />
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// App.jsx
import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: userMessage,
      },
    ]);

    setIsLoading(true);

    // add render backend
    const API_URL =
      process.env.REACT_APP_API_URL ||
      "https://python-backend-dj73.onrender.com";

    try {
      const response = await fetch("${API_URL}/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      // Add AI response
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
          content: "Failed to get response. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat with Gemini</h1>
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
