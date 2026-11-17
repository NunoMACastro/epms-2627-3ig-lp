![Cabeçalho](../../imagens/cabecalho.png)

# Laboratório: arquitetura e setup Node

## O que vais construir

Vais fazer o passo 1 de Fechado na escola, um jogo de aventura por escolhas: adormeceste na biblioteca e acordas às 22:40, com a escola fechada. Começas numa pasta vazia e acabas com as onze cenas no teu cluster do Atlas, uma API que as mostra em JSON e o primeiro commit, sem a palavra-passe.

No fim, a pasta do projeto fica assim:

```text
fechado-na-escola/
├── .env                 a configuração deste computador, com a palavra-passe; nunca vai para o Git
├── .env.example         os nomes da configuração, sem segredos; vai para o Git
├── .gitignore           o que o Git deve ignorar
├── package.json
├── package-lock.json
├── node_modules/        recria-se com npm install; nunca vai para o Git
└── src/
    ├── server.js        a API, com as rotas das cenas
    ├── seed.js          as onze cenas, que se põem na base
    ├── db/
    │   └── mongoose.js  a ligação ao Atlas
    └── models/
        └── cena.model.js  o modelo das cenas
```

1. [Fase 1: O .gitignore deixa os segredos fora do Git](#fase-1-o-gitignore-deixa-os-segredos-fora-do-git)
2. [Fase 2: O segredo fica só no servidor](#fase-2-o-segredo-fica-só-no-servidor)
3. [Fase 3: A API responde com dados, e não com páginas](#fase-3-a-api-responde-com-dados-e-não-com-páginas)
4. [Fase 4: Um pedido vai do browser à base de dados e volta](#fase-4-um-pedido-vai-do-browser-à-base-de-dados-e-volta)
5. [Fase 5: Um commit guarda uma fotografia do projeto](#fase-5-um-commit-guarda-uma-fotografia-do-projeto)
6. [Fase 6: Um pedido atravessa as camadas sempre pela mesma ordem](#fase-6-um-pedido-atravessa-as-camadas-sempre-pela-mesma-ordem)

## O que precisas

- O Node.js 22 ou mais recente, que traz o npm: `node --version` mostra `v22` ou mais, como `v26.11.1`.
- O Git: `git --version` mostra `git version` e um número. Se o comando não existir, chama o professor.
- O Visual Studio Code, com o terminal (menu "Terminal", "New Terminal").
- O teu cluster do Atlas, da [fase 1 do laboratório do tema 02](02-modelo-documental-e-consultas-no-atlas-laboratorio.md#fase-1-no-atlas-cada-aluno-tem-o-seu-cluster), e a palavra-passe do utilizador da base de dados. Se não a souberes, [cria uma nova](02-modelo-documental-e-consultas-no-atlas-laboratorio.md#a-palavra-passe-da-base-de-dados-ficou-no-sítio-errado). Em casa, [autoriza primeiro a tua rede](#o-seed-ou-o-servidor-ficam-parados-uns-30-segundos).
- Internet, e o Chrome ou outro browser com ferramentas de programador (F12; no Mac, Cmd+Option+I).

## Preparar o projeto

1. Cria a pasta do projeto e abre-a no editor. Na tua pasta de trabalho de Linguagens de Programação, cria a pasta `fechado-na-escola`. Tem de ficar fora de qualquer outro projeto e da pasta dos materiais da disciplina, que tem o seu próprio Git. No Visual Studio Code, abre-a no menu "File", com "Open Folder" (abrir pasta). Abre o terminal, que fica já dentro da pasta, e escreve `pwd` (no Windows, na linha de comandos clássica, `cd`, sem mais nada).

   O que deves ver: o caminho da pasta, a acabar em `fechado-na-escola`. O nome conta, porque o npm vai dá-lo ao projeto.

2. Cria o projeto e instala o Express, que é o servidor, e o Mongoose, que fala com o MongoDB. Antes de correres, prevê: que ficheiros e pastas vão aparecer na pasta?

   ```bash
   npm init -y
   npm install express mongoose
   ```

   O que deves ver: o `npm init -y` escreve `Wrote to`, o caminho do `package.json` e o conteúdo dele. O `npm install` escreve, pelo meio, uma linha como `added 83 packages, and audited 84 packages in 3s`; as do `funding` e o `found 0 vulnerabilities` podem ignorar-se. Na pasta aparecem o `package.json`, do `npm init`, e a `node_modules` e o `package-lock.json`, do `npm install`. No Windows, os comandos são os mesmos; se o npm der um erro sobre o `npm.ps1`, vê [este problema](#o-npm-não-corre-na-powershell-do-windows).

3. Prepara o `package.json` para o jogo: abre-o e substitui o conteúdo todo por este.

   ```json
   {
     "name": "fechado-na-escola",
     "version": "1.0.0",
     "description": "Fechado na escola: um jogo de aventura em que cada cena conta um bocado da história e o jogador escolhe o que fazer.",
     "main": "src/server.js",
     "scripts": {
       "start": "node src/server.js",
       "dev": "node --watch --env-file=.env src/server.js",
       "seed": "node --env-file=.env src/seed.js"
     },
     "keywords": [],
     "author": "",
     "license": "ISC",
     "type": "module",
     "dependencies": {
       "express": "^5.3.0",
       "mongoose": "^9.11.4"
     }
   }
   ```

   Em relação ao que lá estava, mudam quatro coisas. A `description` diz o que é o jogo, o `main` passa a ser o `src/server.js` e o `"type": "module"` deixa usar o `import`. No lugar do `test` ficam três scripts. O `dev` arranca o servidor com o `.env` e volta a arrancá-lo quando guardas um ficheiro, e o `seed` põe as cenas na base. O `start` é o arranque noutro computador, sem o `.env`. As versões das `dependencies` podem ser diferentes das que o teu `npm install` escreveu, e não faz mal: o projeto usa as que ficaram instaladas. Rever: [Os scripts do package.json](../03-arquitetura-e-setup-node.md#os-scripts-do-packagejson).

4. Guarda e, no terminal, escreve `npm run`, sem mais nada.

   O que deves ver:

   ```text
   Lifecycle scripts included in fechado-na-escola@1.0.0:
     start
       node src/server.js
   available via `npm run`:
     dev
       node --watch --env-file=.env src/server.js
     seed
       node --env-file=.env src/seed.js
   ```

   O npm leu o `package.json` e encontrou os três scripts. O `start` aparece à parte porque o npm já conhece o nome, e corre-se também com `npm start`, sem o `run`. Se o npm escrever um erro sobre o `package.json`, volta a copiar o bloco inteiro, porque lhe falta ou sobra algum carácter.

## Fase 1: O .gitignore deixa os segredos fora do Git

Preparas o `.env` e o Git enquanto o `.env` ainda não tem a palavra-passe, e confirmas no `git status` que o Git o deixa de fora. Quem o diz ao Git é o ficheiro `.gitignore`. Rever: [O .gitignore deixa os segredos fora do Git](../03-arquitetura-e-setup-node.md#o-gitignore-deixa-os-segredos-fora-do-git).

1. Na raiz do projeto, ao lado do `package.json`, cria o ficheiro `.env.example` com este conteúdo. No explorador do Visual Studio Code, carrega no botão de ficheiro novo e escreve o nome. Não uses o Bloco de Notas do Windows, que pode acrescentar `.txt` ao nome sem o mostrar.

   ```text
   # Porta onde o jogo escuta. Muda-a se a 3000 estiver ocupada.
   PORT=3000

   # Ligação ao MongoDB Atlas, no formato mongodb+srv://utilizador:palavra-passe@...
   # O endereço verdadeiro escreve-se só no .env. No .env.example, esta linha fica vazia.
   MONGODB_URI=

   # Nome da base de dados no Atlas. A cadeia de ligação não o diz.
   DB_NAME=fechado-na-escola
   ```

   O ficheiro tem três variáveis, uma por linha, no formato `NOME=valor`, e vai para o Git, sem segredos. Rever: [O .env.example diz que variáveis é preciso definir](../03-arquitetura-e-setup-node.md#o-envexample-diz-que-variáveis-é-preciso-definir).

2. Cria o `.env`, o ficheiro que o servidor vai ler, como cópia do `.env.example`:

   ```bash
   cp .env.example .env
   ```

   No Windows, na linha de comandos clássica, o comando é `copy .env.example .env`. O que deves ver: o `.env` na lista de ficheiros do editor. O `cp` não escreve nada; no Windows, o `copy` escreve uma linha a dizer que copiou um ficheiro. Por agora, os dois ficheiros são iguais. Rever: [O ficheiro .env guarda a configuração deste computador](../03-arquitetura-e-setup-node.md#o-ficheiro-env-guarda-a-configuração-deste-computador).

3. Começa o histórico do Git nesta pasta:

   ```bash
   git init
   ```

   O que deves ver: `Initialized empty Git repository in`, o caminho da pasta e `.git/`. O Git criou o repositório, com o histórico na pasta escondida `.git`. Antes, pode escrever umas linhas começadas por `hint:`, sobre o nome do ramo principal, que podes ignorar.

4. Vê o estado da pasta. Antes de correres, prevê: que ficheiros vai o Git mostrar como novos?

   ```bash
   git status --short
   ```

   O que deves ver:

   ```text
   ?? .env
   ?? .env.example
   ?? node_modules/
   ?? package-lock.json
   ?? package.json
   ```

   O `??` quer dizer "ficheiro novo, que o Git ainda não segue". Na lista estão o `.env` e a `node_modules/`: com um `git add .` agora, os dois iam para o próximo commit, e daqui a pouco o `.env` leva a palavra-passe. Não faças nenhum `git add` antes da fase 5. Rever: [Um commit guarda uma fotografia do projeto](../03-arquitetura-e-setup-node.md#um-commit-guarda-uma-fotografia-do-projeto).

5. Na raiz do projeto, cria o ficheiro `.gitignore` com este conteúdo, e guarda:

   ```text
   # Dependências: recriam-se com npm install.
   node_modules/

   # Configuração local e segredos: nunca vão para o Git.
   .env
   ```

   A linha `.env` ignora só esse ficheiro: o `.env.example` tem outro nome, e o Git continua a vê-lo.

6. Volta a correr `git status --short`. O que deves ver:

   ```text
   ?? .env.example
   ?? .gitignore
   ?? package-lock.json
   ?? package.json
   ```

   O `.env` e a `node_modules/` saíram da lista, e o `.gitignore` entrou nela. O `.env` continua na pasta, para o servidor o ler: o Git é que passou a agir como se ele não existisse. Se o `.env` ou a `node_modules/` ainda aparecerem, vê [Se alguma coisa falhar](#o-env-aparece-no-git-status-ou-foi-para-um-commit).

7. Diz ao Git quem és, para ele pôr o teu nome em cada commit. Sem o `--global`, a configuração fica só nesta pasta e, nos computadores da escola, que são partilhados, não passa para quem vier a seguir.

   ```bash
   git config user.name "O teu nome"
   git config user.email "o teu email da escola"
   ```

   Troca o texto entre aspas pelo teu nome e pelo teu email. O que deves ver: nenhuma mensagem.

### Paragem 1

O Git segue a pasta do projeto, e o `git status --short` não mostra o `.env` nem a `node_modules/`.

Pensa antes de continuares: neste momento, o `.env.example` e o `.env` são iguais. O que vai ser diferente entre os dois no fim da fase 2? A resposta: o `.env` vai ter, na linha `MONGODB_URI=`, a cadeia de ligação do teu cluster, com a palavra-passe. O `.env.example` continua com a linha vazia, porque vai para o Git.

## Fase 2: O segredo fica só no servidor

Pões as onze cenas no teu cluster, com a ligação, o modelo e o seed, como no cinema da escola, e a cadeia de ligação só no `.env`. A cadeia de ligação tem a palavra-passe da base de dados, e por isso é um segredo que nunca se escreve no código. Rever: [O segredo fica só no servidor](../03-arquitetura-e-setup-node.md#o-segredo-fica-só-no-servidor).

1. Cria o ficheiro `src/db/mongoose.js` com este conteúdo. No botão de ficheiro novo, podes escrever o caminho inteiro, `src/db/mongoose.js`, e o editor cria as pastas que faltam.

   ```js
   // src/db/mongoose.js: a ligação do jogo ao MongoDB Atlas, através do Mongoose.
   // A cadeia de ligação leva o utilizador e a palavra-passe da base de dados:
   // é um segredo, por isso vem do ficheiro .env e nunca está escrita no código.
   import mongoose from "mongoose";

   /**
    * Liga o Mongoose à base de dados do jogo, no Atlas.
    * Lê a cadeia de ligação de MONGODB_URI e o nome da base de DB_NAME.
    * Se faltar a cadeia ou a ligação falhar, a promessa é rejeitada com o erro,
    * e quem chamou não deixa o programa continuar.
    * @returns {Promise<void>} cumprida quando a ligação está feita
    */
   export async function ligarBaseDeDados() {
     const uri = process.env.MONGODB_URI;
     if (!uri) {
       throw new Error("falta a MONGODB_URI no ficheiro .env");
     }

     // A cadeia que o Atlas te dá não diz que base de dados usar. Sem o dbName,
     // o Mongoose usava uma base chamada test, que está vazia.
     await mongoose.connect(uri, { dbName: process.env.DB_NAME || "fechado-na-escola" });

     // Escreve o nome da base, e nunca a cadeia de ligação, que tem a palavra-passe.
     console.log(`Ligada à base de dados ${mongoose.connection.name}`);
   }
   ```

   O ficheiro tem uma só função, a `ligarBaseDeDados`, que o seed e o servidor vão importar. Um `throw` dentro dela chega ao `catch` de quem a chamou com o `await`.

2. Cria o ficheiro `src/models/cena.model.js` com este conteúdo:

   ```js
   // src/models/cena.model.js: o modelo das cenas do jogo, no Mongoose.
   // Cada cena é um documento da coleção cenas: um bocado da história, com as
   // escolhas que o jogador pode fazer a seguir.
   import mongoose from "mongoose";

   // Uma escolha não existe sozinha: só faz sentido dentro da sua cena, por isso
   // está embutida nela. O destino é o código da cena para onde a escolha leva.
   // O _id: false tira o identificador que o Mongoose daria a cada escolha:
   // uma escolha não se procura sozinha, e não precisa dele.
   const escolhaSchema = new mongoose.Schema(
     {
       texto: String,
       destino: String,
     },
     { _id: false },
   );

   const cenaSchema = new mongoose.Schema({
     // O código identifica a cena no jogo, como "corredor" ou "sala-12".
     // É por ele que as escolhas apontam umas para as outras.
     codigo: String,
     titulo: String,
     texto: String,
     // Uma cena final acaba a partida, e não tem escolhas.
     final: Boolean,
     escolhas: [escolhaSchema],
   });

   // O terceiro argumento é o nome da coleção, escrito à mão.
   export const Cena = mongoose.model("Cena", cenaSchema, "cenas");
   ```

   Lê-o de baixo para cima. A última linha cria o modelo `Cena`, com que o resto do jogo lê e escreve na coleção `cenas`. Com o nome escrito à mão, a coleção chama-se sempre `cenas`, sem depender da regra com que o Mongoose inventa os nomes. Os parênteses retos em `[escolhaSchema]` dizem que `escolhas` é uma lista de documentos embutidos, cada um com a forma de uma escolha. Rever: [A informação relacionada embute-se ou referencia-se](../02-modelo-documental-e-consultas-no-atlas.md#a-informação-relacionada-embute-se-ou-referencia-se).

3. Cria o ficheiro `src/seed.js` com este conteúdo:

   ```js
   // src/seed.js: põe as cenas da história na base de dados.
   // Corre-se à parte, com npm run seed, antes de arrancar o servidor.
   // Apaga primeiro as cenas que lá estiverem, por isso pode correr-se
   // as vezes que for preciso, sem repetir cenas.
   import mongoose from "mongoose";
   import { ligarBaseDeDados } from "./db/mongoose.js";
   import { Cena } from "./models/cena.model.js";

   // A história começa na cena "inicio". Cada escolha leva à cena com o código
   // do destino. As cenas finais não têm escolhas.
   const cenas = [
     {
       codigo: "inicio",
       titulo: "A biblioteca às escuras",
       texto: "Acordas com a cara em cima de um livro de Matemática. A biblioteca está às escuras e a escola está em silêncio: adormeceste a estudar, e ninguém deu por ti. O telemóvel tem 3% de bateria e marca 22:40.",
       final: false,
       escolhas: [
         { texto: "Sair para o corredor", destino: "corredor" },
         { texto: "Procurar um carregador atrás do balcão", destino: "carregador" },
       ],
     },
     {
       codigo: "carregador",
       titulo: "Atrás do balcão",
       texto: "Encontras um carregador, mas a tomada não dá corrente: à noite, a escola desliga a luz das salas. Ao menos, a lanterna do telemóvel ainda funciona.",
       final: false,
       escolhas: [{ texto: "Sair para o corredor", destino: "corredor" }],
     },
     {
       codigo: "corredor",
       titulo: "O corredor do rés-do-chão",
       texto: "Só se vê a luz verde das saídas de emergência. À esquerda, a porta da secretaria está entreaberta. Ao fundo, fica a porta principal. Lá em cima, alguma coisa bate com força, de vez em quando.",
       final: false,
       escolhas: [
         { texto: "Entrar na secretaria", destino: "secretaria" },
         { texto: "Ir até à porta principal", destino: "porta-principal" },
         { texto: "Subir as escadas", destino: "escadas" },
       ],
     },
     {
       codigo: "secretaria",
       titulo: "A secretaria",
       texto: "Na parede há um quadro com chaves penduradas, e uma delas diz Sala 12. Em cima da mesa está um bilhete do contínuo: «Ronda às 23h. O ginásio fecha por fora.»",
       final: false,
       escolhas: [{ texto: "Levar a chave da sala 12 e voltar ao corredor", destino: "corredor" }],
     },
     {
       codigo: "porta-principal",
       titulo: "A porta principal",
       texto: "A porta está fechada à chave, e a luz do alarme pisca a vermelho ao lado do puxador. Se a forçares, o alarme toca.",
       final: false,
       escolhas: [
         { texto: "Forçar a porta", destino: "fim-alarme" },
         { texto: "Voltar ao corredor", destino: "corredor" },
       ],
     },
     {
       codigo: "escadas",
       titulo: "O primeiro andar",
       texto: "Sobes devagar, com a lanterna apontada aos degraus. O barulho vem da sala 12: alguém deixou a janela aberta, e a cortina bate com o vento. Ao fundo do corredor, o passadiço leva ao ginásio.",
       final: false,
       escolhas: [
         { texto: "Entrar na sala 12", destino: "sala-12" },
         { texto: "Atravessar o passadiço até ao ginásio", destino: "fim-ginasio" },
       ],
     },
     {
       codigo: "sala-12",
       titulo: "A sala 12",
       texto: "A janela da sala 12 dá para o telhado do pavilhão, que fica mesmo por baixo. Lá em baixo, o portão das traseiras está aberto. No corredor, ouvem-se passos e o tilintar de chaves.",
       final: false,
       escolhas: [
         { texto: "Sair pela janela para o telhado", destino: "fim-telhado" },
         { texto: "Esconder-te debaixo da mesa do professor", destino: "fim-ronda" },
       ],
     },
     {
       codigo: "fim-telhado",
       titulo: "Cá fora!",
       texto: "Desces pelo telhado do pavilhão, passas o portão das traseiras e chegas a casa antes da meia-noite. Amanhã, ninguém na turma vai acreditar.",
       final: true,
       escolhas: [],
     },
     {
       codigo: "fim-alarme",
       titulo: "O alarme",
       texto: "O alarme dispara e enche a escola de barulho. Dez minutos depois, chegam o contínuo e a diretora. Vais ter muito que explicar.",
       final: true,
       escolhas: [],
     },
     {
       codigo: "fim-ronda",
       titulo: "A ronda das 23h",
       texto: "Os passos param à porta. O contínuo acende a luz, vê os teus ténis a espreitar debaixo da mesa e suspira: «Mais um que adormeceu na biblioteca.» Leva-te até à porta e liga aos teus pais.",
       final: true,
       escolhas: [],
     },
     {
       codigo: "fim-ginasio",
       titulo: "Fechado no ginásio",
       texto: "Entras no ginásio, e a porta fecha-se atrás de ti com um estalo. Fecha por fora, como dizia o bilhete. Passas a noite em cima dos colchões, e às 8h a turma do primeiro tempo encontra-te lá dentro.",
       final: true,
       escolhas: [],
     },
   ];

   try {
     await ligarBaseDeDados();
     // O filtro vazio, {}, escolhe todos os documentos: apaga todas as cenas.
     const apagadas = await Cena.deleteMany({});
     console.log(`Apagadas ${apagadas.deletedCount} cenas`);
     // Insere as cenas de uma só vez, como o "Insert Document" do Atlas.
     const inseridas = await Cena.insertMany(cenas);
     console.log(`Inseridas ${inseridas.length} cenas`);
   } catch (erro) {
     console.error(`O seed falhou: ${erro.message}`);
   }

   // A ligação à base fica aberta até alguém a fechar. Sem esta linha,
   // o programa ficava à espera e não voltava ao terminal.
   await mongoose.disconnect();
   ```

   O ficheiro tem duas partes: em cima, a lista `cenas`, com as onze cenas da história; em baixo, o programa que as põe na base. O `destino` de cada escolha é o `codigo` de outra cena da lista, e o MongoDB não confirma que esse código existe. Rever: [O MongoDB não verifica as referências](../02-modelo-documental-e-consultas-no-atlas.md#o-mongodb-não-verifica-as-referências).

4. Provoca um erro de propósito: corre o seed antes de pores a cadeia de ligação no `.env`.

   ```bash
   npm run seed
   ```

   O que deves ver: as duas linhas do npm, `> fechado-na-escola@1.0.0 seed` e o comando, e depois `O seed falhou: falta a MONGODB_URI no ficheiro .env`. O `--env-file` leu o `.env`, mas a linha da `MONGODB_URI` está vazia: a função de ligação recusou-se a continuar, com o `throw`, e o `catch` do seed escreveu a razão.

5. Põe a cadeia de ligação no `.env`. No Atlas, no menu lateral, na secção "Database", abre "Clusters" e carrega em "Connect" (ligar) no teu cluster. Escolhe "Drivers" e copia a cadeia que começa por `mongodb+srv://` para a linha `MONGODB_URI=` do `.env`, logo a seguir ao `=` e sem espaços.

   Na cadeia, troca o marcador da palavra-passe, como `<db_password>`, com os sinais `<` e `>` incluídos, pela palavra-passe do utilizador da base de dados. Guarda o `.env`. Se o ecrã do Atlas tiver outros nomes, procura a opção que mostra a cadeia começada por `mongodb+srv://`. Se mostrar também um comando `npm install mongodb`, não o corras: o Mongoose já trata da ligação. A partir de agora, o `.env` tem um segredo: não o copies para mais lado nenhum.

6. Corre o seed outra vez:

   ```bash
   npm run seed
   ```

   O que deves ver, a seguir às duas linhas do npm:

   ```text
   Ligada à base de dados fechado-na-escola
   Apagadas 0 cenas
   Inseridas 11 cenas
   ```

   No fim, o terminal fica pronto para outro comando. A coleção ainda não existia, por isso não havia nada para apagar. Se o seed ficar parado uns 30 segundos e acabar com um erro, ou se o erro disser `bad auth` ou `querySrv`, vê [Se alguma coisa falhar](#se-alguma-coisa-falhar).

7. Prevê: se correres o seed uma terceira vez, quantas cenas apaga, e com quantas fica a coleção? Depois, corre-o.

   O que deves ver: `Apagadas 11 cenas` e `Inseridas 11 cenas`. A coleção continua com onze cenas, e nunca com 22. É por apagar primeiro que o seed se pode correr as vezes que for preciso.

8. No Atlas, no menu lateral, na secção "Database", abre o "Data Explorer" (explorador de dados), a base `fechado-na-escola` e a coleção `cenas`. Se não vires a base, carrega no botão de atualizar do explorador.

   O que deves ver: as onze cenas. Cada uma tem o `_id` que o MongoDB lhe deu e um campo `__v`, com o valor 0, que é do Mongoose e podes ignorar. As escolhas aparecem dentro da cena, numa lista, cada uma só com o `texto` e o `destino`, sem `_id`.

### Paragem 2

As onze cenas estão na coleção `cenas` do teu cluster, e o seed pode correr outra vez sem as repetir.

Pensa antes de continuares: imagina que mudavas o título de uma cena no `seed.js` e voltavas a correr o seed. Na base, ficava o título antigo, o novo, ou os dois? A resposta: só o novo. O seed apaga todas as cenas e insere as do ficheiro, por isso a coleção fica sempre igual à lista `cenas` do `seed.js`. Serve para dados de exemplo, como estes. Numa base com dados verdadeiros, como as partidas dos jogadores, um `deleteMany({})` apagava-os todos.

## Fase 3: A API responde com dados, e não com páginas

Escreves o `src/server.js`, a API que vai buscar as cenas à base e responde com elas em JSON, e jogas uma partida no browser. É o Express de Sistemas de Informação, mas a responder com dados, e não com páginas geradas no servidor. Rever: [A API responde com dados, e não com páginas](../03-arquitetura-e-setup-node.md#a-api-responde-com-dados-e-não-com-páginas).

1. Cria o ficheiro `src/server.js` com este conteúdo:

   ```js
   // src/server.js: o servidor do jogo Fechado na escola.
   // Uma API em JSON, com as cenas da história lidas do MongoDB Atlas através
   // do Mongoose. Por agora, está tudo neste ficheiro.
   import express from "express";
   import { ligarBaseDeDados } from "./db/mongoose.js";
   import { Cena } from "./models/cena.model.js";

   const app = express();

   // A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
   // Se não estiver definida, o jogo usa a 3000.
   const PORTA = process.env.PORT || 3000;

   // Middleware de registo: escreve no terminal cada pedido que chega,
   // e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
   app.use((req, res, next) => {
     console.log(`${req.method} ${req.url}`);
     next();
   });

   // Rota de estado: serve para confirmar que o servidor está ligado e a responder.
   app.get("/api/estado", (req, res) => {
     res.json({ estado: "ok", aplicacao: "Fechado na escola" });
   });

   // Todas as cenas da história, lidas da base de dados.
   app.get("/api/cenas", async (req, res) => {
     const cenas = await Cena.find({});
     res.json(cenas);
   });

   // Uma cena: GET /api/cenas/corredor. O :codigo é um parâmetro de rota, e
   // procura-se no campo codigo de cada documento, e não no _id.
   app.get("/api/cenas/:codigo", async (req, res) => {
     const codigo = req.params.codigo;
     // O find devolve sempre uma lista. Como não há duas cenas com o mesmo
     // código, a lista vem com uma cena, ou vazia, se o código não existir.
     const encontradas = await Cena.find({ codigo: codigo });
     if (encontradas.length === 0) {
       res.status(404).json({ erro: `Não existe a cena ${codigo}` });
       return;
     }
     res.json(encontradas[0]);
   });

   // Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
   app.use((req, res) => {
     res.status(404).json({ erro: "Rota não encontrada" });
   });

   // Primeiro a ligação à base, e só depois o servidor: um jogo que não
   // chega às cenas não deve começar a aceitar pedidos.
   try {
     await ligarBaseDeDados();
   } catch (erro) {
     console.error(`Não foi possível ligar à base de dados: ${erro.message}`);
     process.exit(1);
   }

   app.listen(PORTA, (erro) => {
     if (erro) {
       console.error(`Não foi possível ligar o servidor: ${erro.message}`);
       return;
     }
     console.log(`Fechado na escola em http://localhost:${PORTA}`);
   });
   ```

   Lê-o de cima para baixo: é a ordem por que o Node o executa ao arrancar, e a ordem por que cada pedido passa pelo middleware e pelas rotas. No fim, se a ligação falhar, o `process.exit(1)` termina o programa com um código que quer dizer "acabou com erro". Rever, em Sistemas de Informação: [No caminho: parâmetros de rota](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/01-aplicacoes-em-browser/03-http-rotas-e-middleware.md#no-caminho-parâmetros-de-rota) e [Uma fila, pela ordem do ficheiro](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/01-aplicacoes-em-browser/03-http-rotas-e-middleware.md#uma-fila-pela-ordem-do-ficheiro).

2. Arranca o servidor:

   ```bash
   npm run dev
   ```

   O que deves ver, depois das duas linhas do npm:

   ```text
   Ligada à base de dados fechado-na-escola
   Fechado na escola em http://localhost:3000
   ```

   Primeiro a ligação, e só depois o servidor, pela ordem do arranque. O servidor fica a correr neste terminal até carregares em Ctrl+C. Por agora, deixa-o ligado.

3. No browser, abre as ferramentas de programador (F12) no separador "Rede" ("Network", com o browser em inglês) e marca, no topo, "Disable cache" (desativar a cache). O separador só mostra os pedidos feitos com ele aberto. Sem a cache desativada, um pedido repetido pode aparecer com o código 304, que quer dizer que o browser já tinha a resposta guardada.

   Vais abrir cinco pedidos, cada um com `http://localhost:3000` seguido do caminho: `/api/estado`, `/api/cenas`, `/api/cenas/inicio`, `/api/cenas/sala-13` e `/api/cena/inicio`, sem o `s`. Antes de os abrires, prevê o código de estado de cada um. Depois abre-os, e confirma o código no separador "Rede".

   O que deves ver:

   | Pedido | Código | Resposta |
   | --- | --- | --- |
   | `/api/estado` | 200 | `{"estado":"ok","aplicacao":"Fechado na escola"}` |
   | `/api/cenas` | 200 | A lista das onze cenas, cada uma com o `_id` e o `__v` |
   | `/api/cenas/inicio` | 200 | A cena com o título "A biblioteca às escuras" e duas escolhas |
   | `/api/cenas/sala-13` | 404 | `{"erro":"Não existe a cena sala-13"}` |
   | `/api/cena/inicio` | 404 | `{"erro":"Rota não encontrada"}` |

   Os dois 404 trazem mensagens diferentes: um diz que a cena não existe, e o outro que a rota não existe. No terminal, o middleware de registo escreve uma linha por pedido, como `GET /api/cenas/inicio`. Pode aparecer também `GET /favicon.ico`: é o browser a pedir o ícone do separador, e o middleware final responde-lhe com 404.

4. Joga uma partida. Abre `/api/cenas/inicio` e lê as escolhas. Escolhe uma e abre `/api/cenas/` seguido do `destino` dela, como `/api/cenas/corredor`. Continua assim, cena a cena.

   O que deves ver: ao fim de algumas cenas, uma cena com `"final":true` e `"escolhas":[]`. A partida acabou. Há quatro finais, e só num deles sais da escola sem que ninguém dê por ti. É o jogo a funcionar, ainda sem páginas.

5. Provoca um erro de propósito, que não escreve nenhuma mensagem de erro. Com o servidor ligado, abre o `.env`, muda `DB_NAME=fechado-na-escola` para `DB_NAME=fechado-na-escol`, sem o `a` do fim, e guarda. Depois abre `/api/cenas` e `/api/cenas/inicio`.

   O que deves ver: o `--watch` deu pela mudança do `.env`. Limpa o ecrã do terminal e escreve `Change detected in`, com o caminho do `.env`, e `Restarting 'src/server.js'`. Depois vêm `Ligada à base de dados fechado-na-escol` e a linha do arranque, sem erro nenhum. O `/api/cenas` responde 200, com `[]`, e o `/api/cenas/inicio` responde 404, com `{"erro":"Não existe a cena inicio"}`.

   O servidor ligou-se a uma base que não existia, e ninguém o recusou. O Mongoose até a criou, com a coleção `cenas` vazia, porque cria a coleção de cada modelo que não encontra. A única pista é a linha do terminal que diz a que base o servidor se ligou.

6. Repõe `DB_NAME=fechado-na-escola` no `.env` e guarda. O que deves ver: o servidor volta a arrancar, ligado à base `fechado-na-escola`, e `/api/cenas/inicio` volta a mostrar a primeira cena. No Data Explorer do Atlas, depois de o atualizares, vês também a base `fechado-na-escol`. Podes deixá-la: está vazia, e o jogo não a usa.

### Paragem 3

A API responde com as cenas da base, e jogaste uma partida a pedir uma cena de cada vez.

Pensa antes de continuares: com a base errada, a lista das cenas veio com 200 e `[]`, e não com 404. Estava certo? A resposta: estava. O pedido era válido e a lista existe, só não tinha nenhuma cena. O 404 é para uma coisa que não existe, como a cena de um código que nenhuma tem. É por isso que a rota de uma cena verifica a lista vazia e escolhe o 404, e a rota da lista não o faz.

## Fase 4: Um pedido vai do browser à base de dados e volta

Segues o pedido de uma cena, do browser ao Atlas e de volta, com o separador "Rede" e com o terminal do servidor. Explicar um pedido é dizer, por ordem, quem faz o quê, onde corre e o que viaja. Rever: [Um pedido vai do browser à base de dados e volta](../03-arquitetura-e-setup-node.md#um-pedido-vai-do-browser-à-base-de-dados-e-volta).

1. Com o servidor ligado e o separador "Rede" aberto, com o "Disable cache" marcado, abre `http://localhost:3000/api/cenas/corredor`. Se vires 304 em vez de 200, confirma o "Disable cache": com o 304 não vem o `Content-Type`.

2. Na lista do separador "Rede", clica no pedido `corredor` e abre o separador "Headers" (cabeçalhos). Na parte "General" (geral) estão o endereço, o método, o código de estado e o "Remote Address" (endereço remoto), o endereço do computador que respondeu. Na parte "Response Headers" (cabeçalhos da resposta) está o `Content-Type`.

   O que deves ver:

   | Campo | Valor |
   | --- | --- |
   | Método | `GET` |
   | Endereço | `http://localhost:3000/api/cenas/corredor` |
   | Código | 200 |
   | `Content-Type` | `application/json; charset=utf-8` |
   | Remote Address | `[::1]:3000` ou `127.0.0.1:3000`, duas formas de dizer "este computador", na porta 3000 |

3. Lê os sete passos do pedido. Para cada um, procura o que viste que o confirma, antes de leres a confirmação por baixo da tabela.

   | Passo | Onde | O que acontece |
   | --- | --- | --- |
   | 1 | browser | Escreves o endereço. O browser faz o pedido `GET /api/cenas/corredor` ao computador `localhost`, na porta 3000 |
   | 2 | servidor | O pedido chega à porta 3000, onde o servidor está à escuta. O middleware de registo escreve-o no terminal e passa-o à frente |
   | 3 | servidor | O Express procura uma rota para o caminho e encontra a `/api/cenas/:codigo`. O `req.params.codigo` fica com `"corredor"` |
   | 4 | servidor | A função pede ao Mongoose as cenas com o código `corredor` e espera com o `await`. O Mongoose usa a ligação ao Atlas que o servidor abriu no arranque |
   | 5 | Atlas | Procura na coleção `cenas` e devolve o documento do corredor |
   | 6 | servidor | A função responde com o `res.json`. O Express converte a cena para JSON e junta o código 200 e o tipo `application/json` |
   | 7 | browser | Recebe a resposta e mostra o JSON |

   O que confirma cada passo:

   - no passo 1, o método e o endereço, no separador "Rede";
   - no passo 2, a porta 3000 no Remote Address, e a linha `GET /api/cenas/corredor` no terminal;
   - no passo 3, o `codigo` da cena que veio na resposta, que é `corredor`;
   - nos passos 4 e 5, o texto do corredor, que veio da base: o `server.js` não o tem, e o `seed.js`, que o tem, não faz parte do servidor;
   - no passo 6, o código 200 e o `application/json`, no separador "Rede";
   - no passo 7, o JSON que o browser mostra, que é o corpo da resposta.

4. Pensa: no separador "Rede", aparece algum pedido ao Atlas? A resposta: não. Há um só pedido, do browser ao servidor. Quem fala com o Atlas, nos passos 4 e 5, é o servidor, pela ligação que abriu quando arrancou. Por isso, a cadeia de ligação, com a palavra-passe, fica no `.env` do servidor e nunca viaja para o browser.

5. Abre `/api/cenas/sala-13`. Em que passo é que a história muda, e quem escolhe o 404? A resposta: no passo 5, o Atlas não encontra nenhuma cena com esse código e devolve uma lista vazia. No passo 6, a função vê a lista vazia e responde 404, com a mensagem da cena que não existe. Os passos 1 a 4 são iguais aos do corredor, porque o pedido foi mesmo à base.

6. Para o servidor: no terminal onde ele está a correr, carrega em Ctrl+C. As fases 5 e 6 não precisam dele, e o terminal fica livre para o Git. O que deves ver: o terminal pronto para outro comando.

### Paragem 4

Sabes dizer, por ordem, o que acontece num pedido de uma cena, onde corre cada passo e o que confirma cada um.

Pensa antes de continuares: e o pedido `/api/cena/inicio`, sem o `s`? Em que passo muda a história, e o Atlas chega a ser consultado? A resposta: muda no passo 3. O Express não encontra nenhuma rota para esse caminho, e o pedido segue até ao middleware final, que responde 404 com `{"erro":"Rota não encontrada"}`. Os passos 4 e 5 não acontecem, e o Atlas não é consultado.

## Fase 5: Um commit guarda uma fotografia do projeto

Fazes o primeiro commit, agora que o `.env` tem a palavra-passe, e confirmas antes, no `git status`, que ele fica de fora. O commit guarda a fotografia dos ficheiros que preparaste com o `git add`. Rever: [Um commit guarda uma fotografia do projeto](../03-arquitetura-e-setup-node.md#um-commit-guarda-uma-fotografia-do-projeto).

1. Vê o estado da pasta, no mesmo terminal. Antes de correres, prevê: que ficheiros aparecem agora, e quais não podem aparecer?

   ```bash
   git status --short
   ```

   O que deves ver:

   ```text
   ?? .env.example
   ?? .gitignore
   ?? package-lock.json
   ?? package.json
   ?? src/
   ```

   A pasta `src/` aparece numa só linha, porque o Git ainda não segue nenhum ficheiro dela. O `.env` e a `node_modules/` não aparecem. Se o `.env` aparecer, para aqui, não faças o `git add` e chama o professor.

2. Prepara e guarda o primeiro commit. O `git add .` prepara todos os ficheiros da pasta, menos os que o `.gitignore` manda ignorar, e o `git commit -m` guarda a fotografia, com a mensagem entre aspas.

   ```bash
   git add .
   git commit -m "Passo 1 do Fechado na escola: as cenas no Atlas e a API das cenas"
   ```

   O que deves ver: uma linha que começa como `[master (root-commit) e421b9f]`, seguida da mensagem. O `master`, que noutros computadores se chama `main`, é o nome do ramo, a linha do histórico onde os commits ficam uns a seguir aos outros. O `root-commit` quer dizer que é o primeiro, e o `e421b9f` é o código curto dele, que no teu computador é outro.

   A seguir, `8 files changed` e uma linha `create mode 100644` por cada ficheiro guardado: são os oito ficheiros do projeto, quatro na raiz e quatro na `src`, e nenhum é o `.env`. Se o Git escrever `Please tell me who you are`, faz o passo 7 da fase 1 e repete o commit. No Windows, o `git add .` pode escrever avisos com `LF will be replaced by CRLF`: são sobre a forma como o Windows marca o fim das linhas, e podes ignorá-los.

3. Confirma o histórico e o estado:

   ```bash
   git log --oneline
   git status
   ```

   O que deves ver: o `git log --oneline` mostra um commit, com o código curto à frente da mensagem. O `git status` diz `nothing to commit, working tree clean`, que quer dizer que não ficou nada por guardar. O `.env` continua na pasta, fora do histórico.

### Paragem 5

O projeto está no Git, com um commit, e o `.env` e a `node_modules` ficaram de fora. O código do passo 1 está acabado, e falta o desenho das camadas.

Pensa antes de continuares: um colega fez o `git add .` antes de criar o `.gitignore`, e o `.env`, já com a cadeia de ligação, foi no primeiro commit. Basta-lhe acrescentar agora o `.env` ao `.gitignore`? A resposta: não. O `.gitignore` só faz o Git ignorar o que ele ainda não guardou. O `.env` que foi no primeiro commit continua no histórico, e quem tiver acesso ao repositório pode lê-lo. A única correção segura é mudar no Atlas a palavra-passe desse utilizador. Por isso, primeiro o `.gitignore`, e só depois o primeiro commit.

## Fase 6: Um pedido atravessa as camadas sempre pela mesma ordem

Desenhas em papel o caminho do pedido de uma cena pelas quatro camadas em que o `server.js` se vai dividir no passo 2. Cada camada é um ficheiro com uma só tarefa, e o pedido passa por elas sempre pela mesma ordem. Rever: [Um pedido atravessa as camadas sempre pela mesma ordem](../03-arquitetura-e-setup-node.md#um-pedido-atravessa-as-camadas-sempre-pela-mesma-ordem).

1. Desenha uma caixa para cada uma destas partes, de cima para baixo: o browser, as rotas, o controller, o service, o repository e o Atlas. Liga-as com setas, pela ordem em que o pedido `GET /api/cenas/corredor` passa por elas.

2. Junto de cada camada do servidor, escreve numa linha o que ela faz neste pedido. Usa estas quatro ideias, uma por camada:

   - procurar a cena na base de dados;
   - ler o `codigo` do pedido e escolher a resposta, 200 ou 404;
   - escolher a função que trata o caminho;
   - aplicar as regras do jogo.

   Rever: [O servidor divide-se em quatro camadas](../03-arquitetura-e-setup-node.md#o-servidor-divide-se-em-quatro-camadas).

3. Desenha também as setas de volta, do Atlas até ao browser, e escreve em cada uma o que viaja: a cena, ou nada, quando o código não existe.

   Compara o teu desenho com este, em que as setas cheias são a ida e as tracejadas a volta:

   ```mermaid
   flowchart TD
       B[browser] -->|GET /api/cenas/corredor| R[rotas]
       R --> C[controller]
       C --> S[service]
       S --> RE[repository]
       RE -->|procura a cena corredor| A[(Atlas)]
       A -.->|o documento do corredor| RE
       RE -.->|a cena, ou null| S
       S -.->|a cena, ou null| C
       C -.->|200 com a cena, ou 404 com o erro| B
   ```

   Na ida, o pedido desce do browser às rotas, ao controller, ao service, ao repository e ao Atlas. Na volta, a cena sobe até ao controller, que responde com ela em JSON. Quando o código não existe, o repository devolve `null`, e é o controller que decide o 404.

   | Camada | O que faz no pedido `GET /api/cenas/corredor` |
   | --- | --- |
   | Rotas | Escolhem a função do controller que trata `/api/cenas/:codigo` |
   | Controller | Lê o `codigo` do pedido, pede a cena ao service e escolhe a resposta: 200 com a cena, ou 404 com o erro |
   | Service | Aplica as regras do jogo. Neste pedido não há nenhuma, e passa o pedido ao repository |
   | Repository | Procura no Atlas, com o Mongoose, a cena com o código `corredor`, e devolve-a, ou devolve `null` |
   | Atlas | Guarda as cenas e devolve o documento do corredor |

4. Compara com a fase 4. Os sete passos do pedido são os mesmos, e o que muda é onde fica cada bocado de código. Hoje, está tudo na função da rota, no `server.js`.

### Paragem 6

Tens em papel o desenho das camadas do pedido de uma cena, e sabes dizer o que cada camada faz. É o fim do passo 1.

Pensa antes de continuares: qual é a única camada que sabe que as cenas estão no MongoDB? A resposta: o repository. O controller e o service pedem uma cena e recebem uma cena, ou `null`, sem saberem de onde ela veio. Se um dia as cenas passarem para outra base de dados, só o repository muda.

## Se alguma coisa falhar

1. Estás na pasta certa? No terminal, `pwd` mostra a pasta atual (no Windows, na linha de comandos clássica, `cd`, sem mais nada). Tem de ser a `fechado-na-escola`, onde está o `package.json`. Se não for, entra nela com `cd fechado-na-escola`.
2. Guardaste o ficheiro? O editor só grava quando guardas, e o `--watch` só volta a arrancar o servidor depois de guardares.
3. O servidor está ligado? O terminal tem de mostrar `Fechado na escola em http://localhost:3000`. Se o paraste com Ctrl+C, arranca-o outra vez com `npm run dev`.
4. O ficheiro está igual ao do laboratório? A pasta [fechado-na-escola-passo-01](../../exemplos/acesso-a-dados/fechado-na-escola-passo-01/README.md), nos exemplos, tem todos os ficheiros como devem ficar. Compara com ela o ficheiro que falha.
5. O que diz a mensagem de erro? Procura a linha que diz o tipo do erro, ou a que começa por `node:` ou por `npm error`, e o problema com o mesmo sintoma, aqui por baixo.

### O npm não corre na PowerShell do Windows

Aparece uma mensagem a dizer que o ficheiro `npm.ps1` não pode ser carregado, porque a execução de scripts está desativada. Não mudes a regra do Windows. Usa a linha de comandos clássica: no painel do terminal do Visual Studio Code, carrega na seta ao lado do "+" e escolhe "Command Prompt". Também podes escrever `npm.cmd` em vez de `npm`.

### O ficheiro ficou com .txt no fim

No Windows, o ficheiro fica `.env.txt`, `.env.example.txt` ou `.gitignore.txt`. O Node não encontra o `.env`, e o Git não lê o `.gitignore`. Muda o nome no editor de código, que mostra o nome completo.

### cp não é reconhecido como comando

Estás na linha de comandos clássica do Windows. Usa `copy .env.example .env`. Na PowerShell, o `cp` funciona.

### node: .env: not found

O `--env-file=.env` procura o `.env` na raiz do projeto, porque o npm corre os scripts sempre na pasta do `package.json`, mesmo que estejas dentro da `src`. Ou o ficheiro não existe, ou está dentro da `src`, ou ficou com `.txt` no fim. O `.env`, o `.env.example` e o `.gitignore` ficam todos ao lado do `package.json`.

### npm dev não funciona

Aparece `Unknown command: "dev"`. Falta o `run`: o comando é `npm run dev`. Se a mensagem for `Missing script: "dev"`, o script não está no `package.json`, ou o nome está mal escrito. O `npm run`, sozinho, mostra os scripts que existem.

### O seed falhou: falta a MONGODB_URI no ficheiro .env

O servidor escreve o mesmo, a começar por `Não foi possível ligar à base de dados`. A linha `MONGODB_URI=` do `.env` está vazia, ou não existe. Volta ao passo 5 da fase 2, e confirma que puseste a cadeia no `.env`, e não no `.env.example`.

### O seed ou o servidor ficam parados uns 30 segundos

O Mongoose tenta ligar-se durante 30 segundos e depois desiste, com uma mensagem que começa por `Could not connect to any servers in your MongoDB Atlas cluster`. A causa mais comum é o Atlas não ter autorizado o endereço IP da rede onde estás, o que acontece quando mudas de rede, como em casa.

Para o autorizar, no Atlas, no menu lateral, na secção "Security", abre "Database & Network Access" e "IP Access List". Carrega em "Add IP Address", escolhe o endereço atual (current IP address) e carrega em "Confirm". Não autorizes `0.0.0.0/0`, que deixa qualquer computador da internet tentar entrar.

Depois de autorizares o endereço, corre outra vez o `npm run seed`. Se era o servidor, ele escreveu `Failed running 'src/server.js'` e está à espera de que guardes um ficheiro: para-o com Ctrl+C e arranca-o com `npm run dev`.

### O erro fala em querySrv

Aparece, logo, uma mensagem como `O seed falhou: querySrv ENOTFOUND` seguida de um endereço. O computador não encontrou o endereço do teu cluster: ou não há internet, ou a parte da cadeia de ligação depois do `@` ficou mal copiada. Confirma a rede e volta a copiar a cadeia do Atlas, como no passo 5 da fase 2.

### bad auth : authentication failed

O Atlas recusou o utilizador ou a palavra-passe da cadeia de ligação. Confirma que trocaste o marcador da palavra-passe, com os `<` e `>` incluídos, e que usaste o utilizador da base de dados, e não o da tua conta no Atlas.

### O erro diz Password contains unescaped characters, ou Invalid connection string

Aparece logo, como `O seed falhou: Password contains unescaped characters`, `Invalid connection string` ou `mongodb+srv URI cannot have port number`. A palavra-passe tem um sinal que parte a cadeia de ligação, como `@`, `:`, `/` ou `#`. Cria no Atlas uma palavra-passe nova, só com letras e algarismos, como em [A palavra-passe da base de dados ficou no sítio errado](02-modelo-documental-e-consultas-no-atlas-laboratorio.md#a-palavra-passe-da-base-de-dados-ficou-no-sítio-errado). Põe-na no `.env` e corre outra vez o seed.

### A lista das cenas vem vazia, e nenhuma cena existe

O `/api/cenas` dá `[]`, e o `/api/cenas/inicio` dá 404. O servidor ligou-se a uma base sem cenas. Vê no terminal a primeira linha do arranque, que diz a que base se ligou. Tem de ser `fechado-na-escola`. Se for outra, corrige o `DB_NAME` no `.env`. Se for essa, corre o `npm run seed`.

### A porta 3000 está ocupada

O servidor escreve `Ligada à base de dados fechado-na-escola` e depois `Não foi possível ligar o servidor: listen EADDRINUSE: address already in use :::3000`. A porta já está a ser usada por outro servidor, por exemplo o do cinema da escola. O jogo não termina, mas também não responde. Para o outro servidor com Ctrl+C, no terminal onde ele está a correr. Depois, para também este e volta a arrancá-lo com `npm run dev`.

### fatal: not a git repository

Quer dizer "não é um repositório do Git". Correste um comando do Git fora da pasta do projeto, ou antes do `git init`. Confirma em que pasta estás e entra na `fechado-na-escola`.

### Please tell me who you are, ou Your name and email address were configured automatically

O Git recusou o commit, porque não sabe o teu nome. Faz o passo 7 da fase 1 e repete o commit. Noutros computadores, o Git não recusa: faz o commit com o nome da conta do computador, escreve `Your name and email address were configured automatically` e sugere um comando com `--global`. Nos computadores da escola, não o uses. Faz o passo 7 da fase 1, e os commits seguintes já levam o teu nome.

### O .env aparece no git status, ou foi para um commit

Não faças mais nada no Git e chama o professor. Se o `.env` só aparece na lista, o `.gitignore` não está a funcionar, e corrige-se antes do `git add`. Confirma que o ficheiro se chama `.gitignore`, sem `.txt`, e que está ao lado do `package.json`. Se o `.env` já foi num commit com a cadeia de ligação, a palavra-passe fica no histórico. Muda-a no Atlas, como em [A palavra-passe da base de dados ficou no sítio errado](02-modelo-documental-e-consultas-no-atlas-laboratorio.md#a-palavra-passe-da-base-de-dados-ficou-no-sítio-errado).

## Desafios

1. O mapa da história. Desenha em papel o mapa das onze cenas, com uma caixa por cena e uma seta por escolha, da cena até ao destino. Faz o mapa a partir das respostas da API, e não do `seed.js`. Depois, descobre no mapa o caminho mais curto do `inicio` até ao final em que sais da escola sem que ninguém dê por ti. E responde: uma partida pode não acabar nunca? Pista: o `/api/cenas` dá-te todas as cenas de uma vez, cada uma com o `codigo` e o `destino` das suas escolhas.

2. A história verificada. O MongoDB não confirma que o destino de uma escolha é o código de uma cena que existe. Escreve um programa, `src/verificar-historia.js`, que lê as cenas da base e escreve no terminal cada escolha com um destino que não existe, e a cena onde ela está. Quando não houver nenhuma, escreve que a história está certa. Corre-o com `node --env-file=.env src/verificar-historia.js`. Para o testares, muda no `seed.js` o destino de uma escolha para um código que nenhuma cena tem, e corre o seed e o teu programa. No fim, repõe o destino e volta a correr o seed. Quando o programa funcionar, guarda-o num commit só dele, com `git add src/verificar-historia.js` e `git commit -m "Desafio: verificar a história"`, para o `git status` do passo seguinte começar limpo. Pista: o programa liga-se e desliga-se como o seed, e uma lista com o código de todas as cenas diz-te se um destino existe.

## Antes de terminares

- [ ] O `npm run` mostra os scripts `start`, `dev` e `seed`.
- [ ] O `npm run seed` escreve `Inseridas 11 cenas`, e vês as onze cenas no Data Explorer do Atlas.
- [ ] O `npm run dev` escreve a base a que se ligou e o endereço do servidor, e `/api/cenas/inicio` mostra a primeira cena.
- [ ] Jogaste uma partida até uma cena com `"final":true`.
- [ ] Viste os dois erros provocados, a cadeia de ligação em falta e a base com o nome errado, e o `DB_NAME` voltou a `fechado-na-escola`.
- [ ] No separador "Rede", encontraste o método, o código, o `Content-Type` e o Remote Address do pedido de uma cena.
- [ ] O servidor está parado.
- [ ] O `git log --oneline` mostra o primeiro commit, o `git status` diz que não há nada para guardar, e o `.env` não está no commit.
- [ ] Desenhaste em papel as camadas do pedido de uma cena, com o que cada uma faz.
- [ ] Consegues explicar, por palavras tuas, o pedido de uma cena, desde que escreves o endereço no browser até veres a resposta. E sabes dizer porque é que a palavra-passe do Atlas nunca chega ao browser.

![Rodapé](../../imagens/rodape.png)
