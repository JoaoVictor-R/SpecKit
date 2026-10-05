# Plano de Implementação: Atendimento Clínico

**Branch**: `001-atendimento-clinico` | **Data**: 2026-10-05 | **Especificação**: [spec.md](./spec.md)

**Entrada**: Especificação em `specs/001-atendimento-clinico/spec.md`

## Resumo

Criar uma aplicação web pequena para que um profissional de saúde consulte a agenda e a fila, abra o perfil de pacientes fictícios e registre atendimentos com observações, sinais vitais e altura. A aplicação será escrita em TypeScript, sem framework de interface, com dados de demonstração e persistência local no navegador. Não serão usados dados reais de pacientes nem testes automatizados.

## Contexto técnico

**Linguagem/Versão**: TypeScript em modo estrito; JavaScript gerado para navegadores modernos.

**Dependências principais**: TypeScript e Vite como ferramenta de desenvolvimento e compilação; sem framework de interface ou dependências de runtime.

**Armazenamento**: `localStorage` do navegador para os dados sintéticos e atendimentos da demonstração.

**Testes**: Não haverá testes automatizados. Usar revisão, compilação/análise de tipos e validação manual no navegador.

**Plataforma-alvo**: Aplicação web local para navegadores modernos em computador.

**Tipo de projeto**: Aplicação web frontend, sem API ou servidor de dados.

**Metas de desempenho**: Carregar rapidamente os dados pequenos de demonstração e permitir navegação imediata entre agenda, fila e perfil.

**Restrições**: Projeto pequeno e simples; não incluir dados pessoais reais, autenticação simulada como mecanismo de segurança, integrações externas ou infraestrutura de backend. Dados locais são apenas para demonstração e não são apropriados para uso clínico real.

**Escala/escopo**: Um profissional por execução local, conjunto pequeno de pacientes fictícios, agenda diária e registro local de atendimentos.

## Verificação da constituição

- Código claro e legível: aprovado; módulos pequenos e nomes explícitos.
- Simplicidade e escopo pequeno: aprovado; uma aplicação frontend sem backend, framework ou serviços externos.
- Responsabilidades bem definidas: aprovado; separar tipos/dados, persistência local e apresentação sem criar camadas desnecessárias.
- Consistência e manutenção: aprovado; usar TypeScript estrito e scripts convencionais do projeto.
- Sem testes automatizados: aprovado; validar manualmente e usar o compilador TypeScript para detectar erros de tipos, sem adicionar suíte de testes.
- Privacidade e escopo: aprovado sob a premissa de demonstração exclusivamente sintética; não usar com pacientes reais.

## Decisões de arquitetura

### Estrutura do projeto

```text
specs/001-atendimento-clinico/
├── plan.md
├── research.md
├── data-model.md
└── quickstart.md

index.html
src/
├── main.ts
├── styles.css
├── types.ts
├── sample-data.ts
├── storage.ts
└── app.ts
```

**Decisão de estrutura**: aplicação web única, com apresentação e estado local no navegador. `sample-data.ts` fornece registros inteiramente sintéticos; `storage.ts` encapsula leitura e gravação no `localStorage`; `app.ts` cuida da renderização e das interações; `types.ts` define os tipos do domínio. Não criar diretórios de API ou testes.

### Armazenamento e erros

Inicializar o armazenamento local com os dados sintéticos quando ainda não houver estado salvo. Tratar erros de leitura, gravação e JSON inválido com mensagem visível; não comunicar sucesso nem descartar silenciosamente dados inseridos. A versão inicial não oferece sincronização ou backup.

### Interface

Apresentar agenda e estados de atendimento em uma tela principal; permitir abrir detalhes do paciente e o formulário de atendimento. Ordenar agendamentos por horário e exibir claramente estados vazios, informações não registradas e erros. Rotular valores com suas unidades.

## Artefatos da funcionalidade

- [Especificação](./spec.md)
- [Pesquisa e decisões técnicas](./research.md)
- [Modelo de dados](./data-model.md)
- [Guia de validação manual](./quickstart.md)
- Contratos externos: não aplicável; a versão inicial não expõe APIs nem integrações.

**Próxima etapa**: gerar `tasks.md` com `/speckit.tasks`; a implementação deve seguir os fluxos de validação manual, sem criar testes automatizados.
