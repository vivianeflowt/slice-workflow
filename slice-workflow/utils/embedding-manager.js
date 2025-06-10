const axios = require('axios');

class EmbeddingManager {
  constructor(model = 'bge-m3') {
    this.model = model;
    this.apiEndpoint = 'http://localhost:11434/api/embeddings';
  }

  async getEmbedding(text, options = {}) {
    try {
      const response = await axios.post(this.apiEndpoint, {
        model: this.model,
        prompt: text,
        options: {
          // Habilita multi-vector para textos longos
          multi_vector: text.length > 1000,
          // Usa sparse retrieval para busca por palavras-chave
          sparse: options.sparse || false
        }
      });

      if (response.data && response.data.embedding) {
        return {
          dense: response.data.embedding,
          sparse: response.data.sparse_embedding,
          multi_vector: response.data.multi_vector_embedding
        };
      }

      throw new Error('Invalid embedding response');
    } catch (error) {
      console.error('Embedding error:', error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  async getEmbeddings(texts, options = {}) {
    return Promise.all(texts.map(text => this.getEmbedding(text, options)));
  }

  // Similaridade cosseno para dense embeddings
  cosineSimilarity(embedding1, embedding2) {
    const dotProduct = embedding1.dense.reduce((sum, val, i) => sum + val * embedding2.dense[i], 0);
    const norm1 = Math.sqrt(embedding1.dense.reduce((sum, val) => sum + val * val, 0));
    const norm2 = Math.sqrt(embedding2.dense.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (norm1 * norm2);
  }

  // Busca híbrida usando dense + sparse
  async findSimilarBlocks(query, blocks, options = {}) {
    const queryEmbedding = await this.getEmbedding(query, { sparse: true });

    return blocks
      .map(block => {
        const denseScore = this.cosineSimilarity(queryEmbedding, block.embedding);
        const sparseScore = this.calculateSparseScore(queryEmbedding.sparse, block.embedding.sparse);

        return {
          ...block,
          similarity: options.hybrid ?
            (denseScore * 0.7 + sparseScore * 0.3) : // Score híbrido
            denseScore
        };
      })
      .filter(block => block.similarity >= (options.threshold || 0.7))
      .sort((a, b) => b.similarity - a.similarity);
  }

  // Calcula score para sparse embeddings
  calculateSparseScore(sparse1, sparse2) {
    if (!sparse1 || !sparse2) return 0;

    const intersection = new Set(
      [...Object.keys(sparse1)].filter(key => sparse2[key])
    );

    return intersection.size / Math.max(
      Object.keys(sparse1).length,
      Object.keys(sparse2).length
    );
  }

  // Busca por similaridade em documentos longos usando multi-vector
  async findSimilarInLongDocument(query, document, options = {}) {
    const queryEmbedding = await this.getEmbedding(query, { multi_vector: true });
    const docEmbedding = await this.getEmbedding(document, { multi_vector: true });

    // Compara cada vetor do documento com o vetor da query
    return docEmbedding.multi_vector.map((vector, index) => ({
      index,
      similarity: this.cosineSimilarity(
        { dense: queryEmbedding.multi_vector[0] },
        { dense: vector }
      )
    }))
    .filter(result => result.similarity >= (options.threshold || 0.7))
    .sort((a, b) => b.similarity - a.similarity);
  }
}

module.exports = EmbeddingManager;
