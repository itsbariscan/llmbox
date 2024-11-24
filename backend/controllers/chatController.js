const anthropicService = require('../services/anthropicService');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

const chatController = {
  async sendMessage(req, res, next) {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        throw new AppError('Messages must be an array', 400);
      }

      const response = await anthropicService.sendMessage(messages);

      res.json({
        status: 'success',
        content: response
      });
    } catch (error) {
      next(error);
    }
  },

  async streamMessage(req, res, next) {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        throw new AppError('Messages must be an array', 400);
      }

      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Create message stream
      const stream = await anthropicService.createMessageStream(messages);

      // Handle stream events
      stream.on('data', (chunk) => {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      });

      stream.on('end', () => {
        res.write('data: [DONE]\n\n');
        res.end();
      });

      stream.on('error', (error) => {
        logger.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      });

      // Handle client disconnect
      req.on('close', () => {
        stream.destroy();
      });
    } catch (error) {
      next(error);
    }
  },

  async generateTitle(req, res, next) {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new AppError('Messages array is required and cannot be empty', 400);
      }

      const prompt = `Based on this conversation, please generate a short, descriptive title (maximum 6 words).
                     Here's the conversation:\n\n${messages.map(m => 
                       `${m.role}: ${m.content}`).join('\n')}`;

      const title = await anthropicService.sendMessage([{
        role: 'user',
        content: prompt
      }]);

      res.json({
        status: 'success',
        title: title.trim()
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = chatController;