#!/usr/bin/env node
// === Dependencies and Configuration ===
const fs = require('fs');
const path = require('path');
const os = require('os');
const axios = require('axios');
const Bluebird = require('bluebird');
const { Command } = require('commander');
let encode;
try { ({ encode } = require('gpt-tokenizer')); } catch { encode = undefined; }

// === General Constants ===
const PROVIDER = 'ollama';
const MODEL = process.env.MODEL_AI || 'deepseek-r1:8b'; //  deepseek-r1:1.5b

const SYSTEM_PROMPT = 'You are an AI agent specialized in technical summarization. Summarize the provided text objectively, clearly, and without losing important details.';
const ENDPOINT = 'http://localhost:4000/api/chat/completions';
const CONCURRENCY = 2;
const BLOCK_TOKEN_LIMIT = Math.floor(parseInt(process.env.BLOCK_TOKEN_LIMIT || '128000', 10) * 0.6)
const AVG_TOKEN_RATIO = 0.24;
const MIN_RESPONSE_TOKENS = 128;
const LENGTH_TO_TOKENS = { 100: 25, 200: 50, 500: 120, 1000: 240, 2000: 480, 5000: 1200, 10000: 2400, 20000: 4800, 50000: 12000, 100000: 24000 };

// === Tokenization Utilities ===
/**
 * Remove comments and extra spaces from text for more accurate token estimation.
 * @param {string} text
 * @returns {string}
 */
function removeCommentsAndSpaces(text) {
  return text.replace(/\s+/g, ' ').replace(/\/\*.*?\*\//gs, '').trim();
}

/**
 * Estimate the number of tokens in a text using gpt-tokenizer if available, with cache and sampling for performance.
 * @param {string} text
 * @param {number} sampleLimit
 * @returns {number}
 */
function estimateTokenCount(text, sampleLimit = 256) {
  if (!text) return 0;
  if (text.length <= 500) return MIN_RESPONSE_TOKENS;
  if (LENGTH_TO_TOKENS[text.length]) return LENGTH_TO_TOKENS[text.length];
  if (encode) {
    const sanitizedSample = removeCommentsAndSpaces(text).slice(0, sampleLimit);
    const tokensInSample = encode(sanitizedSample).length;
    const tokenRatio = tokensInSample / sanitizedSample.length || AVG_TOKEN_RATIO;
    return Math.ceil((text.length * tokenRatio) / 8) * 8;
  }
  return Math.ceil(text.length / 4);
}

/**
 * Calculate reserved tokens for system prompt and base prompt.
 * @param {string} systemPrompt
 * @param {string} basePrompt
 * @returns {number}
 */
function calculateReservedTokens(systemPrompt, basePrompt) {
  return estimateTokenCount(systemPrompt + basePrompt);
}

// === File Utilities ===
/**
 * Create a temporary directory for blocks.
 * @param {string} prefix
 * @returns {string}
 */
function createTempDirectory(prefix = 'ai_blocks_') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

/**
 * Save a block to a file.
 * @param {string} outputDir
 * @param {string[]} blockLines
 * @param {number} blockIndex
 * @param {string} blockLabel
 */
function saveBlockToFile(outputDir, blockLines, blockIndex, blockLabel) {
  const fileName = `block_${String(blockIndex).padStart(3, '0')}_${blockLabel.replace(/\W+/g, '_')}.txt`;
  fs.writeFileSync(path.join(outputDir, fileName), blockLines.join('\n'));
}

/**
 * Save the clean context to a file.
 * @param {string} context
 */
function saveCleanContext(context) {
  fs.mkdirSync('tmp', { recursive: true });
  fs.writeFileSync('tmp/CLEAN_CONTEXT.md', context);
}

// === Block Splitting ===
/**
 * Split input text into blocks optimized for the model context window.
 * Garante que cada bloco nunca ultrapasse o limite real de tokens do modelo,
 * descontando system prompt, base prompt, reservando margem de segurança e tokens mínimos para resposta.
 * @param {object} options
 * @param {string} options.inputFile
 * @param {string} options.outputDir
 * @param {number} [options.tokenLimit]
 * @param {string} [options.systemPrompt]
 * @param {string} [options.basePrompt]
 */
function splitTextByContext({ inputFile, outputDir, tokenLimit = BLOCK_TOKEN_LIMIT, systemPrompt = SYSTEM_PROMPT, basePrompt = 'Summarize the following content cleanly, without noise, and produce an objective and detailed summary:\n\n' }) {
  const fullText = fs.readFileSync(inputFile, 'utf-8');
  const lines = fullText.split('\n');
  let currentBlock = [], blockTokenCount = 0, blockIndex = 1;
  let currentLabel = 'block';
  const reservedTokens = calculateReservedTokens(systemPrompt, basePrompt);
  // Reserva 20% de margem de segurança e sempre reserva MIN_RESPONSE_TOKENS para resposta
  const tokenLimitWithMargin = Math.floor(tokenLimit * 0.8);
  const contentTokenLimit = tokenLimitWithMargin - reservedTokens - MIN_RESPONSE_TOKENS;
  for (const line of lines) {
    if (line.trim().length > 8 && /[a-zA-Z0-9]/.test(line)) {
      currentLabel = line.trim().slice(0, 40);
    }
    const lineTokens = estimateTokenCount(line + '\n');
    if (blockTokenCount + lineTokens > contentTokenLimit && currentBlock.length) {
      saveBlockToFile(outputDir, currentBlock, blockIndex, currentLabel);
      currentBlock = [];
      blockTokenCount = 0;
      blockIndex++;
    }
    currentBlock.push(line);
    blockTokenCount += lineTokens;
  }
  if (currentBlock.length) {
    saveBlockToFile(outputDir, currentBlock, blockIndex, currentLabel);
  }
}

// === Summarization ===
/**
 * Summarize a block using the AI model.
 * @param {object} options
 * @param {string} options.blockFilePath
 * @param {string} [options.provider]
 * @param {string} [options.model]
 * @param {string} [options.systemPrompt]
 * @param {string} [options.endpoint]
 */
async function summarizeBlock({ blockFilePath, provider = PROVIDER, model = MODEL, systemPrompt = SYSTEM_PROMPT, endpoint = ENDPOINT }) {
  try {
    const blockContent = fs.readFileSync(blockFilePath, 'utf-8');
    const aiRequest = {
      provider,
      model,
      systemPrompt,
      prompt: `Summarize the following content cleanly, without noise, and produce an objective and detailed summary:\n\n${blockContent}`,
      timeout: 120000
    };
    const response = await axios.post(endpoint, aiRequest);
    const outputFilePath = blockFilePath.replace(/\.(md|txt)$/i, '_output.md');
    fs.writeFileSync(outputFilePath, response.data.result || JSON.stringify(response.data, null, 2));
    console.log(`[OK] Output saved at: ${outputFilePath}`);
  } catch (error) {
    console.error(`[ERROR] Failed to process ${blockFilePath}:`, error.message);
    if (error.response) {
      console.error('[ERROR] Response data:', error.response.data);
    }
  }
}

// === Cursor AI Directive Output ===
/**
 * Print a directive for Cursor AI to read the optimized output files.
 * @param {string} outputDir
 * @param {string[]} blockFiles
 */
function printCursorAIDirective(outputDir, blockFiles) {
  console.log('\n::: DIRECTIVE :::');
  console.log('To optimally absorb the content, sequentially read each *_output.md file generated in this temporary directory:');
  blockFiles.forEach(fileName => {
    const outputFilePath = path.join(outputDir, fileName.replace(/\.(md|txt)$/i, '_output.md'));
    if (fs.existsSync(outputFilePath)) {
      console.log(`- ${outputFilePath}`);
    }
  });
  console.log('Each file contains a summarized and clean chunk, ready for incremental and efficient ingestion.');
  console.log('::: END OF DIRECTIVE :::\n');
}

// === CLI Argument Parsing with Commander ===
const program = new Command();
program
  .name('reader')
  .description('Slice Workflow - Contextual Summarization Tool')
  .version('1.0.0')
  .argument('<inputFile>', 'Path to the input file to be summarized')
  .argument('<cleanContext>', 'Clean context string for the summarization')
  .option('-m, --model <model>', 'AI model to use (default: env MODEL_AI or wizardlm2:7b)')
  .option('-t, --tokens <limit>', 'Token limit per block (default: env BLOCK_TOKEN_LIMIT or 32000)')
  .option('-c, --concurrency <number>', 'Number of concurrent summarizations (default: 2)')
  .option('-o, --output <dir>', 'Output directory for blocks (default: temp dir)')
  .helpOption('-h, --help', 'Display help for command')
  .showHelpAfterError();

program.parse(process.argv);
const options = program.opts();
const inputFile = program.args[0];
const cleanContext = program.args[1];
const model = options.model || process.env.MODEL_AI || MODEL;
const blockTokenLimit = options.tokens ? parseInt(options.tokens, 10) : (process.env.BLOCK_TOKEN_LIMIT ? parseInt(process.env.BLOCK_TOKEN_LIMIT, 10) : BLOCK_TOKEN_LIMIT);
const concurrency = options.concurrency ? parseInt(options.concurrency, 10) : (process.env.CONCURRENCY ? parseInt(process.env.CONCURRENCY, 10) : CONCURRENCY);
const outputDir = options.output || createTempDirectory();

// === Main Execution Flow ===
(async function main() {
  console.clear();
  if (!inputFile) {
    program.help({ error: true });
  }
  if (!cleanContext || cleanContext.trim() === '') {
    console.error('Error: clean context is required as argument.');
    process.exit(1);
  }
  const start = Date.now();
  splitTextByContext({ inputFile, outputDir, tokenLimit: blockTokenLimit, systemPrompt: SYSTEM_PROMPT, basePrompt: 'Summarize the following content cleanly, without noise, and produce an objective and detailed summary:\n\n' });
  saveCleanContext(cleanContext);
  const blockFiles = fs.readdirSync(outputDir).filter(name => /\.(md|txt)$/i.test(name));
  try {
    await Bluebird.map(
      blockFiles,
      fileName => summarizeBlock({ blockFilePath: path.join(outputDir, fileName), model, provider: PROVIDER, systemPrompt: SYSTEM_PROMPT, endpoint: ENDPOINT }),
      { concurrency }
    );
    console.log('[DONE] All blocks have been processed for clean output.');
    printCursorAIDirective(outputDir, blockFiles);
  } catch (error) {
    console.error('[GENERAL ERROR] Stack:', error.stack);
    if (error.response) {
      console.error('[GENERAL ERROR] Response data:', error.response.data);
    }
  }
  console.log(`[INFO] Tempo total: ${(Date.now() - start) / 1000}s`);
})();




