const ContentProcessor = require('./content-processor');
const fs = require('fs').promises;
const path = require('path');

async function evaluate(config) {
  console.log('\n=== Iniciando Avaliação ===');
  console.log('Configuração:', config);

  const startTime = Date.now();
  const processor = new ContentProcessor(config);

  try {
    // Processa o arquivo
    const result = await processor.processFile('CHAT01.md', {
      context: 'Avaliação de processamento de chat'
    });

    // Métricas básicas
    const endTime = Date.now();
    const processingTime = (endTime - startTime) / 1000;

    console.log('\n=== Métricas de Processamento ===');
    console.log(`Tempo total: ${processingTime.toFixed(2)}s`);
    console.log(`Blocos processados: ${result.metadata.totalBlocks}`);
    console.log(`Tokens totais: ${result.metadata.totalTokens}`);
    console.log(`Média de tokens/bloco: ${(result.metadata.totalTokens / result.metadata.totalBlocks).toFixed(0)}`);

    // Análise de behaviors
    const behaviors = result.blocks.filter(b => b.metadata.isBehavior);
    console.log('\n=== Análise de Behaviors ===');
    console.log(`Total de behaviors: ${behaviors.length}`);
    if (behaviors.length > 0) {
      console.log('\nExemplos de behaviors:');
      behaviors.slice(0, 3).forEach((b, i) => {
        console.log(`\nBehavior ${i + 1}:`);
        console.log(b.content.slice(0, 200) + '...');
      });
    }

    // Teste de busca semântica
    console.log('\n=== Teste de Busca Semântica ===');
    const testQueries = [
      'pythonzeira',
      'comportamento',
      'técnico',
      'emoção'
    ];

    for (const query of testQueries) {
      console.log(`\nBuscando por "${query}":`);

      // Busca híbrida
      const hybridResults = await processor.embeddingManager.findSimilarBlocks(
        query,
        result.blocks,
        { hybrid: true, threshold: 0.6 }
      );

      console.log(`Resultados híbridos (${hybridResults.length}):`);
      hybridResults.slice(0, 2).forEach(r => {
        console.log(`- Similaridade ${r.similarity.toFixed(2)}: ${r.summary.slice(0, 100)}...`);
      });

      // Busca em documento longo
      const longDoc = result.blocks.map(b => b.content).join('\n');
      const longDocResults = await processor.embeddingManager.findSimilarInLongDocument(
        query,
        longDoc,
        { threshold: 0.6 }
      );

      console.log(`Resultados em documento longo (${longDocResults.length}):`);
      longDocResults.slice(0, 2).forEach(r => {
        console.log(`- Trecho ${r.index + 1} (${r.similarity.toFixed(2)}): ${r.content.slice(0, 100)}...`);
      });
    }

    // Salva resultados
    const output = {
      config,
      metrics: {
        processingTime,
        totalBlocks: result.metadata.totalBlocks,
        totalTokens: result.metadata.totalTokens,
        behaviorsCount: behaviors.length
      },
      timestamp: new Date().toISOString()
    };

    await fs.writeFile(
      'evaluation-results.json',
      JSON.stringify(output, null, 2)
    );

    console.log('\n=== Avaliação Concluída ===');
    console.log('Resultados salvos em evaluation-results.json');

  } catch (error) {
    console.error('Erro na avaliação:', error);
  }
}

// Configurações para testar
const configs = [
  {
    MAX_TOKENS_PER_BLOCK: 4000,
    OVERLAP_LINES: 5,
    EMBEDDING_MODEL: 'bge-m3',
    SUMMARIZATION_MODEL: 'deepseek-coder'
  },
  {
    MAX_TOKENS_PER_BLOCK: 2000,
    OVERLAP_LINES: 10,
    EMBEDDING_MODEL: 'bge-m3',
    SUMMARIZATION_MODEL: 'deepseek-coder'
  }
];

// Roda avaliação para cada configuração
async function runEvaluations() {
  for (const config of configs) {
    await evaluate(config);
    console.log('\n' + '='.repeat(50) + '\n');
  }
}

runEvaluations();
