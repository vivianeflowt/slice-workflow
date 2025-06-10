#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const axios = require('axios');
const Bluebird = require('bluebird');

// === CONFIGURAÇÃO DE SUMARIZAÇÃO ===
const PROVIDER = 'ollama';
const MODEL = 'deepseek-llm:7b';
const SYSTEM_PROMPT = 'Você é um agente de IA especialista em sumarização técnica. Resuma o texto fornecido de forma objetiva, clara e sem perder detalhes importantes.';
const ENDPOINT = 'http://localhost:4000/api/chat/completions';
const CONCURRENCY = 2;
// ===================================

// Argumentos: caminho do arquivo de entrada, contexto limpo
const [caminhoArquivoEntrada, contextoLimpo] = process.argv.slice(2);
if (!caminhoArquivoEntrada) {
  console.error('Erro: informe o caminho do arquivo de entrada.');
  process.exit(1);
}
if (!contextoLimpo || contextoLimpo.trim() === '') {
  console.error('Erro: contexto limpo não informado como argumento.');
  process.exit(1);
}

// Cria diretório temporário para blocos
const pastaTopicos = fs.mkdtempSync(path.join(os.tmpdir(), 'topicos_ia_'));

// Split por tópico (títulos markdown)
function splitPorTopico(arquivo, pastaDestino) {
  const linhas = fs.readFileSync(arquivo, 'utf-8').split('\n');
  let bloco = [], indice = 1, titulo = 'inicio';
  for (const linha of linhas) {
    if (/^#+\s/.test(linha) && bloco.length) { // novo tópico
      const nome = `topico_${String(indice).padStart(3, '0')}_${titulo.replace(/\W+/g, '_')}.md`;
      fs.writeFileSync(path.join(pastaDestino, nome), bloco.join('\n'));
      bloco = []; indice++;
    }
    if (/^#+\s/.test(linha)) titulo = linha.replace(/^#+\s*/, '').trim();
    bloco.push(linha);
  }
  if (bloco.length) {
    const nome = `topico_${String(indice).padStart(3, '0')}_${titulo.replace(/\W+/g, '_')}.md`;
    fs.writeFileSync(path.join(pastaDestino, nome), bloco.join('\n'));
  }
}

splitPorTopico(caminhoArquivoEntrada, pastaTopicos);

// Salva o contexto limpo explicitamente
fs.mkdirSync('tmp', { recursive: true });
fs.writeFileSync('tmp/CONTEXT.md', contextoLimpo);

// Sumarização concorrente de cada tópico
async function sumarizarBloco(caminhoBloco) {
  const texto = fs.readFileSync(caminhoBloco, 'utf-8');
  const res = await axios.post(ENDPOINT, {
    provider: PROVIDER,
    model: MODEL,
    systemPrompt: SYSTEM_PROMPT,
    prompt: `Resuma o seguinte tópico:\n\n${texto}`
  });
  const saida = caminhoBloco.replace('.md', '_resumo.md');
  fs.writeFileSync(saida, res.data.result || JSON.stringify(res.data, null, 2));
  console.log(`[OK] Resumo salvo em: ${saida}`);
}

async function main() {
  const blocos = fs.readdirSync(pastaTopicos).filter(f => f.endsWith('.md'));
  await Bluebird.map(blocos, b => sumarizarBloco(path.join(pastaTopicos, b)), { concurrency: CONCURRENCY });
  console.log('[FINALIZADO] Todos os tópicos foram sumarizados.');
}
main();


