![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: Ligação segura, CRUD e regras de domínio

Laboratório do tema Ligação segura, CRUD e regras de domínio, do módulo M14, Acesso a Bases de Dados. Vais ligar a API da papelaria a uma base de teste no Atlas e pôr as camadas a ler e a escrever nela. A API passa a criar, ler, alterar e apagar artigos, e recusa o que não cumpre as regras da papelaria. Cada passo diz o que fazer, porquê e o que deves ver. Avanças ao teu ritmo: o que não acabares na aula, acabas em casa ou na aula seguinte. Tudo o que precisas está aqui; o [guia do tema](05-ligacao-segura-crud-e-regras-de-dominio.md) tem a teoria completa, para quem quiser saber mais.

Se fizeste o tema anterior no projeto do cinema da escola, este laboratório não é o teu. Faz o [laboratório do cinema](05-ligacao-segura-crud-e-regras-de-dominio-laboratorio-cinema.md), que parte do ponto onde esse projeto ficou.

## O que vais construir

No fim, a API da papelaria cumpre um contrato com sete pedidos, os quatro de leitura do tema anterior e mais três, que criam, alteram e apagam. Os artigos vêm da base `papelaria-teste`, que um seed reconstrói, e a base `papelaria`, a do laboratório do Atlas, fica como estava. O projeto fica assim:

```text
papelaria-api/
├── contrato-da-api.md                 o contrato, agora com o CRUD
└── src/
    ├── server.js                      o arranque, com o corpo em JSON e o middleware de erros
    ├── seed.js                        reconstrói a base de teste
    ├── apagar-categoria.js            apaga uma categoria, mostrando antes o que vai apagar
    ├── db/
    │   └── mongoose.js                a ligação ao Atlas
    ├── models/
    │   └── artigo.model.js            a forma dos artigos e as regras de cada campo
    ├── repositories/
    │   └── artigos.repository.js      o acesso aos artigos na base de dados
    ├── services/
    │   └── artigos.service.js         as regras da papelaria
    ├── controllers/
    │   └── artigos.controller.js      o HTTP dos artigos
    └── rotas/
        └── artigos.rotas.js           que pedido vai para que função
```

A pasta `src/dados`, com o array, sai. No caderno, fica a tabela de verificação, com o que previste e o que obtiveste em cada pedido. Ficas a saber pôr uma API a escrever numa base de dados sem deixar entrar o que não deve, e a dizer em que camada fica cada regra.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| Preparar | O Mongoose, o `.env`, a ligação e o arranque | A API liga-se à base de teste antes de aceitar pedidos |
| 1 | O `contrato-da-api.md` | O contrato do CRUD, antes do código |
| 2 | O modelo e o seed | A base de teste com os oito artigos, reconstruída sempre que precisares |
| 3 | O repository, e o service e o controller com `await` | Os pedidos de leitura respondem com os artigos da base |
| 4 | A forma de um ObjectId, no controller | Um identificador mal escrito dá 400, e um que não existe dá 404 |
| 5 | O `express.json()`, a lista fechada e o `POST` | A API cria artigos, só com os campos da lista |
| 6 | As regras no schema e o middleware de erros | Um artigo que não cumpre as regras é recusado com 400, em JSON |
| 7 | O `PATCH`, com as opções da documentação | A API altera artigos, com as regras a correr |
| 8 | O `DELETE` e a regra do stock, no service | A API apaga artigos sem stock, e recusa os outros com 409 |
| 9 | O script que mostra antes de apagar | Apagas uma categoria inteira na base de teste, vendo antes o que sai |
| 10 | A tabela de verificação | A API cumpre o contrato, confirmado na base e sem o segredo à vista |
| 11 | O commit | O commit do CRUD no histórico |

## Palavras que vais usar

- CRUD: as quatro operações de quem guarda dados: criar, ler, alterar e apagar. Para saber mais, vê a secção "O contrato cresce: criar, alterar e apagar" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).
- Base de teste: uma base de dados com dados conhecidos, só para experiências, que um script reconstrói. Aqui é a `papelaria-teste`.
- Seed: o programa que põe na base os dados com que a aplicação começa. O desta API apaga os artigos e insere os oito do início.
- Mongoose: o pacote do Node que liga a API ao MongoDB e faz as consultas, com funções como o `find`.
- Modelo: o objeto do Mongoose que representa uma coleção, como o `Artigo`. Diz a forma dos documentos e é por ele que se lê e escreve na coleção.
- Repository: a camada que fala com a base de dados, e a única que usa o modelo `Artigo`.
- Promessa: o que uma função `async` devolve logo, e que representa uma resposta que ainda não chegou. O `await` espera por ela.
- ObjectId: o tipo do `_id` que o MongoDB dá a cada documento. Escreve-se com 24 carateres hexadecimais, os algarismos da base 16, de 0 a 9 e de `a` a `f`.
- Regra de domínio: uma regra do assunto da aplicação, a papelaria, como "o stock não pode ser negativo". Diz o que faz sentido, e não como se escreve um pedido.
- Corpo do pedido: a parte de um pedido que leva dados, como os campos de um artigo novo. Lê-se em `req.body`.
- `express.json()`: o middleware que lê o corpo em JSON e o guarda, já como objeto, em `req.body`.
- Lista fechada: a lista dos campos que um pedido pode trazer; tudo o resto é recusado.
- Schema: a descrição da forma dos documentos de uma coleção, no Mongoose, com o tipo e as regras de cada campo.
- `ValidationError`: o erro que o Mongoose lança quando uma regra do schema falha.
- Middleware de erros: um middleware com quatro parâmetros, que o Express só chama quando um pedido acabou num erro.
- 201, 204, 409 e 500: criado; correu bem, sem corpo; conflito com o estado dos dados; erro interno do servidor.

## O que precisas

- O projeto `papelaria-api` do laboratório do tema anterior, com as camadas, o contrato e os dois commits. Se não o tiveres, copia a pasta [papelaria-api-com-camadas](../exemplos/acesso-a-dados/papelaria-api-com-camadas/README.md) dos exemplos para a tua pasta de trabalho, com o nome `papelaria-api`. Dentro dela, corre `npm install` e cria o `.env` a partir do `.env.example`, com `cp .env.example .env` (no Windows, na linha de comandos clássica, `copy .env.example .env`). Depois, guarda o projeto num primeiro commit, com `git init`, `git add .` e `git commit -m "API da papelaria com camadas"`.
- A tua conta no MongoDB Atlas, com o cluster, o utilizador da base de dados e a palavra-passe dele, do laboratório do tema do modelo documental. O endereço IP do computador onde estás tem de estar autorizado no Atlas.
- Internet, em todas as fases: a API só arranca depois de se ligar ao Atlas.
- O Node.js e o npm. Confirma com `node --version` e `npm --version`; devem aparecer dois números de versão, o do Node a começar por `v`.
- Um editor de código e dois terminais: um para a API, outro para os comandos.
- O browser, com as ferramentas de programador (F12, ou Cmd+Option+I no Mac). Vais usar o separador "Rede" (ou "Network"), para veres o código de cada resposta. E vais usar o separador "Consola" (ou "Console"), para fazeres os pedidos que a barra de endereço não faz.
- O caderno, para as previsões e a tabela de verificação.

Se o teu `server.js` tem o middleware de registo, que escreve cada pedido no terminal, deixa-o ficar onde está, antes das rotas. Se a aula de 12 de outubro te deixou no projeto os ficheiros `src/db/mongoose.js` e `src/models/artigo.model.js`, substitui-os pelos deste laboratório quando lá chegares.

## Se alguma coisa falhar

1. Estás na pasta certa? Os comandos correm-se na pasta `papelaria-api`, onde está o `package.json`. `pwd` mostra a pasta atual (no Windows, na linha de comandos clássica, `cd`, sem mais nada).
2. Guardaste o ficheiro? O `--watch` só reinicia a API depois de guardares.
3. A API arrancou? Depois de guardares um ficheiro que a API já usa, o terminal tem de voltar a mostrar `Ligada à base de dados papelaria-teste` e `API a correr em http://localhost:3000`. Se mostrar um erro, a mensagem diz o ficheiro e, quase sempre, a linha.
4. A base é a certa? A primeira linha que a API escreve diz a que base se ligou. Tem de ser `papelaria-teste`.
5. A resposta não é a que esperavas? Compara com o contrato, linha a linha. Um código errado procura-se no controller. Uma lista errada procura-se no service e, depois, no repository.

## Preparar o projeto

Já ligaste uma API ao Atlas duas vezes, na aula de 12 de outubro e na ficha do cinema, com a cadeia de ligação no `.env`. Aqui vão para o projeto com as camadas, com uma diferença: a base passa a ser a de teste.

1. No terminal dos comandos, na pasta do projeto, instala o Mongoose:

   ```bash
   npm install mongoose
   ```

   O que deves ver: uma linha a dizer que foi acrescentado um pacote, ou alguns, e no `package.json` uma linha nova nas `dependencies`, a do `mongoose`. Se já o tinhas, da aula de 12 de outubro, o npm diz que está tudo atualizado.

2. Substitui o conteúdo do `.env.example` por este. Diz que configuração a API precisa, sem nenhum segredo:

   ```text
   # Porta onde a API escuta. Muda-a se a 3000 estiver ocupada.
   PORT=3000

   # Ligação ao MongoDB Atlas, no formato mongodb+srv://utilizador:palavra-passe@...
   # O endereço verdadeiro escreve-se só no .env. No .env.example, esta linha fica vazia.
   MONGODB_URI=

   # Nome da base de dados no Atlas. A cadeia de ligação não o diz.
   # A API e o seed usam a base de teste, que o seed reconstrói sempre que preciso.
   DB_NAME=papelaria-teste
   ```

3. No `.env`, as mesmas duas linhas, a da `MONGODB_URI` e a do `DB_NAME`, ficam com os valores verdadeiros. Se uma delas já lá estiver, mesmo vazia, preenche-a ou muda-a, em vez de escreveres outra. Na `MONGODB_URI`, põe a cadeia de ligação ao teu cluster, a que começa por `mongodb+srv://`. No Atlas, encontra-se em "Connect" (ligar), na ligação por "Drivers", com o marcador da palavra-passe, a parte entre `<` e `>`, trocado pela palavra-passe do utilizador da base de dados. Se tens a cadeia no `.env` de outro projeto, como o do cinema, copia-a de lá. No `DB_NAME`, escreve `papelaria-teste`, mesmo que lá esteja `papelaria`, da aula de 12 de outubro. A partir daqui, o `.env` tem um segredo. Não o copies para mais lado nenhum.

4. Dentro de `src`, cria a pasta `db` e, nela, o ficheiro `mongoose.js`, com este conteúdo:

   ```js
   // src/db/mongoose.js: a ligação da API ao MongoDB Atlas, através do Mongoose.
   // A cadeia de ligação leva o utilizador e a palavra-passe da base de dados:
   // é um segredo, por isso vem do ficheiro .env e nunca está escrita no código.
   import mongoose from "mongoose";

   /**
    * Liga o Mongoose à base de dados da papelaria, no Atlas.
    * Lê a cadeia de ligação de MONGODB_URI e o nome da base de DB_NAME.
    * Se faltar a cadeia ou a ligação falhar, a promessa é rejeitada com o erro,
    * e quem chamou decide o que fazer: o server.js não deixa a API arrancar.
    * @returns {Promise<void>} cumprida quando a ligação está feita
    */
   export async function ligarBaseDeDados() {
     const uri = process.env.MONGODB_URI;
     if (!uri) {
       throw new Error("falta a MONGODB_URI no ficheiro .env");
     }

     // A cadeia que o Atlas te dá não diz que base de dados usar. Sem o DB_NAME,
     // a API usa a base de teste, e nunca a papelaria do laboratório do Atlas.
     await mongoose.connect(uri, { dbName: process.env.DB_NAME || "papelaria-teste" });

     // Escreve o nome da base, e nunca a cadeia de ligação, que tem a palavra-passe.
     console.log(`Ligada à base de dados ${mongoose.connection.name}`);
   }
   ```

   Leitura guiada: a função lê a cadeia de ligação do `.env` e recusa-se a continuar sem ela. O `mongoose.connect` liga-se ao cluster, e o `dbName` diz que base de dados usar, porque a cadeia do Atlas não o diz. O `mongoose.connection.name` é o nome da base a que a ligação chegou, e a função escreve-o no terminal, e nunca a cadeia, que tem a palavra-passe. É a função da ficha do cinema, com o nome da base da papelaria. Repara na base que usa quando falta o `DB_NAME`: é a de teste, e não a `papelaria`. Se alguém se esquecer da linha no `.env`, a API vai parar à base onde não há nada a perder.

5. No `src/server.js`, a ligação abre-se no arranque, antes do `app.listen`. Substitui as três linhas de comentário do topo e os dois `import` por estes:

   ```js
   // src/server.js: o ponto de arranque da API da papelaria.
   // Cria a aplicação Express, monta as rotas, liga-se à base de dados e só
   // depois à porta. As regras e as consultas estão nas camadas.
   import express from "express";
   import { ligarBaseDeDados } from "./db/mongoose.js";
   import artigosRotas from "./rotas/artigos.rotas.js";
   ```

   E, logo antes do `app.listen(PORTA, (erro) => {`, acrescenta estas linhas:

   ```js
   // Primeiro a ligação à base, e só depois o servidor: uma API que não chega aos
   // dados não deve começar a aceitar pedidos. Se a ligação falhar, a API termina
   // com a razão escrita no terminal.
   try {
     await ligarBaseDeDados();
   } catch (erro) {
     console.error(`Não foi possível ligar à base de dados: ${erro.message}`);
     process.exit(1);
   }
   ```

   Leitura guiada: o primeiro bloco junta o `import` da `ligarBaseDeDados`. O segundo chama-a com o `await`, fora de qualquer função. Num projeto com `"type": "module"`, o `await` pode estar no topo do ficheiro, e o ficheiro espera por ele antes de continuar. Se a ligação falhar, o `process.exit(1)` termina o programa, e o `app.listen`, mais abaixo, nunca chega a correr: a API não aceita pedidos sem base.

6. No terminal da API, arranca-a com `npm run dev`. Antes de olhares, prevê as duas linhas que o terminal vai escrever.

   O que deves ver: `Ligada à base de dados papelaria-teste` e `API a correr em http://localhost:3000`. A API ligou-se ao Atlas, mas ainda lê os artigos do array: `/api/artigos/2` continua a mostrar a esferográfica azul, com o `id` 2. Se aparecer `Não foi possível ligar à base de dados`, a razão vem a seguir, e os [problemas frequentes](#problemas-frequentes) explicam as mais comuns.

## Fase 1: o contrato cresce

O contrato vem antes do código, como no tema anterior: é ele que diz o que a API tem de fazer, e é contra ele que se verifica no fim. Muda em três sítios. O artigo passa a ser identificado pelo `_id` que o MongoDB lhe dá, e não pelo `id` inteiro. Há três pedidos novos, com os métodos `POST`, para criar, `PATCH`, para alterar alguns campos, e `DELETE`, para apagar. E há quatro códigos novos. O 201 quer dizer criado, e o 204, correu bem e não há nada a devolver. O 409 quer dizer conflito: o pedido está bem escrito, mas os dados, como estão agora, não o deixam fazer. O 500 é um erro interno do servidor. Para saber mais, lê a secção "O contrato cresce: criar, alterar e apagar" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. Abre o `contrato-da-api.md`. Muda a frase do início para dizer que esta versão está ligada ao MongoDB Atlas. Diz também que as respostas são todas JSON, menos a de um artigo apagado, que não tem corpo. Na secção dos erros, troca o exemplo `"Não existe o artigo 99"` por `"Não existe o artigo 000000000000000000000000"`, porque o 99 passa a dar 400. E acrescenta lá esta frase:

   Qualquer pedido pode responder 500, com `{ "erro": "Erro interno do servidor" }`, quando a falha é do servidor, e não de quem pediu.

2. Na secção do artigo, troca o exemplo e a tabela por estes. Escreve-os tu, linha a linha, e pergunta-te, em cada linha, o que ela obriga a API a fazer.

   ```json
   { "_id": "6ae50cc456457b28519e9054", "nome": "Caderno A4 quadriculado", "categoria": "Papel", "stock": 12, "stockMinimo": 5, "precoCentimos": 250, "__v": 0 }
   ```

   | Campo | Tipo | Significado e regras |
   | --- | --- | --- |
   | `_id` | texto | identificador que o MongoDB deu ao artigo: 24 carateres, de 0 a 9 e de a a f |
   | `nome` | texto | nome do artigo; obrigatório; até 60 carateres, sem os espaços do início e do fim |
   | `categoria` | texto | `Papel`, `Escrita` ou `Desenho`; obrigatório |
   | `stock` | inteiro | unidades em loja; obrigatório; 0 ou mais |
   | `stockMinimo` | inteiro | abaixo deste valor, o artigo tem de ser encomendado; obrigatório; 0 ou mais |
   | `precoCentimos` | inteiro | preço em cêntimos, em que 250 são 2,50 €; obrigatório; 1 ou mais |
   | `__v` | inteiro | número de versão que o Mongoose acrescenta; não se envia |

3. Em `GET /api/artigos/:id`, o parâmetro passa a ser um texto, com os valores válidos "24 carateres, de 0 a 9 e de a a f". O 400 passa a ser "o `id` não tem a forma de um ObjectId", e o 404 "não existe nenhum artigo com esse `_id`".

4. Em `GET /api/artigos`, a categoria passa a poder vir "uma só vez", e o 400 ganha esse caso: "`categoria` vem repetida". A fase 3 explica porquê.

5. Antes da secção "Qualquer outro pedido", acrescenta as três secções novas:

   **POST /api/artigos.** Cria um artigo. O corpo, em JSON, traz os cinco campos do artigo, e só esses: `nome`, `categoria`, `stock`, `stockMinimo` e `precoCentimos`, com os tipos e as regras da tabela do artigo.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 201 | o artigo foi criado | o artigo criado, com o `_id` |
   | 400 | o corpo não é JSON, traz um campo que não é aceite ou com o tipo errado, falta um campo ou um valor não cumpre as regras | erro |

   **PATCH /api/artigos/:id.** Altera os campos que vierem no corpo, e deixa os outros como estão. O corpo, em JSON, traz um ou mais dos cinco campos do artigo, com os tipos e as regras da tabela do artigo.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | o artigo foi alterado | o artigo depois da alteração |
   | 400 | o `id` não tem a forma de um ObjectId, o corpo não traz nenhum campo, ou traz um campo que não é aceite, com o tipo errado ou que não cumpre as regras | erro |
   | 404 | não existe nenhum artigo com esse `_id` | erro |

   **DELETE /api/artigos/:id.** Apaga um artigo. Um artigo só se apaga quando o stock é 0.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 204 | o artigo foi apagado | sem corpo |
   | 400 | o `id` não tem a forma de um ObjectId | erro |
   | 404 | não existe nenhum artigo com esse `_id` | erro |
   | 409 | o artigo ainda tem stock | erro |

6. Se o teu contrato tinha, no fim, uma secção sobre a verificação do tema anterior, apaga-a. Esta versão vai ser verificada na fase 10.

### Paragem 1

O `contrato-da-api.md` tem o artigo com o `_id`, as regras de cada campo, os quatro pedidos de leitura e os três novos. A API ainda não cumpre nada disto, e é de propósito: o resto do laboratório escreve o código que o cumpre.

Pensa antes de continuares: o `DELETE` de um artigo com stock dá 409, e não 400. Porquê? A resposta: o pedido está bem escrito, com um `_id` com a forma certa, de um artigo que existe. O que o impede é o estado do artigo, que ainda tem unidades. Quando o stock chegar a 0, o mesmo pedido passa. Um 400 seria para um pedido mal escrito, que nunca passa, como um `id` com 3 carateres.

## Fase 2: a base de teste

Neste laboratório vais criar, alterar e apagar artigos muitas vezes, e algumas experiências vão correr mal de propósito. Se as fizesses na base `papelaria`, a do laboratório do Atlas, perdias o que lá inseriste à mão. Por isso, a API trabalha numa base de teste, a `papelaria-teste`, no mesmo cluster. Um seed, como o do cinema, reconstrói-a com os oito artigos do início sempre que precisares. Para saber mais, lê a secção "A base de teste" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. Dentro de `src`, cria a pasta `models` e, nela, o ficheiro `artigo.model.js`, com este conteúdo:

   ```js
   // src/models/artigo.model.js: o modelo dos artigos da papelaria, no Mongoose.
   // O schema descreve a forma dos documentos da coleção artigos: cada campo e o
   // seu tipo. O modelo é o que o resto da API usa para falar com essa coleção.
   import mongoose from "mongoose";

   const artigoSchema = new mongoose.Schema({
     nome: String,
     categoria: String,
     stock: Number,
     stockMinimo: Number,
     precoCentimos: Number,
   });

   // O terceiro argumento é o nome da coleção, escrito à mão, para o Mongoose
   // não o inventar com as regras do plural em inglês.
   export const Artigo = mongoose.model("Artigo", artigoSchema, "artigos");
   ```

   Leitura guiada: é o modelo da aula de 12 de outubro, sem a localização e sem o fornecedor, que nenhum pedido do contrato usa. Tem um campo por cada dado do artigo, com o tipo, e o nome da coleção escrito à mão. Na fase 6, cada campo ganha as suas regras.

2. Em `src`, cria o ficheiro `seed.js`, com este conteúdo:

   ```js
   // src/seed.js: reconstrói a base de teste da papelaria com os oito artigos.
   // Corre-se à parte, com npm run seed. Apaga primeiro os artigos que lá
   // estiverem, por isso pode correr-se as vezes que for preciso: depois de cada
   // experiência, a base volta a ficar como estava no início.
   import mongoose from "mongoose";
   import { ligarBaseDeDados } from "./db/mongoose.js";
   import { Artigo } from "./models/artigo.model.js";

   // Os artigos da papelaria, os mesmos do laboratório do Atlas, sem o _id:
   // o MongoDB dá um a cada artigo quando o insere.
   const artigos = [
     { nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250 },
     { nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60 },
     { nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180 },
     { nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35 },
     { nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520 },
     { nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95 },
     { nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120 },
     { nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450 },
   ];

   try {
     await ligarBaseDeDados();
     // O seed apaga todos os artigos da base onde está ligado. Na base papelaria,
     // a do laboratório do Atlas, perdias o que lá inseriste à mão. Por isso,
     // só continua se o nome da base acabar em -teste.
     const nomeDaBase = mongoose.connection.name;
     if (!nomeDaBase.endsWith("-teste")) {
       console.error(`O seed só corre numa base de teste, e esta é a ${nomeDaBase}. Muda o DB_NAME no .env.`);
     } else {
       const apagados = await Artigo.deleteMany({});
       console.log(`Apagados ${apagados.deletedCount} artigos`);
       // O insertMany verifica cada artigo com as regras do schema antes de inserir.
       const inseridos = await Artigo.insertMany(artigos);
       console.log(`Inseridos ${inseridos.length} artigos`);
     }
   } catch (erro) {
     console.error(`O seed falhou: ${erro.message}`);
   }

   // A ligação fica aberta até alguém a fechar. Sem esta linha, o programa
   // ficava à espera e não voltava ao terminal.
   await mongoose.disconnect();
   ```

   Leitura guiada: o seed é o do cinema, com os artigos da papelaria e uma verificação a mais. O `mongoose.connection.name` é o nome da base a que a ligação chegou. O `endsWith("-teste")` diz se esse nome acaba em `-teste`. Só nesse caso o seed apaga e insere: com o `.env` errado, na base `papelaria`, recusa-se a apagar. Os artigos não têm `_id`, porque é o MongoDB que dá um a cada um.

3. No `package.json`, acrescenta o script do seed a seguir ao `dev`, como no cinema. O bloco dos scripts fica assim:

   ```json
     "scripts": {
       "start": "node src/server.js",
       "dev": "node --watch --env-file=.env src/server.js",
       "seed": "node --env-file=.env src/seed.js"
     },
   ```

4. Antes de correres o seed, prevê as três linhas que vai escrever. Depois, no terminal dos comandos:

   ```bash
   npm run seed
   ```

   O que deves ver: `Ligada à base de dados papelaria-teste`, `Apagados 0 artigos` e `Inseridos 8 artigos`, e o terminal pronto para outro comando. Corre-o outra vez, e vês `Apagados 8 artigos` e `Inseridos 8 artigos`. A base continua com oito.

5. No Atlas, abre o "Data Explorer" (explorador de dados), com os nomes do laboratório do Atlas, confirmados a 14 de outubro de 2026. O que deves ver: uma base nova, `papelaria-teste`, com a coleção `artigos` e os oito artigos, cada um com o seu `_id` e o `__v`. A base `papelaria` continua lá, com os nove documentos do laboratório do Atlas. Se não vires a base nova, carrega no botão de atualizar do explorador.

6. Provoca a recusa do seed, numa base onde não há nada a perder. No `.env`, muda o `DB_NAME` para `papelaria-experiencia` e corre `npm run seed`. O que deves ver: `Ligada à base de dados papelaria-experiencia` e `O seed só corre numa base de teste, e esta é a papelaria-experiencia. Muda o DB_NAME no .env.` O terminal da API também pode mostrar `Ligada à base de dados papelaria-experiencia`, porque reiniciou com o `.env` novo. Por um momento, a lista dos artigos fica vazia. É normal. Volta a pôr `DB_NAME=papelaria-teste` no `.env`. Confirma no terminal da API que ela voltou a escrever `Ligada à base de dados papelaria-teste`. Se não reiniciou sozinha, para-a com Ctrl+C e volta a correr `npm run dev`.

### Paragem 2

A base `papelaria-teste` tem os oito artigos, e o seed reconstrói-a sempre que quiseres. A API ainda responde com o array.

Pensa antes de continuares: o teu `_id` do caderno A4 é igual ao do teu colega? E é igual ao que tinhas antes de correres o seed pela segunda vez? A resposta: não, nas duas perguntas. O MongoDB dá um `_id` novo a cada documento que insere, e o seed apaga e volta a inserir. Por isso, a partir daqui, nunca escrevas um `_id` no código: lê-o na lista, sempre que precisares dele.

## Fase 3: o repository

A pasta `src/dados` fazia de repository, com os artigos num array. Agora entra o repository a sério: a única camada que fala com o MongoDB, que recebe valores já verificados e escreve as consultas com o Mongoose. Há uma diferença que muda as outras camadas. Ler um array é imediato. Perguntar ao Atlas demora, e as funções do Mongoose devolvem uma promessa, uma resposta que ainda não chegou. Por isso, o repository usa o `await`, e quem o chama também: o service espera pelo repository, e o controller espera pelo service. Para saber mais, lê a secção "O repository: os artigos passam a vir da base" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. Dentro de `src`, cria a pasta `repositories` e, nela, o ficheiro `artigos.repository.js`, com este conteúdo:

   ```js
   // src/repositories/artigos.repository.js: o acesso aos artigos na base de dados.
   // Das camadas da API, é a única que usa o modelo Artigo e que escreve filtros
   // na linguagem do MongoDB, como o $lte. Recebe valores já verificados.
   import { Artigo } from "../models/artigo.model.js";

   /**
    * Procura os artigos que cumprem as condições recebidas.
    * As condições que faltam não se aplicam; sem nenhuma, vêm todos os artigos.
    * @param {object} condicoes com categoria (texto) e stockAte (número), os dois opcionais
    * @returns {Promise<object[]>} os artigos encontrados, possivelmente nenhum
    */
   export async function procurarArtigos(condicoes) {
     // O filtro é o mesmo que escreverias na barra do Atlas, construído aqui a
     // partir das condições. Nenhum valor do pedido entra nele sem ter sido verificado.
     const filtro = {};
     if (condicoes.categoria !== undefined) {
       filtro.categoria = condicoes.categoria;
     }
     if (condicoes.stockAte !== undefined) {
       filtro.stock = { $lte: condicoes.stockAte };
     }
     const artigos = await Artigo.find(filtro);
     return artigos;
   }

   /**
    * Procura um artigo pelo _id.
    * @param {string} id um identificador com a forma de um ObjectId, já verificado pelo controller
    * @returns {Promise<object | null>} o artigo, ou null se não existir
    */
   export async function procurarPorId(id) {
     // O findById devolve o documento, ou null quando nenhum tem este _id.
     const artigo = await Artigo.findById(id);
     return artigo;
   }
   ```

   Leitura guiada: começa pelo `import` do modelo `Artigo`, que só este ficheiro, o seed e, mais à frente, o script da fase 9 importam. A `procurarArtigos` recebe as condições com nomes da papelaria, como `stockAte`, e transforma-as no filtro do MongoDB. A `procurarPorId` usa o `findById`, que devolve o artigo ou `null`. As duas são `async`, porque esperam pela base.

2. Substitui o conteúdo de `src/services/artigos.service.js` por este:

   ```js
   // src/services/artigos.service.js: as regras da papelaria sobre os artigos.
   // Recebe valores simples e devolve valores simples. Não sabe nada de HTTP,
   // nem de MongoDB: pede os artigos ao repository.
   import { procurarArtigos, procurarPorId } from "../repositories/artigos.repository.js";

   /**
    * Devolve os artigos que cumprem os filtros recebidos.
    * Os filtros já chegam verificados pelo controller; os que faltam não se aplicam.
    * @param {object} filtros com categoria (texto) e stockMaximo (número), os dois opcionais
    * @returns {Promise<object[]>} os artigos, possivelmente nenhum
    */
   export async function listarArtigos(filtros) {
     const condicoes = {};
     if (filtros.categoria !== undefined) {
       condicoes.categoria = filtros.categoria;
     }
     if (filtros.stockMaximo !== undefined) {
       // O stock máximo inclui o valor: com 4, entram os artigos com stock 4.
       condicoes.stockAte = filtros.stockMaximo;
     }
     const artigos = await procurarArtigos(condicoes);
     return artigos;
   }

   /**
    * Procura um artigo pelo _id.
    * @param {string} id um identificador já verificado pelo controller
    * @returns {Promise<object | null>} o artigo, ou null se não existir
    */
   export async function obterArtigo(id) {
     const artigo = await procurarPorId(id);
     return artigo;
   }

   /**
    * Regra da papelaria: um artigo está abaixo do mínimo quando o stock é
    * menor do que o stock mínimo definido para ele, e é preciso encomendá-lo.
    * @returns {Promise<object[]>} os artigos a encomendar, possivelmente nenhum
    */
   export async function artigosAbaixoDoMinimo() {
     const artigos = await procurarArtigos({});
     return artigos.filter((artigo) => artigo.stock < artigo.stockMinimo);
   }
   ```

   Leitura guiada: o `import` deixou de pedir o array e passou a pedir as duas funções do repository. As três funções são as do tema anterior, agora `async`, com um `await` antes de cada chamada ao repository. A `listarArtigos` já não filtra: traduz o `stockMaximo` do contrato para o `stockAte` do repository e passa-lhe as condições. A `artigosAbaixoDoMinimo` pede todos os artigos e aplica a regra da papelaria, que continua aqui, porque é uma regra, e não uma consulta.

3. Substitui o conteúdo de `src/controllers/artigos.controller.js` por este:

   ```js
   // src/controllers/artigos.controller.js: a ponte entre o HTTP e o service.
   // Lê e verifica o que vem no pedido, chama o service e escolhe o código
   // e o corpo da resposta, sempre em JSON, como diz o contrato da API.
   import { listarArtigos, obterArtigo, artigosAbaixoDoMinimo } from "../services/artigos.service.js";

   /**
    * Converte um texto num inteiro, ou devolve null se o texto não for um inteiro.
    * @param {string} texto o valor tal como chegou no pedido
    * @returns {number | null}
    */
   function paraInteiro(texto) {
     // Number("") e Number("  ") dão 0, e não NaN. Sem esta verificação,
     // ?stockMaximo= (o parâmetro sem valor) seria tratado como ?stockMaximo=0.
     // Um parâmetro repetido, como ?stockMaximo=1&stockMaximo=2, chega como
     // um array, que não é texto: também não é um inteiro.
     if (typeof texto !== "string" || texto.trim() === "") {
       return null;
     }
     const numero = Number(texto);
     return Number.isInteger(numero) ? numero : null;
   }

   /** GET /api/artigos, com os filtros opcionais ?categoria= e ?stockMaximo= */
   export async function listar(req, res) {
     const filtros = {};

     if (req.query.categoria !== undefined) {
       // Repetido, como ?categoria=Papel&categoria=Escrita, o parâmetro chega
       // como um array, e não como um texto.
       if (typeof req.query.categoria !== "string") {
         res.status(400).json({ erro: "O parâmetro categoria tem de ser um texto, e só pode vir uma vez" });
         return;
       }
       filtros.categoria = req.query.categoria;
     }

     if (req.query.stockMaximo !== undefined) {
       const stockMaximo = paraInteiro(req.query.stockMaximo);
       if (stockMaximo === null || stockMaximo < 0) {
         res.status(400).json({ erro: "O parâmetro stockMaximo tem de ser um número inteiro, zero ou maior" });
         return;
       }
       filtros.stockMaximo = stockMaximo;
     }

     const artigos = await listarArtigos(filtros);
     res.json(artigos);
   }

   /** GET /api/artigos/abaixo-do-minimo */
   export async function abaixoDoMinimo(req, res) {
     const artigos = await artigosAbaixoDoMinimo();
     res.json(artigos);
   }

   /** GET /api/artigos/:id */
   export async function obter(req, res) {
     // Por agora, o id segue para o service tal como chegou. A fase seguinte verifica-o.
     const id = req.params.id;
     const artigo = await obterArtigo(id);
     if (artigo === null) {
       res.status(404).json({ erro: `Não existe o artigo ${id}` });
       return;
     }
     res.json(artigo);
   }
   ```

   Leitura guiada: as três funções exportadas passaram a `async`, com o `await` antes de cada chamada ao service. A `listar` ganhou uma verificação, a da categoria repetida. A `obter` deixou de converter o `id` num inteiro, porque o `_id` é um texto, e passa-o ao service tal como chegou. A fase 4 trata disso.

4. Apaga a pasta `src/dados`, com o ficheiro do array. Nenhum ficheiro a importa agora.

5. Guarda tudo e confirma no terminal que a API reiniciou sem erros. Antes de abrires, prevê o que mostra `/api/artigos?categoria=Papel`. Depois, abre no browser `/api/artigos`, `/api/artigos?categoria=Papel`, `/api/artigos?stockMaximo=4` e `/api/artigos/abaixo-do-minimo`.

   O que deves ver: os oito artigos, cada um com o `_id` e o `__v`, e depois os três de papel. Com stock até 4, a esferográfica, o bloco de notas, a resma e o compasso. A encomendar, a esferográfica, o bloco de notas, o marcador e o compasso. São as listas do tema anterior, agora lidas da base.

6. Na lista, copia o `_id` do caderno A4 quadriculado e abre `/api/artigos/` seguido desse `_id`. O que deves ver: o caderno, com 12 unidades. Abre também `/api/artigos/000000000000000000000000`, com 24 zeros. O que deves ver: 404, com `{"erro":"Não existe o artigo 000000000000000000000000"}`. O texto tem a forma de um ObjectId, mas nenhum artigo o tem.

7. Abre `/api/artigos?categoria=Papel&categoria=Escrita`. O que deves ver: 400, com `{"erro":"O parâmetro categoria tem de ser um texto, e só pode vir uma vez"}`. Repetido, o parâmetro chega como um array. Com os artigos no array, um array de categorias não fazia mal. Agora, a categoria vai parar a um filtro do MongoDB, e o Mongoose procurava os artigos das duas, com a forma da consulta escolhida por quem pediu. Os filtros constroem-se no servidor, com valores verificados.

8. Provoca um erro de propósito. Na `listar` do controller, apaga o `await` da linha `const artigos = await listarArtigos(filtros);` e guarda. Antes de abrires `/api/artigos`, prevê o que aparece. O que deves ver: 200, com `{}`, e nenhum erro no terminal. Sem o `await`, a variável guarda a promessa, e o `res.json` de uma promessa é um objeto vazio. Repõe o `await` e confirma que a lista volta.

### Paragem 3

Os quatro pedidos de leitura respondem com os artigos da base de teste, e um artigo pede-se pelo `_id`. A pasta `src/dados` saiu.

Pensa antes de continuares: abre `/api/artigos/abc`. O que aparece, e é o que o contrato diz? A resposta: aparece uma página de erro com o código 500, e não um 400 em JSON. Começa por `CastError: Cast to ObjectId failed for value "abc"`, a mensagem de o Mongoose não conseguir converter `abc` num ObjectId. A seguir vem uma lista de ficheiros do teu computador, por onde o erro passou. O contrato diz 400, e a culpa era do pedido. E a página mostra a quem pediu pormenores que não lhe dizem respeito. A fase 4 resolve a primeira parte, e a fase 6 a segunda.

## Fase 4: a forma de um ObjectId

Um ObjectId escreve-se com 24 carateres hexadecimais, os algarismos da base 16: cada um é de 0 a 9 ou de `a` a `f`. Um `id` com outra forma nunca pode ser o `_id` de um artigo, e o pedido está mal escrito: é um 400. Um `id` com a forma certa, mas que nenhum artigo tem, é um 404. Só o controller pode separar os dois, verificando a forma antes de chamar o service, como fazia com o `paraInteiro`. Para saber mais, lê a secção "O _id e a forma de um ObjectId" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. No controller, a seguir à função `paraInteiro`, acrescenta esta função:

   ```js
   /**
    * Diz se um texto tem a forma de um identificador do MongoDB, um ObjectId
    * escrito em texto: 24 carateres, cada um de 0 a 9 ou de a a f.
    * Não diz se o artigo existe; isso só a base de dados sabe.
    * @param {string} texto o valor tal como chegou no caminho do pedido
    * @returns {boolean}
    */
   function eIdentificador(texto) {
     if (typeof texto !== "string" || texto.length !== 24) {
       return false;
     }
     for (const carater of texto.toLowerCase()) {
       if (!"0123456789abcdef".includes(carater)) {
         return false;
       }
     }
     return true;
   }
   ```

   Leitura guiada: primeiro o tipo e o comprimento, que é o mais rápido de verificar. Depois, o `for...of` percorre o texto, um carater de cada vez, já em minúsculas, e procura cada um nos dezasseis símbolos hexadecimais, com o `includes`. Ao primeiro que não está lá, a função devolve `false`.

2. Substitui a função `obter` por esta:

   ```js
   /** GET /api/artigos/:id */
   export async function obter(req, res) {
     const id = req.params.id;
     if (!eIdentificador(id)) {
       res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
       return;
     }
     const artigo = await obterArtigo(id);
     if (artigo === null) {
       res.status(404).json({ erro: `Não existe o artigo ${id}` });
       return;
     }
     res.json(artigo);
   }
   ```

3. Antes de abrires, prevê o código de cada um destes pedidos: `/api/artigos/abc`, `/api/artigos/zzzzzzzzzzzzzzzzzzzzzzzz`, com 24 `z`, `/api/artigos/000000000000000000000000` e `/api/artigos/` seguido do `_id` do caderno, com as letras em maiúsculas. Depois, abre-os.

   O que deves ver: 400, 400, 404 e 200. Os dois primeiros dão `{"erro":"O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f"}`: o `abc` é curto, e o `z` não é um algarismo hexadecimal. O dos zeros tem a forma certa e não existe. O do caderno em maiúsculas passa a verificação, porque o `toLowerCase` o põe em minúsculas, e o MongoDB aceita as duas formas.

### Paragem 4

Os pedidos de leitura cumprem o contrato, com o 400 e o 404 do `id` separados.

Pensa antes de continuares: porque é que a `eIdentificador` está no controller, e não no repository, que é quem conhece o MongoDB? A resposta: porque a forma do `id` é uma regra do contrato, e verificar o que chega num pedido é o trabalho do controller. A função não usa o Mongoose: compara carateres. Assim, o controller continua sem importar nada da base de dados, e só o repository a conhece.

## Fase 5: o corpo do pedido e a lista fechada

Para criar um artigo, o pedido leva cinco campos. Esses dados vão no corpo do pedido, e não no endereço. O corpo é uma parte do pedido que vem depois do endereço e dos cabeçalhos, e um cabeçalho, o `Content-Type`, diz que o corpo vem em JSON. O Express não o lê sozinho. Quem o lê é o middleware `express.json()`, que o converte num objeto e o guarda em `req.body`.

O `req.body` é o que quem pediu quiser que seja. Pode trazer um `_id` escolhido à mão, um campo com o nome mal escrito, ou um objeto como `{ "$ne": null }` no lugar de um texto. Num filtro do MongoDB, esse objeto seria um operador. Por isso, o controller nunca o passa inteiro. Tem uma lista fechada de campos aceites, e copia só esses, cada um com o tipo certo. Tudo o resto é recusado com 400. Para saber mais, lê as secções "O corpo do pedido" e "Uma lista fechada de campos" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. No `src/server.js`, logo a seguir à linha `const app = express();`, acrescenta:

   ```js
   // Lê o corpo dos pedidos que chegam em JSON e põe-no em req.body, já como
   // objeto. Sem esta linha, o req.body ficava undefined em todos os pedidos.
   app.use(express.json());
   ```

   O `express.json()` tem de estar antes do `app.use` das rotas. Um middleware só trata os pedidos que passam por ele, e os pedidos chegam às rotas pela ordem do ficheiro.

2. No repository, acrescenta no fim esta função:

   ```js
   /**
    * Insere um artigo novo. O schema verifica as regras de cada campo antes de
    * inserir; se alguma falhar, a promessa é rejeitada com um ValidationError.
    * @param {object} dados os campos do artigo, só os da lista do controller
    * @returns {Promise<object>} o artigo inserido, já com o _id que o MongoDB lhe deu
    */
   export async function inserirArtigo(dados) {
     const artigo = await Artigo.create(dados);
     return artigo;
   }
   ```

3. No service, substitui a linha do `import` por esta, que pede também a `inserirArtigo`:

   ```js
   import {
     procurarArtigos,
     procurarPorId,
     inserirArtigo,
   } from "../repositories/artigos.repository.js";
   ```

   E acrescenta no fim esta função:

   ```js
   /**
    * Cria um artigo novo. As regras de cada campo estão no schema do modelo.
    * @param {object} dados os campos do artigo, já com o tipo verificado pelo controller
    * @returns {Promise<object>} o artigo criado
    */
   export async function criarArtigo(dados) {
     const artigo = await inserirArtigo(dados);
     return artigo;
   }
   ```

   Leitura guiada: a `criarArtigo` só passa os dados ao repository. É fina, como a `obterArtigo`, e existe para o controller só conhecer o service.

4. No controller, substitui a linha do `import` por esta:

   ```js
   import {
     listarArtigos,
     obterArtigo,
     artigosAbaixoDoMinimo,
     criarArtigo,
   } from "../services/artigos.service.js";
   ```

   A seguir ao `import`, antes da função `paraInteiro`, acrescenta as duas listas:

   ```js
   // Os campos que o corpo de um pedido pode trazer, para criar ou alterar um
   // artigo. É uma lista fechada: um campo que não esteja aqui é recusado.
   const CAMPOS_DE_TEXTO = ["nome", "categoria"];
   const CAMPOS_INTEIROS = ["stock", "stockMinimo", "precoCentimos"];
   ```

   A seguir à função `eIdentificador`, acrescenta esta:

   ```js
   /**
    * Lê do corpo do pedido os campos de um artigo: só os da lista, cada um com o tipo certo.
    * Não verifica os valores, como o mínimo ou as categorias: essas são regras da
    * papelaria, e quem as verifica é o schema do modelo.
    * @param {unknown} corpo o req.body, tal como o express.json() o deixou
    * @returns {object} { erro } com a mensagem do primeiro problema, ou { dados } com os campos lidos
    */
   function lerCamposDoArtigo(corpo) {
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
         // Se chegasse a um filtro, seria lido como um operador do MongoDB.
         if (typeof valor !== "string") {
           return { erro: `O campo ${campo} tem de ser um texto` };
         }
       } else if (CAMPOS_INTEIROS.includes(campo)) {
         if (!Number.isInteger(valor)) {
           return { erro: `O campo ${campo} tem de ser um número inteiro` };
         }
       } else {
         return { erro: `O campo ${campo} não é aceite` };
       }
       dados[campo] = valor;
     }
     return { dados: dados };
   }
   ```

   E, no fim do ficheiro, a função do pedido:

   ```js
   /** POST /api/artigos, com o artigo novo no corpo, em JSON */
   export async function criar(req, res) {
     const leitura = lerCamposDoArtigo(req.body);
     if (leitura.erro) {
       res.status(400).json({ erro: leitura.erro });
       return;
     }
     const artigo = await criarArtigo(leitura.dados);
     res.status(201).json(artigo);
   }
   ```

   Leitura guiada: a `lerCamposDoArtigo` confirma primeiro que o corpo é um objeto. O `Object.keys(corpo)` dá a lista dos nomes dos campos que vieram, e o `for...of` percorre-os. Cada campo tem de estar numa das duas listas e ter o tipo dela; ao primeiro problema, a função devolve `{ erro }`. Se todos passarem, devolve `{ dados }`, com a cópia. A `criar` lê o corpo, responde 400 com o erro, se houver, e senão chama o service e responde 201, com o artigo criado.

5. Em `src/rotas/artigos.rotas.js`, substitui a linha do `import` do controller e junta a rota do `POST` a seguir às outras. O ficheiro fica assim:

   ```js
   // src/rotas/artigos.rotas.js: que pedido vai para que função do controller.
   // Os caminhos são relativos ao sítio onde este router é montado, em server.js:
   // "/" quer dizer /api/artigos, e "/:id" quer dizer /api/artigos/:id.
   import express from "express";
   import { listar, abaixoDoMinimo, obter, criar } from "../controllers/artigos.controller.js";

   const router = express.Router();

   router.get("/", listar);
   // O caminho fixo vem antes do caminho com parâmetro. Ao contrário,
   // /abaixo-do-minimo seria tratado como um :id, e daria 400.
   router.get("/abaixo-do-minimo", abaixoDoMinimo);
   router.get("/:id", obter);
   router.post("/", criar);

   export default router;
   ```

6. Guarda tudo e confirma que a API reiniciou. Agora vais precisar da consola do browser, porque a barra de endereço só faz pedidos `GET`. Abre `http://localhost:3000/api/estado`, abre as ferramentas de programador e escolhe o separador "Consola". Cola este bloco e carrega em Enter. Se o browser te pedir para escreveres `allow pasting` antes de colar, escreve-o, carrega em Enter e cola outra vez.

   ```js
   // Ferramentas da consola para este laboratório. Cola este bloco uma vez,
   // numa página da tua API. Se recarregares a página, cola-o outra vez.

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

   // Os _id dos artigos de que os pedidos precisam, guardados pelo nome.
   const ids = {};

   // Vai buscar a lista dos artigos e devolve o _id do artigo com este nome,
   // ou null se não houver nenhum com esse nome.
   async function idDe(nome) {
     const resposta = await fetch("/api/artigos");
     const artigos = await resposta.json();
     const artigo = artigos.find((artigo) => artigo.nome === nome);
     if (artigo === undefined) {
       return null;
     }
     return artigo._id;
   }
   ```

   Leitura guiada: a `pedir` faz o pedido com o `fetch`, que conheces do 11.º ano. O segundo argumento leva o método e, quando há corpo, o cabeçalho e o texto JSON. Escreve o código e o corpo da resposta, lido como texto, porque uma resposta 204 não tem corpo. A `idDe` lê a lista dos artigos e devolve o `_id` do que tem aquele nome. O objeto `ids` guarda esses `_id` com um nome teu, como `ids.caderno`, para não os escreveres à mão. Os caminhos começam por `/api`, sem o `http://localhost:3000`, porque o `fetch` usa o endereço da página aberta.

7. Antes de correres, prevê o que escreve a consola. Depois, na consola:

   ```js
   await pedir("GET", "/api/estado");
   ```

   O que deves ver: `200 {"estado":"ok","aplicacao":"API da papelaria"}`. A consola fala com a tua API.

8. Cria um artigo. Antes de correres, prevê o código e o que vem no corpo da resposta.

   ```js
   await pedir("POST", "/api/artigos", { nome: "Borracha branca", categoria: "Desenho", stock: 10, stockMinimo: 4, precoCentimos: 40 });
   ```

   O que deves ver: `201`, e o artigo, com os cinco campos, o `_id` que o MongoDB lhe deu e o `__v`. Abre `/api/artigos` noutro separador: a borracha está lá, a nona.

9. Experimenta a lista fechada com estes três pedidos, um de cada vez, prevendo antes a mensagem de cada um:

   ```js
   await pedir("POST", "/api/artigos", { nome: "Cola", stock: "10" });
   await pedir("POST", "/api/artigos", { nome: "Cola", _id: "000000000000000000000001" });
   await pedir("POST", "/api/artigos", { nome: { $ne: null } });
   ```

   O que deves ver: três respostas 400, com `O campo stock tem de ser um número inteiro`, `O campo _id não é aceite` e `O campo nome tem de ser um texto`. O `"10"`, com aspas, é um texto. O `_id` não está em nenhuma lista. O `{ $ne: null }` é um objeto, e não um texto. Nenhum dos três chegou ao service. Por cima de cada resposta 400, a consola mostra também uma linha a vermelho, `Failed to load resource: the server responded with a status of 400 (Bad Request)`. É o browser a avisar que o código da resposta é de erro, e não um erro do teu código: a linha que interessa é a que a `pedir` escreve.

### Paragem 5

A API cria artigos, só com os campos da lista e com o tipo certo.

Pensa antes de continuares: corre `await pedir("POST", "/api/artigos", { nome: "Cola" })` e `await pedir("POST", "/api/artigos", { nome: "Mochila", categoria: "Mochilas", stock: -3, stockMinimo: 0, precoCentimos: 0 })`. O que acontece, e é o que a papelaria quer? A resposta: os dois respondem 201, e os dois artigos ficam na base. A cola não tem categoria, nem stock, nem preço. A mochila tem uma categoria que a papelaria não vende, stock negativo e preço de zero cêntimos. A lista fechada só vê os nomes e os tipos dos campos, e todos estavam certos. Os valores são regras da papelaria, e ainda ninguém as escreveu. Corre `npm run seed` para limpar a base de teste, e lê a fase 6.

## Fase 6: as regras de cada campo, no schema

Um stock de -3 é um inteiro, mas uma papelaria não tem -3 cadernos. Estas regras são do domínio, o assunto da aplicação, e ficam no schema do modelo, onde podem ser garantidas. Tudo o que escreve artigos passa pelo modelo: a API, o seed e os scripts. O Mongoose verifica as regras antes de criar um documento, e, se alguma falhar, não escreve nada e lança um `ValidationError`. Numa alteração, só as verifica quando se pede, como a fase 7 mostra. A divisão fica assim: o controller vê a forma do pedido, os campos e os tipos; o schema vê os valores, se fazem sentido para a papelaria. Para saber mais, lê a secção "As regras de cada campo, no schema" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. Substitui o conteúdo de `src/models/artigo.model.js` por este:

   ```js
   // src/models/artigo.model.js: o modelo dos artigos da papelaria, no Mongoose.
   // O schema descreve a forma dos documentos da coleção artigos e guarda as
   // regras de cada campo: o que é obrigatório, os mínimos e as categorias.
   // Tudo o que escreve artigos passa por estas regras: a API, o seed e os scripts.
   import mongoose from "mongoose";

   // As categorias que a papelaria vende. Um artigo de outra categoria é recusado.
   const CATEGORIAS = ["Papel", "Escrita", "Desenho"];

   const artigoSchema = new mongoose.Schema({
     nome: {
       type: String,
       // O segundo valor de cada regra é a mensagem que a API devolve quando
       // a regra falha. Sem ele, o Mongoose escrevia uma mensagem em inglês.
       required: [true, "O nome é obrigatório"],
       // O trim tira os espaços do início e do fim antes de verificar e guardar.
       // Um nome só com espaços fica vazio, e o required recusa-o.
       trim: true,
       maxlength: [60, "O nome tem no máximo 60 carateres"],
     },
     categoria: {
       type: String,
       required: [true, "A categoria é obrigatória"],
       enum: { values: CATEGORIAS, message: "A categoria tem de ser Papel, Escrita ou Desenho" },
     },
     stock: {
       type: Number,
       required: [true, "O stock é obrigatório"],
       min: [0, "O stock não pode ser negativo"],
     },
     stockMinimo: {
       type: Number,
       required: [true, "O stock mínimo é obrigatório"],
       min: [0, "O stock mínimo não pode ser negativo"],
     },
     precoCentimos: {
       type: Number,
       required: [true, "O preço é obrigatório"],
       min: [1, "O preço tem de ser de pelo menos 1 cêntimo"],
     },
   });

   // O terceiro argumento é o nome da coleção, escrito à mão, para o Mongoose
   // não o inventar com as regras do plural em inglês.
   export const Artigo = mongoose.model("Artigo", artigoSchema, "artigos");
   ```

   Leitura guiada: cada campo passou a ser um objeto com o tipo e as regras. O `required` diz que o campo é obrigatório, e um texto vazio também conta como em falta. O `trim` tira os espaços do princípio e do fim, antes de verificar e de guardar. O `maxlength` é o comprimento máximo de um texto, o `min` o valor mínimo de um número, e o `enum` a lista dos valores possíveis. Cada regra tem uma mensagem em português, que é a que a API vai devolver.

2. Corre `npm run seed`. O que deves ver: `Apagados` e `Inseridos 8 artigos`, como antes. O `insertMany` verifica cada artigo com as regras novas, e os oito do início cumprem-nas.

3. Na consola, volta a criar a cola sem os outros campos. Antes, prevê o que aparece agora.

   ```js
   await pedir("POST", "/api/artigos", { nome: "Cola" });
   ```

   O que deves ver: o código 500, e um texto em HTML que começa por `<!DOCTYPE html>`. Lá dentro, aparece `ValidationError: Artigo validation failed`, com as mensagens das regras, e a seguir a lista dos ficheiros por onde o erro passou. O schema recusou a cola, e o artigo não ficou na base. Mas a resposta não cumpre o contrato: o código devia ser 400, e o corpo, JSON. E mostra a quem pediu os caminhos dos ficheiros do teu computador. É o tratamento de erros do próprio Express, que só se usa enquanto não houver outro.

4. No `src/server.js`, a seguir ao middleware final, acrescenta o middleware de erros:

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
   ```

   Leitura guiada: o Express reconhece um middleware de erros pelos quatro parâmetros, e só o chama quando um pedido acabou num erro. No Express 5, um erro lançado dentro de uma função `async` de uma rota vem parar aqui sozinho. É o caso do erro do `Artigo.create`, que sobe pelo repository e pelo service até à `criar`. O primeiro caso é o corpo que não é JSON, que o `express.json()` marca com o `type` `"entity.parse.failed"`. O segundo é a recusa do schema. O `Object.values(erro.errors)` dá a lista das regras que falharam, o `map` tira de cada uma a mensagem, e o `join` junta-as. Tudo o resto é um 500, com uma mensagem que não diz nada do que está por dentro. A razão fica no terminal, para ti.

5. Na `criar` do controller, por cima da linha `const artigo = await criarArtigo(leitura.dados);`, acrescenta este comentário. Diz a quem ler o código para onde vai o erro de uma regra que falhe, que nenhuma linha da função apanha:

   ```js
     // Se uma regra do schema falhar, o criarArtigo rejeita a promessa, e o
     // Express passa o erro ao middleware de erros, no server.js, que responde 400.
   ```

6. Guarda, e repete os dois pedidos da paragem 5, prevendo antes as respostas:

   ```js
   await pedir("POST", "/api/artigos", { nome: "Cola" });
   await pedir("POST", "/api/artigos", { nome: "Mochila", categoria: "Mochilas", stock: -3, stockMinimo: 0, precoCentimos: 0 });
   ```

   O que deves ver: dois 400, em JSON. O primeiro, `O preço é obrigatório. O stock mínimo é obrigatório. O stock é obrigatório. A categoria é obrigatória`. O segundo, `A categoria tem de ser Papel, Escrita ou Desenho. O stock não pode ser negativo. O preço tem de ser de pelo menos 1 cêntimo`. A ordem das mensagens é a que o Mongoose escolhe, e não tem de ser a dos campos.

7. Experimenta o `trim`. Antes de correres, prevê o nome com que o artigo fica, e o que responde o segundo pedido:

   ```js
   await pedir("POST", "/api/artigos", { nome: "  Cola em bastão  ", categoria: "Desenho", stock: 6, stockMinimo: 2, precoCentimos: 150 });
   await pedir("POST", "/api/artigos", { nome: "   ", categoria: "Desenho", stock: 6, stockMinimo: 2, precoCentimos: 150 });
   ```

   O que deves ver: o primeiro dá 201, com `"nome":"Cola em bastão"`, sem os espaços. O segundo dá 400, com `O nome é obrigatório`: sem os espaços, o nome fica vazio.

8. Por fim, um corpo que não é JSON. O `pedir` escreve sempre JSON válido, por isso este pedido faz-se com o `fetch` diretamente. Antes de correres, prevê o código e a mensagem:

   ```js
   await fetch("/api/artigos", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{ nome: " }).then((resposta) => resposta.text());
   ```

   O que deves ver: o texto `{"erro":"O corpo do pedido não é JSON válido"}`, entre aspas, porque a consola mostra o valor de um texto. No separador "Rede", o código é 400. O texto não era JSON, e o `express.json()` passou o erro ao middleware de erros, sem chegar à rota.

### Paragem 6

A API cria artigos que cumprem as regras da papelaria e recusa os outros com 400, em JSON. Os erros que ninguém previu dão 500, sem pormenores. Corre `npm run seed`, para a base de teste voltar aos oito artigos.

Pensa antes de continuares: um colega diz que a regra do stock negativo devia estar também no controller, "por segurança". Faz falta? A resposta: não. O controller verifica que o stock é um inteiro, que é a forma do pedido. O schema verifica que não é negativo, e o schema corre sempre que alguém cria um artigo, venha o pedido de onde vier. Nas alterações, também corre, com uma opção que a fase 7 mostra. Escrever a mesma regra em dois sítios obrigava a mudá-la nos dois, e um dia ficavam diferentes.

## Fase 7: alterar só o que vem no pedido

A papelaria recebeu uma entrega de cadernos e quer mudar o stock, sem reescrever o resto do artigo. O `PATCH` altera só os campos que vierem no corpo. No Mongoose, faz-se com o `findByIdAndUpdate`, que procura o artigo pelo `_id` e muda os campos recebidos. Esta fase tem uma parte que não está escrita aqui: as opções da função vais encontrá-las na documentação do Mongoose. Para saber mais, lê a secção "Alterar só o que vem no pedido" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. No repository, acrescenta no fim esta função. É a primeira versão, ainda sem opções:

   ```js
   /**
    * Altera os campos recebidos de um artigo, e deixa os outros como estão.
    * @param {string} id um identificador com a forma de um ObjectId, já verificado
    * @param {object} dados os campos a alterar, só os da lista do controller
    * @returns {Promise<object | null>} o artigo alterado, ou null se não existir
    */
   export async function alterarPorId(id, dados) {
     const artigo = await Artigo.findByIdAndUpdate(id, dados);
     return artigo;
   }
   ```

2. No service, junta a `alterarPorId` ao `import` do repository, a seguir à `inserirArtigo`, e acrescenta no fim esta função:

   ```js
   /**
    * Altera os campos recebidos de um artigo.
    * @param {string} id um identificador já verificado pelo controller
    * @param {object} dados os campos a alterar, já com o tipo verificado
    * @returns {Promise<object | null>} o artigo alterado, ou null se não existir
    */
   export async function alterarArtigo(id, dados) {
     const artigo = await alterarPorId(id, dados);
     return artigo;
   }
   ```

3. No controller, junta a `alterarArtigo` ao `import` do service, a seguir à `criarArtigo`, e acrescenta no fim esta função:

   ```js
   /** PATCH /api/artigos/:id, com os campos a alterar no corpo, em JSON */
   export async function alterar(req, res) {
     const id = req.params.id;
     if (!eIdentificador(id)) {
       res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
       return;
     }
     const leitura = lerCamposDoArtigo(req.body);
     if (leitura.erro) {
       res.status(400).json({ erro: leitura.erro });
       return;
     }
     if (Object.keys(leitura.dados).length === 0) {
       res.status(400).json({ erro: "O pedido não traz nenhum campo para alterar" });
       return;
     }
     const artigo = await alterarArtigo(id, leitura.dados);
     if (artigo === null) {
       res.status(404).json({ erro: `Não existe o artigo ${id}` });
       return;
     }
     res.json(artigo);
   }
   ```

   Leitura guiada: as verificações são as que conheces, pela ordem do contrato: a forma do `id`, e a lista fechada, com a mesma função do `POST`. A nova é a do corpo vazio. Um `{}` passa a lista fechada, porque não traz nenhum campo errado, mas também não traz nada para alterar. O `null` do service, quando o artigo não existe, dá 404, como na `obter`.

4. No router, junta a `alterar` ao `import` do controller, a seguir à `criar`, e acrescenta a rota a seguir à do `POST`:

   ```js
   router.patch("/:id", alterar);
   ```

5. Guarda. Na consola, guarda o `_id` do caderno e muda-lhe o stock para 7. Antes de correres, prevê o stock que vem na resposta.

   ```js
   ids.caderno = await idDe("Caderno A4 quadriculado");
   await pedir("PATCH", `/api/artigos/${ids.caderno}`, { stock: 7 });
   ```

   O caminho escreve-se entre acentos graves, com o `${ids.caderno}` no lugar do `_id`, como as mensagens com valores do controller.

   O que deves ver: 200, com o caderno A4 e `"stock":12`. Escreve `ids.caderno` na consola, para veres o `_id`, e abre no browser `/api/artigos/` seguido dele, ou abre o caderno A4 no Atlas, na base `papelaria-teste`: o stock é 7. A base mudou, mas a resposta mostra o caderno como estava antes.

6. Experimenta uma regra do schema. Antes de correres, prevê o código da resposta e o stock que fica na base.

   ```js
   await pedir("PATCH", `/api/artigos/${ids.caderno}`, { stock: -5 });
   ```

   O que deves ver: 200. No browser, o caderno A4 tem agora `"stock":-5`. A regra do `min`, que no `POST` recusava um stock negativo, não correu. A paragem 6 dizia que o schema corre quando se cria um artigo; numa alteração feita assim, por omissão, não corre.

7. As duas surpresas resolvem-se com opções, que se passam num terceiro argumento do `findByIdAndUpdate`. Abre a documentação do Mongoose, em [mongoosejs.com/docs/api/model.html](https://mongoosejs.com/docs/api/model.html), e procura a secção `Model.findByIdAndUpdate()`. Confirma no topo da página a versão da documentação, que deve ser a 9. A versão que tens instalada vê-se no `package-lock.json`, ou com o comando `npm ls mongoose`. A página foi consultada a 30 de outubro de 2026, na versão 9.11.4. Na lista dos parâmetros, procura a opção que faz a função devolver o documento depois da alteração, e a que faz correr as regras do schema. Escreve no caderno o nome de cada uma e o valor que lhe tens de dar.

   A resposta: a primeira é o `returnDocument`, com o valor `'after'`; por omissão é `'before'`, e por isso vinha o stock antigo. A segunda é o `runValidators`, com `true`: as regras do schema, a que a documentação chama validators, só correm numa alteração quando se pede. A documentação mostra também o `new`, com `true`, que faz o mesmo do que o `returnDocument: 'after'`, e que muitos tutoriais usam. No Mongoose 9 está marcado como obsoleto.

8. Substitui a função `alterarPorId` do repository por esta:

   ```js
   /**
    * Altera os campos recebidos de um artigo, e deixa os outros como estão.
    * @param {string} id um identificador com a forma de um ObjectId, já verificado
    * @param {object} dados os campos a alterar, só os da lista do controller
    * @returns {Promise<object | null>} o artigo depois da alteração, ou null se não existir
    */
   export async function alterarPorId(id, dados) {
     // Sem as duas opções, o findByIdAndUpdate devolvia o artigo como estava
     // antes da alteração, e não verificava as regras do schema, que por omissão
     // só correm quando um documento é criado.
     const artigo = await Artigo.findByIdAndUpdate(id, dados, {
       returnDocument: "after",
       runValidators: true,
     });
     return artigo;
   }
   ```

9. Guarda, corre `npm run seed` para limpar o stock negativo, e volta a guardar o `_id` do caderno, que o seed mudou. Repete os dois pedidos, prevendo antes as respostas:

   ```js
   ids.caderno = await idDe("Caderno A4 quadriculado");
   await pedir("PATCH", `/api/artigos/${ids.caderno}`, { stock: 7 });
   await pedir("PATCH", `/api/artigos/${ids.caderno}`, { stock: -5 });
   ```

   O que deves ver: 200, com `"stock":7`; e 400, com `{"erro":"O stock não pode ser negativo"}`. No Atlas, o caderno tem 7, e o -5 não chegou à base.

10. Experimenta os outros casos do contrato, prevendo antes cada resposta:

    ```js
    await pedir("PATCH", `/api/artigos/${ids.caderno}`, {});
    await pedir("PATCH", `/api/artigos/${ids.caderno}`, { precoCentimo: 300 });
    await pedir("PATCH", "/api/artigos/000000000000000000000000", { stock: 7 });
    ```

    O que deves ver: 400, com `O pedido não traz nenhum campo para alterar`; 400, com `O campo precoCentimo não é aceite`, porque falta o `s`; e 404, com `Não existe o artigo 000000000000000000000000`.

### Paragem 7

A API altera os campos que vierem no pedido, responde com o artigo depois da alteração e recusa o que não cumpre as regras.

Pensa antes de continuares: o `PATCH` com `{ precoCentimo: 300 }` é recusado. Se a lista fechada ignorasse os campos que não conhece, em vez de os recusar, o que respondia a API? A resposta: respondia 400, com `O pedido não traz nenhum campo para alterar`, ou, num pedido com outro campo certo, 200, com o preço como estava. Quem pediu achava que tinha mudado o preço, ou não percebia porque não mudou. Recusar, e dizer qual é o campo, é o que mostra o erro de escrita.

## Fase 8: apagar, e a regra que precisa da base

A papelaria tem uma regra para apagar: um artigo só sai do catálogo quando já não há unidades na loja. Esta regra não cabe no schema, porque o schema verifica os valores que se vão escrever, e apagar não escreve nada. Para a aplicar, é preciso ir à base ver o stock do artigo agora. Uma regra que precisa do estado dos dados fica no service, que o pode pedir ao repository. O service diz o que aconteceu, e o controller traduz em códigos: 204, sem corpo, quando apagou; 404, quando o artigo não existe; e 409, quando a regra não deixa. Para saber mais, lê a secção "Apagar, e a regra que precisa da base" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. No repository, acrescenta no fim esta função:

   ```js
   /**
    * Apaga um artigo.
    * @param {string} id um identificador com a forma de um ObjectId, já verificado
    * @returns {Promise<void>} cumprida quando o artigo foi apagado
    */
   export async function apagarPorId(id) {
     await Artigo.findByIdAndDelete(id);
   }
   ```

2. No service, junta a `apagarPorId` ao `import` do repository, a seguir à `alterarPorId`, e acrescenta no fim esta função:

   ```js
   /**
    * Apaga um artigo, se a regra da papelaria o deixar.
    * @param {string} id um identificador já verificado pelo controller
    * @returns {Promise<string>} o que aconteceu: "apagado", "nao-existe" ou "tem-stock"
    */
   export async function apagarArtigo(id) {
     const artigo = await procurarPorId(id);
     if (artigo === null) {
       return "nao-existe";
     }
     // Regra da papelaria: um artigo só sai do catálogo quando já não há
     // unidades na loja. Enquanto houver stock, ainda há o que vender.
     if (artigo.stock > 0) {
       return "tem-stock";
     }
     await apagarPorId(id);
     return "apagado";
   }
   ```

   Leitura guiada: o service pede o artigo ao repository. Se não existe, devolve `"nao-existe"`. Se tem stock, devolve `"tem-stock"`, e não apaga nada. Só no último caso pede ao repository que o apague, e devolve `"apagado"`. São três palavras, e nenhuma é um código HTTP.

3. No controller, junta a `apagarArtigo` ao `import` do service, a seguir à `alterarArtigo`, e acrescenta no fim esta função:

   ```js
   /** DELETE /api/artigos/:id */
   export async function apagar(req, res) {
     const id = req.params.id;
     if (!eIdentificador(id)) {
       res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
       return;
     }
     const resultado = await apagarArtigo(id);
     if (resultado === "nao-existe") {
       res.status(404).json({ erro: `Não existe o artigo ${id}` });
       return;
     }
     if (resultado === "tem-stock") {
       res.status(409).json({ erro: "Não se pode apagar um artigo que ainda tem stock" });
       return;
     }
     // 204: apagado, e a resposta não tem corpo.
     res.status(204).end();
   }
   ```

   Leitura guiada: cada palavra do service dá uma resposta. O `res.status(204).end()` termina a resposta sem corpo, porque depois de apagar não há nada a devolver.

4. No router, junta a `apagar` ao `import` do controller, a seguir à `alterar`, e acrescenta a rota a seguir à do `PATCH`. O ficheiro fica assim:

   ```js
   // src/rotas/artigos.rotas.js: que pedido vai para que função do controller.
   // Os caminhos são relativos ao sítio onde este router é montado, em server.js:
   // "/" quer dizer /api/artigos, e "/:id" quer dizer /api/artigos/:id.
   import express from "express";
   import { listar, abaixoDoMinimo, obter, criar, alterar, apagar } from "../controllers/artigos.controller.js";

   const router = express.Router();

   router.get("/", listar);
   // O caminho fixo vem antes do caminho com parâmetro. Ao contrário,
   // /abaixo-do-minimo seria tratado como um :id, e daria 400.
   router.get("/abaixo-do-minimo", abaixoDoMinimo);
   router.get("/:id", obter);
   router.post("/", criar);
   router.patch("/:id", alterar);
   router.delete("/:id", apagar);

   export default router;
   ```

5. Guarda e corre `npm run seed`. Na consola, guarda os `_id` do caderno, que tem 12 unidades, e do bloco de notas, que tem 0:

   ```js
   ids.caderno = await idDe("Caderno A4 quadriculado");
   ids.bloco = await idDe("Bloco de notas A5");
   ```

6. Antes de correres, prevê o que dá cada um destes pedidos. Depois, corre-os por esta ordem:

   ```js
   await pedir("DELETE", `/api/artigos/${ids.caderno}`);
   await pedir("DELETE", `/api/artigos/${ids.bloco}`);
   await pedir("DELETE", `/api/artigos/${ids.bloco}`);
   await pedir("DELETE", "/api/artigos/abc");
   ```

   O que deves ver, pela ordem dos pedidos:

   - 409, com `{"erro":"Não se pode apagar um artigo que ainda tem stock"}`;
   - `204` sem nada à frente, porque a resposta não tem corpo;
   - 404, com `Não existe o artigo` e o `_id` do bloco, que já foi apagado;
   - 400, com a mensagem do identificador.

   No Atlas, a coleção tem sete artigos, sem o bloco de notas, e o caderno A4 continua lá.

### Paragem 8

A API faz o CRUD completo, com as regras da papelaria: as de cada campo no schema, e a do stock, que precisa da base, no service.

Os quatro ficheiros que mudaram em várias fases, como devem estar agora, para conferires os teus. O router está no passo 4.

O `src/server.js`:

```js
// src/server.js: o ponto de arranque da API da papelaria.
// Cria a aplicação Express, monta as rotas, liga-se à base de dados e só
// depois à porta. As regras e as consultas estão nas camadas.
import express from "express";
import { ligarBaseDeDados } from "./db/mongoose.js";
import artigosRotas from "./rotas/artigos.rotas.js";

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, a API usa a 3000.
const PORTA = process.env.PORT || 3000;

const app = express();

// Lê o corpo dos pedidos que chegam em JSON e põe-no em req.body, já como
// objeto. Sem esta linha, o req.body ficava undefined em todos os pedidos.
app.use(express.json());

// Rota de estado: serve para confirmar que a API está ligada e a responder.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "API da papelaria" });
});

// Todos os pedidos começados por /api/artigos seguem para o router dos artigos.
app.use("/api/artigos", artigosRotas);

// Middleware final: nenhuma rota respondeu. Responde em JSON, como o resto
// da API, para quem a usa encontrar sempre o erro no mesmo sítio.
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
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

// Primeiro a ligação à base, e só depois o servidor: uma API que não chega aos
// dados não deve começar a aceitar pedidos. Se a ligação falhar, a API termina
// com a razão escrita no terminal.
try {
  await ligarBaseDeDados();
} catch (erro) {
  console.error(`Não foi possível ligar à base de dados: ${erro.message}`);
  process.exit(1);
}

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a API: ${erro.message}`);
    return;
  }
  console.log(`API a correr em http://localhost:${PORTA}`);
});
```

O `src/repositories/artigos.repository.js`:

```js
// src/repositories/artigos.repository.js: o acesso aos artigos na base de dados.
// Das camadas da API, é a única que usa o modelo Artigo e que escreve filtros
// na linguagem do MongoDB, como o $lte. Recebe valores já verificados.
import { Artigo } from "../models/artigo.model.js";

/**
 * Procura os artigos que cumprem as condições recebidas.
 * As condições que faltam não se aplicam; sem nenhuma, vêm todos os artigos.
 * @param {object} condicoes com categoria (texto) e stockAte (número), os dois opcionais
 * @returns {Promise<object[]>} os artigos encontrados, possivelmente nenhum
 */
export async function procurarArtigos(condicoes) {
  // O filtro é o mesmo que escreverias na barra do Atlas, construído aqui a
  // partir das condições. Nenhum valor do pedido entra nele sem ter sido verificado.
  const filtro = {};
  if (condicoes.categoria !== undefined) {
    filtro.categoria = condicoes.categoria;
  }
  if (condicoes.stockAte !== undefined) {
    filtro.stock = { $lte: condicoes.stockAte };
  }
  const artigos = await Artigo.find(filtro);
  return artigos;
}

/**
 * Procura um artigo pelo _id.
 * @param {string} id um identificador com a forma de um ObjectId, já verificado pelo controller
 * @returns {Promise<object | null>} o artigo, ou null se não existir
 */
export async function procurarPorId(id) {
  // O findById devolve o documento, ou null quando nenhum tem este _id.
  const artigo = await Artigo.findById(id);
  return artigo;
}

/**
 * Insere um artigo novo. O schema verifica as regras de cada campo antes de
 * inserir; se alguma falhar, a promessa é rejeitada com um ValidationError.
 * @param {object} dados os campos do artigo, só os da lista do controller
 * @returns {Promise<object>} o artigo inserido, já com o _id que o MongoDB lhe deu
 */
export async function inserirArtigo(dados) {
  const artigo = await Artigo.create(dados);
  return artigo;
}

/**
 * Altera os campos recebidos de um artigo, e deixa os outros como estão.
 * @param {string} id um identificador com a forma de um ObjectId, já verificado
 * @param {object} dados os campos a alterar, só os da lista do controller
 * @returns {Promise<object | null>} o artigo depois da alteração, ou null se não existir
 */
export async function alterarPorId(id, dados) {
  // Sem as duas opções, o findByIdAndUpdate devolvia o artigo como estava
  // antes da alteração, e não verificava as regras do schema, que por omissão
  // só correm quando um documento é criado.
  const artigo = await Artigo.findByIdAndUpdate(id, dados, {
    returnDocument: "after",
    runValidators: true,
  });
  return artigo;
}

/**
 * Apaga um artigo.
 * @param {string} id um identificador com a forma de um ObjectId, já verificado
 * @returns {Promise<void>} cumprida quando o artigo foi apagado
 */
export async function apagarPorId(id) {
  await Artigo.findByIdAndDelete(id);
}
```

O `src/services/artigos.service.js`:

```js
// src/services/artigos.service.js: as regras da papelaria sobre os artigos.
// Recebe valores simples e devolve valores simples. Não sabe nada de HTTP,
// nem de MongoDB: pede os artigos ao repository.
import {
  procurarArtigos,
  procurarPorId,
  inserirArtigo,
  alterarPorId,
  apagarPorId,
} from "../repositories/artigos.repository.js";

/**
 * Devolve os artigos que cumprem os filtros recebidos.
 * Os filtros já chegam verificados pelo controller; os que faltam não se aplicam.
 * @param {object} filtros com categoria (texto) e stockMaximo (número), os dois opcionais
 * @returns {Promise<object[]>} os artigos, possivelmente nenhum
 */
export async function listarArtigos(filtros) {
  const condicoes = {};
  if (filtros.categoria !== undefined) {
    condicoes.categoria = filtros.categoria;
  }
  if (filtros.stockMaximo !== undefined) {
    // O stock máximo inclui o valor: com 4, entram os artigos com stock 4.
    condicoes.stockAte = filtros.stockMaximo;
  }
  const artigos = await procurarArtigos(condicoes);
  return artigos;
}

/**
 * Procura um artigo pelo _id.
 * @param {string} id um identificador já verificado pelo controller
 * @returns {Promise<object | null>} o artigo, ou null se não existir
 */
export async function obterArtigo(id) {
  const artigo = await procurarPorId(id);
  return artigo;
}

/**
 * Regra da papelaria: um artigo está abaixo do mínimo quando o stock é
 * menor do que o stock mínimo definido para ele, e é preciso encomendá-lo.
 * @returns {Promise<object[]>} os artigos a encomendar, possivelmente nenhum
 */
export async function artigosAbaixoDoMinimo() {
  const artigos = await procurarArtigos({});
  return artigos.filter((artigo) => artigo.stock < artigo.stockMinimo);
}

/**
 * Cria um artigo novo. As regras de cada campo estão no schema do modelo.
 * @param {object} dados os campos do artigo, já com o tipo verificado pelo controller
 * @returns {Promise<object>} o artigo criado
 */
export async function criarArtigo(dados) {
  const artigo = await inserirArtigo(dados);
  return artigo;
}

/**
 * Altera os campos recebidos de um artigo.
 * @param {string} id um identificador já verificado pelo controller
 * @param {object} dados os campos a alterar, já com o tipo verificado
 * @returns {Promise<object | null>} o artigo alterado, ou null se não existir
 */
export async function alterarArtigo(id, dados) {
  const artigo = await alterarPorId(id, dados);
  return artigo;
}

/**
 * Apaga um artigo, se a regra da papelaria o deixar.
 * @param {string} id um identificador já verificado pelo controller
 * @returns {Promise<string>} o que aconteceu: "apagado", "nao-existe" ou "tem-stock"
 */
export async function apagarArtigo(id) {
  const artigo = await procurarPorId(id);
  if (artigo === null) {
    return "nao-existe";
  }
  // Regra da papelaria: um artigo só sai do catálogo quando já não há
  // unidades na loja. Enquanto houver stock, ainda há o que vender.
  if (artigo.stock > 0) {
    return "tem-stock";
  }
  await apagarPorId(id);
  return "apagado";
}
```

O `src/controllers/artigos.controller.js`:

```js
// src/controllers/artigos.controller.js: a ponte entre o HTTP e o service.
// Lê e verifica o que vem no pedido, chama o service e escolhe o código
// e o corpo da resposta, sempre em JSON, como diz o contrato da API.
import {
  listarArtigos,
  obterArtigo,
  artigosAbaixoDoMinimo,
  criarArtigo,
  alterarArtigo,
  apagarArtigo,
} from "../services/artigos.service.js";

// Os campos que o corpo de um pedido pode trazer, para criar ou alterar um
// artigo. É uma lista fechada: um campo que não esteja aqui é recusado.
const CAMPOS_DE_TEXTO = ["nome", "categoria"];
const CAMPOS_INTEIROS = ["stock", "stockMinimo", "precoCentimos"];

/**
 * Converte um texto num inteiro, ou devolve null se o texto não for um inteiro.
 * @param {string} texto o valor tal como chegou no pedido
 * @returns {number | null}
 */
function paraInteiro(texto) {
  // Number("") e Number("  ") dão 0, e não NaN. Sem esta verificação,
  // ?stockMaximo= (o parâmetro sem valor) seria tratado como ?stockMaximo=0.
  // Um parâmetro repetido, como ?stockMaximo=1&stockMaximo=2, chega como
  // um array, que não é texto: também não é um inteiro.
  if (typeof texto !== "string" || texto.trim() === "") {
    return null;
  }
  const numero = Number(texto);
  return Number.isInteger(numero) ? numero : null;
}

/**
 * Diz se um texto tem a forma de um identificador do MongoDB, um ObjectId
 * escrito em texto: 24 carateres, cada um de 0 a 9 ou de a a f.
 * Não diz se o artigo existe; isso só a base de dados sabe.
 * @param {string} texto o valor tal como chegou no caminho do pedido
 * @returns {boolean}
 */
function eIdentificador(texto) {
  if (typeof texto !== "string" || texto.length !== 24) {
    return false;
  }
  for (const carater of texto.toLowerCase()) {
    if (!"0123456789abcdef".includes(carater)) {
      return false;
    }
  }
  return true;
}

/**
 * Lê do corpo do pedido os campos de um artigo: só os da lista, cada um com o tipo certo.
 * Não verifica os valores, como o mínimo ou as categorias: essas são regras da
 * papelaria, e quem as verifica é o schema do modelo.
 * @param {unknown} corpo o req.body, tal como o express.json() o deixou
 * @returns {object} { erro } com a mensagem do primeiro problema, ou { dados } com os campos lidos
 */
function lerCamposDoArtigo(corpo) {
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
      // Se chegasse a um filtro, seria lido como um operador do MongoDB.
      if (typeof valor !== "string") {
        return { erro: `O campo ${campo} tem de ser um texto` };
      }
    } else if (CAMPOS_INTEIROS.includes(campo)) {
      if (!Number.isInteger(valor)) {
        return { erro: `O campo ${campo} tem de ser um número inteiro` };
      }
    } else {
      return { erro: `O campo ${campo} não é aceite` };
    }
    dados[campo] = valor;
  }
  return { dados: dados };
}

/** GET /api/artigos, com os filtros opcionais ?categoria= e ?stockMaximo= */
export async function listar(req, res) {
  const filtros = {};

  if (req.query.categoria !== undefined) {
    // Repetido, como ?categoria=Papel&categoria=Escrita, o parâmetro chega
    // como um array, e não como um texto.
    if (typeof req.query.categoria !== "string") {
      res.status(400).json({ erro: "O parâmetro categoria tem de ser um texto, e só pode vir uma vez" });
      return;
    }
    filtros.categoria = req.query.categoria;
  }

  if (req.query.stockMaximo !== undefined) {
    const stockMaximo = paraInteiro(req.query.stockMaximo);
    if (stockMaximo === null || stockMaximo < 0) {
      res.status(400).json({ erro: "O parâmetro stockMaximo tem de ser um número inteiro, zero ou maior" });
      return;
    }
    filtros.stockMaximo = stockMaximo;
  }

  const artigos = await listarArtigos(filtros);
  res.json(artigos);
}

/** GET /api/artigos/abaixo-do-minimo */
export async function abaixoDoMinimo(req, res) {
  const artigos = await artigosAbaixoDoMinimo();
  res.json(artigos);
}

/** GET /api/artigos/:id */
export async function obter(req, res) {
  const id = req.params.id;
  if (!eIdentificador(id)) {
    res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
    return;
  }
  const artigo = await obterArtigo(id);
  if (artigo === null) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
}

/** POST /api/artigos, com o artigo novo no corpo, em JSON */
export async function criar(req, res) {
  const leitura = lerCamposDoArtigo(req.body);
  if (leitura.erro) {
    res.status(400).json({ erro: leitura.erro });
    return;
  }
  // Se uma regra do schema falhar, o criarArtigo rejeita a promessa, e o
  // Express passa o erro ao middleware de erros, no server.js, que responde 400.
  const artigo = await criarArtigo(leitura.dados);
  res.status(201).json(artigo);
}

/** PATCH /api/artigos/:id, com os campos a alterar no corpo, em JSON */
export async function alterar(req, res) {
  const id = req.params.id;
  if (!eIdentificador(id)) {
    res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
    return;
  }
  const leitura = lerCamposDoArtigo(req.body);
  if (leitura.erro) {
    res.status(400).json({ erro: leitura.erro });
    return;
  }
  if (Object.keys(leitura.dados).length === 0) {
    res.status(400).json({ erro: "O pedido não traz nenhum campo para alterar" });
    return;
  }
  const artigo = await alterarArtigo(id, leitura.dados);
  if (artigo === null) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
}

/** DELETE /api/artigos/:id */
export async function apagar(req, res) {
  const id = req.params.id;
  if (!eIdentificador(id)) {
    res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
    return;
  }
  const resultado = await apagarArtigo(id);
  if (resultado === "nao-existe") {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  if (resultado === "tem-stock") {
    res.status(409).json({ erro: "Não se pode apagar um artigo que ainda tem stock" });
    return;
  }
  // 204: apagado, e a resposta não tem corpo.
  res.status(204).end();
}
```

Pensa antes de continuares: entre o `procurarPorId` e o `apagarPorId` do service passa um instante. O que podia correr mal, numa papelaria com muitas pessoas a usar a aplicação ao mesmo tempo? A resposta: noutro pedido, alguém podia registar uma entrega de stock nesse instante. O service já tinha visto o stock a 0, e apagava um artigo que, entretanto, voltou a ter unidades. Com uma pessoa ao balcão, não acontece. Para muitas, faz-se a verificação e o apagar numa só operação da base de dados.

## Fase 9: ver o que vai mudar antes de apagar muitos

O `findByIdAndDelete` apaga um artigo, escolhido pelo `_id`. O `deleteMany` apaga todos os que cumprirem um filtro, e um filtro errado apaga o que não devia. Com o filtro vazio, `{}`, apaga a coleção inteira. Por isso, antes de um `deleteMany` ou de um `updateMany`, corre-se o mesmo filtro num `find`, ou num `countDocuments`, que só conta, e vê-se o que ele escolhe. E faz-se a experiência na base de teste, que o seed reconstrói. Para saber mais, lê a secção "Ver o que vai mudar antes de mudar muitos" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

A papelaria vai deixar de vender artigos de desenho. Apagar uma categoria inteira faz-se uma vez, à parte, como o seed, e não é um pedido da API.

1. Em `src`, cria o ficheiro `apagar-categoria.js`, com este conteúdo:

   ```js
   // src/apagar-categoria.js: apaga da base de teste os artigos de uma categoria.
   // Corre-se à parte, como o seed, com a categoria no fim do comando:
   //   node --env-file=.env src/apagar-categoria.js Desenho
   // Mostra primeiro o que o filtro escolhe, e só apaga quando lhe juntas --apagar.
   import mongoose from "mongoose";
   import { ligarBaseDeDados } from "./db/mongoose.js";
   import { Artigo } from "./models/artigo.model.js";

   // O process.argv é a lista das palavras do comando: o node, o caminho do
   // script e, a partir da terceira posição, o que escreveste a seguir.
   const categoria = process.argv[2];
   const confirmado = process.argv.includes("--apagar");

   try {
     await ligarBaseDeDados();
     const nomeDaBase = mongoose.connection.name;
     if (!nomeDaBase.endsWith("-teste")) {
       console.error(`Este script só corre numa base de teste, e esta é a ${nomeDaBase}.`);
     } else if (categoria === undefined || categoria === "--apagar") {
       console.error("Falta a categoria: node --env-file=.env src/apagar-categoria.js Desenho");
     } else {
       // Primeiro, ver o que vai mudar: o mesmo filtro, num find.
       const filtro = { categoria: categoria };
       const escolhidos = await Artigo.find(filtro);
       console.log(`O filtro escolhe ${escolhidos.length} artigos.`);
       for (const artigo of escolhidos) {
         console.log(`  ${artigo.nome}`);
       }
       if (!confirmado) {
         console.log("Nada foi apagado. Para apagar, corre o mesmo comando com --apagar no fim.");
       } else {
         // Depois, apagar com o mesmo filtro, e confirmar quantos saíram.
         const resultado = await Artigo.deleteMany(filtro);
         console.log(`Apagados ${resultado.deletedCount} artigos`);
       }
     }
   } catch (erro) {
     console.error(`O script falhou: ${erro.message}`);
   }

   await mongoose.disconnect();
   ```

   Leitura guiada: o `process.argv` é a lista das palavras do comando. As duas primeiras são o caminho do `node` e o do script, e a categoria é a terceira, `process.argv[2]`. O `includes("--apagar")` procura essa palavra em qualquer posição. O script confirma que está numa base de teste, como o seed. Depois corre o filtro num `find` e escreve os nomes. Só com o `--apagar` corre o `deleteMany`, com o mesmo objeto `filtro`, escrito uma só vez.

2. Corre `npm run seed`. Antes de correres o script, prevê quantos artigos o filtro escolhe, e quais. Depois:

   ```bash
   node --env-file=.env src/apagar-categoria.js Desenho
   ```

   O que deves ver:

   ```text
   Ligada à base de dados papelaria-teste
   O filtro escolhe 2 artigos.
     Régua de 30 cm
     Compasso escolar
   Nada foi apagado. Para apagar, corre o mesmo comando com --apagar no fim.
   ```

   Corre o mesmo comando com `desenho`, em minúsculas. O que deves ver: `O filtro escolhe 0 artigos.` A base distingue maiúsculas de minúsculas. É por isto que se olha antes: um filtro com uma letra trocada não escolhe nada, e um `deleteMany` com ele também não apagava nada, sem dar erro.

3. Confirma no Atlas que os oito artigos continuam lá. Depois, apaga:

   ```bash
   node --env-file=.env src/apagar-categoria.js Desenho --apagar
   ```

   O que deves ver: as mesmas linhas até aos dois nomes, e no fim `Apagados 2 artigos`. O número do `find` e o do `deleteMany` são iguais, e é isso que confirma que o filtro apagou o que mostrou.

   Repara que a régua e o compasso tinham stock, e o script apagou-os. A regra do stock está no service, e o script não passa pelo service: fala com o modelo diretamente. As regras do service só protegem os pedidos da API; as do schema protegem tudo o que cria artigos. Numa papelaria a sério, primeiro vendia-se o que restava.

4. Corre o primeiro comando outra vez, sem o `--apagar`. O que deves ver: `O filtro escolhe 0 artigos.`

5. Corre `npm run seed`, para a base voltar aos oito artigos.

### Paragem 9

Sabes apagar vários documentos de uma vez sem surpresas: vês primeiro o que o filtro escolhe, e só depois apagas, na base de teste.

Pensa antes de continuares: o script corre o `find` e o `deleteMany` com a mesma variável `filtro`. Porque não escrever `{ categoria: categoria }` duas vezes? A resposta: escrito duas vezes, o filtro podia sair diferente da segunda, com uma letra trocada ou uma condição a mais. O que se apagava já não era o que se viu. Com uma só variável, o que se mostra e o que se apaga vêm do mesmo filtro.

## Fase 10: verificar o contrato

A verificação faz-se como no tema anterior, com previsões e resultados, e com duas coisas novas. Os pedidos que escrevem confirmam-se também na base, e não só na resposta. E confirma-se que a cadeia de ligação não escapou.

1. Corre `npm run seed`. Na consola, se recarregaste a página, cola outra vez o bloco das ferramentas. Depois, como o seed deu `_id` novos, guarda os de que vais precisar:

   ```js
   ids.caderno = await idDe("Caderno A4 quadriculado");
   ids.bloco = await idDe("Bloco de notas A5");
   ids.compasso = await idDe("Compasso escolar");
   ```

2. Copia para o caderno a coluna dos pedidos abaixo e acrescenta-lhe três colunas: "código previsto", "código obtido" e "corpo confere com o contrato". Preenche a coluna da previsão, só a olhar para o teu `contrato-da-api.md`.

   ```js
   await pedir("GET", "/api/artigos");
   await pedir("GET", "/api/artigos?categoria=Escrita&stockMaximo=8");
   await pedir("GET", "/api/artigos?stockMaximo=-1");
   await pedir("GET", `/api/artigos/${ids.compasso}`);
   await pedir("GET", "/api/artigos/12345");
   await pedir("POST", "/api/artigos", { nome: "Afia-lápis duplo", categoria: "Escrita", stock: 15, stockMinimo: 5, precoCentimos: 85 });
   await pedir("POST", "/api/artigos", { nome: "Afia-lápis", categoria: "Escrita", stock: 15, stockMinimo: 5 });
   await pedir("POST", "/api/artigos", { nome: "Afia-lápis", categoria: "Escrita", stock: 15, stockMinimo: 5, precoCentimos: 85, cor: "azul" });
   await pedir("PATCH", `/api/artigos/${ids.compasso}`, { stock: 0 });
   await pedir("PATCH", `/api/artigos/${ids.compasso}`, { precoCentimos: 0 });
   await pedir("DELETE", `/api/artigos/${ids.caderno}`);
   await pedir("DELETE", `/api/artigos/${ids.compasso}`);
   await pedir("DELETE", `/api/artigos/${ids.compasso}`);
   await pedir("PUT", `/api/artigos/${ids.bloco}`, { stock: 3 });
   ```

3. Faz cada pedido, pela ordem da lista, e preenche as outras duas colunas. A seguir ao pedido 9, antes do 10, abre o compasso no Atlas e confirma que tem o stock a 0: o pedido 12 vai apagá-lo.

   O que deves ver:

   | Pedido | Código | Resposta |
   | ---: | --- | --- |
   | 1 | 200 | os oito artigos |
   | 2 | 200 | a esferográfica azul e o marcador fluorescente |
   | 3 | 400 | `{"erro":"O parâmetro stockMaximo tem de ser um número inteiro, zero ou maior"}` |
   | 4 | 200 | o compasso escolar, com 1 unidade |
   | 5 | 400 | `{"erro":"O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f"}` |
   | 6 | 201 | o afia-lápis duplo, com o `_id` novo |
   | 7 | 400 | `{"erro":"O preço é obrigatório"}` |
   | 8 | 400 | `{"erro":"O campo cor não é aceite"}` |
   | 9 | 200 | o compasso, com `"stock":0` |
   | 10 | 400 | `{"erro":"O preço tem de ser de pelo menos 1 cêntimo"}` |
   | 11 | 409 | `{"erro":"Não se pode apagar um artigo que ainda tem stock"}` |
   | 12 | 204 | sem corpo |
   | 13 | 404 | `Não existe o artigo` e o `_id` do compasso |
   | 14 | 404 | `{"erro":"Rota não encontrada"}`, porque o contrato não tem `PUT` |

4. Confirma no Atlas, na coleção `artigos` da base `papelaria-teste`, o que os pedidos que escrevem disseram. O afia-lápis duplo está lá. O compasso não, porque foi apagado. O caderno A4 continua, com 12 unidades. Nenhum artigo tem o preço a 0 nem a cor azul. Escreve, ao lado das linhas 6, 8, 9, 10, 11 e 12 da tabela, o que viste na base, contando com o que viste do compasso depois do pedido 9.

5. Confirma que a cadeia de ligação não escapou. No terminal dos comandos, procura o endereço do cluster, que acaba em `mongodb.net`, em todos os ficheiros que o Git guarda:

   ```bash
   git grep -n "mongodb.net"
   ```

   O que deves ver: nada, e o terminal pronto para outro comando. O `git grep` procura nos ficheiros que o Git guarda, e o `.env` não é um deles. Se aparecer um ficheiro, a cadeia está nele: tira-a de lá, põe-na só no `.env`, e diz ao professor, porque a palavra-passe pode ter de ser mudada no Atlas. No browser, no separador "Rede", abre algumas das respostas da tabela: nenhuma tem a cadeia nem a palavra-passe.

6. Se alguma linha não conferir, há um erro no código ou no contrato. Descobre qual, corrige e volta a verificar a linha, depois de correres o seed.

No fim, a tabela tem de ter pelo menos um 200, um 201, um 204, um 400, um 404 e um 409 verificados.

## Fase 11: guardar no Git

1. Corre `git status`. O que deves ver: as alterações ao `contrato-da-api.md`, ao `package.json`, ao `package-lock.json`, ao `.env.example`, ao `server.js` e às camadas. Aparece também o ficheiro `src/dados/artigos.dados.js`, marcado como apagado (`deleted`), e os ficheiros novos: a ligação, o modelo, o repository, o seed e o script de apagar. Não deve aparecer o `.env`.

2. Faz o commit:

   ```bash
   git add .
   git commit -m "API dos artigos ligada ao Atlas: CRUD, lista fechada e regras da papelaria"
   git log --oneline
   ```

   O que deves ver: o `git log` mostra o commit novo no topo, por cima dos do tema anterior.

## Problemas frequentes

### Não foi possível ligar à base de dados: falta a MONGODB_URI no ficheiro .env

A linha `MONGODB_URI=` do `.env` está vazia, ou não existe. Volta ao passo 3 de "Preparar o projeto". Se o terminal disser `node: .env: not found`, é o próprio ficheiro `.env` que falta.

### A API fica parada uns 30 segundos e termina com um erro de ligação

O Mongoose tenta ligar-se durante 30 segundos e depois desiste. Com o Atlas, as causas mais comuns são duas. Uma é o endereço IP do computador onde estás não estar autorizado no Atlas, o que acontece quando mudas de computador ou de rede. A outra é não haver internet.

### bad auth : authentication failed

O Atlas recusou o utilizador ou a palavra-passe da cadeia de ligação. Confirma que trocaste o marcador da palavra-passe, com os `<` e `>` incluídos, e que usaste o utilizador da base de dados, e não o da tua conta no Atlas.

### A lista vem {} e não aparece nenhum erro

Falta o `await` antes da chamada ao service, no controller. Sem ele, a variável guarda a promessa, e o `res.json` de uma promessa é `{}`.

### Os artigos a encomendar dão 500, com "artigos.filter is not a function"

Falta o `await` na `artigosAbaixoDoMinimo` do service, antes da `procurarArtigos`. Sem ele, a variável `artigos` é a promessa, e uma promessa não tem `filter`.

### O POST responde que o corpo tem de ser um objeto JSON, e o corpo está certo

O `req.body` ficou `undefined`. Ou falta o `app.use(express.json())`, ou está depois do `app.use` das rotas. Se fizeste o pedido sem a `pedir`, confirma também o cabeçalho `Content-Type: application/json`: sem ele, o `express.json()` não lê o corpo.

### Um erro dá uma página em HTML, com o código 500 e os caminhos dos ficheiros

O middleware de erros não existe, ou não tem os quatro parâmetros. Com três, o Express trata-o como um middleware normal, e o erro vai para o tratamento do próprio Express. Volta ao passo 4 da fase 6.

### O PATCH responde com os valores antigos, ou aceita um stock negativo

Faltam as opções do `findByIdAndUpdate`: o `returnDocument: "after"` e o `runValidators: true`. Volta ao passo 8 da fase 7.

### Aparece no terminal um aviso sobre a opção new

O repository usa o `new: true`, que o Mongoose 9 marca como obsoleto. Troca-o por `returnDocument: "after"`, que faz o mesmo.

### Um pedido com um _id que existia dá 404

Correste o seed depois de guardares o `_id`, e o seed deu `_id` novos a todos os artigos. Volta a guardar os `_id` com a `idDe`.

### A consola mostra linhas a vermelho com "Failed to load resource"

O pedido teve uma resposta de erro, como um 400, um 404 ou um 409, e o browser avisa-o a vermelho. Não é um erro do teu código. Compara o código e a mensagem que a `pedir` escreveu, na linha a seguir, com o que o contrato diz.

### A consola diz que pedir is not defined

Recarregaste a página, ou abriste outra, e as ferramentas da consola perderam-se. Cola outra vez o bloco do passo 6 da fase 5.

### A consola diz que ids já foi declarado

Colaste o bloco das ferramentas duas vezes na mesma página. Não faz mal: as ferramentas já lá estavam, e continuam a funcionar.

### O seed diz que só corre numa base de teste

O `DB_NAME` do `.env` não acaba em `-teste`. Muda a linha para `DB_NAME=papelaria-teste`.

## Desafios

1. O nome de um artigo não se repete. Acrescenta ao contrato e à API a regra de que não pode haver dois artigos com o mesmo nome, ao criar e ao alterar, com o código que achares certo. Decide primeiro a camada da regra, e escreve no caderno porquê. Pista: o schema verifica um artigo de cada vez, e esta regra compara artigos entre si.
2. Repor o stock de uma categoria. Escreve um script, como o da fase 9, que põe o stock de todos os artigos de uma categoria igual ao stock mínimo, com o `updateMany`. Antes de alterar, mostra o que vai mudar. Pista: o `updateMany` recebe o filtro e o que muda, como o `findByIdAndUpdate`, e devolve um objeto com o número de documentos alterados, que a documentação diz como se chama.

## Antes de terminares

- [ ] O `contrato-da-api.md` tem o artigo com o `_id` e as regras de cada campo, e os sete pedidos.
- [ ] O `npm run seed` reconstrói a base `papelaria-teste`, e a base `papelaria` continua como estava.
- [ ] As respostas das paragens estão no caderno, e as duas opções do `findByIdAndUpdate`, com o nome e o valor, também.
- [ ] A tabela da fase 10 está verificada, e as linhas dos pedidos que escrevem, e dos que foram recusados, estão confirmadas na base.
- [ ] O `git grep -n "mongodb.net"` não encontra nada, e o `git log --oneline` mostra o commit deste laboratório.
- [ ] Consegues explicar, por palavras tuas, em que camada fica cada regra da papelaria, e porquê. São três: a forma do pedido, os valores de cada campo e a regra do stock ao apagar.

O professor vai pedir-te que escolhas um pedido da tabela da fase 10 e expliques o caminho dele pelas camadas, até à base, e o que confirmaste no Atlas.

![Rodapé](../imagens/rodape.png)
