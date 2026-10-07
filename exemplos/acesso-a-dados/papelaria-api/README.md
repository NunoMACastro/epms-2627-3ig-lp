![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria

O esqueleto da API do [tema Arquitetura e setup Node](../../../01-acesso-a-dados/03-arquitetura-e-setup-node.md): um projeto Node com módulos ES, os scripts `start` e `dev`, a configuração num `.env` e uma só rota, a de estado. O guia explica cada ficheiro; aqui está o projeto pronto a correr, para comparares com o teu.

A versão seguinte, com o contrato e as rotas, o controller e o service dos artigos, do tema 4, está em [papelaria-api-com-camadas](../papelaria-api-com-camadas/README.md).

## O que está nesta pasta

| Ficheiro | Para que serve |
| --- | --- |
| `src/server.js` | O arranque da API, com a rota `GET /api/estado` |
| `package.json` | O projeto: `"type": "module"`, os scripts e a dependência do Express |
| `package-lock.json` | As versões exatas dos pacotes |
| `.env.example` | Os nomes da configuração, sem segredos |
| `.gitignore` | O que o Git ignora: a `node_modules` e o `.env` |

Não estão aqui, de propósito, a pasta `node_modules`, que se recria com `npm install`, nem o ficheiro `.env`, que é de cada computador e nunca se publica.

## Como correr

Precisas do Node.js 22 ou 24 e de internet para o primeiro passo.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. Instala as dependências:

   ```text
   npm install
   ```

3. Cria o teu `.env` a partir do exemplo (no Windows, na linha de comandos clássica, `copy` em vez de `cp`):

   ```text
   cp .env.example .env
   ```

4. Arranca a API em modo de desenvolvimento:

   ```text
   npm run dev
   ```

   O terminal deve mostrar `API a correr em http://localhost:3000`.

5. No browser, `http://localhost:3000/api/estado` deve mostrar `{"estado":"ok","aplicacao":"API da papelaria"}`, com o código 200. Qualquer outro caminho, como `/api/artigos`, dá 404, porque ainda não há essas rotas.

6. Para parar, Ctrl+C no terminal.

## Versões com que foi testado

Node.js 24.17.0, npm 11.13.0 e Express 5.2.1, em macOS, a 7 de outubro de 2026.

![Rodapé](../../../imagens/rodape.png)
