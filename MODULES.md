# MODULES.md

> Este arquivo serve como referência central para os módulos do ecossistema Slice.
> Aqui serão documentados os módulos existentes, suas responsabilidades, padrões de implementação e exemplos oficiais.

## Estrutura sugerida

- Nome do módulo
- Descrição
- Responsabilidades
- Padrão de implementação
- Exemplo oficial (link para @/examples)
- Observações

---

### Módulo: Model Provider API Gateway (Super Ollama)

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

### Módulo: Code Executor (Open Interpreter)

- **Descrição:**
  - Responsável por executar, gerar e manipular código automaticamente dentro de VMs, containers ou ambientes controlados, a partir de comandos em linguagem natural ou prompts estruturados.
- **Responsabilidades:**
  - Receber instruções (prompt, tarefa, script) e executar código real no ambiente alvo.
  - Manipular arquivos, instalar dependências, rodar scripts, controlar apps e automatizar tarefas de desenvolvimento ou manutenção.
  - Integrar com LLMs locais/cloud (Ollama, OpenAI, etc.) para geração e explicação de código.
  - Garantir rastreabilidade, logs e segurança das execuções.
- **Ferramenta principal:**
  - [Open Interpreter](https://docs.openinterpreter.com/getting-started/introduction)
- **Observações:**
  - Ferramenta já validada e aprovada para o ecossistema.
  - Caso surja alternativa superior, pode ser reavaliado, mas hoje é o padrão.
  - Adaptar integração para garantir compatibilidade com o restante do pipeline Slice/ALIVE.

### Módulo: Agent Creation & Orchestration (ModelFusion)

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

### Módulo: CONSOLE (Painel de Governança e Controle)

- **Descrição:**
  - Interface gráfica central para gerenciar, monitorar e orquestrar todo o ecossistema Slice/ALIVE.
  - Inspirado em IDEs modernas, permite múltiplas janelas (windows), dashboards por projeto e visão geral do ecossistema.
  - Organiza e abstrai recursos de ferramentas como text-generation-webui, mas com arquitetura, UX e governança próprias.
- **Responsabilidades:**
  - Exibir dashboards individuais para cada projeto e um dashboard geral do ecossistema.
  - Permitir abertura de múltiplas janelas para diferentes contextos: agentes, logs, storage, automações, alertas, etc.
  - Integrar e orquestrar todos os módulos do Slice/ALIVE, expondo dados e controles relevantes.
  - Oferecer console central para comandos, automações, troubleshooting e logs em tempo real.
  - Priorizar personalização, paralelismo real e redução da carga cognitiva do usuário.
- **Ferramentas e Estratégias:**
  - Frontend React (com backend Node/TS) para máxima flexibilidade, integração e evolução incremental.
  - Abstração de recursos de ferramentas como text-generation-webui, aproveitando componentes e APIs úteis, mas sempre organizando conforme as necessidades do Slice/ALIVE.
  - Sistema de janelas dinâmicas, dashboards customizáveis e integração nativa com todos os módulos.
- **Observações:**
  - O painel será construído incrementalmente, sempre priorizando o que é mais crítico para a governança e automação do ecossistema.
  - Nenhuma solução pronta entrega a flexibilidade e rastreabilidade necessárias — por isso, a arquitetura será própria e evolutiva.
  - Possibilidade de reutilizar/adaptar código de projetos open source, desde que sob licença compatível.

### Módulo: RIA (Recursos IA — RH Digital de Agentes/Modelos)

- **Descrição:**
  - Módulo responsável por gerenciar o ciclo de vida dos agentes/modelos IA como "funcionários digitais" do ecossistema Slice/ALIVE.
  - Atua como RH digital: contratação, onboarding, treinamento, certificação, gestão de carreira, auditoria e desligamento de agentes/modelos.
- **Responsabilidades:**
  - **Contratação:** Validar, aprovar e registrar novos modelos/agentes no ecossistema.
  - **Onboarding:** Treinar modelos para o contexto da empresa, aplicar certificações técnicas, garantir aderência a documentos/processos internos (ex: RAD).
  - **Gestão:** Acompanhar desempenho, histórico, certificações, promoções, desligamentos, etc.
  - **Auditoria:** Validar logs, rastrear decisões, garantir conformidade e evolução incremental.
  - Integrar-se ao Model Provider API Gateway para consumir, ativar/desativar e gerenciar recursos IA conforme a demanda (ex: subir modelo de dados sintéticos apenas quando necessário).
- **Desafios Técnicos:**
  - Integração com pipelines de treinamento, validação e certificação.
  - Registro e versionamento de perfis, logs, certificações e histórico de cada agente/modelo.
  - Automação de processos de onboarding, treinamento e avaliação.
  - Interface para RH/gestão de IA, com fluxos próprios (contratação, promoção, desligamento, etc.).
- **Observações:**
  - O RIA não expõe modelos diretamente: consome e gerencia recursos disponibilizados pelo Model Provider API Gateway.
  - Permite governança fina sobre quais modelos/agentes estão ativos, disponíveis ou em processo de treinamento/certificação.
  - Garante rastreabilidade, conformidade e evolução incremental dos recursos IA do ecossistema.

### Módulo: Manicômio (Observabilidade, Rastreamento e Experimentação Segura de Agentes IA)

- **Descrição:**
  - Núcleo dedicado à rastreabilidade, observabilidade e experimentação controlada de agentes IA, modelos e automações, garantindo que todo agente já nasça rastreável, auditável e seguro por padrão.
  - Serve como "sandbox" e laboratório de testes, validação, stress e auditoria de agentes antes de serem promovidos para produção ou integração com outros módulos Slice/ALIVE.

- **Responsabilidades:**
  - Instrumentar e monitorar todos os agentes criados via ModelFusion, garantindo logging detalhado, tracing, versionamento e auditoria desde o nascimento do agente.
  - Integrar nativamente o Opik (SDK TypeScript) para logging, tracing, avaliação automática (LLM as a Judge), anotação e dashboards de produção.
  - Permitir experimentação segura: simular ataques, edge cases, comportamentos inesperados e validar limites de cada agente/modelo.
  - Facilitar a coleta de métricas de custo, latência, uso de tokens, erros, feedback humano e automações de avaliação.
  - Garantir que todo agente/modelo só avance para produção após passar por ciclos de validação, rastreamento e auditoria no Manicômio.
  - Expor APIs e dashboards para consulta de histórico, logs, avaliações e status de cada agente.

- **Padrão de Implementação:**
  - Toda criação/orquestração de agentes via ModelFusion já nasce instrumentada com Opik, sem necessidade de configuração manual adicional.
  - Utilizar decorators, middlewares ou wrappers para garantir que cada agente/modelo seja automaticamente logado, rastreado e avaliado.
  - Integrar com o restante do ecossistema Slice/ALIVE via APIs e eventos, permitindo governança e automação incremental.

- **Sinergia ModelFusion + Opik:**
  - ModelFusion oferece flexibilidade máxima para criação e orquestração de agentes em TypeScript, sem impor padrões rígidos.
  - Opik complementa com rastreabilidade, observabilidade, avaliação automática e dashboards, tornando cada agente "auditável by design".
  - A integração permite que todo agente criado já seja monitorado, avaliado e versionado desde o primeiro ciclo de vida, facilitando debugging, auditoria e evolução incremental.

- **Exemplo oficial:**
  - [Exemplo de integração ModelFusion + Opik para agentes rastreáveis](@/examples/manicomio-agent-tracing.ts)

- **Observações:**
  - O Manicômio é o "laboratório de segurança" do Slice/ALIVE: todo agente/modelo passa por ele antes de ser liberado para produção.
  - Permite simular cenários adversos, ataques, edge cases e validar resiliência dos agentes.
  - Garante cultura de rastreabilidade, explicabilidade e governança desde o nascimento dos agentes IA.

### Módulo: Banco Vetorial (pgvector)

- **Descrição:**
  - Módulo responsável por prover indexação, busca semântica e armazenamento vetorial para pipelines RAG, fine-tuning supervisionado, deduplicação e auditoria de contexto no ecossistema Slice/ALIVE.

- **Responsabilidades:**
  - Armazenar embeddings de documentos, exemplos, logs, contextos e outputs de agentes/modelos.
  - Expor APIs para indexação, busca, atualização e deleção de vetores.
  - Integrar com pipelines RAG (ModelFusion, LangChain, LlamaIndex, etc.) e com o gateway de modelos para fornecer contexto relevante a agentes e LLMs.
  - Permitir versionamento, auditoria e rastreabilidade dos dados indexados.
  - Suportar múltiplos projetos, agentes e domínios de forma isolada e segura.

- **Padrão de Implementação:**
  - Usar [pgvector](https://github.com/pgvector/pgvector) como extensão do PostgreSQL.
  - Expor endpoints REST/gRPC para integração com outros módulos e pipelines.
  - Scripts e automações para ingestão e atualização incremental de documentos/contextos.
  - Permitir integração plugável com pipelines RAG em ModelFusion, LangChain, LlamaIndex, etc.

- **Exemplo oficial:**
  - [Exemplo de integração ModelFusion + pgvector para RAG](@/examples/rag-modelfusion-pgvector.ts)

- **Observações:**
  - O banco vetorial pode ser compartilhado entre múltiplos agentes/modelos e pipelines.
  - Permite auditoria, explicabilidade e versionamento incremental das bases de conhecimento e contexto dos agentes.
