![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: arquitetura e setup Node

Laboratório do tema Arquitetura e setup Node, do módulo M14, Acesso a Bases de Dados. Vais desenhar o servidor da papelaria e preparar, no teu computador, o projeto da API: a pasta, os scripts, a configuração num `.env`, o `.gitignore` e o primeiro commit. No fim, traças um pedido do browser até à API e de volta. Cada passo diz o que fazer, porquê e o que deves ver. Avanças ao teu ritmo: o que não acabares na aula, acabas em casa ou na aula seguinte. Tudo o que precisas está aqui; o [guia do tema](03-arquitetura-e-setup-node.md) tem a teoria completa, para quem quiser saber mais.

## O que vais construir

O projeto `papelaria-api`, guardado no Git, com uma API que responde em `/api/estado`, e a configuração fora do código. No fim, a pasta fica assim:

```text
papelaria-api/
├── .env                 a configuração deste computador; nunca vai para o Git
├── .env.example         os nomes da configuração, sem segredos; vai para o Git
├── .gitignore           o que o Git deve ignorar
├── package.json
├── package-lock.json
├── node_modules/        recria-se com npm install; nunca vai para o Git
└── src/
    └── server.js        o arranque da API
```

No caderno, ficam o diagrama do servidor, o registo do que fizeste e a tabela de um pedido, do browser até à API e de volta. Ficas a saber preparar um projeto Node que se pode entregar e instalar noutro computador, sem segredos no Git.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | O diagrama das três partes e das camadas, em papel | O plano do servidor, mostrado ao professor |
| 2 | A pasta, o Express e os scripts do `package.json` | O `npm run` mostra os scripts `start` e `dev` |
| 3 | O `src/server.js`, com a rota de estado | A API responde em `/api/estado` |
| 4 | O `.env` e o `.env.example` | O `npm run dev` arranca a API com a configuração do `.env` |
| 5 | A porta, mudada no `.env` com a API ligada | A API muda de porta sem mexer no código |
| 6 | O `.gitignore` e o primeiro commit | O projeto no Git, sem o `.env` nem a `node_modules` |
| 7 | O traçado do pedido de estado | A tabela do pedido, com o que observaste |

## Palavras que vais usar

- Cliente: a parte da aplicação que o utilizador vê e usa; aqui, a interface em React, que corre no browser.
- API: o servidor em Node.js com Express, por onde o React usa a aplicação. Para saber mais, vê a secção "A tua aplicação tem três partes" do [guia](03-arquitetura-e-setup-node.md).
- Mongoose: a biblioteca de JavaScript com que a API vai falar com o MongoDB Atlas, mais à frente.
- Cadeia de ligação: o endereço que leva a API ao Atlas, começado por `mongodb+srv://`, com o utilizador e a palavra-passe da base de dados lá dentro. É um segredo.
- Camada: uma parte do servidor com uma só responsabilidade. A API tem quatro: rotas, controller (controlador), service (serviço) e repository (repositório).
- Rota de estado: uma rota que só responde que a API está ligada, como `GET /api/estado`.
- Script: um nome curto para um comando, na secção `scripts` do `package.json`.
- Variável de ambiente: um par nome e valor que o programa recebe quando arranca, e que se lê em `process.env`.
- `.env`: o ficheiro com as variáveis de ambiente deste computador; nunca vai para o Git.
- `.env.example`: o ficheiro com os nomes das variáveis, sem segredos; vai para o Git.
- `.gitignore`: o ficheiro que diz ao Git o que ignorar.
- Git e commit: o Git guarda o histórico do projeto; um commit é uma fotografia dos ficheiros, guardada com uma mensagem e a data. Para saber mais, vê a secção "O mínimo de Git" do [guia](03-arquitetura-e-setup-node.md).
- Repositório: a pasta de um projeto com o histórico do Git, guardado na pasta escondida `.git`; em inglês, repository, a palavra que o Git escreve no ecrã. Não é a camada repository do servidor. A palavra é a mesma, as coisas são diferentes.

## O que precisas

- O Node.js, que corre a API. Confirma que o tens com `node --version`; deve aparecer um número de versão começado por `v`, como `v26.11.1`, a versão com que este laboratório foi ensaiado. O primeiro número tem de ser 22 ou maior, porque as opções que o laboratório usa precisam do Node 22 ou mais recente.
- O npm, que vem com o Node e instala o Express. Confirma com `npm --version`; deve aparecer um número de versão, como `11.20.0`.
- O Git, que guarda o histórico do projeto. Confirma com `git --version`; deve aparecer `git version` seguido de um número. Se disser que o comando não existe, chama o professor.
- Um editor de código, como o Visual Studio Code, e um terminal. No Visual Studio Code, abre o terminal no menu "Terminal", com "New Terminal" ("Novo Terminal", se o editor estiver em português).
- Internet, só para o `npm install`.
- O browser, com as ferramentas de programador: abrem-se com F12, e o separador "Rede" (ou "Network") mostra cada pedido.
- O caderno, ou um ficheiro de texto fora do projeto, para registares os comandos que corres e o que aconteceu. No fim vais precisar desse registo, do diagrama da fase 1 e da tabela da fase 7.

## Se alguma coisa falhar

1. Estás na pasta certa? No terminal, `pwd` mostra a pasta atual (no Windows, na linha de comandos clássica, `cd`, sem mais nada). Tem de ser a `papelaria-api`, onde está o `package.json`. Se não for, entra nela com `cd papelaria-api`.
2. Guardaste o ficheiro? O editor só grava quando guardas, e o `--watch` só reinicia a API depois de guardares.
3. A API está ligada? O terminal tem de mostrar `API a correr em http://localhost:3000`. Se a paraste com Ctrl+C, arranca-a outra vez.
4. O que diz a mensagem de erro? Lê-a como em Sistemas de Informação. Procura primeiro a linha que diz o tipo do erro, como `Error` ou `SyntaxError`, ou a que começa por `node:` ou por `npm error`. A última linha é muitas vezes só a versão do Node, ou o aviso do `--watch` de que está à espera. Os casos mais comuns estão nos [problemas frequentes](#problemas-frequentes).

## Se vens da API da papelaria de Sistemas de Informação

Em Sistemas de Informação, no laboratório "a API da papelaria", criaste uma pasta `papelaria-api`, com o `package.json` e o Express instalado. O `server.js` tem os oito artigos, a rota da lista com o filtro por categoria, a rota de detalhe, o middleware de registo e o middleware final. É um servidor de um só ficheiro, que chegou para a aula. Este laboratório transforma-o num projeto, sem lhe mudar nenhuma resposta.

A fase 1 faz-se como está, em papel. As fases 2 e 3 fazem-se pelos passos desta secção, em vez dos que estão nelas, porque o projeto já existe. As fases 4 a 7 fazem-se como estão, com as diferenças que esta secção indica no fim. Quem não fez essa API em Sistemas de Informação, ou não a tem, segue o caminho normal.

### Fase 2, no teu projeto: a pasta src e os scripts

1. Abre no editor a pasta `papelaria-api` de Sistemas de Informação. Confirma que tem o `package.json`, o `package-lock.json`, a pasta `node_modules` e o `server.js`. Se a trouxeste de outro computador sem a `node_modules`, corre `npm install` dentro da pasta. O npm lê o `package.json` e volta a instalar o Express.

2. Cria a pasta `src` na raiz do projeto, ao lado do `package.json`, e muda o `server.js` para dentro dela. No Visual Studio Code, basta arrastá-lo para a pasta `src`. A partir daqui, o código vive em `src`, e a configuração e os ficheiros do npm ficam na raiz.

3. No `package.json`, o `"type"` já está em `module`, desde Sistemas de Informação. Substitui a secção `"scripts"`, que tem o `"test"`, por esta:

   ```json
   "scripts": {
     "start": "node src/server.js",
     "dev": "node --watch --env-file=.env src/server.js"
   },
   ```

   A vírgula no fim mantém-se, porque há outras secções a seguir. O `start` arranca a API; o `dev` arranca-a para desenvolver, como explica a fase 2.

4. Guarda e, no terminal, escreve `npm run`, sem mais nada. O que deves ver: a lista dos scripts, com o `start` e o `dev`, como na fase 2. Se o npm se queixar do JSON (`EJSONPARSE`), há uma vírgula ou uma aspa a mais ou a menos. A mensagem diz a linha e a coluna.

5. Em Sistemas de Informação arrancavas o servidor com `node --watch server.js`. Prevê: se escreveres esse mesmo comando agora, na raiz do projeto, o que acontece? Experimenta, e depois sai com Ctrl+C.

   O que deves ver: `Error: Cannot find module` seguido do caminho de um `server.js` na raiz, que já não existe, porque o ficheiro passou para `src`. Com o `--watch`, o Node não termina. Escreve `Failed running 'server.js'. Waiting for file changes before restarting...` e fica à espera. É para isto que servem os scripts: o caminho do arranque fica escrito uma vez, no `package.json`, e ninguém tem de o saber de cor.

### Fase 3, no teu projeto: a porta e a rota de estado

1. Abre o `src/server.js`. A porta está escrita no código, na linha `const PORTA = 3000;`. Substitui essa linha por estas três:

   ```js
   // A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
   // Se não estiver definida, a API usa a 3000.
   const PORTA = process.env.PORT || 3000;
   ```

   Leitura guiada: `process.env.PORT` é o valor da variável de ambiente `PORT`, se existir. Se não existir, o `||` faz a constante ficar com 3000. A fase 4 explica de onde vêm as variáveis de ambiente.

2. Acrescenta a rota de estado logo a seguir ao middleware de registo, e antes das rotas dos artigos:

   ```js
   // Rota de estado: serve para confirmar que a API está ligada e a responder.
   // Responde em JSON, como todas as rotas de uma API.
   app.get("/api/estado", (req, res) => {
     res.json({ estado: "ok", aplicacao: "API da papelaria" });
   });
   ```

   Antes de a escreveres, responde no caderno: o que aconteceria se a escrevesses no fim do ficheiro, depois do middleware final?

   A resposta: a rota nunca respondia. O middleware final responde a todos os pedidos que lhe chegam e não chama `next()`, por isso `/api/estado` dava 404, com `{"erro":"Rota não encontrada"}`. É a regra da ordem do middleware, que viste em Sistemas de Informação. Os pedidos passam pela fila de cima para baixo.

3. Arranca a API com o script `start`:

   ```bash
   npm start
   ```

   O que deves ver: as duas linhas do npm (`> papelaria-api@1.0.0 start` e o comando) e depois `API a correr em http://localhost:3000`.

4. No browser, abre `http://localhost:3000/api/estado` e depois `http://localhost:3000/api/artigos?categoria=Papel`. O que deves ver: o objeto com `"estado": "ok"` e, a seguir, os três artigos da categoria Papel, como em Sistemas de Informação. No terminal, o middleware de registo escreve uma linha por pedido, como `GET /api/estado`.

5. Para a API com Ctrl+C. Pensa: não há nenhum ficheiro `.env`, e a API arrancou na porta 3000. De onde veio o 3000? A resposta: do `||` no código. Sem `.env` lido, `process.env.PORT` não existe, e a constante fica com o valor da direita.

### As fases 4 a 7 no teu projeto

- Fases 4 e 5: fazem-se como estão. No terminal aparecem também as linhas do middleware de registo, uma por pedido.
- Fase 6: faz-se como está. Se o teu `.env` já tem a cadeia de ligação verdadeira, porque já ligaste a API ao Atlas, o passo 4 é o mais importante do laboratório. Só fazes o `git add` depois de confirmares que o `.env` desapareceu da lista. No passo 6, a mensagem do commit diz o que o teu projeto tem, por exemplo `API da papelaria organizada como projeto, com a rota /api/estado`.
- Fase 7: os passos 1 a 4 fazem-se como estão. No passo 4, a tua tabela tem duas funções no passo 3: o middleware de registo, que escreve `GET /api/estado` no terminal, e depois a rota de estado. O passo 5 muda, porque no teu projeto a rota `/api/artigos` já existe. Em vez dele, abre `http://localhost:3000/api/artigos/abc`, regista o código e a mensagem, e escreve numa frase que linha do `src/server.js` escolheu esse código.

  A resposta: 400, com `{"erro":"O identificador do artigo tem de ser um número inteiro positivo"}`. Escolheu-o o `res.status(400)` da rota de detalhe, dentro da verificação `if (!Number.isInteger(id) || id < 1)`, porque `abc` não é um número. Também aqui o middleware de registo corre antes da rota.

## Fase 1: o plano do servidor, em papel

A aplicação da papelaria vai ter três partes, e cada uma corre num sítio diferente. O cliente, em React, corre no browser. Mostra os dados e, quando precisa deles, pede-os à API com `fetch`. A API, em Node.js com Express, corre num servidor, que enquanto desenvolves é o teu computador. Recebe os pedidos, aplica as regras da papelaria, fala com a base de dados e responde em JSON. A base de dados é o MongoDB Atlas, que já conheces.

Entre o React e a API, a conversa é em HTTP, com JSON. Entre a API e o Atlas, é feita pelo Mongoose, que precisa da cadeia de ligação, com a palavra-passe da base de dados. Essa cadeia fica só na API. Tudo o que vai para o browser pode ser lido por quem abrir as ferramentas de programador.

Dentro da API, cada pedido atravessa quatro camadas, sempre pela mesma ordem. As rotas dizem que método e que caminho vão para que função. O controller lê o pedido, converte o que chega como texto, chama o service, escolhe o código de estado e responde. O service tem as regras da papelaria e não sabe nada de HTTP. O repository é o único que fala com o MongoDB. Dividir assim põe cada mudança num sítio só. Para saber mais, lê as secções "A tua aplicação tem três partes" e "As camadas dentro do servidor" do [guia](03-arquitetura-e-setup-node.md).

1. Desenha as três partes da aplicação da papelaria: o React, a API e o MongoDB Atlas. Em cada seta, escreve o que viaja: "HTTP com JSON" ou "Mongoose". Assinala com um círculo o único sítio onde a cadeia de ligação ao Atlas existe.

   O que deves ter no desenho: o círculo na API, e não na seta nem no React.

2. Desenha as quatro camadas da API para o pedido `GET /api/artigos?stockMaximo=5`, que pede os artigos com 5 unidades ou menos. Ao lado de cada camada, escreve o que faz neste pedido.

   O que deves ter no desenho:

   | Camada | O que faz neste pedido |
   | --- | --- |
   | Rotas | Vê que é `GET /api/artigos` e passa o pedido à função do controller que lista artigos |
   | Controller | Lê `stockMaximo`, que chega como texto, `"5"`, e converte-o para o número 5. Se não for um número válido, responde 400. Se for, chama o service |
   | Service | Pede ao repository os artigos com stock até ao limite |
   | Repository | Executa no Atlas a consulta `{ stock: { $lte: 5 } }` na coleção `artigos` e devolve os documentos |
   | Service | Devolve a lista ao controller |
   | Controller | Responde 200 com a lista em JSON |

3. Agora, um pedido diferente: `GET /api/valor-do-stock`. A interface quer mostrar quanto vale, em dinheiro, tudo o que a papelaria tem em loja. Para cada artigo, conta-se o stock vezes o preço, e no fim somam-se todos. Desenha as mesmas quatro camadas para este pedido e responde, ao lado do desenho, a cada pergunta, antes de leres a resposta.

   - Em que camada se faz a conta? O que é que a camada de baixo lhe entrega para a poder fazer?

     A resposta: no service, porque é uma conta da papelaria, que não depende de HTTP nem do MongoDB. O repository vai buscar ao Atlas os artigos, ou só o stock e o preço de cada um, e entrega-os ao service, que multiplica e soma.

   - Os preços estão guardados em cêntimos. A API responde com o valor em cêntimos ou em euros? E, se o ecrã tiver de mostrar o valor escrito como "80,65 €", em que parte da aplicação se faz essa transformação: na API ou no React?

     A resposta: a API responde em cêntimos, um número inteiro, como todos os preços da aplicação. A transformação no texto do ecrã é do React. A API entrega dados, e quem os mostra é o cliente. Assim, o React também pode usar o valor em cêntimos noutras contas.

   - Se a papelaria ainda não tiver nenhum artigo, que código e que valor deve ter a resposta? Que camada chega a esse valor, e que camada escolhe o código?

     A resposta: 200, com o valor 0. O service chega ao 0, porque a soma de nenhum artigo é 0. O controller responde 200, porque o pedido estava certo e a resposta existe. Não é 404. O valor do stock existe, e é zero, tal como uma lista sem resultados é uma lista vazia, e não uma coisa que não existe.

   - Este pedido não tem parâmetros. Há algum caso em que deva responder 400? Porquê?

     A resposta: não. O 400 quer dizer que o pedido está mal feito, e um pedido sem parâmetros não tem nada que possa estar mal. Só pode correr mal do lado do servidor, por exemplo se o Atlas não responder, e isso não é culpa de quem pediu.

### Paragem 1

Tens o diagrama das três partes e os dois diagramas de camadas. Mostra-os ao professor antes de passares à fase 2. São uma das duas coisas que este tema te pede para entregar.

Pensa antes de continuares: porque é que o repository é a única camada que fala com o MongoDB? A resposta: para a base de dados ficar num sítio só. Se a papelaria trocar o MongoDB por outra base de dados, muda-se o repository, e as rotas, os controllers e os services ficam iguais. E uma consulta que não encontra nada procura-se num sítio só.

## Fase 2: a pasta e o package.json

Em Sistemas de Informação, um servidor de aula começava com `npm init -y`, a troca do `"type"` e `npm install express`. Um projeto que vai crescer durante o ano, e que vais entregar e instalar noutro computador, precisa de mais arrumação. O código fica numa pasta `src` (de *source*, código-fonte). E o `package.json` ganha scripts: nomes curtos para os comandos que arrancam a API, para ninguém ter de os saber de cor. Para saber mais, lê a secção "Preparar um projeto Node" do [guia](03-arquitetura-e-setup-node.md).

1. Na tua pasta de trabalho de Linguagens de Programação, cria o projeto e instala o Express. Cria-o fora da pasta dos materiais da disciplina, se a tiveres no computador. Essa pasta já tem o seu próprio histórico do Git.

   ```bash
   mkdir papelaria-api
   cd papelaria-api
   npm init -y
   npm install express
   mkdir src
   ```

   O que deves ver: o `npm init -y` escreve o `package.json` que criou, e o `npm install express` mostra uma linha como `added 65 packages`. Os comandos são os mesmos no Windows.

2. Abre a pasta `papelaria-api` no editor. No `package.json`, faz duas alterações:

   - na linha do `"type"`, muda só a palavra `commonjs` para `module`, para o Node aceitar o `import`;
   - substitui a secção `"scripts"`, que tem o `"test"`, por esta:

     ```json
     "scripts": {
       "start": "node src/server.js",
       "dev": "node --watch --env-file=.env src/server.js"
     },
     ```

     A vírgula no fim mantém-se, porque há outras secções a seguir.

   Leitura guiada: o `start` arranca a API, e é o comando que se usa quando ela é instalada noutro computador para funcionar. O `dev` é o que usas enquanto desenvolves. O `--watch` reinicia a API sempre que guardas o `server.js`, um ficheiro que ele importe, ou o `.env`. O `--env-file=.env` lê o ficheiro `.env` e põe a configuração que lá está à disposição do código, como explica a fase 4.

3. Guarda e, no terminal, escreve `npm run`, sem mais nada.

   O que deves ver:

   ```text
   Lifecycle scripts included in papelaria-api@1.0.0:
     start
       node src/server.js
   available via `npm run`:
     dev
       node --watch --env-file=.env src/server.js
   ```

   Se o npm se queixar do JSON (`EJSONPARSE`), há uma vírgula ou uma aspa a mais ou a menos no `package.json`. A mensagem diz a linha e a coluna.

### Paragem 2

O `package.json` tem o `"type": "module"` e os dois scripts, e o `npm run` mostra-os.

Pensa antes de continuares: porque é que o `start` aparece numa parte da lista e o `dev` noutra? A resposta: o `start` é um dos poucos scripts que o npm conhece pelo nome, e corre-se com `npm start`, sem o `run`. Todos os outros, como o `dev`, correm-se com `npm run`, seguido do nome.

## Fase 3: o servidor e o primeiro arranque

Há valores de que a API precisa que não são código, como a porta onde escuta. Se a porta estiver escrita no código, mudá-la obriga a mudar o código. Por isso o servidor lê-a do ambiente, com um valor por omissão, se não a encontrar. E a primeira rota é uma rota de estado, que só diz que a API está viva. É a forma mais rápida de confirmar que o servidor está ligado. Para saber mais, lê o passo 4 do exemplo guiado do [guia](03-arquitetura-e-setup-node.md).

1. Cria o ficheiro `src/server.js`, dentro da pasta `src`, com este conteúdo. Escreve-o em vez de o copiar, e lê cada linha:

   ```js
   // src/server.js: o ponto de arranque da API da papelaria.
   // Lê a configuração do ambiente, cria a aplicação Express e liga-a à porta.
   import express from "express";

   // A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
   // Se não estiver definida, a API usa a 3000.
   const PORTA = process.env.PORT || 3000;

   const app = express();

   // Rota de estado: serve para confirmar que a API está ligada e a responder.
   // Responde em JSON, como todas as rotas de uma API.
   app.get("/api/estado", (req, res) => {
     res.json({ estado: "ok", aplicacao: "API da papelaria" });
   });

   app.listen(PORTA, (erro) => {
     if (erro) {
       console.error(`Não foi possível ligar a API: ${erro.message}`);
       return;
     }
     console.log(`API a correr em http://localhost:${PORTA}`);
   });
   ```

   Leitura guiada: lê o ficheiro de cima para baixo, pela ordem em que o Node o executa. Primeiro o `import` do Express. Depois a `PORTA`: `process.env.PORT` é o valor da variável de ambiente `PORT`, se existir, e o `||` usa o 3000 se não existir. A seguir, a `app` e a rota de estado, que responde com um objeto em JSON. No fim, o `app.listen`, que liga a API à porta e escreve a mensagem do arranque, ou a do erro.

2. Arranca a API com o script `start`. Antes, prevê: em que porta vai ficar, se ainda não há nenhum ficheiro de configuração?

   ```bash
   npm start
   ```

   O que deves ver: as duas linhas do npm (`> papelaria-api@1.0.0 start` e o comando) e depois `API a correr em http://localhost:3000`.

3. No browser, abre `http://localhost:3000/api/estado`. O que deves ver: `{"estado":"ok","aplicacao":"API da papelaria"}`. Isto quer dizer que a API está ligada e responde.

4. Para a API com Ctrl+C, no terminal.

### Paragem 3

A API arranca com `npm start` e responde em `/api/estado`.

Pensa antes de continuares: não há nenhum ficheiro `.env`, e a API arrancou na porta 3000. De onde veio o 3000? A resposta: do `||` no código. Sem nada que defina a variável `PORT`, `process.env.PORT` não existe, e a constante fica com o valor da direita.

## Fase 4: a configuração no .env

Cada programa, quando arranca, recebe um conjunto de pares nome e valor, as variáveis de ambiente, que se leem em `process.env`. Para não teres de as definir à mão de cada vez, escreves-as num ficheiro `.env`, na raiz do projeto, uma por linha, no formato `NOME=valor`. O `--env-file=.env` do script `dev` lê esse ficheiro quando a API arranca. O `.env` é deste computador e pode ter segredos, por isso nunca vai para o Git. Para quem descarrega o projeto saber que variáveis definir, há o `.env.example`: os mesmos nomes, sem segredos, com comentários. Esse vai para o Git. Para saber mais, lê a secção "Configuração fora do código: o .env" do [guia](03-arquitetura-e-setup-node.md).

1. Tenta arrancar com o script de desenvolvimento. Antes, prevê: o que vai acontecer, se o `.env` ainda não existe?

   ```bash
   npm run dev
   ```

   O que deves ver: `node: .env: not found`, e a API não arranca. O `--env-file=.env` procura o ficheiro e não o encontra.

2. Na raiz do projeto, ao lado do `package.json` e não dentro de `src`, cria o ficheiro `.env.example` com este conteúdo. Cria-o no editor de código. No Windows, o Bloco de Notas pode acrescentar `.txt` ao nome sem o mostrar.

   ```text
   # Porta onde a API escuta. Muda-a se a 3000 estiver ocupada.
   PORT=3000

   # Ligação ao MongoDB Atlas, no formato mongodb+srv://utilizador:palavra-passe@...
   # O endereço verdadeiro escreve-se só no .env. No .env.example, esta linha fica vazia.
   MONGODB_URI=
   ```

   Leitura guiada: as linhas que começam por `#` são comentários. Os nomes das variáveis escrevem-se em maiúsculas, com `_` entre palavras. A `MONGODB_URI` fica vazia. A API ainda não fala com o Atlas.

3. Cria o `.env` como cópia do `.env.example`:

   ```bash
   cp .env.example .env
   ```

   No Windows, na linha de comandos clássica, o comando é `copy .env.example .env`. Também podes criar o ficheiro no editor e copiar o conteúdo.

4. Volta a correr `npm run dev`. O que deves ver: as duas linhas do npm e `API a correr em http://localhost:3000`. Agora o `.env` existe, e o Node leu-o.

5. Abre o `.env` e o `.env.example` lado a lado no editor. Neste momento são iguais. Escreve no caderno o que vai ser diferente entre os dois quando a API se ligar ao Atlas.

   A resposta: o `.env` vai ter a cadeia de ligação verdadeira, com a palavra-passe, na `MONGODB_URI`. O `.env.example` continua com a linha vazia e o comentário, porque vai para o Git.

### Paragem 4

O projeto tem o `.env` e o `.env.example` na raiz, e o `npm run dev` arranca a API.

Pensa antes de continuares: se o `.env` tiver `PORT=3001`, que valor tem `process.env.PORT` dentro da API, e de que tipo é? A resposta: `"3001"`, um texto. Os valores das variáveis de ambiente são sempre texto. Para a porta não faz diferença, porque o `app.listen` aceita as duas formas; numa conta, convertia-se com `Number(...)`.

## Fase 5: mudar a configuração sem mexer no código

A razão de pôr a porta no `.env` é poder mudá-la sem tocar no código. Com o `--watch`, nem é preciso parar a API. O Node vê que o `.env` mudou e reinicia-a com o valor novo. Nesta fase vês também o engano mais difícil de encontrar na configuração, porque não dá erro nenhum. Para saber mais, lê o passo 6 do exemplo guiado do [guia](03-arquitetura-e-setup-node.md).

1. Com a API ligada pelo `npm run dev`, abre o `.env`, muda `PORT=3000` para `PORT=3001` e guarda.

   O que deves ver, no terminal: `Change detected in`, seguido do caminho do teu `.env`, depois `Restarting 'src/server.js'` e por fim `API a correr em http://localhost:3001`. O `--watch` viu a mudança no `.env` e reiniciou a API.

2. No browser, abre `http://localhost:3000/api/estado` e depois `http://localhost:3001/api/estado`. O que deves ver: o primeiro dá "ligação recusada", e o segundo responde. Não mudaste uma única linha do `server.js`.

3. Provoca um erro de propósito: no `.env`, muda o nome da variável de `PORT` para `PORTA`, para ficar `PORTA=3001`, e guarda. Antes de olhares para o terminal, prevê: em que porta fica a API?

   O que deves ver: a API reinicia na porta 3000. O código lê `process.env.PORT`, e essa variável deixou de existir. A `PORTA` é outra variável, que ninguém lê. Sem `PORT`, o `||` usou o 3000. Não houve nenhuma mensagem de erro, e é isso que torna este engano difícil de encontrar.

4. Repõe `PORT=3000` no `.env`, guarda e confirma que a API volta a responder em `http://localhost:3000/api/estado`.

### Paragem 5

A API muda de porta quando mudas o `.env`, sem mexeres no código, e volta à 3000.

Pensa antes de continuares: porque é que o engano da `PORTA` é mais perigoso do que o `.env` em falta, da fase 4? A resposta: o `.env` em falta dá um erro, e a API não arranca, por isso dás logo por ele. O nome errado não dá erro nenhum. A API arranca noutra porta, e só descobres quando alguma coisa deixa de funcionar.

## Fase 6: guardar no Git sem guardar segredos

O Git guarda o histórico do projeto. Cada commit é uma fotografia de todos os ficheiros, com uma mensagem e a data. Antes de guardar, o Git propõe-se guardar tudo o que está na pasta. Há duas coisas que nunca devem ir. Uma é a pasta `node_modules`, que se recria com `npm install` e tem milhares de ficheiros que não são teus. A outra é o `.env`, que pode ter segredos. O ficheiro `.gitignore` diz ao Git o que ignorar, e tem de existir antes do primeiro commit. Nesta fase vais ver o `.env` a aparecer na lista do Git antes de existir o `.gitignore`. É de propósito. Segue os passos pela ordem, e não faças `git add` antes do passo 6. Para saber mais, lê as secções "O mínimo de Git" e "O que vai para o Git: o .gitignore" do [guia](03-arquitetura-e-setup-node.md).

1. Para a API com Ctrl+C. Na pasta `papelaria-api`, começa o histórico:

   ```bash
   git init
   ```

   O que deves ver: `Initialized empty Git repository in`, seguido do caminho da pasta. O Git criou nessa pasta um repositório vazio. O Git pode escrever antes umas linhas de sugestão (`hint`) sobre o nome do ramo principal, a que chama `branch`; podes ignorá-las.

2. Vê o estado da pasta:

   ```bash
   git status --short
   ```

   O que deves ver: uma lista com `??` à frente de cada nome, que quer dizer "ficheiro novo, que o Git ainda não segue". Na lista aparecem o `.env` e a `node_modules/`. Se fizesses agora `git add .`, o teu `.env` ia para o histórico. Não faças.

3. Na raiz do projeto, cria o ficheiro `.gitignore` com este conteúdo, e guarda:

   ```text
   # Dependências: recriam-se com npm install.
   node_modules/

   # Configuração local e segredos: nunca vão para o Git.
   .env
   ```

   Leitura guiada: cada linha que não é comentário é uma regra. `node_modules/` ignora a pasta inteira, e `.env` ignora esse ficheiro. O `.env.example` não é ignorado, porque o nome é outro, e é isso que se quer.

4. Volta a correr `git status --short`. O que deves ver: o `.env.example`, o `.gitignore`, o `package-lock.json`, o `package.json` e `src/`. O `.env` e a `node_modules/` desapareceram. Se algum dos dois ainda aparecer, para. Confirma o nome do ficheiro `.gitignore`, sem `.txt`, e a pasta onde está.

5. Diz ao Git quem és, só neste projeto. Nos computadores da escola, que são partilhados, a configuração fica só nesta pasta, e não passa para quem usar o computador a seguir:

   ```bash
   git config user.name "O teu nome"
   git config user.email "o teu email da escola"
   ```

6. Guarda o primeiro commit e confirma-o. O `git add .` prepara para o commit todos os ficheiros da pasta, menos os que o `.gitignore` manda ignorar. O `git commit -m "..."` guarda a fotografia desses ficheiros, com a mensagem que vem depois do `-m`. O `git log --oneline` lista os commits feitos, um por linha.

   ```bash
   git add .
   git commit -m "Esqueleto da API da papelaria, com a rota /api/estado"
   git log --oneline
   ```

   O que deves ver: o `git log` mostra um commit, com um código curto à frente da mensagem. A mensagem diz o que mudou, em português e numa frase, para quem a ler daqui a um mês.

7. Corre outra vez `git status`. O que deves ver: o Git diz que não há nada para guardar (`nothing to commit, working tree clean`). Tudo o que devia estar no histórico está lá, e o `.env` continua fora.

### Paragem 6

O projeto está no Git, com um commit, e o `.env` e a `node_modules` ficaram de fora.

Pensa antes de continuares: um colega fez o `git add .` antes de criar o `.gitignore`, e o `.env` foi no primeiro commit. Basta-lhe acrescentar o `.env` ao `.gitignore` agora? A resposta: não. O `.gitignore` faz o Git ignorar as mudanças futuras, mas a versão que foi no primeiro commit continua no histórico, e qualquer pessoa com acesso ao repositório a pode ler. Se o `.env` tivesse uma palavra-passe verdadeira, a única correção segura era mudá-la no Atlas. Por isso a ordem certa é: primeiro o `.gitignore`, depois o primeiro commit.

## Fase 7: traçar o pedido

Explicar um pedido é dizer, por ordem, quem faz o quê, onde corre e o que viaja, desde que escreves o endereço no browser até veres a resposta. É o que este tema te pede para mostrares no fim. O separador "Rede" das ferramentas de programador mostra o que viajou em cada pedido. Para saber mais, lê o passo 8 do exemplo guiado do [guia](03-arquitetura-e-setup-node.md).

1. Liga a API com `npm run dev`. No browser, abre as ferramentas de programador (F12) e escolhe o separador "Rede" (ou "Network").

2. Abre `http://localhost:3000/api/estado`.

3. Clica no pedido `estado` e regista no caderno o método, o endereço completo, o código de estado e o `content-type` da resposta. Regista também o "Remote Address" ("Endereço remoto", com o browser em português), que é o endereço do computador que respondeu.

   O que deves ver:

   | Campo | Valor |
   | --- | --- |
   | Método | `GET` |
   | Endereço | `http://localhost:3000/api/estado` |
   | Código | 200 |
   | `content-type` | `application/json; charset=utf-8` |
   | Remote Address | `[::1]:3000` ou `127.0.0.1:3000`, que são duas formas de dizer "este computador", na porta 3000 |

4. Copia para o caderno esta tabela dos cinco passos do pedido e, em cada linha, acrescenta o que observaste que o confirma:

   | Passo | Onde | O que acontece |
   | --- | --- | --- |
   | 1 | browser | Escreves `http://localhost:3000/api/estado`. O browser faz um pedido `GET /api/estado` ao computador `localhost`, porta 3000 |
   | 2 | sistema operativo | O pedido chega à porta 3000, onde o processo da API está à escuta |
   | 3 | API (Node e Express) | O Express procura uma rota para `GET /api/estado`, encontra-a e chama a sua função |
   | 4 | API | A função responde com `res.json(...)`. O Express converte o objeto para JSON e junta o código 200 e o tipo `application/json` |
   | 5 | browser | Recebe a resposta e mostra o JSON. O código e o tipo veem-se no separador Rede |

   O que deves ter acrescentado:

   - no passo 1, o endereço completo;
   - no passo 2, a porta 3000 no Remote Address;
   - no passo 3, a função do `app.get("/api/estado", ...)`;
   - no passo 4, o código 200 e o `application/json`, vistos no separador Rede;
   - no passo 5, o JSON que o browser mostra, que é o corpo da resposta.

5. Abre também `http://localhost:3000/api/artigos`. Regista o código e explica, numa frase, porque é que esta rota ainda não existe e quando vai existir.

   A resposta: 404, com a página `Cannot GET /api/artigos` do Express. A rota ainda não existe porque o `server.js` só tem a rota de estado. Vai existir no tema seguinte, API Express e contratos, com o controller e o service dos artigos.

### Paragem 7

Tens a tabela do pedido de estado, com as tuas observações. É a evidência do tema. Vais explicá-la ao professor, passo a passo, sem a ler.

Pensa antes de continuares: em que passo do pedido aparece a porta 3000, e quem a escolheu? A resposta: no passo 2, quando o pedido chega à porta 3000, onde a API está à escuta. Foi o `app.listen` que ligou a API a essa porta, com o valor da variável `PORT` lido do `.env`.

## Problemas frequentes

### O npm não corre na PowerShell do Windows

Aparece uma mensagem a dizer que o ficheiro `npm.ps1` não pode ser carregado, porque a execução de scripts está desativada. Não mudes a regra do Windows. Usa a linha de comandos clássica (cmd), ou escreve `npm.cmd` em vez de `npm`.

### O ficheiro ficou com .txt no fim

No Windows, `.env.txt` ou `.gitignore.txt`. O Node não encontra o `.env`, e o Git não lê o `.gitignore`. Muda o nome no editor de código, que mostra o nome completo.

### cp não é reconhecido como comando

Estás na linha de comandos clássica do Windows. Usa `copy .env.example .env`. Na PowerShell, o `cp` funciona.

### O .env está dentro da pasta src

O `--env-file=.env` procura o ficheiro na pasta onde corres o `npm run dev`, que é a raiz do projeto. O `.env`, o `.env.example` e o `.gitignore` ficam todos ao lado do `package.json`.

### npm dev não funciona

Aparece `Unknown command: "dev"`. Falta o `run`. O comando é `npm run dev`. Se a mensagem for `Missing script: "dev"`, o script não existe no `package.json`, ou o nome está mal escrito; `npm run`, sozinho, mostra os scripts que existem.

### A API arranca na porta errada

O `process.env.PORT` está vazio, e a API usou a porta 3000 por omissão. Ou arrancaste com `npm start`, que não lê o `.env`, ou o nome da variável no `.env` é diferente do que o código lê, como `PORTA` e `PORT`.

### Mudei a porta e a API não reiniciou

Confirma que mudaste o `.env`, e não o `.env.example`. O `--watch` só reinicia a API quando muda o `.env`, o `server.js` ou um ficheiro que ele importe. Confirma também que guardaste, e que a API foi arrancada com `npm run dev`, e não com `npm start`.

### fatal: not a git repository

Quer dizer "não é um repositório do Git". Correste um comando do Git fora da pasta do projeto, ou antes do `git init`. Confirma em que pasta estás e entra na `papelaria-api`.

### Please tell me who you are

O Git recusou o commit, porque não sabe o teu nome. Faz o passo 5 da fase 6 e repete o commit. Nalguns computadores, o Git não recusa. Faz o commit com um nome inventado a partir do nome do computador e sugere um comando com `--global`. Não o uses nos computadores da escola. Faz o passo 5. Os commits seguintes já levam o teu nome.

### O .env foi para um commit

Não tentes resolver sozinho. Chama o professor. Se o teu `.env` ainda tem a `MONGODB_URI` vazia, não há dano, e é o momento certo para aprender como se corrige. Se já tem a cadeia de ligação verdadeira, a palavra-passe desse utilizador tem de ser mudada no Atlas, porque fica no histórico.

### A porta 3000 está ocupada

A API escreve `Não foi possível ligar a API: listen EADDRINUSE: address already in use :::3000`, que quer dizer que a porta já está a ser usada. Tens outro servidor ligado, por exemplo um de Sistemas de Informação. Para-o. Se já tens o `.env`, da fase 4, também podes mudar lá a porta da API e arrancá-la com `npm run dev`. É para isso que ela lá está.

## Desafios

1. O esqueleto de uma aplicação tua. Pensa numa aplicação que gostavas de fazer, por exemplo a da tua PAP, se tiver um servidor. Repete as fases 2 a 6 numa pasta nova, com o nome dela seguido de `-api`, e muda o texto da rota de estado para o nome da aplicação. Faz também o diagrama de camadas da fase 1 para o pedido mais importante dela.
2. Uma porta que não é um número. Põe no `.env` a linha `PORT=abc` e arranca a API. O que acontece? Em macOS e Linux, repara também na pasta do projeto. Depois muda o `src/server.js` para a API se recusar a arrancar, com uma mensagem clara, quando a porta não for um número inteiro. Pista: o `Number(...)` converte o texto num número, e o `Number.isInteger(...)` diz se o resultado é um número inteiro.

## Antes de terminares

- [ ] O diagrama das três partes e os dois diagramas de camadas da fase 1 estão no caderno, e mostraste-os ao professor.
- [ ] O `npm run` mostra os scripts `start` e `dev`.
- [ ] O `.env` e o `.env.example` estão na raiz do projeto, e o `.env` não aparece no `git status`.
- [ ] O `git log --oneline` mostra o primeiro commit, e o `git status` diz que não há nada para guardar.
- [ ] O registo dos comandos das fases 2 a 6 está no caderno, com os dois erros provocados: o `.env` em falta e a variável com o nome errado.
- [ ] A tabela do pedido da fase 7 está no caderno, com as tuas observações.
- [ ] Consegues explicar, por palavras tuas, o pedido `GET /api/estado`, desde que escreves o endereço no browser até veres a resposta.

Mostra também ao professor o resultado do `git log --oneline` e do `git status`. São a prova de que o projeto está guardado e de que o `.env` ficou de fora.

![Rodapé](../imagens/rodape.png)
