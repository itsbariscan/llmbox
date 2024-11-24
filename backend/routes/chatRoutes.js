const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const rateLimit = require('express-rate-limit');
const { RATE_LIMITS } = require('../config/constants');

// Create rate limiter
const limiter = rateLimit({
  windowMs: RATE_LIMITS.windowMs,
  max: RATE_LIMITS.max,
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiter to all chat routes
router.use(limiter);

// Chat routes
router.post('/message', chatController.sendMessage);
router.post('/stream', chatController.streamMessage);
router.post('/title', chatController.generateTitle);

module.exports = router;