![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria, o esqueleto

O esqueleto da API da papelaria: um projeto Node com módulos ES, os scripts `start` e `dev`, a configuração num `.env` e uma só rota, a de estado. É usado no tema [03 Arquitetura e setup Node](../../../01-acesso-a-dados/03-arquitetura-e-setup-node.md). É o projeto do [exemplo guiado do guia](../../../01-acesso-a-dados/03-arquitetura-e-setup-node.md#exemplo-guiado-o-esqueleto-da-api-da-papelaria), pronto a correr. O desafio da ficha 03 e os exercícios 3 e 4 da ficha 04 fazem-se numa cópia dele.

No tema 04, a API cresce em duas versões: com as rotas do contrato todas no `server.js`, em [papelaria-api-sem-camadas](../papelaria-api-sem-camadas/README.md), e com as camadas, em [papelaria-api-com-camadas](../papelaria-api-com-camadas/README.md).

## O que está nesta pasta

- `src/server.js`: o arranque da API, com a rota `GET /api/estado`.
- `package.json`: o projeto, com o `"type": "module"`, os scripts e a dependência do Express.
- `package-lock.json`: as versões exatas dos pacotes.
- `.env.example`: os nomes da configuração, sem segredos.
- `.gitignore`: o que o Git ignora, a `node_modules` e o `.env`.

## Como correr

Precisas do Node.js 22 ou mais recente, e de internet para o `npm install`. Copia esta pasta para fora do repositório e, num terminal dentro dela:

```bash
npm install
cp .env.example .env
npm run dev
```

No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`.

O que deves ver: o terminal mostra as duas linhas do npm e `API a correr em http://localhost:3000`. No browser, `http://localhost:3000/api/estado` mostra `{"estado":"ok","aplicacao":"API da papelaria"}`. No separador Rede das ferramentas de programador, com "Disable cache" marcado, o pedido tem o código 200. Qualquer outro caminho, como `/api/artigos`, dá 404, com a página de erro do Express, `Cannot GET /api/artigos`, porque ainda não há essas rotas. Para parar, Ctrl+C no terminal.

## Versões e compatibilidade

As versões usadas são o Node.js 26 e o npm 11. O `package-lock.json` fixa o Express 5.3.0.

![Rodapé](../../../imagens/rodape.png)
