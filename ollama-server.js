// Ollama Health Chat Server
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
    origin: '*', // Cho phép tất cả origins
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('.'));

// Health chat API endpoint
app.post('/api/health-chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Gọi Ollama API với prompt thông minh
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3.1:8b',
                prompt: `Bạn là một trợ lý AI thông minh và đa năng, chuyên về y tế nhưng cũng có thể tư vấn các lĩnh vực khác.

NGUYÊN TẮC CHUYÊN MÔN:
1. Nếu câu hỏi liên quan đến Y TẾ SỨC KHỎE: Trả lời chuyên sâu, chính xác, có trách nhiệm. Luôn ưu tiên an toàn và khuyên cấp cứu khi cần.
2. Nếu câu hỏi KHÔNG liên quan y tế: Vẫn trả lời thân thiện, thông minh, hữu ích. Có thể nói "Tôi không chuyên sâu về lĩnh vực này, nhưng tôi sẽ cố gắng giúp bạn."

PHONG CÁCH TRẢI LỜI:
- Luôn thân thiện, chuyên nghiệp
- Nếu không chắc, hãy nói rõ là không chuyên gia
- Với câu hỏi y tế: luôn có cảnh báo an toàn
- Với câu hỏi khác: vẫn cố gắng giúp đỡ nhất có thể

CÂU HỎI NGƯỜI:
${message}

Hãy trả lời một cách tự nhiên, thông minh và phù hợp với vai trò là một trợ lý AI đa năng.`,
                stream: false
            })
        });

        const data = await response.json();
        
        res.json({
            success: true,
            response: data.response
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to connect to AI model',
            details: error.message 
        });
    }
});

// Check Ollama status
app.get('/api/status', async (req, res) => {
    try {
        const response = await fetch('http://localhost:11434/api/tags');
        const data = await response.json();
        
        res.json({
            success: true,
            models: data.models,
            ollamaRunning: true
        });
    } catch (error) {
        res.json({
            success: false,
            ollamaRunning: false,
            error: 'Ollama is not running'
        });
    }
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server is working!',
        timestamp: new Date().toISOString()
    });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏥 Health Chat Server running at http://localhost:${PORT}`);
    console.log('🤖 Make sure Ollama is running on http://localhost:11434');
    console.log('🌐 Server accessible from: http://0.0.0.0:3001');
});
