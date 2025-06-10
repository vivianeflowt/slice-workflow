# 🧪 Manicômio (Observabilidade, Rastreamento e Experimentação Segura de Agentes IA)

## 📝 Descrição
Núcleo dedicado à rastreabilidade, observabilidade e experimentação controlada de agentes IA, modelos e automações, garantindo que todo agente já nasça rastreável, auditável e seguro por padrão. Serve como "sandbox" e laboratório de testes, validação, stress e auditoria de agentes antes de serem promovidos para produção ou integração com outros módulos Slice/ALIVE.

## 📋 Responsabilidades
- Instrumentar e monitorar todos os agentes criados via ModelFusion, garantindo logging detalhado, tracing, versionamento e auditoria desde o nascimento do agente.
- Integrar nativamente o Opik (SDK TypeScript) para logging, tracing, avaliação automática (LLM as a Judge), anotação e dashboards de produção.
- Permitir experimentação segura: simular ataques, edge cases, comportamentos inesperados e validar limites de cada agente/modelo.
- Facilitar a coleta de métricas de custo, latência, uso de tokens, erros, feedback humano e automações de avaliação.
- Garantir que todo agente/modelo só avance para produção após passar por ciclos de validação, rastreamento e auditoria no Manicômio.
- Expor APIs e dashboards para consulta de histórico, logs, avaliações e status de cada agente.

## 🛠️ Padrão de Implementação
- Toda criação/orquestração de agentes via ModelFusion já nasce instrumentada com Opik, sem necessidade de configuração manual adicional.
- Utilizar decorators, middlewares ou wrappers para garantir que cada agente/modelo seja automaticamente logado, rastreado e avaliado.
- Integrar com o restante do ecossistema Slice/ALIVE via APIs e eventos, permitindo governança e automação incremental.

## 🔗 Sinergia ModelFusion + Opik
- ModelFusion oferece flexibilidade máxima para criação e orquestração de agentes em TypeScript, sem impor padrões rígidos.
- Opik complementa com rastreabilidade, observabilidade, avaliação automática e dashboards, tornando cada agente "auditável by design".
- A integração permite que todo agente criado já seja monitorado, avaliado e versionado desde o primeiro ciclo de vida, facilitando debugging, auditoria e evolução incremental.

## 🧪 Exemplo oficial
- [Exemplo de integração ModelFusion + Opik para agentes rastreáveis](@/examples/manicomio-agent-tracing.ts)

## 💡 Observações
- O Manicômio é o "laboratório de segurança" do Slice/ALIVE: todo agente/modelo passa por ele antes de ser liberado para produção.
- Permite simular cenários adversos, ataques, edge cases e validar resiliência dos agentes.
- Garante cultura de rastreabilidade, explicabilidade e governança desde o nascimento dos agentes IA.

---

## 🧩 Ferramentas de terceiros utilizadas e features

### 🧬 ModelFusion
- 🔗 Repositório: https://github.com/modelfusion/modelfusion
- 📄 Licença: https://github.com/modelfusion/modelfusion/blob/main/LICENSE
- 🚀 Feature: Framework para criação e orquestração de agentes, integração com Opik para logging e tracing.

### 🧑‍💻 Opik
- 🔗 Repositório: https://github.com/opik-io/opik
- 📄 Licença: https://github.com/opik-io/opik/blob/main/LICENSE
- 🚀 Feature: SDK para logging, tracing, avaliação automática (LLM as a Judge), dashboards de produção e rastreabilidade de agentes IA.
