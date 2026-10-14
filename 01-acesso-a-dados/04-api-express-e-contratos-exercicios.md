![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: API Express e contratos

Ficha do tema API Express e contratos, do módulo M14, Acesso a Bases de Dados. Escreves o contrato e as camadas da API do torneio de futsal, com decisões que a papelaria não tomou. Cerca de 100 minutos, para fazeres sozinho.

## O que precisas de saber

O [guia do tema](04-api-express-e-contratos.md) e o [laboratório](04-api-express-e-contratos-laboratorio.md).

## Como trabalhar

A parte obrigatória são os exercícios 1 a 4, por esta ordem, e conta com cerca de 100 minutos, incluindo os 5 minutos de preparar o projeto. Os exercícios 1 e 2 fazem-se em papel; o 3 e o 4, no computador. O exercício 4 é o mais longo. Conta com cerca de metade desse tempo. Os dois desafios opcionais, no fim, não contam para os 100 minutos.

Nos exercícios em papel, responde antes de experimentar. Nos do computador, escreve primeiro o contrato e as respostas que esperas, e só depois o código. Verifica cada resposta no browser, com o separador Rede aberto. Se precisares de ajuda, o [Apoio](#apoio) diz onde procurar em cada exercício.

Entrega as respostas dos exercícios 1 e 2 e o projeto `torneio-api`, com o `contrato-da-api.md` e os ficheiros do exercício 4, e os dos desafios, se os fizeres. Não entregues a `node_modules` nem o `.env`. As resoluções são trabalhadas na aula.

## O cenário: a API do torneio

Na ficha do tema anterior desenhaste a `torneio-api`, a API do torneio de futsal da escola. Nesta ficha escreves o contrato dela e as camadas que o cumprem, com as equipas e os jogos ainda em memória. Não começas do zero. O projeto parte de uma cópia do esqueleto da papelaria, que já tem o `package.json`, os scripts e a rota de estado a funcionar. Assim, o teu trabalho vai todo para o contrato e para as camadas.

Pelo caminho, tomas decisões que a papelaria não tomou. Há um parâmetro de pesquisa com um limite diferente, um filtro novo, os jogos de uma equipa, e um router com dois recursos, as equipas e os jogos.

Os dados, fictícios, ficam num ficheiro `src/dados/torneio.dados.js`. Nos jogos, `casa` e `fora` são os `id` das equipas.

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

## Em papel

### Exercício 1: ler um contrato (10 minutos)

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

### Exercício 2: o que está mal neste controller (15 minutos)

Um colega escreveu assim a parte do controller que trata dos jogos e de uma equipa, para o contrato do exercício 1. O controller tem também a `paraInteiro` do guia. No service, a `listarJogos` recebe um objeto com os filtros, e a `obterEquipa` devolve a equipa, ou `null` se ela não existir, como a `obterArtigo` da papelaria.

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

A API arranca sem nenhum erro no terminal, e mesmo assim este código tem três problemas, cada um de um tipo diferente. Para cada um, diz qual é, o que acontece por causa dele e como se corrige.

## No computador

Os exercícios 3 e 4 fazem-se num projeto `torneio-api`. Não o preparas do zero, como no laboratório do tema anterior: partes do esqueleto publicado da papelaria. Esse esqueleto já tem o `package.json` com os scripts e o Express, o `src/server.js` com a rota de estado, o `.env.example` e o `.gitignore`. Conta com cinco minutos.

1. Copia a pasta [papelaria-api](../exemplos/acesso-a-dados/papelaria-api/README.md) dos exemplos para a tua pasta de trabalho, e muda o nome da cópia para `torneio-api`. Copia a pasta dos exemplos, e não o teu projeto do laboratório. Esse já tem os ficheiros dos artigos, que aqui não servem.
2. No `package.json`, muda o `name` para `torneio-api` e escreve na `description` uma frase tua sobre a API do torneio.
3. No `src/server.js`, troca a papelaria pelo torneio no comentário do início e no texto da rota de estado, que passa a ser `API do torneio de futsal`.
4. Num terminal dentro da pasta `torneio-api`, corre `npm install`, cria o `.env` a partir do `.env.example`, como no laboratório do tema anterior, e arranca a API com `npm run dev`. Se a API do laboratório estiver ligada, para-a primeiro com Ctrl+C, ou muda a porta no `.env` da `torneio-api`. As duas não podem usar a porta 3000 ao mesmo tempo.
5. No browser, `/api/estado` deve responder com o texto novo, e `/api/equipas` deve dar 404, porque essa rota ainda não existe. É o que vais escrever.
6. Cria o ficheiro `src/dados/torneio.dados.js` com os dados do cenário.

O resto do esqueleto não muda. O `src/server.js` que copiaste é o ponto de partida do exercício 4, que lhe acrescenta a montagem das rotas e o middleware final.

### Exercício 3: o contrato da torneio-api (20 minutos)

No projeto `torneio-api`, escreve o ficheiro `contrato-da-api.md` com:

- `GET /api/equipas`, a lista das equipas;
- `GET /api/equipas/:id`, uma equipa;
- `GET /api/jogos`, com o filtro do exercício 1 e um filtro novo, `equipa`;
- o formato dos erros e a resposta a qualquer outro pedido.

Para cada pedido, as tabelas do guia: a dos parâmetros, quando os há, e a das respostas. Escreve também a forma de uma equipa e de um jogo, em JSON, como o guia faz para o artigo.

As tabelas de `GET /api/jogos` já as tens. São as do exercício 1, e podes partir delas. O que escreves de novo são os pedidos das equipas, o filtro `equipa` e a forma de uma equipa e de um jogo.

O filtro `equipa` é um pedido da comissão do torneio, que quer ver os jogos de uma equipa: `GET /api/jogos?equipa=3` dá os jogos da equipa 3. O contrato do exercício 1 ainda não o tinha. Acrescenta-o à tabela dos parâmetros de `GET /api/jogos`, com o tipo, os valores válidos e o que quer dizer, e acerta a linha do 400 na tabela das respostas.

Este filtro obriga a uma decisão que o contrato da papelaria nunca teve de tomar. O que responde a API a `GET /api/jogos?equipa=9`, se não existe nenhuma equipa 9? Escreve a resposta no contrato, com o código e o corpo, e justifica-a numa frase por baixo da tabela.

### Exercício 4: as camadas do torneio (50 minutos)

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
| `/api/jornadas` | 404, `Rota não encontrada` |

## Apoio

- Exercício 1: a secção "O contrato da API da papelaria" do guia, e a subsecção "Verificar à entrada".
- Exercício 2: segue à mão, linha a linha, os pedidos `/api/jogos`, `/api/equipas/x` e `/api/equipas/9`, e compara cada resposta com o contrato.
- Exercício 3: a secção "O contrato da API da papelaria" do guia, e a fase 1 do laboratório.
- Exercício 4: a secção "As camadas em código" do guia, e as fases 4 a 8 do laboratório. Faz uma camada de cada vez, de dentro para fora, como no laboratório, e verifica a tabela no fim.

## Desafio opcional

Os dois desafios fazem-se no projeto `torneio-api`, depois do exercício 4, e não dependem um do outro.

### Os pontos de uma equipa (cerca de 25 minutos)

A comissão do torneio quer saber os pontos de cada equipa. Uma vitória vale 3 pontos, um empate 1 e uma derrota 0.

1. Acrescenta primeiro ao contrato o pedido `GET /api/equipas/:id/pontos`: os parâmetros, as respostas possíveis e a forma do JSON da resposta de sucesso. A forma é decisão tua; escreve-a antes do código.
2. Depois, implementa-o.

As decisões novas: em que camada fica a regra dos pontos? E a regra precisa de duas listas, as equipas (para saber se a equipa existe) e os jogos (para contar). Que camada as junta?

Para verificar: com os dados desta ficha, as equipas 1 a 4 têm 3, 3, 4 e 1 pontos. A equipa 9 dá 404.

Pistas, só se precisares, uma de cada vez:

1. Os jogos que contam para os pontos de uma equipa já os sabes escolher. São os do filtro `equipa` do exercício 4.
2. Num jogo em que a equipa é a da casa, os golos marcados são os `golosCasa`; se for a de fora, são os `golosFora`.
3. Uma função pode chamar outra do mesmo ficheiro, como a que procura uma equipa.

### Os jogos com os nomes (cerca de 20 minutos)

A interface React vai mostrar os jogos assim: "12.º IG 3 - 1 11.º IG". Com o contrato atual, o React recebe os números das equipas e teria de pedir cada equipa à parte para saber o nome.

1. Decide como a API pode devolver os jogos com os nomes das equipas: um parâmetro de pesquisa novo em `GET /api/jogos`, ou um caminho novo? Escreve no contrato a tua decisão, com a forma do JSON, e explica porque escolheste essa.
2. Implementa-a. A junção dos nomes é feita em que camada?

## Critérios de conclusão

- Os exercícios 1 e 2 estão respondidos, com a consequência e a correção de cada problema do exercício 2.
- O `contrato-da-api.md` tem os três pedidos, o filtro `equipa`, a forma de uma equipa e de um jogo, o formato dos erros e a resposta a qualquer outro pedido.
- A resposta à equipa 9 está escrita no contrato, e justificada.
- Cada linha da tabela do exercício 4 dá o resultado esperado, e a da equipa 9 dá o que o teu contrato diz.
- Entregaste o projeto sem a `node_modules` e sem o `.env`.

## Autoavaliação

1. Escolhe um pedido da tua API e explica o caminho dele pelas camadas, ficheiro a ficheiro, sem ajuda.
2. Que decisão desta ficha te custou mais, e porquê?
3. Que dúvida concreta levas para a aula?

![Rodapé](../imagens/rodape.png)
