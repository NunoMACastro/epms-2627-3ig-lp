![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: API Express e contratos

Quarto tema de Acesso a dados. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](04-api-express-e-contratos.md) e de fazeres o [laboratório](04-api-express-e-contratos-laboratorio.md). Os exercícios 1 e 2 fazem-se em papel; os outros, no computador.

## Objetivo e contexto

Na ficha do tema anterior desenhaste a `torneio-api`, a API do torneio de futsal da escola. Nesta ficha escreves o contrato dela e as camadas que o cumprem, com as equipas e os jogos ainda em memória. Pelo caminho, tomas decisões que a papelaria não tomou: um parâmetro de pesquisa com um limite diferente, e uma regra que precisa de juntar dados de duas listas.

## Como trabalhar

Nos exercícios em papel, responde antes de experimentar. Nos de computador, escreve primeiro o contrato e as respostas que esperas, e só depois o código. Verifica cada resposta no browser, com o separador Rede aberto.

Tempo previsto: 90 minutos para os exercícios 1 a 5.

## Os dados do torneio

Os exercícios 4 e 5 usam estes dados, fictícios, num ficheiro `src/dados/torneio.dados.js`. Nos jogos, `casa` e `fora` são os `id` das equipas.

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

## Exercício 1: ler um contrato

Guia: secção "O contrato da API da papelaria".

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

Para o pedido 6, explica a tua resposta: o contrato fala do parâmetro `equipa`? O que diz o guia sobre um parâmetro que o contrato não prevê?

## Exercício 2: o que está mal neste controller

Guia: secções "Um formato único para os erros" e "Verificar à entrada, no controller".

Um colega escreveu assim a parte do controller que trata dos jogos e de uma equipa:

```js
export function jogos(req, res) {
  res.json(listarJogos(req.query));
}

export function equipa(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ erro: "Identificador inválido" });
  }
  const encontrada = obterEquipa(id);
  if (encontrada === null) {
    res.status(404).json({ mensagem: "Equipa não encontrada" });
    return;
  }
  res.json(encontrada);
}
```

Há três problemas, cada um de um tipo diferente. Para cada um, diz qual é, o que acontece por causa dele e como se corrige.

## Exercício 3: o contrato da torneio-api

Guia: secção "O contrato da API da papelaria" e laboratório, parte 1.

Num projeto novo, `torneio-api`, preparado como no laboratório do tema anterior, escreve o ficheiro `contrato-da-api.md` com:

- `GET /api/equipas`, a lista das equipas;
- `GET /api/equipas/:id`, uma equipa;
- `GET /api/jogos`, com o filtro do exercício 1;
- o formato dos erros e a resposta a qualquer outro pedido.

Para cada pedido, as duas tabelas do guia: os parâmetros e as respostas. Escreve também a forma de uma equipa e de um jogo, em JSON, como o guia faz para o artigo.

## Exercício 4: as camadas do torneio

Guia: secção "As camadas em código".

Escreve, no projeto `torneio-api`, os ficheiros que cumprem o contrato do exercício 3:

- `src/dados/torneio.dados.js`, com os dados desta ficha;
- `src/services/torneio.service.js`;
- `src/controllers/torneio.controller.js`;
- `src/rotas/torneio.rotas.js`;
- no `src/server.js`, a montagem das rotas e o middleware final.

Uma decisão que o guia não tomou por ti: o router da papelaria era montado em `/api/artigos`, porque só tinha artigos. Este tem equipas e jogos. Onde o montas, e como ficam os caminhos dentro dele?

Para verificar, com o contrato ao lado:

| Pedido | Resultado esperado |
| --- | --- |
| `/api/equipas` | 200, as quatro equipas |
| `/api/equipas/3` | 200, a equipa 10.º DS |
| `/api/equipas/x` | 400 |
| `/api/equipas/9` | 404 |
| `/api/jogos?jornada=2` | 200, os jogos 3 e 4 |
| `/api/jogos?jornada=7` | 200, lista vazia |
| `/api/jogos?jornada=0` | 400 |
| `/api/jornadas` | 404, `Rota não encontrada` |

## Exercício 5: os pontos de uma equipa

Guia: secções "O que faz cada camada", do tema anterior, e "O service".

A comissão do torneio quer saber os pontos de cada equipa. Uma vitória vale 3 pontos, um empate 1 e uma derrota 0.

1. Acrescenta primeiro ao contrato o pedido `GET /api/equipas/:id/pontos`: os parâmetros, as respostas possíveis e a forma do JSON da resposta de sucesso. A forma é decisão tua; escreve-a antes do código.
2. Depois, implementa-o.

As decisões novas: em que camada fica a regra dos pontos? E a regra precisa de duas listas, as equipas (para saber se a equipa existe) e os jogos (para contar). Que camada as junta?

Para verificar: com os dados desta ficha, as equipas 1 a 4 têm 3, 3, 4 e 1 pontos. A equipa 9 dá 404.

Pistas, só se precisares, uma de cada vez:

1. Para cada jogo, a equipa pode ser a da casa, a de fora, ou nenhuma das duas. Só os dois primeiros casos contam.
2. Num jogo em que a equipa é a da casa, os golos marcados são os `golosCasa`; se for a de fora, são os `golosFora`.
3. O service pode chamar outra função do próprio service, como a que procura uma equipa.

## Desafio (opcional): os jogos com os nomes

A interface React vai mostrar os jogos assim: "12.º IG 3 - 1 11.º IG". Com o contrato atual, o React recebe os números das equipas e teria de pedir cada equipa à parte para saber o nome.

1. Decide como a API pode devolver os jogos com os nomes das equipas: um parâmetro de pesquisa novo em `GET /api/jogos`, ou um caminho novo? Escreve no contrato a tua decisão, com a forma do JSON, e explica porque escolheste essa.
2. Implementa-a. A junção dos nomes é feita em que camada?

## Entrega e autoavaliação

Entrega as respostas dos exercícios 1 e 2 e o projeto `torneio-api` com o `contrato-da-api.md` e os ficheiros dos exercícios 4 e 5 (e do desafio, se o fizeste). Não entregues a `node_modules` nem o `.env`.

No fim, responde por escrito:

- O que consigo explicar sem ajuda: escolhe um pedido da tua API e explica o caminho dele pelas camadas, ficheiro a ficheiro.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula.

![Rodapé](../imagens/rodape.png)
