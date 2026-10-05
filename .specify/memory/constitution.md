# Constituição do Projeto

## Princípios Fundamentais

### I. Código claro e legível
O código deve ser fácil de entender antes de ser otimizado. Use nomes descritivos, funções objetivas e fluxo explícito. Evite comentários que apenas repitam o que o código já expressa.

### II. Simplicidade e escopo pequeno
Prefira a solução mais simples que atenda ao requisito. Mantenha o projeto pequeno, evite abstrações, dependências e camadas desnecessárias e não implemente funcionalidades especulativas (YAGNI).

### III. Responsabilidades bem definidas
Cada função, módulo ou componente deve ter uma responsabilidade clara e limitada. Separe responsabilidades quando isso reduzir o acoplamento e facilitar a compreensão, sem fragmentar o projeto em estruturas artificiais.

### IV. Consistência e manutenção
Siga os padrões, convenções e ferramentas já adotados no projeto. Evite duplicação relevante; extraia código compartilhado apenas quando isso tornar a solução mais clara do que mantê-lo junto ao seu uso.

### V. Sem testes automatizados
Este projeto não deve incluir nem exigir testes automatizados. Valide alterações por revisão do código e verificações manuais apropriadas; compilação, análise estática ou lint podem ser usados quando disponíveis e pertinentes, mas não devem introduzir uma suíte de testes.

## Restrições de Implementação

- Não adicionar dependências, arquivos, configurações ou infraestrutura sem necessidade demonstrável.
- Não ampliar o escopo nem alterar comportamento existente fora do necessário para o requisito.
- Tratar erros de forma explícita e coerente com os padrões do projeto; não ocultar falhas com valores padrão silenciosos.

## Fluxo de Desenvolvimento

Antes de implementar, compreenda os padrões e o contexto existentes. Faça mudanças pequenas e focadas, revise o resultado quanto à clareza e ao escopo e execute verificações manuais relevantes. Não criar, executar ou exigir testes automatizados.

## Governança

Esta constituição orienta decisões de arquitetura, implementação e revisão. Quando uma necessidade exigir uma exceção, ela deve ser justificada pelo requisito e manter o projeto tão simples quanto possível. Atualizações desta constituição devem refletir os princípios reais do projeto.

**Versão**: 1.0.0 | **Ratificada**: 2026-10-05 | **Última alteração**: 2026-10-05
