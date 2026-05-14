const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
// Serve static files from 'public' directory
app.use(express.static('public'));

const { chatWithAgent } = require('./agent');

// In-memory store for chat history (For a real project, use a database or Redis)
// Key: session ID or user IP, Value: Array of message objects
const chatMemory = {};

app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const sid = sessionId || 'default-session';
        if (!chatMemory[sid]) {
            chatMemory[sid] = [];
        }

        // Get AI response
        const aiResponse = await chatWithAgent(message, chatMemory[sid]);

        // Save to memory
        chatMemory[sid].push({ role: "user", content: message });
        chatMemory[sid].push({ role: "assistant", content: aiResponse });

        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// We will add our LangChain API route here later

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
