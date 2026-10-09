![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria, com camadas

A API do [tema API Express e contratos](../../../01-acesso-a-dados/04-api-express-e-contratos.md): o esqueleto do tema anterior, com o contrato escrito e as rotas, o controller e o service dos artigos, em ficheiros separados. Os artigos ainda estão num array, em `src/dados/`; no tema da ligação segura passam a vir do MongoDB Atlas.

O esqueleto do tema anterior, só com a rota de estado, continua em [papelaria-api](../papelaria-api/README.md). A primeira versão deste tema, que cumpre o mesmo contrato com tudo no `server.js` e que é o ponto de partida destas camadas, está em [papelaria-api-sem-camadas](../papelaria-api-sem-camadas/README.md).

## O que está nesta pasta

| Ficheiro | Para que serve |
| --- | --- |
| `contrato-da-api.md` | O contrato: os pedidos que a API aceita e as respostas que dá |
| `src/server.js` | O arranque da API: a rota de estado, a montagem das rotas dos artigos e o middleware final |
| `src/rotas/artigos.rotas.js` | Que pedido vai para que função do controller |
| `src/controllers/artigos.controller.js` | Lê e verifica o pedido, chama o service e responde |
| `src/services/artigos.service.js` | As regras da papelaria sobre os artigos |
| `src/dados/artigos.dados.js` | Os artigos, por agora num array |
| `package.json`, `package-lock.json` | O projeto e as versões exatas dos pacotes |
| `.env.example`, `.gitignore` | A configuração sem segredos, e o que o Git ignora |

## Como correr

Precisas do Node.js 22 ou 24 e de internet para o primeiro passo.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. `npm install`
3. Cria o `.env` a partir do exemplo: `cp .env.example .env` (no Windows, na linha de comandos clássica, `copy .env.example .env`).
4. `npm run dev`. O terminal mostra `API a correr em http://localhost:3000`.
5. No browser, experimenta os pedidos do contrato. A tabela do passo 7 do exemplo guiado do guia diz o que cada um deve responder.
6. Para parar, Ctrl+C.

## Versões com que foi testado

Node.js 24.17.0, npm 11.13.0 e Express 5.2.1, em macOS, a 9 de outubro de 2026.

![Rodapé](../../../imagens/rodape.png)
