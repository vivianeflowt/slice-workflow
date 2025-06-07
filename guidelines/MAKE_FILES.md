# 📚 @slices - Guia de Makefiles

Este documento define o padrão oficial de Makefile para todos os projetos do ecossistema Slice — tanto aplicações quanto stacks de infraestrutura.

---

## 🎯 Objetivo

- Garantir automação, padronização e experiência visual consistente.
- Facilitar onboarding, manutenção e automação por IA.
- Todo projeto **deve** ter um Makefile seguindo este padrão.

---

## 🧩 Estrutura Geral

- Use ícones para clareza e UX.
- Sempre inclua um comando `help` com descrição dos comandos.
- Comandos obrigatórios para **aplicações** e **infraestrutura** estão listados abaixo.

---

## 🛠️ Comandos obrigatórios (aplicações)

```makefile
.DEFAULT_GOAL := help

.PHONY: build start dev test lint format clean install logs shell help

## 🔧 Instala dependências
install:
	# Exemplo: yarn install || npm install

## 🏗️ Build do projeto
build:
	# Exemplo: npx tsc

## 🚀 Inicia produção
start:
	# Exemplo: node dist/index.js

## 🛠️ Inicia modo dev (hot reload)
dev:
	# Exemplo: npx tsx src/index.ts

## 🧪 Testes
test:
	# Exemplo: npx vitest run

## 🧹 Lint
lint:
	# Exemplo: npx eslint src --ext .ts,.tsx

## 🎨 Formatador
format:
	# Exemplo: npx prettier --write src

## 🗑️ Limpa build
clean:
	# Exemplo: rm -rf dist

## 📜 Logs
logs:
	# Exemplo: tail -f logs/*.log

## 🐚 Shell no container
shell:
	# Exemplo: docker exec -it <container> sh

## 🆘 Ajuda
help:
	@echo "\n\033[1mComandos disponíveis:\033[0m\n"
	@echo "  🔧  install   - Instala dependências"
	@echo "  🏗️   build     - Build do projeto"
	@echo "  🚀  start     - Inicia produção"
	@echo "  🛠️   dev       - Inicia modo dev (hot reload)"
	@echo "  🧪  test      - Executa testes"
	@echo "  🧹  lint      - Lint do código"
	@echo "  🎨  format    - Formata o código"
	@echo "  🗑️   clean     - Limpa build"
	@echo "  📜  logs      - Mostra logs"
	@echo "  🐚  shell     - Shell no container (docker)"
	@echo "  🆘  help      - Mostra esta ajuda\n"
```

---

## 🏗️ Comandos obrigatórios (infraestrutura/stacks)

```makefile
.DEFAULT_GOAL := help

STACK_NAME=nome_do_stack
STACK_FILE=stack.yml

.PHONY: up down deploy logs ps config restart pull status shell prune help
S
## 🚀 Sobe stack
up:
	docker stack deploy -c $(STACK_FILE) $(STACK_NAME)

## 🗑️ Remove stack
down:
	docker stack rm $(STACK_NAME)

## 🔄 Deploy (alias para up)
deploy: up
	@echo "Stack $(STACK_NAME) atualizado."

## 📜 Logs
logs:
	docker service logs $$(docker stack services --format '{{.Name}}' $(STACK_NAME)) --follow --tail=100

## 👀 Status dos containers
ps:
	docker stack ps $(STACK_NAME)

## ⚙️ Valida config
config:
	docker stack config -c $(STACK_FILE)

## ♻️ Reinicia serviços
restart:
	docker service update --force $$(docker stack services --format '{{.Name}}' $(STACK_NAME))

## ⬇️ Atualiza imagens
pull:
	docker compose -f $(STACK_FILE) pull

## 📊 Status dos serviços
status:
	docker stack services $(STACK_NAME)

## 🐚 Shell no container principal
shell:
	docker exec -it $$(docker ps -q -f name=$(STACK_NAME)) sh || echo 'Container não está rodando.'

## 🧹 Limpa recursos parados/prune
prune:
	docker system prune -f

## 🆘 Ajuda
help:
	@echo "\n\033[1mComandos disponíveis para stack $(STACK_NAME):\033[0m\n"
	@echo "  🚀  up        - Sobe stack"
	@echo "  🗑️   down      - Remove stack"
	@echo "  🔄  deploy    - Deploy/atualiza stack"
	@echo "  📜  logs      - Logs dos serviços"
	@echo "  👀  ps        - Status dos containers"
	@echo "  ⚙️   config    - Valida config"
	@echo "  ♻️   restart   - Reinicia serviços"
	@echo "  ⬇️   pull      - Atualiza imagens"
	@echo "  📊  status    - Status dos serviços"
	@echo "  🐚  shell     - Shell no container"
	@echo "  🧹  prune     - Limpa recursos parados"
	@echo "  🆘  help      - Mostra esta ajuda\n"
```

---

## 📝 Recomendações

- Adapte comandos extras conforme a stack/projeto.
- Use sempre ícones e descrições claras.
- O comando `help` deve ser sempre o default.
- Mantenha o Makefile na raiz do projeto/pacote/stack.
- Para projetos multi-stack, cada stack deve ter seu próprio Makefile.

---

**Siga este padrão para garantir automação, rastreabilidade e padronização em todo o ecossistema Slice.**
