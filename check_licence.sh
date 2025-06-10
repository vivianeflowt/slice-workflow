#!/bin/bash

# Caminho do arquivo de licenças
CAMINHO_ARQUIVO_LICENCAS="$(dirname "$0")/licence.txt"
ARQUIVO_SAIDA="$(dirname "$0")/licence_analysis.txt"

# Lê o conteúdo do arquivo de licenças
CONTEUDO_LICENCAS=$(cat "$CAMINHO_ARQUIVO_LICENCAS")

# Prompt especializado para análise de licenças
PROMPT_ANALISE_LICENCA="Você é um especialista em licenças de software open source. Para cada ferramenta listada, acesse o link da licença e faça uma análise detalhada: liste todas as obrigações, restrições, pegadinhas e pontos de atenção para uso, modificação, distribuição e integração desta ferramenta em projetos open source e comerciais. Destaque qualquer ambiguidade ou risco de lock-in. Responda em português claro e objetivo."

# Monta o JSON de forma segura usando jq
JSON_REQUISICAO=$(jq -n \
  --arg provider "openai" \
  --arg model "gpt-4" \
  --arg systemPrompt "$PROMPT_ANALISE_LICENCA" \
  --arg prompt "$CONTEUDO_LICENCAS" \
  '{
    provider: $provider,
    model: $model,
    systemPrompt: $systemPrompt,
    prompt: $prompt
  }'
)

# Envia a requisição para o servidor local e salva a resposta em arquivo
curl -s -X POST http://localhost:4000/api/chat/completions \
  -H "Content-Type: application/json" \
  -d "$JSON_REQUISICAO" \
  > "$ARQUIVO_SAIDA"

# Mensagem de sucesso
if [ $? -eq 0 ]; then
  echo "Análise de licenças salva em $ARQUIVO_SAIDA"
else
  echo "Erro ao realizar a análise de licenças."
fi
