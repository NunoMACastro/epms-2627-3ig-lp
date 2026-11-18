![Cabeçalho](../../../imagens/cabecalho.png)

# Fechado na escola, no fim do passo 1

Este é o jogo Fechado na escola como fica no fim do passo 1, o [laboratório do tema 03 Arquitetura e setup Node](../../../01-acesso-a-dados/laboratorios/03-arquitetura-e-setup-node-laboratorio.md). Tem o projeto, a ligação ao Atlas, as cenas da história no seed e a API, com as rotas todas no `server.js`.

É o ponto de partida do passo 2. Se faltaste ao passo 1, ou se o teu projeto não arranca, copia esta pasta e continua daqui: [O que precisas](../../../01-acesso-a-dados/laboratorios/04-api-express-e-contratos-laboratorio.md#o-que-precisas), no laboratório do passo 2, diz como.

## O que está nesta pasta

- `src/server.js`: o servidor, com o middleware de registo, a rota de estado, as duas rotas das cenas e o middleware final.
- `src/db/mongoose.js`: a ligação ao MongoDB Atlas, com a cadeia de ligação lida do `.env`.
- `src/models/cena.model.js`: o modelo das cenas, com as escolhas embutidas.
- `src/seed.js`: as onze cenas da história, que apaga e volta a inserir.
- `package.json` e `package-lock.json`: o projeto e as versões exatas dos pacotes.
- `.env.example` e `.gitignore`: a configuração sem segredos, e o que o Git ignora.

## Como correr

Precisas do Node.js 22 ou mais recente, do teu cluster no Atlas e de internet. Copia esta pasta para fora do repositório e, num terminal dentro dela:

```bash
npm install
cp .env.example .env
```

No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`.

Abre o `.env` e escreve na linha `MONGODB_URI=` a cadeia de ligação do teu cluster, com a palavra-passe do utilizador da base de dados. Encontras a cadeia no Atlas como no passo 5 da [fase 2 do laboratório do passo 1](../../../01-acesso-a-dados/laboratorios/03-arquitetura-e-setup-node-laboratorio.md#fase-2-o-segredo-fica-só-no-servidor). Depois, põe as cenas na base e liga o servidor:

```bash
npm run seed
npm run dev
```

O que deves ver: o seed escreve `Ligada à base de dados fechado-na-escola`, uma linha com as cenas apagadas e `Inseridas 11 cenas`. O servidor escreve a mesma linha da base e `Fechado na escola em http://localhost:3000`. No browser, `http://localhost:3000/api/cenas/inicio` mostra a primeira cena, "A biblioteca às escuras". Para parar, Ctrl+C.

Se alguma coisa falhar, os problemas mais comuns estão no fim do laboratório do passo 1, em [Se alguma coisa falhar](../../../01-acesso-a-dados/laboratorios/03-arquitetura-e-setup-node-laboratorio.md#se-alguma-coisa-falhar).

## Versões e compatibilidade

As versões usadas são o Node.js 26 e o npm 11. O `package-lock.json` fixa o Express 5.3.0 e o Mongoose 9.11.4, e o `npm install` instala essas, e não outras mais recentes.

![Rodapé](../../../imagens/rodape.png)
