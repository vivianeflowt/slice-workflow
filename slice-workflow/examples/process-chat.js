const ContentProcessor = require('../content-processor');
const path = require('path');

async function main() {
  try {
    // Inicializa o processador
    const processor = new ContentProcessor({
      MAX_TOKENS_PER_BLOCK: 4000,
      OVERLAP_LINES: 5
    });

    // Processa o arquivo de chat
    const result = await processor.processFile('CHAT01.md', {
      context: 'Processando histórico de chat para extrair conhecimentos e behaviors'
    });

    // Exibe resultados
    console.log('Processamento concluído!');
    console.log(`Tipo: ${result.type}`);
    console.log(`Total de blocos: ${result.metadata.totalBlocks}`);
    console.log(`Total de tokens: ${result.metadata.totalTokens}`);

    // Exibe alguns blocos de exemplo
    console.log('\nExemplos de blocos processados:');
    result.blocks.slice(0, 3).forEach((block, index) => {
      console.log(`\nBloco ${index + 1}:`);
      console.log('---');
      console.log(block.summary);
      console.log('---');
      if (block.metadata.isBehavior) {
        console.log('Behavior detectado!');
      }
      if (block.metadata.participants.length > 0) {
        console.log('Participantes:', block.metadata.participants.join(', '));
      }
    });

    // Exemplo de busca híbrida (dense + sparse)
    const query = 'pythonzeira';
    console.log('\nBuscando por "pythonzeira" usando busca híbrida:');
    const similarBlocks = await processor.embeddingManager.findSimilarBlocks(
      query,
      result.blocks,
      { hybrid: true, threshold: 0.6 }
    );

    similarBlocks.slice(0, 3).forEach((block, index) => {
      console.log(`\nSimilaridade ${block.similarity.toFixed(2)}:`);
      console.log(block.summary);
    });

    // Exemplo de busca em documento longo
    const longDoc = result.blocks.map(b => b.content).join('\n');
    console.log('\nBuscando por "pythonzeira" no documento completo:');
    const longDocResults = await processor.embeddingManager.findSimilarInLongDocument(
      query,
      longDoc,
      { threshold: 0.6 }
    );

    longDocResults.slice(0, 3).forEach((result, index) => {
      console.log(`\nTrecho ${result.index + 1} (similaridade ${result.similarity.toFixed(2)}):`);
      const block = result.blocks[result.index];
      console.log(block.content.slice(0, 200) + '...');
    });

  } catch (error) {
    console.error('Erro:', error);
  }
}

main();
