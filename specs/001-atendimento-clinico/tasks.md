# Tarefas: Atendimento Clínico

**Entrada**: Documentos de design em `specs/001-atendimento-clinico/`

**Pré-requisitos**: `plan.md`, `spec.md`, `research.md`, `data-model.md` e `quickstart.md`

**Testes**: Não criar nem executar testes automatizados. A constituição exige validação manual; compilação e verificação de tipos são permitidas.

**Organização**: As tarefas estão agrupadas por história de usuário para permitir implementação incremental.

## Formato

`- [ ] [ID] [P?] [História?] Descrição com caminho do arquivo`

- `[P]`: tarefa pode ser feita em paralelo com outras tarefas marcadas `[P]`.
- `[US1]`, `[US2]`, `[US3]`: história do usuário atendida.
- Todas as tarefas indicam os caminhos específicos dos arquivos envolvidos.

## Fase 1: Preparação do projeto

**Objetivo**: Configurar a aplicação web TypeScript mínima.

- [x] T001 [P] Criar `package.json` com scripts `dev` e `build` e dependências de desenvolvimento TypeScript e Vite, sem framework de interface.
- [x] T002 [P] Criar `tsconfig.json` com TypeScript em modo estrito para a aplicação em `src/`.
- [x] T003 Criar a página inicial em `index.html` e o ponto de entrada mínimo em `src/main.ts` e `src/styles.css`.

## Fase 2: Fundação compartilhada

**Objetivo**: Definir os dados fictícios e persistência local utilizados pelas histórias.

- [x] T004 Criar os tipos de paciente, agendamento, atendimento, medições e estados em `src/types.ts`, representando campos clínicos ausentes como não informados.
- [x] T005 Criar pacientes e agendamentos de demonstração inteiramente fictícios em `src/sample-data.ts`, sem dados pessoais reais e com CPF explicitamente fictício.
- [x] T006 Implementar inicialização, leitura e gravação de pacientes, agendamentos e atendimentos no `localStorage` em `src/storage.ts`, informando erros de leitura, JSON inválido ou gravação sem indicar sucesso indevido.

## Fase 3: História 1 — Acompanhar agenda e fila (Prioridade: P1)

**Objetivo**: Consultar os agendamentos e identificar pacientes por situação.

**Validação manual independente**: Abrir a aplicação com os dados de exemplo, conferir horários em ordem cronológica e identificar pacientes agendados, aguardando, em atendimento e atendidos; selecionar uma data sem agendamentos e conferir a indicação de lista vazia.

- [x] T007 [US1] Implementar em `src/app.ts` a visualização da agenda por data, com agendamentos em ordem cronológica, estado visível em cada paciente e resumo por situação.
- [x] T008 [US1] Implementar em `src/app.ts` a seleção de data, os estados vazios e a abertura do paciente associado a um agendamento ou à fila.
- [x] T009 [US1] Inicializar os dados e renderizar a agenda a partir de `src/main.ts`, conectando a interface a `src/app.ts` e `src/storage.ts`.

## Fase 4: História 2 — Consultar informações do paciente (Prioridade: P1)

**Objetivo**: Consultar perfil e histórico clínico do paciente selecionado.

**Validação manual independente**: Abrir pacientes fictícios da agenda e conferir idade, CPF fictício, doenças crônicas, medicamentos e histórico; confirmar que campos ausentes aparecem como não informados e paciente indisponível gera uma mensagem explícita.

- [x] T010 [US2] Implementar em `src/app.ts` a apresentação do perfil do paciente com idade, CPF fictício, doenças crônicas, medicamentos em uso e histórico clínico.
- [x] T011 [US2] Representar dados não registrados como “Não informado” e paciente inexistente como erro visível na interface de `src/app.ts`.

## Fase 5: História 3 — Registrar atendimento e sinais vitais (Prioridade: P1)

**Objetivo**: Registrar, concluir e consultar o atendimento de um paciente específico.

**Validação manual independente**: Iniciar o atendimento de um paciente fictício, registrar observações, sinais vitais e altura, concluir, recarregar a aplicação e confirmar o registro no histórico e o status “atendido”. Conferir também campos opcionais e erros de validação/persistência.

- [x] T012 [US3] Implementar em `src/app.ts` o formulário de atendimento associado ao paciente e agendamento selecionados, com observações, pressão arterial, frequência cardíaca, temperatura, frequência respiratória, saturação de oxigênio e altura, exibindo as unidades.
- [x] T013 [US3] Validar medições preenchidas em `src/app.ts`: valores devem ser numéricos e positivos; saturação deve ser maior que 0 e menor ou igual a 100; valores ausentes devem continuar não informados.
- [x] T014 [US3] Persistir o atendimento e atualizar o status do agendamento correspondente em `src/storage.ts`, preservando os dados preenchidos e apresentando erro explícito se a gravação falhar.
- [x] T015 [US3] Conectar conclusão do atendimento, histórico e atualização da agenda em `src/app.ts`, evitando manter o mesmo agendamento simultaneamente como aguardando e atendido.

## Fase 6: Acabamento e validação manual

**Objetivo**: Finalizar apresentação e verificar os fluxos sem testes automatizados.

- [x] T016 Aplicar estilos legíveis e responsivos à agenda, perfil, formulário, estados vazios e mensagens de erro em `src/styles.css`.
- [x] T017 Executar `npm run build` e corrigir erros de compilação ou tipos TypeScript em `package.json`, `tsconfig.json` e nos arquivos de `src/`.
- [x] T018 Percorrer os cenários manuais de `specs/001-atendimento-clinico/quickstart.md` no navegador, usando somente dados fictícios e corrigindo problemas encontrados nos arquivos de `src/`.

## Dependências e ordem sugerida

- Preparação do projeto (`T001`–`T003`) precede a fundação (`T004`–`T006`).
- As histórias dependem da fundação compartilhada.
- A História 1 (`T007`–`T009`) precede a História 2 (`T010`–`T011`), pois o perfil é aberto a partir da agenda.
- A História 2 precede a História 3 (`T012`–`T015`), que registra o atendimento no contexto do perfil do paciente.
- O acabamento visual (`T016`) e a validação final (`T017`–`T018`) ocorrem depois das histórias.

## Oportunidades de paralelização

- `T001` e `T002` podem ser executadas em paralelo, pois configuram arquivos distintos.

## Estratégia de implementação

1. Concluir a configuração e a fundação compartilhada com dados exclusivamente fictícios.
2. Entregar primeiro a agenda e a fila (História 1) como incremento inicial.
3. Acrescentar a consulta do perfil e histórico (História 2).
4. Acrescentar o formulário, persistência e conclusão do atendimento (História 3).
5. Fazer a compilação TypeScript e seguir o guia de validação manual; não criar nem exigir testes automatizados.
