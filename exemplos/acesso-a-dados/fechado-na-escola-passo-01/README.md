![Cabeçalho](../../../imagens/cabecalho.png)

# Fechado na escola, no fim do passo 1

Este é o jogo Fechado na escola como fica no fim do passo 1, o [laboratório do tema 03 Arquitetura e setup Node](../../../01-acesso-a-dados/laboratorios/03-arquitetura-e-setup-node-laboratorio.md). Tem o projeto, a ligação ao Atlas, as cenas da história no seed e a API, com tudo no `server.js`. É o ponto de partida do passo 2. Se faltaste ao passo 1, ou se o teu projeto não arranca, copia esta pasta e continua daqui.

## O que está nesta pasta

- `src/server.js`: o servidor, com o middleware de registo, a rota de estado, as duas rotas das cenas e o middleware final.
- `src/db/mongoose.js`: a ligação ao MongoDB Atlas, com a cadeia de ligação lida do `.env`.
- `src/models/cena.model.js`: o modelo das cenas, com as escolhas embutidas.
- `src/seed.js`: as onze cenas da história, que apaga e volta a inserir.
- `package.json` e `package-lock.json`: o projeto e as versões exatas dos pacotes.
- `.env.example` e `.gitignore`: a configuração sem segredos, e o que o Git ignora.

## Como correr

Precisas do Node.js 22 ou mais recente, da tua conta no Atlas e de internet. Copia esta pasta para fora do repositório e, num terminal dentro dela:

```bash
npm install
cp .env.example .env
```

No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`.

Abre o `.env` e escreve na linha `MONGODB_URI=` a cadeia de ligação do teu cluster no Atlas, com o teu utilizador e a tua palavra-passe. Depois, põe as cenas na base e liga o servidor:

```bash
npm run seed
npm run dev
```

O que deves ver: o seed escreve `Inseridas 11 cenas`, e o servidor escreve `Ligada à base de dados fechado-na-escola` e `Fechado na escola em http://localhost:3000`. No browser, `http://localhost:3000/api/cenas/inicio` mostra a primeira cena. Para parar, Ctrl+C.

## Versões com que foi testado

Node.js 26.11.1, npm 11.20.0, Express 5.3.0 e Mongoose 9.11.4, em macOS, a 4 de novembro de 2026. A base de dados foi um MongoDB 9.0.4 instalado no computador, e não o Atlas.

![Rodapé](../../../imagens/rodape.png)
