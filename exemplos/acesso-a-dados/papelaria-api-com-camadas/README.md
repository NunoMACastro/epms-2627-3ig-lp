![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria, com camadas

A API da papelaria com o contrato escrito e as rotas, o controller e o service dos artigos em ficheiros separados. É usada no tema [04 API Express e contratos](../../../01-acesso-a-dados/04-api-express-e-contratos.md). Os artigos ainda estão num array, em `src/dados/`; no tema da ligação segura passam a vir do MongoDB Atlas.

O esqueleto do tema anterior, só com a rota de estado, continua em [papelaria-api](../papelaria-api/README.md). A primeira versão deste tema, que cumpre o mesmo contrato com tudo no `server.js` e é o ponto de partida destas camadas, está em [papelaria-api-sem-camadas](../papelaria-api-sem-camadas/README.md).

## O que está nesta pasta

- `contrato-da-api.md`: o contrato, com os pedidos que a API aceita e as respostas que dá.
- `src/server.js`: o arranque da API, com a rota de estado, a montagem das rotas dos artigos e o middleware final.
- `src/rotas/artigos.rotas.js`: que pedido vai para que função do controller.
- `src/controllers/artigos.controller.js`: lê e verifica o pedido, chama o service e responde.
- `src/services/artigos.service.js`: as regras da papelaria sobre os artigos.
- `src/dados/artigos.dados.js`: os artigos, por agora num array.
- `package.json` e `package-lock.json`: o projeto e as versões exatas dos pacotes.
- `.env.example` e `.gitignore`: a configuração sem segredos, e o que o Git ignora.

## Como correr

Precisas do Node.js 22 ou mais recente, e de internet para o `npm install`. Copia esta pasta para fora do repositório e, num terminal dentro dela:

```bash
npm install
cp .env.example .env
npm run dev
```

No Windows, na linha de comandos clássica, o segundo comando é `copy .env.example .env`.

O que deves ver: o terminal mostra `API a correr em http://localhost:3000`. No browser, experimenta os pedidos do contrato; a tabela do passo 7 do exemplo guiado do guia diz o que cada um deve responder. Para parar, Ctrl+C.

## Versões com que foi testado

Node.js 26.11.1, npm 11.20.0 e Express 5.3.0, em macOS, a 14 de outubro de 2026. Antes, no Node.js 24.17.0: com o Express 5.2.1, a 7 e a 9 de outubro, e com o Express 5.3.0, a 12.

![Rodapé](../../../imagens/rodape.png)
