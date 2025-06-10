# Model Provider API Gateway (Super Ollama)

- **Descrição:**
  - Gateway centralizado e extensível que provisiona, gerencia e expõe modelos diversos (LLMs, modelos de visão, etc.) de forma rápida, padronizada e compatível com a API do OpenAI.
  - Atua como "ponte" e orquestrador entre múltiplos backends (Ollama, HuggingFace, vLLM, text-generation-webui, etc.), abstraindo diferenças e centralizando operações administrativas e de inferência.

- **Responsabilidades:**
  - Instalar, mover, duplicar, deletar, ativar/desativar e listar modelos via API/CLI centralizada, inclusive em múltiplas máquinas.
  - Gerenciar múltiplas instâncias/versões: permitir diferentes versões/modelos disponíveis simultaneamente, inclusive para testes A/B, staging e produção.
  - Encapsular comandos e paths de cada backend, abstraindo detalhes de instalação, armazenamento e execução (ex: CLI do Ollama, scripts Python, containers, etc.).
  - Gerenciar recursos multi-máquina: decidir onde rodar cada modelo (CPU/GPU, máquina 1 ou 2), balancear carga e otimizar uso de hardware.
  - Expor endpoints REST padronizados: garantir compatibilidade total com clientes OpenAI (ex: chat/completions, embeddings, etc.).
  - Permitir operações administrativas (instalar, mover, deletar, ativar/desativar modelos) via API/CLI centralizada.
  - Integrar módulos plugáveis para fine-tuning (LoRA, etc.) e RAG (indexação, busca, injeção de contexto).
  - Automação e rapidez: permitir que novos modelos sejam adicionados, removidos ou atualizados rapidamente, com mínimo downtime.
  - Observabilidade e logs: integrar com módulos de rastreabilidade (ex: Opik) para logging, tracing, métricas de uso, custos e incidentes.
  - Interface de administração: expor APIs ou UI para listar, ativar/desativar, atualizar e monitorar modelos disponíveis.

- **Padrão de Implementação:**
  - Backend em TypeScript/Node.js, com arquitetura modular e plugável para suportar múltiplos providers e agentes remotos.
  - Adaptação de payloads e respostas para garantir compatibilidade OpenAI.
  - Scripts e automações para instalação rápida de modelos (ex: download, setup, healthcheck), inclusive via CLI remota.
  - Integração com sistemas de autenticação, rate limiting, segurança e automação (CI/CD, scripts, etc.).
  - Plugins/adapters para cada backend (Ollama, HuggingFace, vLLM, etc.), encapsulando comandos e paths.
  - Banco de dados/registro central para saber onde está cada modelo, status, logs, etc.
  - Integração plugável com módulos de fine-tuning e RAG (pode usar libs Python via subprocess, containers, etc.).

- **Exemplo oficial:**
  - [Exemplo de provisionamento e exposição de modelo HuggingFace via API OpenAI-like](@/examples/model-provider-hf-openai.ts)

- **Observações:**
  - O módulo não gerencia ciclo de vida experimental (isso é papel do Manicômio), mas sim o provisionamento, orquestração e exposição de modelos prontos para uso.
  - Pode ser integrado com o RIA para ativação/desativação dinâmica de recursos IA conforme demanda do ecossistema.
  - Permite automação e integração fácil com scripts, CI/CD e outros módulos do Slice/ALIVE.
