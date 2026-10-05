# Guia de Validação Manual: Atendimento Clínico

## Pré-requisitos

- Node.js e npm instalados.
- Navegador moderno em computador.
- Repositório da aplicação disponível localmente.

## Preparação

Na raiz do projeto, instalar as dependências e iniciar o servidor de desenvolvimento:

```powershell
npm install
npm run dev
```

Abrir no navegador o endereço local informado pelo Vite. A implementação deverá fornecer scripts `dev` e `build` no `package.json`. Não há comandos ou dependências de testes.

## Cenários manuais

1. **Agenda e fila**: confirmar que pacientes fictícios aparecem em ordem cronológica, com o estado de cada paciente visível e o resumo por situação atualizado. Selecionar uma data sem consultas e confirmar a mensagem de lista vazia.
2. **Perfil do paciente**: abrir um paciente da agenda; conferir idade, CPF marcado como fictício, doenças crônicas, medicamentos em uso e histórico. Confirmar que valores ausentes aparecem como “Não informado”.
3. **Registrar atendimento**: iniciar o atendimento de um paciente aguardando; preencher uma observação, pressão arterial, frequência cardíaca, temperatura, frequência respiratória, saturação e altura; salvar e concluir.
4. **Confirmar histórico e status**: voltar à agenda; confirmar que o paciente aparece como atendido e que o novo registro aparece no histórico do paciente após recarregar a página.
5. **Campos opcionais e inválidos**: salvar um atendimento com medições opcionais não preenchidas e conferir que continuam como não informadas. Inserir um valor não numérico ou uma saturação acima de 100 e confirmar que a interface identifica o campo inválido.
6. **Falha de persistência**: quando viável no navegador, bloquear o armazenamento local ou simular um estado local inválido; confirmar que a aplicação informa a falha sem indicar salvamento bem-sucedido.

## Verificações de compilação

Executar `npm run build` para verificar compilação e tipos TypeScript. Esta verificação não substitui os cenários manuais e não deve ser convertida em testes automatizados.

Todos os dados usados na validação devem ser sintéticos. Não inserir informações de pacientes reais.
