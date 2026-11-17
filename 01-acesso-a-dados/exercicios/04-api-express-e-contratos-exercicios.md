![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: API Express e contratos

Lês e escreves o contrato da API do torneio de futsal e as camadas que o cumprem, com decisões que a papelaria do guia não tomou. Os exercícios 1 a 4 são obrigatórios, por esta ordem. As respostas dos exercícios 1 e 2 vão para um ficheiro de texto, o `respostas-04.md`, com o número do exercício antes de cada uma. Guarda-o na tua pasta de trabalho de Linguagens de Programação, ao lado da `torneio-api`, e não dentro dela. Os exercícios 3 e 4 fazem-se no projeto `torneio-api`, que preparas antes do exercício 3. Entrega o `respostas-04.md` e o projeto, sem a pasta `node_modules` nem o `.env`. Para rever: o [guia do tema](../04-api-express-e-contratos.md) e o [laboratório](../laboratorios/04-api-express-e-contratos-laboratorio.md).

## O cenário

Na ficha do tema anterior desenhaste a `torneio-api`, a API do torneio de futsal da escola. Neste tema, as equipas e os jogos ficam em memória, como os artigos do guia:

```js
// src/dados/torneio.dados.js: as equipas e os jogos do torneio, em memória.
// São dados temporários, fictícios. Nos jogos, casa e fora são ids de equipas.

export const equipas = [
  { id: 1, nome: "12.º IG", cor: "azul" },
  { id: 2, nome: "11.º IG", cor: "vermelho" },
  { id: 3, nome: "10.º DS", cor: "verde" },
  { id: 4, nome: "11.º PI", cor: "amarelo" },
];

export const jogos = [
  { id: 1, jornada: 1, casa: 1, fora: 2, golosCasa: 3, golosFora: 1 },
  { id: 2, jornada: 1, casa: 3, fora: 4, golosCasa: 2, golosFora: 2 },
  { id: 3, jornada: 2, casa: 1, fora: 3, golosCasa: 0, golosFora: 1 },
  { id: 4, jornada: 2, casa: 2, fora: 4, golosCasa: 4, golosFora: 0 },
];
```

## Sem correr código

### Exercício 1: ler um contrato

Esta é uma parte do contrato da `torneio-api`.

**GET /api/jogos**

| Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
| --- | --- | --- | --- | --- |
| `jornada` | pesquisa | inteiro | não | 1 ou mais; só aparecem os jogos dessa jornada |

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | os parâmetros são válidos | lista de jogos, possivelmente vazia |
| 400 | `jornada` não é um inteiro, ou é menor do que 1 | erro |

Com os dados do torneio, que código e que corpo tem cada pedido? No corpo, basta dizer quantos jogos vêm, ou que é um erro.

1. `GET /api/jogos`
2. `GET /api/jogos?jornada=2`
3. `GET /api/jogos?jornada=5`
4. `GET /api/jogos?jornada=0`
5. `GET /api/jogos?jornada=segunda`
6. `GET /api/jogos?equipa=1`

Para o pedido 6, explica a tua resposta numa frase.

Rever: [No contrato, cada pedido tem os parâmetros e as respostas](../04-api-express-e-contratos.md#no-contrato-cada-pedido-tem-os-parâmetros-e-as-respostas) e [O que chega no pedido verifica-se à entrada](../04-api-express-e-contratos.md#o-que-chega-no-pedido-verifica-se-à-entrada).

### Exercício 2: o que está mal neste controller

Um colega escreveu assim a parte do controller que trata dos jogos e de uma equipa. A função `jogos` é para o contrato do exercício 1, e a `equipa` é para `GET /api/equipas/:id`, que responde como o `GET /api/artigos/:id` da papelaria. O controller tem também a `paraInteiro` do guia. No service, a `listarJogos` recebe um objeto com os filtros, e a `obterEquipa` devolve a equipa, ou `null` se ela não existir, como a `obterArtigo` da papelaria.

```js
export function jogos(req, res) {
  const jornada = Number(req.query.jornada);
  if (!Number.isInteger(jornada) || jornada < 1) {
    res.status(400).json({ erro: "O parâmetro jornada tem de ser um número inteiro, 1 ou maior" });
    return;
  }
  res.json(listarJogos({ jornada }));
}

export function equipa(req, res) {
  const id = paraInteiro(req.params.id);
  if (id === null || id < 1) {
    res.json({ erro: "O identificador da equipa tem de ser um número inteiro positivo" });
    return;
  }
  const encontrada = obterEquipa(id);
  if (encontrada === undefined) {
    res.status(404).json({ erro: `Não existe a equipa ${id}` });
    return;
  }
  res.json(encontrada);
}
```

A API arranca sem nenhum erro no terminal, e mesmo assim este código tem três problemas diferentes. Para cada um, diz qual é, o que acontece por causa dele e como se corrige.

Rever: [O que chega no pedido verifica-se à entrada](../04-api-express-e-contratos.md#o-que-chega-no-pedido-verifica-se-à-entrada) e [O controller verifica o pedido e escolhe a resposta](../04-api-express-e-contratos.md#o-controller-verifica-o-pedido-e-escolhe-a-resposta).

<details>
<summary>Pista</summary>

Escolhe pedidos para cada função, os que correm bem e os que dão erro, e segue cada um de cabeça, linha a linha, até à resposta. Compara o código e o corpo com o que o contrato diz para esse pedido.

</details>

## No projeto torneio-api

O projeto `torneio-api` não começa do zero. Parte do esqueleto publicado da papelaria, que já tem o `package.json` com os scripts e o Express, o `src/server.js` com a rota de estado, o `.env.example` e o `.gitignore`. Prepara-o antes do exercício 3:

1. Copia a pasta [papelaria-api](../../exemplos/acesso-a-dados/papelaria-api/README.md) dos exemplos para a tua pasta de trabalho, e muda o nome da cópia para `torneio-api`. O teu projeto do laboratório é o jogo, e aqui não serve.
2. No `package.json`, muda o `name` para `torneio-api` e escreve na `description` uma frase tua sobre a API do torneio.
3. No `src/server.js`, troca a papelaria pelo torneio no comentário do início e no texto da rota de estado, que passa a ser `API do torneio de futsal`.
4. Num terminal dentro da pasta `torneio-api`, corre `npm install`, cria o `.env` a partir do `.env.example`, como no laboratório do tema anterior, e arranca a API com `npm run dev`. Se o jogo do laboratório estiver ligado, para-o primeiro com Ctrl+C, ou muda a porta no `.env` da `torneio-api`. Os dois não podem usar a porta 3000 ao mesmo tempo.
5. Cria o ficheiro `src/dados/torneio.dados.js` com os dados do cenário.

O projeto está pronto quando `/api/estado` responde com o texto novo e `/api/equipas` dá 404, com a página `Cannot GET /api/equipas` do Express, porque essa rota ainda não existe.

### Exercício 3: o contrato da torneio-api

No projeto `torneio-api`, escreve o ficheiro `contrato-da-api.md` com:

- `GET /api/equipas`, a lista das equipas;
- `GET /api/equipas/:id`, uma equipa;
- `GET /api/jogos`, com o filtro do exercício 1 e um filtro novo, `equipa`;
- o formato dos erros e a resposta a qualquer outro pedido.

Cada pedido leva as tabelas do guia: a dos parâmetros, quando os há, e a das respostas. Escreve também a forma de uma equipa e de um jogo, em JSON, como o guia faz para o artigo.

As tabelas de `GET /api/jogos` são as do exercício 1, e podes partir delas.

O filtro `equipa` é um pedido da comissão do torneio, que quer ver os jogos de uma equipa: `GET /api/jogos?equipa=3` dá os jogos da equipa 3. Acrescenta-o à tabela dos parâmetros de `GET /api/jogos`, com o tipo, os valores válidos e o que quer dizer, e acerta a linha do 400 na tabela das respostas.

O que responde a API a `GET /api/jogos?equipa=9`, se não existe nenhuma equipa 9? Escreve a resposta no contrato, com o código e o corpo, e justifica-a numa frase por baixo da tabela.

Rever: [O contrato diz o que a API aceita e o que responde](../04-api-express-e-contratos.md#o-contrato-diz-o-que-a-api-aceita-e-o-que-responde) e [No contrato, cada pedido tem os parâmetros e as respostas](../04-api-express-e-contratos.md#no-contrato-cada-pedido-tem-os-parâmetros-e-as-respostas).

### Exercício 4: as camadas do torneio

Escreve, no projeto `torneio-api`, os ficheiros que cumprem o contrato do exercício 3. O ficheiro dos dados já o criaste ao preparar o projeto. Faltam:

- `src/services/torneio.service.js`;
- `src/controllers/torneio.controller.js`;
- `src/rotas/torneio.rotas.js`;
- no `src/server.js` que copiaste, a montagem das rotas e o middleware final.

Os ficheiros têm o nome da API, `torneio`, e não o de um recurso, porque cada um trata das equipas e dos jogos.

A função `paraInteiro` do controller é a do guia, e podes copiá-la de lá. O resto escreve-lo tu, com os ficheiros dos artigos do guia como modelo e o teu contrato ao lado.

Uma decisão que o guia não tomou por ti: o router da papelaria era montado em `/api/artigos`, porque só tinha artigos. Este tem equipas e jogos. Onde o montas, e como ficam os caminhos dentro dele?

Para verificar, com o contrato ao lado:

| Pedido | Resultado esperado |
| --- | --- |
| `/api/equipas` | 200, as quatro equipas |
| `/api/equipas/3` | 200, a equipa 10.º DS |
| `/api/equipas/x` | 400 |
| `/api/equipas/9` | 404 |
| `/api/jogos?jornada=1` | 200, os jogos 1 e 2 |
| `/api/jogos?jornada=7` | o que diz o contrato para uma jornada sem jogos |
| `/api/jogos?jornada=0` | o que diz o contrato |
| `/api/jogos?equipa=3` | 200, os jogos 2 e 3 |
| `/api/jogos?equipa=3&jornada=2` | 200, só o jogo 3 |
| `/api/jogos?equipa=9` | o que decidiste no contrato do exercício 3 |
| `/api/jogos?equipa=x` | o que diz o contrato |
| `/api/jornadas` | 404, `Rota não encontrada` |

Rever: [Parte 3: As camadas em código](../04-api-express-e-contratos.md#parte-3-as-camadas-em-código), [O middleware final fica depois de todas as rotas](../04-api-express-e-contratos.md#o-middleware-final-fica-depois-de-todas-as-rotas) e [Cada linha do contrato verifica-se com um pedido](../04-api-express-e-contratos.md#cada-linha-do-contrato-verifica-se-com-um-pedido).

<details>
<summary>Pista</summary>

Faz uma camada de cada vez, a começar pelo service, como no guia. Antes de haver controller, o service já se experimenta sem servidor, com um comando como o de [O service fica com as regras, sem `req` nem `res`](../04-api-express-e-contratos.md#o-service-fica-com-as-regras-sem-req-nem-res). O resto só se verifica no fim, com tudo montado.

</details>

## Desafios

Os dois desafios fazem-se no projeto `torneio-api`, depois do exercício 4, e não dependem um do outro.

### Os pontos de uma equipa

A comissão do torneio quer saber os pontos de cada equipa. Uma vitória vale 3 pontos, um empate 1 e uma derrota 0.

Acrescenta à API o pedido `GET /api/equipas/:id/pontos`, e ao contrato a entrada dele: os parâmetros, as respostas possíveis e a forma do JSON da resposta de sucesso. A forma é decisão tua, e o contrato di-la.

Tens de decidir em que camada fica a regra dos pontos. E a regra precisa de duas listas, as equipas (para saber se a equipa existe) e os jogos (para contar). Que camada as junta?

Para verificar: com os dados desta ficha, as equipas 1 a 4 têm 3, 3, 4 e 1 pontos. A equipa 9 dá 404.

<details>
<summary>Pista</summary>

Os jogos que contam para os pontos de uma equipa já os sabes escolher. São os do filtro `equipa` do exercício 4.

</details>

<details>
<summary>Pista</summary>

Num jogo em que a equipa é a da casa, os golos marcados são os `golosCasa`; se for a de fora, são os `golosFora`.

</details>

<details>
<summary>Pista</summary>

Para saber se a equipa existe, já tens uma função que o faz.

</details>

### Os jogos com os nomes

A interface React vai mostrar os jogos assim: "12.º IG 3 - 1 11.º IG". Com o contrato atual, o React recebe os números das equipas e teria de pedir cada equipa à parte para saber o nome.

A API passa a poder devolver os jogos com os nomes das equipas. Como, decides tu: um parâmetro de pesquisa novo em `GET /api/jogos`, ou um caminho novo? A decisão fica no contrato, com a forma do JSON e, por baixo, a razão da tua escolha. A junção dos nomes é feita em que camada?

## Critérios de conclusão

- O `respostas-04.md` tem os exercícios 1 e 2 respondidos, com a consequência e a correção de cada problema do exercício 2.
- O `contrato-da-api.md` tem os três pedidos, o filtro `equipa`, a forma de uma equipa e de um jogo, o formato dos erros e a resposta a qualquer outro pedido.
- A resposta à equipa 9 está escrita no contrato, e justificada.
- Cada linha da tabela do exercício 4 dá o resultado esperado, e a da equipa 9 dá o que o teu contrato diz.
- Entregaste o projeto sem a `node_modules` e sem o `.env`.

![Rodapé](../../imagens/rodape.png)
