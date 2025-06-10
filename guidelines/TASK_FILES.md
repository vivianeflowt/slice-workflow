# 📚 @slices - Guia de Taskfile

Este documento define o padrão oficial de Taskfile para todos os projetos do ecossistema Slice — tanto aplicações quanto stacks de infraestrutura.

---

## 🎯 Objetivo

- Garantir automação, padronização e experiência visual consistente.
- Facilitar onboarding, manutenção e automação por IA.
- Todo projeto **deve** ter um Taskfile seguindo este padrão.

---

## 🧩 Estrutura Geral

- Use ícones e descrições claras para cada task.
- Sempre inclua uma task `help` com descrição dos comandos.
- Tasks obrigatórias para **aplicações** e **infraestrutura** estão listadas abaixo.

---

## 🛠️ Tasks obrigatórias (aplicações)

```yaml
version: '3'
tasks:
  install:
    desc: "🔧 Instala dependências"
    cmds:
      - yarn install || npm install
  build:
    desc: "🏗️ Build do projeto"
    cmds:
      - npx tsc
  start:
    desc: "🚀 Inicia produção"
    cmds:
      - node dist/index.js
  dev:
    desc: "🛠️ Inicia modo dev (hot reload)"
    cmds:
      - npx tsx src/index.ts
  test:
    desc: "🧪 Testes"
    cmds:
      - npx vitest run
  lint:
    desc: "🧹 Lint"
    cmds:
      - npx eslint src --ext .ts,.tsx
  format:
    desc: "🎨 Formatador"
    cmds:
      - npx prettier --write src
  clean:
    desc: "🗑️ Limpa build"
    cmds:
      - rm -rf dist
  logs:
    desc: "📜 Logs"
    cmds:
      - tail -f logs/*.log
  shell:
    desc: "🐚 Shell no container"
    cmds:
      - docker exec -it <container> sh
  help:
    desc: "🆘 Ajuda"
    cmds:
      - echo "\nComandos disponíveis:\n"
      - echo "  🔧  install   - Instala dependências"
      - echo "  🏗️   build     - Build do projeto"
      - echo "  🚀  start     - Inicia produção"
      - echo "  🛠️   dev       - Inicia modo dev (hot reload)"
      - echo "  🧪  test      - Executa testes"
      - echo "  🧹  lint      - Lint do código"
      - echo "  🎨  format    - Formata o código"
      - echo "  🗑️   clean     - Limpa build"
      - echo "  📜  logs      - Mostra logs"
      - echo "  🐚  shell     - Shell no container (docker)"
      - echo "  🆘  help      - Mostra esta ajuda\n"
```

---

## 🏗️ Tasks obrigatórias (infraestrutura/stacks)

```yaml
version: '3'
tasks:
  up:
    desc: "🚀 Sobe stack"
    cmds:
      - docker stack deploy -c ${STACK_FILE} ${STACK_NAME}
  down:
    desc: "🗑️ Remove stack"
    cmds:
      - docker stack rm ${STACK_NAME}
  deploy:
    desc: "🔄 Deploy (alias para up)"
    cmds:
      - task: up
      - echo "Stack ${STACK_NAME} atualizado."
  logs:
    desc: "📜 Logs"
    cmds:
      - docker service logs $(docker stack services --format '{{.Name}}' ${STACK_NAME}) --follow --tail=100
  ps:
    desc: "👀 Status dos containers"
    cmds:
      - docker stack ps ${STACK_NAME}
  config:
    desc: "⚙️ Valida config"
    cmds:
      - docker stack config -c ${STACK_FILE}
  restart:
    desc: "♻️ Reinicia serviços"
    cmds:
      - docker service update --force $(docker stack services --format '{{.Name}}' ${STACK_NAME})
  pull:
    desc: "⬇️ Atualiza imagens"
    cmds:
      - docker compose -f ${STACK_FILE} pull
  status:
    desc: "📊 Status dos serviços"
    cmds:
      - docker stack services ${STACK_NAME}
  shell:
    desc: "🐚 Shell no container principal"
    cmds:
      - docker exec -it $(docker ps -q -f name=${STACK_NAME}) sh || echo 'Container não está rodando.'
  prune:
    desc: "🧹 Limpa recursos parados/prune"
    cmds:
      - docker system prune -f
  help:
    desc: "🆘 Ajuda"
    cmds:
      - echo "\nComandos disponíveis para stack ${STACK_NAME}:\n"
      - echo "  🚀  up        - Sobe stack"
      - echo "  🗑️   down      - Remove stack"
      - echo "  🔄  deploy    - Deploy/atualiza stack"
      - echo "  📜  logs      - Logs dos serviços"
      - echo "  👀  ps        - Status dos containers"
      - echo "  ⚙️   config    - Valida config"
      - echo "  ♻️   restart   - Reinicia serviços"
      - echo "  ⬇️   pull      - Atualiza imagens"
      - echo "  📊  status    - Status dos serviços"
      - echo "  🐚  shell     - Shell no container"
      - echo "  🧹  prune     - Limpa recursos parados"
      - echo "  🆘  help      - Mostra esta ajuda\n"
```

---

## 📝 Recomendações

- Adapte tasks extras conforme a stack/projeto.
- Use sempre ícones e descrições claras.
- A task `help` deve ser sempre o default.
- Mantenha o Taskfile na raiz do projeto/pacote/stack.
- Para projetos multi-stack, cada stack deve ter seu próprio Taskfile.

---

**Siga este padrão para garantir automação, rastreabilidade e padronização em todo o ecossistema Slice.**
