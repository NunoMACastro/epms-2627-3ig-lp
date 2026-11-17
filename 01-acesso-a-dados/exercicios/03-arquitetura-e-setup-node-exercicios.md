![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: Arquitetura e setup Node

Praticas, com o torneio de futsal da escola, as decisões do guia: onde corre cada parte, em que camada fica cada responsabilidade e como se prepara o projeto do servidor. Os exercícios 1 a 6 são obrigatórios, por esta ordem. Escreve as respostas num ficheiro de texto, o `respostas-03.md`, com o número do exercício e a letra da alínea antes de cada uma. Guarda-o na tua pasta de trabalho de Linguagens de Programação, fora da pasta de qualquer projeto. O diagrama do exercício 6 desenha-se em papel. Entrega o `respostas-03.md` e o diagrama do exercício 6, em papel ou fotografado. Para rever: o [guia do tema](../03-arquitetura-e-setup-node.md) e o [laboratório](../laboratorios/03-arquitetura-e-setup-node-laboratorio.md).

## O cenário

A aplicação do torneio de futsal da escola, que modelaste na ficha do tema anterior, tem as três partes do guia:

- uma interface em React, onde os alunos veem os jogos e a classificação;
- uma API em Node e Express, a `torneio-api`;
- uma base de dados no MongoDB Atlas, com as coleções `equipas` e `jogos`.

## Exercício 1: onde corre e o que viaja

a) Para cada item, indica onde corre ou onde fica: no browser (React), na API ou no MongoDB Atlas.

| Item | Onde |
| --- | --- |
| O componente que desenha a tabela da classificação | |
| A função que calcula os pontos de uma equipa a partir dos resultados | |
| A consulta que procura os jogos do 10.º A na coleção `jogos`: onde é escrita, e onde é executada | |
| A cadeia de ligação `mongodb+srv://...` | |
| O `fetch("/api/classificacao")` | |

b) O que viaja entre o React e a API quando a classificação é pedida? E em que formato?

Rever: [A tua aplicação tem três partes](../03-arquitetura-e-setup-node.md#a-tua-aplicação-tem-três-partes), [O segredo fica só no servidor](../03-arquitetura-e-setup-node.md#o-segredo-fica-só-no-servidor) e [As regras ficam no servidor, para todos os clientes](../03-arquitetura-e-setup-node.md#as-regras-ficam-no-servidor-para-todos-os-clientes).

## Exercício 2: que camada

Para cada responsabilidade da `torneio-api`, indica a camada: rotas, controller, service ou repository.

1. Dizer que `GET /api/equipas/:id` vai para a função `mostrarEquipa`.
2. Ler o número da jornada dos parâmetros de pesquisa, em `?jornada=3`, e convertê-lo de texto para número.
3. Uma equipa não pode jogar contra si própria.
4. Executar `find` na coleção `jogos`.
5. Responder 404 quando a equipa pedida não existe.
6. Somar 3 pontos por vitória e 1 por empate.

Escolhe uma das responsabilidades que puseste no service e explica porque não pode ficar no React.

Rever: [O servidor divide-se em quatro camadas](../03-arquitetura-e-setup-node.md#o-servidor-divide-se-em-quatro-camadas), [Um pedido atravessa as camadas sempre pela mesma ordem](../03-arquitetura-e-setup-node.md#um-pedido-atravessa-as-camadas-sempre-pela-mesma-ordem) e [As regras ficam no servidor, para todos os clientes](../03-arquitetura-e-setup-node.md#as-regras-ficam-no-servidor-para-todos-os-clientes).

<details>
<summary>Pista</summary>

Para cada responsabilidade, pergunta-te se é HTTP, uma regra do torneio ou a base de dados.

</details>

## Exercício 3: ler um package.json

Um colega preparou assim o `package.json` da `torneio-api`. O ficheiro do servidor está em `src/server.js`, e na raiz do projeto há um `.env`.

```json
{
  "name": "torneio-api",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch --env-file=.env src/server.js",
  },
  "dependencies": {
    "express": "^5.3.0"
  }
}
```

O `src/server.js` começa com `import express from "express";`.

a) Que comando escreve o colega para usar cada um dos dois scripts?

b) Este `package.json` tem dois problemas. Para cada um, diz que comando o vai revelar, que mensagem esperas ver (por palavras tuas) e como se corrige.

Rever: [Os scripts do package.json](../03-arquitetura-e-setup-node.md#os-scripts-do-packagejson) e [Passo 3: preparar a pasta](../03-arquitetura-e-setup-node.md#passo-3-preparar-a-pasta).

<details>
<summary>Pista</summary>

Põe-te no lugar do npm e do Node. Corre de cabeça cada script, desde o momento em que escreves o comando até à primeira linha do `server.js`. Confirma cada ficheiro que tens de ler e cada linha que tens de aceitar.

</details>

## Exercício 4: o que vai para o Git

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

O `.gitignore` tem uma só linha: `node_modules/`. O colega fez o `.env.example` a partir do seu `.env`, e ficou assim:

```text
PORT=3000
MONGODB_URI=mongodb+srv://torneio:Futsal2026@cluster0.exemplo.mongodb.net/
```

a) Que ficheiros e pastas da lista devem ir para o Git? Quais não devem?

b) O projeto tem dois problemas de segurança. Quais são?

c) O colega ainda não fez nenhum commit. Diz-lhe o que tem de fazer, por ordem, até ao primeiro commit.

Rever: [O .env.example diz que variáveis é preciso definir](../03-arquitetura-e-setup-node.md#o-envexample-diz-que-variáveis-é-preciso-definir) e [O .gitignore deixa os segredos fora do Git](../03-arquitetura-e-setup-node.md#o-gitignore-deixa-os-segredos-fora-do-git).

## Exercício 5: prever a porta

O `src/server.js` da `torneio-api` tem a linha `const PORTA = process.env.PORT || 3000;`, e o `package.json` tem os scripts do guia. Para cada situação, diz em que porta fica a API, ou o que acontece se ela não arrancar.

| Situação | Porta, ou o que acontece |
| --- | --- |
| O `.env` tem `PORT=3002` e corres `npm start` | |
| O `.env` tem `PORT=3002` e corres `node src/server.js`, sem o npm | |
| O `.env` tem `PORT=3002` e corres `node --env-file=.env src/server.js` | |
| Não há ficheiro `.env` e corres `node --env-file=.env src/server.js` | |

Explica cada resposta numa frase.

Rever: [Os scripts do package.json](../03-arquitetura-e-setup-node.md#os-scripts-do-packagejson), [A configuração fica fora do código](../03-arquitetura-e-setup-node.md#a-configuração-fica-fora-do-código) e [O ficheiro .env guarda a configuração deste computador](../03-arquitetura-e-setup-node.md#o-ficheiro-env-guarda-a-configuração-deste-computador).

## Exercício 6: o diagrama de uma operação

Depois de um jogo, o professor de Educação Física regista o resultado. O React envia `POST /api/jogos/:id/resultado`, com o identificador do jogo no endereço e os golos de cada equipa no corpo do pedido.

O pedido traçado no guia só lia dados. Este escreve, e tem regras próprias:

- os golos são números inteiros, zero ou mais;
- o jogo tem de existir;
- um jogo que já tem resultado não pode receber outro.

a) Desenha as quatro camadas e o Atlas, como no guia, e escreve ao lado de cada camada o que faz neste pedido.

b) Para cada uma das três regras, diz em que camada é verificada e que código de estado a resposta deve ter quando a regra falha. Se não souberes o código exato, indica a família (2xx, 4xx ou 5xx) e explica.

Rever: [Um pedido atravessa as camadas sempre pela mesma ordem](../03-arquitetura-e-setup-node.md#um-pedido-atravessa-as-camadas-sempre-pela-mesma-ordem) e [Passo 2: o diagrama de camadas](../03-arquitetura-e-setup-node.md#passo-2-o-diagrama-de-camadas). Os códigos de estado estão em [Os três códigos deste tema](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/01-aplicacoes-em-browser/03-http-rotas-e-middleware.md#os-três-códigos-deste-tema), no guia de Sistemas de Informação.

## Desafios

### O nome da aplicação no `.env`

Faz-se numa cópia da pasta [papelaria-api](../../exemplos/acesso-a-dados/papelaria-api/README.md) dos exemplos, e não no teu projeto do jogo Fechado na escola, que tem de ficar como o laboratório o deixou.

A rota `/api/estado` passa a responder com o nome da aplicação que está numa variável de ambiente nova, `NOME_APLICACAO`, em vez do texto escrito no código. A variável fica no `.env` e no `.env.example`, como a porta, com o valor `Papelaria da escola`.

Decide também o que a API faz quando a variável não existe.

Para verificar: com a variável no `.env`, `/api/estado` responde com `"aplicacao":"Papelaria da escola"`. Sem ela, apagada do `.env`, a API faz o que decidiste.

Responde, por fim, num comentário no `src/server.js`, junto da linha que lê o nome: para a `MONGODB_URI`, faria sentido escrever no código um endereço por omissão? Porquê?

Se fizeres o desafio, entrega também o `src/server.js` e o `.env.example`, e nunca o `.env`.

## Critérios de conclusão

- O `respostas-03.md` tem os exercícios 1 a 6 respondidos, com o número de cada um.
- O diagrama do exercício 6 tem as quatro camadas e o Atlas, com o que cada camada faz neste pedido.
- Cada resposta que pede uma justificação tem uma ou duas frases a explicá-la.
- Se fizeste o desafio, a API responde com o nome do `.env`, o `src/server.js` tem o comentário sobre a `MONGODB_URI`, e o `.env` não está entre o que entregas.

![Rodapé](../../imagens/rodape.png)
