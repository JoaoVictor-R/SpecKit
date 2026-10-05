# Spec-Kit

## Instalação

Instalando o gerenciador **uv** (no Windows):

> [!IMPORTANT]
> Para instalar o gerenciador, é necessário haver instalado o Python na versão 3.11, ou superior, na máquina.

```
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Instalando o Spec-Kit:
```
uv tool install specify-cli
```

## Criação do projeto

Criando o projeto com o Gemini-CLI como agente de inteligência artificial.

```
specify init nome_projeto --integration gemini
```

Acessando o projeto
```
cd nome_projeto
```

>[!NOTE]
> Os subtópicos a seguir foram aplicados no chat do VS Code.

### Especificação inicial
```
/speckit.constitution crie princípios focados em clean code. O projeto deve ser pequeno e simples. Não deve haver testes automatizados.
```
### Especificação do projeto
```
/speckit.specify crie um projeto que seja para uso de um profissional de saúde, no qual ele pode observar os pacientes a serem atendidos, os pacientes já atendidos, os agendamentos, e realizar o atendimento de um paciente em específico. Quando realiza o atendimento de um paciente, ele pode ser acesso a diversas informações sobre o paciente: idade, CPF fictício, doenças crônicas, medicamentos em uso, histórico clínico. Além de verificar os seus sinais vitais e a sua altura.
```
### Planejamento técnico
```
/speckit.plan a aplicação usa typescrypt
```
### Divisão de tarefas
```
/speckit.tasks
```
### Implementação
```
/speckit.implement
```

## Resultado final

[Clique aqui](https://drive.google.com/file/d/1r9ZPPdA8_3gt6Cg0p-fNHLClV-aM00gc/view?usp=sharing) caso deseje ver o vídeo que apresenta o resultado final deste projeto.

## Artefatos requisitados
- [spec.md](https://github.com/JoaoVictor-R/SpecKit/blob/main/specs/001-atendimento-clinico/spec.md)
- [plan.md](https://github.com/JoaoVictor-R/SpecKit/blob/main/specs/001-atendimento-clinico/plan.md)
- [tasks.md](https://github.com/JoaoVictor-R/SpecKit/blob/main/specs/001-atendimento-clinico/tasks.md)
