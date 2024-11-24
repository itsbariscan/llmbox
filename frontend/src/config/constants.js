export const MODELS = {
  // Claude 3.5 Models
  CLAUDE_3_5_SONNET: {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    description: 'Our most intelligent model',
    maxTokens: 8192,
    contextWindow: 200000,
    vision: true,
    latency: 'Fast',
    cost: '$3.00/$15.00 per MTok'
  },
  CLAUDE_3_5_HAIKU: {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    description: 'Our fastest model',
    maxTokens: 8192,
    contextWindow: 200000,
    vision: false,
    latency: 'Fastest',
    cost: '$1.00/$5.00 per MTok'
  },

  // Claude 3 Models
  CLAUDE_3_OPUS: {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    description: 'Powerful model for highly complex tasks',
    maxTokens: 4096,
    contextWindow: 200000,
    vision: true,
    latency: 'Moderately fast',
    cost: '$15.00/$75.00 per MTok'
  },
  CLAUDE_3_SONNET: {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    description: 'Balance of intelligence and speed',
    maxTokens: 4096,
    contextWindow: 200000,
    vision: true,
    latency: 'Fast',
    cost: '$3.00/$15.00 per MTok'
  },
  CLAUDE_3_HAIKU: {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    description: 'Fastest and most compact model',
    maxTokens: 4096,
    contextWindow: 200000,
    vision: true,
    latency: 'Fastest',
    cost: '$0.25/$1.25 per MTok'
  }
};

export const TEMPERATURE_PRESETS = {
  CREATIVE: {
    value: 0.9,
    description: 'More creative and varied responses'
  },
  BALANCED: {
    value: 0.7,
    description: 'Good balance of creativity and consistency'
  },
  PRECISE: {
    value: 0.3,
    description: 'More focused and deterministic responses'
  }
};