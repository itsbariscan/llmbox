require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();

// Basic middleware with increased limits
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB in bytes
    files: 10 // Maximum number of files
  }
});

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Default model if none specified
const DEFAULT_MODEL = 'claude-3-opus-20240229';

// Ensure uploads directory exists
(async () => {
  try {
    await fs.access('uploads');
  } catch {
    await fs.mkdir('uploads');
  }
})();

// Regular chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model, temperature } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages must be an array' });
    }

    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const response = await anthropic.messages.create({
      model: model || DEFAULT_MODEL,
      max_tokens: 4096,
      messages: formattedMessages,
      temperature: parseFloat(temperature) || 0.7
    });

    return res.json({
      content: response.content[0].text,
      model: model || DEFAULT_MODEL
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
});

// File upload endpoint with message
app.post('/api/chat/upload', upload.array('files', 10), async (req, res) => {
  try {
    const files = req.files;
    const message = req.body.message || '';
    const model = req.body.model || DEFAULT_MODEL;
    const temperature = parseFloat(req.body.temperature) || 0.7;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    let allContents = [];
    
    // Process each file
    for (const file of files) {
      if (file.mimetype.startsWith('image/')) {
        const fileBuffer = await fs.readFile(file.path);
        const base64Image = fileBuffer.toString('base64');
        
        allContents.push({
          type: "image",
          source: {
            type: "base64",
            media_type: file.mimetype,
            data: base64Image
          }
        });
      } else {
        const fileContent = await fs.readFile(file.path, 'utf8');
        allContents.push({
          type: "text",
          text: `Content of file ${file.originalname}:\n\n${fileContent}`
        });
      }
      
      // Clean up the file
      await fs.unlink(file.path);
    }

    // Add the message as the final content
    if (message) {
      allContents.push({
        type: "text",
        text: message
      });
    }

    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: allContents
      }],
      temperature: temperature
    });

    return res.json({
      content: response.content[0].text,
      model: model
    });

  } catch (error) {
    console.error('File upload error:', error);
    // Clean up any remaining files
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
    }
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Default Model:', DEFAULT_MODEL);
  console.log('API Key status:', process.env.ANTHROPIC_API_KEY ? 'Configured ✓' : 'Missing ✗');
});