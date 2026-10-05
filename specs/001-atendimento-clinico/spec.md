# Especificação de Funcionalidade: Atendimento Clínico

**Feature Branch**: `001-atendimento-clinico`

**Criado**: 2026-10-05

**Status**: Draft

**Entrada**: Descrição do usuário: "crie um projeto que seja para uso de um profissional de saúde, no qual ele pode observar os pacientes a serem atendidos, os pacientes já atendidos, os agendamentos, e realizar o atendimento de um paciente em específico. Quando realiza o atendimento de um paciente, ele pode ser acesso a diversas informações sobre o paciente: idade, CPF fictício, doenças crônicas, medicamentos em uso, histórico clínico. Além de verificar os seus sinais vitais e a sua altura."

## Cenários do Usuário e Validação Manual

### História 1 — Acompanhar agenda e fila de pacientes (Prioridade: P1)

Como profissional de saúde, quero visualizar os agendamentos do dia, os pacientes que aguardam atendimento e os que já foram atendidos, para organizar minha rotina.

**Por que esta prioridade**: A visão da agenda e da situação dos atendimentos é necessária para localizar o próximo paciente e acompanhar o andamento do dia.

**Validação manual independente**: Conferir que agendamentos de exemplo aparecem na data correta e que cada paciente pode ser localizado na lista correspondente ao seu estado.

**Cenários de aceitação**:

1. **Dado** que existem agendamentos para o dia, **quando** o profissional abre a agenda, **então** vê os pacientes e seus horários em ordem cronológica.
2. **Dado** que um paciente aguarda atendimento, **quando** o profissional consulta a fila, **então** consegue identificar o paciente e abrir seu atendimento.
3. **Dado** que um atendimento foi concluído, **quando** o profissional consulta os atendidos, **então** o paciente aparece nessa lista sem permanecer na fila de espera.
4. **Dado** que não há agendamentos em uma data, **quando** o profissional abre a agenda dessa data, **então** o sistema informa que a lista está vazia.

### História 2 — Consultar informações do paciente (Prioridade: P1)

Como profissional de saúde, quero consultar os dados e o histórico clínico do paciente selecionado, para ter contexto durante o atendimento.

**Por que esta prioridade**: O acesso ao contexto clínico é essencial para realizar um atendimento informado.

**Validação manual independente**: Abrir um paciente fictício e conferir seus dados pessoais, condições crônicas, medicamentos e registros clínicos anteriores.

**Cenários de aceitação**:

1. **Dado** um paciente da agenda, **quando** o profissional abre seu perfil, **então** vê idade, CPF fictício, doenças crônicas, medicamentos em uso e histórico clínico.
2. **Dado** que uma dessas informações não foi registrada, **quando** o perfil é exibido, **então** a informação ausente é identificada como não informada, sem ser inventada.
3. **Dado** que um paciente não existe ou não está disponível, **quando** o profissional tenta abrir seu perfil, **então** o sistema informa que não foi possível localizar o paciente.

### História 3 — Registrar atendimento e sinais vitais (Prioridade: P1)

Como profissional de saúde, quero registrar o atendimento do paciente selecionado, incluindo observações e medições, para manter seu histórico clínico atualizado.

**Por que esta prioridade**: Registrar o atendimento e suas medições é a ação central do sistema.

**Validação manual independente**: Iniciar o atendimento de um paciente fictício, preencher as medições e uma observação, salvar e verificar o novo registro no histórico e na lista de atendidos.

**Cenários de aceitação**:

1. **Dado** um paciente aguardando atendimento, **quando** o profissional inicia o atendimento, **então** o sistema mostra o perfil desse paciente e permite registrar as informações da consulta.
2. **Dado** um atendimento em andamento, **quando** o profissional registra sinais vitais, altura e observações, **então** o sistema associa essas informações ao paciente e à data do atendimento.
3. **Dado** que um campo de medição não foi preenchido, **quando** o profissional salva o atendimento, **então** o campo permanece identificado como não informado e nenhum valor é presumido.
4. **Dado** que o profissional conclui e salva o atendimento, **quando** retorna à agenda, **então** o paciente aparece como atendido e o registro fica disponível no histórico clínico.
5. **Dado** que ocorreu um erro ao salvar, **quando** o profissional tenta concluir o atendimento, **então** o sistema informa que o registro não foi concluído e preserva os dados preenchidos para nova tentativa.

### Casos de borda

- Um paciente pode ter mais de um agendamento no mesmo dia; cada atendimento deve permanecer associado ao agendamento correspondente.
- A ausência de histórico, condição crônica ou medicamento deve ser representada como informação não informada, não como ausência confirmada da condição ou do uso.
- Valores de medição inválidos ou não numéricos devem ser rejeitados com indicação do campo a corrigir.
- Um atendimento concluído não deve ser contado novamente como aguardando na agenda.
- Se o profissional sair antes de salvar, o sistema deve deixar claro que as alterações ainda não foram registradas.

## Requisitos

### Requisitos funcionais

- **FR-001**: O sistema DEVE apresentar os agendamentos por data e horário.
- **FR-002**: O sistema DEVE permitir identificar separadamente pacientes agendados, aguardando atendimento, em atendimento e atendidos.
- **FR-003**: O sistema DEVE permitir ao profissional abrir o perfil do paciente associado a um agendamento ou à fila.
- **FR-004**: O perfil DEVE apresentar idade e CPF fictício do paciente.
- **FR-005**: O perfil DEVE apresentar doenças crônicas, medicamentos em uso e histórico clínico quando registrados.
- **FR-006**: O sistema DEVE distinguir informação não registrada de uma resposta negativa confirmada.
- **FR-007**: O sistema DEVE permitir iniciar e concluir o atendimento de um paciente específico.
- **FR-008**: O sistema DEVE permitir registrar no atendimento observações clínicas, pressão arterial, frequência cardíaca, temperatura, frequência respiratória, saturação de oxigênio e altura.
- **FR-009**: Cada registro de atendimento DEVE ser associado ao paciente e à data e hora em que foi realizado.
- **FR-010**: Ao concluir um atendimento, o sistema DEVE atualizar a situação do paciente na agenda e incluir o registro no histórico clínico.
- **FR-011**: O sistema DEVE informar falhas ao abrir ou salvar informações sem indicar sucesso quando a operação não foi concluída.
- **FR-012**: A versão inicial DEVE usar exclusivamente dados sintéticos; os CPFs apresentados devem ser fictícios e não podem identificar pessoas reais.
- **FR-013**: As informações clínicas só DEVEM ser exibidas no contexto de acesso do profissional de saúde autorizado.

### Entidades principais

- **Paciente**: Pessoa fictícia atendida; inclui idade, CPF fictício, doenças crônicas, medicamentos em uso e histórico clínico.
- **Agendamento**: Horário reservado para um paciente, com data e situação do atendimento.
- **Atendimento**: Registro associado a um paciente e agendamento, com data e hora, observações e medições registradas.
- **Medições clínicas**: Sinais vitais e altura informados durante um atendimento; cada medição pode estar não informada.

## Critérios de sucesso

### Resultados mensuráveis

- **SC-001**: Em uma validação manual, o profissional consegue identificar na agenda os pacientes agendados, aguardando e atendidos para uma data selecionada.
- **SC-002**: Em uma validação manual, o profissional consegue abrir um paciente da fila e localizar idade, CPF fictício, doenças crônicas, medicamentos e histórico clínico.
- **SC-003**: Em uma validação manual, o profissional consegue registrar um atendimento com sinais vitais e altura, concluí-lo e encontrá-lo no histórico do paciente.
- **SC-004**: Nenhum dado pessoal real é necessário para demonstrar os fluxos da versão inicial.

## Premissas

- A versão inicial é uma demonstração com dados inteiramente fictícios, sem cadastro ou uso de dados reais de pacientes.
- O público-alvo é um profissional de saúde autorizado a consultar os registros apresentados.
- Sinais vitais incluem pressão arterial, frequência cardíaca, temperatura, frequência respiratória e saturação de oxigênio; altura é registrada separadamente.
- O escopo é organizar informações e registrar atendimentos; diagnóstico, prescrição, faturamento, integrações externas e gestão de múltiplos profissionais ficam fora da versão inicial.
- A validação será manual; o projeto não incluirá nem exigirá testes automatizados.
