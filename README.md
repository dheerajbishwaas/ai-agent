# School Support AI Agent 🏫🤖

An intelligent customer support agent built with Node.js and LangChain to handle school-related queries from parents. This agent can verify student details, check fee status, and log unanswered questions for administrative review.

## 🚀 Overview

This project is designed to bridge the communication gap between schools and parents. It uses advanced AI models (Gemini/Groq) to provide human-like responses and integrates with a mock database to provide real-time student information.

## ✨ Key Features

- **Student Detail Verification:** Automatically checks parent name and phone number against the database to fetch student records (class, attendance, fee status).
- **Intelligent Query Handling:** Answers general questions about school timings, holidays, and policies using LangChain.
- **Unanswered Query Logging:** If the AI is unsure about a specific query, it logs the question to `unanswered_queries.json` so that school staff can respond later.
- **Multi-Model Support:** Configurable to use either Google Gemini or Groq (for faster inference and avoiding rate limits).
- **Express Backend:** A robust server to handle API requests and serve the chat interface.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **AI Framework:** LangChain, LangGraph
- **Models:** Google Gemini Pro / Groq (Llama-3)
- **Database:** JSON-based Mock Database (db.js)
- **Validation:** Zod (for structured data and tool inputs)

## 📁 Project Structure

- `server.js`: The main entry point for the Express server.
- `agent.js`: Contains the LangChain logic and AI agent configuration.
- `db.js`: Mock database and helper functions for data retrieval and logging.
- `unanswered_queries.json`: Store for queries the agent couldn't resolve.
- `public/`: Contains frontend assets for the chat UI.
- `.env`: Environment variables for API keys.

## ⚙️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ai-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   GOOGLE_GENAI_API_KEY=your_gemini_key_here
   GROQ_API_KEY=your_groq_key_here
   PORT=3000
   ```

4. **Run the application:**
   ```bash
   node server.js
   ```

## 📝 How it Works

1. **Input:** The parent sends a message (e.g., "Mera bacha Aarav ki attendance kya hai?").
2. **Analysis:** The AI agent analyzes the intent and determines if it needs to fetch data from the database.
3. **Tool Calling:** If needed, it calls the `fetchStudentDetails` tool with parent name and phone number.
4. **Response:** It generates a natural language response based on the database result.
5. **Fallback:** If the query is complex or data is missing, it uses the `logUnansweredQuery` tool to save the request for human intervention.

## 🛡️ Limitations

- Currently uses a mock database (`db.js`). Integration with a real SQL/NoSQL database is recommended for production.
- Response accuracy depends on the underlying LLM's performance.

---
Built with ❤️ for **TutoHub**
