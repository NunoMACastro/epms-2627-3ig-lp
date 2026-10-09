![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria, num só ficheiro

A primeira versão da API do [tema API Express e contratos](../../../01-acesso-a-dados/04-api-express-e-contratos.md): o esqueleto do tema anterior, com as rotas do contrato escritas todas no `src/server.js`, ao lado dos artigos, que ainda estão num array. Responde 200, 400 e 404 como o contrato diz, com uma exceção, que é de propósito: um caminho que não existe, como `/api/artigo`, ainda recebe a página de erro do Express, em HTML, porque esta versão não tem o middleware final.

É o ponto de partida da separação em camadas. A versão seguinte, com as mesmas respostas e o código dividido em rotas, controller, service e dados, está em [papelaria-api-com-camadas](../papelaria-api-com-camadas/README.md), que tem também o [contrato da API](../papelaria-api-com-camadas/contrato-da-api.md). O esqueleto do tema anterior, só com a rota de estado, continua em [papelaria-api](../papelaria-api/README.md).

## O que está nesta pasta

| Ficheiro | Para que serve |
| --- | --- |
| `src/server.js` | Tudo: os artigos, a verificação dos pedidos, as regras da papelaria e as respostas das quatro rotas |
| `package.json`, `package-lock.json` | O projeto e as versões exatas dos pacotes |
| `.env.example`, `.gitignore` | A configuração sem segredos, e o que o Git ignora |

## Como correr

Precisas do Node.js 22 ou 24 e de internet para o primeiro passo.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. `npm install`
3. Cria o `.env` a partir do exemplo: `cp .env.example .env` (no Windows, na linha de comandos clássica, `copy .env.example .env`).
4. `npm run dev`. O terminal mostra `API a correr em http://localhost:3000`.
5. No browser, experimenta os pedidos do contrato. A tabela do passo 2 do exemplo guiado do guia diz o que cada um deve responder.
6. Para parar, Ctrl+C.

## Versões com que foi testado

Node.js 24.17.0, npm 11.13.0 e Express 5.2.1, em macOS, a 9 de outubro de 2026.

![Rodapé](../../../imagens/rodape.png)
