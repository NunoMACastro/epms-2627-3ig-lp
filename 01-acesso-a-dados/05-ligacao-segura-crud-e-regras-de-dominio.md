![Cabeçalho](../imagens/cabecalho.png)

# Ligação segura, CRUD e regras de domínio

Módulo M14, Acesso a Bases de Dados. Este guia explica como a API da papelaria passa a guardar os artigos no MongoDB Atlas. Mostra como os cria, lê, altera e apaga, e como recusa o que não cumpre as regras da papelaria. Lês o guia ao teu ritmo, e não precisa de ser de uma vez. Para praticar, há o [laboratório da papelaria](05-ligacao-segura-crud-e-regras-de-dominio-laboratorio.md), o [laboratório do cinema da escola](05-ligacao-segura-crud-e-regras-de-dominio-laboratorio-cinema.md), para quem traz esse projeto, e a [ficha de exercícios](05-ligacao-segura-crud-e-regras-de-dominio-exercicios.md) deste tema.

No tema anterior, a API da papelaria ficou com um contrato escrito e com as camadas separadas, mas os artigos estavam num array, dentro do servidor. Já ligaste uma API ao Atlas com o Mongoose duas vezes. A primeira foi na aula em que a papelaria foi buscar os artigos à base; a segunda, na ficha do cinema da escola, que juntou um seed. Este tema junta as duas coisas e dá o passo que faltava. A API deixa de só ler: passa a escrever na base de dados.

Escrever numa base de dados é mais delicado do que ler. Uma leitura mal feita mostra uma lista errada, e basta corrigir o código. Uma escrita mal feita fica guardada: um preço negativo, um artigo sem nome, uma categoria inventada, um artigo apagado por engano. Por isso, este tema trata tanto do que a API aceita como do que ela recusa, e de onde fica cada regra.

## Neste guia

1. O que vais aprender
2. O que já sabes e vais usar
3. O contrato cresce: criar, alterar e apagar
4. Uma só ligação, aberta no arranque e só no servidor
5. A base de teste
6. O repository: os artigos passam a vir da base
7. O _id e a forma de um ObjectId
8. O corpo do pedido
9. Uma lista fechada de campos
10. As regras de cada campo, no schema
11. Alterar só o que vem no pedido
12. Apagar, e a regra que precisa da base
13. Ver o que vai mudar antes de mudar muitos
14. Os dados pessoais e o RGPD
15. Exemplo guiado: registar uma venda
16. Erros frequentes
17. Palavras novas deste guia
18. Verificar o que aprendeste
19. O que vem a seguir
20. Para saber mais

## O que vais aprender

No fim deste guia, consegues:

- explicar porque é que a API abre uma só ligação à base de dados, no arranque, e porque é que a cadeia de ligação nunca chega ao browser;
- trabalhar numa base de teste, que um script reconstrói, sem tocar nos dados que interessam;
- responder 400 a um identificador mal escrito e 404 a um que não existe, com o `_id` do MongoDB;
- receber os dados de um artigo no corpo de um pedido e aceitar só os campos de uma lista, cada um com o tipo certo;
- escrever as regras da papelaria no schema e no service, e responder 400 ou 409 quando falham;
- criar, ler, alterar e apagar artigos com o Mongoose, e ver o que vai mudar antes de apagar vários de uma vez;
- dizer o que é um dado pessoal e porque é que a tua aplicação usa dados fictícios.

## O que já sabes e vais usar

- O contrato da API, as camadas (rotas, controller e service), o formato único dos erros, a função `paraInteiro` e o middleware final, explicados no guia [04 API Express e contratos](04-api-express-e-contratos.md). Este tema continua na API da papelaria com camadas.
- O repository, a camada que fala com a base de dados, e o segredo que só vive no `.env`, do guia [03 Arquitetura e setup Node](03-arquitetura-e-setup-node.md).
- O documento, a coleção, o `_id`, o ObjectId com os seus 24 carateres hexadecimais, os filtros e o `$lte`, do guia [02 Modelo documental e primeiras consultas no Atlas](02-modelo-documental-e-consultas-no-atlas.md).
- A ligação com o Mongoose aberta no arranque, com a `MONGODB_URI` e o `DB_NAME` no `.env`. Vem da [ficha do cinema da escola](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/01-aplicacoes-em-browser/04-ejs-e-reutilizacao-no-servidor-exercicios-cinema.md), de Sistemas de Informação, e do exemplo [a API ligada ao Atlas](../exemplos/acesso-a-dados/papelaria-api-com-atlas/README.md).
- O modelo e o seu schema, a descrição da forma dos documentos de uma coleção, com o nome da coleção escrito à mão, da mesma ficha e do mesmo exemplo.
- O seed, com o `deleteMany` e o `insertMany`, da mesma ficha.
- Os métodos HTTP, como o GET e o POST, e o middleware registado com `app.use`, do tema "HTTP, rotas e middleware" de Sistemas de Informação.
- O `async`, o `await`, o `try`, o `catch` e o `fetch`, do 11.º ano e da [ficha de revisão](01-diagnostico-e-revisao-dirigida-exercicios.md).
- O `typeof`, o ciclo `for...of` e os métodos `filter`, `map` e `includes` dos arrays, do mesmo ano e da mesma ficha.

O corpo de um pedido viste-o em Sistemas de Informação só como ideia. Lê-lo com o `express.json()`, os códigos 201, 204 e 409, e o middleware de erros, ainda não os usaste. Este guia explica-os no sítio onde aparecem. O código 500 já o viste no tema anterior, quando um erro no código fazia a API falhar.

## O contrato cresce: criar, alterar e apagar

No tema anterior, o contrato da papelaria só tinha pedidos para ler: a lista, um artigo e os artigos a encomendar. Uma aplicação de gestão também cria, altera e apaga. A papelaria recebe um artigo novo, muda o stock de outro depois de uma entrega, e tira do catálogo um que deixou de vender.

Estas quatro operações têm um nome. **CRUD** são as iniciais, em inglês, de criar (create), ler (read), alterar (update) e apagar (delete). Quase todas as aplicações que guardam dados fazem estas quatro coisas, e o resto do módulo constrói-se em cima delas.

Como no tema anterior, o contrato vem antes do código. É ele que diz o que cada pedido aceita e o que responde, incluindo quando corre mal. Muda em três sítios.

O primeiro é o identificador. Até aqui, cada artigo tinha um `id` inteiro, de 1 a 8, que tinhas escrito no array. Agora os artigos vêm da base, e cada um tem o `_id` que o MongoDB lhe deu quando o inseriu. É por ele que se pede um artigo. O artigo passa a ter esta forma:

```json
{ "_id": "6ae50cc456457b28519e9054", "nome": "Caderno A4 quadriculado", "categoria": "Papel", "stock": 12, "stockMinimo": 5, "precoCentimos": 250, "__v": 0 }
```

O `__v` é o número de versão que o Mongoose acrescenta a cada documento que insere, como viste na ficha do cinema. Não o escreves nem o lês.

O segundo são três pedidos novos, com três métodos HTTP. O `POST` cria um artigo. O `PATCH` altera alguns campos de um artigo. O `DELETE` apaga um artigo. O `PATCH` é diferente do `PUT`, que também existe. O `PUT` substitui o documento inteiro, e obriga a enviar todos os campos. O `PATCH` muda só os campos que vierem no pedido, e é o que a papelaria precisa para mudar o stock sem reescrever o resto.

O terceiro são quatro códigos de estado novos:

| Código | Nome | Quando |
| --- | --- | --- |
| 201 | Created (criado) | O pedido criou um recurso novo. O corpo da resposta é esse recurso |
| 204 | No Content (sem conteúdo) | O pedido correu bem e não há nada a devolver, como depois de apagar |
| 409 | Conflict (conflito) | O pedido está bem escrito, mas choca com o estado dos dados, como apagar um artigo que ainda tem stock |
| 500 | Internal Server Error (erro interno do servidor) | O problema é do servidor, e não de quem pediu |

O 409 merece uma comparação com o 400. Um 400 diz que o pedido está mal escrito: um stock em texto, um campo que não existe. Repetir o mesmo pedido dá sempre 400. Um 409 diz que o pedido está bem escrito, mas que os dados, como estão agora, não o deixam fazer. O mesmo pedido pode passar mais tarde, quando o stock do artigo chegar a 0.

O contrato fica assim. Os pedidos de leitura são os do tema anterior, com o `_id` no lugar do `id`.

| Pedido | O que faz | Respostas |
| --- | --- | --- |
| `GET /api/artigos` | Lista os artigos, com os filtros `?categoria=` e `?stockMaximo=` | 200; 400 se um filtro não for válido |
| `GET /api/artigos/abaixo-do-minimo` | Lista os artigos a encomendar | 200 |
| `GET /api/artigos/:id` | Mostra um artigo | 200; 400 se o `id` não tiver a forma de um ObjectId; 404 se não existir |
| `POST /api/artigos` | Cria um artigo, com os cinco campos no corpo | 201 com o artigo criado; 400 se o corpo não cumprir as regras |
| `PATCH /api/artigos/:id` | Altera os campos que vierem no corpo | 200 com o artigo alterado; 400; 404 |
| `DELETE /api/artigos/:id` | Apaga um artigo sem stock | 204 sem corpo; 400; 404; 409 se o artigo ainda tiver stock |
| Qualquer outro | Nenhuma rota responde a esse método e a esse caminho | 404 com `{ "erro": "Rota não encontrada" }` |

Qualquer pedido pode ainda responder 500, com `{ "erro": "Erro interno do servidor" }`, se alguma coisa falhar dentro do servidor. Todas as respostas de erro continuam a ter a forma `{ "erro": "..." }`.

O corpo de um `POST` e de um `PATCH` leva os campos de um artigo, com estes tipos e estas regras:

| Campo | Tipo | Regras |
| --- | --- | --- |
| `nome` | texto | obrigatório; até 60 carateres, sem contar os espaços do início e do fim |
| `categoria` | texto | obrigatório; `Papel`, `Escrita` ou `Desenho` |
| `stock` | inteiro | obrigatório; 0 ou mais |
| `stockMinimo` | inteiro | obrigatório; 0 ou mais |
| `precoCentimos` | inteiro | obrigatório; 1 ou mais |

Num `POST`, os cinco são obrigatórios. Num `PATCH`, vem pelo menos um, e os que vierem cumprem as mesmas regras. Qualquer outro campo, como o `_id`, é recusado com 400. O resto do guia constrói, camada a camada, o código que cumpre este contrato.

## Uma só ligação, aberta no arranque e só no servidor

Já escreveste a função `ligarBaseDeDados` duas vezes, e o `server.js` chama-a antes do `app.listen`. Este tema volta a ela para explicar duas coisas que ficaram por dizer. Porque é que a ligação é uma só, e porque é que a cadeia de ligação tem de ficar no servidor.

Ligar-se ao Atlas demora. O teu computador encontra o cluster na internet, os dois combinam como vão cifrar a conversa, e o Atlas confirma o utilizador e a palavra-passe. Isto leva algumas centenas de milissegundos, mais do que a própria consulta. Se a API abrisse uma ligação nova em cada pedido, cada pedido pagava esse tempo. E o cluster gratuito aceita um número limitado de ligações ao mesmo tempo: uma API com muitos pedidos chegava a esse limite e começava a ser recusada.

Por isso, a ligação abre-se uma vez, no arranque, e fica aberta enquanto a API corre. O Mongoose guarda-a e usa-a em todos os pedidos. Quando um repository chama o `Artigo.find`, não abre nada: usa a ligação que já existe. A mesma ideia aparece no dia a dia: um café não chama o fornecedor ao telefone de cada vez que vende um bolo. Combina as entregas uma vez, e depois só vende.

A ligação abre-se antes do `app.listen` por uma razão diferente. Uma API que aceitasse pedidos antes de chegar aos dados deixava-os à espera. O Mongoose guarda as consultas até haver ligação e, ao fim de 10 segundos sem ela, falha com um erro. Se o Atlas não responder, é melhor a API não arrancar e dizer porquê no terminal.

A segunda razão é o segredo. A cadeia de ligação, a `MONGODB_URI`, tem o utilizador e a palavra-passe da base de dados. Quem a tiver entra na base como a tua API entra: lê, altera e apaga tudo. O ficheiro `.env` guarda-a no computador onde a API corre, e o `.gitignore` impede que vá para o Git.

O browser nunca a pode receber. Tudo o que chega ao browser pode ser lido por quem o usa: o HTML, o JSON das respostas e o código JavaScript da interface. No tema da integração com o React, a interface vai ser um conjunto de ficheiros que o browser descarrega, o **bundle**. Uma linha com a cadeia de ligação num ficheiro do React ficava dentro do bundle, à vista de toda a gente que abrisse a aplicação. É por isso que o React nunca fala com a base de dados: fala com a API, por HTTP, e só a API conhece a cadeia.

Há uma terceira proteção, que se escolhe no Atlas. O utilizador da base de dados que a API usa deve ter só os privilégios de que precisa. Para a papelaria, chega ler e escrever nas bases da papelaria. Não precisa de criar outros utilizadores nem de mudar a configuração do cluster. Se a cadeia escapar, um utilizador com menos privilégios faz menos estragos.

Para confirmar que a cadeia não escapou, há duas verificações simples. No Git, nenhum ficheiro guardado tem o endereço do cluster, que acaba em `mongodb.net`. No browser, nenhuma resposta da API o tem. Os laboratórios deste tema fazem as duas no fim.

## A base de teste

Neste tema vais criar artigos, mudar stocks e apagar artigos, muitas vezes, para ver o que acontece. Algumas experiências vão correr mal de propósito. Se as fizesses na base `papelaria`, a do laboratório do Atlas, perdias o que lá inseriste à mão, como a Cola em bastão e o fornecedor dela.

A solução é ter uma base só para as experiências. Uma **base de teste** é uma base de dados com dados conhecidos, que se pode estragar à vontade, porque um script a reconstrói. Fica no mesmo cluster, com outro nome: `papelaria-teste`. Para a API passar a usá-la, muda uma linha do `.env`:

```text
DB_NAME=papelaria-teste
```

A base `papelaria` continua no cluster, sem mudar. O MongoDB cria a `papelaria-teste` sozinho, na primeira vez que alguém lá escreve.

O script que reconstrói a base de teste é um seed, como o do cinema. Apaga todos os artigos e insere os oito do início. Depois de qualquer experiência, corres o seed e a base volta a estar como no princípio, com os mesmos oito artigos. É isso que torna os resultados previsíveis: se o teu colega correr o seed e fizer os mesmos pedidos, obtém as mesmas respostas, menos nos `_id`. Cada seed dá `_id` novos a todos os artigos, e por isso, depois de cada seed, o `_id` de um artigo volta a ler-se na lista de `/api/artigos`.

O seed tem um perigo, que no cinema não se notava, porque a base `cinema` só tinha os filmes do próprio seed. O `deleteMany({})` apaga todos os artigos da base onde está ligado. Se o `.env` disser `DB_NAME=papelaria`, apagava os da base do laboratório do Atlas. Por isso, o seed da papelaria verifica primeiro o nome da base, e só continua se acabar em `-teste`.

Antes de leres o seed, prevê: se o `.env` disser `DB_NAME=papelaria` e correres `npm run seed`, o que escreve o terminal, e o que acontece aos artigos da base `papelaria`?

```js check
// src/seed.js: reconstrói a base de teste da papelaria com os oito artigos.
// Corre-se à parte, com npm run seed. Apaga primeiro os artigos que lá
// estiverem, por isso pode correr-se as vezes que for preciso: depois de cada
// experiência, a base volta a ficar como estava no início.
import mongoose from "mongoose";
import { ligarBaseDeDados } from "./db/mongoose.js";
import { Artigo } from "./models/artigo.model.js";

// Os artigos da papelaria, os mesmos do laboratório do Atlas, sem o _id:
// o MongoDB dá um a cada artigo quando o insere.
const artigos = [
  { nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250 },
  { nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60 },
  { nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180 },
  { nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35 },
  { nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520 },
  { nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95 },
  { nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120 },
  { nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450 },
];

try {
  await ligarBaseDeDados();
  // O seed apaga todos os artigos da base onde está ligado. Na base papelaria,
  // a do laboratório do Atlas, perdias o que lá inseriste à mão. Por isso,
  // só continua se o nome da base acabar em -teste.
  const nomeDaBase = mongoose.connection.name;
  if (!nomeDaBase.endsWith("-teste")) {
    console.error(`O seed só corre numa base de teste, e esta é a ${nomeDaBase}. Muda o DB_NAME no .env.`);
  } else {
    const apagados = await Artigo.deleteMany({});
    console.log(`Apagados ${apagados.deletedCount} artigos`);
    // O insertMany verifica cada artigo com as regras do schema antes de inserir.
    const inseridos = await Artigo.insertMany(artigos);
    console.log(`Inseridos ${inseridos.length} artigos`);
  }
} catch (erro) {
  console.error(`O seed falhou: ${erro.message}`);
}

// A ligação fica aberta até alguém a fechar. Sem esta linha, o programa
// ficava à espera e não voltava ao terminal.
await mongoose.disconnect();
```

O resultado, com `DB_NAME=papelaria`, é este, e os artigos da base `papelaria` ficam como estavam:

```text
Ligada à base de dados papelaria
O seed só corre numa base de teste, e esta é a papelaria. Muda o DB_NAME no .env.
```

Com `DB_NAME=papelaria-teste`, o seed escreve `Apagados 0 artigos` e `Inseridos 8 artigos` da primeira vez, e `Apagados 8 artigos` e `Inseridos 8 artigos` das seguintes.

Leitura guiada: o seed é o do cinema, com os artigos da papelaria no lugar dos filmes e uma verificação a mais. O `mongoose.connection.name` é o nome da base a que a ligação chegou, o mesmo que a `ligarBaseDeDados` escreve no terminal. O `endsWith("-teste")` diz se um texto acaba em `-teste`. Só nesse caso o seed apaga e insere. Repara que o seed não escreve `_id` nenhum: o MongoDB dá um a cada artigo, e por isso os teus `_id` são diferentes dos do teu colega.

O seed corre-se com o script `seed` do `package.json`, como no cinema: `"seed": "node --env-file=.env src/seed.js"`.

## O repository: os artigos passam a vir da base

No tema anterior, a pasta `src/dados` ocupava o lugar do repository, com os oito artigos num array. O service lia o array diretamente. Agora os artigos estão na base, e entra a camada que faltava: o **repository**, a única camada que fala com o MongoDB. Recebe valores já verificados, escreve as consultas com o Mongoose e devolve o que a base respondeu.

O modelo `Artigo`, que o repository usa, é o da aula em que ligaste a papelaria ao Atlas. Tem duas diferenças. Perdeu a localização e o fornecedor, que nenhum pedido do contrato usa, e que os artigos da base de teste não têm. E ganhou regras, que a secção "As regras de cada campo, no schema" explica. Por agora, basta saber que o modelo diz ao Mongoose a forma dos artigos e o nome da coleção.

O repository fica em `src/repositories/artigos.repository.js`, numa pasta nova, e começa pelo `import` do modelo, `import { Artigo } from "../models/artigo.model.js";`. As primeiras funções são as dos pedidos de leitura:

```js
/**
 * Procura os artigos que cumprem as condições recebidas.
 * As condições que faltam não se aplicam; sem nenhuma, vêm todos os artigos.
 * @param {object} condicoes com categoria (texto) e stockAte (número), os dois opcionais
 * @returns {Promise<object[]>} os artigos encontrados, possivelmente nenhum
 */
export async function procurarArtigos(condicoes) {
  // O filtro é o mesmo que escreverias na barra do Atlas, construído aqui a
  // partir das condições. Nenhum valor do pedido entra nele sem ter sido verificado.
  const filtro = {};
  if (condicoes.categoria !== undefined) {
    filtro.categoria = condicoes.categoria;
  }
  if (condicoes.stockAte !== undefined) {
    filtro.stock = { $lte: condicoes.stockAte };
  }
  const artigos = await Artigo.find(filtro);
  return artigos;
}

/**
 * Procura um artigo pelo _id.
 * @param {string} id um identificador com a forma de um ObjectId, já verificado pelo controller
 * @returns {Promise<object | null>} o artigo, ou null se não existir
 */
export async function procurarPorId(id) {
  // O findById devolve o documento, ou null quando nenhum tem este _id.
  const artigo = await Artigo.findById(id);
  return artigo;
}
```

Leitura guiada: a `procurarArtigos` recebe condições com nomes da papelaria, como `stockAte`, e transforma-as no filtro do MongoDB, o mesmo que escreverias na barra do Atlas. É o único sítio da API onde aparece o `$lte`. A `procurarPorId` usa o `findById`, que procura o documento com aquele `_id` e devolve `null` quando nenhum o tem. Não sabe o que é um 404: diz só "não há", como a `obterArtigo` do tema anterior.

Há uma diferença em relação ao array, e ela muda as outras camadas. Ler um array é imediato. Perguntar ao Atlas demora, e as funções do Mongoose devolvem uma **promessa**: um objeto que representa uma resposta que ainda não chegou. Por isso, o repository é `async` e usa o `await`. E quem o chama também tem de esperar. O service passa a ser `async`, com um `await` antes de cada chamada ao repository, e o controller também, com um `await` antes de cada chamada ao service.

Antes de continuares, prevê: se te esquecesses do `await` na `listar` do controller, e escrevesses `const artigos = listarArtigos(filtros);`, o que respondia `/api/artigos`?

```js
/** GET /api/artigos, com os filtros opcionais ?categoria= e ?stockMaximo= */
export async function listar(req, res) {
  // ... as verificações dos filtros, como no tema anterior ...
  const artigos = listarArtigos(filtros); // sem o await: um erro de propósito
  res.json(artigos);
}
```

O resultado é um 200 com `{}`, e nenhum erro no terminal. Sem o `await`, a variável `artigos` guarda a promessa, e não a lista. O `res.json` escreve a promessa em JSON, e uma promessa escrita em JSON é um objeto vazio. A lista chega da base um instante depois, mas já ninguém está à espera dela.

Leitura guiada: é o erro mais traiçoeiro deste tema, porque não há mensagem nenhuma. A pista é a resposta ter a forma errada: um objeto vazio, em vez de uma lista. Quando vires `{}` onde esperavas `[...]`, procura o `await` que falta no controller. No service, o mesmo esquecimento dá outro sintoma, quando a função usa o resultado, como a `artigosAbaixoDoMinimo` com o `filter`. A API responde 500, e o terminal diz `artigos.filter is not a function`, porque uma promessa não tem `filter`.

O service muda pouco. A `listarArtigos` deixa de filtrar o array e passa as condições ao repository. A `artigosAbaixoDoMinimo` pede todos os artigos ao repository e aplica a regra da papelaria, como antes:

```js
/**
 * Devolve os artigos que cumprem os filtros recebidos.
 * Os filtros já chegam verificados pelo controller; os que faltam não se aplicam.
 * @param {object} filtros com categoria (texto) e stockMaximo (número), os dois opcionais
 * @returns {Promise<object[]>} os artigos, possivelmente nenhum
 */
export async function listarArtigos(filtros) {
  const condicoes = {};
  if (filtros.categoria !== undefined) {
    condicoes.categoria = filtros.categoria;
  }
  if (filtros.stockMaximo !== undefined) {
    // O stock máximo inclui o valor: com 4, entram os artigos com stock 4.
    condicoes.stockAte = filtros.stockMaximo;
  }
  const artigos = await procurarArtigos(condicoes);
  return artigos;
}

/**
 * Regra da papelaria: um artigo está abaixo do mínimo quando o stock é
 * menor do que o stock mínimo definido para ele, e é preciso encomendá-lo.
 * @returns {Promise<object[]>} os artigos a encomendar, possivelmente nenhum
 */
export async function artigosAbaixoDoMinimo() {
  const artigos = await procurarArtigos({});
  return artigos.filter((artigo) => artigo.stock < artigo.stockMinimo);
}
```

A `obterArtigo` passa a esperar pelo repository, como as outras:

```js
/**
 * Procura um artigo pelo _id.
 * @param {string} id um identificador já verificado pelo controller
 * @returns {Promise<object | null>} o artigo, ou null se não existir
 */
export async function obterArtigo(id) {
  const artigo = await procurarPorId(id);
  return artigo;
}
```

Leitura guiada: na documentação das funções, `Promise<object[]>` quer dizer que a função devolve uma promessa que, quando chega, traz uma lista de objetos. A `listarArtigos` traduz os filtros do pedido para as condições do repository. O `stockMaximo`, que é o nome do contrato, passa a `stockAte`, que é o nome que o repository entende. A regra dos artigos a encomendar continua no service, porque é uma regra da papelaria, e não uma consulta. A base só devolve os artigos; quem decide quais estão abaixo do mínimo é o service.

### Os filtros que chegam ao MongoDB

No controller, a `listar` ganha uma verificação nova. Com os artigos num array, `?categoria=Papel&categoria=Escrita` não fazia mal: o parâmetro chegava como um array, e a comparação com o texto da categoria falhava sempre. Agora a categoria vai parar a um filtro do MongoDB. Com um array, o Mongoose procura os artigos das duas categorias, e quem faz o pedido passa a decidir a forma da consulta. O contrato diz que a categoria é um texto, e o controller confirma-o:

```js
  if (req.query.categoria !== undefined) {
    // Repetido, como ?categoria=Papel&categoria=Escrita, o parâmetro chega
    // como um array, e não como um texto.
    if (typeof req.query.categoria !== "string") {
      res.status(400).json({ erro: "O parâmetro categoria tem de ser um texto, e só pode vir uma vez" });
      return;
    }
    filtros.categoria = req.query.categoria;
  }
```

É a regra do tema anterior, levada à letra: os filtros constroem-se no servidor, com valores verificados, e nunca com o que o pedido trouxer tal e qual.

## O _id e a forma de um ObjectId

O contrato diz que `GET /api/artigos/:id` responde 400 quando o `id` não tem a forma de um ObjectId, e 404 quando tem a forma certa, mas nenhum artigo o tem. São dois erros diferentes, e o controller tem de os distinguir.

Do guia do modelo documental, sabes que um ObjectId se escreve com 24 carateres, cada um de 0 a 9 ou de `a` a `f`. O `6ae50cc456457b28519e9054` tem essa forma. O `abc` não tem, porque é curto. O `zzzzzzzzzzzzzzzzzzzzzzzz` também não, porque o `z` não é um algarismo hexadecimal. E o `000000000000000000000000` tem a forma certa, mas não é o `_id` de nenhum artigo da papelaria.

O que acontece se o controller não verificar? O `findById("abc")` não devolve `null`. O Mongoose tenta converter `"abc"` num ObjectId, não consegue, e lança um erro chamado `CastError`, de conversão. A API responde 500, como se a culpa fosse do servidor. Para quem pediu, a mensagem não ajuda nada, e a culpa era do pedido.

Por isso, o controller verifica a forma antes de chamar o service, com uma função pequena:

```js check
/**
 * Diz se um texto tem a forma de um identificador do MongoDB, um ObjectId
 * escrito em texto: 24 carateres, cada um de 0 a 9 ou de a a f.
 * Não diz se o artigo existe; isso só a base de dados sabe.
 * @param {string} texto o valor tal como chegou no caminho do pedido
 * @returns {boolean}
 */
function eIdentificador(texto) {
  if (typeof texto !== "string" || texto.length !== 24) {
    return false;
  }
  for (const carater of texto.toLowerCase()) {
    if (!"0123456789abcdef".includes(carater)) {
      return false;
    }
  }
  return true;
}
```

Antes de continuares, prevê o que a `eIdentificador` devolve para `"abc"`, para `"6AE50CC456457B28519E9054"`, com letras maiúsculas, e para `"zzzzzzzzzzzzzzzzzzzzzzzz"`.

O resultado é `false`, `true` e `false`. O `"abc"` não tem 24 carateres. O texto em maiúsculas passa, porque o `toLowerCase()` o põe em minúsculas antes de comparar, e o MongoDB aceita as duas formas. Os 24 `z` têm o comprimento certo, mas o primeiro `z` não está no texto `"0123456789abcdef"`, e a função devolve `false` logo aí.

Leitura guiada: a função verifica primeiro o tipo e o comprimento, porque é o mais rápido. Depois percorre o texto, um carater de cada vez, com o `for...of`, e procura cada um no texto dos dezasseis símbolos hexadecimais, com o `includes`. O `includes` também existe nos textos, e diz se um texto contém outro. Ao primeiro carater que não está lá, devolve `false`. Se chegar ao fim, todos estavam, e devolve `true`. A função não sabe se o artigo existe. Diz só se o texto pode ser um `_id`.

Com esta função, a `obter` faz as duas verificações pela ordem do contrato:

```js
/** GET /api/artigos/:id */
export async function obter(req, res) {
  const id = req.params.id;
  if (!eIdentificador(id)) {
    res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
    return;
  }
  const artigo = await obterArtigo(id);
  if (artigo === null) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
}
```

Primeiro a forma, com 400. Depois a existência, com 404, quando o service devolve `null`. O Mongoose tem uma função parecida, a `mongoose.isValidObjectId`. O controller não a usa, porque assim não precisa de importar o Mongoose. A regra do tema anterior continua de pé: só o repository conhece a base de dados.

## O corpo do pedido

Até aqui, os pedidos traziam dados em dois sítios: no caminho, como o `id` de `/api/artigos/:id`, e na pesquisa, como o `?categoria=`. Para criar um artigo, são precisos cinco campos, alguns com espaços e acentos. Pô-los no endereço seria desajeitado, e o endereço não é sítio para dados que se vão guardar. Os endereços ficam no histórico do browser e nos registos dos servidores.

Os pedidos `POST` e `PATCH` levam os dados no **corpo do pedido**, uma parte do pedido que vem depois do endereço e dos cabeçalhos, e que pode ser grande. Os **cabeçalhos** são linhas de informação que acompanham o pedido. Um deles, o `Content-Type`, diz em que formato vem o corpo. Na API da papelaria, o corpo vem em JSON, como as respostas.

O Express não lê o corpo sozinho. Quem o lê é um middleware, o `express.json()`, que se regista no `server.js`, antes das rotas:

```js
// Lê o corpo dos pedidos que chegam em JSON e põe-no em req.body, já como
// objeto. Sem esta linha, o req.body ficava undefined em todos os pedidos.
app.use(express.json());
```

O `express.json()` faz três coisas. Lê o texto do corpo, quando o `Content-Type` diz `application/json`. Converte-o num objeto JavaScript, como o `JSON.parse`. E guarda-o em `req.body`, para o controller o usar. Sem esta linha, o `req.body` ficava `undefined`. Se o texto não for JSON válido, o `express.json()` não chega a chamar a rota: passa um erro ao Express, que a secção das regras do schema trata.

Para fazer um pedido com corpo, o browser não chega: a barra de endereço só faz pedidos `GET`. Os laboratórios usam o `fetch`, que conheces do 11.º ano, na consola das ferramentas de programador. O `fetch` aceita um segundo argumento, com o método, os cabeçalhos e o corpo. Para não escreveres isso em cada pedido, os laboratórios dão-te uma função, `pedir`:

```js check
// Faz um pedido à API e escreve na consola o código e o corpo da resposta.
async function pedir(metodo, caminho, corpo) {
  const opcoes = { method: metodo };
  if (corpo !== undefined) {
    // O cabeçalho diz à API que o corpo vem em JSON. O JSON.stringify
    // escreve o objeto como texto JSON, que é o que viaja no pedido.
    opcoes.headers = { "Content-Type": "application/json" };
    opcoes.body = JSON.stringify(corpo);
  }
  const resposta = await fetch(caminho, opcoes);
  const texto = await resposta.text();
  console.log(resposta.status, texto);
}
```

Leitura guiada: a função recebe o método, o caminho e, se houver, o corpo, como objeto. Sem corpo, como num `DELETE`, só envia o método. Com corpo, junta o cabeçalho e o texto JSON. Depois espera pela resposta, lê-a como texto e escreve o código e o texto. Lê como texto, e não com o `.json()`, porque uma resposta 204 não tem corpo, e o `.json()` falhava com ela. O caminho começa por `/api`, sem o `http://localhost:3000`, porque o `fetch` o completa com o endereço da página aberta. Por isso, a consola tem de estar numa página da tua API, como a `/api/estado`.

Antes de continuares, prevê o que a consola escreve com `await pedir("GET", "/api/estado")`.

O resultado é `200 {"estado":"ok","aplicacao":"API da papelaria"}`. É o mesmo pedido que fazias na barra de endereço, agora pela consola, com o código à vista.

## Uma lista fechada de campos

O controller recebe o corpo em `req.body`, já como objeto. A tentação é passá-lo tal e qual ao service, e daí ao `Artigo.create`. Escreve-se numa linha, e funciona com os pedidos bem feitos. O problema são os outros. O `req.body` é o que quem pediu quiser que seja, e há três formas de isto correr mal.

A primeira é um campo que não devia vir. Um pedido com `"_id": "000000000000000000000001"` escolhia o identificador do artigo. Noutra aplicação, um pedido com `"administrador": true` no registo de um utilizador dava-lhe poderes que ninguém lhe quis dar. Guardar tudo o que vem num pedido é um erro tão conhecido que tem nome em inglês: **mass assignment** (atribuição em massa).

A segunda é um campo com o nome errado. Um pedido com `"precoCentimo": 250`, sem o `s`, não dá erro nenhum se for ignorado. O artigo fica sem preço, ou com o antigo, e quem pediu acha que correu tudo bem.

A terceira é um valor com a forma errada. O que vem num corpo JSON não é sempre texto. Pode ser um objeto, como `{ "$ne": null }`. Imagina que esse valor chegava a um filtro do MongoDB, como `Artigo.find({ nome: req.body.nome })`. Já não era um nome: era o operador `$ne`, "diferente de". O filtro escolhia todos os artigos cujo nome não é `null`. Ou seja, todos os que têm nome. Quem fez o pedido passava a escrever a consulta.

A solução para as três é a mesma. O controller tem uma **lista fechada** de campos aceites, e só esses passam, cada um com o tipo do contrato. Tudo o que não está na lista é recusado com 400, com uma mensagem que diz qual é o campo. Recusar, em vez de ignorar, é o que apanha o `precoCentimo`. Os campos copiam-se um a um para um objeto novo, e o `req.body` nunca segue inteiro:

```js
// Os campos que o corpo de um pedido pode trazer, para criar ou alterar um
// artigo. É uma lista fechada: um campo que não esteja aqui é recusado.
const CAMPOS_DE_TEXTO = ["nome", "categoria"];
const CAMPOS_INTEIROS = ["stock", "stockMinimo", "precoCentimos"];

/**
 * Lê do corpo do pedido os campos de um artigo: só os da lista, cada um com o tipo certo.
 * Não verifica os valores, como o mínimo ou as categorias: essas são regras da
 * papelaria, e quem as verifica é o schema do modelo.
 * @param {unknown} corpo o req.body, tal como o express.json() o deixou
 * @returns {object} { erro } com a mensagem do primeiro problema, ou { dados } com os campos lidos
 */
function lerCamposDoArtigo(corpo) {
  // Sem corpo em JSON, o req.body fica undefined.
  if (typeof corpo !== "object" || corpo === null || Array.isArray(corpo)) {
    return { erro: "O corpo do pedido tem de ser um objeto JSON" };
  }
  // O objeto dados recebe só os campos da lista, copiados um a um.
  // O req.body nunca segue inteiro para o service.
  const dados = {};
  for (const campo of Object.keys(corpo)) {
    const valor = corpo[campo];
    if (CAMPOS_DE_TEXTO.includes(campo)) {
      // Um objeto no lugar de um texto, como { "$ne": null }, é recusado aqui.
      // Se chegasse a um filtro, seria lido como um operador do MongoDB.
      if (typeof valor !== "string") {
        return { erro: `O campo ${campo} tem de ser um texto` };
      }
    } else if (CAMPOS_INTEIROS.includes(campo)) {
      if (!Number.isInteger(valor)) {
        return { erro: `O campo ${campo} tem de ser um número inteiro` };
      }
    } else {
      return { erro: `O campo ${campo} não é aceite` };
    }
    dados[campo] = valor;
  }
  return { dados: dados };
}
```

Antes de continuares, prevê o que a `lerCamposDoArtigo` devolve para estes três corpos: `{ "nome": "Cola", "stock": "10" }`, `{ "nome": "Cola", "_id": "x" }` e `{ "nome": { "$ne": null } }`.

O resultado é `{ erro: "O campo stock tem de ser um número inteiro" }`, `{ erro: "O campo _id não é aceite" }` e `{ erro: "O campo nome tem de ser um texto" }`. No primeiro, o `"10"` entre aspas é um texto, e o `Number.isInteger` de um texto é sempre `false`. No segundo, o `_id` não está em nenhuma das duas listas. No terceiro, o valor é um objeto, e o `typeof` de um objeto é `"object"`, e não `"string"`.

Leitura guiada: começa pelas duas listas, no topo do ficheiro, com os cinco campos do contrato divididos pelo tipo. A função verifica primeiro que o corpo é um objeto: não `undefined`, que é o que fica quando não vem JSON, nem `null`, nem um array. As duas últimas verificações fazem falta porque o `typeof null` e o `typeof` de um array também dão `"object"`. O `Array.isArray` diz se um valor é um array. Na documentação da função, o `{unknown}` quer dizer que o corpo pode ser qualquer coisa. O `Object.keys(corpo)` dá a lista dos nomes dos campos que vieram, e o `for...of` percorre-os. Cada campo tem de estar numa das listas e ter o tipo dela. Ao primeiro problema, a função devolve `{ erro }`, com a mensagem. Se todos passarem, devolve `{ dados }`, com a cópia. O controller só tem de ver qual das duas propriedades veio.

Repara no que a função não verifica: se o stock é negativo, se a categoria existe, se o nome é demasiado comprido. Isso já não é a forma do pedido. São regras da papelaria, e ficam noutro sítio.

## As regras de cada campo, no schema

Um stock de -3 é um inteiro, e passa a lista fechada. Mas uma papelaria não tem -3 cadernos. Uma categoria `Mochilas` é um texto, e também passa. Mas a papelaria não vende mochilas. Estas regras são do **domínio**, o assunto de que a aplicação trata: dizem o que faz sentido para a papelaria, e não como se escreve um pedido.

Onde ficam? A estratégia é pô-las onde podem ser garantidas. Uma regra escrita no controller só protege os pedidos que passam por aquele controller. O seed, um script de experiências ou uma rota nova que alguém esqueça de verificar escreviam artigos sem ela. Uma regra escrita no schema do modelo protege tudo o que cria artigos, porque tudo passa pelo modelo. Nas alterações, também, com uma opção que a secção "Alterar só o que vem no pedido" mostra.

O schema da papelaria passa a dizer, campo a campo, o tipo e as regras:

```js check
// src/models/artigo.model.js: o modelo dos artigos da papelaria, no Mongoose.
// O schema descreve a forma dos documentos da coleção artigos e guarda as
// regras de cada campo: o que é obrigatório, os mínimos e as categorias.
// Tudo o que escreve artigos passa por estas regras: a API, o seed e os scripts.
import mongoose from "mongoose";

// As categorias que a papelaria vende. Um artigo de outra categoria é recusado.
const CATEGORIAS = ["Papel", "Escrita", "Desenho"];

const artigoSchema = new mongoose.Schema({
  nome: {
    type: String,
    // O segundo valor de cada regra é a mensagem que a API devolve quando
    // a regra falha. Sem ele, o Mongoose escrevia uma mensagem em inglês.
    required: [true, "O nome é obrigatório"],
    // O trim tira os espaços do início e do fim antes de verificar e guardar.
    // Um nome só com espaços fica vazio, e o required recusa-o.
    trim: true,
    maxlength: [60, "O nome tem no máximo 60 carateres"],
  },
  categoria: {
    type: String,
    required: [true, "A categoria é obrigatória"],
    enum: { values: CATEGORIAS, message: "A categoria tem de ser Papel, Escrita ou Desenho" },
  },
  stock: {
    type: Number,
    required: [true, "O stock é obrigatório"],
    min: [0, "O stock não pode ser negativo"],
  },
  stockMinimo: {
    type: Number,
    required: [true, "O stock mínimo é obrigatório"],
    min: [0, "O stock mínimo não pode ser negativo"],
  },
  precoCentimos: {
    type: Number,
    required: [true, "O preço é obrigatório"],
    min: [1, "O preço tem de ser de pelo menos 1 cêntimo"],
  },
});

// O terceiro argumento é o nome da coleção, escrito à mão, para o Mongoose
// não o inventar com as regras do plural em inglês.
export const Artigo = mongoose.model("Artigo", artigoSchema, "artigos");
```

Leitura guiada: cada campo deixou de ter só o tipo, como `nome: String`, e passou a ser um objeto com o tipo e as regras. São cinco opções, quatro regras e uma limpeza:

- O `required` diz que o campo é obrigatório. Num texto, um texto vazio também conta como em falta.
- O `trim` não é uma regra, é uma limpeza: tira os espaços do princípio e do fim antes de verificar e de guardar. Com ele, `"  Cola  "` fica `"Cola"`, e `"   "` fica vazio, e o `required` recusa-o.
- O `maxlength` é o comprimento máximo de um texto.
- O `min` é o valor mínimo de um número, e o `max`, que aqui não aparece, o máximo.
- O `enum` é a lista dos valores possíveis.

Cada regra tem uma mensagem em português. É essa mensagem que a API vai devolver, e por isso escreve-se para quem usa a aplicação.

O Mongoose verifica estas regras antes de criar um documento na base. Se alguma falhar, não escreve nada e lança um erro chamado `ValidationError`, de validação. O erro traz, em `erro.errors`, um objeto com uma entrada por cada campo recusado, e cada entrada tem a mensagem do schema.

A divisão fica clara. O controller vê a forma do pedido: os campos da lista e o tipo de cada um. O schema vê os valores: se fazem sentido para a papelaria. Um corpo `{ "stock": "dez" }` é recusado pelo controller, porque não é um inteiro. Um corpo `{ "stock": -3 }` passa o controller, e é recusado pelo schema.

Porque é que o tipo fica no controller, e não no schema? Porque o schema converte antes de verificar. O `type: Number` transforma o texto `"10"` no número 10, sem dizer nada, e aceita 2.5, que não é um stock. Só o controller vê o valor tal como veio no pedido, e por isso é ele que sabe se veio um inteiro.

### Criar um artigo

Com a lista fechada e o schema, criar um artigo é curto. O repository usa o `create`, que verifica as regras e insere:

```js
/**
 * Insere um artigo novo. O schema verifica as regras de cada campo antes de
 * inserir; se alguma falhar, a promessa é rejeitada com um ValidationError.
 * @param {object} dados os campos do artigo, só os da lista do controller
 * @returns {Promise<object>} o artigo inserido, já com o _id que o MongoDB lhe deu
 */
export async function inserirArtigo(dados) {
  const artigo = await Artigo.create(dados);
  return artigo;
}
```

O service passa os dados ao repository. É uma função fina, que existe para o controller só conhecer o service:

```js
/**
 * Cria um artigo novo. As regras de cada campo estão no schema do modelo.
 * @param {object} dados os campos do artigo, já com o tipo verificado pelo controller
 * @returns {Promise<object>} o artigo criado
 */
export async function criarArtigo(dados) {
  const artigo = await inserirArtigo(dados);
  return artigo;
}
```

E o controller lê o corpo, chama o service e responde 201, com o artigo criado:

```js
/** POST /api/artigos, com o artigo novo no corpo, em JSON */
export async function criar(req, res) {
  const leitura = lerCamposDoArtigo(req.body);
  if (leitura.erro) {
    res.status(400).json({ erro: leitura.erro });
    return;
  }
  // Se uma regra do schema falhar, o criarArtigo rejeita a promessa, e o
  // Express passa o erro ao middleware de erros, no server.js, que responde 400.
  const artigo = await criarArtigo(leitura.dados);
  res.status(201).json(artigo);
}
```

A rota junta-se ao router, com o método `post`:

```js
router.post("/", criar);
```

### O middleware de erros

Falta uma peça. Quando o schema recusa um artigo, o `create` rejeita a promessa, e o `await` do controller lança o erro. Nenhuma linha do controller o apanha. No Express 5, um erro lançado dentro de uma função `async` de uma rota não fica perdido: o Express apanha-o e passa-o ao **middleware de erros**.

Um middleware de erros é um middleware com quatro parâmetros, `(erro, req, res, next)`, em vez de três. É pelos quatro parâmetros que o Express o reconhece. Só é chamado quando um pedido acabou num erro, e os pedidos normais passam-lhe ao lado. Regista-se no `server.js`, depois de todas as rotas:

```js
// Middleware de erros: o Express só o chama quando um pedido acabou num erro,
// e reconhece-o pelos quatro parâmetros. Responde sempre em JSON, sem
// pormenores internos.
app.use((erro, req, res, next) => {
  // O express.json() não conseguiu ler o corpo: o texto não era JSON.
  if (erro.type === "entity.parse.failed") {
    res.status(400).json({ erro: "O corpo do pedido não é JSON válido" });
    return;
  }
  // Uma ou mais regras do schema falharam. O erro traz, em erro.errors, um
  // objeto com um campo por cada regra que falhou, e cada um tem a mensagem
  // que escreveste no schema. A resposta junta-as todas num só texto.
  if (erro.name === "ValidationError") {
    const mensagens = Object.values(erro.errors).map((falha) => falha.message);
    res.status(400).json({ erro: mensagens.join(". ") });
    return;
  }
  // Qualquer outro erro é um problema do servidor, e não de quem pediu.
  // A razão fica no terminal, para quem programa; o cliente recebe só o 500.
  console.error(`Erro interno: ${erro.message}`);
  res.status(500).json({ erro: "Erro interno do servidor" });
});
```

Antes de continuares, prevê o que a API responde a um `POST /api/artigos` com `{ "nome": "Cola", "categoria": "Desenho", "stock": -1, "stockMinimo": 1, "precoCentimos": 150 }`. E com o mesmo corpo, mas com `"categoria": "Mochilas"` e o stock a -1?

O resultado é 400 com `{"erro":"O stock não pode ser negativo"}`. No segundo, 400 com `{"erro":"A categoria tem de ser Papel, Escrita ou Desenho. O stock não pode ser negativo"}`. Os dois corpos passam a lista fechada, porque os campos e os tipos estão certos. O schema recusa-os, o `create` rejeita a promessa, e o middleware de erros junta as mensagens dos campos recusados.

Leitura guiada: o middleware trata três casos, por esta ordem. O primeiro é o corpo que não é JSON: o `express.json()` marca esse erro com `type` igual a `"entity.parse.failed"`. O segundo é a recusa do schema, que se reconhece pelo nome, `ValidationError`. O `Object.values(erro.errors)` dá a lista das entradas, uma por campo recusado, e o `map` tira de cada uma a mensagem. O `join(". ")` junta-as num só texto. O terceiro é tudo o resto. Se o Atlas falhar a meio de um pedido, por exemplo, a culpa não é de quem pediu. A API responde 500, sem pormenores, e escreve a razão no terminal, para quem programa.

O `server.js` fica assim, com as peças pela ordem em que o Express as percorre:

```js check
// src/server.js: o ponto de arranque da API da papelaria.
// Cria a aplicação Express, monta as rotas, liga-se à base de dados e só
// depois à porta. As regras e as consultas estão nas camadas.
import express from "express";
import { ligarBaseDeDados } from "./db/mongoose.js";
import artigosRotas from "./rotas/artigos.rotas.js";

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, a API usa a 3000.
const PORTA = process.env.PORT || 3000;

const app = express();

// Lê o corpo dos pedidos que chegam em JSON e põe-no em req.body, já como
// objeto. Sem esta linha, o req.body ficava undefined em todos os pedidos.
app.use(express.json());

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

// Middleware de erros: o Express só o chama quando um pedido acabou num erro,
// e reconhece-o pelos quatro parâmetros. Responde sempre em JSON, sem
// pormenores internos.
app.use((erro, req, res, next) => {
  // O express.json() não conseguiu ler o corpo: o texto não era JSON.
  if (erro.type === "entity.parse.failed") {
    res.status(400).json({ erro: "O corpo do pedido não é JSON válido" });
    return;
  }
  // Uma ou mais regras do schema falharam. O erro traz, em erro.errors, um
  // objeto com um campo por cada regra que falhou, e cada um tem a mensagem
  // que escreveste no schema. A resposta junta-as todas num só texto.
  if (erro.name === "ValidationError") {
    const mensagens = Object.values(erro.errors).map((falha) => falha.message);
    res.status(400).json({ erro: mensagens.join(". ") });
    return;
  }
  // Qualquer outro erro é um problema do servidor, e não de quem pediu.
  // A razão fica no terminal, para quem programa; o cliente recebe só o 500.
  console.error(`Erro interno: ${erro.message}`);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

// Primeiro a ligação à base, e só depois o servidor: uma API que não chega aos
// dados não deve começar a aceitar pedidos. Se a ligação falhar, a API termina
// com a razão escrita no terminal.
try {
  await ligarBaseDeDados();
} catch (erro) {
  console.error(`Não foi possível ligar à base de dados: ${erro.message}`);
  process.exit(1);
}

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a API: ${erro.message}`);
    return;
  }
  console.log(`API a correr em http://localhost:${PORTA}`);
});
```

Leitura guiada: lê-se de cima para baixo, que é a ordem por que um pedido passa. Primeiro, o `express.json()`, que lê o corpo de todos os pedidos. Depois, a rota de estado e o router dos artigos. A seguir, o middleware final, para os pedidos a que nenhuma rota respondeu, e o middleware de erros, para os que acabaram num erro. No fim, fora do caminho dos pedidos, a ligação à base e só depois o `app.listen`. O ficheiro completo, com o resto da API, está no exemplo [a API com o CRUD](../exemplos/acesso-a-dados/papelaria-api-com-crud/README.md).

Repara que a resposta 500 não leva a mensagem do erro. Uma mensagem interna pode ter o nome de uma coleção, de um ficheiro, ou um pedaço de uma consulta. Quem usa a aplicação não precisa disso, e quem a quer atacar agradece. O tema da robustez vai voltar a estes erros, com os que vêm da base de dados.

Quando há várias regras a falhar, a ordem das mensagens é a que o Mongoose escolhe, e nem sempre é a dos campos do schema. Com o corpo `{}`, a resposta começa por `O preço é obrigatório` e acaba em `O nome é obrigatório`. O texto tem as mensagens todas, e é isso que interessa a quem pediu.

## Alterar só o que vem no pedido

O `PATCH /api/artigos/:id` muda os campos que vierem no corpo e deixa os outros como estão. A papelaria recebeu sete cadernos e quer mudar o stock: o corpo é só `{ "stock": 7 }`.

O controller faz as verificações que já conheces, pela ordem do contrato: a forma do `id`, a lista fechada, e uma nova. Um corpo sem campos nenhuns, `{}`, passa a lista fechada, porque não traz nenhum campo errado. Mas também não traz nada para alterar, e o contrato diz que vem pelo menos um. O `Object.keys(leitura.dados).length === 0` apanha-o.

```js
/** PATCH /api/artigos/:id, com os campos a alterar no corpo, em JSON */
export async function alterar(req, res) {
  const id = req.params.id;
  if (!eIdentificador(id)) {
    res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
    return;
  }
  const leitura = lerCamposDoArtigo(req.body);
  if (leitura.erro) {
    res.status(400).json({ erro: leitura.erro });
    return;
  }
  if (Object.keys(leitura.dados).length === 0) {
    res.status(400).json({ erro: "O pedido não traz nenhum campo para alterar" });
    return;
  }
  const artigo = await alterarArtigo(id, leitura.dados);
  if (artigo === null) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
}
```

O repository usa o `findByIdAndUpdate`, que procura o artigo pelo `_id` e muda os campos recebidos. Escrito só com os dois primeiros argumentos, `Artigo.findByIdAndUpdate(id, dados)`, tem duas surpresas, e as duas veem-se num pedido.

A primeira: depois de `{ "stock": 7 }`, a resposta mostra o stock antigo, 12. No Atlas, o stock já é 7. Por omissão, o `findByIdAndUpdate` devolve o documento como estava antes da alteração.

A segunda: um `PATCH` com `{ "stock": -5 }` responde 200, e no Atlas o stock fica mesmo -5. A regra do `min` não correu. Por omissão, o Mongoose só verifica as regras do schema quando um documento é criado, e não quando é alterado assim.

As duas resolvem-se com opções, num terceiro argumento. Para as encontrar, abre-se a documentação do Mongoose, na página do `Model.findByIdAndUpdate()`. A lista das opções tem as duas que fazem falta. O `returnDocument`, com o valor `'after'`, devolve o documento depois da alteração. O `runValidators`, com `true`, faz correr as regras do schema sobre os campos alterados.

```js
/**
 * Altera os campos recebidos de um artigo, e deixa os outros como estão.
 * @param {string} id um identificador com a forma de um ObjectId, já verificado
 * @param {object} dados os campos a alterar, só os da lista do controller
 * @returns {Promise<object | null>} o artigo depois da alteração, ou null se não existir
 */
export async function alterarPorId(id, dados) {
  // Sem as duas opções, o findByIdAndUpdate devolvia o artigo como estava
  // antes da alteração, e não verificava as regras do schema, que por omissão
  // só correm quando um documento é criado.
  const artigo = await Artigo.findByIdAndUpdate(id, dados, {
    returnDocument: "after",
    runValidators: true,
  });
  return artigo;
}
```

A documentação mostra também uma opção mais antiga, `new: true`, que faz o mesmo do que o `returnDocument: "after"`. Muitos tutoriais na internet usam-na. No Mongoose 9, está marcada como obsoleta, e usá-la faz aparecer um aviso no terminal a recomendar o `returnDocument`. Ler a documentação da versão que tens instalada evita estas surpresas. O `package.json` diz só um intervalo de versões, como `^9.11.4`. A versão instalada vê-se no `package-lock.json`, ou com o comando `npm ls mongoose`.

O service passa os dados ao repository, como na criação:

```js
/**
 * Altera os campos recebidos de um artigo.
 * @param {string} id um identificador já verificado pelo controller
 * @param {object} dados os campos a alterar, já com o tipo verificado
 * @returns {Promise<object | null>} o artigo alterado, ou null se não existir
 */
export async function alterarArtigo(id, dados) {
  const artigo = await alterarPorId(id, dados);
  return artigo;
}
```

E a rota junta-se ao router com o método `patch`:

```js
router.patch("/:id", alterar);
```

Com as duas opções, um `PATCH` com `{ "stock": -5 }` responde 400, com `{"erro":"O stock não pode ser negativo"}`, e o stock no Atlas não muda. A mensagem é a do schema, pelo mesmo middleware de erros do `POST`.

## Apagar, e a regra que precisa da base

A papelaria tem uma regra para apagar: um artigo só sai do catálogo quando já não há unidades na loja. Enquanto houver stock, ainda há o que vender, e apagar o artigo perdia a informação dessas unidades.

Esta regra não cabe no schema. O schema verifica os valores que se vão escrever, e um `DELETE` não escreve nada. Para saber se o artigo tem stock, é preciso ir à base ver como ele está agora. Uma regra que precisa do estado dos dados fica no service, que pode pedir esse estado ao repository.

```js
/**
 * Apaga um artigo, se a regra da papelaria o deixar.
 * @param {string} id um identificador já verificado pelo controller
 * @returns {Promise<string>} o que aconteceu: "apagado", "nao-existe" ou "tem-stock"
 */
export async function apagarArtigo(id) {
  const artigo = await procurarPorId(id);
  if (artigo === null) {
    return "nao-existe";
  }
  // Regra da papelaria: um artigo só sai do catálogo quando já não há
  // unidades na loja. Enquanto houver stock, ainda há o que vender.
  if (artigo.stock > 0) {
    return "tem-stock";
  }
  await apagarPorId(id);
  return "apagado";
}
```

Leitura guiada: o service pede o artigo ao repository. Se não existe, devolve `"nao-existe"`. Se existe e tem stock, devolve `"tem-stock"`, sem apagar. Só no terceiro caso pede ao repository que o apague, e devolve `"apagado"`. O service não escolhe códigos HTTP: diz o que aconteceu, com uma palavra, e o controller traduz cada palavra num código.

```js
/** DELETE /api/artigos/:id */
export async function apagar(req, res) {
  const id = req.params.id;
  if (!eIdentificador(id)) {
    res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
    return;
  }
  const resultado = await apagarArtigo(id);
  if (resultado === "nao-existe") {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  if (resultado === "tem-stock") {
    res.status(409).json({ erro: "Não se pode apagar um artigo que ainda tem stock" });
    return;
  }
  // 204: apagado, e a resposta não tem corpo.
  res.status(204).end();
}
```

Antes de continuares, prevê o que respondem estes dois pedidos, na base de teste acabada de reconstruir. O primeiro é o `DELETE` do Caderno A4 quadriculado, que tem 12 unidades; o segundo, o do Bloco de notas A5, que tem 0. E se repetires o segundo?

O resultado é 409 com `{"erro":"Não se pode apagar um artigo que ainda tem stock"}`, depois 204 sem corpo, e depois 404 com `{"erro":"Não existe o artigo ..."}`, com o `_id` do bloco. O bloco foi apagado da primeira vez, e da segunda já não existe.

Leitura guiada: o controller verifica a forma do `id` e chama o service. As três palavras dão três respostas. O `res.status(204).end()` responde sem corpo, porque não há nada a devolver depois de apagar. O `end()` termina a resposta sem escrever nada, ao contrário do `json`, que escreveria um corpo.

No repository, o `findByIdAndDelete` apaga o documento com aquele `_id`:

```js
/**
 * Apaga um artigo.
 * @param {string} id um identificador com a forma de um ObjectId, já verificado
 * @returns {Promise<void>} cumprida quando o artigo foi apagado
 */
export async function apagarPorId(id) {
  await Artigo.findByIdAndDelete(id);
}
```

A rota junta-se ao router com o método `delete`. Com as três rotas novas, o router fica assim:

```js check
// src/rotas/artigos.rotas.js: que pedido vai para que função do controller.
// Os caminhos são relativos ao sítio onde este router é montado, em server.js:
// "/" quer dizer /api/artigos, e "/:id" quer dizer /api/artigos/:id.
import express from "express";
import { listar, abaixoDoMinimo, obter, criar, alterar, apagar } from "../controllers/artigos.controller.js";

const router = express.Router();

router.get("/", listar);
// O caminho fixo vem antes do caminho com parâmetro. Ao contrário,
// /abaixo-do-minimo seria tratado como um :id, e daria 400.
router.get("/abaixo-do-minimo", abaixoDoMinimo);
router.get("/:id", obter);
router.post("/", criar);
router.patch("/:id", alterar);
router.delete("/:id", apagar);

export default router;
```

Há um caso que este código não trata. Entre o `procurarPorId` e o `apagarPorId` passa um instante. Se, nesse instante, outro pedido mudasse o stock do artigo, o service apagava um artigo que já tinha stock. Numa papelaria com uma pessoa ao balcão, não acontece. Numa aplicação com muitos utilizadores ao mesmo tempo, faz-se a verificação e o apagar numa só operação da base de dados.

## Ver o que vai mudar antes de mudar muitos

O `findByIdAndDelete` apaga um artigo, escolhido pelo `_id`. O `deleteMany`, que viste no seed, apaga todos os que cumprirem um filtro. O `updateMany` faz o mesmo para alterar. Mudam muitos documentos de uma vez, e um filtro errado faz estragos. O `deleteMany({})`, com o filtro vazio, apaga a coleção inteira.

A regra para estas operações é simples. Antes de mudar ou apagar vários documentos, corre o mesmo filtro num `find`, ou num `countDocuments`, que só os conta, e vê o que ele escolhe. Só depois corres o `deleteMany` ou o `updateMany`, com o mesmo filtro. E faz a experiência na base de teste, que o seed reconstrói, para um filtro errado não estragar nada que interesse.

Imagina que a papelaria deixou de vender artigos de desenho e quer apagar essa categoria. Não é um pedido da API: é uma operação que se faz uma vez, à parte, como o seed. Faz-se com um script, que primeiro mostra e só depois apaga:

```js check
// src/apagar-categoria.js: apaga da base de teste os artigos de uma categoria.
// Corre-se à parte, como o seed, com a categoria no fim do comando:
//   node --env-file=.env src/apagar-categoria.js Desenho
// Mostra primeiro o que o filtro escolhe, e só apaga quando lhe juntas --apagar.
import mongoose from "mongoose";
import { ligarBaseDeDados } from "./db/mongoose.js";
import { Artigo } from "./models/artigo.model.js";

// O process.argv é a lista das palavras do comando: o node, o caminho do
// script e, a partir da terceira posição, o que escreveste a seguir.
const categoria = process.argv[2];
const confirmado = process.argv.includes("--apagar");

try {
  await ligarBaseDeDados();
  const nomeDaBase = mongoose.connection.name;
  if (!nomeDaBase.endsWith("-teste")) {
    console.error(`Este script só corre numa base de teste, e esta é a ${nomeDaBase}.`);
  } else if (categoria === undefined || categoria === "--apagar") {
    console.error("Falta a categoria: node --env-file=.env src/apagar-categoria.js Desenho");
  } else {
    // Primeiro, ver o que vai mudar: o mesmo filtro, num find.
    const filtro = { categoria: categoria };
    const escolhidos = await Artigo.find(filtro);
    console.log(`O filtro escolhe ${escolhidos.length} artigos.`);
    for (const artigo of escolhidos) {
      console.log(`  ${artigo.nome}`);
    }
    if (!confirmado) {
      console.log("Nada foi apagado. Para apagar, corre o mesmo comando com --apagar no fim.");
    } else {
      // Depois, apagar com o mesmo filtro, e confirmar quantos saíram.
      const resultado = await Artigo.deleteMany(filtro);
      console.log(`Apagados ${resultado.deletedCount} artigos`);
    }
  }
} catch (erro) {
  console.error(`O script falhou: ${erro.message}`);
}

await mongoose.disconnect();
```

Antes de continuares, prevê o que o script escreve com `node --env-file=.env src/apagar-categoria.js Desenho`, na base de teste reconstruída. E se correres o mesmo comando com `--apagar` no fim, e depois outra vez sem ele?

O resultado da primeira vez é este, e nada é apagado:

```text
Ligada à base de dados papelaria-teste
O filtro escolhe 2 artigos.
  Régua de 30 cm
  Compasso escolar
Nada foi apagado. Para apagar, corre o mesmo comando com --apagar no fim.
```

Com o `--apagar`, as mesmas linhas, até aos dois nomes, e no fim `Apagados 2 artigos`. Da terceira vez, `O filtro escolhe 0 artigos.` A contagem do `find` e o `deletedCount` do `deleteMany` dão o mesmo número, e é isso que confirma que o filtro apagou o que mostrou.

Leitura guiada: o `process.argv` é a lista das palavras do comando que escreveste. As duas primeiras são o caminho do `node` e o do script, e por isso a categoria é a terceira, `process.argv[2]`. O `includes("--apagar")` procura essa palavra em qualquer posição. O script confirma primeiro que está numa base de teste, como o seed. Depois corre o filtro num `find` e mostra os nomes. Só com o `--apagar` corre o `deleteMany`, com o mesmo objeto `filtro`, que não se escreve duas vezes. Se se escrevesse duas vezes, podia sair diferente da segunda.

Repara que a régua e o compasso têm stock, e o script apaga-os. A regra do stock ao apagar está no service, e o script não passa pelo service: fala com o modelo diretamente. As regras do service só protegem os pedidos da API; as do schema protegem tudo o que cria artigos. Um script destes faz-se com essa consciência, e na base de teste. Numa papelaria a sério, primeiro vendia-se o que restava.

## Os dados pessoais e o RGPD

A papelaria guarda artigos. Muitas aplicações guardam também informação sobre pessoas: clientes, alunos, jogadores. Essa informação tem regras próprias, que valem também para ti, enquanto programas.

Um **dado pessoal** é qualquer informação sobre uma pessoa identificada, ou que se pode identificar. O nome é um dado pessoal, e o email também. O número de aluno também é, mesmo sem o nome ao lado, porque quem tiver a lista da turma descobre de quem é. Uma fotografia, uma morada, um número de telefone e o endereço IP de um computador também são.

O **RGPD**, o Regulamento Geral sobre a Proteção de Dados, é a lei da União Europeia que diz como se podem recolher e guardar dados pessoais. Aplica-se desde maio de 2018, em todos os países da União. Em Portugal, quem verifica se é cumprido é a Comissão Nacional de Proteção de Dados, a CNPD. Para quem programa, há três ideias do RGPD que mudam o código que escreves.

A primeira é guardar só o necessário. Antes de pôr um campo num schema, pergunta que ecrã ou que relatório o vai usar. Se nenhum o usa, não se guarda. Uma aplicação que regista as reservas da sala de estudo da biblioteca precisa do nome e da turma de quem reserva, para o funcionário confirmar à porta. Não precisa da morada nem da data de nascimento. Um dado que não se guarda não se perde, não se rouba e não se tem de proteger.

A segunda é saber quem acede. Quem tem a cadeia de ligação entra na base, e por isso ela fica no `.env`. Quem tem acesso ao teu projeto do Atlas vê os dados: tu e o professor, que tem o papel de leitura que lhe deste. Uma resposta da API também é um acesso. Se o ecrã só mostra o nome de um jogador, a API não deve devolver o email dele, mesmo que o tenha guardado. O tema seguinte trata da projeção, que escolhe os campos de uma resposta.

A terceira é o motivo dos dados fictícios. Num projeto da escola, a base de dados está num cluster gratuito, a palavra-passe passa pelo teu computador, e o ecrã vê-se no projetor. Nada disto é um sistema preparado para guardar dados de pessoas verdadeiras. Por isso, a tua aplicação usa dados inventados, ou nomes que toda a gente conhece, como os títulos de filmes do cinema. Se a base de teste aparecer onde não devia, não expõe ninguém. Nunca uses os nomes, os números ou os emails dos teus colegas nos dados de teste.

## Exemplo guiado: registar uma venda

O problema: a papelaria quer registar as vendas no balcão. Quando um cliente leva duas esferográficas, o stock da esferográfica azul tem de descer duas unidades. E uma venda nunca pode deixar o stock negativo: se só há uma esferográfica, uma venda de duas é recusada.

### Passo 1: o contrato

Antes do código, decide-se o pedido. Uma venda não é alterar um artigo à mão: é uma ação, com uma regra própria. Um `PATCH` com `{ "stock": 1 }` mudaria o stock, mas quem pede teria de fazer a conta, e de saber o stock no momento exato. Fica melhor um pedido próprio, que recebe só a quantidade, e é a API que faz a conta e aplica a regra.

| Pedido | Corpo | Respostas |
| --- | --- | --- |
| `POST /api/artigos/:id/vendas` | `{ "quantidade": 2 }`, com a quantidade inteira, 1 ou mais, e nenhum outro campo | 200 com o artigo depois da venda; 400 se o `id` ou o corpo não forem válidos; 404 se o artigo não existir; 409 se não houver stock que chegue |

É um `POST`, porque cada venda é um acontecimento novo, e duas vendas iguais tiram o dobro do stock. Responde 200, e não 201, porque a API não guarda a venda como um documento novo: altera o artigo que já existe. Repara no 409. O pedido de duas esferográficas está bem escrito, e passa noutro dia, com mais stock. É o estado dos dados que não o deixa passar agora.

### Passo 2: em que camada fica cada parte

Antes de escrever, reparte-se o trabalho:

| O que é preciso | Porquê | Camada |
| --- | --- | --- |
| O `id` com a forma de um ObjectId | É a forma do pedido | Controller |
| O corpo só com a `quantidade`, inteira e 1 ou mais | A quantidade é um valor do pedido, e não um campo do artigo: o schema não a conhece | Controller |
| O stock tem de chegar para a venda | É uma regra da papelaria, e precisa do stock de agora | Service |
| Ler o artigo e mudar o stock | É uma consulta e uma alteração na base | Repository |

O repository não precisa de nada de novo. A `procurarPorId` lê o artigo, e a `alterarPorId` muda o stock, com as regras do schema a correr. É a recompensa das camadas: uma regra nova reutiliza o acesso à base que já existe.

### Passo 3: o service

```js
/**
 * Regista a venda de uma quantidade de um artigo, se houver stock que chegue.
 * @param {string} id um identificador já verificado pelo controller
 * @param {number} quantidade um inteiro, 1 ou mais, já verificado pelo controller
 * @returns {Promise<object>} { resultado } com "vendido", "nao-existe" ou "sem-stock";
 *   com "vendido", também o artigo depois da venda; com "sem-stock", o stock que havia
 */
export async function registarVenda(id, quantidade) {
  const artigo = await procurarPorId(id);
  if (artigo === null) {
    return { resultado: "nao-existe" };
  }
  // Regra da papelaria: não se vende o que não está na loja. O stock nunca
  // fica negativo por causa de uma venda.
  if (artigo.stock < quantidade) {
    return { resultado: "sem-stock", stock: artigo.stock };
  }
  const vendido = await alterarPorId(id, { stock: artigo.stock - quantidade });
  return { resultado: "vendido", artigo: vendido };
}
```

O service precisa de dizer três coisas diferentes e, numa delas, de devolver o artigo, e noutra, o stock que havia. Uma só palavra já não chega, por isso devolve um objeto, com a palavra em `resultado` e os dados que fizerem falta.

### Passo 4: o controller e a rota

```js
/** POST /api/artigos/:id/vendas, com a quantidade vendida no corpo, em JSON */
export async function vender(req, res) {
  const id = req.params.id;
  if (!eIdentificador(id)) {
    res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
    return;
  }
  // O corpo de uma venda tem um só campo, a quantidade. A lista fechada,
  // aqui, tem um nome só.
  const corpo = req.body;
  if (typeof corpo !== "object" || corpo === null || Array.isArray(corpo)) {
    res.status(400).json({ erro: "O corpo do pedido tem de ser um objeto JSON" });
    return;
  }
  const campos = Object.keys(corpo);
  if (campos.length !== 1 || campos[0] !== "quantidade") {
    res.status(400).json({ erro: "O corpo de uma venda tem só o campo quantidade" });
    return;
  }
  // A quantidade não é um campo do artigo, e o schema não a conhece.
  // Por isso, o controller verifica o tipo e o limite.
  if (!Number.isInteger(corpo.quantidade) || corpo.quantidade < 1) {
    res.status(400).json({ erro: "A quantidade tem de ser um número inteiro, 1 ou mais" });
    return;
  }
  const venda = await registarVenda(id, corpo.quantidade);
  if (venda.resultado === "nao-existe") {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  if (venda.resultado === "sem-stock") {
    res.status(409).json({ erro: `Não há stock que chegue: o artigo tem ${venda.stock} e a venda pede ${corpo.quantidade}` });
    return;
  }
  res.json(venda.artigo);
}
```

A lista fechada, aqui, tem um só nome, e por isso a verificação escreve-se diretamente: um só campo, e esse campo é a `quantidade`. A rota junta-se ao router com o caminho `/:id/vendas`:

```js
router.post("/:id/vendas", vender);
```

### Passo 5: verificar

Reconstrói-se a base de teste com o seed, e liga-se a API. Na consola do browser, numa página da API, cola-se primeiro a função `pedir`, da secção "O corpo do pedido". Depois, guarda-se o `_id` da esferográfica azul, que tem 3 unidades, numa variável, para não o escrever em cada pedido. O `_id` lê-se na lista de `/api/artigos`, e o teu é diferente deste:

```js
const esferografica = "6ae50e2d85dbd5b39ccc134a";
```

Os pedidos fazem-se pela ordem desta lista. O caminho de cada um escreve-se entre acentos graves, com o `${esferografica}` no lugar do `_id`, como as mensagens com valores do controller:

```js
await pedir("POST", `/api/artigos/${esferografica}/vendas`, { quantidade: 2 });
await pedir("POST", `/api/artigos/${esferografica}/vendas`, { quantidade: 2 });
await pedir("POST", `/api/artigos/${esferografica}/vendas`, { quantidade: 1 });
await pedir("POST", `/api/artigos/${esferografica}/vendas`, { quantidade: 0 });
await pedir("POST", `/api/artigos/${esferografica}/vendas`, { quantidade: "1" });
await pedir("POST", `/api/artigos/${esferografica}/vendas`, { quantidade: 1, preco: 5 });
await pedir("POST", "/api/artigos/000000000000000000000000/vendas", { quantidade: 1 });
await pedir("POST", "/api/artigos/abc/vendas", { quantidade: 1 });
```

Antes de cada pedido, escreve-se a previsão. Depois, compara-se:

| Pedido | O que se experimenta | Código e resposta |
| ---: | --- | --- |
| 1 | Uma venda de 2, com 3 em stock | 200, com o artigo e `"stock":1` |
| 2 | A mesma venda, agora com 1 em stock | 409, com `{"erro":"Não há stock que chegue: o artigo tem 1 e a venda pede 2"}` |
| 3 | Uma venda de 1, com 1 em stock | 200, com `"stock":0`: a venda pode deixar o stock a zero |
| 4 | Uma quantidade de 0 | 400, com `{"erro":"A quantidade tem de ser um número inteiro, 1 ou mais"}` |
| 5 | A quantidade em texto | 400, com a mesma mensagem |
| 6 | Um campo a mais | 400, com `{"erro":"O corpo de uma venda tem só o campo quantidade"}` |
| 7 | Um `_id` que não existe | 404, com `{"erro":"Não existe o artigo 000000000000000000000000"}` |
| 8 | Um `_id` mal escrito | 400, com a mensagem do identificador |

Nos pedidos que dão erro, a consola mostra também uma linha a vermelho, `Failed to load resource`. É o browser a avisar que o código da resposta é de erro, e a linha que interessa é a que a `pedir` escreve.

O pedido 3 é o valor de fronteira: o stock fica exatamente a zero, e a regra deixa, porque `1 < 1` é falso. Com o `<=` no lugar do `<`, no service, a papelaria nunca conseguia vender a última unidade.

A última verificação faz-se no Atlas, e não na API. Na base `papelaria-teste`, a esferográfica azul tem `stock: 0`. A API disse que vendeu, e a base confirma. Quando uma resposta da API diz que alterou alguma coisa, confirma na base pelo menos uma vez. É a forma de saber que a API não está só a dizer o que esperavas.

## Erros frequentes

### A lista vem {} e não aparece nenhum erro

Falta o `await` antes da chamada ao service, no controller. Sem ele, a variável guarda a promessa, e o `res.json` de uma promessa é `{}`. Um `await` em falta no service dá outro sintoma, um 500 com `is not a function`, quando o service usa o resultado.

### Um artigo pedido dá 500, e o terminal fala de Cast to ObjectId

O terminal mostra `Erro interno: Cast to ObjectId failed for value "abc"`, ou, sem o middleware de erros, uma linha que começa por `CastError`. O `id` chegou ao `findById` sem ser verificado. O Mongoose não conseguiu convertê-lo num ObjectId. Confirma que a função do controller chama a `eIdentificador` antes de chamar o service, e que responde 400 com `return`.

### O POST responde que o corpo tem de ser um objeto JSON, e o corpo está certo

O corpo chegou, mas o `req.body` ficou `undefined`. Há duas causas. Uma é faltar o `app.use(express.json())` no `server.js`, ou estar depois do `app.use` das rotas. O middleware só lê o corpo dos pedidos que passam por ele antes de chegarem às rotas. A outra é o pedido não trazer o cabeçalho `Content-Type: application/json`. Sem ele, o `express.json()` não lê o corpo. A função `pedir` junta-o sempre que há corpo.

### O PATCH responde com os valores antigos

Falta a opção `returnDocument: "after"` no `findByIdAndUpdate`. A base foi alterada, mas a função devolveu o documento como estava antes. Confirma no Atlas: o valor novo está lá.

### O PATCH aceita um stock negativo

Falta a opção `runValidators: true` no `findByIdAndUpdate`. Sem ela, as regras do schema só correm quando o documento é criado. Corrige, e corre o seed para limpar o stock negativo da base de teste.

### Aparece no terminal um aviso sobre a opção new

O repository usa `new: true`, que o Mongoose 9 marca como obsoleta. Troca-a por `returnDocument: "after"`, que faz o mesmo.

### A resposta 400 vem em HTML, e não em JSON

Um corpo que não é JSON válido chegou ao Express, e o middleware de erros não o apanhou. Ou o middleware de erros não existe, ou não tem os quatro parâmetros. Com três, o Express trata-o como um middleware normal, e o erro vai para o tratamento do próprio Express, que responde em HTML.

### O seed diz que só corre numa base de teste

O `DB_NAME` do `.env` não acaba em `-teste`. É a verificação do seed a fazer o seu trabalho. Muda a linha para `DB_NAME=papelaria-teste` e volta a correr.

## Palavras novas deste guia

- CRUD: as quatro operações de quem guarda dados: criar, ler, alterar e apagar.
- Base de teste: uma base de dados com dados conhecidos, só para experiências, que um script reconstrói.
- Bundle: o conjunto de ficheiros da interface que o browser descarrega e que qualquer pessoa pode ler.
- Promessa: o objeto que uma função `async` devolve logo, e que representa uma resposta que ainda não chegou. O `await` espera por ela.
- Corpo do pedido: a parte de um pedido que leva dados, depois do endereço e dos cabeçalhos.
- Cabeçalho: uma linha de informação que acompanha um pedido ou uma resposta, como o `Content-Type`.
- `express.json()`: o middleware que lê o corpo em JSON e o guarda, como objeto, em `req.body`.
- Mass assignment (atribuição em massa): guardar tudo o que vem num pedido, incluindo campos que ninguém quis deixar mudar.
- Lista fechada: a lista dos campos que um pedido pode trazer; tudo o resto é recusado.
- Domínio: o assunto de que a aplicação trata. As regras de domínio dizem o que faz sentido para ele.
- `ValidationError`: o erro que o Mongoose lança quando uma regra do schema falha.
- Middleware de erros: um middleware com quatro parâmetros, que o Express só chama quando um pedido acabou num erro.
- 201, 204, 409 e 500: criado; correu bem, sem corpo; conflito com o estado dos dados; erro interno do servidor.
- Dado pessoal: qualquer informação sobre uma pessoa identificada ou que se pode identificar.
- RGPD: o Regulamento Geral sobre a Proteção de Dados, a lei da União Europeia sobre os dados pessoais.

## Verificar o que aprendeste

1. Porque é que a API abre a ligação ao Atlas no arranque, e não em cada pedido? Dá duas razões.
2. Um colega pôs a cadeia de ligação num ficheiro do React, "só para experimentar". O que pode acontecer?
3. Que dois erros diferentes distingue o controller num `GET /api/artigos/:id`, e com que códigos?
4. O que responde a API a um `POST` com `{ "nome": "Cola", "categoria": "Desenho", "stock": 1, "stockMinimo": 1, "precoCentimos": 150, "desconto": 10 }`? E porque é que é melhor recusar do que ignorar o `desconto`?
5. Diz em que camada fica cada uma destas regras, no controller, no schema ou no service. O stock é um inteiro. O stock é 0 ou mais. Um artigo com stock não se apaga.
6. Sem o `runValidators`, o que acontece a um `PATCH` com um preço de 0 cêntimos?
7. Qual é a diferença entre um 400 e um 409? Dá um exemplo de cada na papelaria.
8. Antes de um `deleteMany`, o que se faz, e onde?
9. Uma aplicação de inscrições num torneio guarda o nome, a turma, o email e a data de nascimento de cada jogador. O ecrã só mostra o nome e a turma. Que campos são dados pessoais, e quais deixarias de guardar?

## O que vem a seguir

Para praticar este tema, faz o [laboratório da papelaria](05-ligacao-segura-crud-e-regras-de-dominio-laboratorio.md) e depois a [ficha de exercícios](05-ligacao-segura-crud-e-regras-de-dominio-exercicios.md). Se fizeste o tema anterior no projeto do cinema, faz o [laboratório do cinema da escola](05-ligacao-segura-crud-e-regras-de-dominio-laboratorio-cinema.md) no lugar do da papelaria. O tema seguinte é Queries e paginação, em que a lista dos artigos ganha pesquisa, ordenação e páginas, sem aceitar operadores que ninguém previu.

## Para saber mais

Consultados a 30 de outubro de 2026:

- [Validação no Mongoose](https://mongoosejs.com/docs/validation.html), em inglês: todas as regras que um schema aceita, e as validações nas alterações, com o `runValidators`.
- [A página do Model, na documentação do Mongoose](https://mongoosejs.com/docs/api/model.html), em inglês: o `create`, o `findById`, o `findByIdAndUpdate` e o `findByIdAndDelete`, cada um com as suas opções.
- [Códigos de estado HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status), na documentação da Mozilla, em inglês: o 201, o 204, o 409 e o 500, com os outros.
- [Comissão Nacional de Proteção de Dados](https://www.cnpd.pt/), em português: o que é o RGPD e o que diz sobre os direitos de cada pessoa.

![Rodapé](../imagens/rodape.png)
