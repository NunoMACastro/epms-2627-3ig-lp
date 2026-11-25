![Cabeçalho](../../imagens/cabecalho.png)

# Laboratório: Ligação segura, CRUD e regras de domínio

## O que vais construir

Vais fazer o passo 4 de Fechado na escola: o jogo ganha um editor da história, feito de pedidos à API na consola, que criam, alteram e apagam cenas. A API recusa o que partiria a história, e no fim crias a cena do arquivo e jogas até ela nas páginas do passo 3.

```text
fechado-na-escola/
├── contrato-da-api.md                 ganha criar, alterar e apagar
├── .env.example                       passa à base de teste
├── package.json                       não muda
├── views/                             não muda
└── src/
    ├── server.js                      lê o corpo dos pedidos e responde aos erros em JSON
    ├── seed.js                        só corre numa base de teste
    ├── db/
    │   └── mongoose.js                usa a base de teste quando falta o DB_NAME
    ├── models/
    │   └── cena.model.js              ganha as regras de cada campo
    ├── repositories/
    │   └── cenas.repository.js        insere, altera e apaga cenas
    ├── services/
    │   └── cenas.service.js           ganha as regras do jogo que precisam da base
    ├── controllers/
    │   ├── cenas.controller.js        a lista fechada, o POST, o PATCH e o DELETE
    │   └── paginas.controller.js      não muda
    └── rotas/
        ├── cenas.rotas.js             ganha três rotas
        └── paginas.rotas.js           não muda
```

1. [Fase 1: O contrato ganha criar, alterar e apagar](#fase-1-o-contrato-ganha-criar-alterar-e-apagar)
2. [Fase 2: A base de teste reconstrói-se com o seed](#fase-2-a-base-de-teste-reconstrói-se-com-o-seed)
3. [Fase 3: Só passam os campos de uma lista fechada](#fase-3-só-passam-os-campos-de-uma-lista-fechada)
4. [Fase 4: O middleware de erros responde em JSON](#fase-4-o-middleware-de-erros-responde-em-json)
5. [Fase 5: As regras de cada campo ficam no schema](#fase-5-as-regras-de-cada-campo-ficam-no-schema)
6. [Fase 6: Alterar um documento pede duas opções](#fase-6-alterar-um-documento-pede-duas-opções)
7. [Fase 7: Uma regra que precisa da base fica no service](#fase-7-uma-regra-que-precisa-da-base-fica-no-service)
8. [Fase 8: Cada linha do contrato verifica-se com um pedido](#fase-8-cada-linha-do-contrato-verifica-se-com-um-pedido)
9. [Fase 9: Um commit guarda uma fotografia do projeto](#fase-9-um-commit-guarda-uma-fotografia-do-projeto)

## O que precisas

- O projeto do passo 3, com o seu commit. Se não o tiveres, copia a pasta `fechado-na-escola-passo-03` dos exemplos de Sistemas de Informação ([no GitHub](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/exemplos/aplicacoes-em-browser/fechado-na-escola-passo-03/README.md)) para a tua pasta de trabalho, sem o `README.md`. Faz nela o `npm install` e o `.env` do "Como correr", sem ligar o jogo. Depois guarda-a no Git: `git init`, `git config user.name "O teu nome"`, `git config user.email "o teu email da escola"`, `git add .` e `git commit -m "Passo 3"`.
- O Node.js 22 ou mais recente, que confirmas com `node --version`.
- O teu cluster do Atlas e internet, porque o jogo precisa da base.
- O browser, com as ferramentas de programador (F12; no Mac, Cmd+Option+I).

## Preparar o projeto

1. Abre a pasta do jogo no Visual Studio Code e, no terminal, confirma que o passo 3 está guardado:

   ```bash
   git status
   git log --oneline
   ```

   O que deves ver: `nothing to commit, working tree clean` (nada para guardar), e o commit do passo 3 no topo da lista. Se o `git status` mostrar ficheiros, faz o commit do passo 3 antes de continuares, como na fase 10 desse passo. Não ligues ainda o jogo: a fase 2 muda a base de dados a que ele se liga.

2. Abre um segundo terminal, no menu "Terminal", com "New Terminal". O primeiro vai ter o jogo ligado, a partir da fase 2, e o segundo fica para os comandos.

3. No browser, abre as ferramentas de programador no separador "Rede" ("Network") e confirma que "Disable cache" (desativar a cache) está marcado, como nos passos 2 e 3.

Se continuas o laboratório numa aula seguinte, abre a pasta e os dois terminais. Se já passaste a fase 2, liga o jogo com `npm run dev` no primeiro. Se já passaste a fase 3, abre `http://localhost:3000/api/estado` e cola na consola o bloco do passo 2 da [fase 8](#fase-8-cada-linha-do-contrato-verifica-se-com-um-pedido). Depois, retoma na fase em que paraste.

## Fase 1: O contrato ganha criar, alterar e apagar

Escreves no contrato os três pedidos novos, antes de qualquer código: criar, alterar e apagar uma cena, com os códigos 201, 204 e 409. Como no passo 2, o contrato diz o que a API vai aceitar e responder. Rever: [O contrato ganha criar, alterar e apagar](../05-ligacao-segura-crud-e-regras-de-dominio.md#o-contrato-ganha-criar-alterar-e-apagar).

1. Abre o `contrato-da-api.md`. A seguir ao primeiro parágrafo, o que diz que todas as respostas são JSON, acrescenta este, separado por uma linha em branco:

   ```markdown
   Qualquer pedido pode ainda responder 500, com `{ "erro": "Erro interno do servidor" }`, se alguma coisa falhar dentro do servidor.
   ```

2. Os pedidos novos levam uma cena no corpo. Antes de `## GET /api/estado`, acrescenta a secção que diz que campos podem vir e que regras cumprem:

   ```markdown
   ## O corpo de uma cena

   Os pedidos que criam e alteram uma cena levam os campos no corpo, em JSON, com estes tipos e estas regras:

   | Campo | Tipo | Regras |
   | --- | --- | --- |
   | `codigo` | texto | obrigatório num `POST`, e nunca vem num `PATCH`; até 30 carateres, sem contar os espaços do início e do fim; não pode haver duas cenas com o mesmo código |
   | `titulo` | texto | obrigatório; até 60 carateres, sem contar os espaços do início e do fim |
   | `texto` | texto | obrigatório; até 600 carateres, sem contar os espaços do início e do fim |
   | `final` | booleano | obrigatório |
   | `escolhas` | lista | pode faltar num `POST`, e a cena fica sem escolhas; num `PATCH`, substitui a lista inteira |
   | `escolhas[].texto` | texto | obrigatório; até 80 carateres, sem contar os espaços do início e do fim |
   | `escolhas[].destino` | texto | obrigatório; o código de uma cena que existe |

   Num `POST`, vêm o `codigo`, o `titulo`, o `texto` e o `final`, e as `escolhas`, se a cena as tiver. Num `PATCH`, vem pelo menos um campo, e nunca o `codigo`. Cada escolha tem só o `texto` e o `destino`. Qualquer outro campo, também dentro de uma escolha, é recusado com 400.
   ```

   O `codigo` não muda num `PATCH`, porque é por ele que as escolhas de outras cenas levam a esta. O `_id` não está na lista: dá-o o MongoDB.

3. Antes de `## Qualquer outro pedido`, acrescenta os três pedidos:

   ```markdown
   ## POST /api/cenas

   Cria uma cena, com os campos no corpo, em JSON.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 201 | a cena foi criada | a cena criada |
   | 400 | o corpo não é JSON, traz um campo que não é aceite ou um valor do tipo errado, ou não cumpre as regras dos campos | erro |
   | 409 | já existe uma cena com esse código | erro |
   | 409 | uma escolha leva a uma cena que não existe | erro |

   ## PATCH /api/cenas/:codigo

   Altera os campos que vierem no corpo, em JSON, e deixa os outros como estão.

   | Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
   | --- | --- | --- | --- | --- |
   | `codigo` | rota | texto | sim | o código de uma cena |

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | a cena foi alterada | a cena depois da alteração |
   | 400 | o corpo não é JSON, não traz nenhum campo, traz o `codigo`, um campo que não é aceite ou um valor do tipo errado, ou não cumpre as regras dos campos | erro |
   | 404 | não existe nenhuma cena com esse código | erro |
   | 409 | uma escolha leva a uma cena que não existe | erro |

   ## DELETE /api/cenas/:codigo

   Apaga uma cena.

   | Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
   | --- | --- | --- | --- | --- |
   | `codigo` | rota | texto | sim | o código de uma cena |

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 204 | a cena foi apagada | sem corpo |
   | 404 | não existe nenhuma cena com esse código | erro |
   | 409 | é a cena `inicio`, onde a história começa | erro |
   | 409 | uma escolha de outra cena leva a ela | erro |
   ```

   Os 409 são de três tipos, e dizem o que partiria a história. São duas cenas com o mesmo código, uma escolha que leva a uma cena que não existe, e o início ou uma cena de destino apagados.

### Paragem 1

O contrato tem os sete pedidos da API, os quatro que já tinha e os três novos, e a regra de cada campo do corpo. Compara o teu com o [contrato da pasta fechado-na-escola-passo-04](../../exemplos/acesso-a-dados/fechado-na-escola-passo-04/contrato-da-api.md), nos exemplos: o dele tem, a mais, a imagem do cabeçalho e a do rodapé.

Pensa antes de continuares: o `DELETE /api/cenas/fim-ginasio` vai dar 409, porque a cena `escadas` tem uma escolha que leva lá. Porque é que não é um 400? A resposta: o pedido está bem escrito, e são os dados, como estão agora, que não o deixam passar. Se a escolha das escadas deixar de levar ao ginásio, o mesmo pedido passa e dá 204.

## Fase 2: A base de teste reconstrói-se com o seed

O jogo passa para uma base de teste, a `fechado-na-escola-teste`, onde vais criar, alterar e apagar cenas à vontade, porque o seed a reconstrói. O seed ganha uma verificação: só corre numa base acabada em `-teste`. Rever: [A base de teste reconstrói-se com o seed](../05-ligacao-segura-crud-e-regras-de-dominio.md#a-base-de-teste-reconstrói-se-com-o-seed).

1. Em `src/seed.js`, substitui o bloco `try { ... } catch` por este, que verifica o nome da base antes de apagar:

   ```js
   try {
     await ligarBaseDeDados();
     // O seed apaga todas as cenas da base onde está ligado. Para um engano no
     // DB_NAME não apagar outra base, só continua se o nome acabar em -teste.
     const nomeDaBase = mongoose.connection.name;
     if (!nomeDaBase.endsWith("-teste")) {
       console.error(`O seed só corre numa base de teste, e esta é a ${nomeDaBase}. Muda o DB_NAME no .env.`);
     } else {
       // O filtro vazio, {}, escolhe todos os documentos: apaga todas as cenas.
       const apagadas = await Cena.deleteMany({});
       console.log(`Apagadas ${apagadas.deletedCount} cenas`);
       // O insertMany verifica cada cena com as regras do schema antes de inserir.
       const inseridas = await Cena.insertMany(cenas);
       console.log(`Inseridas ${inseridas.length} cenas`);
     }
   } catch (erro) {
   ```

   O resto do ficheiro fica como estava: as cenas por cima, e o `console.error` do `catch` e o `disconnect` por baixo. Muda também as quatro linhas de comentário do início do ficheiro, que passam a dizer o que ele faz agora:

   ```js
   // src/seed.js: reconstrói a base de teste do jogo com as cenas da história.
   // Corre-se à parte, com npm run seed. Apaga primeiro as cenas que lá
   // estiverem, por isso pode correr-se as vezes que for preciso: depois de cada
   // experiência, a base volta a ficar como estava no início.
   ```

2. O teu `.env` ainda diz `DB_NAME=fechado-na-escola`. Prevê o que o seed escreve agora. Depois, no primeiro terminal, corre:

   ```bash
   npm run seed
   ```

   O que deves ver:

   ```text
   Ligada à base de dados fechado-na-escola
   O seed só corre numa base de teste, e esta é a fechado-na-escola. Muda o DB_NAME no .env.
   ```

   O nome da base não acaba em `-teste`, e o seed não apagou nada: as cenas da `fechado-na-escola` ficam como estavam no fim do passo 3. Se aparecer `Apagadas 11 cenas`, a verificação não está no sítio certo: confirma que o `deleteMany` ficou dentro do `else`.

3. No `.env`, muda a linha do nome da base para:

   ```text
   DB_NAME=fechado-na-escola-teste
   ```

   No `.env.example`, que vai para o Git, muda a mesma linha e o comentário por cima dela:

   ```text
   # Nome da base de dados no Atlas. A cadeia de ligação não o diz.
   # É a base de teste, que o seed reconstrói: só corre numa base acabada em -teste.
   DB_NAME=fechado-na-escola-teste
   ```

4. Em `src/db/mongoose.js`, substitui o comentário e a linha do `mongoose.connect` por estes, para o jogo usar a base de teste quando falta o `DB_NAME`:

   ```js
     // A cadeia que o Atlas te dá não diz que base de dados usar. Sem o dbName,
     // o Mongoose usava uma base chamada test, que está vazia. Sem o DB_NAME,
     // o jogo usa a base de teste, onde se pode errar à vontade.
     await mongoose.connect(uri, { dbName: process.env.DB_NAME || "fechado-na-escola-teste" });
   ```

5. Corre outra vez o seed, duas vezes seguidas:

   ```bash
   npm run seed
   npm run seed
   ```

   O que deves ver: da primeira vez, `Ligada à base de dados fechado-na-escola-teste`, `Apagadas 0 cenas` e `Inseridas 11 cenas`. O MongoDB criou a base de teste sozinho, ao inserir as cenas. Da segunda, `Apagadas 11 cenas` e `Inseridas 11 cenas`: o seed reconstrói a base, sem repetir cenas.

6. Liga agora o jogo, no mesmo terminal, e deixa-o a correr até ao fim do laboratório:

   ```bash
   npm run dev
   ```

   O que deves ver: `Ligada à base de dados fechado-na-escola-teste` e `Fechado na escola em http://localhost:3000`. No browser, `http://localhost:3000/api/cenas/inicio` mostra a primeira cena, e `http://localhost:3000/` a página inicial do jogo, como no passo 3.

7. No Atlas, no menu lateral, na secção "Database", abre o "Data Explorer" e carrega no botão de atualizar. O que deves ver: as duas bases, a `fechado-na-escola` e a `fechado-na-escola-teste`, cada uma com a coleção `cenas` e onze documentos. Daqui em diante, o jogo só mexe na de teste.

### Paragem 2

O jogo está ligado à base de teste, e o seed reconstrói-a com as onze cenas. Numa base com outro nome, o seed recusa-se a apagar.

Pensa antes de continuares: se faltar a linha do `DB_NAME` no `.env`, a que base se liga o jogo, e o seed corre? A resposta: o jogo liga-se à `fechado-na-escola-teste`, o valor que a `ligarBaseDeDados` usa quando falta o `DB_NAME`. O nome acaba em `-teste`, e por isso o seed corre.

## Fase 3: Só passam os campos de uma lista fechada

Crias o primeiro pedido que escreve na base, o `POST /api/cenas`. O corpo do pedido chega em `req.body`, e o controller copia dele só os campos de uma lista fechada, cada um com o tipo do contrato. Rever: [O corpo do pedido chega em `req.body`](../05-ligacao-segura-crud-e-regras-de-dominio.md#o-corpo-do-pedido-chega-em-reqbody), [Só passam os campos de uma lista fechada](../05-ligacao-segura-crud-e-regras-de-dominio.md#só-passam-os-campos-de-uma-lista-fechada) e [O POST cria o documento e responde 201](../05-ligacao-segura-crud-e-regras-de-dominio.md#o-post-cria-o-documento-e-responde-201).

1. Em `src/server.js`, a seguir ao middleware de registo, acrescenta o middleware que lê o corpo:

   ```js
   // Lê o corpo dos pedidos que chegam em JSON e põe-no em req.body, já como
   // objeto. Sem esta linha, o req.body ficava undefined em todos os pedidos.
   // Fica depois do registo, para o terminal mostrar também os pedidos cujo
   // corpo não se consegue ler.
   app.use(express.json());
   ```

   Guarda. O que deves ver: o jogo reinicia sozinho, com as duas linhas do arranque.

2. Os pedidos com corpo fazem-se na consola do browser. Abre `http://localhost:3000/api/estado`, para a consola estar numa página do teu jogo. Nas ferramentas de programador, abre o separador "Consola" ("Console") e cola esta função:

   ```js
   // Faz um pedido à API e escreve na consola o código e o corpo da resposta.
   async function pedir(metodo, caminho, corpo) {
     const opcoes = { method: metodo };
     if (corpo !== undefined) {
       // O cabeçalho diz à API que o corpo vem em JSON. O JSON.stringify
       // escreve o objeto como texto JSON, que é o que viaja no pedido.
       opcoes.headers = { "Content-Type": "application/json" };
       opcoes.body = JSON.stringify(corpo);
     }
     const resposta = await fetch(caminho, opcoes);
     const texto = await resposta.text();
     console.log(resposta.status, texto);
   }
   ```

   Carrega em Enter. A consola responde `undefined`: a função ficou guardada, mas ainda não correu. Experimenta-a com um pedido que já conheces:

   ```js
   await pedir("GET", "/api/cenas/inicio");
   ```

   O que deves ver: `200` e a cena `inicio` em JSON, e por baixo outro `undefined`, que podes ignorar. Se a consola não te deixar colar, vê [A consola não deixa colar](#a-consola-não-deixa-colar).

   Este separador fica para a consola até ao fim do laboratório, porque mudar de página, ou recarregá-la, apaga o que lá colaste. As páginas que os passos seguintes mandam abrir abrem-se noutro separador.

3. A cena nova é o arquivo, uma sala atrás da secretaria. Guarda-a numa variável, na consola, para não a escreveres em cada pedido:

   ```js
   const arquivo = {
     codigo: "arquivo",
     titulo: "O arquivo",
     texto: "Atrás da secretaria há uma porta estreita. Lá dentro, caixas com testes de outros anos chegam ao teto, e numa prateleira há uma lanterna a pilhas.",
     final: false,
     escolhas: [{ texto: "Voltar à secretaria", destino: "secretaria" }],
   };
   ```

   Depois, tenta criá-la:

   ```js
   await pedir("POST", "/api/cenas", arquivo);
   ```

   O que deves ver: `404 {"erro":"Rota não encontrada"}`. O router das cenas só tem rotas `GET`, e um pedido responde-se pelo método e pelo caminho: nenhuma rota serve um `POST` para `/api/cenas`. A consola mostra também uma linha a vermelho, `Failed to load resource`. O browser assinala assim as respostas com um código de erro, e o que te interessa é a linha que a `pedir` escreve.

4. No repository, o `create` do Mongoose insere a cena. No fim de `src/repositories/cenas.repository.js`, acrescenta:

   ```js
   /**
    * Insere uma cena nova. O schema verifica as regras de cada campo antes de
    * inserir; se alguma falhar, a promessa é rejeitada com um ValidationError.
    * @param {object} dados os campos da cena, só os da lista do controller
    * @returns {Promise<object>} a cena inserida, já com o _id que o MongoDB lhe deu
    */
   export async function inserirCena(dados) {
     const cena = await Cena.create(dados);
     return cena;
   }
   ```

5. No service, a função que cria passa os dados ao repository. Em `src/services/cenas.service.js`, substitui a linha do `import` por esta, que pede também a `inserirCena`:

   ```js
   import {
     procurarTodas,
     procurarPorCodigo,
     inserirCena,
   } from "../repositories/cenas.repository.js";
   ```

   E acrescenta, no fim do ficheiro:

   ```js
   /**
    * Cria uma cena nova com os campos recebidos.
    * @param {object} dados os campos da cena, já com o tipo verificado pelo controller
    * @returns {Promise<object>} a cena criada
    */
   export async function criarCena(dados) {
     const cena = await inserirCena(dados);
     return cena;
   }
   ```

6. No controller, a lista fechada lê o corpo, e a função `criar` responde 201. Em `src/controllers/cenas.controller.js`, substitui a linha do `import` por esta:

   ```js
   import { listarCenas, obterCena, cenaSeguinte, criarCena } from "../services/cenas.service.js";
   ```

   A seguir ao `import`, antes da função `listar`, acrescenta a lista e a função que lê os campos:

   ```js
   // Os campos que o corpo de um pedido pode trazer, para criar ou alterar uma
   // cena. É uma lista fechada: um campo que não esteja aqui é recusado.
   const CAMPOS_DE_TEXTO = ["codigo", "titulo", "texto"];

   /**
    * Lê do corpo do pedido os campos de uma cena: só os da lista, cada um com o tipo certo.
    * Não verifica os valores, como os comprimentos ou os campos em falta: essas
    * são regras do jogo, e quem as verifica é o schema do modelo.
    * @param {unknown} corpo o req.body, tal como o express.json() o deixou
    * @returns {object} { erro } com a mensagem do primeiro problema, ou { dados } com os campos lidos
    */
   function lerCamposDaCena(corpo) {
     // Sem corpo em JSON, o req.body fica undefined.
     if (typeof corpo !== "object" || corpo === null || Array.isArray(corpo)) {
       return { erro: "O corpo do pedido tem de ser um objeto JSON" };
     }
     // O objeto dados recebe só os campos da lista, copiados um a um.
     // O req.body nunca segue inteiro para o service.
     const dados = {};
     for (const campo of Object.keys(corpo)) {
       const valor = corpo[campo];
       if (CAMPOS_DE_TEXTO.includes(campo)) {
         // Um objeto no lugar de um texto, como { "$ne": null }, é recusado aqui.
         if (typeof valor !== "string") {
           return { erro: `O campo ${campo} tem de ser um texto` };
         }
         dados[campo] = valor;
       } else if (campo === "final") {
         if (typeof valor !== "boolean") {
           return { erro: "O campo final tem de ser true ou false" };
         }
         dados.final = valor;
       } else {
         return { erro: `O campo ${campo} não é aceite` };
       }
     }
     return { dados: dados };
   }
   ```

   E, no fim do ficheiro, a função do pedido:

   ```js
   /** POST /api/cenas, com a cena nova no corpo, em JSON */
   export async function criar(req, res) {
     const leitura = lerCamposDaCena(req.body);
     if (leitura.erro) {
       res.status(400).json({ erro: leitura.erro });
       return;
     }
     const cena = await criarCena(leitura.dados);
     res.status(201).json(cena);
   }
   ```

   O `final` tem um ramo próprio, porque é o único booleano da lista.

7. Em `src/rotas/cenas.rotas.js`, junta a `criar` ao `import` do controller e acrescenta a rota, a seguir às três que já lá estão:

   ```js
   import { listar, obter, escolher, criar } from "../controllers/cenas.controller.js";
   ```

   ```js
   router.post("/", criar);
   ```

   Guarda os ficheiros, e confirma no primeiro terminal que o jogo reiniciou sem erros.

8. Na consola, cola outra vez o pedido do arquivo:

   ```js
   await pedir("POST", "/api/cenas", arquivo);
   ```

   O que deves ver: `400 {"erro":"O campo escolhas não é aceite"}`. A lista fechada funciona: as `escolhas` ainda não estão nela, e o pedido é recusado sem chegar à base.

9. As escolhas são uma lista, e cada escolha tem os seus campos. A lista fechada vale também dentro delas. Na `lerCamposDaCena`, logo antes da linha `} else {` do campo que não é aceite, acrescenta o ramo das escolhas:

   ```js
       } else if (campo === "escolhas") {
         if (!Array.isArray(valor)) {
           return { erro: "O campo escolhas tem de ser uma lista" };
         }
         // A lista fechada vale também dentro de cada escolha: só o texto e o
         // destino, os dois em texto. Cada escolha é copiada para um objeto novo.
         const escolhas = [];
         for (const escolha of valor) {
           if (
             typeof escolha !== "object" ||
             escolha === null ||
             Object.keys(escolha).length !== 2 ||
             typeof escolha.texto !== "string" ||
             typeof escolha.destino !== "string"
           ) {
             return { erro: "Cada escolha tem só o texto e o destino, os dois em texto" };
           }
           escolhas.push({ texto: escolha.texto, destino: escolha.destino });
         }
         dados.escolhas = escolhas;
   ```

   A condição comprida lê-se pela ordem. A escolha tem de ser um objeto, que não seja `null`, com dois campos. Esses dois têm de ser o `texto` e o `destino`, em texto. Com dois campos e os dois certos, não sobra lugar para um terceiro.

10. Guarda e repete o pedido do arquivo. O que deves ver: `201` e a cena criada, com os teus campos, o `_id` que o MongoDB lhe deu e o `"__v":0`. Confirma-o na consola, com `await pedir("GET", "/api/cenas/arquivo");`, e abre, num separador novo, a página `http://localhost:3000/cenas/arquivo`. O que deves ver: `200` e a cena em JSON, na consola, e a página do arquivo, com a ligação "Voltar à secretaria". As páginas do passo 3 usam o mesmo service, e por isso mostram a cena nova sem mudares nada nelas.

11. Prevê o que respondem estes três pedidos, e depois faz cada um:

    ```js
    await pedir("POST", "/api/cenas", { codigo: "cave", titulo: "A cave", texto: "Escuro.", final: "não" });
    await pedir("POST", "/api/cenas", { codigo: { $ne: null }, titulo: "A cave", texto: "Escuro.", final: true });
    await pedir("POST", "/api/cenas", { codigo: "cave", titulo: "A cave", texto: "Escuro.", final: false, escolhas: [{ texto: "Subir", destino: "corredor", luz: true }] });
    ```

    A resposta: os três dão 400. O primeiro, `{"erro":"O campo final tem de ser true ou false"}`, porque `"não"` é um texto, e não um booleano. O segundo, `{"erro":"O campo codigo tem de ser um texto"}`: o objeto com o `$ne` é recusado antes de chegar a qualquer consulta. O terceiro, `{"erro":"Cada escolha tem só o texto e o destino, os dois em texto"}`, por causa do campo `luz`. Nenhum criou a cave: `/api/cenas/cave` continua a dar 404.

### Paragem 3

O `POST /api/cenas` cria uma cena com 201, e a lista fechada recusa com 400 os campos que não conhece e os tipos errados, também dentro das escolhas. A cena do arquivo está na base de teste e tem página no jogo.

O ficheiro `src/controllers/cenas.controller.js` completo, como deve estar agora:

```js
// src/controllers/cenas.controller.js: a ponte entre o HTTP e o service.
// Lê e verifica o que vem no pedido, chama o service e escolhe a resposta,
// sempre em JSON, como diz o contrato.
import { listarCenas, obterCena, cenaSeguinte, criarCena } from "../services/cenas.service.js";

// Os campos que o corpo de um pedido pode trazer, para criar ou alterar uma
// cena. É uma lista fechada: um campo que não esteja aqui é recusado.
const CAMPOS_DE_TEXTO = ["codigo", "titulo", "texto"];

/**
 * Lê do corpo do pedido os campos de uma cena: só os da lista, cada um com o tipo certo.
 * Não verifica os valores, como os comprimentos ou os campos em falta: essas
 * são regras do jogo, e quem as verifica é o schema do modelo.
 * @param {unknown} corpo o req.body, tal como o express.json() o deixou
 * @returns {object} { erro } com a mensagem do primeiro problema, ou { dados } com os campos lidos
 */
function lerCamposDaCena(corpo) {
  // Sem corpo em JSON, o req.body fica undefined.
  if (typeof corpo !== "object" || corpo === null || Array.isArray(corpo)) {
    return { erro: "O corpo do pedido tem de ser um objeto JSON" };
  }
  // O objeto dados recebe só os campos da lista, copiados um a um.
  // O req.body nunca segue inteiro para o service.
  const dados = {};
  for (const campo of Object.keys(corpo)) {
    const valor = corpo[campo];
    if (CAMPOS_DE_TEXTO.includes(campo)) {
      // Um objeto no lugar de um texto, como { "$ne": null }, é recusado aqui.
      if (typeof valor !== "string") {
        return { erro: `O campo ${campo} tem de ser um texto` };
      }
      dados[campo] = valor;
    } else if (campo === "final") {
      if (typeof valor !== "boolean") {
        return { erro: "O campo final tem de ser true ou false" };
      }
      dados.final = valor;
    } else if (campo === "escolhas") {
      if (!Array.isArray(valor)) {
        return { erro: "O campo escolhas tem de ser uma lista" };
      }
      // A lista fechada vale também dentro de cada escolha: só o texto e o
      // destino, os dois em texto. Cada escolha é copiada para um objeto novo.
      const escolhas = [];
      for (const escolha of valor) {
        if (
          typeof escolha !== "object" ||
          escolha === null ||
          Object.keys(escolha).length !== 2 ||
          typeof escolha.texto !== "string" ||
          typeof escolha.destino !== "string"
        ) {
          return { erro: "Cada escolha tem só o texto e o destino, os dois em texto" };
        }
        escolhas.push({ texto: escolha.texto, destino: escolha.destino });
      }
      dados.escolhas = escolhas;
    } else {
      return { erro: `O campo ${campo} não é aceite` };
    }
  }
  return { dados: dados };
}

/** GET /api/cenas */
export async function listar(req, res) {
  const cenas = await listarCenas();
  res.json(cenas);
}

/** GET /api/cenas/:codigo */
export async function obter(req, res) {
  const codigo = req.params.codigo;
  const cena = await obterCena(codigo);
  if (cena === null) {
    res.status(404).json({ erro: `Não existe a cena ${codigo}` });
    return;
  }
  res.json(cena);
}

/** GET /api/cenas/:codigo/escolhas/:numero */
export async function escolher(req, res) {
  const codigo = req.params.codigo;
  const numero = Number(req.params.numero); // chega como texto, "2", e passa a número
  if (!Number.isInteger(numero) || numero < 1) {
    res.status(400).json({ erro: "O número da escolha tem de ser um número inteiro maior do que 0" });
    return;
  }
  const cena = await obterCena(codigo);
  if (cena === null) {
    res.status(404).json({ erro: `Não existe a cena ${codigo}` });
    return;
  }
  const seguinte = await cenaSeguinte(cena, numero);
  if (seguinte === null) {
    res.status(404).json({ erro: `A cena ${codigo} não tem a escolha ${numero}` });
    return;
  }
  res.json(seguinte);
}

/** POST /api/cenas, com a cena nova no corpo, em JSON */
export async function criar(req, res) {
  const leitura = lerCamposDaCena(req.body);
  if (leitura.erro) {
    res.status(400).json({ erro: leitura.erro });
    return;
  }
  const cena = await criarCena(leitura.dados);
  res.status(201).json(cena);
}
```

O pedido entra pela `criar`, que entrega o `req.body` à `lerCamposDaCena` e só continua com os `dados` que ela copiou. As três funções do meio são as do passo 2, e não mudaram.

Pensa antes de continuares: um `POST` com `{ "codigo": "cave", "titulo": "", "texto": "", "final": false }` passa a lista fechada? A resposta: passa. Os quatro campos estão na lista, e os três textos são textos, mesmo vazios. A lista fechada vê a forma do pedido, e não os valores.

## Fase 4: O middleware de erros responde em JSON

Provocas dois erros, um corpo que não é JSON e uma falha dentro do servidor, e vês que o Express responde com uma página HTML. Depois acrescentas ao `server.js` o middleware de erros, com quatro parâmetros, que responde em JSON, como diz o contrato. Rever: [O middleware de erros responde em JSON](../05-ligacao-segura-crud-e-regras-de-dominio.md#o-middleware-de-erros-responde-em-json).

1. A `pedir` escreve sempre o corpo com o `JSON.stringify`, e por isso nunca envia um corpo partido. Para o provocar, cola na consola esta função, que envia o texto do corpo tal e qual:

   ```js
   // Envia um POST com um corpo escrito à mão, sem o JSON.stringify da pedir.
   async function pedirComTexto(caminho, texto) {
     const opcoes = { method: "POST", headers: { "Content-Type": "application/json" }, body: texto };
     const resposta = await fetch(caminho, opcoes);
     console.log(resposta.status, await resposta.text());
   }
   ```

   E envia um corpo sem as aspas que o JSON pede:

   ```js
   await pedirComTexto("/api/cenas", "{ codigo: arquivo }");
   ```

   O que deves ver: `400` e o código de uma página HTML, que começa por `<!DOCTYPE html>`. A meio, tem `SyntaxError` e várias partes começadas por `at`, separadas por `<br>`, com caminhos da pasta `node_modules` do teu projeto. O primeiro terminal mostra o mesmo erro. Quem respondeu foi o tratamento de erros do próprio Express, e não o contrato.

2. Agora uma falha dentro do servidor. Em `src/repositories/cenas.repository.js`, na `procurarTodas`, troca `Cena.find({})` por `Cena.fnd({})`, com o nome mal escrito, e guarda. Na consola, pede a lista das cenas:

   ```js
   await pedir("GET", "/api/cenas");
   ```

   O que deves ver: `500` e o código de uma página HTML, com `TypeError: Cena.fnd is not a function` (não é uma função). Segue-se uma série de partes começadas por `at`, uma delas com o caminho do teu repository. A resposta é uma página, quando o contrato pede JSON, e mostra a quem pede os caminhos dos teus ficheiros.

3. Em `src/server.js`, a seguir ao middleware final, acrescenta o middleware de erros:

   ```js
   // Middleware de erros: o Express só o chama quando um pedido acabou num erro,
   // e reconhece-o pelos quatro parâmetros. Responde sempre em JSON, sem
   // pormenores internos.
   app.use((erro, req, res, next) => {
     // O express.json() não conseguiu ler o corpo: o texto não era JSON.
     if (erro.type === "entity.parse.failed") {
       res.status(400).json({ erro: "O corpo do pedido não é JSON válido" });
       return;
     }
     // Qualquer outro erro é um problema do servidor, e não de quem pediu.
     // A razão fica no terminal, para quem programa; o cliente recebe só o 500.
     console.error(`Erro interno: ${erro.message}`);
     res.status(500).json({ erro: "Erro interno do servidor" });
   });
   ```

   Fica depois de todas as rotas e do middleware final. O `next` não é usado, mas tem de estar na lista.

   No comentário do início do ficheiro, troca a última linha, `// e só depois à porta. As regras e as consultas estão nas camadas.`, por estas duas:

   ```js
   // e só depois à porta. As regras e as consultas estão nas camadas, e os erros
   // dos pedidos à API acabam no middleware de erros, no fim deste ficheiro.
   ```

4. Guarda e repete, na consola, o pedido da lista. O que deves ver: `500 {"erro":"Erro interno do servidor"}`. No primeiro terminal, `Erro interno: Cena.fnd is not a function`. A causa continua a ser o nome mal escrito, mas agora fica no terminal, e quem pede só recebe o 500 do contrato.

5. Prevê o que dá agora o corpo partido. Depois, na consola, repete-o:

   ```js
   await pedirComTexto("/api/cenas", "{ codigo: arquivo }");
   ```

   A resposta: `400 {"erro":"O corpo do pedido não é JSON válido"}`. O `express.json()` não conseguiu ler o corpo e passou o erro ao middleware de erros, que o reconheceu pelo `type`.

6. Repõe `Cena.find({})` no repository, guarda e repete o pedido da lista. O que deves ver: `200` e a lista, agora com doze cenas, as do seed e o arquivo.

### Paragem 4

Um corpo que não é JSON dá 400, e uma falha no servidor dá 500, os dois em JSON e sem os caminhos dos teus ficheiros. A razão da falha fica no terminal.

Pensa antes de continuares: porque é que a resposta 500 não leva a mensagem do erro, como `Cena.fnd is not a function`? A resposta: a mensagem interessa a quem programa, e está no terminal. Quem usa o jogo não precisa dela, e uma mensagem interna pode mostrar nomes de ficheiros, de funções ou de coleções a quem o quer atacar.

## Fase 5: As regras de cada campo ficam no schema

Mostras que a API aceita uma cena sem título nem texto, e passas as regras de cada campo para o schema do modelo. O middleware de erros ganha um caso, para o `ValidationError` do Mongoose responder 400. Rever: [As regras de cada campo ficam no schema](../05-ligacao-segura-crud-e-regras-de-dominio.md#as-regras-de-cada-campo-ficam-no-schema).

1. Na consola, cria uma cena só com espaços no título e sem texto:

   ```js
   await pedir("POST", "/api/cenas", { codigo: "vazia", titulo: "   ", texto: "", final: false });
   ```

   O que deves ver: `201`, e a cena criada, com o título `"   "` e o texto `""`. No outro separador, a página `http://localhost:3000/cenas/vazia` tem um título em branco, nenhum texto e nenhuma escolha: o jogador ficava preso numa cena que não diz nada. A lista fechada deixou passar, porque os campos e os tipos estão certos.

2. As regras passam para o modelo. Em `src/models/cena.model.js`, substitui o `escolhaSchema` por esta versão, com as regras de cada escolha:

   ```js
   const escolhaSchema = new mongoose.Schema(
     {
       texto: {
         type: String,
         // O segundo valor de cada regra é a mensagem que a API devolve quando
         // a regra falha. Sem ele, o Mongoose escrevia uma mensagem em inglês.
         required: [true, "O texto de cada escolha é obrigatório"],
         // O trim tira os espaços do início e do fim antes de verificar e guardar.
         trim: true,
         maxlength: [80, "O texto de uma escolha tem no máximo 80 carateres"],
       },
       destino: {
         type: String,
         required: [true, "O destino de cada escolha é obrigatório"],
         trim: true,
       },
     },
     { _id: false },
   );
   ```

3. No mesmo ficheiro, substitui o `cenaSchema` por este, em que cada campo deixa de ter só o tipo e passa a ter também as regras:

   ```js
   const cenaSchema = new mongoose.Schema({
     // O código identifica a cena no jogo, como "corredor" ou "sala-12".
     // É por ele que as escolhas apontam umas para as outras.
     codigo: {
       type: String,
       required: [true, "O código é obrigatório"],
       trim: true,
       maxlength: [30, "O código tem no máximo 30 carateres"],
     },
     titulo: {
       type: String,
       required: [true, "O título é obrigatório"],
       trim: true,
       maxlength: [60, "O título tem no máximo 60 carateres"],
     },
     texto: {
       type: String,
       required: [true, "O texto é obrigatório"],
       trim: true,
       maxlength: [600, "O texto tem no máximo 600 carateres"],
     },
     // Uma cena final acaba a partida, e não tem escolhas.
     final: {
       type: Boolean,
       required: [true, "Falta dizer se a cena é final"],
     },
     // Sem escolhas no pedido, o Mongoose guarda uma lista vazia.
     escolhas: [escolhaSchema],
   });
   ```

   Muda também a última linha do comentário do início do ficheiro, que passa a ter mais uma frase:

   ```js
   // escolhas que o jogador pode fazer a seguir. O schema guarda também as regras
   // de cada campo, e tudo o que escreve cenas passa por elas: a API e o seed.
   ```

   Guarda. O jogo reinicia, sem nenhuma linha de erro no terminal.

4. Repete o pedido da cena vazia, agora com o código `vazia-2`:

   ```js
   await pedir("POST", "/api/cenas", { codigo: "vazia-2", titulo: "   ", texto: "", final: false });
   ```

   O que deves ver: `500 {"erro":"Erro interno do servidor"}`, e no primeiro terminal uma linha começada por `Erro interno: Cena validation failed`, com as mensagens do título e do texto. O schema recusou a cena, e `/api/cenas/vazia-2` dá 404. Mas a resposta diz que a culpa é do servidor, quando foi o pedido que não cumpriu as regras.

5. O erro que o schema lança chama-se `ValidationError`. Em `src/server.js`, no middleware de erros, entre o caso do corpo partido e o comentário "Qualquer outro erro", acrescenta:

   ```js
     // Uma ou mais regras do schema falharam. O erro traz, em erro.errors, um
     // objeto com um campo por cada regra que falhou, e cada um tem a mensagem
     // que escreveste no schema. A resposta junta-as todas num só texto.
     if (erro.name === "ValidationError") {
       const mensagens = Object.values(erro.errors).map((falha) => falha.message);
       res.status(400).json({ erro: mensagens.join(". ") });
       return;
     }
   ```

6. Guarda e repete o pedido da `vazia-2`. O que deves ver: `400 {"erro":"O título é obrigatório. O texto é obrigatório"}`. O `trim` tirou os espaços do título, que ficou vazio, e o `required` recusou-o. As duas mensagens vêm juntas, pela ordem que o Mongoose escolheu.

7. Prevê o que responde esta cena, com uma escolha sem texto:

   ```js
   await pedir("POST", "/api/cenas", { codigo: "cave", titulo: "A cave", texto: "Escuro.", final: false, escolhas: [{ texto: "", destino: "corredor" }] });
   ```

   A resposta: `400 {"erro":"O texto de cada escolha é obrigatório"}`. A escolha passa a lista fechada, porque tem os dois campos e os dois são texto. O schema verifica cada escolha com as regras do `escolhaSchema`.

### Paragem 5

O schema recusa os valores que não servem, e a API responde 400 com as mensagens das regras. A lista fechada vê a forma do pedido, e o schema vê os valores.

O ficheiro `src/server.js` completo, como deve estar agora:

```js
// src/server.js: o ponto de arranque do jogo Fechado na escola.
// Cria a aplicação Express, monta as rotas da API e as das páginas, liga-se à base de dados
// e só depois à porta. As regras e as consultas estão nas camadas, e os erros
// dos pedidos à API acabam no middleware de erros, no fim deste ficheiro.
import express from "express";
import { ligarBaseDeDados } from "./db/mongoose.js";
import cenasRotas from "./rotas/cenas.rotas.js";
import paginasRotas from "./rotas/paginas.rotas.js";

const app = express();

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, o jogo usa a 3000.
const PORTA = process.env.PORT || 3000;

// O motor dos modelos das páginas. O Express procura os modelos na pasta
// views da pasta de onde arrancas o servidor, que é a raiz do projeto.
app.set("view engine", "ejs");

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Lê o corpo dos pedidos que chegam em JSON e põe-no em req.body, já como
// objeto. Sem esta linha, o req.body ficava undefined em todos os pedidos.
// Fica depois do registo, para o terminal mostrar também os pedidos cujo
// corpo não se consegue ler.
app.use(express.json());

// Rota de estado: serve para confirmar que o servidor está ligado e a responder.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "Fechado na escola" });
});

// Todos os pedidos começados por /api/cenas seguem para o router das cenas.
app.use("/api/cenas", cenasRotas);

// As páginas do jogo: os pedidos que a API não atendeu seguem para o router das páginas.
app.use("/", paginasRotas);

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
// Os endereços da API começam todos por /api/ e respondem em JSON, como diz
// o contrato. Os outros são páginas do jogo, e respondem com a página de erro.
app.use((req, res) => {
  if (req.url.startsWith("/api/")) {
    res.status(404).json({ erro: "Rota não encontrada" });
    return;
  }
  res.status(404).render("erro", {
    titulo: "Página não encontrada",
    mensagem: "Este endereço não existe no jogo.",
  });
});

// Middleware de erros: o Express só o chama quando um pedido acabou num erro,
// e reconhece-o pelos quatro parâmetros. Responde sempre em JSON, sem
// pormenores internos.
app.use((erro, req, res, next) => {
  // O express.json() não conseguiu ler o corpo: o texto não era JSON.
  if (erro.type === "entity.parse.failed") {
    res.status(400).json({ erro: "O corpo do pedido não é JSON válido" });
    return;
  }
  // Uma ou mais regras do schema falharam. O erro traz, em erro.errors, um
  // objeto com um campo por cada regra que falhou, e cada um tem a mensagem
  // que escreveste no schema. A resposta junta-as todas num só texto.
  if (erro.name === "ValidationError") {
    const mensagens = Object.values(erro.errors).map((falha) => falha.message);
    res.status(400).json({ erro: mensagens.join(". ") });
    return;
  }
  // Qualquer outro erro é um problema do servidor, e não de quem pediu.
  // A razão fica no terminal, para quem programa; o cliente recebe só o 500.
  console.error(`Erro interno: ${erro.message}`);
  res.status(500).json({ erro: "Erro interno do servidor" });
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

Um pedido percorre o ficheiro de cima para baixo: o registo, a leitura do corpo, as rotas da API e das páginas, e o middleware final. Só um pedido que acaba num erro salta para o middleware de erros, no fim.

Pensa antes de continuares: porque é que as regras dos campos ficam no schema, e não no controller, ao lado da lista fechada? A resposta: no schema, protegem tudo o que escreve cenas, também o seed. No controller, só protegiam os pedidos que passam por ele.

## Fase 6: Alterar um documento pede duas opções

Crias o `PATCH /api/cenas/:codigo` e usas-o para ligar a secretaria ao arquivo. Escrito só com os dois primeiros argumentos, o `findOneAndUpdate` tem duas surpresas, e a documentação do Mongoose diz que opções as resolvem. Rever: [Alterar um documento pede duas opções](../05-ligacao-segura-crud-e-regras-de-dominio.md#alterar-um-documento-pede-duas-opções).

1. O `findOneAndUpdate` procura um documento com um filtro e muda os campos recebidos, como o `findByIdAndUpdate` do guia, mas pelo filtro que lhe dás. No fim de `src/repositories/cenas.repository.js`, acrescenta esta primeira versão:

   ```js
   /**
    * Altera os campos recebidos de uma cena, e deixa os outros como estão.
    * @param {string} codigo o código da cena
    * @param {object} dados os campos a alterar, só os da lista do controller
    * @returns {Promise<object | null>} a cena, ou null se não existir
    */
   export async function alterarPorCodigo(codigo, dados) {
     const cena = await Cena.findOneAndUpdate({ codigo: codigo }, dados);
     return cena;
   }
   ```

2. Em `src/services/cenas.service.js`, substitui o `import` por este:

   ```js
   import {
     procurarTodas,
     procurarPorCodigo,
     inserirCena,
     alterarPorCodigo,
   } from "../repositories/cenas.repository.js";
   ```

   E acrescenta, no fim do ficheiro:

   ```js
   /**
    * Altera os campos recebidos de uma cena.
    * @param {string} codigo o código da cena
    * @param {object} dados os campos a alterar, já com o tipo verificado pelo controller
    * @returns {Promise<object | null>} a cena alterada, ou null se não existir
    */
   export async function alterarCena(codigo, dados) {
     const cena = await alterarPorCodigo(codigo, dados);
     return cena;
   }
   ```

3. No controller, a `alterar` usa a mesma lista fechada, com duas verificações a mais: o `codigo` não pode vir, e tem de vir pelo menos um campo. Em `src/controllers/cenas.controller.js`, substitui o `import` por:

   ```js
   import { listarCenas, obterCena, cenaSeguinte, criarCena, alterarCena } from "../services/cenas.service.js";
   ```

   E acrescenta, no fim do ficheiro:

   ```js
   /** PATCH /api/cenas/:codigo, com os campos a alterar no corpo, em JSON */
   export async function alterar(req, res) {
     const codigo = req.params.codigo;
     const leitura = lerCamposDaCena(req.body);
     if (leitura.erro) {
       res.status(400).json({ erro: leitura.erro });
       return;
     }
     // O código identifica a cena, e as escolhas de outras cenas levam a ele.
     // Mudá-lo deixava essas escolhas a levar a uma cena que não existe.
     if (leitura.dados.codigo !== undefined) {
       res.status(400).json({ erro: "O código de uma cena não se altera" });
       return;
     }
     if (Object.keys(leitura.dados).length === 0) {
       res.status(400).json({ erro: "O pedido não traz nenhum campo para alterar" });
       return;
     }
     const cena = await alterarCena(codigo, leitura.dados);
     if (cena === null) {
       res.status(404).json({ erro: `Não existe a cena ${codigo}` });
       return;
     }
     res.json(cena);
   }
   ```

4. Em `src/rotas/cenas.rotas.js`, junta a `alterar` ao `import` do controller e acrescenta a rota, a seguir à do `POST`:

   ```js
   import { listar, obter, escolher, criar, alterar } from "../controllers/cenas.controller.js";
   ```

   ```js
   router.patch("/:codigo", alterar);
   ```

   Guarda os ficheiros. No primeiro terminal, o jogo volta a arrancar.

5. A secretaria ganha uma escolha para o arquivo. Como o `PATCH` substitui a lista inteira, o corpo leva as duas escolhas: a que a secretaria já tinha e a nova. Guarda a lista numa variável, na consola:

   ```js
   const secretaria = [
     { texto: "Levar a chave da sala 12 e voltar ao corredor", destino: "corredor" },
     { texto: "Abrir a porta do arquivo", destino: "arquivo" },
   ];
   ```

   E faz o pedido:

   ```js
   await pedir("PATCH", "/api/cenas/secretaria", { escolhas: secretaria });
   ```

   O que deves ver: `200`, mas a cena da resposta só tem a escolha antiga. Pede a secretaria outra vez, com `await pedir("GET", "/api/cenas/secretaria");`: aí já aparecem as duas. É a primeira surpresa: por omissão, o `findOneAndUpdate` devolve o documento como estava antes da alteração.

6. A segunda surpresa vê-se com um título vazio:

   ```js
   await pedir("PATCH", "/api/cenas/arquivo", { titulo: "" });
   ```

   O que deves ver: `200`, com o título antigo na resposta. Pede o arquivo com `await pedir("GET", "/api/cenas/arquivo");`, e vês que o título está mesmo vazio. Sem opções, o Mongoose não corre as regras do schema numa alteração: só as corre quando cria um documento.

7. As duas surpresas resolvem-se com opções, num terceiro argumento, e a documentação do Mongoose diz quais são. No segundo terminal, na pasta do jogo, vê que versão tens:

   ```bash
   npm ls mongoose
   ```

   O que deves ver: uma linha com `mongoose@9`, seguido do resto do número. Num separador novo, abre a página do `Model` na documentação do Mongoose, em `https://mongoosejs.com/docs/api/model.html`, e confirma no topo que é a da versão 9. Procura nela a secção `Model.findOneAndUpdate()`, com Ctrl+F (no Mac, Cmd+F). Em "Parameters", a lista das opções começa por `[options.returnDocument='before']`. Lê as opções e encontra as duas que fazem falta.

   A resposta: a `returnDocument` tem dois valores, `'before'` e `'after'`, e por omissão devolve o documento antes da alteração. A `runValidators`, com `true`, faz correr as regras do schema na alteração: a página chama-lhes "update validators", os validadores das alterações. A lista tem também a `new`, mais antiga, que faz o mesmo que a `returnDocument: "after"`. O Mongoose 9 avisa no terminal que a vai deixar de usar, e por isso o jogo usa a `returnDocument`.

8. Na `alterarPorCodigo`, substitui a linha do `findOneAndUpdate` pelas opções e pelo comentário que diz porque estão lá:

   ```js
     // Sem as duas opções, o findOneAndUpdate devolvia a cena como estava
     // antes da alteração, e não verificava as regras do schema, que por omissão
     // só correm quando um documento é criado.
     const cena = await Cena.findOneAndUpdate({ codigo: codigo }, dados, {
       returnDocument: "after",
       runValidators: true,
     });
   ```

   No comentário `/** */` da função, muda o `@returns` para dizer que devolve a cena depois da alteração:

   ```js
    * @returns {Promise<object | null>} a cena depois da alteração, ou null se não existir
   ```

9. Guarda e prevê o que responde agora o `PATCH` do título vazio. Depois repete-o:

   ```js
   await pedir("PATCH", "/api/cenas/arquivo", { titulo: "" });
   ```

   A resposta: `400 {"erro":"O título é obrigatório"}`, pelo mesmo middleware de erros do `POST`. Repõe o título, e vê que a resposta já traz o valor novo:

   ```js
   await pedir("PATCH", "/api/cenas/arquivo", { titulo: "O arquivo" });
   ```

   O que deves ver: `200`, com `"titulo":"O arquivo"` na cena da resposta.

10. Joga até ao arquivo. No outro separador, abre `http://localhost:3000/`, carrega em "Começar", depois em "Sair para o corredor" e em "Entrar na secretaria". O que deves ver: a secretaria tem duas escolhas, e "Abrir a porta do arquivo" leva à página do arquivo, de onde voltas à secretaria.

### Paragem 6

O `PATCH` altera só os campos que vêm no corpo, responde com a cena depois da alteração e recusa os valores que o schema não aceita. A secretaria leva ao arquivo, e o arquivo à secretaria.

Pensa antes de continuares: o `PATCH` da secretaria levou as duas escolhas, também a que ela já tinha. O que acontecia se levasse só a nova? A resposta: a secretaria ficava só com a escolha do arquivo, e perdia a de voltar ao corredor com a chave. Num `PATCH`, a lista de escolhas substitui a lista inteira, como diz o contrato.

## Fase 7: Uma regra que precisa da base fica no service

Mostras que a API deixa partir a história e escreves no service as três regras que a protegem, com o `DELETE` e o 409. Não há duas cenas com o mesmo código, cada escolha leva a uma cena que existe, e não se apaga o início nem uma cena de destino. Rever: [Uma regra que precisa da base fica no service](../05-ligacao-segura-crud-e-regras-de-dominio.md#uma-regra-que-precisa-da-base-fica-no-service).

1. Na consola, dá ao arquivo uma escolha que leva a uma cena que não existe:

   ```js
   await pedir("PATCH", "/api/cenas/arquivo", { escolhas: [{ texto: "Descer à cave", destino: "cave" }] });
   ```

   O que deves ver: `200`. No outro separador, abre a página `http://localhost:3000/cenas/arquivo` e carrega em "Descer à cave". O que deves ver: a página "Escolha não encontrada", com "A cena arquivo não tem a escolha 1.". A mensagem engana: a escolha existe, e quem não existe é a cena para onde ela leva. A lista fechada e o schema não o podem saber, porque só veem o pedido. Para o saber, é preciso ir à base ver que cenas existem.

2. No service, uma função auxiliar procura a primeira escolha sem cena. Em `src/services/cenas.service.js`, a seguir à `cenaSeguinte` e antes da `criarCena`, acrescenta:

   ```js
   /**
    * Procura, numa lista de escolhas, a primeira que leva a uma cena que não existe.
    * @param {object[]} escolhas as escolhas, cada uma com texto e destino
    * @returns {Promise<object | null>} { numero, destino } dessa escolha, a contar do 1, ou null se todas levam a uma cena
    */
   async function escolhaSemDestino(escolhas) {
     for (let i = 0; i < escolhas.length; i++) {
       const destino = await procurarPorCodigo(escolhas[i].destino);
       if (destino === null) {
         return { numero: i + 1, destino: escolhas[i].destino };
       }
     }
     return null;
   }
   ```

   Não tem `export`, porque só o service a usa.

3. A `criarCena` e a `alterarCena` passam a aplicar as regras antes de escrever. Como têm mais do que uma coisa a dizer ao controller, devolvem um objeto, com o que aconteceu em `resultado` e os dados que fizerem falta. Substitui as duas funções por estas:

   ```js
   /**
    * Cria uma cena nova, se as regras do jogo o deixarem.
    * As regras de cada campo estão no schema do modelo.
    * @param {object} dados os campos da cena, já com o tipo verificado pelo controller
    * @returns {Promise<object>} { resultado } com "criada", "codigo-repetido" ou "destino-nao-existe";
    *   com "criada", também a cena; com "destino-nao-existe", a escolha sem cena
    */
   export async function criarCena(dados) {
     // Regra do jogo: não há duas cenas com o mesmo código, porque é pelo
     // código que se pede uma cena e que as escolhas levam de uma cena a outra.
     const existente = await procurarPorCodigo(dados.codigo);
     if (existente !== null) {
       return { resultado: "codigo-repetido" };
     }
     // Regra do jogo: cada escolha leva a uma cena que existe.
     if (dados.escolhas !== undefined) {
       const escolha = await escolhaSemDestino(dados.escolhas);
       if (escolha !== null) {
         return { resultado: "destino-nao-existe", escolha: escolha };
       }
     }
     const cena = await inserirCena(dados);
     return { resultado: "criada", cena: cena };
   }

   /**
    * Altera os campos recebidos de uma cena, se as regras do jogo o deixarem.
    * @param {string} codigo o código da cena
    * @param {object} dados os campos a alterar, já com o tipo verificado pelo controller
    * @returns {Promise<object>} { resultado } com "alterada", "nao-existe" ou "destino-nao-existe";
    *   com "alterada", também a cena; com "destino-nao-existe", a escolha sem cena
    */
   export async function alterarCena(codigo, dados) {
     const cena = await procurarPorCodigo(codigo);
     if (cena === null) {
       return { resultado: "nao-existe" };
     }
     // A mesma regra da criação: as escolhas novas levam a cenas que existem.
     if (dados.escolhas !== undefined) {
       const escolha = await escolhaSemDestino(dados.escolhas);
       if (escolha !== null) {
         return { resultado: "destino-nao-existe", escolha: escolha };
       }
     }
     const alterada = await alterarPorCodigo(codigo, dados);
     return { resultado: "alterada", cena: alterada };
   }
   ```

   A `alterarCena` procura primeiro a cena, para responder 404 a uma cena que não existe antes de olhar para as escolhas.

4. O controller traduz cada `resultado` num código. Em `src/controllers/cenas.controller.js`, substitui a `criar` e a `alterar` por estas:

   ```js
   /** POST /api/cenas, com a cena nova no corpo, em JSON */
   export async function criar(req, res) {
     const leitura = lerCamposDaCena(req.body);
     if (leitura.erro) {
       res.status(400).json({ erro: leitura.erro });
       return;
     }
     // Se uma regra do schema falhar, o criarCena rejeita a promessa, e o
     // Express passa o erro ao middleware de erros, no server.js, que responde 400.
     const criacao = await criarCena(leitura.dados);
     if (criacao.resultado === "codigo-repetido") {
       res.status(409).json({ erro: `Já existe uma cena com o código ${leitura.dados.codigo}` });
       return;
     }
     if (criacao.resultado === "destino-nao-existe") {
       const escolha = criacao.escolha;
       res.status(409).json({ erro: `A escolha ${escolha.numero} leva à cena ${escolha.destino}, que não existe` });
       return;
     }
     res.status(201).json(criacao.cena);
   }

   /** PATCH /api/cenas/:codigo, com os campos a alterar no corpo, em JSON */
   export async function alterar(req, res) {
     const codigo = req.params.codigo;
     const leitura = lerCamposDaCena(req.body);
     if (leitura.erro) {
       res.status(400).json({ erro: leitura.erro });
       return;
     }
     // O código identifica a cena, e as escolhas de outras cenas levam a ele.
     // Mudá-lo deixava essas escolhas a levar a uma cena que não existe.
     if (leitura.dados.codigo !== undefined) {
       res.status(400).json({ erro: "O código de uma cena não se altera" });
       return;
     }
     if (Object.keys(leitura.dados).length === 0) {
       res.status(400).json({ erro: "O pedido não traz nenhum campo para alterar" });
       return;
     }
     const alteracao = await alterarCena(codigo, leitura.dados);
     if (alteracao.resultado === "nao-existe") {
       res.status(404).json({ erro: `Não existe a cena ${codigo}` });
       return;
     }
     if (alteracao.resultado === "destino-nao-existe") {
       const escolha = alteracao.escolha;
       res.status(409).json({ erro: `A escolha ${escolha.numero} leva à cena ${escolha.destino}, que não existe` });
       return;
     }
     res.json(alteracao.cena);
   }
   ```

   Guarda os dois ficheiros, e confirma que o jogo arrancou outra vez.

5. Experimenta as duas regras novas na consola:

   ```js
   await pedir("PATCH", "/api/cenas/arquivo", { escolhas: [{ texto: "Descer à cave", destino: "cave" }] });
   await pedir("POST", "/api/cenas", arquivo);
   ```

   O que deves ver: `409 {"erro":"A escolha 1 leva à cena cave, que não existe"}` e `409 {"erro":"Já existe uma cena com o código arquivo"}`. Sem a segunda regra, o `POST` criava outro arquivo, e o jogo mostrava sempre o primeiro que encontrasse.

6. O arquivo ainda tem a escolha da cave, que o `PATCH` do primeiro passo desta fase lá deixou. Repõe a escolha de voltar à secretaria:

   ```js
   await pedir("PATCH", "/api/cenas/arquivo", { escolhas: [{ texto: "Voltar à secretaria", destino: "secretaria" }] });
   ```

   O que deves ver: `200`, com a escolha "Voltar à secretaria" na resposta.

7. Falta apagar. No repository, uma função procura as cenas de onde se chega a um código, e outra apaga. Acrescenta as duas no fim do ficheiro do repository:

   ```js
   /**
    * Procura as cenas que têm pelo menos uma escolha que leva a um código.
    * @param {string} codigo o código da cena de destino
    * @returns {Promise<object[]>} as cenas de onde se chega a esse código, possivelmente nenhuma
    */
   export async function procurarOrigens(codigo) {
     // Como o "localizacao.corredor" do tema 02, o ponto escolhe um campo de
     // dentro de outro: aqui, o destino de cada escolha. Numa lista, o filtro
     // escolhe a cena se alguma das escolhas tiver este destino.
     const cenas = await Cena.find({ "escolhas.destino": codigo });
     return cenas;
   }

   /**
    * Apaga uma cena.
    * @param {string} codigo o código da cena
    * @returns {Promise<void>} cumprida quando a cena foi apagada
    */
   export async function apagarPorCodigo(codigo) {
     await Cena.findOneAndDelete({ codigo: codigo });
   }
   ```

8. No service, a `apagarCena` tem a terceira regra. Em `src/services/cenas.service.js`, substitui o `import` por este, com as seis funções do repository, e acrescenta a constante logo a seguir:

   ```js
   import {
     procurarTodas,
     procurarPorCodigo,
     inserirCena,
     alterarPorCodigo,
     procurarOrigens,
     apagarPorCodigo,
   } from "../repositories/cenas.repository.js";

   // A cena onde a história começa. As páginas levam lá no "Começar" e no
   // "Recomeçar", e por isso nunca sai da história.
   const CENA_INICIAL = "inicio";
   ```

   E, no fim do ficheiro:

   ```js
   /**
    * Apaga uma cena, se as regras do jogo o deixarem.
    * @param {string} codigo o código da cena
    * @returns {Promise<object>} { resultado } com "apagada", "nao-existe", "e-o-inicio" ou "e-destino";
    *   com "e-destino", também o código de uma cena que leva lá, em origem
    */
   export async function apagarCena(codigo) {
     const cena = await procurarPorCodigo(codigo);
     if (cena === null) {
       return { resultado: "nao-existe" };
     }
     if (codigo === CENA_INICIAL) {
       return { resultado: "e-o-inicio" };
     }
     // Regra do jogo: uma cena só sai da história quando nenhuma escolha leva
     // a ela. Senão, essa escolha passava a levar a uma cena que não existe.
     const origens = await procurarOrigens(codigo);
     if (origens.length > 0) {
       return { resultado: "e-destino", origem: origens[0].codigo };
     }
     await apagarPorCodigo(codigo);
     return { resultado: "apagada" };
   }
   ```

9. No controller, substitui o `import` por este, com as seis funções do service:

   ```js
   import {
     listarCenas,
     obterCena,
     cenaSeguinte,
     criarCena,
     alterarCena,
     apagarCena,
   } from "../services/cenas.service.js";
   ```

   E acrescenta, no fim do ficheiro:

   ```js
   /** DELETE /api/cenas/:codigo */
   export async function apagar(req, res) {
     const codigo = req.params.codigo;
     const remocao = await apagarCena(codigo);
     if (remocao.resultado === "nao-existe") {
       res.status(404).json({ erro: `Não existe a cena ${codigo}` });
       return;
     }
     if (remocao.resultado === "e-o-inicio") {
       res.status(409).json({ erro: "A cena inicio não se pode apagar, porque é onde a história começa" });
       return;
     }
     if (remocao.resultado === "e-destino") {
       res.status(409).json({ erro: `A cena ${codigo} não se pode apagar, porque uma escolha da cena ${remocao.origem} leva a ela` });
       return;
     }
     // 204: apagada, e a resposta não tem corpo.
     res.status(204).end();
   }
   ```

10. Em `src/rotas/cenas.rotas.js`, junta a `apagar` ao `import` e acrescenta a última rota, a seguir à do `PATCH`:

    ```js
    import { listar, obter, escolher, criar, alterar, apagar } from "../controllers/cenas.controller.js";
    ```

    ```js
    router.delete("/:codigo", apagar);
    ```

    Guarda os ficheiros. O que deves ver: o jogo reinicia sem erros.

11. Prevê o código de cada um destes `DELETE`, e depois faz cada um, pela ordem:

    ```js
    await pedir("DELETE", "/api/cenas/vazia");
    await pedir("DELETE", "/api/cenas/vazia");
    await pedir("DELETE", "/api/cenas/inicio");
    await pedir("DELETE", "/api/cenas/fim-ginasio");
    await pedir("DELETE", "/api/cenas/arquivo");
    ```

    A resposta:

    | Pedido | Código e resposta |
    | --- | --- |
    | A `vazia` | 204, sem corpo: nenhuma escolha leva a ela, e foi apagada |
    | A `vazia` outra vez | 404, com `{"erro":"Não existe a cena vazia"}` |
    | A `inicio` | 409, com `{"erro":"A cena inicio não se pode apagar, porque é onde a história começa"}` |
    | A `fim-ginasio` | 409, com `{"erro":"A cena fim-ginasio não se pode apagar, porque uma escolha da cena escadas leva a ela"}` |
    | O `arquivo` | 409, com `{"erro":"A cena arquivo não se pode apagar, porque uma escolha da cena secretaria leva a ela"}` |

    O 204 escreve só `204`, sem nada à frente, porque o `end()` termina a resposta sem corpo. Os três 409 são pedidos bem escritos que o estado da história não deixa passar.

### Paragem 7

A API já não deixa partir a história. Recusa com 409 o código repetido, a escolha que leva a uma cena que não existe, e o `DELETE` do início ou de uma cena de destino. Os teus ficheiros estão agora como os da pasta [fechado-na-escola-passo-04](../../exemplos/acesso-a-dados/fechado-na-escola-passo-04/README.md), nos exemplos.

O ficheiro `src/services/cenas.service.js` completo, como deve estar agora:

```js
// src/services/cenas.service.js: as regras do jogo sobre as cenas.
// Recebe valores simples e devolve valores simples. Não sabe nada de HTTP,
// nem de MongoDB: pede as cenas ao repository.
import {
  procurarTodas,
  procurarPorCodigo,
  inserirCena,
  alterarPorCodigo,
  procurarOrigens,
  apagarPorCodigo,
} from "../repositories/cenas.repository.js";

// A cena onde a história começa. As páginas levam lá no "Começar" e no
// "Recomeçar", e por isso nunca sai da história.
const CENA_INICIAL = "inicio";

/**
 * Devolve todas as cenas da história.
 * @returns {Promise<object[]>} as cenas, possivelmente nenhuma
 */
export async function listarCenas() {
  const cenas = await procurarTodas();
  return cenas;
}

/**
 * Procura uma cena pelo código.
 * @param {string} codigo o código da cena
 * @returns {Promise<object | null>} a cena, ou null se não existir
 */
export async function obterCena(codigo) {
  const cena = await procurarPorCodigo(codigo);
  return cena;
}

/**
 * Diz para que cena leva uma escolha de uma cena.
 * A regra do jogo: o jogador vê as escolhas numeradas a partir de 1, e é
 * o servidor, e não o jogador, que diz para onde cada uma leva.
 * @param {object} cena a cena onde o jogador está, que já se sabe que existe
 * @param {number} numero o número da escolha, um inteiro de 1 para cima, já verificado
 * @returns {Promise<object | null>} a cena seguinte, ou null se a cena não tiver essa escolha
 */
export async function cenaSeguinte(cena, numero) {
  // A lista das escolhas começa no 0: a escolha 1 está na posição 0.
  // Uma cena final não tem escolhas, e qualquer número fica de fora.
  const escolha = cena.escolhas[numero - 1];
  if (escolha === undefined) {
    return null;
  }
  const seguinte = await procurarPorCodigo(escolha.destino);
  return seguinte;
}

/**
 * Procura, numa lista de escolhas, a primeira que leva a uma cena que não existe.
 * @param {object[]} escolhas as escolhas, cada uma com texto e destino
 * @returns {Promise<object | null>} { numero, destino } dessa escolha, a contar do 1, ou null se todas levam a uma cena
 */
async function escolhaSemDestino(escolhas) {
  for (let i = 0; i < escolhas.length; i++) {
    const destino = await procurarPorCodigo(escolhas[i].destino);
    if (destino === null) {
      return { numero: i + 1, destino: escolhas[i].destino };
    }
  }
  return null;
}

/**
 * Cria uma cena nova, se as regras do jogo o deixarem.
 * As regras de cada campo estão no schema do modelo.
 * @param {object} dados os campos da cena, já com o tipo verificado pelo controller
 * @returns {Promise<object>} { resultado } com "criada", "codigo-repetido" ou "destino-nao-existe";
 *   com "criada", também a cena; com "destino-nao-existe", a escolha sem cena
 */
export async function criarCena(dados) {
  // Regra do jogo: não há duas cenas com o mesmo código, porque é pelo
  // código que se pede uma cena e que as escolhas levam de uma cena a outra.
  const existente = await procurarPorCodigo(dados.codigo);
  if (existente !== null) {
    return { resultado: "codigo-repetido" };
  }
  // Regra do jogo: cada escolha leva a uma cena que existe.
  if (dados.escolhas !== undefined) {
    const escolha = await escolhaSemDestino(dados.escolhas);
    if (escolha !== null) {
      return { resultado: "destino-nao-existe", escolha: escolha };
    }
  }
  const cena = await inserirCena(dados);
  return { resultado: "criada", cena: cena };
}

/**
 * Altera os campos recebidos de uma cena, se as regras do jogo o deixarem.
 * @param {string} codigo o código da cena
 * @param {object} dados os campos a alterar, já com o tipo verificado pelo controller
 * @returns {Promise<object>} { resultado } com "alterada", "nao-existe" ou "destino-nao-existe";
 *   com "alterada", também a cena; com "destino-nao-existe", a escolha sem cena
 */
export async function alterarCena(codigo, dados) {
  const cena = await procurarPorCodigo(codigo);
  if (cena === null) {
    return { resultado: "nao-existe" };
  }
  // A mesma regra da criação: as escolhas novas levam a cenas que existem.
  if (dados.escolhas !== undefined) {
    const escolha = await escolhaSemDestino(dados.escolhas);
    if (escolha !== null) {
      return { resultado: "destino-nao-existe", escolha: escolha };
    }
  }
  const alterada = await alterarPorCodigo(codigo, dados);
  return { resultado: "alterada", cena: alterada };
}

/**
 * Apaga uma cena, se as regras do jogo o deixarem.
 * @param {string} codigo o código da cena
 * @returns {Promise<object>} { resultado } com "apagada", "nao-existe", "e-o-inicio" ou "e-destino";
 *   com "e-destino", também o código de uma cena que leva lá, em origem
 */
export async function apagarCena(codigo) {
  const cena = await procurarPorCodigo(codigo);
  if (cena === null) {
    return { resultado: "nao-existe" };
  }
  if (codigo === CENA_INICIAL) {
    return { resultado: "e-o-inicio" };
  }
  // Regra do jogo: uma cena só sai da história quando nenhuma escolha leva
  // a ela. Senão, essa escolha passava a levar a uma cena que não existe.
  const origens = await procurarOrigens(codigo);
  if (origens.length > 0) {
    return { resultado: "e-destino", origem: origens[0].codigo };
  }
  await apagarPorCodigo(codigo);
  return { resultado: "apagada" };
}
```

As três funções de cima são as do passo 2, e as de baixo aplicam as regras do jogo antes de pedir ao repository que escreva. Nenhuma sabe de códigos HTTP: as de baixo dizem o que aconteceu em `resultado`, e o controller escolhe o código.

Pensa antes de continuares: a regra do início e a das cenas de destino estão as duas na `apagarCena`. Qual delas precisa mesmo de ir à base, e qual não? A resposta: a das cenas de destino precisa, porque só a base sabe que escolhas existem agora. A do início não, porque compara só o código do pedido. Fica no service por ser uma regra do jogo, ao lado das outras do `DELETE`.

## Fase 8: Cada linha do contrato verifica-se com um pedido

Reconstróis a base de teste e verificas cada linha nova do contrato com um pedido, pela ordem de uma tabela. Depois confirmas no Atlas e jogas até ao arquivo. Rever: [Cada linha do contrato verifica-se com um pedido](../04-api-express-e-contratos.md#cada-linha-do-contrato-verifica-se-com-um-pedido).

1. No segundo terminal, reconstrói a base de teste:

   ```bash
   npm run seed
   ```

   O que deves ver: `Ligada à base de dados fechado-na-escola-teste`, uma linha com as cenas apagadas e `Inseridas 11 cenas`. O `insertMany` passou as onze cenas pelas regras do schema, e todas as cumprem. O arquivo e as experiências desapareceram, e a secretaria voltou a ter uma só escolha.

2. Se a página da consola recarregou desde a fase 3, a consola perdeu o que lá colaste. Este bloco repõe as duas funções e as duas variáveis, sem fazer nenhum pedido. Cola-o, se precisares:

   ```js
   // Faz um pedido à API e escreve na consola o código e o corpo da resposta.
   async function pedir(metodo, caminho, corpo) {
     const opcoes = { method: metodo };
     if (corpo !== undefined) {
       // O cabeçalho diz à API que o corpo vem em JSON. O JSON.stringify
       // escreve o objeto como texto JSON, que é o que viaja no pedido.
       opcoes.headers = { "Content-Type": "application/json" };
       opcoes.body = JSON.stringify(corpo);
     }
     const resposta = await fetch(caminho, opcoes);
     const texto = await resposta.text();
     console.log(resposta.status, texto);
   }

   // Envia um POST com um corpo escrito à mão, sem o JSON.stringify da pedir.
   async function pedirComTexto(caminho, texto) {
     const opcoes = { method: "POST", headers: { "Content-Type": "application/json" }, body: texto };
     const resposta = await fetch(caminho, opcoes);
     console.log(resposta.status, await resposta.text());
   }

   const arquivo = {
     codigo: "arquivo",
     titulo: "O arquivo",
     texto: "Atrás da secretaria há uma porta estreita. Lá dentro, caixas com testes de outros anos chegam ao teto, e numa prateleira há uma lanterna a pilhas.",
     final: false,
     escolhas: [{ texto: "Voltar à secretaria", destino: "secretaria" }],
   };

   const secretaria = [
     { texto: "Levar a chave da sala 12 e voltar ao corredor", destino: "corredor" },
     { texto: "Abrir a porta do arquivo", destino: "arquivo" },
   ];
   ```

3. Faz os pedidos desta lista, pela ordem, e antes de cada um prevê o código com o contrato:

   ```js
   await pedir("POST", "/api/cenas", arquivo);
   await pedir("POST", "/api/cenas", arquivo);
   await pedir("POST", "/api/cenas", { codigo: "cave", titulo: "A cave", texto: "Escuro.", final: true, cor: "preto" });
   await pedir("POST", "/api/cenas", { codigo: "cave", titulo: "A cave", texto: "   ", final: true });
   await pedir("POST", "/api/cenas", { codigo: "cave", titulo: "A cave", texto: "Escuro.", final: false, escolhas: [{ texto: "Subir", destino: "sotao" }] });
   await pedir("PATCH", "/api/cenas/secretaria", { escolhas: secretaria });
   await pedir("PATCH", "/api/cenas/secretaria", { codigo: "sala-das-chaves" });
   await pedir("PATCH", "/api/cenas/secretaria", {});
   await pedir("PATCH", "/api/cenas/arquivo", { final: "sim" });
   await pedir("PATCH", "/api/cenas/cave", { titulo: "A cave" });
   await pedir("DELETE", "/api/cenas/arquivo");
   await pedir("DELETE", "/api/cenas/cave");
   await pedirComTexto("/api/cenas", "{ codigo: arquivo }");
   ```

   O que deves ver:

   | N.º | O que se experimenta | Código e resposta |
   | ---: | --- | --- |
   | 1 | Criar o arquivo | 201, com a cena criada |
   | 2 | Criar o arquivo outra vez | 409, com `{"erro":"Já existe uma cena com o código arquivo"}` |
   | 3 | Um campo que não está na lista | 400, com `{"erro":"O campo cor não é aceite"}` |
   | 4 | Um texto só com espaços | 400, com `{"erro":"O texto é obrigatório"}` |
   | 5 | Uma escolha para uma cena que não existe | 409, com `{"erro":"A escolha 1 leva à cena sotao, que não existe"}` |
   | 6 | A secretaria com as duas escolhas | 200, com as duas escolhas na resposta |
   | 7 | Mudar o código | 400, com `{"erro":"O código de uma cena não se altera"}` |
   | 8 | Um corpo sem campos | 400, com `{"erro":"O pedido não traz nenhum campo para alterar"}` |
   | 9 | O `final` em texto | 400, com `{"erro":"O campo final tem de ser true ou false"}` |
   | 10 | Alterar uma cena que não existe | 404, com `{"erro":"Não existe a cena cave"}` |
   | 11 | Apagar uma cena de destino | 409, com `{"erro":"A cena arquivo não se pode apagar, porque uma escolha da cena secretaria leva a ela"}` |
   | 12 | Apagar uma cena que não existe | 404, com `{"erro":"Não existe a cena cave"}` |
   | 13 | Um corpo que não é JSON | 400, com `{"erro":"O corpo do pedido não é JSON válido"}` |

4. Se alguma linha não conferir, descobre se o erro está no código ou no contrato, corrige-o e volta a fazer o pedido dessa linha. Os pedidos 1 e 6 mudam a base: se repetires a lista desde o princípio, corre antes o seed. Para saber onde procurar, segue o caminho de um `POST` pelo jogo:

   ```mermaid
   flowchart TD
       P["POST /api/cenas"] --> J{"express.json()<br/>consegue ler o corpo?"}
       J -- "não é JSON" --> E1["400, pelo middleware de erros"]
       J -- "sim" --> L{"lista fechada,<br/>no controller"}
       L -- "campo a mais ou tipo errado" --> E2["400"]
       L -- "passa" --> S{"regras do jogo,<br/>no service"}
       S -- "código repetido ou destino que não existe" --> E3["409"]
       S -- "passa" --> M{"regras dos campos,<br/>no schema"}
       M -- "ValidationError" --> E4["400, pelo middleware de erros"]
       M -- "passa" --> OK["201, com a cena criada"]
   ```

   Um pedido pode ser recusado em quatro sítios, por esta ordem. São o corpo que não é JSON, a lista fechada, as regras do jogo no service e as regras dos campos no schema. Um 400 da lista fechada procura-se no controller, um 400 de um valor no schema, e um 409 no service.

5. No Atlas, no "Data Explorer", abre a coleção `cenas` da base `fechado-na-escola-teste` e carrega no botão de atualizar. O que deves ver: doze documentos, com o `arquivo` entre eles, e a `secretaria` com as duas escolhas. A API disse que criou e que alterou, e a base confirma. Na base `fechado-na-escola`, a secretaria continua com uma só escolha.

6. Joga até ao arquivo, como no fim da fase 6: no outro separador, abre `http://localhost:3000/`, carrega em "Começar", em "Sair para o corredor" e em "Entrar na secretaria". O que deves ver: a escolha "Abrir a porta do arquivo" leva à página "O arquivo", e "Voltar à secretaria" traz-te de volta.

### Paragem 8

A API dá as treze respostas da tabela, com os códigos 200, 201, 400, 404 e 409, e a base de teste tem o arquivo, ligado à secretaria.

Pensa antes de continuares: o pedido 11 não apagou o arquivo. O que tens de fazer, e por que ordem, para o conseguir apagar? A resposta: primeiro, um `PATCH` à secretaria com a lista de escolhas sem a do arquivo, só com a de voltar ao corredor. Depois, o `DELETE` do arquivo, que já não é destino de nenhuma escolha, e dá 204.

## Fase 9: Um commit guarda uma fotografia do projeto

Confirmas que a cadeia de ligação não está em nenhum ficheiro que vai para o Git, e guardas o passo 4 num commit. Rever: [Um commit guarda uma fotografia do projeto](../03-arquitetura-e-setup-node.md#um-commit-guarda-uma-fotografia-do-projeto).

1. No segundo terminal, corre `git status`. O que deves ver: em "Changes not staged for commit" (alterações por preparar), como `modified`, o `.env.example`, o `contrato-da-api.md` e oito ficheiros de `src`. São o `server.js`, o `seed.js` e um ficheiro de cada uma destas pastas: `db`, `models`, `repositories`, `services`, `controllers` e `rotas`. Não há ficheiros novos, e o `.env` não aparece, porque o `.gitignore` o deixa de fora.

2. A cadeia de ligação do Atlas tem `mongodb.net` no endereço do cluster. O `git grep` procura um texto nos ficheiros que o Git segue. Corre:

   ```bash
   git grep -n "mongodb.net"
   ```

   O que deves ver: nada, e o terminal volta a aceitar comandos. A cadeia só está no `.env`, que o Git não segue, e por isso não vai para o commit. Se aparecer uma linha, com o nome de um ficheiro e a cadeia, tira-a desse ficheiro antes do commit, e chama o professor.

3. Faz o commit e vê o histórico:

   ```bash
   git add .
   git commit -m "Passo 4: criar, alterar e apagar cenas, com as regras do jogo"
   git log --oneline
   ```

   O que deves ver: o `git log` mostra o commit deste passo no topo da lista, com os dos passos anteriores por baixo. Se o Git responder com `Please tell me who you are`, ou com `Your name and email address were configured automatically`, vê [o que fazer](#please-tell-me-who-you-are-ou-your-name-and-email-address-were-configured-automatically).

4. Para o jogo: no primeiro terminal, carrega em Ctrl+C. O que deves ver: o terminal volta a aceitar comandos, e `http://localhost:3000/` deixa de responder.

### Paragem 9

O passo 4 está guardado no Git, o jogo está parado, e o teu projeto está igual à pasta [fechado-na-escola-passo-04](../../exemplos/acesso-a-dados/fechado-na-escola-passo-04/README.md), o ponto de partida do passo 5. O [passo 5](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/01-aplicacoes-em-browser/laboratorios/05-formularios-e-validacao-laboratorio.md) faz-se em Sistemas de Informação, e continua este projeto. O professor vê o que este passo entrega na sala, no teu projeto, no commit e na base de teste.

Pensa antes de continuares: o `.env.example` foi no commit, com `DB_NAME=fechado-na-escola-teste`, e o `.env` não. Um colega copia o teu projeto: o que tem de fazer para o jogo arrancar ligado à base de teste? A resposta: copia o `.env.example` para `.env`, como no "Como correr" dos exemplos, e escreve a sua cadeia de ligação na linha `MONGODB_URI=`. O `DB_NAME` já vem com a base de teste.

## Se alguma coisa falhar

1. Estás na pasta certa? Corre os comandos na pasta do jogo, a que tem o `package.json`. Para veres em que pasta estás, usa o `pwd` (no Windows, na linha de comandos clássica, o `cd` sozinho).
2. O jogo arrancou? Depois de guardares um `.js`, o primeiro terminal tem de voltar a mostrar `Fechado na escola em http://localhost:3000`. Se, em vez disso, aparecer um erro, vê [O jogo reinicia e para](#o-jogo-reinicia-e-para-com-failed-running-srcserverjs).
3. A consola está numa página do teu jogo? A `pedir` usa caminhos começados por `/api`, que o `fetch` completa com o endereço da página aberta. Abre `http://localhost:3000/api/estado` e cola a função nessa página.
4. O teu ficheiro está como o do laboratório? A pasta [fechado-na-escola-passo-04](../../exemplos/acesso-a-dados/fechado-na-escola-passo-04/README.md), nos exemplos, tem os ficheiros como ficam no fim do laboratório, e os teus ficam iguais a ela a partir do fim da fase 7. Antes disso, compara com o ficheiro completo da última paragem que o mostra. O repository, o modelo e o seed não aparecem completos em nenhuma paragem: compara-os com os da pasta, função a função.

### O seed ou o jogo não chegam à base de dados

Aparece `O seed falhou`, no seed, ou `Não foi possível ligar à base de dados`, no arranque do jogo, que fica sem aceitar pedidos. Confirma três coisas: a internet, a tua cadeia de ligação na linha `MONGODB_URI=` do `.env`, e o endereço IP da rede onde estás, autorizado no Atlas. A mensagem diz a causa, e as soluções de cada uma estão no [laboratório do passo 1](03-arquitetura-e-setup-node-laboratorio.md#se-alguma-coisa-falhar).

### O seed diz que só corre numa base de teste

O nome da base do `.env` não acaba em `-teste`, e o seed não apagou nada. Confirma que a linha do `.env` é `DB_NAME=fechado-na-escola-teste`, sem espaços, e que guardaste o ficheiro.

### O jogo reinicia e para, com "Failed running 'src/server.js'"

Há um erro num ficheiro `.js`, e o `--watch` fica à espera de que o corrijas. Por cima dessa linha, há outra que começa pelo tipo do erro, como `SyntaxError` ou `Error`, e diz o que está mal e, muitas vezes, em que ficheiro. Com `does not provide an export named`, uma função está no `import` de um ficheiro e falta-lhe o `export` no ficheiro de onde vem, ou o nome está escrito de outra maneira. Quando corrigires e guardares, o jogo arranca outra vez sozinho.

### A consola não deixa colar

Ao colar a `pedir`, a consola mostra um aviso e não cola. Alguns browsers protegem a consola de quem cola código sem o ler, e o aviso diz o que escrever para deixar colar, como `allow pasting`. Escreve o que o aviso pede, carrega em Enter e cola outra vez.

### Uncaught ReferenceError: pedir is not defined, ou arquivo is not defined

A página da consola mudou ou recarregou, e a consola perdeu tudo o que colaste: a `pedir`, a `pedirComTexto` e as variáveis `arquivo` e `secretaria`. Cola outra vez o bloco do passo 2 da [fase 8](#fase-8-cada-linha-do-contrato-verifica-se-com-um-pedido), que repõe tudo sem fazer nenhum pedido. Para não acontecer outra vez, abre as páginas noutro separador.

### O POST responde que o corpo tem de ser um objeto JSON, e o corpo está certo

O `req.body` ficou `undefined`. Falta o `app.use(express.json())` no `server.js`, ou está depois do `app.use` das rotas: o middleware só lê o corpo dos pedidos que passam por ele antes de chegarem às rotas. Volta ao passo 1 da [fase 3](#fase-3-só-passam-os-campos-de-uma-lista-fechada).

### Uma resposta de erro vem numa página HTML, e não em JSON

O middleware de erros não existe, está antes das rotas, ou não tem os quatro parâmetros. Se tiver só três, `(erro, req, res)`, o Express não o reconhece como middleware de erros, e quem responde é o tratamento de erros do próprio Express. Confirma que tem os quatro, `(erro, req, res, next)`, mesmo sem usar o `next`, e que está depois do middleware final.

### Uma regra do schema dá 500, com "Erro interno do servidor"

O terminal mostra `Erro interno: Cena validation failed`. Falta, no middleware de erros, o caso do `ValidationError`, ou o nome está escrito de outra maneira. Volta ao passo 5 da [fase 5](#fase-5-as-regras-de-cada-campo-ficam-no-schema).

### O PATCH responde com os valores antigos, ou aceita um título vazio

Falta o terceiro argumento do `findOneAndUpdate`, com o `returnDocument: "after"` e o `runValidators: true`, ou uma das opções tem o nome mal escrito. Uma opção com outro nome não dá erro: o Mongoose ignora-a. Volta ao passo 8 da [fase 6](#fase-6-alterar-um-documento-pede-duas-opções).

### Aparece no terminal um aviso sobre a opção new

O terminal mostra um aviso que começa por `[MONGOOSE] Warning` e fala da opção `new`. O teu repository usa `new: true`, uma opção mais antiga que muitos tutoriais ainda mostram. Faz o mesmo que o `returnDocument: "after"`, mas o Mongoose 9 marca-a como obsoleta. Troca-a pelo `returnDocument: "after"`.

### Cannot set headers after they are sent to the client

O terminal mostra esta mensagem depois de uma resposta de erro. Falta o `return` depois de um `res.status(...).json(...)`: a função continua, chega a outra resposta e tenta responder outra vez ao mesmo pedido. Põe o `return` a seguir a cada resposta de erro do controller.

### Please tell me who you are, ou Your name and email address were configured automatically

Nesta pasta, o Git ainda não sabe o teu nome nem o teu email, o que acontece numa pasta copiada sem o `git config` de [O que precisas](#o-que-precisas). Diz-lhos com `git config user.name "O teu nome"` e `git config user.email "o teu email da escola"`. Se o Git recusou o commit, faz o commit outra vez. Se o fez com o nome da conta do computador, os próximos já levam o teu. O Git sugere um comando com `--global`: não o uses.

## Desafios

1. As cenas soltas. Depois das experiências, a base de teste pode ter cenas a que nenhuma escolha leva, e a que ninguém chega a jogar. Para teres o que mostrar, cria primeiro duas ou três com a `pedir`. Escreve um script, `src/apagar-soltas.js`, que mostra as cenas soltas da base de teste, sem contar a `inicio`, e só as apaga quando lhe juntas `--apagar` no fim do comando. Pista: o script do guia que apaga uma categoria tem a forma de que precisas, e o filtro escreve-se uma só vez.
2. A cena sem saída. Uma cena que não é final tem de ter pelo menos uma escolha, e uma cena final não pode ter nenhuma. Decide em que sítio fica esta regra, e escreve-a, com a resposta do contrato. Pista: num `PATCH` que só traz `{ "final": true }`, a regra precisa das escolhas que a cena já tem na base.

## Antes de terminares

- [ ] O seed só corre numa base acabada em `-teste`, e o jogo arranca ligado à `fechado-na-escola-teste`.
- [ ] Os três pedidos novos estão no contrato, e a API dá as treze respostas da tabela da fase 8.
- [ ] A base de teste tem o arquivo, e a secretaria leva lá: confirmaste-o no Atlas e a jogar nas páginas.
- [ ] O `git grep -n "mongodb.net"` não escreve nada, e o `git log --oneline` mostra o commit deste passo no topo.
- [ ] O jogo está parado.
- [ ] Consegues explicar, por palavras tuas, o caminho de um pedido que escreve na base: que funções correram, quem decidiu o código da resposta e o que mudou na base.

![Rodapé](../../imagens/rodape.png)
