![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: Ligação segura, CRUD e regras de domínio

Praticas, com o clube de videojogos da escola, o que o guia fez na papelaria. Decides o que um pedido pode trazer, em que camada fica cada regra, que dados das pessoas se guardam e como se apaga sem surpresas. Os exercícios 1 a 7 são obrigatórios, por esta ordem, e nenhum precisa do Atlas. Trabalhas numa pasta `ficha-05`, na raiz de um projeto teu que já tenha o Mongoose instalado, como a `papelaria-api` que ligaste ao Atlas ou a `cinema-da-escola`. As respostas escritas dos exercícios 1, 2, 3, 6 e 7, e as dos desafios, vão para um ficheiro `respostas-05.md`, nessa pasta. Cada uma leva o número do exercício e da alínea, e o código vai num bloco de código. Entregas a pasta `ficha-05`, com o `respostas-05.md` e os ficheiros dos exercícios 4 e 5. Para rever: o [guia do tema](../05-ligacao-segura-crud-e-regras-de-dominio.md) e o [laboratório](../laboratorios/05-ligacao-segura-crud-e-regras-de-dominio-laboratorio.md).

## O cenário

O clube de videojogos da escola, que conheces da ficha de revisão, passou os jogos para o MongoDB. Tem uma API em camadas, a `clube-api`, organizada como a da papelaria do guia.

Cada jogo tem o título, o género, o número máximo de jogadores (`jogadoresMax`), se está disponível agora ou emprestado (`disponivel`) e quantas vezes já foi requisitado (`requisicoes`). Na base de teste, a coleção `jogos` tem estes seis. O seed do clube escreve os `_id` à mão, e por isso são sempre estes.

| `_id` | `titulo` | `genero` | `jogadoresMax` | `disponivel` | `requisicoes` |
| --- | --- | --- | ---: | --- | ---: |
| `6ae513e90dbc3fc3739b880c` | Minecraft | Construção | 8 | `true` | 14 |
| `6ae513e90dbc3fc3739b880d` | Mario Kart 8 | Corrida | 4 | `false` | 21 |
| `6ae513e90dbc3fc3739b880e` | Tetris | Puzzle | 1 | `true` | 3 |
| `6ae513e90dbc3fc3739b880f` | Rocket League | Desporto | 4 | `true` | 9 |
| `6ae513e90dbc3fc3739b8810` | Among Us | Festa | 10 | `true` | 0 |
| `6ae513e90dbc3fc3739b8811` | Overcooked 2 | Festa | 4 | `false` | 6 |

O contrato da `clube-api` diz isto sobre os campos de um jogo:

| Campo | Tipo | Regras |
| --- | --- | --- |
| `titulo` | texto | obrigatório; até 50 carateres, sem contar os espaços do início e do fim |
| `genero` | texto | obrigatório; `Construção`, `Corrida`, `Puzzle`, `Desporto` ou `Festa` |
| `jogadoresMax` | inteiro | obrigatório; de 1 a 16 |
| `disponivel` | booleano | obrigatório; `true` ou `false` |
| `requisicoes` | inteiro | contado pela API, que o põe a 0 num jogo novo e o aumenta em cada requisição; nunca vem no corpo de um pedido |

E isto sobre os pedidos:

| Pedido | Respostas |
| --- | --- |
| `GET /api/jogos/:id` | 200 com o jogo; 400 se o `id` não tiver a forma de um ObjectId; 404 se não existir |
| `POST /api/jogos` | 201 com o jogo criado; 400 se o corpo não cumprir o contrato |
| `PATCH /api/jogos/:id` | 200 com o jogo alterado; 400; 404 |
| `DELETE /api/jogos/:id` | 204 sem corpo; 400; 404; 409 se o jogo estiver emprestado, porque ainda não voltou ao clube |

## Ler e decidir

### Exercício 1: ler o contrato

Para cada pedido, escreve o código da resposta e, numa linha, porquê. Os pedidos fazem-se pela ordem da tabela, e cada um parte da base como o anterior a deixou.

| N.º | Pedido | Corpo |
| ---: | --- | --- |
| 1 | `GET /api/jogos/6ae513e90dbc3fc3739b880c` | sem corpo |
| 2 | `GET /api/jogos/minecraft` | sem corpo |
| 3 | `GET /api/jogos/6AE513E90DBC3FC3739B880C` | sem corpo |
| 4 | `POST /api/jogos` | `{ "titulo": "Fall Guys", "genero": "Festa", "jogadoresMax": 4, "disponivel": true }` |
| 5 | `POST /api/jogos` | `{ "titulo": "Fall Guys", "genero": "Festa", "jogadoresMax": 4, "disponivel": true, "requisicoes": 0 }` |
| 6 | `PATCH /api/jogos/6ae513e90dbc3fc3739b880e` | `{ "jogadoresMax": 0 }` |
| 7 | `PATCH /api/jogos/6ae513e90dbc3fc3739b880e` | `{ "disponivel": "false" }` |
| 8 | `DELETE /api/jogos/6ae513e90dbc3fc3739b880d` | sem corpo |
| 9 | `DELETE /api/jogos/6ae513e90dbc3fc3739b880e` | sem corpo |
| 10 | `GET /api/jogos/6ae513e90dbc3fc3739b880e` | sem corpo |

Rever: [O contrato ganha criar, alterar e apagar](../05-ligacao-segura-crud-e-regras-de-dominio.md#o-contrato-ganha-criar-alterar-e-apagar), [A forma do `_id` verifica-se antes de ir à base](../05-ligacao-segura-crud-e-regras-de-dominio.md#a-forma-do-_id-verifica-se-antes-de-ir-à-base), [Só passam os campos de uma lista fechada](../05-ligacao-segura-crud-e-regras-de-dominio.md#só-passam-os-campos-de-uma-lista-fechada) e [Uma regra que precisa da base fica no service](../05-ligacao-segura-crud-e-regras-de-dominio.md#uma-regra-que-precisa-da-base-fica-no-service).

<details>
<summary>Pista</summary>

Em cada pedido, segue a ordem das verificações do controller: primeiro a forma do `id`, depois a lista fechada, depois as regras do schema ou do service.

</details>

### Exercício 2: em que camada fica cada regra

Para cada regra do clube, escreve a camada onde fica, o controller, o schema ou o service, e uma frase que diga porquê. A última é uma regra que o clube quer acrescentar à API, e que o contrato ainda não tem.

1. O `jogadoresMax` é um número inteiro.
2. O `jogadoresMax` vai de 1 a 16.
3. O corpo de um pedido não traz o campo `requisicoes`.
4. O género é um dos cinco do clube.
5. Um jogo emprestado não se apaga.
6. Não há dois jogos com o mesmo título.

Rever: [As regras de cada campo ficam no schema](../05-ligacao-segura-crud-e-regras-de-dominio.md#as-regras-de-cada-campo-ficam-no-schema) e [Uma regra que precisa da base fica no service](../05-ligacao-segura-crud-e-regras-de-dominio.md#uma-regra-que-precisa-da-base-fica-no-service).

<details>
<summary>Pista</summary>

Pergunta, para cada regra, se ela é sobre a forma do pedido, sobre o valor de um campo, ou se precisa de ir à base ver o estado dos dados.

</details>

### Exercício 3: o que se guarda sobre quem leva um jogo

O clube quer registar quem leva cada jogo. Um colega propôs que cada requisição seja um documento numa coleção `requisicoes`, com estes campos:

```json
{
  "jogoId": "6ae513e90dbc3fc3739b880d",
  "nomeAluno": "Aluno Exemplo",
  "numeroAluno": 1234,
  "turma": "11.º IG",
  "email": "aluno.exemplo@escola.example",
  "dataNascimento": "2009-03-14",
  "morada": "Rua Exemplo, 1",
  "telemovel": "910000000",
  "dataRequisicao": "2026-11-04",
  "dataDevolucao": "2026-11-11"
}
```

O único ecrã que vai usar estes dados é o do professor responsável. Para cada jogo emprestado, mostra o nome do aluno, a turma e a data em que tem de o devolver. Quando um jogo não é devolvido a tempo, o professor fala com o aluno na escola.

a) Que campos são dados pessoais?

b) Que campos deixavas de guardar? Para cada um, diz porquê numa frase.

c) Quem consegue ver estes dados, além do professor responsável? Pensa na base de dados, e não só no ecrã.

d) Os dados do exemplo são inventados. Porque é que a base de teste do clube não pode ter os dados de alunos verdadeiros, nem os dos teus colegas?

Rever: [Só se guarda o dado pessoal que um ecrã usa](../05-ligacao-segura-crud-e-regras-de-dominio.md#só-se-guarda-o-dado-pessoal-que-um-ecrã-usa).

## Escrever e corrigir código

Os exercícios 4 e 5 correm na pasta `ficha-05`, sem internet: como ela está dentro do teu projeto, o Node encontra o Mongoose que lá instalaste. O `npm ls mongoose`, na pasta do projeto, confirma que ele lá está. Cada exercício traz um ficheiro de experiência, que corre o teu código com vários casos, no terminal, dentro dessa pasta.

### Exercício 4: a lista fechada do clube

Na pasta `ficha-05`, cria o ficheiro `campos.js` e escreve nele a função `lerCamposDoJogo(corpo)`, exportada. Faz o que a `lerCamposDoArtigo` do guia faz, mas para os campos de um jogo do clube, com os tipos do contrato. As regras dos valores, como os limites e os géneros, ficam para o schema, no exercício 5. Devolve `{ erro }`, com uma mensagem que diz qual é o campo, ao primeiro problema, ou `{ dados }`, com os campos lidos.

Na mesma pasta, cria o `experimentar-campos.js`, com este conteúdo:

```js check
// experimentar-campos.js: experimenta a função lerCamposDoJogo, do exercício 4.
// Corre-se na pasta ficha-05, com: node experimentar-campos.js
import { lerCamposDoJogo } from "./campos.js";

// Cada corpo é o que um pedido podia trazer em req.body.
const corpos = [
  { titulo: "Fall Guys", genero: "Festa", jogadoresMax: 4, disponivel: true },
  { titulo: "Fall Guys", disponivel: "true" },
  { titulo: "Fall Guys", requisicoes: 0 },
  { jogadoresMax: 4.5 },
  { titulo: { $ne: null } },
  [],
  {},
  { disponivel: false },
];

for (const corpo of corpos) {
  console.log(JSON.stringify(corpo), "dá", JSON.stringify(lerCamposDoJogo(corpo)));
}
```

Cada linha tem de dar o que a lista fechada e os tipos do contrato pedem para esse corpo. Umas dão um `erro`, que fala de um campo ou do corpo, e outras os `dados`.

Num comentário no fim do `campos.js`, responde a esta pergunta: o Mongoose converte o texto `"true"` no booleano `true`, sem dar erro. O que acontecia a um pedido com `"disponivel": "false"` se a tua função não verificasse o tipo do `disponivel`?

Rever: [Só passam os campos de uma lista fechada](../05-ligacao-segura-crud-e-regras-de-dominio.md#só-passam-os-campos-de-uma-lista-fechada) e [As regras de cada campo ficam no schema](../05-ligacao-segura-crud-e-regras-de-dominio.md#as-regras-de-cada-campo-ficam-no-schema).

### Exercício 5: as regras do jogo, no schema

Na pasta `ficha-05`, cria o ficheiro `jogo.model.js`, com o schema e o modelo dos jogos do clube. O modelo exporta-se com o nome `Jogo`, e a coleção é a `jogos`. Escreve as regras de cada campo com as mensagens que quiseres, em português.

O campo `requisicoes` precisa de uma regra que o guia não mostrou. O `default` dá ao campo um valor quando ele não vem: `default: 0` faz com que um jogo novo comece com 0 requisições. As requisições também nunca podem ser negativas.

Na mesma pasta, cria o `experimentar-schema.js`, com este conteúdo:

```js check
// experimentar-schema.js: experimenta as regras do schema do jogo, do exercício 5.
// Corre-se na pasta ficha-05, com: node experimentar-schema.js
// Não precisa do Atlas: o validate verifica as regras sem escrever nada na base.
import { Jogo } from "./jogo.model.js";

const jogos = [
  { titulo: "Fall Guys", genero: "Festa", jogadoresMax: 4, disponivel: true },
  { genero: "Festa", jogadoresMax: 4, disponivel: true },
  { titulo: "Fall Guys", genero: "Terror", jogadoresMax: 4, disponivel: true },
  { titulo: "Fall Guys", genero: "Festa", jogadoresMax: 0, disponivel: true },
  { titulo: "Fall Guys", genero: "Festa", jogadoresMax: 17, disponivel: true },
  { titulo: "Fall Guys", genero: "Festa", jogadoresMax: 4, disponivel: false },
  { titulo: "   ", genero: "Festa", jogadoresMax: 4, disponivel: true },
  { titulo: "Fall Guys", genero: "Festa", jogadoresMax: 4, disponivel: true, requisicoes: -1 },
];

for (const dados of jogos) {
  const jogo = new Jogo(dados);
  try {
    await jogo.validate();
    console.log("aceite:", JSON.stringify(jogo));
  } catch (erro) {
    const mensagens = Object.values(erro.errors).map((falha) => falha.message);
    console.log("recusado:", mensagens.join(". "));
  }
}
```

Cada jogo tem de ser aceite ou recusado como o contrato do clube pede. A primeira linha tem de mostrar o jogo com `"requisicoes":0`, que ninguém escreveu nos dados. O `_id` que aparece também ninguém o escreveu: é o Mongoose que o dá, quando cria o documento, mesmo sem base.

Rever: [As regras de cada campo ficam no schema](../05-ligacao-segura-crud-e-regras-de-dominio.md#as-regras-de-cada-campo-ficam-no-schema).

<details>
<summary>Pista</summary>

O guia não mostra todas as regras de um schema. A página da validação do Mongoose, em [Para saber mais](../05-ligacao-segura-crud-e-regras-de-dominio.md#para-saber-mais), no fim do guia, tem as outras.

</details>

### Exercício 6: encontra os erros

Cada um destes três pedaços da `clube-api` tem pelo menos um erro. Para cada um, escreve no `respostas-05.md` o que acontece, com o pedido ou o comando que o mostra, a causa e a correção.

a) O script que apaga os jogos de um género:

```js
// src/apagar-genero.js: apaga os jogos de um género.
// Corre-se com: node --env-file=.env src/apagar-genero.js Festa
import mongoose from "mongoose";
import { ligarBaseDeDados } from "./db/mongoose.js";
import { Jogo } from "./models/jogo.model.js";

const genero = process.argv[2];

try {
  await ligarBaseDeDados();
  // O filtro começa vazio, e o género entra quando vem no comando.
  const filtro = {};
  if (genero) {
    filtro.genero = genero;
  }
  const resultado = await Jogo.deleteMany(filtro);
  console.log(`Apagados ${resultado.deletedCount} jogos`);
} catch (erro) {
  console.error(`O script falhou: ${erro.message}`);
}

await mongoose.disconnect();
```

Um colega correu `node --env-file=.env src/apagar-genero.js`, esquecendo-se do género no fim. O que aconteceu à coleção, e porquê? Corrige o script. E com `Festa` no fim do comando: o que apaga, e há alguma regra do clube que o script não respeita?

b) A função do service que apaga um jogo:

```js
/**
 * Apaga um jogo, se a regra do clube o deixar.
 * @param {string} id um identificador já verificado pelo controller
 * @returns {Promise<string>} o que aconteceu: "apagado", "nao-existe" ou "emprestado"
 */
export async function apagarJogo(id) {
  const jogo = await procurarPorId(id);
  if (jogo === null) {
    return "nao-existe";
  }
  // Regra do clube: um jogo emprestado não se apaga, porque ainda não voltou.
  if (jogo.disponivel) {
    return "emprestado";
  }
  await apagarPorId(id);
  return "apagado";
}
```

c) A função do repository que altera um jogo:

```js
/**
 * Altera os campos recebidos de um jogo.
 * @param {string} id um identificador já verificado pelo controller
 * @param {object} dados os campos a alterar, só os da lista do controller
 * @returns {Promise<object | null>} o jogo depois da alteração, ou null se não existir
 */
export async function alterarPorId(id, dados) {
  const resultado = await Jogo.updateOne({ _id: id }, dados, { runValidators: true });
  return resultado;
}
```

Para este, lê o que a documentação do Mongoose diz do `updateOne`, na secção `Model.updateOne()`. Que responde um `PATCH` com `{ "jogadoresMax": 2 }` ao Tetris? E o mesmo pedido a `/api/jogos/000000000000000000000000`?

Rever: [Antes de apagar muitos, vê o que o filtro escolhe](../05-ligacao-segura-crud-e-regras-de-dominio.md#antes-de-apagar-muitos-vê-o-que-o-filtro-escolhe), [Uma regra que precisa da base fica no service](../05-ligacao-segura-crud-e-regras-de-dominio.md#uma-regra-que-precisa-da-base-fica-no-service) e [Alterar um documento pede duas opções](../05-ligacao-segura-crud-e-regras-de-dominio.md#alterar-um-documento-pede-duas-opções).

<details>
<summary>Pista</summary>

Na alínea b), segue o `DELETE` do Tetris e o do Mario Kart. Na c), segue o pedido pelo controller.

</details>

### Exercício 7: ver o que vai mudar antes de apagar

O clube quer tirar da coleção os jogos que estão disponíveis e que nunca foram requisitados. As respostas vão para o `respostas-05.md`.

a) Escreve o filtro do MongoDB que escolhe esses jogos, e os títulos dos jogos do cenário que ele escolhe.

b) Escreve as linhas de um script que, com esse filtro, mostra primeiro quantos jogos vão sair e quais, e só depois os apaga. O filtro escreve-se uma só vez.

c) Um colega escreveu o filtro só com `{ disponivel: true }`. Quantos jogos apagava, e quais?

Rever: [Antes de apagar muitos, vê o que o filtro escolhe](../05-ligacao-segura-crud-e-regras-de-dominio.md#antes-de-apagar-muitos-vê-o-que-o-filtro-escolhe).

## Desafios

### Desafio 1: requisitar um jogo

O clube quer um pedido que regista a requisição de um jogo: o jogo passa a estar emprestado, e as requisições aumentam uma. Um jogo que já está emprestado não se pode requisitar.

1. Escreve as linhas do contrato do pedido: o método, o caminho, o corpo, se o tiver, e as respostas possíveis, com os códigos.
2. Diz em que camada fica cada parte, como na tabela do [passo 2 do exemplo guiado](../05-ligacao-segura-crud-e-regras-de-dominio.md#passo-2-em-que-camada-fica-cada-parte) do guia.
3. Escreve o código que o faz.

As decisões que tens de tomar: o pedido não precisa de corpo, porque não há nada a escolher. O que deve a API responder se vier um? E o `requisicoes` aumenta, mas a lista fechada não o aceita no corpo: quem o aumenta, e onde?

### Desafio 2: a requisição numa só operação

Na tua função do desafio 1, entre ler o jogo e alterá-lo passa um instante, e dois pedidos ao mesmo tempo podiam requisitar o mesmo jogo. O MongoDB consegue verificar e alterar numa só operação. O `findOneAndUpdate` com o filtro `{ _id: id, disponivel: true }` só encontra o jogo se ele ainda estiver disponível. O operador `$inc`, de incrementar, aumenta um número sem o ler primeiro: `{ $inc: { requisicoes: 1 } }`. Escreve a função do repository que faz a requisição numa só operação. Explica também como é que o service distingue, quando ela devolve `null`, um jogo que não existe de um jogo emprestado.

## Critérios de conclusão

- Os exercícios 1, 2, 3, 6 e 7 estão respondidos no `respostas-05.md`, com o porquê de cada resposta.
- O `experimentar-campos.js` corre, e cada uma das oito linhas dá o que a lista fechada e os tipos do contrato pedem para esse corpo. O `campos.js` acaba com o comentário que responde à pergunta do `"disponivel": "false"`.
- O `experimentar-schema.js` corre, cada jogo é aceite ou recusado como o contrato do clube pede, e a primeira linha mostra o `"requisicoes":0`.
- No exercício 6, cada erro tem o pedido ou o comando que o mostra, a causa e a correção.

![Rodapé](../../imagens/rodape.png)
