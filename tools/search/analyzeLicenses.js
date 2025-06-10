const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Promise = require('bluebird');
const { PROVIDERS_MODELS, ENDPOINT, SYSTEM_PROMPT, LICENCE_LIST_PATH, OUTPUT_DIR } = require('./constants');

const MAX_RETRIES = 3;
const TIMEOUT_MS = 120000;
const CONCURRENCY = 2;

let summary = {
  total: 0,
  skipped: 0,
  success: 0,
  errors: 0,
  files: [],
  errorsList: [],
  startTime: null,
  endTime: null,
};

function getSafeFileName(tool, provider, model) {
  return `analise_${tool.replace(/\W+/g, '_').toLowerCase()}_${provider}_${model}.txt`;
}

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function fetchLicenseText(url) {
  try {
    const res = await axios.get(url, { timeout: TIMEOUT_MS });
    return res.data;
  } catch (err) {
    console.error(`Erro ao baixar licença de ${url}:`, err.message);
    return null;
  }
}

async function analyzeLicense(tool, licenseUrl, provider, model) {
  const outputPath = path.join(
    OUTPUT_DIR,
    getSafeFileName(tool, provider, model)
  );
  summary.total++;
  if (fs.existsSync(outputPath)) {
    console.log(`⏩  [${provider}/${model}] ${tool} — Já existe, pulando.`);
    summary.skipped++;
    summary.files.push(outputPath);
    return;
  }

  console.log(`➡️  [${provider}/${model}] ${tool} — Iniciando análise.`);
  console.time(`[${provider}/${model}] ${tool}`);
  const licenseText = await fetchLicenseText(licenseUrl);
  let prompt;
  if (licenseText) {
    prompt = `Ferramenta: ${tool}\n\nTexto da licença:\n${licenseText}`;
  } else {
    prompt = `Ferramenta: ${tool}\n\nNão foi possível baixar o texto da licença automaticamente. Analise pelo link: ${licenseUrl}`;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await axios.post(
        ENDPOINT,
        {
          provider,
          model,
          systemPrompt: SYSTEM_PROMPT,
          prompt,
        },
        { timeout: TIMEOUT_MS }
      );
      const result = res.data.result || JSON.stringify(res.data, null, 2);
      if (!result || result.trim().length < 10) {
        throw new Error('Resposta vazia ou muito curta do modelo.');
      }
      fs.writeFileSync(outputPath, result);
      console.timeEnd(`[${provider}/${model}] ${tool}`);
      console.log(`✔️  [${provider}/${model}] ${tool} — Análise salva em ${outputPath}`);
      summary.success++;
      summary.files.push(outputPath);
      return;
    } catch (err) {
      console.error(`❌ [${provider}/${model}] ${tool} — Tentativa ${attempt} falhou:`, err.message);
      if (attempt === MAX_RETRIES) {
        fs.writeFileSync(outputPath, `Erro após ${MAX_RETRIES} tentativas: ${err.message}\nPrompt usado:\n${prompt}`);
        summary.errors++;
        summary.errorsList.push({ tool, provider, model, error: err.message, prompt });
      } else {
        await new Promise(r => setTimeout(r, 3000)); // espera 3s antes do retry
      }
    }
  }
  console.timeEnd(`[${provider}/${model}] ${tool}`);
}

function parseLicenceList() {
  const content = fs.readFileSync(LICENCE_LIST_PATH, 'utf8');
  const regex = /\*\*([\w\-\.\s]+)\*\*\s*- \[Licen[çc]a [^\]]+\]\(([^)]+)\)/g;
  const matches = [...content.matchAll(regex)];
  return matches.map(m => ({ tool: m[1].trim(), url: m[2] }));
}

async function main() {
  ensureDirectoryExists(OUTPUT_DIR);
  const licenses = parseLicenceList();
  summary.startTime = Date.now();
  for (const { provider, model } of PROVIDERS_MODELS) {
    console.log(`\n=== Analisando todas as licenças com [${provider}/${model}] ===`);
    await Promise.map(
      licenses,
      async ({ tool, url }) => {
        await analyzeLicense(tool, url, provider, model);
      },
      { concurrency: CONCURRENCY }
    );
  }
  summary.endTime = Date.now();
  // Resumo final
  const totalTime = ((summary.endTime - summary.startTime) / 1000).toFixed(1);
  console.log('\n===== RESUMO FINAL =====');
  console.log(`Total de análises: ${summary.total}`);
  console.log(`Sucesso: ${summary.success}`);
  console.log(`Puladas (já existiam): ${summary.skipped}`);
  console.log(`Erros: ${summary.errors}`);
  console.log(`Arquivos salvos: ${summary.files.length}`);
  if (summary.errorsList.length > 0) {
    console.log('\nErros detalhados:');
    summary.errorsList.forEach(e => {
      console.log(`- [${e.provider}/${e.model}] ${e.tool}: ${e.error}`);
    });
  }
  console.log(`Tempo total: ${totalTime}s`);
}

main();
