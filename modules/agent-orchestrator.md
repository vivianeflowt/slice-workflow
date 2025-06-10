# 🤖 Agent Creation & Orchestration (ModelFusion)

## 📝 Descrição
Responsável por criar, orquestrar e gerenciar agentes IA, bots e automações reutilizáveis, com máxima flexibilidade e mínima imposição de regras/opiniões de framework.

## 📋 Responsabilidades
- Permitir a definição, configuração e execução de agentes de forma modular, tipada e rastreável.
- Integrar múltiplos backends (Ollama, OpenAI, text-generation-webui, etc.) de forma vendor-neutral.
- Facilitar logging, retries, observabilidade e versionamento dos agentes criados.
- Priorizar soluções flexíveis, pouco opinativas e facilmente adaptáveis ao contexto do projeto.
- Desenvolver uma UI própria para facilitar a criação, configuração e orquestração de agentes, superando limitações de UIs genéricas como a do LangChain e focando nas necessidades do ecossistema Slice/ALIVE.

## 🛠️ Padrão de Implementação
- Utilizar ModelFusion como framework principal para orquestração de agentes em TypeScript/JavaScript.
- Adaptação e integração com outros backends via plugins/adapters.
- Logging, retries e observabilidade nativos.
- UI própria para configuração e orquestração visual dos agentes.

## 🧪 Exemplo oficial
- [Exemplo de orquestração de agentes com ModelFusion](@/examples/agent-orchestrator-modelfusion.ts)

## 💡 Observações
- ModelFusion é preferido por não impor padrões rígidos como o LangChain, permitindo liberdade total de arquitetura.
- LangChain.js pode ser usado apenas em casos de chains ou pipelines RAG muito específicos.
- O módulo deve ser facilmente extensível e integrável com outros componentes do ecossistema Slice/ALIVE.
- Cada módulo pode demandar adaptações ou encapsulamentos específicos para se alinhar aos padrões, integrações e cultura do Slice/ALIVE.

---

## 🧩 Ferramentas de terceiros utilizadas e features

### 🧬 ModelFusion
- 🔗 Repositório: https://github.com/modelfusion/modelfusion
- 📄 Licença: https://github.com/modelfusion/modelfusion/blob/main/LICENSE
- 🚀 Feature: Framework flexível para criação e orquestração de agentes, integração com múltiplos backends, logging, retries e observabilidade nativos.

### 🦙 Ollama
- 🔗 Repositório: https://github.com/ollama/ollama
- 📄 Licença: https://github.com/ollama/ollama/blob/main/LICENSE
- 🚀 Feature: Backend LLM local, integração vendor-neutral via ModelFusion.

### 🌐 text-generation-webui
- 🔗 Repositório: https://github.com/oobabooga/text-generation-webui
- 📄 Licença: https://github.com/oobabooga/text-generation-webui/blob/main/LICENSE
- 🚀 Feature: Backend alternativo para agentes, integração via ModelFusion.

### 🤖 OpenAI
- 🔗 Repositório: https://github.com/openai/openai-python
- 📄 Licença: https://github.com/openai/openai-python/blob/main/LICENSE
- 🚀 Feature: Integração com API OpenAI para agentes, fallback cloud.
