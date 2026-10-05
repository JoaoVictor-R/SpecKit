# Modelo de Dados: Atendimento Clínico

Todos os registros nesta versão são sintéticos e mantidos localmente no navegador. Campos sem valor são representados como não informados; sua ausência não significa uma resposta clínica negativa.

## Paciente

Representa uma pessoa fictícia no conjunto de demonstração.

| Campo | Tipo conceitual | Regras |
|---|---|---|
| `id` | Identificador | Único e estável dentro do conjunto local. |
| `nome` | Texto | Nome fictício de demonstração. |
| `idade` | Número inteiro | Não negativo. |
| `cpfFicticio` | Texto | Identificador explicitamente fictício; nunca usar CPF real. |
| `doencasCronicas` | Lista de texto ou não informado | Não informar se o dado não foi registrado. |
| `medicamentosEmUso` | Lista de texto ou não informado | Não informar se o dado não foi registrado. |
| `historicoClinico` | Lista de atendimentos | Ordenada do mais recente para o mais antigo na apresentação. |

## Agendamento

Representa uma reserva de horário para um paciente.

| Campo | Tipo conceitual | Regras |
|---|---|---|
| `id` | Identificador | Único; cada agendamento tem identidade própria. |
| `pacienteId` | Identificador de paciente | Deve referenciar paciente existente. |
| `inicio` | Data e hora | Usado para ordenar a agenda cronologicamente. |
| `status` | `agendado`, `aguardando`, `em_atendimento` ou `atendido` | Transições de acordo com as ações disponíveis na interface. |

## Atendimento

Representa o registro clínico criado para um paciente e, quando aplicável, seu agendamento.

| Campo | Tipo conceitual | Regras |
|---|---|---|
| `id` | Identificador | Único para cada registro. |
| `pacienteId` | Identificador de paciente | Deve referenciar paciente existente. |
| `agendamentoId` | Identificador de agendamento ou não informado | Quando informado, deve pertencer ao mesmo paciente. |
| `realizadoEm` | Data e hora | Registrada ao concluir o atendimento. |
| `observacoes` | Texto ou não informado | Conteúdo escrito pelo profissional de demonstração. |
| `sinaisVitais` | Medições opcionais | Cada medição pode estar não informada; valores preenchidos devem ser numéricos e positivos. |
| `alturaCm` | Número ou não informado | Valor positivo em centímetros. |

## Medições

| Campo | Unidade de exibição | Validação básica |
|---|---|---|
| Pressão arterial sistólica e diastólica | mmHg | Ambos os valores são numéricos e positivos, ou ambos não informados. |
| Frequência cardíaca | bpm | Numérica e positiva quando informada. |
| Temperatura | °C | Numérica e positiva quando informada. |
| Frequência respiratória | irpm | Numérica e positiva quando informada. |
| Saturação de oxigênio | % | Numérica, maior que 0 e menor ou igual a 100 quando informada. |
| Altura | cm | Numérica e positiva quando informada. |

## Relações e estados

- Um paciente pode ter vários agendamentos e vários atendimentos.
- Um agendamento pertence a um paciente e pode originar, no máximo, um atendimento concluído na versão inicial.
- Um atendimento pertence a um paciente e pode referenciar o agendamento que lhe deu origem.
- Fluxo esperado do agendamento: `agendado` → `aguardando` → `em_atendimento` → `atendido`. A agenda pode representar a espera diretamente como `aguardando`.
- Concluir o atendimento adiciona o registro ao histórico do paciente e atualiza o status do agendamento correspondente.
