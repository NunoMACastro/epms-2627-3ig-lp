![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria

O esqueleto da API da papelaria: um projeto Node com módulos ES, os scripts `start` e `dev`, a configuração num `.env` e uma só rota, a de estado. É usado no tema [03 Arquitetura e setup Node](../../../01-acesso-a-dados/03-arquitetura-e-setup-node.md), e é o projeto pronto a correr, para comparares com o teu.

A versão seguinte, do tema 04, existe em dois passos. A primeira versão, com as rotas do contrato todas no `server.js`, está em [papelaria-api-sem-camadas](../papelaria-api-sem-camadas/README.md). A versão com as camadas está em [papelaria-api-com-camadas](../papelaria-api-com-camadas/README.md).

## O que está nesta pasta

- `src/server.js`: o arranque da API, com a rota `GET /api/estado`.
- `package.json`: o projeto, com o `"type": "module"`, os scripts e a dependência do Express.
- `package-lock.json`: as versões exatas dos pacotes.
- `.env.example`: os nomes da configuração, sem segredos.
- `.gitignore`: o que o Git ignora, a `node_modules` e o `.env`.

Não estão aqui, de propósito, a pasta `node_modules`, que se recria com `npm install`, nem o ficheiro `.env`, que é de cada computador e nunca se publica.

## Como correr

Precisas do Node.js 22 ou mais recente, e de internet para o `npm install`. Copia esta pasta para fora do repositório e, num terminal dentro dela:

```bash
npm install
cp .env.example .env
npm run dev
```

No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`.

O que deves ver: o terminal mostra `API a correr em http://localhost:3000`. No browser, `http://localhost:3000/api/estado` mostra `{"estado":"ok","aplicacao":"API da papelaria"}`, com o código 200, que vês no separador Rede das ferramentas de programador. Qualquer outro caminho, como `/api/artigos`, dá 404, porque ainda não há essas rotas. Para parar, Ctrl+C no terminal.

## Versões com que foi testado

Node.js 26.11.1, npm 11.20.0 e Express 5.3.0, em macOS, a 14 de outubro de 2026. Antes, no Node.js 24.17.0, com o Express 5.2.1, a 7 de outubro, e com o Express 5.3.0, a 12 de outubro.

![Rodapé](../../../imagens/rodape.png)
