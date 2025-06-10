# 📘 Dicionário de Marcações em Prompts e Como IAs Interpretam

| Símbolo / Formato | Uso Comum              | Interpretação da IA           | Observação                    |
| ----------------- | ---------------------- | ----------------------------- | ----------------------------- |
| `1.` `2.` `3.`    | Lista numerada         | Ordem sequencial de execução  | Ideal para passos             |
| `-` `–` `—`       | Lista simples          | Lista não-ordenada            | Para tópicos gerais           |
| `*`               | Asterisco simples      | Item genérico                 | Sem peso especial             |
| `**`              | Ênfase / negrito       | Destaque textual              | Ajuda a reforçar ideias       |
| `***`             | Ênfase forte / divisor | Separador ou ênfase exagerada | Evite usar demais             |
| `#` `##` `###`    | Títulos/subtítulos     | Estrutura em seções           | Organiza contextos            |
| `> texto`         | Citação                | Exemplo ou entrada de usuário | Simula input                  |
| `>> texto`        | Diretiva               | Exemplo ou entrada de usuário | Simula input (Obrigatorio)    |
| `` `code` ``      | Código inline          | Literal, não interpretado     | Para comandos curtos          |
| ```` ``` ````     | Bloco de código        | Código técnico fixo           | Preserva instruções           |
| `[]`              | Colchetes              | Placeholder ou valor opcional | A ser preenchido              |
| `{}`              | Chaves                 | Template dinâmico             | Conteúdo gerado ou variável   |
| `()`              | Parênteses             | Comentário ou condição        | Pode ser ignorado             |
| `:::`             | Delimitador especial   | Role/contexto alternativo     | Avançado; nem todo modelo usa |
| `//` comentário   | Comentário de código   | Ignorado pela IA              | Bom para humanos entenderem   |

---

## ✅ Boas Práticas

- Use **listas numeradas (`1.`, `2.`, `3.`)** para ordem.
- Use **`#`, `##`** para estruturar seções do prompt.
- Use **bloco de código** (```) para comandos exatos.
- Evite misturar símbolos diferentes no mesmo bloco.
- Markdown puro → maior compatibilidade com IAs.
