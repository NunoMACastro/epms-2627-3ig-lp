![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: arquitetura e setup Node

Terceiro tema de Acesso a dados. Esta ficha é para fazeres sozinho, depois de leres o [guia do tema](03-arquitetura-e-setup-node.md) e de fazeres o [laboratório](03-arquitetura-e-setup-node-laboratorio.md). Os exercícios 1 a 6 fazem-se em papel; o desafio, no computador.

## Objetivo e contexto

O guia e o laboratório trabalharam a papelaria. Esta ficha usa a aplicação do torneio de futsal da escola, que modelaste na ficha do tema anterior, e pede-te as mesmas decisões noutro problema: onde corre cada coisa, em que camada fica cada responsabilidade, e o que pode e não pode ir para o Git.

A aplicação do torneio tem as três partes do guia: uma interface em React, onde os alunos veem os jogos e a classificação; uma API em Node e Express, a `torneio-api`; e uma base de dados no MongoDB Atlas, com as coleções `equipas` e `jogos`. As regras do torneio são as habituais: uma vitória vale 3 pontos, um empate 1 e uma derrota 0.

## Como trabalhar

Responde primeiro sem abrir o guia. Quando não souberes, escreve o que achas e porquê, e só depois confirma. Em cada exercício que peça uma justificação, uma ou duas frases chegam.

Tempo previsto: 50 minutos para os exercícios 1 a 6.

## Exercício 1: onde corre e o que viaja

Guia: secções "A tua aplicação tem três partes" e "O papel do servidor".

a) Para cada item, indica onde corre ou onde fica: no browser (React), na API ou no MongoDB Atlas.

| Item | Onde |
| --- | --- |
| O componente que desenha a tabela da classificação | |
| A função que calcula os pontos de uma equipa a partir dos resultados | |
| A pesquisa dos jogos da equipa 3 na coleção `jogos` | |
| A cadeia de ligação `mongodb+srv://...` | |
| O `fetch("/api/classificacao")` | |

b) O que viaja entre o React e a API quando a classificação é pedida? E em que formato?

## Exercício 2: que camada

Guia: secção "O que faz cada camada".

Para cada responsabilidade da `torneio-api`, indica a camada: rotas, controller, service ou repository.

1. Dizer que `GET /api/equipas/:id` vai para a função `mostrarEquipa`.
2. Ler o número da jornada dos parâmetros de pesquisa, em `?jornada=3`, e convertê-lo de texto para número.
3. Uma equipa não pode jogar contra si própria.
4. Executar `find` na coleção `jogos`.
5. Responder 404 quando a equipa pedida não existe.
6. Somar 3 pontos por vitória e 1 por empate.

Escolhe uma das responsabilidades que puseste no service e explica porque não pode ficar no React.

## Exercício 3: ler um package.json

Guia: secção "Os scripts do package.json" e "Erros frequentes".

Um colega preparou assim o `package.json` da `torneio-api`. O ficheiro do servidor está em `src/server.js`, e na raiz do projeto há um `.env`.

```json
{
  "name": "torneio-api",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch --env-file=.env server.js"
  },
  "dependencies": {
    "express": "^5.2.1"
  }
}
```

O `src/server.js` começa com `import express from "express";`.

a) Que comando escreve o colega para usar cada um dos dois scripts?

b) Este `package.json` tem dois problemas. Para cada um, diz que comando o vai revelar, que mensagem espera ver (por palavras tuas, ou a mensagem em inglês, se te lembrares dela) e como se corrige.

## Exercício 4: o que vai para o Git

Guia: secções "O ficheiro .env.example" e "O que vai para o Git".

O projeto de outro colega tem estes ficheiros na raiz:

```text
.env
.env.example
.gitignore
node_modules/
package.json
package-lock.json
src/
```

O `.gitignore` tem uma só linha: `node_modules/`. O `.env.example` é este:

```text
PORT=3000
MONGODB_URI=mongodb+srv://torneio:Futsal2026@cluster0.exemplo.mongodb.net/
```

a) Que ficheiros e pastas da lista devem ir para o Git? Quais não devem?

b) O projeto tem dois problemas de segurança. Quais são?

c) O colega ainda não fez nenhum commit. Diz-lhe, por ordem, o que tem de mudar antes do primeiro.

## Exercício 5: prever a porta

Guia: secção "As variáveis de ambiente".

O `src/server.js` da `torneio-api` tem a linha `const PORTA = process.env.PORT || 3000;` e o `package.json` tem os scripts do guia. Para cada situação, diz em que porta fica a API, ou o que acontece se ela não arrancar.

| Situação | Porta, ou o que acontece |
| --- | --- |
| O `.env` tem `PORT=3002` e corres `npm run dev` | |
| O `.env` tem `PORT=3002` e corres `npm start` | |
| Não há ficheiro `.env` e corres `npm run dev` | |
| O `.env` tem `PORTA=3002` e corres `npm run dev` | |

Na segunda situação, explica porque é que a porta não é a do `.env`.

## Exercício 6: o diagrama de uma operação

Guia: secção "Um pedido a atravessar as camadas" e o passo 2 do exemplo guiado.

Depois de um jogo, o professor de Educação Física regista o resultado. O React envia `POST /api/jogos/:id/resultado`, com o número do jogo no endereço e os golos de cada equipa no corpo do pedido.

O exemplo do guia era um pedido que só lê dados. Este escreve, e tem regras próprias:

- os golos são números inteiros, zero ou mais;
- o jogo tem de existir;
- um jogo que já tem resultado não pode receber outro.

a) Desenha as quatro camadas e o Atlas, como no guia, e escreve ao lado de cada camada o que faz neste pedido.

b) Para cada uma das três regras, diz em que camada é verificada e que código de estado a resposta deve ter quando a regra falha. Se não souberes o código exato, indica a família (2xx, 4xx ou 5xx) e explica.

c) Em que camada é usada a cadeia de ligação ao Atlas? Em algum momento ela passa pelo browser?

## Desafio (opcional): o nome da aplicação na configuração

Este faz-se no computador, no projeto `papelaria-api` do laboratório.

1. Acrescenta ao `.env` e ao `.env.example` uma variável `NOME_APLICACAO`, com o valor `Papelaria da escola`.
2. Muda a rota `/api/estado` para responder com o nome que está nessa variável, em vez do texto escrito no código.
3. Decide o que acontece quando a variável não existe: usa um valor por omissão, como fizeste com a porta? Experimenta, apagando-a do `.env`.

Pensa, por fim, nisto: para a porta e para o nome, um valor por omissão faz sentido. Para a `MONGODB_URI`, faria sentido escrever no código um endereço por omissão? Porquê?

## Entrega e autoavaliação

Entrega as respostas dos exercícios 1 a 6, com o diagrama do exercício 6 desenhado ou fotografado. Se fizeste o desafio, entrega o `src/server.js` e o `.env.example`, nunca o `.env`.

No fim, responde por escrito:

- O que consigo explicar sem ajuda: escolhe uma das quatro camadas e explica o que faz e o que nunca deve fazer.
- O que ainda não percebi bem: uma dúvida concreta, para levar à aula.

As resoluções são trabalhadas na aula. Os dados desta ficha são fictícios, incluindo o endereço e a palavra-passe do exercício 4.

![Rodapé](../imagens/rodape.png)
