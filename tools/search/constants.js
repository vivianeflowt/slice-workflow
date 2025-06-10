// constants.js

module.exports = {
  PROVIDERS_MODELS: [
    { provider: 'openai', model: 'gpt-4' },
    { provider: 'ollama', model: 'granite3.3:8b' },
    { provider: 'ollama', model: 'qwen3:32b' },
    { provider: 'ollama', model: 'deepseek-r1:32b' },
    { provider: 'ollama', model: 'mixtral:8x22b' },
    { provider: 'ollama', model: 'llava:13b' },
    { provider: 'ollama', model: 'gemma:7b' },
    { provider: 'ollama', model: 'mistral:7b' },
    { provider: 'ollama', model: 'phi4:14b' },
    { provider: 'ollama', model: 'wizardlm2:8x22b' },
    { provider: 'ollama', model: 'granite3.2-vision:2b' },
    // Adicione outros providers/models conforme necessário
  ],
  ENDPOINT: 'http://localhost:4000/api/chat/completions',
  SYSTEM_PROMPT: `Você é um especialista crítico em licenças de software open source e compliance corporativo. Analise o texto da licença fornecida com máxima atenção aos detalhes e riscos. Para cada licença:
- Liste todas as obrigações legais, restrições de uso, redistribuição, modificação e integração, tanto para projetos open source quanto comerciais.
- Destaque qualquer ambiguidade, pegadinha, cláusula incomum, risco de lock-in, dependência de serviços, dual-license, ou termos que possam limitar liberdade, automação, integração, uso interno ou SaaS.
- Alerte para pontos que possam gerar risco jurídico, lock-in, custos ocultos, ou exigir publicação de código modificado.
- Seja objetivo, direto e use linguagem clara para times técnicos e decisores.
- Se possível, compare com MIT/GPL/Apache e aponte diferenças práticas.
- Se a licença for permissiva, explique por quê. Se for restritiva, detalhe os riscos.
Responda em português claro, crítico e sem omitir nenhum risco relevante.`,
  LICENCE_LIST_PATH: './licence.txt',
  OUTPUT_DIR: './analises',
};
