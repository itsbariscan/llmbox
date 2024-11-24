const SUPPORTED_FILE_TYPES = {
    // Images
    '.jpg': { type: 'image', maxSize: 10, mimeType: 'image/jpeg' },
    '.jpeg': { type: 'image', maxSize: 10, mimeType: 'image/jpeg' },
    '.png': { type: 'image', maxSize: 10, mimeType: 'image/png' },
    '.gif': { type: 'image', maxSize: 10, mimeType: 'image/gif' },
    '.webp': { type: 'image', maxSize: 10, mimeType: 'image/webp' },
  
    // Documents
    '.txt': { type: 'text', maxSize: 5, mimeType: 'text/plain' },
    '.md': { type: 'text', maxSize: 5, mimeType: 'text/markdown' },
    '.pdf': { type: 'document', maxSize: 25, mimeType: 'application/pdf' },
    '.doc': { type: 'document', maxSize: 25, mimeType: 'application/msword' },
    '.docx': { type: 'document', maxSize: 25, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  
    // Code files
    '.js': { type: 'code', maxSize: 5, mimeType: 'text/javascript' },
    '.py': { type: 'code', maxSize: 5, mimeType: 'text/x-python' },
    '.java': { type: 'code', maxSize: 5, mimeType: 'text/x-java' },
    '.cpp': { type: 'code', maxSize: 5, mimeType: 'text/x-c++' },
    '.html': { type: 'code', maxSize: 5, mimeType: 'text/html' },
    '.css': { type: 'code', maxSize: 5, mimeType: 'text/css' },
    '.json': { type: 'code', maxSize: 5, mimeType: 'application/json' },
  
    // Data files
    '.csv': { type: 'data', maxSize: 25, mimeType: 'text/csv' },
    '.xml': { type: 'data', maxSize: 10, mimeType: 'application/xml' },
    '.yaml': { type: 'data', maxSize: 10, mimeType: 'application/x-yaml' }
  };
  
  const SUPPORTED_LANGUAGES = {
    'javascript': {
      name: 'JavaScript',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      actions: ['review', 'explain', 'optimize', 'document', 'test']
    },
    'python': {
      name: 'Python',
      extensions: ['.py', '.pyw', '.ipynb'],
      actions: ['review', 'explain', 'optimize', 'document', 'test']
    },
    'java': {
      name: 'Java',
      extensions: ['.java'],
      actions: ['review', 'explain', 'optimize', 'document', 'test']
    },
    'cpp': {
      name: 'C++',
      extensions: ['.cpp', '.hpp', '.h'],
      actions: ['review', 'explain', 'optimize', 'document']
    }
  };
  
  const IMAGE_ANALYSIS_TYPES = {
    'general': 'General description and analysis',
    'text': 'Text extraction (OCR)',
    'objects': 'Object detection and recognition',
    'faces': 'Face detection and analysis',
    'colors': 'Color scheme analysis',
    'composition': 'Image composition analysis',
    'technical': 'Technical metadata analysis'
  };
  
  const DATA_ANALYSIS_TYPES = {
    'summary': 'Statistical summary',
    'patterns': 'Pattern recognition',
    'visualization': 'Visualization suggestions',
    'cleaning': 'Data cleaning recommendations',
    'insights': 'Key insights extraction'
  };
  
  const RATE_LIMITS = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  };
  
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
  
  module.exports = {
    SUPPORTED_FILE_TYPES,
    SUPPORTED_LANGUAGES,
    IMAGE_ANALYSIS_TYPES,
    DATA_ANALYSIS_TYPES,
    RATE_LIMITS,
    MAX_FILE_SIZE
  };