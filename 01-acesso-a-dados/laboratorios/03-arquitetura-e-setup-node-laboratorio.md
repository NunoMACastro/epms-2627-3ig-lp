![Cabeçalho](../../imagens/cabecalho.png)

# Laboratório: arquitetura e setup Node

Laboratório do tema Arquitetura e setup Node, do módulo M14, Acesso a Bases de Dados. É o passo 1 do jogo Fechado na escola, o projeto que vais construir, um passo de cada vez, nos laboratórios de Linguagens de Programação e de Sistemas de Informação. Começas numa pasta vazia e acabas com as cenas do jogo no MongoDB Atlas, uma API que as mostra e o primeiro commit. Cada passo diz o que fazer, porquê e o que deves ver. Avanças ao teu ritmo: o que não acabares na aula, acabas em casa ou na aula seguinte. Tudo o que precisas está aqui; o [guia do tema](../03-arquitetura-e-setup-node.md) tem a teoria completa, para quem quiser saber mais.

Quase tudo o que vais fazer já o fizeste no cinema da escola, noutro projeto: o `npm init`, os scripts, a ligação com o Mongoose, o modelo e o seed. O laboratório dá também por sabido o HTTP de Sistemas de Informação: o pedido e a resposta, os códigos de estado, os parâmetros de rota e o middleware. Por isso, cada passo explica pouco e pede-te muitas previsões. Prevês de cabeça, corres e comparas com o que o laboratório diz que deves ver.

## O que vais construir

Fechado na escola é um jogo de aventura por escolhas. Adormeceste a estudar na biblioteca e acordas às 22:40, com a escola fechada e às escuras. Cada cena conta um bocado da história e dá-te uma, duas ou três escolhas. Cada escolha leva a outra cena, até chegares a um final: ou sais da escola, ou alguém te encontra lá dentro.

Cada cena é um documento do MongoDB, com as escolhas lá dentro. Neste passo, o jogo ainda não tem páginas. As onze cenas ficam no teu cluster do Atlas, e a API responde com elas em JSON, no browser. No fim, a pasta do projeto fica assim:

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

Ficas a saber preparar, de raiz, um projeto Node que se guarda no Git e se instala noutro computador sem levar a palavra-passe. E ficas a saber explicar um pedido do browser até à base de dados e de volta.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| Preparar o projeto | A pasta, o npm e o `package.json` | O `npm run` mostra os três scripts |
| 1 | O `.env`, o `.env.example`, o Git e o `.gitignore` | O Git vê o projeto, sem o `.env` nem a `node_modules` |
| 2 | A cadeia de ligação, a ligação, o modelo e o seed | As onze cenas no Atlas |
| 3 | O `src/server.js` | A API responde com as cenas, e jogas uma partida no browser |
| 4 | Nada: segues um pedido no browser e no terminal | O pedido de uma cena, explicado passo a passo |
| 5 | O primeiro commit | O projeto no Git, sem a palavra-passe |
| 6 | Nada no computador: desenhas em papel as camadas do passo 2 | O desenho do pedido de uma cena, camada a camada |

O passo 2, no tema seguinte, parte deste projeto. Divide a API em camadas e acrescenta a rota que leva de uma escolha à cena seguinte.

## Palavras que vais usar

- `package.json`: a ficha de identidade do projeto, com o nome, os pacotes de que precisa e os scripts.
- Script: um nome curto para um comando, na secção `scripts` do `package.json`. Corre-se com `npm run` seguido do nome, como `npm run dev`. Para saber mais, vê a secção "Preparar um projeto Node" do [guia](../03-arquitetura-e-setup-node.md).
- Variável de ambiente: um par nome e valor que o programa recebe quando arranca, e que o código lê em `process.env`, como `process.env.PORT`.
- `.env`: o ficheiro com as variáveis de ambiente deste computador, uma por linha, como `PORT=3000`. Pode ter segredos, por isso nunca vai para o Git. Para saber mais, vê a secção "Configuração fora do código: o .env" do [guia](../03-arquitetura-e-setup-node.md).
- `.env.example`: os mesmos nomes do `.env`, sem segredos e com comentários. Vai para o Git, para quem descarregar o projeto saber o que tem de configurar.
- Cadeia de ligação: o endereço que leva o servidor ao teu cluster no Atlas, começado por `mongodb+srv://`. Tem lá dentro o utilizador e a palavra-passe da base de dados, e por isso é um segredo.
- Mongoose: a biblioteca de JavaScript com que o servidor fala com o MongoDB.
- Schema e modelo: o schema descreve, campo a campo, a forma dos documentos de uma coleção. O modelo, feito a partir do schema, é o que o código usa para ler e escrever nessa coleção.
- Documento embutido: um documento guardado dentro de outro, como cada escolha dentro da sua cena. Para saber mais, vê a secção "A informação relacionada embute-se ou referencia-se" do [guia do tema 02](../02-modelo-documental-e-consultas-no-atlas.md).
- Seed: um programa que põe na base os dados de que a aplicação precisa para começar. Em inglês, seed quer dizer semente.
- API: o servidor que responde aos pedidos com dados, em JSON, e não com páginas.
- Rota de estado: uma rota que só responde que o servidor está ligado, como `GET /api/estado`.
- Parâmetro de rota: a parte variável de um caminho, como o `:codigo` em `/api/cenas/:codigo`. O código lê-a em `req.params`.
- Middleware: uma função por onde passam os pedidos, pela ordem em que está escrita no ficheiro. Pode responder ao pedido, ou passá-lo à frente com `next()`.
- Git e commit: o Git guarda o histórico do projeto. Um commit é uma fotografia dos ficheiros, guardada com uma mensagem e a data. Para saber mais, vê a secção "O mínimo de Git" do [guia](../03-arquitetura-e-setup-node.md).
- `.gitignore`: o ficheiro que diz ao Git o que ignorar. Para saber mais, vê a secção "O que vai para o Git: o .gitignore" do [guia](../03-arquitetura-e-setup-node.md).
- Repositório: a pasta de um projeto com o histórico do Git, guardado na pasta escondida `.git`. Em inglês é repository, a palavra que o Git escreve no ecrã.

## O que precisas

- O Node.js, que corre o servidor e o seed. Confirma que o tens com `node --version`. Deve aparecer um número de versão começado por `v`, como `v26.11.1`, a versão com que este laboratório foi ensaiado. O primeiro número tem de ser 22 ou maior, porque as opções dos scripts precisam dele.
- O npm, que vem com o Node e instala os pacotes. Confirma com `npm --version`; deve aparecer um número de versão, como `11.20.0`.
- O Git, que guarda o histórico do projeto. Confirma com `git --version`; deve aparecer `git version` seguido de um número. Se disser que o comando não existe, chama o professor.
- O Visual Studio Code, ou outro editor de código, com um terminal. No Visual Studio Code, o terminal abre-se no menu "Terminal", com "New Terminal" ("Novo Terminal", com o editor em português).
- A tua conta no MongoDB Atlas, com o cluster e o utilizador da base de dados que criaste na fase 1 do [laboratório do tema 02](02-modelo-documental-e-consultas-no-atlas-laboratorio.md). Precisas também da palavra-passe desse utilizador. O Atlas só aceita ligações dos endereços IP autorizados. Na escola, é o que autorizaste nessa fase. Para trabalhares em casa, acrescentas o endereço de casa na lista de acesso por endereço IP, na secção de segurança do menu lateral.
- Internet, para o `npm install` e, da fase 2 em diante, para o Atlas.
- O browser, com as ferramentas de programador, que se abrem com F12, ou com Cmd+Option+I no Mac. O separador "Rede" ("Network", com o browser em inglês) mostra cada pedido.

## Se alguma coisa falhar

1. Estás na pasta certa? No terminal, `pwd` mostra a pasta atual (no Windows, na linha de comandos clássica, `cd`, sem mais nada). Tem de ser a `fechado-na-escola`, onde está o `package.json`. Se não for, entra nela com `cd fechado-na-escola`.
2. Guardaste o ficheiro? O editor só grava quando guardas, e o `--watch` só volta a arrancar o servidor depois de guardares.
3. O servidor está ligado? O terminal tem de mostrar `Fechado na escola em http://localhost:3000`. Se o paraste com Ctrl+C, arranca-o outra vez com `npm run dev`.
4. O que diz a mensagem de erro? Procura primeiro a linha que diz o tipo do erro, ou a que começa por `node:` ou por `npm error`. Os casos mais comuns estão nos [problemas frequentes](#problemas-frequentes).
5. O ficheiro está igual ao do laboratório? Neste laboratório, cada ficheiro escreve-se uma só vez, completo. A pasta [fechado-na-escola-passo-01](../../exemplos/acesso-a-dados/fechado-na-escola-passo-01/README.md), nos exemplos, tem todos os ficheiros como devem ficar. Compara com ela o ficheiro que falha.

## Preparar o projeto

1. Cria a pasta do projeto e abre-a no editor. Na tua pasta de trabalho de Linguagens de Programação, cria uma pasta chamada `fechado-na-escola`. Tem de ficar fora de qualquer outro projeto, e também fora da pasta dos materiais da disciplina, que tem o seu próprio Git. Abre-a no Visual Studio Code, no menu "File", com "Open Folder" ("Ficheiro", "Abrir Pasta"). Depois abre o terminal, que fica já dentro da pasta, e confirma com `pwd` (no Windows, na linha de comandos clássica, `cd`).

   O que deves ver: o caminho da pasta, a acabar em `fechado-na-escola`. O nome da pasta conta, porque o npm vai dá-lo ao projeto.

2. Cria o projeto e instala os dois pacotes. Antes de correres, prevê: que ficheiros e pastas vão aparecer na pasta?

   ```bash
   npm init -y
   npm install express mongoose
   ```

   O que deves ver: o `npm init -y` escreve `Wrote to`, o caminho do `package.json` que criou e o conteúdo dele. O `npm install` escreve várias linhas, e pelo meio aparece uma como `added 83 packages, and audited 84 packages in 3s`. As linhas do `funding` e o `found 0 vulnerabilities` podem ignorar-se. Na pasta, aparecem o `package.json`, que é do `npm init`, e a `node_modules` e o `package-lock.json`, que são do `npm install`. O Express é o servidor, e o Mongoose fala com o MongoDB. Os comandos são os mesmos no Windows.

3. Abre o `package.json` e substitui o conteúdo todo por este:

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

   Leitura guiada: compara-o com o que o `npm init -y` escreveu. Mudaram quatro coisas. A `description` diz o que é o projeto. O `main` diz qual é o ficheiro principal, que vai ser o `src/server.js`. O `"type": "module"` deixa usar o `import` e o `export`. E o `test`, que só dava erro, deu lugar a três scripts. O `start` é o arranque noutro computador, onde a configuração vem do sistema. O `dev` é o que usas enquanto desenvolves: lê o `.env`, com o `--env-file`, e volta a arrancar o servidor sempre que guardas um ficheiro, com o `--watch`. O `seed` põe as cenas na base, também com o `.env`. A secção `dependencies` escreveu-a o `npm install`.

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

   Isto quer dizer que o npm leu o `package.json` e encontrou os três scripts. O `start` aparece à parte porque é um nome que o npm já conhece, e por isso corre-se também com `npm start`, sem o `run`. Se o npm escrever um erro sobre o `package.json`, volta a copiar o bloco inteiro: falta-lhe ou sobra-lhe algum carácter.

## Fase 1: o segredo fora do Git

Daqui a pouco, o `.env` vai ter a palavra-passe da tua base de dados. O Git guarda o que lhe pedires, e um `git add .` pede-lhe tudo o que está na pasta. Por isso, num projeto novo, a primeira coisa a fazer é dizer ao Git o que ele nunca deve guardar, no `.gitignore`, e confirmar no `git status` que ele obedece. Nesta fase fazes isso enquanto o `.env` ainda não tem segredo nenhum. Assim, vês o perigo sem correr nenhum risco. Para saber mais, lê as secções "O mínimo de Git" e "O que vai para o Git: o .gitignore" do [guia](../03-arquitetura-e-setup-node.md).

1. Na raiz do projeto, ao lado do `package.json`, cria o ficheiro `.env.example` com este conteúdo. Cria-o no editor de código, porque o Bloco de Notas do Windows pode acrescentar `.txt` ao nome sem o mostrar.

   ```text
   # Porta onde o jogo escuta. Muda-a se a 3000 estiver ocupada.
   PORT=3000

   # Ligação ao MongoDB Atlas, no formato mongodb+srv://utilizador:palavra-passe@...
   # O endereço verdadeiro escreve-se só no .env. No .env.example, esta linha fica vazia.
   MONGODB_URI=

   # Nome da base de dados no Atlas. A cadeia de ligação não o diz.
   DB_NAME=fechado-na-escola
   ```

   Leitura guiada: são três variáveis, uma por linha, no formato `NOME=valor`, e as linhas que começam por `#` são comentários. A `MONGODB_URI` fica vazia, porque este ficheiro vai para o Git. O `DB_NAME` existe porque a cadeia de ligação te leva ao cluster, e um cluster pode ter várias bases de dados.

2. Cria o `.env` como cópia do `.env.example`:

   ```bash
   cp .env.example .env
   ```

   No Windows, na linha de comandos clássica, o comando é `copy .env.example .env`. O que deves ver: nenhuma mensagem, e o `.env` na lista de ficheiros do editor. Por agora, os dois ficheiros são iguais.

3. Começa o histórico do Git nesta pasta:

   ```bash
   git init
   ```

   O que deves ver: `Initialized empty Git repository in`, seguido do caminho da pasta e de `.git/`. O Git criou o repositório na pasta escondida `.git`. Antes disso, pode escrever umas linhas de sugestão, começadas por `hint:`, sobre o nome do ramo principal. O ramo é a linha do histórico, onde os commits ficam uns a seguir aos outros, e o principal chama-se `main` ou `master`. Podes ignorar as linhas `hint:`.

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

   O `??` quer dizer "ficheiro novo, que o Git ainda não segue". Na lista estão o `.env` e a `node_modules/`. Se fizesses agora `git add .`, os dois iam para o próximo commit, e daqui a pouco o `.env` levava a palavra-passe. Não faças nenhum `git add` antes da fase 5.

5. Na raiz do projeto, cria o ficheiro `.gitignore` com este conteúdo, e guarda:

   ```text
   # Dependências: recriam-se com npm install.
   node_modules/

   # Configuração local e segredos: nunca vão para o Git.
   .env
   ```

   Leitura guiada: cada linha que não é um comentário é uma regra. O `node_modules/` ignora a pasta inteira. O `.env` ignora esse ficheiro, e só esse: o `.env.example` tem outro nome, e por isso o Git continua a vê-lo.

6. Volta a correr `git status --short`. O que deves ver:

   ```text
   ?? .env.example
   ?? .gitignore
   ?? package-lock.json
   ?? package.json
   ```

   O `.env` e a `node_modules/` desapareceram da lista, e o `.gitignore` entrou nela. O `.env` continua na pasta, e o servidor vai lê-lo. O Git é que passou a agir como se ele não existisse. Se o `.env` ou a `node_modules/` ainda aparecerem, confirma que o ficheiro se chama `.gitignore`, sem `.txt`, e que está ao lado do `package.json`.

7. Diz ao Git quem és, só neste projeto, para ele pôr o teu nome em cada commit. Sem o `--global`, a configuração fica nesta pasta. Assim, nos computadores da escola, que são partilhados, não passa para quem usar o computador a seguir.

   ```bash
   git config user.name "O teu nome"
   git config user.email "o teu email da escola"
   ```

   Troca o texto entre aspas pelo teu nome e pelo teu email. O que deves ver: nenhuma mensagem.

### Paragem 1

O Git segue a pasta do projeto, e o `git status --short` não mostra o `.env` nem a `node_modules/`.

Pensa antes de continuares: neste momento, o `.env.example` e o `.env` são iguais. O que vai ser diferente entre os dois no fim da fase 2? A resposta: o `.env` vai ter, na linha `MONGODB_URI=`, a cadeia de ligação do teu cluster, com a palavra-passe. O `.env.example` continua com a linha vazia, porque vai para o Git.

## Fase 2: as cenas na base de dados

Cada cena do jogo é um documento da coleção `cenas`, com o código que a identifica, como `corredor`, o título, o texto e as escolhas. Cada escolha tem o texto que o jogador lê e o destino, que é o código da cena para onde a escolha leva. As escolhas ficam embutidas na cena, numa lista dentro do documento. Uma escolha só faz sentido dentro da sua cena, mostra-se sempre com ela e nunca se procura sozinha. É a decisão de embutir, do tema 02.

Para pôr as cenas na base, fazes o mesmo que no cinema. A ligação do Mongoose fica num ficheiro próprio, e há um modelo e um seed que apaga as cenas e volta a inseri-las. Para saber mais sobre embutir, lê a secção "A informação relacionada embute-se ou referencia-se" do [guia do tema 02](../02-modelo-documental-e-consultas-no-atlas.md).

1. Cria o ficheiro `src/db/mongoose.js` com este conteúdo. No explorador do Visual Studio Code, no botão de ficheiro novo, podes escrever o caminho inteiro, `src/db/mongoose.js`, e o editor cria as pastas que faltam.

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

   Leitura guiada: o ficheiro exporta uma só função, a `ligarBaseDeDados`, que o seed e o servidor vão chamar. Primeiro confirma que a cadeia de ligação existe. Depois liga-se, com o nome da base que vem do `.env`. Por fim, escreve a que base se ligou. A função é `async`, porque ligar a um servidor que está noutro sítio demora, e o `await` espera pela resposta do Atlas. A promessa de que fala o comentário é o que uma função `async` devolve, o resultado que há de chegar. Quem a chama espera por ele com o `await`, e um `throw` lá dentro chega ao `catch` de quem chamou.

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

   Leitura guiada: lê-o de baixo para cima. A última linha cria o modelo `Cena`, que o resto do jogo usa para ler e escrever na coleção `cenas`. O nome da coleção vai escrito à mão, porque o plural que o Mongoose inventaria segue as regras do inglês. Por cima, o `cenaSchema` tem um campo por cada dado da cena. O campo `escolhas` é uma lista: os parênteses retos à volta do `escolhaSchema` dizem que cada elemento tem a forma de uma escolha. É assim que um schema descreve uma lista de documentos embutidos.

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

   Leitura guiada: o ficheiro tem duas partes. Em cima, a lista `cenas`, com as onze cenas da história, cada uma com os campos do schema. Em baixo, o programa: liga-se com a função do `mongoose.js`, apaga todas as cenas com o `deleteMany`, insere as onze com o `insertMany` e, no fim, fecha a ligação. Repara no `destino` de cada escolha. É sempre o `codigo` de outra cena da lista, e o MongoDB não confirma que esse código existe. Quem o garante é quem escreve a história.

4. Provoca um erro de propósito, antes de pores a cadeia de ligação no `.env`. Prevê: o que escreve o seed, com a `MONGODB_URI` vazia?

   ```bash
   npm run seed
   ```

   O que deves ver: as duas linhas do npm, `> fechado-na-escola@1.0.0 seed` e o comando, e depois `O seed falhou: falta a MONGODB_URI no ficheiro .env`. O `--env-file` leu o `.env`, mas a linha da `MONGODB_URI` não tem nada. A função de ligação recusou-se a continuar, com o `throw`, e o `catch` do seed escreveu a razão.

5. Põe a cadeia de ligação no `.env`. No Atlas, carrega em "Connect" (ligar) no teu cluster e escolhe a ligação por "Drivers". Copia a cadeia que começa por `mongodb+srv://` para a linha `MONGODB_URI=` do `.env`, logo a seguir ao `=` e sem espaços. Troca o marcador da palavra-passe, a parte entre `<` e `>`, com os dois sinais incluídos, pela palavra-passe do utilizador da base de dados. Se no teu ecrã os nomes forem outros, procura a opção que mostra a cadeia começada por `mongodb+srv://`. Guarda o `.env`.

   A cadeia leva ao teu cluster, por isso é a mesma em todos os teus projetos ligados a ele. O que muda de projeto para projeto é o `DB_NAME`. A partir deste momento, o `.env` tem um segredo. Não o copies para mais lado nenhum.

6. Corre o seed outra vez:

   ```bash
   npm run seed
   ```

   O que deves ver, depois das duas linhas do npm:

   ```text
   Ligada à base de dados fechado-na-escola
   Apagadas 0 cenas
   Inseridas 11 cenas
   ```

   No fim, o terminal fica pronto para outro comando. A coleção ainda não existia, por isso não havia nada para apagar. Se o seed ficar parado uns 30 segundos e acabar com um erro, ou se escrever `bad auth`, vê os [problemas frequentes](#problemas-frequentes).

7. Prevê: se correres o seed uma terceira vez, quantas cenas apaga, e com quantas fica a coleção? Depois, corre-o.

   O que deves ver: `Apagadas 11 cenas` e `Inseridas 11 cenas`. A coleção continua com onze cenas, e nunca com 22. É por apagar primeiro que o seed se pode correr as vezes que for preciso.

8. No Atlas, abre o "Data Explorer" (explorador de dados), a base `fechado-na-escola` e a coleção `cenas`. São os nomes que usaste no laboratório do tema 02. Se não vires a base, carrega no botão de atualizar do explorador.

   O que deves ver: as onze cenas. Cada uma tem o `_id` que o MongoDB lhe deu e um campo `__v`, com o valor 0, que é do Mongoose e podes ignorar. As escolhas aparecem dentro da cena, numa lista, cada uma só com o `texto` e o `destino`, sem `_id`.

### Paragem 2

As onze cenas estão na coleção `cenas` do teu cluster, e o seed pode correr outra vez sem as repetir.

Pensa antes de continuares: imagina que mudavas o título de uma cena no `seed.js` e voltavas a correr o seed. Na base, ficava o título antigo, o novo, ou os dois? A resposta: só o novo. O seed apaga todas as cenas e insere as do ficheiro, por isso a coleção fica sempre igual à lista `cenas` do `seed.js`. Serve para dados de exemplo, como estes. Numa base com dados verdadeiros, como as partidas dos jogadores, um `deleteMany({})` apagava-os todos.

## Fase 3: a API das cenas

Agora o servidor vai buscar as cenas à base e responde com elas em JSON. Tem três rotas: a de estado, a lista das cenas e uma cena pelo código. O código chega no endereço, como parâmetro de rota, e procura-se no campo `codigo`, e não no `_id`. As escolhas apontam umas para as outras pelo código, e por isso é ele que o jogo usa. Antes das rotas fica o middleware de registo, que escreve cada pedido no terminal. Depois delas fica o middleware final, para os pedidos a que nenhuma rota respondeu. E o servidor só começa a aceitar pedidos depois de se ligar à base.

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

   Leitura guiada: lê-o de cima para baixo. É a ordem por que o Node o executa quando arranca, e é também a ordem por que cada pedido passa pelo middleware e pelas rotas. Primeiro os `import`, com a ligação e o modelo que escreveste na fase 2. Depois a `app` e a porta. A seguir vêm o middleware de registo, as três rotas e o middleware final. As duas rotas das cenas são `async`, porque perguntam à base e esperam pela resposta com o `await`. No fim, o arranque: a ligação à base primeiro, e só depois o `app.listen`. Se a ligação falhar, o `process.exit(1)` termina o programa, com um código que quer dizer "acabou com erro".

2. Arranca o servidor. Antes de correres, prevê: que linhas vai escrever, e por que ordem?

   ```bash
   npm run dev
   ```

   O que deves ver, depois das duas linhas do npm:

   ```text
   Ligada à base de dados fechado-na-escola
   Fechado na escola em http://localhost:3000
   ```

   Primeiro a ligação, e só depois o servidor, pela ordem do arranque. O servidor fica a correr neste terminal, e para o parar carregas em Ctrl+C. Por agora, deixa-o ligado.

3. Prevê o código e a resposta de cada pedido da tabela. Depois, abre cada um no browser, com `http://localhost:3000` seguido do caminho, e confirma o código no separador Rede das ferramentas de programador. Os nomes que este laboratório dá aos separadores e aos campos das ferramentas de programador são os do Chrome.

   | Pedido | Código | Resposta |
   | --- | --- | --- |
   | `/api/estado` | 200 | `{"estado":"ok","aplicacao":"Fechado na escola"}` |
   | `/api/cenas` | 200 | A lista das onze cenas, cada uma com o `_id` e o `__v` |
   | `/api/cenas/inicio` | 200 | A cena com o título "A biblioteca às escuras" e duas escolhas |
   | `/api/cenas/sala-13` | 404 | `{"erro":"Não existe a cena sala-13"}` |
   | `/api/cena/inicio` | 404 | `{"erro":"Rota não encontrada"}` |

   Os dois 404 vêm de sítios diferentes. O `/api/cenas/sala-13` chegou à rota das cenas, que perguntou à base e recebeu uma lista vazia. O `/api/cena/inicio`, sem o `s`, não corresponde a nenhuma rota, e quem lhe responde é o middleware final, sem ir à base. No terminal, o middleware de registo escreve uma linha por pedido, como `GET /api/cenas/inicio`. Pode aparecer também `GET /favicon.ico`: é o browser a pedir o ícone do separador, e o middleware final responde-lhe com 404.

4. Joga uma partida. Abre `/api/cenas/inicio` e lê as escolhas. Escolhe uma e abre `/api/cenas/` seguido do `destino` dela, como `/api/cenas/corredor`. Continua assim, cena a cena.

   O que deves ver: ao fim de algumas cenas, uma cena com `"final":true` e sem escolhas, com `"escolhas":[]`. A partida acabou. Há quatro finais, e só num deles sais da escola sem que ninguém dê por ti. É o jogo a funcionar, ainda sem páginas. No passo 2, a API passa a ter uma rota que faz por ti o salto de uma escolha para a cena seguinte.

5. Provoca um erro de propósito, desta vez sem mensagem de erro nenhuma. Com o servidor ligado, abre o `.env`, muda `DB_NAME=fechado-na-escola` para `DB_NAME=fechado-na-escol`, sem o `a` do fim, e guarda. Prevê: o servidor volta a arrancar? E o que respondem `/api/cenas` e `/api/cenas/inicio`?

   O que deves ver: o `--watch` deu pela mudança do `.env`. Limpa o ecrã do terminal e escreve primeiro `Change detected in`, com o caminho do `.env`, e `Restarting 'src/server.js'`. Só depois vêm `Ligada à base de dados fechado-na-escol` e a linha do arranque. Não há erro nenhum. O `/api/cenas` responde 200, com `[]`, e o `/api/cenas/inicio` responde 404, com `{"erro":"Não existe a cena inicio"}`. O servidor ligou-se a uma base que não existia, e ninguém o recusou. O Mongoose até a criou, com a coleção `cenas` vazia, porque cria a coleção de cada modelo que não encontra. A única pista é a linha do terminal que diz a que base o servidor se ligou.

6. Repõe `DB_NAME=fechado-na-escola` no `.env` e guarda. O que deves ver: o servidor volta a arrancar, ligado à base `fechado-na-escola`, e `/api/cenas/inicio` volta a mostrar a primeira cena. No Data Explorer do Atlas, depois de o atualizares, vês também a base `fechado-na-escol`, que o Mongoose criou. Podes deixá-la: está vazia, e o jogo não a usa.

### Paragem 3

A API responde com as cenas da base, e jogaste uma partida a pedir uma cena de cada vez.

Pensa antes de continuares: com a base errada, a lista das cenas veio com 200 e `[]`, e não com 404. Estava certo? A resposta: estava. O pedido era válido e a lista existe, só não tinha nenhuma cena. O 404 é para uma coisa que não existe, como a cena de um código que nenhuma tem. É por isso que a rota de uma cena verifica a lista vazia e escolhe o 404, e a rota da lista não o faz.

## Fase 4: o pedido, do browser à base de dados e de volta

Explicar um pedido é dizer, por ordem, quem faz o quê, onde corre e o que viaja, desde que escreves o endereço até veres a resposta. Neste projeto há três sítios: o browser, o servidor, que corre no teu computador, e o Atlas, na internet. O separador "Rede" das ferramentas de programador mostra o que viajou entre o browser e o servidor. O terminal mostra os pedidos que o servidor recebeu. Para saber mais, lê o passo 8 do exemplo guiado do [guia](../03-arquitetura-e-setup-node.md).

1. Com o servidor ligado, abre as ferramentas de programador (F12) e escolhe o separador "Rede". No topo do separador, marca "Disable cache" ("Desativar cache", com o browser em português). Sem isso, numa segunda visita, o browser pode mostrar o código 304, sem o `Content-Type`. O 304 quer dizer que o browser já tinha a resposta guardada. Depois, abre `http://localhost:3000/api/cenas/corredor`.

2. Na lista do separador Rede, clica no pedido `corredor`. Procura o método, o endereço completo, o código de estado e, nos cabeçalhos da resposta, o `Content-Type`. Procura também o "Remote Address" ("Endereço remoto", com o browser em português), que é o endereço do computador que respondeu.

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

   - no passo 1, o método e o endereço, no separador Rede;
   - no passo 2, a porta 3000 no Remote Address, e a linha `GET /api/cenas/corredor` no terminal;
   - no passo 3, o `codigo` da cena que veio na resposta, que é `corredor`;
   - nos passos 4 e 5, o texto do corredor, que só existe na base, porque o `server.js` não o tem;
   - no passo 6, o código 200 e o `application/json`, no separador Rede;
   - no passo 7, o JSON que o browser mostra, que é o corpo da resposta.

4. Pensa: no separador Rede, aparece algum pedido ao Atlas? A resposta: não. Há um só pedido, do browser ao servidor. Quem fala com o Atlas, nos passos 4 e 5, é o servidor, pela ligação que abriu quando arrancou. É por isso que a cadeia de ligação, com a palavra-passe, pode estar no `.env` do servidor. Nunca viaja para o browser, e ninguém a vê nas ferramentas de programador.

5. Abre `/api/cenas/sala-13`. Em que passo é que a história muda, e quem escolhe o 404? A resposta: no passo 5, o Atlas não encontra nenhuma cena com esse código e devolve uma lista vazia. No passo 6, a função vê a lista vazia e responde 404, com a mensagem da cena que não existe. Os passos 1 a 4 são iguais aos do corredor, porque o pedido foi mesmo à base.

### Paragem 4

Sabes dizer, por ordem, o que acontece num pedido de uma cena, onde corre cada passo e o que confirma cada um.

Pensa antes de continuares: e o pedido `/api/cena/inicio`, sem o `s`? Em que passo muda a história, e o Atlas chega a ser consultado? A resposta: muda no passo 3. O Express não encontra nenhuma rota para esse caminho, e o pedido segue até ao middleware final, que responde 404 com `{"erro":"Rota não encontrada"}`. Os passos 4 e 5 não acontecem, e o Atlas não é consultado.

## Fase 5: o primeiro commit

Um commit guarda a fotografia dos ficheiros que preparaste com o `git add`. Agora o `.env` tem a palavra-passe, e é aqui que o `.gitignore` da fase 1 conta. Antes de qualquer `git add`, confirmas no `git status` o que vai entrar. Depois do commit, o `git log` mostra o histórico, e o `git status` diz se ficou alguma coisa por guardar. O servidor pode continuar ligado. Para saber mais, lê a secção "O mínimo de Git" do [guia](../03-arquitetura-e-setup-node.md).

1. Vê o estado da pasta. Antes de correres, prevê: que ficheiros aparecem agora, e quais não podem aparecer?

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

2. Prepara e guarda o primeiro commit. O `git add .` prepara todos os ficheiros da pasta, menos os que o `.gitignore` manda ignorar. O `git commit -m` guarda a fotografia, com a mensagem que vem entre aspas.

   ```bash
   git add .
   git commit -m "Passo 1 do Fechado na escola: as cenas no Atlas e a API das cenas"
   ```

   O que deves ver: primeiro, uma linha que começa como `[main (root-commit) e421b9f]`, seguida da mensagem. O `main`, ou `master`, é o nome do ramo, a linha do histórico. O `root-commit` quer dizer que é o primeiro commit, e o `e421b9f` é o código curto dele, que no teu computador é outro. A seguir, `8 files changed` e uma linha `create mode 100644` por cada ficheiro guardado. São os oito ficheiros do projeto, quatro na raiz e quatro na `src`, e nenhum é o `.env`. Se o Git escrever `Please tell me who you are`, faz o passo 7 da fase 1 e repete o commit.

3. Confirma o histórico e o estado:

   ```bash
   git log --oneline
   git status
   ```

   O que deves ver: o `git log --oneline` mostra um commit, com o código curto à frente da mensagem. O `git status` diz `nothing to commit, working tree clean`, que quer dizer que não ficou nada por guardar. O `.env` continua na pasta, fora do histórico.

### Paragem 5

O projeto está no Git, com um commit, e o `.env` e a `node_modules` ficaram de fora. O código do passo 1 está acabado, e falta só o desenho que prepara o passo 2.

Pensa antes de continuares: um colega fez o `git add .` antes de criar o `.gitignore`, e o `.env`, já com a cadeia de ligação, foi no primeiro commit. Basta-lhe acrescentar agora o `.env` ao `.gitignore`? A resposta: não. O `.gitignore` só faz o Git ignorar o que ele ainda não guardou. O `.env` que foi no primeiro commit continua no histórico, e quem tiver acesso ao repositório pode lê-lo. A única correção segura é mudar no Atlas a palavra-passe desse utilizador. Por isso, primeiro o `.gitignore`, e só depois o primeiro commit.

## Fase 6: o desenho das camadas

No passo 2, o `server.js` deixa de fazer tudo sozinho e divide-se em camadas, cada uma num ficheiro e com uma só tarefa. Antes de escreveres esse código, desenhas o caminho que o pedido de uma cena vai fazer por elas. O desenho faz-se em papel, à mão, e é ele que guia o passo 2.

1. Desenha uma caixa para cada uma destas partes, de cima para baixo: o browser, as rotas, o controller, o service, o repository e o Atlas. Liga-as com setas, pela ordem em que o pedido `GET /api/cenas/corredor` passa por elas.

2. Junto de cada camada, do servidor, escreve numa linha o que ela faz neste pedido. Usa estas quatro ideias, uma por camada:

   - procurar a cena na base de dados;
   - ler o `codigo` do pedido e escolher a resposta, 200 ou 404;
   - escolher a função que trata o caminho;
   - aplicar as regras do jogo.

3. Desenha também as setas de volta, do Atlas até ao browser, e escreve em cada uma o que viaja: a cena, ou nada, quando o código não existe.

   Compara o teu desenho com este:

   | Camada | O que faz no pedido `GET /api/cenas/corredor` |
   | --- | --- |
   | Rotas | Escolhem a função do controller que trata `/api/cenas/:codigo` |
   | Controller | Lê o `codigo` do pedido, pede a cena ao service e escolhe a resposta: 200 com a cena, ou 404 com o erro |
   | Service | Aplica as regras do jogo. Neste pedido não há nenhuma, e passa o pedido ao repository |
   | Repository | Procura no Atlas, com o Mongoose, a cena com o código `corredor`, e devolve-a, ou devolve `null` |
   | Atlas | Guarda as cenas e devolve o documento do corredor |

   Na volta, a cena sobe do Atlas ao repository, do repository ao service e do service ao controller, que responde com ela em JSON. Quando o código não existe, o repository devolve `null`, e é o controller que decide o 404.

4. Compara com a fase 4. Os sete passos do pedido são os mesmos, e o que muda é onde fica cada bocado de código. Hoje, está tudo na função da rota, no `server.js`.

### Paragem 6

Tens em papel o desenho das camadas do pedido de uma cena, e sabes dizer o que cada camada faz. É o fim do passo 1. Guarda o desenho: no passo 2, vais escrever estas camadas, uma de cada vez, nesta mesma pasta.

Pensa antes de continuares: qual é a única camada que sabe que as cenas estão no MongoDB? A resposta: o repository. O controller e o service pedem uma cena e recebem uma cena, ou `null`, sem saberem de onde ela veio. Se um dia as cenas passarem para outra base de dados, só o repository muda.

## Problemas frequentes

### O npm não corre na PowerShell do Windows

Aparece uma mensagem a dizer que o ficheiro `npm.ps1` não pode ser carregado, porque a execução de scripts está desativada. Não mudes a regra do Windows. Usa a linha de comandos clássica (cmd), ou escreve `npm.cmd` em vez de `npm`.

### O ficheiro ficou com .txt no fim

No Windows, `.env.txt`, `.env.example.txt` ou `.gitignore.txt`. O Node não encontra o `.env`, e o Git não lê o `.gitignore`. Muda o nome no editor de código, que mostra o nome completo.

### cp não é reconhecido como comando

Estás na linha de comandos clássica do Windows. Usa `copy .env.example .env`. Na PowerShell, o `cp` funciona.

### node: .env: not found

O `--env-file=.env` procura o `.env` na pasta onde corres o comando, que tem de ser a raiz do projeto. Ou o ficheiro não existe, ou está dentro da `src`, ou ficou com `.txt` no fim. O `.env`, o `.env.example` e o `.gitignore` ficam todos ao lado do `package.json`.

### npm dev não funciona

Aparece `Unknown command: "dev"`. Falta o `run`: o comando é `npm run dev`. Se a mensagem for `Missing script: "dev"`, o script não está no `package.json`, ou o nome está mal escrito. O `npm run`, sozinho, mostra os scripts que existem.

### O seed falhou: falta a MONGODB_URI no ficheiro .env

O servidor escreve o mesmo, a começar por `Não foi possível ligar à base de dados`. A linha `MONGODB_URI=` do `.env` está vazia, ou não existe. Volta ao passo 5 da fase 2. Confirma também que a puseste no `.env`, e não no `.env.example`.

### O seed ou o servidor ficam parados uns 30 segundos e acabam com um erro de ligação

O Mongoose tenta ligar-se durante 30 segundos e depois desiste, e o terminal mostra a razão. Com o Atlas, as causas mais comuns são duas. Uma é o endereço IP da rede onde estás não estar autorizado no Atlas, o que acontece quando mudas de computador ou de rede. A outra é não haver internet.

### bad auth : authentication failed

O Atlas recusou o utilizador ou a palavra-passe da cadeia de ligação. Confirma que trocaste o marcador da palavra-passe, com os `<` e `>` incluídos, e que usaste o utilizador da base de dados, e não o da tua conta no Atlas. Se a palavra-passe tiver carateres como `@`, `:` ou `/`, a cadeia de ligação fica partida. O mais simples é criar no Atlas uma palavra-passe só com letras e algarismos.

### A lista das cenas vem vazia, e nenhuma cena existe

O `/api/cenas` dá `[]`, e o `/api/cenas/inicio` dá 404. O servidor ligou-se a uma base sem cenas. Vê no terminal a primeira linha do arranque, que diz a que base se ligou. Tem de ser `fechado-na-escola`. Se for outra, corrige o `DB_NAME` no `.env`. Se for essa, corre o `npm run seed`.

### A porta 3000 está ocupada

O servidor escreve `Ligada à base de dados fechado-na-escola` e depois `Não foi possível ligar o servidor: listen EADDRINUSE: address already in use :::3000`. A porta já está a ser usada por outro servidor, por exemplo o do cinema da escola. O jogo não termina, mas também não responde. Para o outro servidor com Ctrl+C, no terminal onde ele está a correr. Depois, para também este e volta a arrancá-lo com `npm run dev`.

### fatal: not a git repository

Quer dizer "não é um repositório do Git". Correste um comando do Git fora da pasta do projeto, ou antes do `git init`. Confirma em que pasta estás e entra na `fechado-na-escola`.

### Please tell me who you are

O Git recusou o commit, porque não sabe o teu nome. Faz o passo 7 da fase 1 e repete o commit. Nalguns computadores, o Git não recusa: faz o commit com um nome inventado a partir do nome do computador, e sugere um comando com `--global`. Nos computadores da escola, não o uses. Faz o passo 7 da fase 1, e os commits seguintes já levam o teu nome.

### O .env aparece no git status, ou foi para um commit

Não faças mais nada no Git e chama o professor. Se o `.env` só aparece na lista, o `.gitignore` não está a funcionar, e corrige-se antes do `git add`. Se já foi num commit com a cadeia de ligação, a palavra-passe desse utilizador tem de ser mudada no Atlas, porque fica no histórico.

## Desafios

1. O mapa da história. Desenha em papel o mapa das onze cenas, com uma caixa por cena e uma seta por escolha, da cena até ao destino. Faz o mapa a partir das respostas da API, e não do `seed.js`. Depois, descobre no mapa o caminho mais curto do `inicio` até ao final em que sais da escola sem que ninguém dê por ti. E responde: uma partida pode não acabar nunca? Pista: o `/api/cenas` dá-te todas as cenas de uma vez, cada uma com o `codigo` e o `destino` das suas escolhas.

2. A história verificada. O MongoDB não confirma que o destino de uma escolha é o código de uma cena que existe. Escreve um programa, `src/verificar-historia.js`, que lê as cenas da base e escreve no terminal cada escolha com um destino que não existe, e a cena onde ela está. Quando não houver nenhuma, escreve que a história está certa. Corre-o com `node --env-file=.env src/verificar-historia.js`. Para o testares, muda no `seed.js` o destino de uma escolha para um código que nenhuma cena tem, e corre o seed e o teu programa. No fim, repõe o destino e volta a correr o seed. Quando o programa funcionar, guarda-o num commit só dele, com `git add src/verificar-historia.js` e `git commit -m "Desafio: verificar a história"`, para o `git status` do passo seguinte começar limpo. Pista: o programa liga-se e desliga-se como o seed, e uma lista com o código de todas as cenas diz-te se um destino existe.

## Antes de terminares

- [ ] O `npm run` mostra os scripts `start`, `dev` e `seed`.
- [ ] O `npm run seed` escreve `Inseridas 11 cenas`, e vês as onze cenas no Data Explorer do Atlas.
- [ ] O `npm run dev` escreve a base a que se ligou e o endereço do servidor, e `/api/cenas/inicio` mostra a primeira cena.
- [ ] Jogaste uma partida até uma cena com `"final":true`.
- [ ] Viste os dois erros provocados, a cadeia de ligação em falta e a base com o nome errado, e o `DB_NAME` voltou a `fechado-na-escola`.
- [ ] No separador Rede, encontraste o método, o código, o `Content-Type` e o Remote Address do pedido de uma cena.
- [ ] O `git log --oneline` mostra o primeiro commit, o `git status` diz que não há nada para guardar, e o `.env` não está no commit.
- [ ] Desenhaste em papel as camadas do pedido de uma cena, com o que cada uma faz.
- [ ] Consegues explicar, por palavras tuas, o pedido de uma cena, desde que escreves o endereço no browser até veres a resposta. E sabes dizer porque é que a palavra-passe do Atlas nunca chega ao browser.

![Rodapé](../../imagens/rodape.png)
