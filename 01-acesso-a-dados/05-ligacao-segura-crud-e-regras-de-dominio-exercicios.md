![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: Ligação segura, CRUD e regras de domínio

Ficha do tema Ligação segura, CRUD e regras de domínio, do módulo M14, Acesso a Bases de Dados. Praticas, noutro problema, as decisões do tema. São quatro: o que um pedido pode trazer, em que camada fica cada regra, o que se guarda sobre as pessoas e como se apaga sem surpresas. Fazes sozinho, ao teu ritmo: o que não acabares na aula, acabas em casa ou na aula seguinte.

## O que precisas de saber

O [guia do tema](05-ligacao-segura-crud-e-regras-de-dominio.md) e o laboratório que fizeste: o [da papelaria](05-ligacao-segura-crud-e-regras-de-dominio-laboratorio.md) ou o [do cinema da escola](05-ligacao-segura-crud-e-regras-de-dominio-laboratorio-cinema.md).

## Como trabalhar

A parte obrigatória são os exercícios 1 a 7, por esta ordem. Os exercícios 1, 2, 3, 6 e 7 fazem-se em papel. Os exercícios 4 e 5 fazem-se no computador, numa pasta que preparas antes do exercício 4, e não precisam de internet nem do Atlas. O desafio e o "Para ires mais longe" são opcionais.

Nos exercícios em papel, responde antes de experimentar. Nos do computador, escreve no caderno o que esperas de cada linha antes de correres o ficheiro de experiência. Se precisares de ajuda, o [Apoio](#apoio) diz onde procurar em cada exercício.

Entrega as respostas no caderno e a pasta `ficha-05`, com os ficheiros dos exercícios 4 e 5. As resoluções são trabalhadas na aula.

## O cenário: o clube de videojogos, no MongoDB

No guia e no laboratório trabalhaste com a papelaria ou com o cinema. Esta ficha usa o clube de videojogos da escola, que conheces da ficha de revisão. O clube passou os jogos para o MongoDB, e tem uma API em camadas, a `clube-api`, organizada como a tua.

Cada jogo tem o título, o género, o número máximo de jogadores (`jogadoresMax`), se está disponível agora ou emprestado (`disponivel`) e quantas vezes já foi requisitado (`requisicoes`). Na base de teste, a coleção `jogos` tem estes seis. Nesta ficha, o seed do clube escreve os `_id` à mão, sempre os mesmos, para os pedidos se poderem escrever no papel. Na tua API, é o MongoDB que os dá, e cada seed dá outros.

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
| `titulo` | texto | obrigatório; até 50 carateres, sem os espaços do início e do fim |
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

## Em papel

### Exercício 1: ler o contrato

Para cada pedido, escreve no caderno o código da resposta e, numa linha, porquê. Os pedidos fazem-se pela ordem da tabela, e cada um parte da base como o anterior a deixou.

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

### Exercício 2: em que camada fica cada regra

Para cada regra do clube, escreve no caderno a camada onde fica, o controller, o schema ou o service, e uma frase que diga porquê. A última é uma regra que o clube quer acrescentar à API, e que o contrato ainda não tem.

1. O `jogadoresMax` é um número inteiro.
2. O `jogadoresMax` vai de 1 a 16.
3. O corpo de um pedido não traz o campo `requisicoes`.
4. O género é um dos cinco do clube.
5. Um jogo emprestado não se apaga.
6. Não há dois jogos com o mesmo título.

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

## No computador

Os exercícios 4 e 5 fazem-se numa pasta `ficha-05`, dentro do projeto do teu laboratório, a `papelaria-api` ou a `cinema-da-escola`. Assim, o Node encontra o Mongoose que já lá instalaste, e não precisas de internet. Nenhum dos dois exercícios se liga ao Atlas.

Prepara a pasta assim:

1. Na raiz do teu projeto, cria a pasta `ficha-05`.
2. Nela, cria os dois ficheiros de experiência, com este conteúdo. Não fazem parte de nenhum exercício: só correm o que escreves.

   O `experimentar-campos.js`, para o exercício 4:

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

   O `experimentar-schema.js`, para o exercício 5:

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

3. No terminal, entra na pasta com `cd ficha-05`. Os dois ficheiros de experiência só correm depois de escreveres os ficheiros dos exercícios, porque cada um importa um deles.

### Exercício 4: a lista fechada do clube

Na pasta `ficha-05`, cria o ficheiro `campos.js` e escreve nele a função `lerCamposDoJogo(corpo)`, exportada. Faz o que a `lerCamposDoArtigo` ou a `lerCamposDoFilme` do laboratório fazem, mas para os campos de um jogo do clube, com os tipos do contrato. As regras dos valores, como os limites e os géneros, ficam para o schema, no exercício 5. Devolve `{ erro }`, com uma mensagem que diz qual é o campo, ao primeiro problema, ou `{ dados }`, com os campos lidos.

Antes de correres o `experimentar-campos.js`, escreve no caderno o que esperas de cada uma das oito linhas. Pode ser um `erro`, e então diz se fala de um campo ou do corpo, ou podem ser os `dados`. Depois, corre-o com `node experimentar-campos.js` e compara.

Quando acabares, responde no caderno: o Mongoose converte o texto `"true"` no booleano `true`, sem dar erro. O que acontecia a um pedido com `"disponivel": "false"` se a tua função não verificasse o tipo do `disponivel`?

### Exercício 5: as regras do jogo, no schema

Na pasta `ficha-05`, cria o ficheiro `jogo.model.js`, com o schema e o modelo dos jogos do clube. O modelo exporta-se com o nome `Jogo`, e a coleção é a `jogos`. Escreve as regras de cada campo com as mensagens que quiseres, em português.

O campo `requisicoes` precisa de uma regra que o guia não mostrou. O `default` dá ao campo um valor quando ele não vem: `default: 0` faz com que um jogo novo comece com 0 requisições. As requisições também nunca podem ser negativas.

Antes de correres o `experimentar-schema.js`, escreve no caderno, para cada uma das sete linhas, se o jogo é aceite ou recusado e, se for recusado, por que regra. Depois, corre-o com `node experimentar-schema.js` e compara. A primeira linha tem de mostrar o jogo com `"requisicoes":0`, que ninguém escreveu nos dados.

### Exercício 6: encontra os erros

Cada um destes três pedaços da `clube-api` tem pelo menos um erro. Para cada um, escreve no caderno o que se vê, com o pedido ou o comando que o mostra, a causa e a correção.

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

Um colega correu `node --env-file=.env src/apagar-genero.js`, esquecendo-se do género no fim. O que aconteceu à coleção, e porquê? Corrige o script. Depois, pensa no comando com `Festa`: o que apaga, e há alguma regra do clube que o script não respeita?

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

Para este, pensa no que responde um `PATCH` ao Tetris e um `PATCH` a `/api/jogos/000000000000000000000000`.

### Exercício 7: ver o que vai mudar antes de apagar

O clube quer tirar da coleção os jogos que estão disponíveis e que nunca foram requisitados.

a) Escreve o filtro do MongoDB que escolhe esses jogos.

b) Aplica o teu filtro à tabela do cenário, linha a linha, e escreve os títulos dos jogos que ele escolhe.

c) Escreve as linhas de um script que, com esse filtro, mostra primeiro quantos jogos vão sair e quais, e só depois os apaga. O filtro escreve-se uma só vez.

d) Um colega escreveu o filtro só com `{ disponivel: true }`. Quantos jogos apagava, e quais?

## Apoio

- Exercício 1: em cada pedido, segue a ordem das verificações do controller: primeiro a forma do `id`, depois a lista fechada, depois as regras do schema ou do service. Os pedidos 9 e 10 são sobre o mesmo jogo, e o 10 vê a base como o 9 a deixou.
- Exercício 2: pergunta, para cada regra, se ela é sobre a forma do pedido, sobre o valor de um campo, ou se precisa de ir à base ver outros documentos.
- Exercício 3: a secção "Os dados pessoais e o RGPD" do guia. Para cada campo, procura o ecrã que o usa.
- Exercício 4: começa pela função do teu laboratório. O que muda é a lista dos campos e um tipo que ela não tinha.
- Exercício 5: a secção "As regras de cada campo, no schema" do guia, e o modelo do teu laboratório.
- Exercício 6: na alínea a), escreve o filtro que o script constrói quando o comando não traz a terceira palavra. Depois, pensa no que esse filtro faz num `find` e num `deleteMany`. Na b), segue o `DELETE` do Tetris e o do Mario Kart. Na c), vê na documentação do Mongoose, na secção `Model.updateOne()`, o que esta função devolve, e segue o que o controller faz com isso.
- Exercício 7: a secção "Ver o que vai mudar antes de mudar muitos" do guia, e o script de apagar do teu laboratório.

## Desafio opcional

**Requisitar um jogo.** O clube quer um pedido que regista a requisição de um jogo: o jogo passa a estar emprestado, e as requisições aumentam uma. Um jogo que já está emprestado não se pode requisitar.

1. Escreve, no caderno, as linhas do contrato do pedido: o método, o caminho, o corpo, se o tiver, e as respostas possíveis, com os códigos.
2. Diz em que camada fica cada parte, como na tabela do passo 2 do exemplo guiado do guia.
3. Escreve a função do service e a do controller.

As decisões novas: o pedido não precisa de corpo, porque não há nada a escolher, e por isso o que deve responder a API se vier um? E o `requisicoes` aumenta, mas a lista fechada não o aceita no corpo: quem o aumenta, e onde?

## Para ires mais longe

Na tua função do desafio, entre ler o jogo e alterá-lo passa um instante, e dois pedidos ao mesmo tempo podiam requisitar o mesmo jogo. O MongoDB consegue verificar e alterar numa só operação. O `findOneAndUpdate` com o filtro `{ _id: id, disponivel: true }` só encontra o jogo se ele ainda estiver disponível. O operador `$inc`, de incrementar, aumenta um número sem o ler primeiro: `{ $inc: { requisicoes: 1 } }`. Escreve a função do repository que faz a requisição numa só operação. Depois, explica como é que o service distingue, quando ela devolve `null`, um jogo que não existe de um jogo emprestado.

## Critérios de conclusão

- Os exercícios 1, 2, 3, 6 e 7 estão respondidos no caderno, com o porquê de cada resposta.
- O `experimentar-campos.js` dá, nas oito linhas, o que escreveste no caderno, ou explicaste a diferença.
- O `experimentar-schema.js` dá, nas sete linhas, o que escreveste no caderno, ou explicaste a diferença, e a primeira linha mostra o `"requisicoes":0`.
- No exercício 6, cada erro tem o pedido ou o comando que o mostra, a causa e a correção.

## Autoavaliação

1. Que regra do exercício 2 te fez hesitar entre duas camadas, e como decidiste?
2. No exercício 6, que erro te parece mais perigoso numa aplicação verdadeira, e porquê?
3. Que dúvida concreta levas para a aula?

![Rodapé](../imagens/rodape.png)
