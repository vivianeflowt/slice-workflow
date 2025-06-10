---
# STACK MCP — Orquestração Modular, Multi-Agente e Rastreável

Stack recomendado para o ALIVE/Slice, integrando mcp-llm para máxima automação, rastreabilidade e flexibilidade. Ideal para pipelines multi-agente, experimentação incremental e integração total ao ecossistema MCP.

## 1. **mcp-llm**
- **Descrição:** Servidor MCP para orquestração de múltiplos LLMs/agentes, permitindo que agentes chamem outros agentes/modelos, com versionamento, logs e automação total.
- **Link:** [mcp-llm GitHub](https://github.com/slice-labs/mcp-llm) *(ajustar para o repositório correto se necessário)*
- **Instalação:**
  ```bash
  # Exemplo genérico, ajuste conforme o repositório
  git clone https://github.com/slice-labs/mcp-llm.git
  cd mcp-llm
  docker compose up -d
  ```
- **Documentação:** Consulte o README do repositório para endpoints, exemplos de uso e integração com outros MCP servers.

## 2. **Ollama**
- **Descrição:** Backend LLM local, rápido, privado, integrável com mcp-llm, LangChain, crewAI e outros frameworks.
- **Link:** [Ollama GitHub](https://github.com/ollama/ollama?tab=readme-ov-file)
- **Instalação:**
  ```bash
  # Linux/macOS
  curl -fsSL https://ollama.com/install.sh | sh
  # Ou baixe o binário do site oficial
  ```
- **Documentação:** [Ollama Docs](https://github.com/ollama/ollama?tab=readme-ov-file)

## 3. **LangChain Agents**
- **Descrição:** Framework para criar agentes especialistas, chains de raciocínio, integração com bancos, ferramentas externas e múltiplos LLMs (incluindo Ollama via mcp-llm).
- **Link:** [LangChain Agents Docs](https://python.langchain.com/docs/modules/agents/)
- **Instalação:**
  ```bash
  pip install langchain
  ```
- **Documentação:** [LangChain Docs](https://python.langchain.com/docs/)

## 4. **pgvector (PostgreSQL)**
- **Descrição:** Extensão para PostgreSQL que permite buscas vetoriais, ideal para persistência e recuperação semântica de contexto/tokenização.
- **Link:** [pgvector GitHub](https://github.com/pgvector/pgvector)
- **Instalação:**
  ```bash
  # Instale o PostgreSQL e a extensão pgvector
  sudo apt install postgresql postgresql-contrib
  # No psql:
  CREATE EXTENSION vector;
  ```
- **Documentação:** [pgvector Docs](https://github.com/pgvector/pgvector)

## 5. **Opik**
- **Descrição:** Plataforma open-source para debug, avaliação e monitoramento de aplicações LLM, com tracing, avaliações automáticas e dashboards de produção. Suporte nativo a Ollama e integração fácil com MCP.
- **Link:** [Opik Docs](https://www.comet.com/docs)
- **Instalação:**
  - Versão SaaS: uso direto via web.
  - Self-hosted: consulte a documentação para deploy local ou em nuvem.
- **Documentação:** [Opik Documentation](https://www.comet.com/docs)

## 6. **text-generation-webui**
- **Descrição:** Interface web open-source para deploy rápido de modelos LLM (HuggingFace, GGUF, safetensors, PyTorch, etc.), com suporte a múltiplos formatos, plugins de API (REST, OpenAI-compatible), gerenciamento de modelos e fácil integração.
- **Link:** [text-generation-webui GitHub](https://github.com/oobabooga/text-generation-webui)
- **Instalação:**
  ```bash
  git clone https://github.com/oobabooga/text-generation-webui.git
  cd text-generation-webui
  pip install -r requirements.txt
  python server.py
  ```
  Acesse via navegador em `http://localhost:7860`.
- **Documentação:** [Wiki/Docs](https://github.com/oobabooga/text-generation-webui/wiki)
- **Por que usar:**
  - Deploy realmente rápido de modelos HuggingFace e outros, com poucos cliques.
  - Suporte a múltiplos formatos (GGUF, safetensors, PyTorch, etc.).
  - Plugins para expor API REST, OpenAI-compatible, websocket, etc.
  - Interface web amigável para gerenciamento, quantização, parâmetros e histórico.
  - 100% self-hosted, roda em Linux, Windows e macOS.
  - Ideal para experimentação, prototipagem e integração com pipelines MCP, LangChain, etc.

## 7. **LiteLLM**
- **Descrição:** Proxy/servidor OpenAI-compatible que centraliza e roteia requisições para múltiplos backends de LLM (Ollama, text-generation-webui, OpenAI, Perplexity, Mistral, Azure, Anthropic, etc.), com logging, métricas, cache, fallback e controle de custos. Permite swap dinâmico de modelos/provedores sem mudar o código cliente.
- **Link:** [LiteLLM GitHub](https://github.com/BerriAI/litellm)
- **Instalação:**
  ```bash
  pip install litellm[proxy]
  # Crie um arquivo de configuração, ex: litellm.config.yaml
  litellm --config litellm.config.yaml
  ```
- **Documentação:** [LiteLLM Docs](https://docs.litellm.ai/docs/proxy)
- **Exemplo de uso:**
  - Configure múltiplos backends (Ollama, text-generation-webui, OpenAI, etc.) no arquivo YAML.
  - Aponte seu cliente (LangChain, Flowise, scripts, etc.) para o endpoint do LiteLLM (ex: `http://localhost:4000/v1/chat/completions`).
  - O LiteLLM roteia cada requisição para o backend/modelo configurado.
- **Por que usar:**
  - Centraliza e padroniza o acesso a múltiplos LLMs (local e cloud) via uma única API OpenAI-compatible.
  - Permite swap dinâmico de modelos/provedores sem alterar o código dos clientes.
  - Logging, métricas, cache, fallback e controle de custos integrados.
  - Integração fácil com Ollama, text-generation-webui, OpenAI, Perplexity, etc.
  - 100% self-hosted, ideal para ambientes híbridos e pipelines MCP.

## 8. **Pipeline RAG (Retrieval-Augmented Generation) para Agentes Contextuais**
- **Descrição:** Pipeline que permite que agentes/LLMs consultem e respondam com base em documentos do projeto (ex: CONTECT.md, README.md, docs de segurança, certificações RIA, etc.), usando busca semântica e geração aumentada por recuperação.
- **Ferramentas:**
  - [ModelFusion](https://modelfusion.dev/guide/) (TypeScript/JavaScript) — Framework flexível para montar pipelines RAG, integrando LLMs, bancos vetoriais (pgvector), loaders de documentos e lógica customizada.
  - [LangChain (Python ou JS/TS)](https://github.com/langchain-ai/langchain) — Framework para pipelines RAG, integração com bancos vetoriais e múltiplos backends.
  - [LlamaIndex](https://github.com/jerryjliu/llama_index) — Alternativa para pipelines RAG e integração com bancos vetoriais.
  - [pgvector](https://github.com/pgvector/pgvector) — Banco vetorial central do ecossistema Slice/ALIVE para indexação, busca semântica, versionamento e auditoria.
  - [Ollama](https://github.com/ollama/ollama?tab=readme-ov-file), [text-generation-webui](https://github.com/oobabooga/text-generation-webui), [LiteLLM](https://github.com/BerriAI/litellm) — LLMs locais/cloud integráveis via API OpenAI-compatible.
  - [Flowise](https://github.com/FlowiseAI/Flowise), [LangFlow](https://github.com/logspace-ai/langflow) — GUIs para montar pipelines RAG visualmente.
- **Como funciona:**
  1. Carregue e indexe os documentos do projeto no módulo Banco Vetorial (pgvector).
  2. Monte um pipeline RAG (ex: com ModelFusion, LangChain ou LlamaIndex) que busca trechos relevantes e envia ao LLM.
  3. O agente responde com base no contexto dos seus próprios documentos.
- **Por que usar:**
  - Permite criar agentes que realmente "leem" e usam a documentação/certificações do projeto.
  - Respostas explicáveis, auditáveis e alinhadas ao contexto real.
  - Não exige treinar o modelo do zero.
  - O módulo Banco Vetorial centraliza versionamento, auditoria e rastreabilidade do conhecimento usado pelos agentes.

## 9. **Fine-tuning/Fast Training com LoRA no text-generation-webui**
- **Descrição:** Técnica de ajuste fino (fine-tuning) eficiente para LLMs usando LoRA (Low-Rank Adaptation), diretamente pela interface web do text-generation-webui, sem necessidade de programar.
- **Ferramenta:** [text-generation-webui](https://github.com/oobabooga/text-generation-webui)
- **Guia:** [LoRA Training Guide (Wiki)](https://github.com/oobabooga/text-generation-webui/wiki/LoRA-Training-Guide)
- **Como funciona:**
  1. Prepare um dataset simples (JSONL) com exemplos de perguntas/respostas ou textos desejados.
  2. Ative o plugin LoRA na interface do text-generation-webui.
  3. Configure o treinamento (modelo base, dataset, parâmetros) e inicie o fine-tuning.
  4. O LoRA treinado pode ser carregado junto ao modelo base para customização de respostas.
- **Por que usar:**
  - Permite ensinar o modelo a responder com seu próprio estilo, dados ou domínio.
  - Processo visual, rápido e 100% local/self-hosted.
  - Ideal para customização leve, sem necessidade de hardware de alto desempenho.

## 10. **Hollama**
- **Descrição:** App minimalista de chat LLM que roda no navegador, desktop ou self-hosted, com suporte a múltiplos servidores Ollama e OpenAI. Permite baixar modelos do Ollama pela interface, alternar entre servidores locais e remotos, e gerenciar sessões sem precisar de Docker Swarm ou orquestrador.
- **Link:** [Hollama GitHub](https://github.com/fmaclen/hollama)
- **Instalação:**
  - Baixe o app para seu sistema operacional nas [releases](https://github.com/fmaclen/hollama/releases), ou rode via Docker/self-hosted (ver [SELF_HOSTING.md](https://github.com/fmaclen/hollama/blob/main/SELF_HOSTING.md)).
- **Documentação:** [README.md](https://github.com/fmaclen/hollama/blob/main/README.md)
- **Por que usar:**
  - Gerencia múltiplos servidores Ollama (local e remoto) via interface gráfica.
  - Baixa modelos do Ollama Registry direto pela UI, sem terminal.
  - Alterna entre instâncias de Ollama facilmente, sem editar arquivos de configuração.
  - Elimina a necessidade de Docker Swarm/Kubernetes para uso multi-máquina.
  - Ideal para times, experimentação e ambientes híbridos.

## 11. **ModelFusion**
- **Descrição:** Camada de integração e orquestração vendor-neutral para LLMs e modelos multimodais em TypeScript/JavaScript. Permite criar scripts, agentes, bots, APIs e automações IA reutilizáveis, com tipagem forte, logging, observabilidade e suporte a múltiplos backends (Ollama, OpenAI, text-generation-webui, etc.).
- **Link:** [ModelFusion Guide](https://modelfusion.dev/guide/)
- **Instalação:**
  ```bash
  npm install modelfusion
  ```
- **Documentação:** [ModelFusion Docs](https://modelfusion.dev/guide/)
- **Por que usar:**
  - Substitui integrações manuais com APIs LLM em TS/JS, padronizando o acesso a múltiplos backends.
  - Permite criar automações, agentes, bots e pipelines IA com controle total, modularidade e robustez.
  - Logging, retries, observabilidade e tipagem forte nativos.
  - Ideal para times que valorizam rastreabilidade, versionamento e evolução incremental.
- **Nota:**
  - **ModelFusion pode substituir o LangChain.js** para a maioria dos casos de uso em TypeScript/JavaScript (integração, automação, bots, APIs, scripts reutilizáveis).
  - **LangChain.js torna-se opcional**, recomendado apenas para casos de chains, agentes ou pipelines RAG complexos já existentes ou desejados.
  - **Wrappers manuais de API LLM em TS/JS podem ser removidos** do stack, pois ModelFusion centraliza e padroniza essa camada.

## 12. **Open Interpreter**
- **Descrição:** Ferramenta que permite que modelos de linguagem executem código e interajam com o computador via linguagem natural. Interface tipo ChatGPT no terminal, com automação de tarefas, manipulação de arquivos, controle de apps, análise de dados, integração com navegador, etc.
- **Link:** [Open Interpreter Docs](https://docs.openinterpreter.com/getting-started/introduction)
- **Instalação:**
  ```bash
  pip install open-interpreter
  interpreter
  ```
- **Documentação:** [Open Interpreter Docs](https://docs.openinterpreter.com/getting-started/introduction)
- **Por que usar:**
  - Permite automação avançada via linguagem natural, sem programar cada fluxo.
  - Executa código, manipula arquivos, controla apps e integra com LLMs locais/cloud (Ollama, OpenAI, etc.).
  - Pode ser usado como backend para bots, automações, agentes e pipelines do ALIVE/Slice.
  - Facilita experimentação, prototipagem e integração de IA com infraestrutura real.

---

> Este stack permite criar pipelines multi-agente, versionados, auditáveis e integrados ao ecossistema MCP, com automação total, rastreabilidade e flexibilidade máxima para evolução incremental do ALIVE/Slice.
