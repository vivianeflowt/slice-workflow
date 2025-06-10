# 🗃️ Banco Vetorial (pgvector)

## 📝 Descrição
Módulo responsável por prover indexação, busca semântica e armazenamento vetorial para pipelines RAG, fine-tuning supervisionado, deduplicação e auditoria de contexto no ecossistema Slice/ALIVE.

## 📋 Responsabilidades
- Armazenar embeddings de documentos, exemplos, logs, contextos e outputs de agentes/modelos.
- Expor APIs para indexação, busca, atualização e deleção de vetores.
- Integrar com pipelines RAG (ModelFusion, LangChain, LlamaIndex, etc.) e com o gateway de modelos para fornecer contexto relevante a agentes e LLMs.
- Permitir versionamento, auditoria e rastreabilidade dos dados indexados.
- Suportar múltiplos projetos, agentes e domínios de forma isolada e segura.

## 🛠️ Padrão de Implementação
- Usar [pgvector](https://github.com/pgvector/pgvector) como extensão do PostgreSQL.
- Expor endpoints REST/gRPC para integração com outros módulos e pipelines.
- Scripts e automações para ingestão e atualização incremental de documentos/contextos.
- Permitir integração plugável com pipelines RAG em ModelFusion, LangChain, LlamaIndex, etc.

## 🧪 Exemplo oficial
- [Exemplo de integração ModelFusion + pgvector para RAG](@/examples/rag-modelfusion-pgvector.ts)

## 💡 Observações
- O banco vetorial pode ser compartilhado entre múltiplos agentes/modelos e pipelines.
- Permite auditoria, explicabilidade e versionamento incremental das bases de conhecimento e contexto dos agentes.

---

## 🧩 Ferramentas de terceiros utilizadas e features

### 🗃️ pgvector
- 🔗 Repositório: https://github.com/pgvector/pgvector
- 📄 Licença: https://github.com/pgvector/pgvector/blob/master/LICENSE
- 🚀 Feature: Extensão PostgreSQL para armazenamento e busca vetorial, integração nativa com pipelines RAG, versionamento e auditoria de embeddings.

### 🧬 ModelFusion
- 🔗 Repositório: https://github.com/modelfusion/modelfusion
- 📄 Licença: https://github.com/modelfusion/modelfusion/blob/main/LICENSE
- 🚀 Feature: Framework para integração de pipelines RAG, ingestão e consulta de embeddings no banco vetorial.

### 🌐 LangChain
- 🔗 Repositório: https://github.com/langchain-ai/langchain
- 📄 Licença: https://github.com/langchain-ai/langchain/blob/master/LICENSE
- 🚀 Feature: Framework alternativo para pipelines RAG, integração com bancos vetoriais e múltiplos backends.

### 🦙 Ollama
- 🔗 Repositório: https://github.com/ollama/ollama
- 📄 Licença: https://github.com/ollama/ollama/blob/main/LICENSE
- 🚀 Feature: Backend LLM local, integração com pipelines RAG para geração aumentada por recuperação.

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

- **Padrão de Implementação:**
  - Backend em TypeScript/Node.js, integrando-se ao Model Provider API Gateway.
  - Banco de dados para registro de perfis, logs, certificações e histórico.
  - APIs para automação de onboarding, avaliação e gestão de agentes/modelos.
  - Integração com sistemas de autenticação, auditoria e automação do ecossistema.

- **Exemplo oficial:**
  - [Exemplo de fluxo de onboarding e certificação de agente IA](@/examples/ria-onboarding-certification.ts)

- **Observações:**
  - O RIA não expõe modelos diretamente: consome e gerencia recursos disponibilizados pelo Model Provider API Gateway.
  - Permite governança fina sobre quais modelos/agentes estão ativos, disponíveis ou em processo de treinamento/certificação.
  - Garante rastreabilidade, conformidade e evolução incremental dos recursos IA do ecossistema.
