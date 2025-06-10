const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Promise = require('bluebird');
const { encode } = require('gpt-3-encoder');

// Configurações
const CONFIG = {
  MAX_TOKENS_PER_BLOCK: 4000,
  OVERLAP_LINES: 5,
  EMBEDDING_MODEL: 'bge-m3',
  SUMMARIZATION_MODEL: 'deepseek-coder',
  API_ENDPOINT: 'http://localhost:11434/api/generate',
  BATCH_SIZE: 3,
  TIMEOUT: 120000
};

// Processadores específicos para cada tipo de conteúdo
const processors = {
  markdown: require('./processors/markdown-processor'),
  chat: require('./processors/chat-processor'),
  documentation: require('./processors/doc-processor'),
  guide: require('./processors/guide-processor')
};

// Gerenciador de embeddings
const embeddingManager = require('./utils/embedding-manager');

class ContentProcessor {
  constructor(options = {}) {
    this.config = { ...CONFIG, ...options };
    this.embeddingManager = new embeddingManager(this.config.EMBEDDING_MODEL);
  }

  async processFile(filePath, options = {}) {
    const fileType = this.detectFileType(filePath);
    const processor = processors[fileType];

    if (!processor) {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    // Lê e divide o conteúdo
    const content = await fs.promises.readFile(filePath, 'utf8');
    const blocks = await processor.split(content, this.config);

    // Processa cada bloco
    const results = await this.processBlocks(blocks, options);

    // Gera embeddings e indexa
    const indexedResults = await this.indexResults(results);

    return {
      type: fileType,
      blocks: results,
      embeddings: indexedResults,
      metadata: {
        totalBlocks: blocks.length,
        totalTokens: blocks.reduce((sum, b) => sum + b.tokens, 0),
        filePath,
        processedAt: new Date().toISOString()
      }
    };
  }

  async processBlocks(blocks, options) {
    return Promise.map(blocks, async (block, index) => {
      try {
        // Gera embedding do bloco
        const embedding = await this.embeddingManager.getEmbedding(block.content);

        // Sumariza o bloco
        const summary = await this.summarizeBlock(block, options);

        return {
          index,
          content: block.content,
          embedding,
          summary,
          metadata: block.metadata || {}
        };
      } catch (error) {
        console.error(`Error processing block ${index}:`, error);
        return {
          index,
          error: error.message,
          content: block.content
        };
      }
    }, { concurrency: this.config.BATCH_SIZE });
  }

  async summarizeBlock(block, options) {
    const prompt = this.buildPrompt(block, options);

    try {
      const response = await axios.post(this.config.API_ENDPOINT, {
        model: this.config.SUMMARIZATION_MODEL,
        prompt,
        stream: false
      }, { timeout: this.config.TIMEOUT });

      return response.data.response;
    } catch (error) {
      console.error('Summarization error:', error);
      throw new Error(`Failed to summarize block: ${error.message}`);
    }
  }

  buildPrompt(block, options) {
    return `
Analyze and summarize the following content. Focus on:
1. Key information and facts
2. Emotions, tone, and relationships
3. Special behaviors or context changes
4. Technical details and requirements

Content:
${block.content}

Additional context: ${options.context || 'None'}

Provide a comprehensive summary that captures both objective information and subjective nuances.`;
  }

  detectFileType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const content = fs.readFileSync(filePath, 'utf8');

    if (content.includes(':::')) return 'chat';
    if (ext === '.md') return 'markdown';
    if (content.includes('## Guide') || content.includes('# Guide')) return 'guide';
    return 'documentation';
  }

  async indexResults(results) {
    const indexed = {};

    for (const result of results) {
      if (result.embedding) {
        indexed[result.index] = {
          embedding: result.embedding,
          summary: result.summary,
          metadata: result.metadata
        };
      }
    }

    return indexed;
  }
}

module.exports = ContentProcessor;
