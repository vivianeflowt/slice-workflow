const { encode } = require('gpt-3-encoder');

class ChatProcessor {
  async split(content, config) {
    const lines = content.split('\n');
    const blocks = [];
    let currentBlock = [];
    let currentTokens = 0;
    let inBehavior = false;
    let behaviorContent = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detecta início de behavior
      if (line.includes(':::')) {
        if (!inBehavior) {
          // Se já temos conteúdo, salva o bloco atual
          if (currentBlock.length > 0) {
            blocks.push(this.createBlock(currentBlock, config));
            currentBlock = [];
            currentTokens = 0;
          }
          inBehavior = true;
          behaviorContent = [];
        } else {
          // Fim do behavior
          inBehavior = false;
          const behaviorBlock = this.createBlock(behaviorContent, config, { isBehavior: true });
          blocks.push(behaviorBlock);
          behaviorContent = [];
          continue;
        }
      }

      // Adiciona linha ao bloco apropriado
      if (inBehavior) {
        behaviorContent.push(line);
      } else {
        const lineTokens = encode(line).length;

        if (currentTokens + lineTokens > config.MAX_TOKENS_PER_BLOCK) {
          // Adiciona overlap do bloco anterior
          const overlap = currentBlock.slice(-config.OVERLAP_LINES);
          blocks.push(this.createBlock(currentBlock, config));
          currentBlock = overlap;
          currentTokens = overlap.reduce((sum, l) => sum + encode(l).length, 0);
        }

        currentBlock.push(line);
        currentTokens += lineTokens;
      }
    }

    // Adiciona o último bloco se houver conteúdo
    if (currentBlock.length > 0) {
      blocks.push(this.createBlock(currentBlock, config));
    }

    return blocks;
  }

  createBlock(lines, config, metadata = {}) {
    const content = lines.join('\n');
    const tokens = encode(content).length;

    return {
      content,
      tokens,
      metadata: {
        ...metadata,
        lineCount: lines.length,
        hasBehavior: content.includes(':::'),
        participants: this.extractParticipants(content)
      }
    };
  }

  extractParticipants(content) {
    const participants = new Set();
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.startsWith('**')) {
        const participant = line.replace(/\*\*/g, '').trim();
        if (participant) participants.add(participant);
      }
    }

    return Array.from(participants);
  }
}

module.exports = new ChatProcessor();
