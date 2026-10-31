![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: Ligação segura, CRUD e regras de domínio, no cinema da escola

Laboratório do tema Ligação segura, CRUD e regras de domínio, do módulo M14, Acesso a Bases de Dados, para quem fez o tema anterior no projeto do cinema da escola. Vais pôr a aplicação do cinema a trabalhar numa base de teste e a escrever nela: criar, alterar e apagar filmes, recusando o que não cumpre as regras do clube. Cada passo diz o que fazer, porquê e o que deves ver. Avanças ao teu ritmo: o que não acabares na aula, acabas em casa ou na aula seguinte. Tudo o que precisas está aqui; o [guia do tema](05-ligacao-segura-crud-e-regras-de-dominio.md) tem a teoria completa, com os exemplos na papelaria, para quem quiser saber mais.

## O que vais construir

No fim, a API do cinema cumpre um contrato com mais três pedidos, que criam, alteram e apagam filmes. Os filmes vêm da base `cinema-teste`, que o seed reconstrói, e a base `cinema`, a da ficha, fica como a entregaste. O cartaz continua a funcionar como antes. O projeto fica assim:

```text
cinema-da-escola/
├── contrato-da-api.md                 o contrato, agora com o CRUD
├── src/
│   ├── server.js                      o arranque, com o corpo em JSON e o middleware de erros
│   ├── seed.js                        reconstrói a base de teste, e só essa
│   ├── apagar-genero.js               apaga um género, mostrando antes o que vai apagar
│   ├── db/
│   │   └── mongoose.js                a base por omissão passa a ser a de teste
│   ├── models/
│   │   └── filme.model.js             a forma dos filmes e as regras de cada campo
│   ├── repositories/
│   │   └── filmes.repository.js       o acesso aos filmes na base de dados
│   ├── services/
│   │   └── filmes.service.js          as regras do clube
│   ├── controllers/
│   │   └── filmes.controller.js       o HTTP da API e do cartaz
│   └── rotas/
│       └── filmes.rotas.js            que pedido da API vai para que função
└── views/
    └── cartaz.ejs                     não muda
```

No caderno, fica a tabela de verificação, com o que previste e o que obtiveste em cada pedido. Ficas a saber pôr uma API a escrever numa base de dados sem deixar entrar o que não deve, e a dizer em que camada fica cada regra.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | O `contrato-da-api.md` | O contrato do CRUD, antes do código |
| 2 | O `.env` e o seed | A aplicação trabalha na base de teste, que o seed reconstrói, e só essa |
| 3 | O `express.json()`, a lista fechada, o `POST` e o género repetido na lista | A API cria filmes, só com os campos da lista |
| 4 | As regras no schema e o middleware de erros | Um filme que não cumpre as regras é recusado com 400, em JSON |
| 5 | A regra do número repetido, no service | Um número que já existe é recusado com 409 |
| 6 | O `PATCH`, com as opções da documentação | A API altera filmes, com as regras a correr |
| 7 | O `DELETE` | A API apaga filmes |
| 8 | O script que mostra antes de apagar | Apagas um género inteiro na base de teste, vendo antes o que sai |
| 9 | A tabela de verificação | A API cumpre o contrato, confirmado na base e sem o segredo à vista |
| 10 | O commit | O commit do CRUD no histórico |

## Palavras que vais usar

- CRUD: as quatro operações de quem guarda dados: criar, ler, alterar e apagar. Para saber mais, vê a secção "O contrato cresce: criar, alterar e apagar" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).
- Base de teste: uma base de dados com dados conhecidos, só para experiências, que um script reconstrói. Aqui é a `cinema-teste`.
- Seed: o programa que põe na base os dados com que a aplicação começa. O do cinema apaga os filmes e insere os oito do clube.
- Mongoose: o pacote do Node que liga a aplicação ao MongoDB e faz as consultas, com funções como o `find`.
- Modelo: o objeto do Mongoose que representa uma coleção, como o `Filme`. Diz a forma dos documentos e é por ele que se lê e escreve na coleção.
- Repository: a camada que fala com a base de dados, e a única da aplicação que usa o modelo `Filme`.
- Promessa: o que uma função `async` devolve logo, e que representa uma resposta que ainda não chegou. O `await` espera por ela.
- Regra de domínio: uma regra do assunto da aplicação, o clube de cinema, como "a idade mínima é 6, 12, 14, 16 ou 18". Diz o que faz sentido, e não como se escreve um pedido.
- Corpo do pedido: a parte de um pedido que leva dados, como os campos de um filme novo. Lê-se em `req.body`.
- `express.json()`: o middleware que lê o corpo em JSON e o guarda, já como objeto, em `req.body`.
- Lista fechada: a lista dos campos que um pedido pode trazer; tudo o resto é recusado.
- Schema: a descrição da forma dos documentos de uma coleção, no Mongoose, com o tipo e as regras de cada campo.
- `ValidationError`: o erro que o Mongoose lança quando uma regra do schema falha.
- Middleware de erros: um middleware com quatro parâmetros, que o Express só chama quando um pedido acabou num erro.
- 201, 204, 409 e 500: criado; correu bem, sem corpo; conflito com o estado dos dados; erro interno do servidor.

## O que precisas

- O projeto `cinema-da-escola` no fim do laboratório do tema anterior, com o contrato, as camadas e o commit "Cinema: contrato e camadas, com o repository a falar com o Atlas". O `npm run dev` tem de escrever `Ligada à base de dados cinema` e `Cinema da escola em http://localhost:3000`. Se ainda não tens as camadas, faz primeiro a secção do cinema do [laboratório do tema anterior](04-api-express-e-contratos-laboratorio.md), ou faz este tema no [laboratório da papelaria](05-ligacao-segura-crud-e-regras-de-dominio-laboratorio.md).
- A tua conta no MongoDB Atlas, com o cluster e o endereço IP do computador onde estás autorizado, como na ficha do cinema.
- Internet, em todas as fases: a aplicação só arranca depois de se ligar ao Atlas. Se a rede falhar, chama o professor.
- Um editor de código e dois terminais: um para a aplicação, outro para os comandos.
- O browser, com as ferramentas de programador (F12, ou Cmd+Option+I no Mac). Vais usar o separador "Rede" (ou "Network"), para veres o código de cada resposta. E vais usar o separador "Consola" (ou "Console"), para fazeres os pedidos que a barra de endereço não faz.
- O caderno, para as previsões e a tabela de verificação.

Se fizeste os exercícios 6 e 7 da ficha do cinema, com a duração máxima e o cartaz para uma idade, o teu código tem essas duas peças. Este laboratório não lhes toca: ficam onde as puseste no tema anterior. Quando um passo mandar substituir um ficheiro inteiro, é sempre um ficheiro onde elas não estão.

## Se alguma coisa falhar

1. Estás na pasta certa? Os comandos correm-se na pasta `cinema-da-escola`, onde está o `package.json`. `pwd` mostra a pasta atual (no Windows, na linha de comandos clássica, `cd`, sem mais nada).
2. Guardaste o ficheiro? O `--watch` só reinicia a aplicação depois de guardares.
3. A aplicação arrancou? Depois de guardares um ficheiro que ela já usa, o terminal tem de voltar a mostrar `Ligada à base de dados cinema-teste` e `Cinema da escola em http://localhost:3000`. Se mostrar um erro, a mensagem diz o ficheiro e, quase sempre, a linha.
4. A base é a certa? A primeira linha que a aplicação escreve diz a que base se ligou. A partir da fase 2, tem de ser `cinema-teste`.
5. A resposta não é a que esperavas? Compara com o contrato, linha a linha. Um código errado procura-se no controller. Uma lista errada procura-se no service e, depois, no repository.

## Fase 1: o contrato cresce

O contrato vem antes do código: é ele que diz o que a API tem de fazer, e é contra ele que se verifica no fim. Ganha três pedidos novos, com os métodos `POST`, para criar, `PATCH`, para alterar alguns campos, e `DELETE`, para apagar. E ganha quatro códigos novos. O 201 quer dizer criado, e o 204, correu bem e não há nada a devolver. O 409 quer dizer conflito: o pedido está bem escrito, mas os dados, como estão agora, não o deixam fazer. O 500 é um erro interno do servidor. Os filmes continuam a ser pedidos pelo `numero`, como no tema anterior. Para saber mais, lê a secção "O contrato cresce: criar, alterar e apagar" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. Abre o `contrato-da-api.md`. Acrescenta à secção dos erros esta frase:

   Qualquer pedido pode responder 500, com `{ "erro": "Erro interno do servidor" }`, quando a falha é do servidor, e não de quem pediu.

2. A seguir ao exemplo do filme, acrescenta esta tabela, com o tipo e as regras de cada campo. Escreve-a tu, linha a linha, e pergunta-te, em cada linha, o que ela obriga a API a fazer.

   | Campo | Tipo | Regras |
   | --- | --- | --- |
   | `numero` | inteiro | obrigatório; 1 ou mais; não há dois filmes com o mesmo número, e não se altera |
   | `titulo` | texto | obrigatório; até 80 carateres, sem os espaços do início e do fim |
   | `genero` | texto | obrigatório |
   | `duracaoMinutos` | inteiro | obrigatório; de 1 a 300 |
   | `idadeMinima` | inteiro | obrigatório; 6, 12, 14, 16 ou 18, as idades da classificação dos filmes |
   | `sessao` | objeto | obrigatório; com o `dia` e a `hora`, os dois em texto, e mais nada |

3. Em `GET /api/filmes`, o género passa a poder vir "uma só vez", e o 400 ganha esse caso: "`genero` vem repetido". A fase 3 explica porquê.

4. Antes da secção "Qualquer outro pedido", acrescenta as três secções novas:

   **POST /api/filmes.** Cria um filme. O corpo, em JSON, traz os seis campos do filme, e só esses, com os tipos e as regras da tabela.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 201 | o filme foi criado | o filme criado, com o `_id` |
   | 400 | o corpo não é JSON, traz um campo que não é aceite ou com o tipo errado, falta um campo ou um valor não cumpre as regras | erro |
   | 409 | já existe um filme com esse `numero` | erro |

   **PATCH /api/filmes/:numero.** Altera os campos que vierem no corpo, e deixa os outros como estão. O corpo, em JSON, traz um ou mais campos do filme, menos o `numero`, com os tipos e as regras da tabela. A sessão, quando vem, traz o dia e a hora.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | o filme foi alterado | o filme depois da alteração |
   | 400 | o `numero` do caminho não é um inteiro positivo, o corpo não traz nenhum campo, traz o `numero`, ou traz um campo que não é aceite, com o tipo errado ou que não cumpre as regras | erro |
   | 404 | não existe nenhum filme com esse `numero` | erro |

   **DELETE /api/filmes/:numero.** Apaga um filme.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 204 | o filme foi apagado | sem corpo |
   | 400 | o `numero` não é um inteiro positivo | erro |
   | 404 | não existe nenhum filme com esse `numero` | erro |

### Paragem 1

O `contrato-da-api.md` tem as regras de cada campo, os pedidos do tema anterior e os três novos. A aplicação ainda não cumpre nada disto, e é de propósito: o resto do laboratório escreve o código que o cumpre.

Pensa antes de continuares: o contrato diz que o `numero` de um filme não se altera. Que problema haveria se um `PATCH` o pudesse mudar? A resposta: o número é o identificador do filme no clube, e é por ele que se pede, se altera e se apaga. Quem tivesse guardado o endereço `/api/filmes/3`, como uma interface ou um cartaz impresso, passava a dar com um filme diferente, ou com nenhum. E dois filmes podiam ficar com o mesmo número.

## Fase 2: a base de teste

Neste laboratório vais criar, alterar e apagar filmes muitas vezes, e algumas experiências vão correr mal de propósito. A base `cinema` é a da ficha, que entregaste, e deve ficar como está. Por isso, a aplicação passa a trabalhar numa base de teste, a `cinema-teste`, no mesmo cluster. O seed reconstrói-a com os oito filmes do clube sempre que precisares. Mas o seed tem um perigo: o `deleteMany({})` apaga todos os filmes da base onde está ligado. Por isso, ganha uma verificação, e só apaga se o nome da base acabar em `-teste`. Para saber mais, lê a secção "A base de teste" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. Substitui o conteúdo de `src/seed.js` por este:

   ```js
   // src/seed.js: reconstrói a base de teste do cinema com os oito filmes do clube.
   // Corre-se à parte, com npm run seed. Apaga primeiro os filmes que lá estiverem,
   // por isso pode correr-se as vezes que for preciso: depois de cada experiência,
   // a base volta a ficar como estava no início. Só corre numa base de teste.
   import mongoose from "mongoose";
   import { ligarBaseDeDados } from "./db/mongoose.js";
   import { Filme } from "./models/filme.model.js";

   // Os filmes do clube. Cada um é um objeto com os campos do schema,
   // e a sessão é um objeto dentro do filme, com o dia e a hora.
   const filmes = [
     { numero: 1, titulo: "Shrek", genero: "Animação", duracaoMinutos: 90, idadeMinima: 6, sessao: { dia: "4 de novembro", hora: "15:30" } },
     { numero: 2, titulo: "Regresso ao Futuro", genero: "Ficção científica", duracaoMinutos: 116, idadeMinima: 12, sessao: { dia: "11 de novembro", hora: "15:30" } },
     { numero: 3, titulo: "Os Goonies", genero: "Aventura", duracaoMinutos: 114, idadeMinima: 12, sessao: { dia: "18 de novembro", hora: "15:30" } },
     { numero: 4, titulo: "Toy Story", genero: "Animação", duracaoMinutos: 81, idadeMinima: 6, sessao: { dia: "25 de novembro", hora: "15:30" } },
     { numero: 5, titulo: "Matrix", genero: "Ficção científica", duracaoMinutos: 136, idadeMinima: 14, sessao: { dia: "2 de dezembro", hora: "15:00" } },
     { numero: 6, titulo: "Jumanji", genero: "Aventura", duracaoMinutos: 104, idadeMinima: 12, sessao: { dia: "9 de dezembro", hora: "15:30" } },
     { numero: 7, titulo: "O Rei Leão", genero: "Animação", duracaoMinutos: 88, idadeMinima: 6, sessao: { dia: "16 de dezembro", hora: "15:30" } },
     { numero: 8, titulo: "Interstellar", genero: "Ficção científica", duracaoMinutos: 169, idadeMinima: 12, sessao: { dia: "6 de janeiro", hora: "14:30" } },
   ];

   try {
     await ligarBaseDeDados();
     // O seed apaga todos os filmes da base onde está ligado. Por isso, só
     // continua se o nome da base acabar em -teste: a base cinema, a da ficha,
     // fica como a entregaste.
     const nomeDaBase = mongoose.connection.name;
     if (!nomeDaBase.endsWith("-teste")) {
       console.error(`O seed só corre numa base de teste, e esta é a ${nomeDaBase}. Muda o DB_NAME no .env.`);
     } else {
       // O filtro vazio, {}, escolhe todos os documentos: apaga todos os filmes.
       const apagados = await Filme.deleteMany({});
       console.log(`Apagados ${apagados.deletedCount} filmes`);
       // Insere os oito de uma só vez. O insertMany verifica cada filme com as
       // regras do schema antes de inserir.
       const inseridos = await Filme.insertMany(filmes);
       console.log(`Inseridos ${inseridos.length} filmes`);
     }
   } catch (erro) {
     console.error(`O seed falhou: ${erro.message}`);
   }

   // A ligação à base fica aberta até alguém a fechar. Sem esta linha,
   // o programa ficava à espera e não voltava ao terminal.
   await mongoose.disconnect();
   ```

   Leitura guiada: os filmes e o resto são os da ficha. O que é novo são as quatro linhas de comentário do topo e o que está dentro do `try`, a seguir à ligação. O `mongoose.connection.name` é o nome da base a que a ligação chegou. O `endsWith("-teste")` diz se esse nome acaba em `-teste`. Só nesse caso o seed apaga e insere.

2. A verificação do seed não protege a aplicação. Se o `DB_NAME` faltar no `.env`, a `ligarBaseDeDados` usa a base `cinema`, a da ficha, e a aplicação passava a escrever lá. Em `src/db/mongoose.js`, substitui as duas linhas de comentário que estão por cima do `mongoose.connect` e a própria linha do `mongoose.connect` por estas:

   ```js
     // A cadeia que o Atlas te dá não diz que base de dados usar. Sem o DB_NAME,
     // a aplicação usa a base de teste, e nunca a cinema da ficha.
     await mongoose.connect(uri, { dbName: process.env.DB_NAME || "cinema-teste" });
   ```

   Leitura guiada: o `||` dá o valor da direita quando o da esquerda não existe. Sem o `DB_NAME` no `.env`, a aplicação vai parar à base onde não há nada a perder.

3. Provoca a recusa do seed, numa base onde não há nada a perder. No `.env`, muda a linha do `DB_NAME` para `DB_NAME=cinema-experiencia`. Antes de correres o seed, prevê o que vai escrever. Depois:

   ```bash
   npm run seed
   ```

   O que deves ver: `Ligada à base de dados cinema-experiencia` e `O seed só corre numa base de teste, e esta é a cinema-experiencia. Muda o DB_NAME no .env.` Com o `DB_NAME=cinema` da ficha, a resposta seria a mesma, com o nome `cinema`: a verificação protege a base que entregaste. Enquanto o `DB_NAME` disser `cinema-experiencia`, a aplicação, que reiniciou com o `.env` novo, mostra a lista e o cartaz vazios. É normal, até ao passo seguinte.

4. No `.env`, muda agora a linha do `DB_NAME` para `DB_NAME=cinema-teste`. No `.env.example`, substitui as duas últimas linhas, o comentário do nome da base e o `DB_NAME=cinema`, por estas três, para quem copiar o projeto saber que base usar:

   ```text
   # Nome da base de dados no Atlas. A cadeia de ligação não o diz.
   # A aplicação e o seed usam a base de teste, que o seed reconstrói sempre que preciso.
   DB_NAME=cinema-teste
   ```

5. Corre o seed outra vez. O que deves ver: `Ligada à base de dados cinema-teste`, `Apagados 0 filmes` e `Inseridos 8 filmes`. No terminal da aplicação, confirma que ela voltou a arrancar, agora com `Ligada à base de dados cinema-teste`. Se não reiniciou sozinha, para-a com Ctrl+C e volta a correr `npm run dev`.

6. No Atlas, abre o "Data Explorer" (explorador de dados), com os nomes do laboratório do Atlas, confirmados a 14 de outubro de 2026. O que deves ver: uma base nova, `cinema-teste`, com a coleção `filmes` e os oito filmes. A base `cinema` continua lá, como a deixaste. Se não vires a base nova, carrega no botão de atualizar do explorador. No browser, `/api/filmes` mostra os oito filmes, e `/cartaz` também, agora lidos da base de teste.

### Paragem 2

A aplicação trabalha na base `cinema-teste`, e o seed reconstrói-a sempre que quiseres, sem tocar na base da ficha.

Pensa antes de continuares: o `_id` de Os Goonies na base `cinema-teste` é igual ao da base `cinema`? E o número? A resposta: o `_id` não, porque o MongoDB dá um novo a cada documento que insere. O número sim, porque é o seed que o escreve, e é sempre 3. É por isso que, no cinema, os filmes se pedem pelo número: não muda quando a base se reconstrói.

## Fase 3: o corpo do pedido e a lista fechada

Para criar um filme, o pedido leva seis campos. Esses dados vão no corpo do pedido, e não no endereço. O corpo é uma parte do pedido que vem depois do endereço e dos cabeçalhos, e um cabeçalho, o `Content-Type`, diz que o corpo vem em JSON. O Express não o lê sozinho. Quem o lê é o middleware `express.json()`, que o converte num objeto e o guarda em `req.body`.

O `req.body` é o que quem pediu quiser que seja. Pode trazer um campo que o clube não previu, um campo com o nome mal escrito, ou um objeto como `{ "$ne": null }` no lugar de um texto. Num filtro do MongoDB, esse objeto seria um operador. Por isso, o controller nunca o passa inteiro. Tem uma lista fechada de campos aceites, e copia só esses, cada um com o tipo certo. Tudo o resto é recusado com 400. No cinema, há um campo diferente dos outros, a sessão, que é um objeto com o dia e a hora, e a lista fechada também lhe confirma os campos. Para saber mais, lê as secções "O corpo do pedido" e "Uma lista fechada de campos" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. No `src/server.js`, logo a seguir à linha do `app.set("view engine", "ejs");`, acrescenta:

   ```js
   // Lê o corpo dos pedidos que chegam em JSON e põe-no em req.body, já como
   // objeto. Sem esta linha, o req.body ficava undefined em todos os pedidos.
   app.use(express.json());
   ```

   O `express.json()` tem de estar antes do `app.use` das rotas. Um middleware só trata os pedidos que passam por ele, e os pedidos chegam às rotas pela ordem do ficheiro.

2. No repository, acrescenta no fim esta função:

   ```js
   /**
    * Insere um filme novo. O schema verifica as regras de cada campo antes de
    * inserir; se alguma falhar, a promessa é rejeitada com um ValidationError.
    * @param {object} dados os campos do filme, só os da lista do controller
    * @returns {Promise<object>} o filme inserido, já com o _id que o MongoDB lhe deu
    */
   export async function inserirFilme(dados) {
     const filme = await Filme.create(dados);
     return filme;
   }
   ```

3. No service, substitui a linha do `import` por esta, que pede também a `inserirFilme`:

   ```js
   import {
     procurarFilmes,
     procurarPorNumero,
     inserirFilme,
   } from "../repositories/filmes.repository.js";
   ```

   E acrescenta no fim esta função:

   ```js
   /**
    * Cria um filme novo. As regras de cada campo estão no schema do modelo.
    * @param {object} dados os campos do filme, já com o tipo verificado pelo controller
    * @returns {Promise<object>} o filme criado
    */
   export async function criarFilme(dados) {
     const filme = await inserirFilme(dados);
     return filme;
   }
   ```

   Leitura guiada: a `criarFilme` só passa os dados ao repository, como a `obterFilme`. A fase 5 vai pôr-lhe dentro uma regra do clube.

4. No controller, substitui a linha do `import` por esta:

   ```js
   import {
     listarFilmes,
     obterFilme,
     criarFilme,
   } from "../services/filmes.service.js";
   ```

   A seguir ao `import`, acrescenta as duas listas e a função que lê o corpo:

   ```js
   // Os campos que o corpo de um pedido pode trazer, para criar ou alterar um
   // filme. É uma lista fechada: um campo que não esteja aqui é recusado.
   // A sessão é um caso à parte, porque é um objeto com o dia e a hora.
   const CAMPOS_DE_TEXTO = ["titulo", "genero"];
   const CAMPOS_INTEIROS = ["numero", "duracaoMinutos", "idadeMinima"];

   /**
    * Lê do corpo do pedido os campos de um filme: só os da lista, cada um com o tipo certo.
    * Não verifica os valores, como as idades possíveis: essas são regras do clube,
    * e quem as verifica é o schema do modelo.
    * @param {unknown} corpo o req.body, tal como o express.json() o deixou
    * @param {boolean} aceitaNumero true ao criar um filme; false ao alterar, porque o número não muda
    * @returns {object} { erro } com a mensagem do primeiro problema, ou { dados } com os campos lidos
    */
   function lerCamposDoFilme(corpo, aceitaNumero) {
     // Sem corpo em JSON, o req.body fica undefined.
     if (typeof corpo !== "object" || corpo === null || Array.isArray(corpo)) {
       return { erro: "O corpo do pedido tem de ser um objeto JSON" };
     }
     // O objeto dados recebe só os campos da lista, copiados um a um.
     // O req.body nunca segue inteiro para o service.
     const dados = {};
     for (const campo of Object.keys(corpo)) {
       const valor = corpo[campo];
       if (campo === "numero" && !aceitaNumero) {
         return { erro: "O número de um filme não se altera" };
       }
       if (CAMPOS_DE_TEXTO.includes(campo)) {
         // Um objeto no lugar de um texto, como { "$ne": null }, é recusado aqui.
         // Se chegasse a um filtro, seria lido como um operador do MongoDB.
         if (typeof valor !== "string") {
           return { erro: `O campo ${campo} tem de ser um texto` };
         }
         dados[campo] = valor;
       } else if (CAMPOS_INTEIROS.includes(campo)) {
         if (!Number.isInteger(valor)) {
           return { erro: `O campo ${campo} tem de ser um número inteiro` };
         }
         dados[campo] = valor;
       } else if (campo === "sessao") {
         // A sessão tem exatamente dois campos, o dia e a hora, e os dois são texto.
         // Com dois campos e os dois certos, não pode haver um terceiro escondido.
         if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
           return { erro: "A sessão tem de ser um objeto, com o dia e a hora" };
         }
         if (Object.keys(valor).length !== 2 || typeof valor.dia !== "string" || typeof valor.hora !== "string") {
           return { erro: "A sessão tem de ter o dia e a hora, os dois em texto, e mais nada" };
         }
         dados.sessao = { dia: valor.dia, hora: valor.hora };
       } else {
         return { erro: `O campo ${campo} não é aceite` };
       }
     }
     return { dados: dados };
   }
   ```

   E, no fim do ficheiro, a função do pedido:

   ```js
   /** POST /api/filmes, com o filme novo no corpo, em JSON */
   export async function criar(req, res) {
     const leitura = lerCamposDoFilme(req.body, true);
     if (leitura.erro) {
       res.status(400).json({ erro: leitura.erro });
       return;
     }
     const filme = await criarFilme(leitura.dados);
     res.status(201).json(filme);
   }
   ```

   Leitura guiada: a `lerCamposDoFilme` confirma primeiro que o corpo é um objeto. O `Object.keys(corpo)` dá a lista dos nomes dos campos que vieram, e o `for...of` percorre-os. O `numero` só é aceite quando o segundo argumento é `true`, que é o caso de criar. Os textos e os inteiros verificam-se pelo tipo. A sessão tem de ser um objeto com exatamente dois campos, o dia e a hora, em texto, e é copiada só com esses dois. Ao primeiro problema, a função devolve `{ erro }`; se não houver nenhum, devolve `{ dados }`, com a cópia. A `criar` responde 400 com o erro, se houver, e senão chama o service e responde 201, com o filme criado.

5. Em `src/rotas/filmes.rotas.js`, substitui a linha do `import` do controller e junta a rota do `POST` a seguir à do filme. O ficheiro fica assim:

   ```js
   // src/rotas/filmes.rotas.js: que pedido da API dos filmes vai para que função do controller.
   // Os caminhos são relativos ao sítio onde este router é montado, em server.js:
   // "/" quer dizer /api/filmes, e "/:numero" quer dizer /api/filmes/:numero.
   import express from "express";
   import { listar, obter, criar } from "../controllers/filmes.controller.js";

   const router = express.Router();

   router.get("/", listar);
   router.get("/:numero", obter);
   router.post("/", criar);

   export default router;
   ```

6. Guarda tudo e confirma que a aplicação reiniciou. Agora vais precisar da consola do browser, porque a barra de endereço só faz pedidos `GET`. Abre `http://localhost:3000/api/estado`, abre as ferramentas de programador e escolhe o separador "Consola". Cola este bloco e carrega em Enter. Se o browser te pedir para escreveres `allow pasting` antes de colar, escreve-o, carrega em Enter e cola outra vez.

   ```js
   // Ferramenta da consola para este laboratório. Cola este bloco uma vez,
   // numa página da tua aplicação. Se recarregares a página, cola-o outra vez.

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

   Leitura guiada: a `pedir` faz o pedido com o `fetch`, que conheces do 11.º ano. O segundo argumento leva o método e, quando há corpo, o cabeçalho e o texto JSON. Escreve o código e o corpo da resposta, lido como texto, porque uma resposta 204 não tem corpo. O caminho começa por `/api`, sem o `http://localhost:3000`, porque o `fetch` usa o endereço da página aberta.

7. Antes de correres, prevê o que escreve a consola. Depois, na consola:

   ```js
   await pedir("GET", "/api/estado");
   ```

   O que deves ver: `200 {"estado":"ok","aplicacao":"Cinema da escola"}`. A consola fala com a tua aplicação.

8. Cria um filme, o nono do clube. Antes de correres, prevê o código e o que vem no corpo da resposta.

   ```js
   await pedir("POST", "/api/filmes", { numero: 9, titulo: "Wall-E", genero: "Animação", duracaoMinutos: 97, idadeMinima: 6, sessao: { dia: "13 de janeiro", hora: "15:30" } });
   ```

   O que deves ver: `201`, e o filme, com os seis campos, o `_id` que o MongoDB lhe deu e o `__v`. Abre `/api/filmes/9` noutro separador: o Wall-E está lá. E no `/cartaz`, também.

9. Experimenta a lista fechada com estes quatro pedidos, um de cada vez, prevendo antes a mensagem de cada um:

   ```js
   await pedir("POST", "/api/filmes", { numero: "10", titulo: "Up" });
   await pedir("POST", "/api/filmes", { titulo: "Up", realizador: "Pete Docter" });
   await pedir("POST", "/api/filmes", { titulo: { $ne: null } });
   await pedir("POST", "/api/filmes", { titulo: "Up", sessao: { dia: "20 de janeiro" } });
   ```

   O que deves ver: quatro respostas 400. As mensagens são `O campo numero tem de ser um número inteiro`, `O campo realizador não é aceite`, `O campo titulo tem de ser um texto` e `A sessão tem de ter o dia e a hora, os dois em texto, e mais nada`. Nenhum dos quatro chegou ao service. Por cima de cada resposta 400, a consola mostra também uma linha a vermelho, `Failed to load resource: the server responded with a status of 400 (Bad Request)`. É o browser a avisar que o código da resposta é de erro, e não um erro do teu código: a linha que interessa é a que a `pedir` escreve.

10. Com os filmes do Atlas, a lista tem um parâmetro a vigiar, o `genero`. Abre `/api/filmes?genero=Aventura&genero=Animação` e vê o que aparece. O que deves ver: os cinco filmes de aventura e de animação. Repetido, o parâmetro chega como um array, e o Mongoose procura os filmes dos dois géneros. Quem pediu escolheu a forma da consulta, e o contrato diz que o género é um texto. Na `listar` do controller, dentro do `if (genero) {`, antes da linha `filtros.genero = genero;`, acrescenta:

    ```js
        // Repetido, como ?genero=Aventura&genero=Animação, o parâmetro chega
        // como um array, e não como um texto.
        if (typeof genero !== "string") {
          res.status(400).json({ erro: "O parâmetro genero tem de ser um texto, e só pode vir uma vez" });
          return;
        }
    ```

    Guarda e abre o mesmo endereço. O que deves ver: 400, com `{"erro":"O parâmetro genero tem de ser um texto, e só pode vir uma vez"}`. Os filtros constroem-se no servidor, com valores verificados.

    O cartaz, na `mostrarCartaz`, tem a mesma linha do género, e o mesmo problema: com o género repetido, mostra os filmes dos dois géneros, com os dois no título. Fica como está neste laboratório, porque o cartaz responde com uma página, e não com JSON, e a resposta a um pedido errado numa página é outra decisão.

### Paragem 3

A API cria filmes, só com os campos da lista e com o tipo certo, e a lista recusa o género repetido.

Pensa antes de continuares: corre `await pedir("POST", "/api/filmes", { titulo: "Up" })` e repete o pedido do Wall-E, o do passo 8. O que acontece, e é o que o clube quer? A resposta: os dois respondem 201. O Up fica na base sem número, género, duração, idade nem sessão, e no cartaz aparece uma linha partida. O Wall-E fica duas vezes, as duas com o número 9. A lista fechada só vê os nomes e os tipos dos campos, e todos estavam certos. Os valores e o número repetido são regras do clube, e ainda ninguém as escreveu. Corre `npm run seed` para limpar a base de teste, e lê a fase 4.

## Fase 4: as regras de cada campo, no schema

Um filme sem título, ou com a idade mínima de 10 anos, não faz sentido para o clube. A classificação dos filmes só tem as idades 6, 12, 14, 16 e 18. Estas regras são do domínio, o assunto da aplicação, e ficam no schema do modelo, onde podem ser garantidas. Tudo o que escreve filmes passa pelo modelo: a API, o seed e os scripts. O Mongoose verifica as regras antes de criar um documento, e, se alguma falhar, não escreve nada e lança um `ValidationError`. Numa alteração, só as verifica quando se pede, como a fase 6 mostra. A divisão fica assim: o controller vê a forma do pedido, os campos e os tipos; o schema vê os valores, se fazem sentido para o clube. Para saber mais, lê a secção "As regras de cada campo, no schema" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

1. Substitui o conteúdo de `src/models/filme.model.js` por este:

   ```js
   // src/models/filme.model.js: o modelo dos filmes do cinema da escola, no Mongoose.
   // O schema descreve a forma dos documentos da coleção filmes e guarda as
   // regras de cada campo: o que é obrigatório, os mínimos e as idades possíveis.
   // Tudo o que escreve filmes passa por estas regras: a API, o seed e os scripts.
   import mongoose from "mongoose";

   // As idades mínimas da classificação dos filmes em Portugal: M/6, M/12, M/14,
   // M/16 e M/18. O clube só usa estas.
   const IDADES_MINIMAS = [6, 12, 14, 16, 18];

   const filmeSchema = new mongoose.Schema({
     numero: {
       type: Number,
       // O segundo valor de cada regra é a mensagem que a API devolve quando
       // a regra falha. Sem ele, o Mongoose escrevia uma mensagem em inglês.
       required: [true, "O número é obrigatório"],
       min: [1, "O número do filme tem de ser 1 ou mais"],
     },
     titulo: {
       type: String,
       required: [true, "O título é obrigatório"],
       // O trim tira os espaços do início e do fim antes de verificar e guardar.
       // Um título só com espaços fica vazio, e o required recusa-o.
       trim: true,
       maxlength: [80, "O título tem no máximo 80 carateres"],
     },
     genero: {
       type: String,
       required: [true, "O género é obrigatório"],
       trim: true,
     },
     duracaoMinutos: {
       type: Number,
       required: [true, "A duração é obrigatória"],
       min: [1, "A duração tem de ser de pelo menos 1 minuto"],
       max: [300, "A duração tem no máximo 300 minutos"],
     },
     idadeMinima: {
       type: Number,
       required: [true, "A idade mínima é obrigatória"],
       enum: { values: IDADES_MINIMAS, message: "A idade mínima tem de ser 6, 12, 14, 16 ou 18" },
     },
     // A sessão está embutida: é um documento dentro do filme, com o dia e a hora.
     // As regras escrevem-se em cada campo dela, como nos campos do filme.
     sessao: {
       dia: { type: String, required: [true, "O dia da sessão é obrigatório"], trim: true },
       hora: { type: String, required: [true, "A hora da sessão é obrigatória"], trim: true },
     },
   });

   // O terceiro argumento é o nome da coleção, escrito à mão, como na papelaria.
   export const Filme = mongoose.model("Filme", filmeSchema, "filmes");
   ```

   Leitura guiada: cada campo passou a ser um objeto com o tipo e as regras. O `required` diz que o campo é obrigatório, e um texto vazio também conta como em falta. O `trim` tira os espaços do princípio e do fim, antes de verificar e de guardar. O `maxlength` é o comprimento máximo de um texto, e o `min` e o `max` são o valor mínimo e o máximo de um número. O `enum` é a lista dos valores possíveis, aqui com números. Na sessão, as regras escrevem-se em cada um dos dois campos. Cada regra tem uma mensagem em português, que é a que a API vai devolver.

2. Corre `npm run seed`. O que deves ver: `Apagados` e `Inseridos 8 filmes`, como antes. O `insertMany` verifica cada filme com as regras novas, e os oito do clube cumprem-nas.

3. Na consola, volta a criar o Up só com o título. Antes, prevê o que aparece agora.

   ```js
   await pedir("POST", "/api/filmes", { titulo: "Up" });
   ```

   O que deves ver: o código 500, e um texto em HTML que começa por `<!DOCTYPE html>`. Lá dentro, aparece `ValidationError: Filme validation failed`, com as mensagens das regras, e a seguir a lista dos ficheiros por onde o erro passou. O schema recusou o Up, e o filme não ficou na base. Mas a resposta não cumpre o contrato: o código devia ser 400, e o corpo, JSON. E mostra a quem pediu os caminhos dos ficheiros do teu computador. É o tratamento de erros do próprio Express, que só se usa enquanto não houver outro.

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

   Leitura guiada: o Express reconhece um middleware de erros pelos quatro parâmetros, e só o chama quando um pedido acabou num erro. No Express 5, um erro lançado dentro de uma função `async` de uma rota vem parar aqui sozinho. É o caso do erro do `Filme.create`, que sobe pelo repository e pelo service até à `criar`. O primeiro caso é o corpo que não é JSON, que o `express.json()` marca com o `type` `"entity.parse.failed"`. O segundo é a recusa do schema. O `Object.values(erro.errors)` dá a lista das regras que falharam, o `map` tira de cada uma a mensagem, e o `join` junta-as. Tudo o resto é um 500, com uma mensagem que não diz nada do que está por dentro. A razão fica no terminal, para ti.

5. Na `criar` do controller, por cima da linha `const filme = await criarFilme(leitura.dados);`, acrescenta este comentário. Diz a quem ler o código para onde vai o erro de uma regra que falhe, que nenhuma linha da função apanha:

   ```js
     // Se uma regra do schema falhar, o criarFilme rejeita a promessa, e o
     // Express passa o erro ao middleware de erros, no server.js, que responde 400.
   ```

6. Guarda, e experimenta estes três pedidos, prevendo antes as respostas:

   ```js
   await pedir("POST", "/api/filmes", { titulo: "Up" });
   await pedir("POST", "/api/filmes", { numero: 10, titulo: "Up", genero: "Animação", duracaoMinutos: 96, idadeMinima: 10, sessao: { dia: "20 de janeiro", hora: "15:30" } });
   await pedir("POST", "/api/filmes", { numero: 10, titulo: "   ", genero: "Animação", duracaoMinutos: 96, idadeMinima: 6, sessao: { dia: "20 de janeiro", hora: "15:30" } });
   ```

   O que deves ver: três 400, em JSON. O primeiro junta as mensagens dos campos que faltam, a começar por `A hora da sessão é obrigatória` e a acabar em `O número é obrigatório`. A ordem é a que o Mongoose escolhe, e não tem de ser a dos campos. O segundo dá `A idade mínima tem de ser 6, 12, 14, 16 ou 18`. O terceiro dá `O título é obrigatório`: sem os espaços, o título fica vazio.

7. Por fim, um corpo que não é JSON. O `pedir` escreve sempre JSON válido, por isso este pedido faz-se com o `fetch` diretamente. Antes de correres, prevê o código e a mensagem:

   ```js
   await fetch("/api/filmes", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{ titulo: " }).then((resposta) => resposta.text());
   ```

   O que deves ver: o texto `{"erro":"O corpo do pedido não é JSON válido"}`, entre aspas, porque a consola mostra o valor de um texto. No separador "Rede", o código é 400.

### Paragem 4

A API cria filmes que cumprem as regras do clube e recusa os outros com 400, em JSON. Os erros que ninguém previu dão 500, sem pormenores.

Pensa antes de continuares: cria o Wall-E duas vezes, com o pedido do passo 8 da fase 3. O que acontece, e porque é que o schema não o impede? A resposta: os dois pedidos dão 201, e a base fica com dois filmes com o número 9. O schema verifica um filme de cada vez, campo a campo, e o número 9 é um inteiro de 1 para cima. Para saber se já existe outro filme com o mesmo número, é preciso ir à base ver, e o schema não vai. Corre `npm run seed` para limpar, e lê a fase 5.

## Fase 5: a regra do número repetido, no service

O clube tem uma regra que compara um filme com os outros: não há dois filmes com o mesmo número. Esta regra não cabe no schema, que olha para um filme de cada vez. Para a aplicar, é preciso perguntar à base se o número já está a ser usado. Uma regra que precisa do estado dos dados fica no service, que o pode pedir ao repository. A função de que precisa já existe, a `procurarPorNumero`, que o pedido de um filme usa. O service diz se criou ou não, e o controller traduz: 201 quando criou, e 409 quando a regra não deixa. Para saber mais, lê a secção "Apagar, e a regra que precisa da base" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md), que mostra uma regra deste tipo na papelaria.

1. No service, substitui a função `criarFilme` por esta:

   ```js
   /**
    * Cria um filme novo, se a regra do clube o deixar. As regras de cada campo
    * estão no schema do modelo.
    * @param {object} dados os campos do filme, já com o tipo verificado pelo controller
    * @returns {Promise<object | null>} o filme criado, ou null se já houver um filme com esse número
    */
   export async function criarFilme(dados) {
     // Regra do clube: cada filme tem o seu número, e não há dois iguais.
     // Sem número, não há nada a comparar: é o schema que recusa o filme.
     if (dados.numero !== undefined) {
       const existente = await procurarPorNumero(dados.numero);
       if (existente !== null) {
         return null;
       }
     }
     const filme = await inserirFilme(dados);
     return filme;
   }
   ```

   Leitura guiada: antes de inserir, o service pergunta ao repository se já há um filme com aquele número. Se houver, devolve `null`, sem inserir. Se o corpo não trouxe número, não há nada a comparar, e o schema recusa o filme logo a seguir, com `O número é obrigatório`. Sem este `if`, a `procurarPorNumero` procurava o filme com o número `undefined`. O MongoDB lê-o como "sem número". Um filme sem número que estivesse na base, como o Up da paragem 3, dava então um 409 a um pedido que só devia dar 400.

2. No controller, na função `criar`, a seguir à linha `const filme = await criarFilme(leitura.dados);`, acrescenta:

   ```js
     if (filme === null) {
       res.status(409).json({ erro: `Já existe um filme com o número ${leitura.dados.numero}` });
       return;
     }
   ```

   A `criar` fica assim:

   ```js
   /** POST /api/filmes, com o filme novo no corpo, em JSON */
   export async function criar(req, res) {
     const leitura = lerCamposDoFilme(req.body, true);
     if (leitura.erro) {
       res.status(400).json({ erro: leitura.erro });
       return;
     }
     // Se uma regra do schema falhar, o criarFilme rejeita a promessa, e o
     // Express passa o erro ao middleware de erros, no server.js, que responde 400.
     const filme = await criarFilme(leitura.dados);
     if (filme === null) {
       res.status(409).json({ erro: `Já existe um filme com o número ${leitura.dados.numero}` });
       return;
     }
     res.status(201).json(filme);
   }
   ```

3. Guarda. Antes de correres, prevê o que dá cada um destes pedidos, pela ordem:

   ```js
   await pedir("POST", "/api/filmes", { numero: 9, titulo: "Wall-E", genero: "Animação", duracaoMinutos: 97, idadeMinima: 6, sessao: { dia: "13 de janeiro", hora: "15:30" } });
   await pedir("POST", "/api/filmes", { numero: 9, titulo: "Wall-E", genero: "Animação", duracaoMinutos: 97, idadeMinima: 6, sessao: { dia: "13 de janeiro", hora: "15:30" } });
   await pedir("POST", "/api/filmes", { numero: 3, titulo: "Up", genero: "Animação", duracaoMinutos: 96, idadeMinima: 6, sessao: { dia: "20 de janeiro", hora: "15:30" } });
   ```

   O que deves ver: 201, com o Wall-E; 409, com `{"erro":"Já existe um filme com o número 9"}`; e 409, com `{"erro":"Já existe um filme com o número 3"}`, porque o 3 é de Os Goonies. No Atlas, há um só Wall-E.

### Paragem 5

A API cria filmes que cumprem as regras de cada campo, no schema, e a regra do número repetido, no service.

Pensa antes de continuares: o pedido com o número 9 repetido está bem escrito. Porque é que a resposta é 409, e não 400? A resposta: um 400 diz que o pedido está mal escrito, e repeti-lo dá sempre 400. Este pedido tem todos os campos certos, e passava se o filme 9 não existisse. É o estado dos dados que não o deixa passar agora, e é isso que o 409 quer dizer. Se o clube apagar o filme 9, o mesmo pedido dá 201.

## Fase 6: alterar só o que vem no pedido

O clube mudou a sessão de Os Goonies, ou percebeu que a duração do Wall-E estava errada. O `PATCH` altera só os campos que vierem no corpo. No Mongoose, faz-se com o `findOneAndUpdate`, que procura o filme com um filtro, aqui `{ numero: numero }`, e muda os campos recebidos. Esta fase tem uma parte que não está escrita aqui: as opções da função vais encontrá-las na documentação do Mongoose. Para saber mais, lê a secção "Alterar só o que vem no pedido" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md), que faz o mesmo com o `findByIdAndUpdate`.

1. No repository, acrescenta no fim esta função. É a primeira versão, ainda sem opções:

   ```js
   /**
    * Altera os campos recebidos do filme com este número, e deixa os outros como estão.
    * @param {number} numero um inteiro positivo, já verificado pelo controller
    * @param {object} dados os campos a alterar, só os da lista do controller
    * @returns {Promise<object | null>} o filme alterado, ou null se não existir
    */
   export async function alterarPorNumero(numero, dados) {
     const filme = await Filme.findOneAndUpdate({ numero: numero }, dados);
     return filme;
   }
   ```

2. No service, junta a `alterarPorNumero` ao `import` do repository, a seguir à `inserirFilme`, e acrescenta no fim esta função:

   ```js
   /**
    * Altera os campos recebidos do filme com este número.
    * @param {number} numero um inteiro positivo, já verificado pelo controller
    * @param {object} dados os campos a alterar, já com o tipo verificado
    * @returns {Promise<object | null>} o filme alterado, ou null se não existir
    */
   export async function alterarFilme(numero, dados) {
     const filme = await alterarPorNumero(numero, dados);
     return filme;
   }
   ```

3. No controller, junta a `alterarFilme` ao `import` do service, a seguir à `criarFilme`, e acrescenta no fim esta função:

   ```js
   /** PATCH /api/filmes/:numero, com os campos a alterar no corpo, em JSON */
   export async function alterar(req, res) {
     const numero = Number(req.params.numero); // chega como texto, "3", e passa a número
     if (!Number.isInteger(numero) || numero < 1) {
       res.status(400).json({ erro: "O número do filme tem de ser um número inteiro positivo" });
       return;
     }
     const leitura = lerCamposDoFilme(req.body, false);
     if (leitura.erro) {
       res.status(400).json({ erro: leitura.erro });
       return;
     }
     if (Object.keys(leitura.dados).length === 0) {
       res.status(400).json({ erro: "O pedido não traz nenhum campo para alterar" });
       return;
     }
     const filme = await alterarFilme(numero, leitura.dados);
     if (filme === null) {
       res.status(404).json({ erro: `Não existe o filme ${numero}` });
       return;
     }
     res.json(filme);
   }
   ```

   Leitura guiada: o número do caminho verifica-se como na `obter`. A lista fechada é a mesma função do `POST`, com o segundo argumento a `false`, porque o número não se altera. A verificação nova é a do corpo vazio. Um `{}` passa a lista fechada, porque não traz nenhum campo errado, mas também não traz nada para alterar. O `null` do service, quando o filme não existe, dá 404.

4. No router, junta a `alterar` ao `import` do controller, a seguir à `criar`, e acrescenta a rota a seguir à do `POST`:

   ```js
   router.patch("/:numero", alterar);
   ```

5. Guarda. Na consola, muda a idade mínima de Os Goonies, o filme 3, para 14. Antes de correres, prevê a idade que vem na resposta.

   ```js
   await pedir("PATCH", "/api/filmes/3", { idadeMinima: 14 });
   ```

   O que deves ver: 200, com Os Goonies e `"idadeMinima":12`. Abre `/api/filmes/3` no browser, ou o filme no Atlas, na base `cinema-teste`: a idade é 14. A base mudou, mas a resposta mostra o filme como estava antes.

6. Experimenta uma regra do schema. Antes de correres, prevê o código da resposta e a idade que fica na base.

   ```js
   await pedir("PATCH", "/api/filmes/3", { idadeMinima: 10 });
   ```

   O que deves ver: 200. No browser, Os Goonies têm agora `"idadeMinima":10`. A regra do `enum`, que no `POST` recusava a idade 10, não correu. A fase 4 dizia que o schema corre quando se cria um filme; numa alteração feita assim, por omissão, não corre.

7. As duas surpresas resolvem-se com opções, que se passam num terceiro argumento do `findOneAndUpdate`. Abre a documentação do Mongoose, em [mongoosejs.com/docs/api/model.html](https://mongoosejs.com/docs/api/model.html), e procura a secção `Model.findOneAndUpdate()`. Confirma no topo da página a versão da documentação, que deve ser a 9. A versão que tens instalada vê-se no `package-lock.json`, ou com o comando `npm ls mongoose`. A página foi consultada a 30 de outubro de 2026, na versão 9.11.4. Na lista dos parâmetros, procura a opção que faz a função devolver o documento depois da alteração, e a que faz correr as regras do schema. Escreve no caderno o nome de cada uma e o valor que lhe tens de dar.

   A resposta: a primeira é o `returnDocument`, com o valor `'after'`; por omissão é `'before'`, e por isso vinha a idade antiga. A segunda é o `runValidators`, com `true`: as regras do schema, a que a documentação chama validators, só correm numa alteração quando se pede. A documentação mostra também o `new`, com `true`, que faz o mesmo do que o `returnDocument: 'after'`, e que muitos tutoriais usam. No Mongoose 9 está marcado como obsoleto.

8. Substitui a função `alterarPorNumero` do repository por esta:

   ```js
   /**
    * Altera os campos recebidos do filme com este número, e deixa os outros como estão.
    * @param {number} numero um inteiro positivo, já verificado pelo controller
    * @param {object} dados os campos a alterar, só os da lista do controller
    * @returns {Promise<object | null>} o filme depois da alteração, ou null se não existir
    */
   export async function alterarPorNumero(numero, dados) {
     // Sem as duas opções, o findOneAndUpdate devolvia o filme como estava
     // antes da alteração, e não verificava as regras do schema, que por omissão
     // só correm quando um documento é criado.
     const filme = await Filme.findOneAndUpdate({ numero: numero }, dados, {
       returnDocument: "after",
       runValidators: true,
     });
     return filme;
   }
   ```

9. Guarda, corre `npm run seed` para limpar a idade errada, e repete os dois pedidos, prevendo antes as respostas:

   ```js
   await pedir("PATCH", "/api/filmes/3", { idadeMinima: 14 });
   await pedir("PATCH", "/api/filmes/3", { idadeMinima: 10 });
   ```

   O que deves ver: 200, com `"idadeMinima":14`; e 400, com `{"erro":"A idade mínima tem de ser 6, 12, 14, 16 ou 18"}`. No Atlas, Os Goonies têm 14, e o 10 não chegou à base.

10. Experimenta os outros casos do contrato, prevendo antes cada resposta:

    ```js
    await pedir("PATCH", "/api/filmes/3", { sessao: { dia: "25 de novembro", hora: "16:00" } });
    await pedir("PATCH", "/api/filmes/3", { numero: 30 });
    await pedir("PATCH", "/api/filmes/3", {});
    await pedir("PATCH", "/api/filmes/99", { titulo: "Up" });
    ```

    O que deves ver: 200, com a sessão nova, a 25 de novembro às 16:00; 400, com `O número de um filme não se altera`; 400, com `O pedido não traz nenhum campo para alterar`; e 404, com `Não existe o filme 99`.

### Paragem 6

A API altera os campos que vierem no pedido, responde com o filme depois da alteração e recusa o que não cumpre as regras.

Pensa antes de continuares: o `PATCH` da sessão leva o dia e a hora, mesmo que só a hora mude. Porque é que a lista fechada exige os dois? A resposta: o `findOneAndUpdate` troca a sessão inteira pela que vem no pedido. Uma sessão só com a hora deixava o filme sem dia. Pedir os dois evita que uma alteração pequena apague metade da sessão.

## Fase 7: apagar

O clube deixou de passar um filme e quer tirá-lo da lista. O `DELETE` apaga o filme com o número do caminho. No Mongoose, faz-se com o `findOneAndDelete`, que apaga o documento que o filtro escolhe e devolve-o, ou devolve `null` quando nenhum o cumpre. O controller traduz: 204, sem corpo, quando apagou, e 404 quando o filme não existe.

1. No repository, acrescenta no fim esta função:

   ```js
   /**
    * Apaga o filme com este número.
    * @param {number} numero um inteiro positivo, já verificado pelo controller
    * @returns {Promise<object | null>} o filme apagado, ou null se não existia
    */
   export async function apagarPorNumero(numero) {
     const filme = await Filme.findOneAndDelete({ numero: numero });
     return filme;
   }
   ```

2. No service, junta a `apagarPorNumero` ao `import` do repository, a seguir à `alterarPorNumero`, e acrescenta no fim esta função:

   ```js
   /**
    * Apaga o filme com este número.
    * @param {number} numero um inteiro positivo, já verificado pelo controller
    * @returns {Promise<object | null>} o filme apagado, ou null se não existia
    */
   export async function apagarFilme(numero) {
     const filme = await apagarPorNumero(numero);
     return filme;
   }
   ```

3. No controller, junta a `apagarFilme` ao `import` do service, a seguir à `alterarFilme`, e acrescenta no fim esta função:

   ```js
   /** DELETE /api/filmes/:numero */
   export async function apagar(req, res) {
     const numero = Number(req.params.numero); // chega como texto, "3", e passa a número
     if (!Number.isInteger(numero) || numero < 1) {
       res.status(400).json({ erro: "O número do filme tem de ser um número inteiro positivo" });
       return;
     }
     const filme = await apagarFilme(numero);
     if (filme === null) {
       res.status(404).json({ erro: `Não existe o filme ${numero}` });
       return;
     }
     // 204: apagado, e a resposta não tem corpo.
     res.status(204).end();
   }
   ```

   Leitura guiada: o número verifica-se como nas outras. O `null` do service dá 404. O `res.status(204).end()` termina a resposta sem corpo, porque depois de apagar não há nada a devolver.

4. No router, junta a `apagar` ao `import` do controller, a seguir à `alterar`, e acrescenta a rota a seguir à do `PATCH`. O ficheiro fica assim:

   ```js
   // src/rotas/filmes.rotas.js: que pedido da API dos filmes vai para que função do controller.
   // Os caminhos são relativos ao sítio onde este router é montado, em server.js:
   // "/" quer dizer /api/filmes, e "/:numero" quer dizer /api/filmes/:numero.
   import express from "express";
   import { listar, obter, criar, alterar, apagar } from "../controllers/filmes.controller.js";

   const router = express.Router();

   router.get("/", listar);
   router.get("/:numero", obter);
   router.post("/", criar);
   router.patch("/:numero", alterar);
   router.delete("/:numero", apagar);

   export default router;
   ```

5. Guarda e corre `npm run seed`. Antes de correres, prevê o que dá cada um destes pedidos. Depois, corre-os por esta ordem:

   ```js
   await pedir("DELETE", "/api/filmes/3");
   await pedir("DELETE", "/api/filmes/3");
   await pedir("DELETE", "/api/filmes/abc");
   ```

   O que deves ver, pela ordem dos pedidos:

   - `204` sem nada à frente, porque a resposta não tem corpo;
   - 404, com `{"erro":"Não existe o filme 3"}`, porque já foi apagado;
   - 400, com a mensagem do número do filme.

   No Atlas, a coleção tem sete filmes, sem Os Goonies, e o `/cartaz?genero=Aventura` só mostra o Jumanji.

### Paragem 7

A API faz o CRUD completo dos filmes, com as regras do clube: as de cada campo no schema, e a do número repetido, que precisa da base, no service.

Os quatro ficheiros que mudaram em várias fases, como devem estar agora, para conferires os teus. O router está no passo 4. Se fizeste os exercícios 6 e 7 da ficha, os teus têm também essas peças.

O `src/server.js`:

```js
// src/server.js: o ponto de arranque da aplicação do cinema da escola.
// Cria a aplicação Express, monta as rotas da API e a do cartaz, liga-se à
// base de dados e só depois à porta. As regras e as consultas estão nas camadas.
import express from "express";
import { ligarBaseDeDados } from "./db/mongoose.js";
import filmesRotas from "./rotas/filmes.rotas.js";
import { mostrarCartaz } from "./controllers/filmes.controller.js";

const app = express();

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, a aplicação usa a 3000.
const PORTA = process.env.PORT || 3000;

// O motor dos modelos das páginas. O Express procura os modelos na pasta
// views da pasta de onde arrancas o servidor, que é a raiz do projeto.
app.set("view engine", "ejs");

// Lê o corpo dos pedidos que chegam em JSON e põe-no em req.body, já como
// objeto. Sem esta linha, o req.body ficava undefined em todos os pedidos.
app.use(express.json());

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rota de estado: serve para confirmar que a API está ligada e a responder.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "Cinema da escola" });
});

// Todos os pedidos começados por /api/filmes seguem para o router dos filmes.
app.use("/api/filmes", filmesRotas);

// O cartaz é um só pedido, por isso não tem router próprio: a rota fica aqui,
// e a função que responde está no controller.
app.get("/cartaz", mostrarCartaz);

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
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

// Primeiro a ligação à base, e só depois o servidor: uma aplicação que não
// chega aos dados não deve começar a aceitar pedidos.
try {
  await ligarBaseDeDados();
} catch (erro) {
  console.error(`Não foi possível ligar à base de dados: ${erro.message}`);
  process.exit(1);
}

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a aplicação: ${erro.message}`);
    return;
  }
  console.log(`Cinema da escola em http://localhost:${PORTA}`);
});
```

O `src/repositories/filmes.repository.js`:

```js
// src/repositories/filmes.repository.js: o acesso aos filmes na base de dados.
// Das camadas da aplicação, é a única que usa o modelo Filme e que escreve os
// filtros na linguagem do MongoDB, como o $lte.
import { Filme } from "../models/filme.model.js";

/**
 * Procura os filmes que cumprem as condições recebidas.
 * As condições que faltam não se aplicam; sem nenhuma, vêm todos os filmes.
 * @param {object} condicoes com genero (texto) e idadeMinimaAte (número), os dois opcionais
 * @returns {Promise<object[]>} os filmes encontrados, possivelmente nenhum
 */
export async function procurarFilmes(condicoes) {
  // O filtro é o mesmo que escreverias na barra do Atlas. Constrói-se aqui,
  // a partir das condições, para nenhuma outra camada precisar de o conhecer.
  const filtro = {};
  if (condicoes.genero !== undefined) {
    filtro.genero = condicoes.genero;
  }
  if (condicoes.idadeMinimaAte !== undefined) {
    filtro.idadeMinima = { $lte: condicoes.idadeMinimaAte };
  }
  const filmes = await Filme.find(filtro);
  return filmes;
}

/**
 * Procura um filme pelo número que o clube lhe deu, no campo numero, e não pelo _id.
 * @param {number} numero um inteiro positivo, já verificado pelo controller
 * @returns {Promise<object | null>} o filme, ou null se não existir
 */
export async function procurarPorNumero(numero) {
  // O find devolve sempre uma lista. Como não há dois filmes com o mesmo
  // número, a lista vem com um filme, ou vazia.
  const encontrados = await Filme.find({ numero: numero });
  if (encontrados.length === 0) {
    return null;
  }
  return encontrados[0];
}

/**
 * Insere um filme novo. O schema verifica as regras de cada campo antes de
 * inserir; se alguma falhar, a promessa é rejeitada com um ValidationError.
 * @param {object} dados os campos do filme, só os da lista do controller
 * @returns {Promise<object>} o filme inserido, já com o _id que o MongoDB lhe deu
 */
export async function inserirFilme(dados) {
  const filme = await Filme.create(dados);
  return filme;
}

/**
 * Altera os campos recebidos do filme com este número, e deixa os outros como estão.
 * @param {number} numero um inteiro positivo, já verificado pelo controller
 * @param {object} dados os campos a alterar, só os da lista do controller
 * @returns {Promise<object | null>} o filme depois da alteração, ou null se não existir
 */
export async function alterarPorNumero(numero, dados) {
  // Sem as duas opções, o findOneAndUpdate devolvia o filme como estava
  // antes da alteração, e não verificava as regras do schema, que por omissão
  // só correm quando um documento é criado.
  const filme = await Filme.findOneAndUpdate({ numero: numero }, dados, {
    returnDocument: "after",
    runValidators: true,
  });
  return filme;
}

/**
 * Apaga o filme com este número.
 * @param {number} numero um inteiro positivo, já verificado pelo controller
 * @returns {Promise<object | null>} o filme apagado, ou null se não existia
 */
export async function apagarPorNumero(numero) {
  const filme = await Filme.findOneAndDelete({ numero: numero });
  return filme;
}
```

O `src/services/filmes.service.js`:

```js
// src/services/filmes.service.js: as regras do clube de cinema sobre os filmes.
// Recebe valores simples e devolve valores simples. Não sabe nada de HTTP,
// nem de MongoDB: pede os filmes ao repository, com as condições que as
// regras do clube dão.
import {
  procurarFilmes,
  procurarPorNumero,
  inserirFilme,
  alterarPorNumero,
  apagarPorNumero,
} from "../repositories/filmes.repository.js";

/**
 * Devolve os filmes que cumprem os filtros recebidos.
 * Os filtros já chegam verificados pelo controller; os que faltam não se aplicam.
 * @param {object} filtros com genero (texto) e idade (número), os dois opcionais
 * @returns {Promise<object[]>} os filmes, possivelmente nenhum
 */
export async function listarFilmes(filtros) {
  const condicoes = {};
  if (filtros.genero !== undefined) {
    condicoes.genero = filtros.genero;
  }
  if (filtros.idade !== undefined) {
    // A regra do clube: um aluno pode ver um filme quando a idade mínima do
    // filme é a idade dele ou menos. Um aluno de 12 anos vê os filmes para 12.
    condicoes.idadeMinimaAte = filtros.idade;
  }
  const filmes = await procurarFilmes(condicoes);
  return filmes;
}

/**
 * Procura um filme pelo número.
 * @param {number} numero um inteiro positivo, já verificado pelo controller
 * @returns {Promise<object | null>} o filme, ou null se não existir
 */
export async function obterFilme(numero) {
  const filme = await procurarPorNumero(numero);
  return filme;
}

/**
 * Cria um filme novo, se a regra do clube o deixar. As regras de cada campo
 * estão no schema do modelo.
 * @param {object} dados os campos do filme, já com o tipo verificado pelo controller
 * @returns {Promise<object | null>} o filme criado, ou null se já houver um filme com esse número
 */
export async function criarFilme(dados) {
  // Regra do clube: cada filme tem o seu número, e não há dois iguais.
  // Sem número, não há nada a comparar: é o schema que recusa o filme.
  if (dados.numero !== undefined) {
    const existente = await procurarPorNumero(dados.numero);
    if (existente !== null) {
      return null;
    }
  }
  const filme = await inserirFilme(dados);
  return filme;
}

/**
 * Altera os campos recebidos do filme com este número.
 * @param {number} numero um inteiro positivo, já verificado pelo controller
 * @param {object} dados os campos a alterar, já com o tipo verificado
 * @returns {Promise<object | null>} o filme alterado, ou null se não existir
 */
export async function alterarFilme(numero, dados) {
  const filme = await alterarPorNumero(numero, dados);
  return filme;
}

/**
 * Apaga o filme com este número.
 * @param {number} numero um inteiro positivo, já verificado pelo controller
 * @returns {Promise<object | null>} o filme apagado, ou null se não existia
 */
export async function apagarFilme(numero) {
  const filme = await apagarPorNumero(numero);
  return filme;
}
```

O `src/controllers/filmes.controller.js`:

```js
// src/controllers/filmes.controller.js: a ponte entre o HTTP e o service.
// Lê e verifica o que vem no pedido, chama o service e escolhe a resposta:
// JSON na API dos filmes, como diz o contrato, e uma página no cartaz.
import {
  listarFilmes,
  obterFilme,
  criarFilme,
  alterarFilme,
  apagarFilme,
} from "../services/filmes.service.js";

// Os campos que o corpo de um pedido pode trazer, para criar ou alterar um
// filme. É uma lista fechada: um campo que não esteja aqui é recusado.
// A sessão é um caso à parte, porque é um objeto com o dia e a hora.
const CAMPOS_DE_TEXTO = ["titulo", "genero"];
const CAMPOS_INTEIROS = ["numero", "duracaoMinutos", "idadeMinima"];

/**
 * Lê do corpo do pedido os campos de um filme: só os da lista, cada um com o tipo certo.
 * Não verifica os valores, como as idades possíveis: essas são regras do clube,
 * e quem as verifica é o schema do modelo.
 * @param {unknown} corpo o req.body, tal como o express.json() o deixou
 * @param {boolean} aceitaNumero true ao criar um filme; false ao alterar, porque o número não muda
 * @returns {object} { erro } com a mensagem do primeiro problema, ou { dados } com os campos lidos
 */
function lerCamposDoFilme(corpo, aceitaNumero) {
  // Sem corpo em JSON, o req.body fica undefined.
  if (typeof corpo !== "object" || corpo === null || Array.isArray(corpo)) {
    return { erro: "O corpo do pedido tem de ser um objeto JSON" };
  }
  // O objeto dados recebe só os campos da lista, copiados um a um.
  // O req.body nunca segue inteiro para o service.
  const dados = {};
  for (const campo of Object.keys(corpo)) {
    const valor = corpo[campo];
    if (campo === "numero" && !aceitaNumero) {
      return { erro: "O número de um filme não se altera" };
    }
    if (CAMPOS_DE_TEXTO.includes(campo)) {
      // Um objeto no lugar de um texto, como { "$ne": null }, é recusado aqui.
      // Se chegasse a um filtro, seria lido como um operador do MongoDB.
      if (typeof valor !== "string") {
        return { erro: `O campo ${campo} tem de ser um texto` };
      }
      dados[campo] = valor;
    } else if (CAMPOS_INTEIROS.includes(campo)) {
      if (!Number.isInteger(valor)) {
        return { erro: `O campo ${campo} tem de ser um número inteiro` };
      }
      dados[campo] = valor;
    } else if (campo === "sessao") {
      // A sessão tem exatamente dois campos, o dia e a hora, e os dois são texto.
      // Com dois campos e os dois certos, não pode haver um terceiro escondido.
      if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
        return { erro: "A sessão tem de ser um objeto, com o dia e a hora" };
      }
      if (Object.keys(valor).length !== 2 || typeof valor.dia !== "string" || typeof valor.hora !== "string") {
        return { erro: "A sessão tem de ter o dia e a hora, os dois em texto, e mais nada" };
      }
      dados.sessao = { dia: valor.dia, hora: valor.hora };
    } else {
      return { erro: `O campo ${campo} não é aceite` };
    }
  }
  return { dados: dados };
}

/** GET /api/filmes, com os filtros opcionais ?genero= e ?idade= */
export async function listar(req, res) {
  const genero = req.query.genero;
  const idade = req.query.idade;

  // O objeto dos filtros começa vazio e só recebe o que o contrato prevê,
  // já verificado. O req.query nunca segue inteiro para o service.
  const filtros = {};
  if (genero) {
    // Repetido, como ?genero=Aventura&genero=Animação, o parâmetro chega
    // como um array, e não como um texto.
    if (typeof genero !== "string") {
      res.status(400).json({ erro: "O parâmetro genero tem de ser um texto, e só pode vir uma vez" });
      return;
    }
    filtros.genero = genero;
  }
  if (idade) {
    const idadeEmNumero = Number(idade); // chega como texto, "12", e passa a número
    if (!Number.isInteger(idadeEmNumero) || idadeEmNumero < 1) {
      res.status(400).json({ erro: "A idade tem de ser um número inteiro maior do que 0" });
      return;
    }
    filtros.idade = idadeEmNumero;
  }

  const filmes = await listarFilmes(filtros);
  res.json(filmes);
}

/** GET /api/filmes/:numero */
export async function obter(req, res) {
  const numero = Number(req.params.numero); // chega como texto, "3", e passa a número
  if (!Number.isInteger(numero) || numero < 1) {
    res.status(400).json({ erro: "O número do filme tem de ser um número inteiro positivo" });
    return;
  }
  const filme = await obterFilme(numero);
  if (filme === null) {
    res.status(404).json({ erro: `Não existe o filme ${numero}` });
    return;
  }
  res.json(filme);
}

/** GET /cartaz, com o filtro opcional ?genero=. Responde com uma página, e não com JSON. */
export async function mostrarCartaz(req, res) {
  const genero = req.query.genero;
  let titulo = "Cartaz";
  const filtros = {};
  if (genero) {
    titulo = `Cartaz: ${genero}`;
    filtros.genero = genero;
  }
  const filmes = await listarFilmes(filtros);
  res.render("cartaz", { titulo: titulo, filmes: filmes });
}

/** POST /api/filmes, com o filme novo no corpo, em JSON */
export async function criar(req, res) {
  const leitura = lerCamposDoFilme(req.body, true);
  if (leitura.erro) {
    res.status(400).json({ erro: leitura.erro });
    return;
  }
  // Se uma regra do schema falhar, o criarFilme rejeita a promessa, e o
  // Express passa o erro ao middleware de erros, no server.js, que responde 400.
  const filme = await criarFilme(leitura.dados);
  if (filme === null) {
    res.status(409).json({ erro: `Já existe um filme com o número ${leitura.dados.numero}` });
    return;
  }
  res.status(201).json(filme);
}

/** PATCH /api/filmes/:numero, com os campos a alterar no corpo, em JSON */
export async function alterar(req, res) {
  const numero = Number(req.params.numero); // chega como texto, "3", e passa a número
  if (!Number.isInteger(numero) || numero < 1) {
    res.status(400).json({ erro: "O número do filme tem de ser um número inteiro positivo" });
    return;
  }
  const leitura = lerCamposDoFilme(req.body, false);
  if (leitura.erro) {
    res.status(400).json({ erro: leitura.erro });
    return;
  }
  if (Object.keys(leitura.dados).length === 0) {
    res.status(400).json({ erro: "O pedido não traz nenhum campo para alterar" });
    return;
  }
  const filme = await alterarFilme(numero, leitura.dados);
  if (filme === null) {
    res.status(404).json({ erro: `Não existe o filme ${numero}` });
    return;
  }
  res.json(filme);
}

/** DELETE /api/filmes/:numero */
export async function apagar(req, res) {
  const numero = Number(req.params.numero); // chega como texto, "3", e passa a número
  if (!Number.isInteger(numero) || numero < 1) {
    res.status(400).json({ erro: "O número do filme tem de ser um número inteiro positivo" });
    return;
  }
  const filme = await apagarFilme(numero);
  if (filme === null) {
    res.status(404).json({ erro: `Não existe o filme ${numero}` });
    return;
  }
  // 204: apagado, e a resposta não tem corpo.
  res.status(204).end();
}
```

Pensa antes de continuares: no service, entre a `procurarPorNumero` e a `inserirFilme` da `criarFilme` passa um instante. O que podia correr mal, se duas pessoas criassem o filme 9 ao mesmo tempo? A resposta: os dois pedidos podiam fazer a pergunta antes de qualquer um inserir, e os dois ouviam que o 9 estava livre. A base ficava com dois filmes 9. Com uma pessoa a gerir o clube, não acontece. Para muitas, pede-se à própria base de dados que não aceite dois filmes com o mesmo número, com um índice único. Um índice único é uma regra guardada na própria base, que recusa um segundo documento com o mesmo valor num campo.

## Fase 8: ver o que vai mudar antes de apagar muitos

O `findOneAndDelete` apaga um filme, escolhido pelo número. O `deleteMany`, que o seed usa, apaga todos os que cumprirem um filtro, e um filtro errado apaga o que não devia. Com o filtro vazio, `{}`, apaga a coleção inteira. Por isso, antes de um `deleteMany` ou de um `updateMany`, corre-se o mesmo filtro num `find`, ou num `countDocuments`, que só conta, e vê-se o que ele escolhe. E faz-se a experiência na base de teste, que o seed reconstrói. Para saber mais, lê a secção "Ver o que vai mudar antes de mudar muitos" do [guia](05-ligacao-segura-crud-e-regras-de-dominio.md).

O clube vai deixar de passar filmes de aventura. Apagar um género inteiro faz-se uma vez, à parte, como o seed, e não é um pedido da API.

1. Em `src`, cria o ficheiro `apagar-genero.js`, com este conteúdo:

   ```js
   // src/apagar-genero.js: apaga da base de teste os filmes de um género.
   // Corre-se à parte, como o seed, com o género no fim do comando:
   //   node --env-file=.env src/apagar-genero.js Aventura
   // Mostra primeiro o que o filtro escolhe, e só apaga quando lhe juntas --apagar.
   import mongoose from "mongoose";
   import { ligarBaseDeDados } from "./db/mongoose.js";
   import { Filme } from "./models/filme.model.js";

   // O process.argv é a lista das palavras do comando: o node, o caminho do
   // script e, a partir da terceira posição, o que escreveste a seguir.
   const genero = process.argv[2];
   const confirmado = process.argv.includes("--apagar");

   try {
     await ligarBaseDeDados();
     const nomeDaBase = mongoose.connection.name;
     if (!nomeDaBase.endsWith("-teste")) {
       console.error(`Este script só corre numa base de teste, e esta é a ${nomeDaBase}.`);
     } else if (genero === undefined || genero === "--apagar") {
       console.error("Falta o género: node --env-file=.env src/apagar-genero.js Aventura");
     } else {
       // Primeiro, ver o que vai mudar: o mesmo filtro, num find.
       const filtro = { genero: genero };
       const escolhidos = await Filme.find(filtro);
       console.log(`O filtro escolhe ${escolhidos.length} filmes.`);
       for (const filme of escolhidos) {
         console.log(`  ${filme.titulo}`);
       }
       if (!confirmado) {
         console.log("Nada foi apagado. Para apagar, corre o mesmo comando com --apagar no fim.");
       } else {
         // Depois, apagar com o mesmo filtro, e confirmar quantos saíram.
         const resultado = await Filme.deleteMany(filtro);
         console.log(`Apagados ${resultado.deletedCount} filmes`);
       }
     }
   } catch (erro) {
     console.error(`O script falhou: ${erro.message}`);
   }

   await mongoose.disconnect();
   ```

   Leitura guiada: o `process.argv` é a lista das palavras do comando. As duas primeiras são o caminho do `node` e o do script, e o género é a terceira, `process.argv[2]`. O `includes("--apagar")` procura essa palavra em qualquer posição. O script confirma que está numa base de teste, como o seed. Depois corre o filtro num `find` e escreve os títulos. Só com o `--apagar` corre o `deleteMany`, com o mesmo objeto `filtro`, escrito uma só vez.

2. Corre `npm run seed`. Antes de correres o script, prevê quantos filmes o filtro escolhe, e quais. Depois:

   ```bash
   node --env-file=.env src/apagar-genero.js Aventura
   ```

   O que deves ver:

   ```text
   Ligada à base de dados cinema-teste
   O filtro escolhe 2 filmes.
     Os Goonies
     Jumanji
   Nada foi apagado. Para apagar, corre o mesmo comando com --apagar no fim.
   ```

3. Confirma no Atlas que os oito filmes continuam lá. Depois, apaga:

   ```bash
   node --env-file=.env src/apagar-genero.js Aventura --apagar
   ```

   O que deves ver: as mesmas linhas até aos dois títulos, e no fim `Apagados 2 filmes`. O número do `find` e o do `deleteMany` são iguais, e é isso que confirma que o filtro apagou o que mostrou.

4. Corre o primeiro comando outra vez, sem o `--apagar`. O que deves ver: `O filtro escolhe 0 filmes.` Para um género com espaço, como a ficção científica, o género escreve-se entre aspas: `node --env-file=.env src/apagar-genero.js "Ficção científica"`. Experimenta-o sem o `--apagar`. O que deves ver: 3 filmes, Regresso ao Futuro, Matrix e Interstellar. Sem as aspas, o terminal partia o género em duas palavras, e o script procurava só `Ficção`, que não escolhe nada.

5. Corre `npm run seed`, para a base voltar aos oito filmes.

### Paragem 8

Sabes apagar vários documentos de uma vez sem surpresas: vês primeiro o que o filtro escolhe, e só depois apagas, na base de teste.

Pensa antes de continuares: o script corre o `find` e o `deleteMany` com a mesma variável `filtro`. Porque não escrever `{ genero: genero }` duas vezes? A resposta: escrito duas vezes, o filtro podia sair diferente da segunda, com uma letra trocada ou uma condição a mais. O que se apagava já não era o que se viu.

## Fase 9: verificar o contrato

A verificação faz-se como no tema anterior, com previsões e resultados, e com duas coisas novas. Os pedidos que escrevem confirmam-se também na base, e não só na resposta. E confirma-se que a cadeia de ligação não escapou.

1. Corre `npm run seed`. Na consola, se recarregaste a página, cola outra vez o bloco da `pedir`.

2. Copia para o caderno a coluna dos pedidos abaixo e acrescenta-lhe três colunas: "código previsto", "código obtido" e "corpo confere com o contrato". Preenche a coluna da previsão, só a olhar para o teu `contrato-da-api.md`.

   ```js
   await pedir("GET", "/api/filmes?genero=Animação&idade=6");
   await pedir("GET", "/api/filmes?genero=Aventura&genero=Animação");
   await pedir("POST", "/api/filmes", { numero: 9, titulo: "Wall-E", genero: "Animação", duracaoMinutos: 97, idadeMinima: 6, sessao: { dia: "13 de janeiro", hora: "15:30" } });
   await pedir("POST", "/api/filmes", { numero: 9, titulo: "Up", genero: "Animação", duracaoMinutos: 96, idadeMinima: 6, sessao: { dia: "20 de janeiro", hora: "15:30" } });
   await pedir("POST", "/api/filmes", { numero: 10, titulo: "Up", genero: "Animação", duracaoMinutos: 96, idadeMinima: 6 });
   await pedir("POST", "/api/filmes", { numero: 10, titulo: "Up", genero: "Animação", duracaoMinutos: 96, idadeMinima: 6, sessao: { dia: "20 de janeiro", hora: "15:30" }, sala: "auditório" });
   await pedir("PATCH", "/api/filmes/9", { duracaoMinutos: 98 });
   await pedir("PATCH", "/api/filmes/9", { duracaoMinutos: 400 });
   await pedir("PATCH", "/api/filmes/9", { numero: 10 });
   await pedir("PATCH", "/api/filmes/99", { titulo: "Up" });
   await pedir("DELETE", "/api/filmes/9");
   await pedir("DELETE", "/api/filmes/9");
   await pedir("PUT", "/api/filmes/1", { titulo: "Shrek 2" });
   ```

3. Faz cada pedido, pela ordem da lista, e preenche as outras duas colunas. A seguir ao pedido 7, antes do 8, faz a primeira confirmação do passo 4 no Atlas: o pedido 11 vai apagar o Wall-E.

   O que deves ver:

   | Pedido | Código | Resposta |
   | ---: | --- | --- |
   | 1 | 200 | Shrek, Toy Story e O Rei Leão |
   | 2 | 400 | `{"erro":"O parâmetro genero tem de ser um texto, e só pode vir uma vez"}` |
   | 3 | 201 | o Wall-E, com o `_id` novo |
   | 4 | 409 | `{"erro":"Já existe um filme com o número 9"}` |
   | 5 | 400 | `{"erro":"A hora da sessão é obrigatória. O dia da sessão é obrigatório"}` |
   | 6 | 400 | `{"erro":"O campo sala não é aceite"}` |
   | 7 | 200 | o Wall-E, com `"duracaoMinutos":98` |
   | 8 | 400 | `{"erro":"A duração tem no máximo 300 minutos"}` |
   | 9 | 400 | `{"erro":"O número de um filme não se altera"}` |
   | 10 | 404 | `{"erro":"Não existe o filme 99"}` |
   | 11 | 204 | sem corpo |
   | 12 | 404 | `{"erro":"Não existe o filme 9"}` |
   | 13 | 404 | `{"erro":"Rota não encontrada"}`, porque o contrato não tem `PUT` |

4. Confirma no Atlas, na coleção `filmes` da base `cinema-teste`, o que os pedidos que escrevem disseram. Faz a confirmação em dois momentos. Depois do pedido 7, o Wall-E está lá, com 98 minutos, e não há nenhum Up. Depois do pedido 11, o Wall-E já não está, e ficam os oito filmes do clube. Escreve no caderno, ao lado das linhas 3, 7 e 11, o que viste na base. Abre também o `/cartaz`: mostra os oito filmes, como no início.

5. Confirma que a cadeia de ligação não escapou. No terminal dos comandos, procura o endereço do cluster, que acaba em `mongodb.net`, em todos os ficheiros que o Git guarda:

   ```bash
   git grep -n "mongodb.net"
   ```

   O que deves ver: nada, e o terminal pronto para outro comando. O `git grep` procura nos ficheiros que o Git guarda, e o `.env` não é um deles. Se aparecer um ficheiro, a cadeia está nele: tira-a de lá, põe-na só no `.env`, e diz ao professor, porque a palavra-passe pode ter de ser mudada no Atlas. No browser, no separador "Rede", abre algumas das respostas da tabela e o código-fonte do cartaz: nenhum tem a cadeia nem a palavra-passe.

6. Se alguma linha não conferir, há um erro no código ou no contrato. Descobre qual, corrige e volta a verificar a linha, depois de correres o seed.

No fim, a tabela tem de ter pelo menos um 200, um 201, um 204, um 400, um 404 e um 409 verificados.

## Fase 10: guardar no Git

1. Corre `git status`. O que deves ver: as alterações ao `contrato-da-api.md`, ao `.env.example`, ao seed, ao modelo, ao `server.js` e às camadas, e o ficheiro novo `src/apagar-genero.js`. Não deve aparecer o `.env`.

2. Faz o commit:

   ```bash
   git add .
   git commit -m "Cinema: CRUD dos filmes, lista fechada e regras do clube, na base de teste"
   git log --oneline
   ```

   O que deves ver: o `git log` mostra o commit novo no topo, por cima dos do cinema.

## Problemas frequentes

### A aplicação fica parada uns 30 segundos e termina com um erro de ligação

O Mongoose tenta ligar-se durante 30 segundos e depois desiste. Com o Atlas, as causas mais comuns são duas. Uma é o endereço IP do computador onde estás não estar autorizado no Atlas, o que acontece quando mudas de computador ou de rede. A outra é não haver internet.

### O POST responde que o corpo tem de ser um objeto JSON, e o corpo está certo

O `req.body` ficou `undefined`. Ou falta o `app.use(express.json())`, ou está depois do `app.use` das rotas. Se fizeste o pedido sem a `pedir`, confirma também o cabeçalho `Content-Type: application/json`: sem ele, o `express.json()` não lê o corpo.

### Um erro dá uma página em HTML, com o código 500 e os caminhos dos ficheiros

O middleware de erros não existe, ou não tem os quatro parâmetros. Com três, o Express trata-o como um middleware normal, e o erro vai para o tratamento do próprio Express. Volta ao passo 4 da fase 4.

### O PATCH responde com os valores antigos, ou aceita uma idade que não existe

Faltam as opções do `findOneAndUpdate`: o `returnDocument: "after"` e o `runValidators: true`. Volta ao passo 8 da fase 6.

### Aparece no terminal um aviso sobre a opção new

O repository usa o `new: true`, que o Mongoose 9 marca como obsoleto. Troca-o por `returnDocument: "after"`, que faz o mesmo.

### Um POST sem número dá 409, com "Já existe um filme com o número undefined"

Há na base um filme sem número, criado antes das regras do schema, como o Up da paragem 3, e falta o `if (dados.numero !== undefined)` na `criarFilme` do service. Volta ao passo 1 da fase 5, e corre o seed para limpar a base de teste.

### O cartaz mostra uma linha partida, sem género nem sessão

Há na base um filme criado antes das regras do schema, como o Up da paragem 3. Corre `npm run seed`.

### A consola mostra linhas a vermelho com "Failed to load resource"

O pedido teve uma resposta de erro, como um 400, um 404 ou um 409, e o browser avisa-o a vermelho. Não é um erro do teu código. Compara o código e a mensagem que a `pedir` escreveu, na linha a seguir, com o que o contrato diz.

### A consola diz que pedir is not defined

Recarregaste a página, ou abriste outra, e a ferramenta da consola perdeu-se. Cola outra vez o bloco do passo 6 da fase 3.

### O seed diz que só corre numa base de teste

O `DB_NAME` do `.env` não acaba em `-teste`. Muda a linha para `DB_NAME=cinema-teste`.

## Desafios

1. Uma sessão por dia. O clube projeta um filme por semana, e não pode haver dois filmes com a sessão no mesmo dia. Acrescenta ao contrato e à API esta regra, ao criar e ao alterar, com o código que achares certo. Decide primeiro a camada da regra, e escreve no caderno porquê. Pista: ao alterar a sessão de um filme, o próprio filme já tem um dia, e não conta como repetido.
2. Mudar as sessões de um género. Escreve um script, como o da fase 8, que muda a hora da sessão de todos os filmes de um género para uma hora dada no comando, com o `updateMany`. Antes de alterar, mostra o que vai mudar. Pista: para mudar um campo de um documento embutido, o MongoDB escreve o caminho com um ponto, entre aspas, como `"sessao.hora"`.

## Antes de terminares

- [ ] O `contrato-da-api.md` tem as regras de cada campo e os três pedidos novos.
- [ ] O `npm run seed` reconstrói a base `cinema-teste`, recusa-se a correr na base `cinema`, e a base da ficha continua como estava.
- [ ] As respostas das paragens estão no caderno, e as duas opções do `findOneAndUpdate`, com o nome e o valor, também.
- [ ] A tabela da fase 9 está verificada, e as linhas que escrevem estão confirmadas na base.
- [ ] O `git grep -n "mongodb.net"` não encontra nada, e o `git log --oneline` mostra o commit deste laboratório.
- [ ] Consegues explicar, por palavras tuas, em que camada fica cada regra do clube, e porquê. São três: a forma do pedido, os valores de cada campo e o número repetido.

O professor vai pedir-te que escolhas um pedido da tabela da fase 9 e expliques o caminho dele pelas camadas, até à base, e o que confirmaste no Atlas.

![Rodapé](../imagens/rodape.png)
