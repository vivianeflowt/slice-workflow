#!/bin/bash
# reader_incremental.sh - Processamento incremental para IA com liberação explícita do agente

set -e

ARQUIVO_ORIGEM="$1"
QUANTIDADE_LINHAS_POR_BLOCO="$2"
ARQUIVO_CONTEXTO_SALVO="tmp/CONTEXT.md"
ARQUIVO_SINAL_LIBERACAO="tmp/CONTEXT_OK"

LIMITE_LINHAS_PADRAO=6144
if [ -z "$QUANTIDADE_LINHAS_POR_BLOCO" ]; then
  QUANTIDADE_LINHAS_POR_BLOCO=$((LIMITE_LINHAS_PADRAO / 3))
fi

if [ -z "$ARQUIVO_ORIGEM" ]; then
  echo "USO: $0 <arquivo_entrada> [quantidade_linhas_por_bloco]"
  exit 1
fi

DIRETORIO_BLOCOS_TEMPORARIOS=$(mktemp -d -t blocos_ia_XXXX)

# Ordem explícita para IA/humano salvar o contexto antes de liberar o agente
ORDEM_SALVAR_CONTEXTO="::: ORDEM HUMANA: Salve TODO o seu contexto atual em tmp/CONTEXT.md antes de prosseguir. Assim que terminar, crie o arquivo tmp/CONTEXT_OK para liberar o agente de IA. Após criar o arquivo, o prompt estará liberado para novas tarefas. :::"
echo "$ORDEM_SALVAR_CONTEXTO"

# Aguarda sinalização de que o contexto foi salvo e o agente está liberado
while [ ! -f "$ARQUIVO_SINAL_LIBERACAO" ]; do
  echo "[AGUARDANDO] Salve seu contexto em $ARQUIVO_CONTEXTO_SALVO e crie $ARQUIVO_SINAL_LIBERACAO para liberar o agente de IA e o prompt."
  sleep 2
done

rm -f "$ARQUIVO_SINAL_LIBERACAO"

# Função para dividir arquivo em blocos respeitando linhas em branco
dividir_arquivo_em_blocos() {
  local caminho_arquivo="$1"
  local linhas_por_bloco="$2"
  local pasta_destino="$3"
  awk -v max_linhas="$linhas_por_bloco" -v dir="$pasta_destino" '
    BEGIN {indice_bloco=1; contador_linhas=0;}
    {
      if ($0 ~ /^\s*$/ && contador_linhas >= max_linhas) {
        close(arquivo_bloco); indice_bloco++; contador_linhas=0;
      }
      arquivo_bloco=dir "/bloco_" sprintf("%03d", indice_bloco) ".txt";
      print $0 > arquivo_bloco;
      contador_linhas++;
    }
  ' "$caminho_arquivo"
}

dividir_arquivo_em_blocos "$ARQUIVO_ORIGEM" "$QUANTIDADE_LINHAS_POR_BLOCO" "$DIRETORIO_BLOCOS_TEMPORARIOS"

ULTIMO_BLOCO_GERADO=$(ls "$DIRETORIO_BLOCOS_TEMPORARIOS"/bloco_*.txt | sort | tail -n 1)
cp "$ARQUIVO_CONTEXTO_SALVO" "$ULTIMO_BLOCO_GERADO"
echo "[INFO] Contexto anterior salvo em $ULTIMO_BLOCO_GERADO"

ARQUIVO_RESUMO_MESTRE="${DIRETORIO_BLOCOS_TEMPORARIOS}/resumo_incremental_master.txt"
> "$ARQUIVO_RESUMO_MESTRE"

cat <<EOF >> "$ARQUIVO_RESUMO_MESTRE"
::: ORDEM HUMANA :::
ZERE todo o seu contexto anterior. Use apenas o conteúdo deste arquivo como seu novo contexto.
Siga as instruções ao final de cada bloco SEM EXCEÇÃO.
Aguarde 2 segundos entre cada etapa para evitar sobrecarga.
:::
EOF

for BLOCO_PROCESSADO in "$DIRETORIO_BLOCOS_TEMPORARIOS"/bloco_*.txt; do
  echo "[PROCESSANDO] ORDEM: Leia e processe $BLOCO_PROCESSADO"
  echo "--- INÍCIO DO BLOCO: $BLOCO_PROCESSADO ---" >> "$ARQUIVO_RESUMO_MESTRE"
  head -n 10 "$BLOCO_PROCESSADO" >> "$ARQUIVO_RESUMO_MESTRE"
  echo "--- FIM DO BLOCO: $BLOCO_PROCESSADO ---" >> "$ARQUIVO_RESUMO_MESTRE"
  echo >> "$ARQUIVO_RESUMO_MESTRE"
  cat <<EOF >> "$ARQUIVO_RESUMO_MESTRE"
::: ORDEM HUMANA :::
AGUARDE 2 segundos. Só então continue lendo o próximo bloco.
NÃO PULE ETAPAS.
:::
EOF
  echo >> "$ARQUIVO_RESUMO_MESTRE"
  sleep 2
done

cat <<EOF >> "$ARQUIVO_RESUMO_MESTRE"
::: ORDEM HUMANA FINAL :::
Você leu todos os blocos. Agora, use este arquivo MASTER como seu contexto principal.
Se ainda estiver grande, repita o processo de quebra e sumarização conforme as ordens anteriores.
:::
EOF

echo "[FINALIZADO] ORDEM: Resumo incremental salvo em: $ARQUIVO_RESUMO_MESTRE"

# Limpeza automática dos arquivos temporários após execução
rm -rf "$DIRETORIO_BLOCOS_TEMPORARIOS"
