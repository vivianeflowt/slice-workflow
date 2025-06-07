# CONCEPTS.md — Princípios Norteadores do Ecossistema

> **Atenção:**
> Os conceitos aqui definidos são as leis fundamentais do ecossistema Slice.
> Só podem ser alterados em situações excepcionais, como:
> - Mudança estrutural relevante (ex: aumento de recursos, nova infraestrutura, entrada de investimento).
> - Descoberta de uma solução comprovadamente superior para o objetivo do conceito.
>
> **Nunca retrocedemos:**
> Mudanças só são aceitas se forem para melhorar, simplificar ou fortalecer o conceito.
> Nunca voltamos atrás para um estado menos robusto, menos flexível ou menos seguro.

## 1. Baixo Recurso & Custo Mínimo
- O projeto deve partir do princípio de que há **pouco recurso disponível** (financeiro e computacional).
- **Offline first:** Priorizar soluções que funcionem localmente, sem depender de cloud paga ou serviços externos.
- **Open source sempre que possível:** Ferramentas, frameworks e modelos devem ser open source, evitando lock-in e custos recorrentes.
- O máximo de dependência externa permitido é algo como Cursor IDE ou algumas MLLMs open source (ex: Phi, Mistral, etc.), mas sempre buscando o **menor custo possível**.
- **Restrições de hardware e orçamento** devem ser consideradas em toda decisão técnica.

> Este conceito é a base para todas as escolhas futuras: arquitetura, ferramentas, automação e até cultura do projeto.
>
#### LOCAL – workstation - 192.168.100.20 - Manager

- CPU: Intel Core i5-13400 (13ª geração), 16 threads, 10 núcleos, até 4.6 GHz
- RAM: 62 GB DDR4
- Disco:
  - /dev/sdb3 (root): 900 GB (152 GB usados)
    - **Observação:** Mesmo havendo espaço, o HD principal (root) deve ser mantido livre e só usado para trabalho temporário. Nada de produção ou dados finais aqui!
  - /dev/md0 (/media/data): 898 GB (699 GB usados)
    - **Espaço de produção real:** Todos os dados/projetos prontos devem ser movidos para cá.
  - /dev/sda1 (/mnt/backup): 932 GB (71 GB usados)
- GPU: NVIDIA GeForce RTX 4060, 8 GB VRAM, driver 570.133.07, CUDA 12.8

#### SERVIDOR – localcloud - 192.168.100.10 - Worker

- CPU: 2× Intel Xeon E5-2680 v4, 56 threads, 28 núcleos, até 2.4 GHz
- RAM: 62 GB DDR4
- Disco:
  - /dev/sda3 (root): 211 GB (17 GB usados)
    - **Observação:** Não usar para produção, apenas SO e temporários.
  - /dev/mapper/vg0-lv--0 (/media/data): 932 GB (18 GB usados)
    - **Espaço de produção real:** Dados/projetos finais vão para cá.
- GPU: AMD Radeon RX 580 2048SP (Polaris 20 XL), driver amdgpu, 8 GB VRAM

---

## 📦 Estratégia de Armazenamento
- **/media/data** em ambas as máquinas é o espaço de produção real.
- O HD do sistema operacional (root) só deve ser usado para trabalho temporário, nunca para dados finais.
- Isso garante reinstalação rápida do SO sem risco de perda de produção.

---

## 🛠️ Política de Trabalho: GitHub + Makefile
- **Todo código deve estar no GitHub** — versionamento, colaboração e rastreabilidade garantidos.
- **Reconstrução fácil:** Tudo deve ser facilmente reconstruído a partir do repositório, sem passos manuais obscuros.
- **Makefile é obrigatório e controla tudo:**
  - Instalação (`install`), desenvolvimento (`dev`), produção (`start`/`prod`), testes (`test`), limpeza (`clean`), logs, shell, etc.
  - O padrão de Makefile está definido em [MAKE_FILES.md](docs/MAKE_FILES.md) e deve ser seguido em todos os projetos/stacks.
- **Fluxo simples:**
  - Baixou do GitHub? Basta rodar o Makefile para instalar, rodar, testar, etc.
  - Se der ruim, basta clonar e reconstruir rapidamente — sem dependência de ambiente manual.
- **Qualquer projeto que não possa ser controlado 100% pelo Makefile está fora do padrão!**

---

## ❓ Pergunta para o usuário
- Algum outro diretório/dispositivo pode ser usado para produção, ou **/media/data** é a única fonte oficial?
- Como prefere organizar o fluxo de "trabalho temporário" vs. "produção final"?
- Quer automatizar a movimentação de arquivos do root para /media/data?
- Alguma política de backup/rotina para o HD externo ou Dropbox?


[CONCEITO] Flexibilidade e Adaptabilidade
> Toda escolha tecnológica do ecossistema Slice prioriza flexibilidade, modularidade e independência.
> Frameworks nunca serão preferidos em detrimento de bibliotecas.
> O objetivo é garantir que o stack seja sempre adaptável, resiliente e sob total controle da equipe.
>
> **Nota sobre IA Pythonzeira:**
> A IA Pythonzeira não entende de "mágica" de frameworks opinativos. Quanto mais explícito, modular e baseado em bibliotecas for o stack, mais fácil é automatizar, debugar e evoluir o sistema. Frameworks que impõem conceitos rígidos, convenções ocultas ou dependem de "injeção de dependência" dificultam a automação e a manutenção. O ecossistema Slice sempre prioriza stacks simples, transparentes e sob controle total da equipe e da IA Pythonzeira.

## [CONCEITO] Documentação de Padrão para Cada Aspecto

> **Para cada aspecto do ecossistema Slice (rotas, componentes, scripts, CI/CD, etc.), existe um documento de referência que define:**
> - O padrão oficial ("jeito certo")
> - Exemplos de uso
> - O que é proibido (anti-padrões)
> - Como validar (checklist, linter, testes)
>
> **Exemplo prático:**
> Se for criar um router no Express, existe um documento (ex: `docs/backend/routers.md`) que mostra:
> - Estrutura de arquivos e pastas
> - Como importar e exportar rotas
> - Como documentar endpoints
> - Como aplicar middlewares
> - Exemplo de código aprovado
> - Checklist de validação (prettier, linter, testes)

### Exemplo de estrutura para `docs/backend/routers.md`

[CONCEITO] Plug-and-Play Total para Módulos
> Todo módulo do ecossistema Slice deve ser totalmente plug-and-play.
> - Ao clonar/baixar o repositório, basta rodar o `make install` (ou comando padrão definido) e tudo deve funcionar automaticamente, sem necessidade de ajustes manuais, configurações extras ou gambiarras.
> - O Makefile é o único ponto de entrada para instalação, configuração, build, testes e execução do módulo.
> - Se o módulo exigir dependências do sistema operacional (Linux), o Makefile deve instalar/configurar tudo automaticamente.
> - Se não funcionar 100% plug-and-play, o módulo é rejeitado até ser corrigido.
> - Isso vale para todos os módulos: backend, frontend, automação, CI/CD, etc.
> - Garante reusabilidade, automação, rastreabilidade e facilidade de manutenção em todo o ecossistema.

[CONCEITO] Preferência por Bibliotecas Bem Tipadas e Flexíveis
> Sempre que possível, o ecossistema Slice deve adotar bibliotecas (como modelfusion) que sejam bem tipadas, flexíveis e não imponham acoplamento ou estrutura obrigatória.
> - Bibliotecas desse tipo permitem compor, integrar e adaptar fluxos e modelos conforme a necessidade, sem "mágica" ou dependência de plataforma.
> - O conector único do ecossistema deve ser implementado com essas bibliotecas, garantindo integração fácil, previsível e padronizada para todos os agentes (humanos, IA, automações).
> - Frameworks opinativos ou que impõem estrutura nunca serão preferidos em detrimento de bibliotecas modulares e tipadas.

[CONCEITO] Responsabilidade Única e Encapsulamento de Módulos
> Cada módulo do ecossistema Slice tem uma função clara, única e bem definida.
> - O módulo deve ser totalmente encapsulado: expõe apenas sua interface oficial, sem vazar detalhes internos ou dependências.
> - Se uma mesma ferramenta é usada em mais de um módulo, cada uso é independente e serve a propósitos diferentes (ex: prover modelo de IA vs. treinar IA).
> - Não há problema em haver redundância de ferramenta, desde que cada módulo mantenha sua responsabilidade única e não haja acoplamento entre eles.
> - O objetivo é garantir clareza, manutenção fácil, reusabilidade e evolução independente dos módulos.

[CONCEITO] Instalação 100% Guiada, Testada e Informativa
> Ao rodar `make install` em qualquer módulo do ecossistema Slice:
> - Todo o processo de instalação, configuração e inicialização deve ser automático e sem intervenção manual.
> - Ao final, o usuário deve receber informações claras e objetivas, como:
>   - URL de acesso (se for um serviço web)
>   - Comandos de uso (se for CLI)
>   - Status de cada etapa (instalou dependências, subiu serviço, rodou testes, etc.)
> - O Makefile deve rodar todos os testes necessários para garantir que o módulo está funcionando perfeitamente.
> - Se algum teste falhar, a instalação é interrompida e o erro é exibido de forma clara.
> - O objetivo é garantir que, ao final do processo, o usuário tenha certeza de que tudo está funcionando e saiba exatamente como acessar/usar o módulo.

```markdown
# Padrão Oficial para Routers Express

## Estrutura de Arquivos
- Cada recurso tem seu próprio arquivo de router em `src/routes/`
- Exemplo: `src/routes/userRouter.js`

