# 📦 Gestão de Projetos + CI/CD Integrado (Gitea + Woodpecker)

## 📝 Descrição
Módulo unificado que provê gestão de projetos (issues, boards Kanban, backlog, sprints, milestones, releases, pull requests) e automação CI/CD (pipelines, builds, deploys, testes) de forma 100% self-hosted, open source e integrada ao Console central do Slice/ALIVE. Baseado em Gitea (git, issues, boards, wiki, releases) e Woodpecker (pipelines CI/CD), com possibilidade de integração com Kanboard/Taiga para fluxos avançados de backlog/sprints.

## 📋 Responsabilidades
- Gerenciar repositórios git, controle de versão e colaboração de código.
- Organizar backlog, sprints, tarefas, discussões, releases e boards Kanban customizáveis.
- Automatizar pipelines CI/CD: build, teste, deploy, integração com outros módulos.
- Garantir rastreabilidade total: cada tarefa, commit, build e release vinculado ao fluxo de projeto.
- Expor API e webhooks para integração com o Console central, bots, dashboards e automações Slice/ALIVE.
- Permitir customização total do fluxo Kanban, backlog e automações conforme a cultura do time.

## 🛠️ Padrão de Implementação
- Usar Gitea para gestão de repositórios, issues, boards, releases e colaboração.
- Usar Woodpecker para automação CI/CD, pipelines, builds e deploys.
- Integração plugável com Kanboard, Taiga ou outras ferramentas para fluxos avançados.
- Scripts e automações para onboarding, backup e manutenção dos serviços.

## 💡 Diferenciais
- 100% open source (MIT/Apache 2.0), sem pegadinhas, lock-in ou limitações comerciais.
- Self-hosted, seguro, privacidade total dos dados e pipelines.
- Plug-and-play: Makefile, Docker, scripts, fácil de instalar, manter e evoluir.
- Extensível: integra com Kanboard, Taiga, scripts, bots, pipelines externos.
- Alinhado com os princípios Slice: modularidade, automação, rastreabilidade, documentação viva.

---

## 🧩 Ferramentas de terceiros utilizadas e features

### 🐙 Gitea
- 🔗 Repositório: https://github.com/go-gitea/gitea
- 📄 Licença: https://github.com/go-gitea/gitea/blob/main/LICENSE
- 🚀 Feature: Gestão de repositórios git, issues, boards Kanban, releases, colaboração e integração com CI/CD.

### 🐦 Woodpecker
- 🔗 Repositório: https://github.com/woodpecker-ci/woodpecker
- 📄 Licença: https://github.com/woodpecker-ci/woodpecker/blob/main/LICENSE
- 🚀 Feature: Automação CI/CD, pipelines, builds, deploys, integração com Gitea e outros sistemas de versionamento.

### 🗂️ Kanboard (opcional)
- 🔗 Repositório: https://github.com/kanboard/kanboard
- 📄 Licença: https://github.com/kanboard/kanboard/blob/main/LICENSE
- 🚀 Feature: Boards Kanban avançados, integração opcional para fluxos de backlog/sprints.

### 🐯 Taiga (opcional)
- 🔗 Repositório: https://github.com/taigaio/taiga-back
- 📄 Licença: https://github.com/taigaio/taiga-back/blob/main/LICENSE
- 🚀 Feature: Gestão de projetos ágeis, sprints, backlog, integração opcional para times avançados.

---

## 🧩 Ferramentas de terceiros utilizadas e features

### 🐙 Gitea
- 🔗 Repositório: https://github.com/go-gitea/gitea
- 📄 Licença: https://github.com/go-gitea/gitea/blob/main/LICENSE
- 🚀 Feature: Gestão de repositórios git, issues, boards Kanban, releases, colaboração e integração com CI/CD.

### 🐦 Woodpecker
- 🔗 Repositório: https://github.com/woodpecker-ci/woodpecker
- 📄 Licença: https://github.com/woodpecker-ci/woodpecker/blob/main/LICENSE
- 🚀 Feature: Automação CI/CD, pipelines, builds, deploys, integração com Gitea e outros sistemas de versionamento.

### 🗂️ Kanboard (opcional)
- 🔗 Repositório: https://github.com/kanboard/kanboard
- 📄 Licença: https://github.com/kanboard/kanboard/blob/main/LICENSE
- 🚀 Feature: Boards Kanban avançados, integração opcional para fluxos de backlog/sprints.

### 🐯 Taiga (opcional)
- 🔗 Repositório: https://github.com/taigaio/taiga-back
- 📄 Licença: https://github.com/taigaio/taiga-back/blob/main/LICENSE
- 🚀 Feature: Gestão de projetos ágeis, sprints, backlog, integração opcional para times avançados.
