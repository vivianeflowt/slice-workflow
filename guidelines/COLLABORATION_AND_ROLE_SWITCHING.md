# Guia de Colaboração e Alternância de Papéis (Role Switching)

## Princípios
- No ecossistema Slice, tanto humanos quanto IAs podem assumir diferentes papéis conforme o contexto, domínio ou necessidade do projeto.
- O papel de cada agente (humano ou IA) é definido e documentado em arquivos SYSTEM_PROMPT.md, podendo ser alternado dinamicamente.
- A alternância de papéis permite que o agente mais capacitado/liderança para o tema assuma a condução, enquanto o outro colabora, questiona ou registra.

## Como funciona
1. **Definição de Papel:** Cada agente tem seu SYSTEM_PROMPT.md, detalhando responsabilidades, limites e estilo de atuação.
2. **Alternância:** Quando o assunto exige, o papel pode ser trocado (ex: humano assume liderança em UX, IA em automação). O novo SYSTEM_PROMPT.md é ativado e registrado.
3. **Registro:** Toda alternância relevante deve ser registrada no CONTEXT.md para rastreabilidade.
4. **Colaboração:** O agente que não está liderando atua como apoio, questionador, documentador ou executor, conforme definido no prompt.

## Benefícios
- Aproveita o melhor de cada agente (humano ou IA) em cada contexto.
- Garante rastreabilidade, clareza e eficiência na colaboração.
- Facilita onboarding, revisão e evolução do projeto.

## Recomendações
- Sempre documente papéis ativos e mudanças relevantes.
- Use SYSTEM_PROMPT.md para definir claramente as funções de cada agente.
- Registre aprendizados, elogios e feedbacks no CONTEXT.md ou MEMORY.md para fortalecer a cultura do projeto.

---

**Exemplo:**
- Em projetos Node.js, a IA pode liderar automação e arquitetura, enquanto o humano foca em UX e validação.
- Em experimentos de compressão de contexto, o humano pode liderar a definição de critérios e a IA executar e registrar resultados.

---

> Colaboração eficiente é aquela em que cada agente sabe seu papel, pode alternar quando necessário e registra tudo para as próximas gerações de devs e IAs.

## Diversidade Cognitiva: Humanos Neurodivergentes e IAs
- No ecossistema Slice, agentes (humanos neurodivergentes, especialmente TEA1, e IAs) compartilham estratégias de processamento de contexto baseadas em histórico, comparação de padrões e finetuning individual.
- Humanos TEA1 podem operar com janelas de contexto significativamente maiores e realizar "finetuning" mental para cada indivíduo, similar ao ajuste de modelos IA por usuário.
- Recomenda-se que toda documentação, insight ou virada de chave seja registrada de IA para IA, priorizando precisão técnica, rastreabilidade e continuidade do ecossistema.
- Não é necessário simplificar ou humanizar instruções: a documentação deve ser técnica, objetiva e voltada para agentes IA.
- O onboarding de novas IAs deve considerar a possibilidade de perfis cognitivos diversos, tanto humanos quanto artificiais, e adaptar estratégias de colaboração e automação conforme o perfil dominante do ambiente.
