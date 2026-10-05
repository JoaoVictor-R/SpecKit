# Pesquisa e Decisões Técnicas: Atendimento Clínico

## Decisão: TypeScript estrito com Vite

- **Decisão**: Usar TypeScript em modo estrito e Vite para servir e compilar a aplicação web.
- **Justificativa**: TypeScript atende ao requisito do projeto e ajuda a descrever os dados clínicos e os estados de atendimento. Vite mantém o ciclo de desenvolvimento simples sem exigir framework de interface.
- **Alternativas consideradas**: JavaScript sem tipos (não atende à linguagem indicada); framework frontend completo (adiciona estrutura e dependências sem necessidade demonstrada); configuração de compilação manual (mais configuração para manter).

## Decisão: interface sem framework

- **Decisão**: Implementar a interface com HTML, CSS e TypeScript, mantendo a aplicação em um único projeto frontend.
- **Justificativa**: O fluxo inicial tem poucas telas e não exige uma arquitetura de componentes ou dependências de runtime.
- **Alternativas consideradas**: React, Vue ou Angular; não escolhidos para preservar o escopo pequeno.

## Decisão: persistência local de dados sintéticos

- **Decisão**: Usar dados sintéticos de exemplo e `localStorage` para persistir alterações no mesmo navegador.
- **Justificativa**: Permite demonstrar agenda, histórico e atendimentos sem serviço externo ou configuração de servidor de dados.
- **Alternativas consideradas**: Backend e banco de dados (fora do escopo da demonstração); manter apenas estado em memória (perde registros ao recarregar).
- **Limite**: `localStorage` não fornece autenticação, controle de acesso, auditoria, sincronização ou proteções adequadas para prontuários reais. A aplicação não deve ser usada com dados de pacientes reais.

## Decisão: nenhuma suíte de testes automatizados

- **Decisão**: Não adicionar nem executar testes automatizados. Usar verificação de tipos e uma sequência de validação manual no navegador.
- **Justificativa**: A constituição do projeto proíbe testes automatizados; a compilação TypeScript continua sendo uma verificação estática, não uma suíte de testes.
- **Alternativas consideradas**: testes unitários, de integração ou ponta a ponta; todos excluídos pela constituição.

## Decisão: não criar contratos externos

- **Decisão**: Não criar diretório `contracts/` nesta fase.
- **Justificativa**: A aplicação não oferece API pública nem integrações com outros sistemas.
