# Agent Creation & Orchestration (ModelFusion)

- **Descrição:**
  - Responsável por criar, orquestrar e gerenciar agentes IA, bots e automações reutilizáveis, com máxima flexibilidade e mínima imposição de regras/opiniões de framework.
- **Responsabilidades:**
  - Permitir a definição, configuração e execução de agentes de forma modular, tipada e rastreável.
  - Integrar múltiplos backends (Ollama, OpenAI, text-generation-webui, etc.) de forma vendor-neutral.
  - Facilitar logging, retries, observabilidade e versionamento dos agentes criados.
  - Priorizar soluções flexíveis, pouco opinativas e facilmente adaptáveis ao contexto do projeto.
  - **Desenvolver uma UI própria** para facilitar a criação, configuração e orquestração de agentes, superando limitações de UIs genéricas como a do LangChain e focando nas necessidades do ecossistema Slice/ALIVE.
- **Ferramenta principal:**
  - [ModelFusion](https://modelfusion.dev/guide/) (TypeScript/JavaScript)
- **Observações:**
  - ModelFusion é preferido por não impor padrões rígidos como o LangChain, permitindo liberdade total de arquitetura.
  - LangChain.js pode ser usado apenas em casos de chains ou pipelines RAG muito específicos.
  - O módulo deve ser facilmente extensível e integrável com outros componentes do ecossistema Slice/ALIVE.
  - **Cada módulo pode demandar adaptações ou encapsulamentos específicos** para se alinhar aos padrões, integrações e cultura do Slice/ALIVE.
