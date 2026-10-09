![Cabeçalho](../imagens/cabecalho.png)

# API Express e contratos

Módulo M14, Acesso a Bases de Dados. Três aulas de 60 minutos. A primeira é de teoria, com este guia. As outras duas são de laboratório, em que escreves o contrato da API da papelaria e as três camadas que o cumprem, seguindo o [guia do laboratório](04-api-express-e-contratos-laboratorio.md). Os exercícios para fazeres sozinho estão na [ficha](04-api-express-e-contratos-exercicios.md).

## Neste guia

1. O que vais aprender
2. O que já sabes e vais usar
3. O que é o contrato de uma API
4. O contrato da API da papelaria
5. Um formato único para os erros
6. Verificar à entrada, no controller
7. As camadas em código
8. A ordem das rotas dentro do router
9. Exemplo guiado: do contrato às respostas verificadas
10. Erros frequentes
11. Verificar o que aprendeste
12. O que vem a seguir
13. Para saber mais

## O que vais aprender

No tema anterior desenhaste as camadas da API da papelaria e preparaste o projeto, com uma só rota, a de estado. Neste tema a API começa a responder a pedidos a sério: a lista dos artigos, com filtros, um artigo de cada vez e os artigos que é preciso encomendar. Os artigos ainda estão num array, dentro do servidor, e só passam para o MongoDB Atlas no tema seguinte. Mas a API já se comporta como uma API a sério: responde sempre em JSON, recusa os pedidos mal feitos com o código certo e cumpre um contrato escrito.

O contrato é a ideia central do tema. Uma API é usada por programas, como a tua interface em React. Um programa não consegue adivinhar o que a API quis dizer: precisa de saber exatamente o que pedir e o que vai receber, incluindo quando corre mal. Escrever isso antes de escrever o código é o que permite construir as duas partes da aplicação sem se desencontrarem.

No fim deste guia deves conseguir:

- explicar o que é o contrato de uma API e para que serve;
- escrever o contrato de um pedido: o método, o caminho, os parâmetros, com os tipos e os limites, e todas as respostas possíveis;
- usar um formato único para os erros em toda a API;
- verificar no controller o que chega no pedido, e responder 400 quando não serve;
- escrever as rotas, o controller e o service de um recurso em ficheiros separados, ligados com `import` e `export`, e montar as rotas com um router;
- verificar, pedido a pedido, que a API cumpre o contrato, com as respostas 200, 400 e 404.

## O que já sabes e vais usar

Do tema anterior, em Linguagens de Programação: as três partes da aplicação, as quatro camadas da API e o que faz cada uma, e o esqueleto da API da papelaria, com os scripts, o `.env`, o `.gitignore` e o primeiro commit. Este tema continua nesse projeto.

Do tema anterior também, os artigos da papelaria: são os oito que inseriste no Atlas no tema do modelo documental, com o nome, a categoria, o stock, o stock mínimo e o preço em cêntimos.

De Sistemas de Informação, do tema "HTTP, rotas e middleware", que é a mesma turma: os dados que chegam no caminho (`req.params`) e na pesquisa (`req.query`), sempre como texto; os códigos 200, 400 e 404, e a diferença entre um parâmetro inválido e um recurso inexistente; o `return` depois de uma resposta de erro; e o middleware, registado com `app.use`, incluindo o middleware final que responde aos pedidos que nenhuma rota tratou. Este guia usa estas ideias sem as voltar a explicar. Se ainda não deste esse tema em Sistemas de Informação, lê as secções 3, 5 e 6 do guia de lá antes de continuares.

De JavaScript: `import` e `export`, os métodos `filter` e `find` dos arrays, e os comentários de documentação com `/** ... */`, que descrevem uma função.

## O que é o contrato de uma API

Imagina que estás a escrever o componente React que mostra os artigos da papelaria e que a API está a ser escrita por um colega. Para escreveres o teu `fetch`, precisas de saber: que endereço peço? Com que parâmetros? O que vem na resposta: um array, um objeto, com que campos? E se o artigo não existir, como é que sei? O colega, para escrever a API, precisa de saber o mesmo, do outro lado. Se cada um decidir por si, quando juntarem as duas partes nada encaixa.

O **contrato** de uma API é o documento que responde a estas perguntas, pedido a pedido. Para cada pedido diz:

- o método e o caminho;
- os parâmetros que aceita, onde vêm (caminho, pesquisa ou corpo), de que tipo são, se são obrigatórios e que valores são válidos;
- a resposta quando corre bem: o código e a forma do JSON, com os nomes e os tipos dos campos;
- todas as respostas de erro possíveis: o código e quando acontece.

Chama-se contrato porque obriga as duas partes. A API compromete-se a responder assim; o cliente compromete-se a pedir assim. Enquanto os dois cumprirem, cada um pode mudar o seu código à vontade, por dentro, sem estragar o outro.

Na tua aplicação, o colega és tu, daqui a umas semanas: quando escreveres o React, no tema da integração, o contrato que escreveres agora é o que te diz como usar a tua própria API. E é também o que permite verificar a API antes de haver React nenhum: se a API responde ao que o contrato diz, está certa.

Em Sistemas de Informação escreveste uma tabela de contratos HTTP do catálogo, que regista como o servidor responde a cada pedido. O contrato de uma API é a mesma ideia levada mais longe: escreve-se antes do código, diz a forma exata do JSON de cada resposta, e vive dentro do projeto, num ficheiro guardado no Git, ao lado do código que o cumpre.

## O contrato da API da papelaria

A interface React da papelaria vai precisar, por agora, de três pedidos. O contrato deles, escrito antes de qualquer código, é este. Está também no [contrato do exemplo publicado](../exemplos/acesso-a-dados/papelaria-api-com-camadas/contrato-da-api.md), que acrescenta a rota de estado e a tabela dos campos de um artigo.

### Listar os artigos

`GET /api/artigos`

| Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
| --- | --- | --- | --- | --- |
| `categoria` | pesquisa | texto | não | qualquer; só aparecem os artigos dessa categoria |
| `stockMaximo` | pesquisa | inteiro | não | 0 ou mais; só aparecem os artigos com stock até esse valor, incluído |

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | sempre que os parâmetros são válidos | lista de artigos, possivelmente vazia |
| 400 | `stockMaximo` vem vazio (`?stockMaximo=`), não é um inteiro, ou é negativo | erro |

Cada artigo da lista tem esta forma:

```json
{ "id": 1, "nome": "Caderno A4 quadriculado", "categoria": "Papel", "stock": 12, "stockMinimo": 5, "precoCentimos": 250 }
```

O `id` é um inteiro, e o preço vem em cêntimos, como no modelo do tema do Atlas.

### Ver um artigo

`GET /api/artigos/:id`

| Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
| --- | --- | --- | --- | --- |
| `id` | caminho | inteiro | sim | 1 ou mais |

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | o artigo existe | o artigo |
| 400 | o `id` não é um inteiro positivo | erro |
| 404 | não existe nenhum artigo com esse `id` | erro |

### Artigos a encomendar

`GET /api/artigos/abaixo-do-minimo`

Sem parâmetros. Devolve os artigos cujo stock está abaixo do stock mínimo, que a papelaria tem de encomendar.

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | sempre | lista de artigos, possivelmente vazia |

### Qualquer outro pedido

| Código | Quando | Corpo |
| --- | --- | --- |
| 404 | o caminho não existe na API | erro, com a mensagem `Rota não encontrada` |

### Os erros

Todas as respostas de erro têm a mesma forma:

```json
{ "erro": "Não existe o artigo 99" }
```

Repara no que o contrato não diz: não diz como a API está organizada por dentro, nem se os artigos estão num array ou no Atlas. Isso é decisão de quem escreve a API, e pode mudar sem o contrato mudar. É exatamente o que vai acontecer no tema seguinte.

## Um formato único para os erros

A última secção do contrato parece um pormenor, e é uma das decisões mais importantes. Uma API onde um erro vem como `{ "erro": "..." }`, outro como `{ "mensagem": "..." }` e um terceiro como texto simples obriga o cliente a tratar cada pedido de maneira diferente. Com um formato único, o cliente trata todos os erros da mesma forma. No React, é assim que fica, para qualquer pedido à tua API:

```js
const resposta = await fetch(`/api/artigos/${id}`);
const dados = await resposta.json();
if (!resposta.ok) {
  // Qualquer erro da API traz a mensagem em dados.erro.
  setMensagemDeErro(dados.erro);
  return;
}
setArtigo(dados);
```

O `resposta.ok` é verdadeiro para os códigos 2xx e falso para os outros. O componente não precisa de saber qual foi o erro para o mostrar: a API garantiu que a mensagem está sempre em `erro`. É por isso que, neste guia, até o middleware final, o que responde aos caminhos que não existem, responde em JSON, e não com a página `Cannot GET` do Express nem com texto.

As mensagens de erro são para quem usa a aplicação, ou para quem programa o cliente. Dizem o que estava errado no pedido, de forma que se perceba o que corrigir: "O identificador do artigo tem de ser um número inteiro positivo", e não "Erro" nem "NaN". E nunca mostram o que está dentro do servidor: nem nomes de ficheiros, nem mensagens do Node, nem pormenores da base de dados.

## Verificar à entrada, no controller

Tudo o que chega num pedido chega como texto e pode chegar errado: `?stockMaximo=abc`, `/api/artigos/-3`, ou com parâmetros que a API não conhece, como `?ordem=preco`. A regra deste módulo é verificar à entrada, no controller, antes de chamar o service:

1. Só se leem os parâmetros que o contrato prevê. O controller lê `req.query.categoria` e `req.query.stockMaximo`, um a um, e constrói com eles os filtros que passa ao service. Um parâmetro que o contrato não prevê é ignorado. Nunca se passa o `req.query` inteiro ao service: no tema seguinte, esses filtros vão chegar ao MongoDB, e um parâmetro que ninguém previu pode transformar-se numa consulta que ninguém quis.
2. Os números convertem-se e verificam-se. `stockMaximo` tem de ser um inteiro, zero ou mais; o `id`, um inteiro, um ou mais. Um valor vazio, como em `?stockMaximo=`, também não é um inteiro, e a secção do controller mostra porque é que este caso precisa de cuidado. Se o valor não servir, a resposta é 400 e o pedido acaba ali.
3. O service recebe valores já verificados e do tipo certo. Recebe o número 5, e não o texto `"5"`. Não tem de desconfiar do que recebe, e por isso pode concentrar-se nas regras da papelaria.

Repara na fronteira entre as duas camadas. Saber se `"abc"` é um número é um problema do pedido HTTP, e é do controller. Saber se um artigo tem de ser encomendado é uma regra da papelaria, e é do service.

## As camadas em código

Cada camada vive no seu ficheiro, numa pasta própria dentro de `src`. Os nomes dos ficheiros dizem o recurso e a camada, para se distinguirem nos separadores do editor:

```text
papelaria-api/
├── contrato-da-api.md
└── src/
    ├── server.js
    ├── dados/
    │   └── artigos.dados.js           os artigos, por agora num array
    ├── services/
    │   └── artigos.service.js         as regras sobre os artigos
    ├── controllers/
    │   └── artigos.controller.js      o HTTP dos artigos
    └── rotas/
        └── artigos.rotas.js           que pedido vai para que função
```

A pasta `dados` é provisória. No tema seguinte é substituída pelo repository, que vai buscar os artigos ao Atlas; o service passa a chamar o repository em vez de ler o array. Por agora, os dados temporários ocupam o lugar do repository, como o diagrama do tema anterior previa.

As camadas ligam-se umas às outras com `import` e `export`, de baixo para cima: o service importa os dados, o controller importa o service, as rotas importam o controller e o `server.js` importa as rotas. Nenhuma camada importa uma que esteja acima dela: o service não sabe que o controller existe.

Nos `import` dos teus próprios ficheiros, o caminho começa por `./` ou `../` e acaba sempre na extensão `.js`. Nos módulos ES do Node, a extensão não é opcional: sem ela, o Node não encontra o ficheiro.

### Os dados temporários

```js check
// src/dados/artigos.dados.js: os artigos da papelaria, em memória.
// São dados temporários: no tema da ligação segura, passam a vir do MongoDB Atlas.
// Os artigos são os mesmos que inseriste no Atlas, com um id numérico em vez do _id.

export const artigos = [
  { id: 1, nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250 },
  { id: 2, nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60 },
  { id: 3, nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180 },
  { id: 4, nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35 },
  { id: 5, nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520 },
  { id: 6, nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95 },
  { id: 7, nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120 },
  { id: 8, nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450 },
];
```

Um `export` com nome: o array chama-se `artigos` e é com esse nome que se importa. São os oito artigos do Atlas, com um `id` inteiro no lugar do `_id`. A `localizacao` ficou de fora, porque nenhum pedido do contrato a usa.

### O service

```js check
// src/services/artigos.service.js: as regras da papelaria sobre os artigos.
// Recebe valores simples e devolve valores simples. Não sabe nada de HTTP:
// não usa req nem res, e por isso pode ser usado e testado sem servidor.
import { artigos } from "../dados/artigos.dados.js";

/**
 * Devolve os artigos que cumprem os filtros recebidos.
 * Os filtros já chegam verificados pelo controller; os que faltam não se aplicam.
 * @param {object} filtros com categoria (texto) e stockMaximo (número), os dois opcionais
 * @returns {object[]} uma lista nova, possivelmente vazia
 */
export function listarArtigos(filtros) {
  let resultado = artigos;
  if (filtros.categoria !== undefined) {
    resultado = resultado.filter((artigo) => artigo.categoria === filtros.categoria);
  }
  if (filtros.stockMaximo !== undefined) {
    resultado = resultado.filter((artigo) => artigo.stock <= filtros.stockMaximo);
  }
  return resultado;
}

/**
 * Procura um artigo pelo id.
 * @param {number} id um inteiro positivo, já verificado pelo controller
 * @returns {object | null} o artigo, ou null se não existir
 */
export function obterArtigo(id) {
  const artigo = artigos.find((artigo) => artigo.id === id);
  if (!artigo) {
    return null;
  }
  return artigo;
}

/**
 * Regra da papelaria: um artigo está abaixo do mínimo quando o stock é
 * menor do que o stock mínimo definido para ele, e é preciso encomendá-lo.
 * @returns {object[]} os artigos a encomendar, possivelmente nenhum
 */
export function artigosAbaixoDoMinimo() {
  return artigos.filter((artigo) => artigo.stock < artigo.stockMinimo);
}
```

Três funções, cada uma com o seu comentário de documentação: o que faz, o que recebe (`@param`) e o que devolve (`@returns`). Nenhuma usa `req` nem `res`. A `listarArtigos` aplica só os filtros que vierem, um de cada vez, ao resultado do anterior; sem filtros, devolve todos. A `obterArtigo` devolve `null` quando não encontra: o service não decide que isso é um 404, porque não sabe o que é um 404. Diz só "não há", e o controller traduz. A `artigosAbaixoDoMinimo` é a regra da papelaria: stock menor do que o stock mínimo.

### O controller

```js check
// src/controllers/artigos.controller.js: a ponte entre o HTTP e o service.
// Lê e verifica o que vem no pedido, chama o service e escolhe o código
// e o corpo da resposta, sempre em JSON, como diz o contrato da API.
import { listarArtigos, obterArtigo, artigosAbaixoDoMinimo } from "../services/artigos.service.js";

/**
 * Converte um texto num inteiro, ou devolve null se o texto não for um inteiro.
 * @param {string} texto o valor tal como chegou no pedido
 * @returns {number | null}
 */
function paraInteiro(texto) {
  // Number("") e Number("  ") dão 0, e não NaN. Sem esta verificação,
  // ?stockMaximo= (o parâmetro sem valor) seria tratado como ?stockMaximo=0.
  // Um parâmetro repetido, como ?stockMaximo=1&stockMaximo=2, chega como
  // um array, que não é texto: também não é um inteiro.
  if (typeof texto !== "string" || texto.trim() === "") {
    return null;
  }
  const numero = Number(texto);
  return Number.isInteger(numero) ? numero : null;
}

/** GET /api/artigos, com os filtros opcionais ?categoria= e ?stockMaximo= */
export function listar(req, res) {
  const filtros = {};

  if (req.query.categoria !== undefined) {
    filtros.categoria = req.query.categoria;
  }

  if (req.query.stockMaximo !== undefined) {
    const stockMaximo = paraInteiro(req.query.stockMaximo);
    if (stockMaximo === null || stockMaximo < 0) {
      res.status(400).json({ erro: "O parâmetro stockMaximo tem de ser um número inteiro, zero ou maior" });
      return;
    }
    filtros.stockMaximo = stockMaximo;
  }

  res.json(listarArtigos(filtros));
}

/** GET /api/artigos/abaixo-do-minimo */
export function abaixoDoMinimo(req, res) {
  res.json(artigosAbaixoDoMinimo());
}

/** GET /api/artigos/:id */
export function obter(req, res) {
  const id = paraInteiro(req.params.id);
  if (id === null || id < 1) {
    res.status(400).json({ erro: "O identificador do artigo tem de ser um número inteiro positivo" });
    return;
  }
  const artigo = obterArtigo(id);
  if (artigo === null) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
}
```

Cada função exportada trata um pedido do contrato, e o comentário diz qual. A função `paraInteiro` não é exportada: é uma ajuda interna, usada duas vezes, que converte um texto num inteiro ou devolve `null`. A `listar` constrói o objeto `filtros` só com os parâmetros que vieram e que o contrato prevê, e responde 400 se o `stockMaximo` não servir. A `obter` faz as duas verificações do tema de Sistemas de Informação: primeiro se o `id` faz sentido (400), depois se o artigo existe (404). Todas as respostas, de sucesso e de erro, são JSON.

Na `paraInteiro` há uma verificação antes do `Number`, e está lá por causa de uma regra do JavaScript que apanha muita gente. Quando o `Number` recebe um texto, tira primeiro os espaços do princípio e do fim. Se o que sobra é um número bem escrito, devolve esse número: `Number("5")` dá 5, e `Number(" 5 ")` também. Se sobra outra coisa, devolve `NaN`, que quer dizer "não é um número": `Number("abc")` dá `NaN`. Mas se não sobra nada, o resultado não é `NaN`, é 0. `Number("")` e `Number("   ")` dão os dois 0. É uma regra da especificação do JavaScript desde as primeiras versões, e não muda, porque há código antigo que conta com ela.

Para a API, esta regra é uma armadilha. No pedido `/api/artigos?stockMaximo=`, o parâmetro está lá, mas sem valor. O `req.query.stockMaximo` não é `undefined`, porque o parâmetro veio: é o texto vazio, `""`. Sem a verificação, o `Number` transformava-o em 0, que é um inteiro e não é negativo, e a API respondia 200 com os artigos sem stock, que são só o bloco de notas A5. Quem fez o pedido esqueceu-se de escrever o número, e a API inventou-lhe um. O contrato diz que o `stockMaximo` tem de ser um inteiro, e um texto vazio não é um inteiro, por isso a resposta certa é 400.

É por isso que a `paraInteiro` recusa o texto vazio, ou só com espaços, antes de chamar o `Number`. O `trim()` devolve o texto sem os espaços das pontas; se o que fica é `""`, não há número nenhum para converter, e a função devolve `null`. O controller recebe `null` e responde 400, como para `?stockMaximo=abc`.

A primeira metade da condição, `typeof texto !== "string"`, protege de um caso mais raro. Se o mesmo parâmetro vier duas vezes, como em `?stockMaximo=1&stockMaximo=2`, o Express não escolhe um dos valores: entrega um array com os dois textos, `["1", "2"]`. Um array não tem o método `trim`, e chamá-lo fazia o servidor falhar: a resposta era um erro 500, numa página HTML do Express, em vez de um 400 com o formato de erro do contrato. O `typeof` confirma primeiro que o valor é mesmo um texto. Se não for, a `paraInteiro` devolve `null`, como para qualquer outro valor que não é um inteiro. Como a condição usa `||`, se a primeira metade for verdadeira a segunda nem chega a ser avaliada, e o `trim` nunca é chamado sobre um array.

Uma armadilha como esta só se encontra a pensar nos casos de fronteira de cada parâmetro: o pedido sem o parâmetro, com o parâmetro vazio, com um valor que não é um número e com um número fora dos limites. Cada um destes casos tem uma resposta no contrato, e cada um tem uma linha na verificação do passo 7.

### As rotas

```js check
// src/rotas/artigos.rotas.js: que pedido vai para que função do controller.
// Os caminhos são relativos ao sítio onde este router é montado, em server.js:
// "/" quer dizer /api/artigos, e "/:id" quer dizer /api/artigos/:id.
import express from "express";
import { listar, abaixoDoMinimo, obter } from "../controllers/artigos.controller.js";

const router = express.Router();

router.get("/", listar);
// O caminho fixo vem antes do caminho com parâmetro. Ao contrário,
// /abaixo-do-minimo seria tratado como um :id, e daria 400.
router.get("/abaixo-do-minimo", abaixoDoMinimo);
router.get("/:id", obter);

export default router;
```

`express.Router()` cria um **router**: um conjunto de rotas que se monta, todo de uma vez, num caminho do servidor. Dentro do router, os caminhos são relativos ao sítio onde ele é montado: `"/"` quer dizer `/api/artigos`, e `"/:id"` quer dizer `/api/artigos/:id`. Cada rota passa ao Express o nome de uma função do controller, sem a chamar: `listar`, e não `listar()`. É o Express que a chama, quando o pedido chega, com o `req` e o `res`.

O ficheiro tem um `export default`: exporta uma só coisa, o router, que quem importa pode chamar como quiser.

### O server.js

```js check
// src/server.js: o ponto de arranque da API da papelaria.
// Lê a configuração do ambiente, cria a aplicação Express, monta as rotas
// e liga-a à porta.
import express from "express";
import artigosRotas from "./rotas/artigos.rotas.js";

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, a API usa a 3000.
const PORTA = process.env.PORT || 3000;

const app = express();

// Rota de estado: serve para confirmar que a API está ligada e a responder.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "API da papelaria" });
});

// Todos os pedidos começados por /api/artigos seguem para o router dos artigos.
app.use("/api/artigos", artigosRotas);

// Middleware final: nenhuma rota respondeu. Responde em JSON, como o resto
// da API, para quem a usa encontrar sempre o erro no mesmo sítio.
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a API: ${erro.message}`);
    return;
  }
  console.log(`API a correr em http://localhost:${PORTA}`);
});
```

Em relação ao do tema anterior, há três diferenças. Importa o router dos artigos (com o `import` sem chavetas, que é o de um `export default`). Monta-o com `app.use("/api/artigos", artigosRotas)`: é o `app.use` do middleware, agora com um caminho, e quer dizer "os pedidos começados por `/api/artigos` seguem para este router". E acaba com o middleware final, que responde 404 em JSON, com o formato de erro do contrato.

## A ordem das rotas dentro do router

Dentro de um router, como no servidor, as rotas são experimentadas pela ordem em que foram registadas, e a primeira que corresponder responde. Isto cria uma armadilha com os parâmetros de caminho.

O caminho `"/:id"` corresponde a `/api/artigos/2`, mas também a `/api/artigos/abaixo-do-minimo`: para o Express, `abaixo-do-minimo` é só mais um valor possível do `:id`. Se a rota `"/:id"` estiver registada antes de `"/abaixo-do-minimo"`, o pedido dos artigos a encomendar vai parar à função `obter`, que tenta converter `"abaixo-do-minimo"` num número, não consegue, e responde 400. A rota certa nunca chega a correr.

A regra é esta: num router, as rotas com caminho fixo registam-se antes das rotas com parâmetros. O comentário no ficheiro das rotas está lá para que ninguém, mais tarde, mude a ordem sem saber porquê.

## Exemplo guiado: do contrato às respostas verificadas

Este exemplo junta o guia, pela ordem em que se trabalha: primeiro o contrato, depois o código de baixo para cima, e no fim a verificação, pedido a pedido. O projeto completo, no estado em que fica no fim deste exemplo, está em [papelaria-api-com-camadas](../exemplos/acesso-a-dados/papelaria-api-com-camadas/README.md).

### Passo 1: escrever o contrato

Antes de qualquer código, o ficheiro `contrato-da-api.md`, na raiz do projeto, com as quatro secções da secção 4: os três pedidos e o formato dos erros. É a especificação do que vem a seguir, e é também a lista do que vai ser verificado no passo 7.

### Passo 2: os dados

O ficheiro `src/dados/artigos.dados.js`, com o array dos oito artigos. A decisão deste passo é que campos entram em cada artigo, e o critério é o contrato: entra o que algum pedido usa ou devolve. O `id` entra porque o pedido de um artigo o procura pelo caminho. O `nome` e a `categoria` entram porque a lista os mostra, e a categoria é também um filtro. O `stock` e o `stockMinimo` entram porque o filtro `stockMaximo` e a regra dos artigos a encomendar dependem deles. O `precoCentimos` entra porque faz parte da forma do artigo no contrato. A `localizacao`, que os artigos têm no Atlas, fica de fora, porque nenhum pedido a usa. E o `_id` do Atlas dá lugar a um `id` inteiro, de 1 a 8, porque os dados ainda não vêm do Atlas e um inteiro é fácil de escrever num endereço.

O que se confirma antes de avançar: que os nomes, as categorias, os stocks, os stocks mínimos e os preços são os mesmos dos artigos do Atlas, porque no tema seguinte os artigos passam a vir de lá, e a verificação do passo 7 tem de continuar a dar os mesmos resultados. E que o ficheiro exporta o array com o nome `artigos`, que é o nome que o service vai importar.

### Passo 3: o service, e um teste sem servidor

O ficheiro `src/services/artigos.service.js`. Como o service não depende do HTTP, pode ser experimentado sem ligar a API. Na raiz do projeto, no terminal:

```text
node --input-type=module -e 'import { listarArtigos, artigosAbaixoDoMinimo } from "./src/services/artigos.service.js"; console.log(listarArtigos({}).length); console.log(listarArtigos({ categoria: "Papel" }).length); console.log(artigosAbaixoDoMinimo().map((artigo) => artigo.nome));'
```

O comando corre um pequeno programa escrito ali mesmo: importa duas funções do service e escreve o resultado de as chamar. Mostra `8`, `3` e os nomes dos quatro artigos a encomendar: a esferográfica azul, o bloco de notas A5, o marcador fluorescente e o compasso escolar. Sem browser, sem servidor e sem HTTP: é a vantagem das camadas do tema anterior, aqui à vista. (No Windows, na linha de comandos clássica, as aspas simples não funcionam assim; o laboratório tem a alternativa.)

### Passo 4: o controller

O ficheiro `src/controllers/artigos.controller.js`, com uma função exportada por cada pedido do contrato: `listar`, `abaixoDoMinimo` e `obter`. As decisões deste passo são as da secção "Verificar à entrada, no controller". Os parâmetros leem-se um a um, e o objeto `filtros` só recebe a `categoria` e o `stockMaximo` quando vierem no pedido; um parâmetro que o contrato não prevê, como `?ordem=preco`, nunca chega ao service. O `stockMaximo` e o `id` passam pela `paraInteiro`, que devolve `null` para tudo o que não é um inteiro, incluindo o texto vazio. Quando o valor é `null` ou está fora dos limites do contrato, o controller responde 400 com o formato de erro, e o `return` a seguir acaba ali o pedido. Na `obter`, a ordem das verificações também é uma decisão: primeiro confirma-se que o `id` faz sentido (400), e só depois se pergunta ao service se o artigo existe. O `null` que o service devolve quando não encontra o artigo é traduzido aqui, e só aqui, num 404.

Ainda não há rotas, por isso o controller não se experimenta no browser, e os erros de `import` deste ficheiro só aparecem no passo 6, quando o `server.js` o carregar. A confirmação deste passo faz-se pela leitura, com o contrato ao lado: cada mensagem de erro é a que está na tabela do passo 7; cada `res.status(...).json(...)` de erro tem o `return` a seguir; e nenhuma função passa o `req.query` inteiro ao service.

### Passo 5: as rotas

O ficheiro `src/rotas/artigos.rotas.js`, com um router e três rotas. Há duas decisões neste passo. A primeira são os caminhos: como o router vai ser montado em `/api/artigos`, os caminhos lá dentro são relativos a esse sítio, `"/"`, `"/abaixo-do-minimo"` e `"/:id"`, e não os caminhos completos. A segunda é a ordem: a rota fixa, `"/abaixo-do-minimo"`, vem antes de `"/:id"`, pela regra da secção "A ordem das rotas dentro do router", e o comentário no ficheiro diz porquê. Cada rota recebe o nome da função do controller, sem parênteses, porque é o Express que a chama quando o pedido chega.

O que se confirma: que cada pedido do contrato tem uma rota, com o método `get` e a função certa (`listar` para a lista, `abaixoDoMinimo` para os artigos a encomendar e `obter` para um artigo), e que o ficheiro termina com o `export default router`. Este ficheiro ainda não é importado por ninguém, por isso a API continua a responder como antes. É no passo seguinte que as rotas passam a funcionar.

### Passo 6: montar as rotas e o middleware final

O `src/server.js` do tema anterior, com três acrescentos. O `import artigosRotas from "./rotas/artigos.rotas.js"`, sem chavetas, porque o ficheiro das rotas tem um `export default`. O `app.use("/api/artigos", artigosRotas)`, que manda para o router todos os pedidos começados por `/api/artigos`. E o middleware final, que responde 404 com `{ "erro": "Rota não encontrada" }`, no formato de erro do contrato.

A decisão deste passo é a ordem dentro do `server.js`. O Express experimenta as rotas e os middlewares pela ordem em que foram registados, e o middleware final responde a tudo o que lhe chega. Por isso a rota de estado e o `app.use` das rotas vêm primeiro, e o middleware final vem depois de todos, logo antes do `app.listen`. Se estivesse antes do `app.use` das rotas, responderia `Rota não encontrada` a todos os pedidos dos artigos, mesmo aos que existem.

O que se confirma: ao guardar, o `--watch` reinicia a API e o terminal volta a mostrar `API a correr em http://localhost:3000`. Se houver um erro de `import` em algum dos ficheiros novos, é agora que aparece, porque é a primeira vez que o `server.js` carrega as rotas, que carregam o controller, que carrega o service. A mensagem diz que ficheiro faltou e quem o pediu, como na secção "Erros frequentes". Depois, dois pedidos rápidos, antes da verificação completa: `/api/estado` tem de continuar a responder como no tema anterior, e `/api/artigos` tem de mostrar os oito artigos. Se os dois funcionarem, a montagem está certa, e o passo 7 verifica o resto.

### Passo 7: verificar o contrato

Com a API ligada (`npm run dev`), cada pedido no browser, com o separador Rede aberto para confirmar o código:

| Pedido | Código | Resposta |
| --- | --- | --- |
| `/api/artigos` | 200 | os oito artigos |
| `/api/artigos?categoria=Desenho` | 200 | a régua e o compasso |
| `/api/artigos?stockMaximo=3` | 200 | a esferográfica (3), o bloco de notas (0) e o compasso (1) |
| `/api/artigos?categoria=Papel&stockMaximo=4` | 200 | o bloco de notas (0) e a resma (4) |
| `/api/artigos?categoria=Cola` | 200 | `[]` |
| `/api/artigos?stockMaximo=abc` | 400 | `{"erro":"O parâmetro stockMaximo tem de ser um número inteiro, zero ou maior"}` |
| `/api/artigos?stockMaximo=` | 400 | o mesmo erro |
| `/api/artigos?stockMaximo=-1` | 400 | o mesmo erro |
| `/api/artigos/2` | 200 | a esferográfica azul |
| `/api/artigos/abc` | 400 | `{"erro":"O identificador do artigo tem de ser um número inteiro positivo"}` |
| `/api/artigos/99` | 404 | `{"erro":"Não existe o artigo 99"}` |
| `/api/artigos/abaixo-do-minimo` | 200 | a esferográfica, o bloco de notas, o marcador e o compasso |
| `/api/artigo` | 404 | `{"erro":"Rota não encontrada"}` |

Repara na resma, com stock 4, na quarta linha: aparece com `stockMaximo=4`, porque o contrato diz "até esse valor, incluído". E repara no marcador fluorescente: tem 8 unidades, mais do que a esferográfica, mas está abaixo do mínimo, que é 10. Ter pouco stock e ter de encomendar são coisas diferentes, e é o service que sabe a diferença.

Cada linha desta tabela corresponde a uma linha do contrato. Uma API cujas respostas batem certo com todas as linhas do contrato está, por definição, certa. É esta verificação, com as respostas 200, 400 e 404, a evidência deste tema.

### Passo 8: guardar no Git

```text
git add .
git commit -m "API dos artigos: contrato, rotas, controller e service com dados temporários"
```

## Erros frequentes

### O import de um ficheiro teu sem a extensão

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../src/controllers/artigos.controller' imported from .../src/rotas/artigos.rotas.js
```

Falta o `.js` no fim do caminho do `import`. Nos módulos ES do Node, a extensão é obrigatória nos ficheiros teus. A mensagem diz que ficheiro não encontrou e quem o pediu.

### Um nome que o ficheiro não exporta

```text
SyntaxError: The requested module '../controllers/artigos.controller.js' does not provide an export named 'listarTodos'
```

O nome entre chavetas no `import` tem de ser exatamente o nome do `export` do outro ficheiro. Aqui, o controller exporta `listar`, e pediu-se `listarTodos`. Acontece também quando se usa chavetas para importar um `export default`: `import { artigosRotas } from "./rotas/artigos.rotas.js"` dá o mesmo erro, porque o router não foi exportado com esse nome, mas como `default`. Um `export default` importa-se sem chavetas.

### O pedido de uma rota fixa dá 400

`/api/artigos/abaixo-do-minimo` responde "O identificador do artigo tem de ser um número inteiro positivo". A rota `"/:id"` está registada antes da rota fixa. Secção 8.

### Tudo dá "Rota não encontrada", mas o caminho repetido funciona

Dentro do router escreveste o caminho completo, `router.get("/api/artigos", ...)`, e montaste-o em `/api/artigos`. A rota fica em `/api/artigos/api/artigos`. Dentro do router, os caminhos são relativos: `"/"`.

### O service usa req ou res

Se uma função do service recebe o `req` para ler `req.query`, deixou de se poder usar e testar sem HTTP, e a fronteira entre as camadas desapareceu. O controller lê o pedido e passa ao service valores simples.

### O req.query inteiro passado ao service

Funciona hoje, com um array. No tema seguinte, com o MongoDB, é uma porta aberta: o filtro passa a ser o que quem fizer o pedido quiser. Constrói os filtros parâmetro a parâmetro, só com os que o contrato prevê.

### Formatos de erro diferentes

Um erro com `erro`, outro com `mensagem`, um 404 do Express em HTML. O cliente React deixa de conseguir tratar os erros todos da mesma forma. Confirma, no passo 7, que todas as respostas de erro têm a forma do contrato.

### Duas respostas ao mesmo pedido

Falta o `return` depois de um `res.status(400).json(...)`, e o terminal mostra `Cannot set headers after they are sent to the client`. Já o conheces de Sistemas de Informação.

## Verificar o que aprendeste

1. O que é o contrato de uma API? Quem fica obrigado por ele?
2. Que quatro coisas o contrato diz sobre cada pedido?
3. Porque é que todos os erros da API têm a mesma forma? Que vantagem tem isso para o código React?
4. No contrato da papelaria, `?stockMaximo=4` inclui um artigo com stock 4? Onde está isso escrito?
5. Porque é que o controller não passa o `req.query` inteiro ao service?
6. Porque é que `obterArtigo` devolve `null`, e não responde 404?
7. Para que serve `express.Router()`? O que quer dizer `"/"` dentro do router dos artigos?
8. Porque é que `"/abaixo-do-minimo"` tem de vir antes de `"/:id"`?
9. Que diferença há entre `import artigosRotas from ...` e `import { listar } from ...`?
10. A API responde a todas as linhas da tabela do passo 7 como lá está escrito. O que podes concluir? E o que não podes?

## O que vem a seguir

No tema da ligação segura, os dados temporários saem. A API liga-se ao teu cluster do Atlas, com a cadeia de ligação no `.env` que preparaste no tema anterior, e o repository passa a fazer as consultas que escreveste na barra de consulta do tema do modelo documental. O `id` inteiro passa a ser o `_id` do MongoDB, e o contrato muda nessa linha. Chegam também os pedidos que criam, alteram e apagam artigos, com os dados no corpo do pedido, lidos por um middleware como o dos formulários de Sistemas de Informação.

Antes disso, faz o [laboratório](04-api-express-e-contratos-laboratorio.md), em que escreves o contrato e as camadas da papelaria no teu projeto, e a [ficha](04-api-express-e-contratos-exercicios.md), com a API do torneio de futsal.

## Para saber mais

Consultados a 7 de outubro de 2026:

- [Encaminhamento no Express](https://expressjs.com/en/guide/routing/), em inglês: as rotas, os parâmetros de caminho e o `express.Router`, na secção sobre ele.
- [Códigos de estado HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status), na documentação da Mozilla, em inglês: a lista completa, com o significado de cada um.

![Rodapé](../imagens/rodape.png)
