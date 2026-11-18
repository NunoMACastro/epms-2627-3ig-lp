![Cabeçalho](../../../imagens/cabecalho.png)

# Fechado na escola, no fim do passo 2

Este é o jogo Fechado na escola como fica no fim do passo 2, o [laboratório do tema 04 API Express e contratos](../../../01-acesso-a-dados/laboratorios/04-api-express-e-contratos-laboratorio.md). Tem o contrato da API e a escolha que leva de uma cena à seguinte, com as rotas, o controller, o service e o repository em ficheiros separados.

É o ponto de partida do passo 3, em Sistemas de Informação. Se faltaste ao passo 2, ou se o teu projeto não arranca, copia esta pasta e continua daqui.

## O que está nesta pasta

- `contrato-da-api.md`: o contrato, com os pedidos que a API aceita e as respostas que dá.
- `src/server.js`: o arranque do jogo, com a rota de estado, a montagem das rotas das cenas e o middleware final.
- `src/rotas/cenas.rotas.js`: que pedido vai para que função do controller.
- `src/controllers/cenas.controller.js`: lê e verifica o pedido, chama o service e responde.
- `src/services/cenas.service.js`: as regras do jogo, como a escolha que leva à cena seguinte.
- `src/repositories/cenas.repository.js`: o acesso às cenas na base de dados, a única camada que usa o modelo.
- `src/db/mongoose.js`, `src/models/cena.model.js` e `src/seed.js`: a ligação, o modelo e as cenas, como no passo 1.
- `package.json` e `package-lock.json`: o projeto e as versões exatas dos pacotes.
- `.env.example` e `.gitignore`: a configuração sem segredos, e o que o Git ignora.

## Como correr

Como no [passo 1](../fechado-na-escola-passo-01/README.md#como-correr): `npm install`, o `.env` com a tua cadeia de ligação, `npm run seed` e `npm run dev`.

O que deves ver: no browser, `http://localhost:3000/api/cenas/corredor/escolhas/3` mostra a cena `escadas`, "O primeiro andar". O `contrato-da-api.md` diz o que cada pedido deve responder, e a [fase 9 do laboratório do passo 2](../../../01-acesso-a-dados/laboratorios/04-api-express-e-contratos-laboratorio.md#fase-9-cada-linha-do-contrato-verifica-se-com-um-pedido) tem dezasseis pedidos para o conferires. Para parar, Ctrl+C.

## Versões e compatibilidade

As versões usadas são o Node.js 26 e o npm 11. O `package-lock.json` fixa o Express 5.3.0 e o Mongoose 9.11.4, como no passo 1.

![Rodapé](../../../imagens/rodape.png)
