#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Iniciando Processamento e Avaliação ===${NC}"

# Verifica se o Ollama está rodando
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "Ollama não está rodando. Iniciando..."
    ollama serve &
    sleep 5
fi

# Verifica se o modelo bge-m3 está instalado
if ! ollama list | grep -q "bge-m3"; then
    echo -e "${BLUE}Instalando modelo bge-m3...${NC}"
    ollama pull bge-m3
fi

# Instala dependências se necessário
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Instalando dependências...${NC}"
    npm install
fi

# Roda a avaliação
echo -e "${BLUE}Rodando avaliação...${NC}"
node evaluate.js

# Verifica se a avaliação foi bem sucedida
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Avaliação concluída com sucesso!${NC}"
    echo -e "${BLUE}Resultados salvos em evaluation-results.json${NC}"
else
    echo "Erro na avaliação. Verifique os logs acima."
    exit 1
fi
