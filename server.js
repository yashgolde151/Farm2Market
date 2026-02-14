const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('.'));

// In-memory storage (in production, use a database)
let users = [];
let documents = [];

// Load existing data if available
const loadData = () => {
    try {
        if (fs.existsSync('data/users.json')) {
            users = JSON.parse(fs.readFileSync('data/users.json', 'utf8'));
        }
        if (fs.existsSync('data/documents.json')) {
            documents = JSON.parse(fs.readFileSync('data/documents.json', 'utf8'));
        }
    } catch (error) {
        console.log('No existing data found, starting fresh');
    }
};

// Save data to files
const saveData = () => {
    if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
    }
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));
    fs.writeFileSync('data/documents.json', JSON.stringify(documents, null, 2));
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const user = {
        id: Date.now(),
        ...req.body,
        registrationDate: new Date().toISOString()
    };
    users.push(user);
    saveData();
    res.json(user);
});

app.get('/api/documents', (req, res) => {
    res.json(documents);
});

app.post('/api/documents', (req, res) => {
    const document = {
        id: Date.now(),
        ...req.body,
        uploadDate: new Date().toISOString(),
        status: 'pending'
    };
    documents.push(document);
    saveData();
    res.json(document);
});

app.put('/api/documents/:id', (req, res) => {
    const docId = parseInt(req.params.id);
    const docIndex = documents.findIndex(doc => doc.id === docId);

    if (docIndex !== -1) {
        documents[docIndex] = { ...documents[docIndex], ...req.body };
        saveData();
        res.json(documents[docIndex]);
    } else {
        res.status(404).json({ error: 'Document not found' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    users = users.filter(user => user.id !== userId);
    saveData();
    res.json({ success: true });
});

// Serve main website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// --- Chatbot Backend Proxy (Groq API) ---
const GROQ_API_KEY = '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-xehFqtk'; // Groq API Key

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    if (!GROQ_API_KEY) {
        return res.status(500).json({ error: "Server API Key not configured" });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                messages: messages,
                model: "llama3-8b-8192", // Using Llama 3 8B model
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Groq API Error:", JSON.stringify(data.error, null, 2));
            return res.status(500).json({ error: data.error.message || "Groq API Error" });
        }

        // Groq/OpenAI format is consistent
        const botResponse = data.choices?.[0]?.message?.content || "No response generated.";

        res.json({
            choices: [{
                message: {
                    content: botResponse
                }
            }]
        });

    } catch (error) {
        console.error("Error calling Groq API:", error);
        res.status(500).json({ error: "Failed to communicate with AI provider" });
    }
});
// -----------------------------

// Load data on startup
loadData();

app.listen(PORT, () => {
    console.log(`🚀 Farm2Market Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`🌾 Main Website: http://localhost:${PORT}`);
});