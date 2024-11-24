const { Anthropic } = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
require('dotenv').config();

class AnthropicService {
  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      logger.error('ANTHROPIC_API_KEY is missing from environment variables');
      throw new Error(
        'ANTHROPIC_API_KEY is required. Please add it to your .env file:\n' +
        'ANTHROPIC_API_KEY=your_api_key_here'
      );
    }
    
    this.client = new Anthropic({
      apiKey: apiKey,
    });

    this.defaultModel = "claude-3-opus-20240229";
  }

  async sendMessage(messages, options = {}) {
    try {
      const response = await this.client.messages.create({
        model: options.model || this.defaultModel,
        max_tokens: options.maxTokens || 4096,
        messages: messages,
        temperature: options.temperature || 0.7
      });

      return response.content[0].text;
    } catch (error) {
      logger.error('Anthropic API error:', error);
      throw new AppError('Failed to get AI response: ' + error.message, 500);
    }
  }

  async analyzeCode(code, language, action) {
    const prompts = {
      review: `Please review this ${language} code and provide detailed feedback about:
              - Potential bugs or issues
              - Security concerns
              - Performance improvements
              - Best practices
              - Code style
              Here's the code:\n\n${code}`,

      explain: `Please explain this ${language} code in detail:
               - Overall purpose
               - How it works
               - Each major component
               - Any important patterns or techniques used
               Here's the code:\n\n${code}`,

      optimize: `Please optimize this ${language} code:
                - Suggest performance improvements
                - Reduce complexity
                - Improve readability
                - Show the optimized version
                Here's the code:\n\n${code}`,

      document: `Please add comprehensive documentation to this ${language} code:
                - Add clear comments
                - Write function/class documentation
                - Explain complex logic
                - Add usage examples
                Here's the code:\n\n${code}`,

      test: `Please create comprehensive test cases for this ${language} code:
             - Unit tests
             - Integration tests
             - Edge cases
             - Test setup and teardown
             Here's the code:\n\n${code}`
    };

    const prompt = prompts[action] || prompts.review;
    
    return this.sendMessage([{
      role: "user",
      content: prompt
    }]);
  }

  async analyzeImage(imageBase64, analysisType) {
    const prompts = {
      general: "Please provide a detailed description and analysis of this image.",
      text: "Please extract and organize all text visible in this image.",
      objects: "Please identify and describe all objects and their relationships in this image.",
      faces: "Please analyze any faces in this image, describing expressions and characteristics.",
      colors: "Please analyze the color scheme and palette used in this image.",
      composition: "Please analyze the composition and visual structure of this image.",
      technical: "Please provide a technical analysis of this image including quality, format, and metadata."
    };

    try {
      const response = await this.client.messages.create({
        model: this.defaultModel,
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imageBase64
              }
            },
            {
              type: "text",
              text: prompts[analysisType] || prompts.general
            }
          ]
        }]
      });

      return response.content[0].text;
    } catch (error) {
      logger.error('Image analysis error:', error);
      throw new AppError('Failed to analyze image: ' + error.message, 500);
    }
  }

  async analyzeData(data, analysisType, format) {
    const prompts = {
      summary: `Please provide a statistical summary of this ${format} data:\n\n${data}`,
      patterns: `Please identify and describe any patterns or trends in this ${format} data:\n\n${data}`,
      visualization: `Please suggest appropriate visualizations for this ${format} data and explain why they would be effective:\n\n${data}`,
      cleaning: `Please analyze this ${format} data and provide recommendations for cleaning and improving data quality:\n\n${data}`,
      insights: `Please extract and explain key insights from this ${format} data:\n\n${data}`
    };

    try {
      const response = await this.client.messages.create({
        model: this.defaultModel,
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: prompts[analysisType] || prompts.summary
        }]
      });

      return response.content[0].text;
    } catch (error) {
      logger.error('Data analysis error:', error);
      throw new AppError('Failed to analyze data: ' + error.message, 500);
    }
  }

  async createMessageStream(messages, options = {}) {
    try {
      const stream = await this.client.messages.create({
        model: options.model || this.defaultModel,
        max_tokens: options.maxTokens || 4096,
        messages: messages,
        temperature: options.temperature || 0.7,
        stream: true
      });

      return stream;
    } catch (error) {
      logger.error('Stream creation error:', error);
      throw new AppError('Failed to create message stream: ' + error.message, 500);
    }
  }
}

// Create singleton instance
let instance = null;
try {
  instance = new AnthropicService();
} catch (error) {
  console.error('Failed to initialize AnthropicService:', error.message);
  process.exit(1);
}

module.exports = instance;