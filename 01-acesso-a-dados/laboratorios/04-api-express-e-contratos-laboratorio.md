![Cabeçalho](../../imagens/cabecalho.png)

# Laboratório: API Express e contratos

## O que vais construir

Vais fazer o passo 2 de Fechado na escola. No fim, o pedido `/api/cenas/corredor/escolhas/3` faz a escolha 3 no corredor e responde com a cena seguinte, e jogas uma partida inteira só com pedidos. Pelo caminho, escreves o contrato da API e separas o servidor em camadas, sem mudar nenhuma resposta:

```text
fechado-na-escola/
├── contrato-da-api.md                 o contrato: o que a API aceita e o que responde
├── package.json                       não muda
└── src/
    ├── server.js                      o arranque, que monta as rotas
    ├── seed.js                        não muda
    ├── db/
    │   └── mongoose.js                não muda
    ├── models/
    │   └── cena.model.js              não muda
    ├── repositories/
    │   └── cenas.repository.js        o acesso às cenas na base de dados
    ├── services/
    │   └── cenas.service.js           as regras do jogo
    ├── controllers/
    │   └── cenas.controller.js        o HTTP das cenas
    └── rotas/
        └── cenas.rotas.js             que pedido vai para que função
```

1. [Fase 1: O contrato diz o que a API aceita e o que responde](#fase-1-o-contrato-diz-o-que-a-api-aceita-e-o-que-responde)
2. [Fase 2: O que chega no pedido verifica-se à entrada](#fase-2-o-que-chega-no-pedido-verifica-se-à-entrada)
3. [Fase 3: A primeira versão verificada fica de referência](#fase-3-a-primeira-versão-verificada-fica-de-referência)
4. [Fase 4: As camadas ligam-se com `export` e `import`](#fase-4-as-camadas-ligam-se-com-export-e-import)
5. [Fase 5: O service fica com as regras, sem `req` nem `res`](#fase-5-o-service-fica-com-as-regras-sem-req-nem-res)
6. [Fase 6: O controller verifica o pedido e escolhe a resposta](#fase-6-o-controller-verifica-o-pedido-e-escolhe-a-resposta)
7. [Fase 7: As rotas ficam num router, que o `server.js` monta](#fase-7-as-rotas-ficam-num-router-que-o-serverjs-monta)
8. [Fase 8: O middleware final fica depois de todas as rotas](#fase-8-o-middleware-final-fica-depois-de-todas-as-rotas)
9. [Fase 9: Cada linha do contrato verifica-se com um pedido](#fase-9-cada-linha-do-contrato-verifica-se-com-um-pedido)
10. [Fase 10: Guardar no Git](#fase-10-guardar-no-git)

## O que precisas

- O projeto do passo 1, com o commit desse passo. Se não o tiveres, copia a pasta [fechado-na-escola-passo-01](../../exemplos/acesso-a-dados/fechado-na-escola-passo-01/README.md) dos exemplos, sem o `README.md`. Faz o `npm install` e o `.env` do "Como correr" dela, sem ligar o jogo. Depois guarda-a no Git como no passo 1: `git init`, `git config user.name "O teu nome"`, `git config user.email "o teu email da escola"`, `git add .` e `git commit -m "Passo 1"`.
- O Node.js 22 ou mais recente: confirma com `node --version`.
- O teu cluster do Atlas e internet: o jogo só arranca ligado à base de dados.
- O browser, com o separador "Rede" (ou "Network") das ferramentas de programador (F12; no Mac, Cmd+Option+I).

## Preparar o projeto

1. Repõe as cenas na base de dados, porque as tabelas deste laboratório contam com as onze cenas do seed. No terminal do Visual Studio Code, na pasta do jogo, corre:

   ```bash
   npm run seed
   ```

   O que deves ver: `Ligada à base de dados fechado-na-escola`, uma linha com as cenas apagadas e `Inseridas 11 cenas`. O seed apaga as cenas e volta a inseri-las, por isso podes corrê-lo as vezes que quiseres. Se aparecer `O seed falhou`, vê [O seed ou o jogo não chegam à base de dados](#o-seed-ou-o-jogo-não-chegam-à-base-de-dados).

2. No mesmo terminal, liga o jogo e deixa-o ligado até ao fim:

   ```bash
   npm run dev
   ```

   O que deves ver: `Ligada à base de dados fechado-na-escola` e `Fechado na escola em http://localhost:3000`. Com o `--watch`, o jogo reinicia sozinho sempre que guardas um ficheiro que ele já usa, e é neste terminal, o primeiro, que aparecem os erros.

3. Abre um segundo terminal, para os comandos, no menu "Terminal", com "New Terminal". Abre também na pasta do jogo, e passas de um terminal para o outro na lista à direita do painel do terminal.

4. No browser, abre as ferramentas de programador no separador "Rede" ("Network", com o browser em inglês) e confirma que "Disable cache" (desativar a cache) está marcado, como no passo 1. É neste separador que vês o código de estado de cada resposta. Sem a cache desativada, um pedido que já fizeste pode voltar com o código 304, e não com o 200 que as tabelas dizem.

Se continuas o laboratório numa aula seguinte, repete estes quatro passos e retoma na fase em que paraste.

## Fase 1: O contrato diz o que a API aceita e o que responde

Escreves o contrato da API do jogo antes de qualquer código novo: os três pedidos que o jogo já tem e o pedido novo, o da escolha. O contrato obriga as duas partes, a API a responder como ele diz e quem a usa a pedir assim. Rever: [O contrato diz o que a API aceita e o que responde](../04-api-express-e-contratos.md#o-contrato-diz-o-que-a-api-aceita-e-o-que-responde).

1. Na raiz do projeto, ao lado do `package.json`, cria o ficheiro `contrato-da-api.md`. É um ficheiro em Markdown, o formato dos README e destes laboratórios. Um título começa por `#`. Uma tabela tem uma linha de texto por cada linha, com `|` entre as colunas, e logo a seguir à dos títulos vem uma linha só com traços. Um bloco de JSON fica entre duas linhas de três acentos graves, a primeira com a palavra `json`.

2. Escreve no contrato a primeira parte, com as regras que valem para todos os pedidos:

   ~~~markdown
   # Contrato da API do jogo Fechado na escola

   Todas as respostas da API, de sucesso e de erro, são JSON. Os pedidos e as respostas que aqui não estão não fazem parte da API.

   ## Formato dos erros

   Todas as respostas de erro têm esta forma, com uma mensagem para quem joga:

   ```json
   { "erro": "Não existe a cena cave" }
   ```

   ## A cena

   Cada cena, nas respostas, tem esta forma:

   ```json
   { "_id": "6aea79a15ae42ad7f4bcc74e", "codigo": "porta-principal", "titulo": "A porta principal", "texto": "A porta está fechada à chave, e a luz do alarme pisca a vermelho ao lado do puxador. Se a forçares, o alarme toca.", "final": false, "escolhas": [{ "texto": "Forçar a porta", "destino": "fim-alarme" }, { "texto": "Voltar ao corredor", "destino": "corredor" }], "__v": 0 }
   ```

   | Campo | Tipo | Significado |
   | --- | --- | --- |
   | `_id` | texto | identificador que o MongoDB deu ao documento |
   | `codigo` | texto | código da cena no jogo, como `corredor`; é por ele que se pede uma cena |
   | `titulo` | texto | título da cena |
   | `texto` | texto | o bocado da história que o jogador lê |
   | `final` | booleano | `true` numa cena que acaba a partida |
   | `escolhas` | lista | as escolhas da cena, pela ordem em que o jogador as vê; vazia numa cena final |
   | `escolhas[].texto` | texto | o que o jogador lê na escolha |
   | `escolhas[].destino` | texto | o código da cena para onde a escolha leva |
   | `__v` | inteiro | número de versão que o Mongoose acrescenta |
   ~~~

   A frase do início e o formato dos erros dizem que todas as respostas são JSON e que todos os erros têm a mesma forma, com a mensagem em `erro`. Assim, quem usa a API mostra sempre o mesmo campo ao jogador, seja qual for o pedido que falhou. Rever: [Todos os erros da API têm a mesma forma](../04-api-express-e-contratos.md#todos-os-erros-da-api-têm-a-mesma-forma).

   A cena tem a forma do documento que o seed pôs na base. O `_id` do exemplo é o de outra base de dados, e o teu é diferente.

3. A seguir, no fim do ficheiro e separados por uma linha em branco, acrescenta os três pedidos que o jogo já tem desde o passo 1:

   ~~~markdown
   ## GET /api/estado

   Confirma que o servidor está ligado. Sem parâmetros.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | sempre | `{ "estado": "ok", "aplicacao": "Fechado na escola" }` |

   ## GET /api/cenas

   Lista todas as cenas da história. Sem parâmetros.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | sempre | lista de cenas, possivelmente vazia |

   ## GET /api/cenas/:codigo

   Mostra uma cena.

   | Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
   | --- | --- | --- | --- | --- |
   | `codigo` | rota | texto | sim | o código de uma cena |

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | existe uma cena com esse código | a cena |
   | 404 | não existe nenhuma cena com esse código | erro |
   ~~~

   Cada pedido tem uma tabela com os parâmetros, quando os há, e outra com todas as respostas que pode dar. Cada resposta tem o código e o caso em que acontece. Rever: [No contrato, cada pedido tem os parâmetros e as respostas](../04-api-express-e-contratos.md#no-contrato-cada-pedido-tem-os-parâmetros-e-as-respostas).

4. Acaba o contrato com o pedido novo, que o código ainda não tem, e com a resposta a qualquer outro pedido:

   ~~~markdown
   ## GET /api/cenas/:codigo/escolhas/:numero

   Faz uma escolha numa cena e mostra a cena para onde ela leva. As escolhas numeram-se a partir de 1, pela ordem da lista `escolhas`.

   | Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
   | --- | --- | --- | --- | --- |
   | `codigo` | rota | texto | sim | o código de uma cena |
   | `numero` | rota | inteiro | sim | 1 ou mais |

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | a cena existe e tem essa escolha | a cena para onde a escolha leva |
   | 400 | `numero` não é um número inteiro maior do que 0 | erro |
   | 404 | não existe nenhuma cena com esse código | erro |
   | 404 | a cena não tem a escolha com esse número; uma cena final não tem nenhuma | erro |

   ## Qualquer outro pedido

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 404 | nenhuma rota da API responde ao pedido | `{ "erro": "Rota não encontrada" }` |
   ~~~

   O número da escolha começa no 1 porque é esse o número que o jogador vê. Passar do número à posição na lista, que no JavaScript começa no 0, é trabalho do servidor, e escreve-lo na fase 2.

5. Pensa: o jogador está no corredor e escolhe "Subir as escadas", a terceira escolha. Há duas maneiras de passar à cena seguinte. Na do passo 1, quem joga lê o destino da escolha, `escadas`, e pede `/api/cenas/escadas`. Na do contrato, pede `/api/cenas/corredor/escolhas/3`, e é o servidor que vê para onde leva a escolha 3. Porque é que o contrato escolheu a segunda?

   A resposta: assim, é o servidor, e não quem joga, que diz para onde leva cada escolha. A regra do jogo fica num só sítio, junto das cenas, e quem mostra as cenas só precisa de saber onde o jogador está e em que número clicou. O servidor confirma que a escolha existe naquela cena e recusa um número que não serve. E, se um dia uma escolha depender de uma regra, como só se entrar na sala 12 com a chave, é no servidor que essa regra entra.

6. Antes de abrires, prevê o que responde agora `http://localhost:3000/api/cenas/corredor/escolhas/3`, que o contrato promete e o código ainda não tem. Depois abre-o no browser.

   O que deves ver: `{"erro":"Rota não encontrada"}`, com o código 404. Nenhuma rota do teu `server.js` serve este caminho, porque o `:codigo` de `/api/cenas/:codigo` só apanha um bocado do caminho, sem barras. O pedido chega ao middleware final, que já tens desde o passo 1.

### Paragem 1

O `contrato-da-api.md` está na raiz do projeto, com as regras de todos os pedidos, a forma da cena e as respostas de cada pedido.

Pensa antes de continuares: o contrato não diz em que ficheiro está cada rota, nem como o servidor procura uma cena. Porquê? A resposta: o contrato diz o que a API promete a quem a usa. Como ela o cumpre por dentro, decide-o quem a escreve, e pode mudar sem o contrato mudar. É o que acontece nas fases 4 a 7: o código muda de ficheiro, e nenhuma resposta muda.

## Fase 2: O que chega no pedido verifica-se à entrada

Acrescentas a rota da escolha ao `server.js`, com tudo no mesmo ficheiro, como no passo 1. O número da escolha chega como texto e verifica-se antes de se ir à base de dados, como o `id` da rota de detalhe em Sistemas de Informação. Rever: [O que chega no pedido verifica-se à entrada](../04-api-express-e-contratos.md#o-que-chega-no-pedido-verifica-se-à-entrada).

1. Em `src/server.js`, a seguir à rota de uma cena, a `app.get("/api/cenas/:codigo", ...)`, e antes do middleware final, acrescenta esta rota:

   ```js
   // Uma escolha numa cena: GET /api/cenas/corredor/escolhas/3. Responde com a
   // cena para onde a escolha leva. Quem pede diz só o número da escolha: para
   // onde ela leva, di-lo o destino guardado na cena, e quem o lê é o servidor.
   app.get("/api/cenas/:codigo/escolhas/:numero", async (req, res) => {
     const codigo = req.params.codigo;
     const numero = Number(req.params.numero); // chega como texto, "3", e passa a número
     // O número verifica-se antes de ir à base de dados: um número que não
     // serve é um pedido mal feito, seja qual for a cena.
     if (!Number.isInteger(numero) || numero < 1) {
       res.status(400).json({ erro: "O número da escolha tem de ser um número inteiro maior do que 0" });
       return;
     }
     const encontradas = await Cena.find({ codigo: codigo });
     if (encontradas.length === 0) {
       res.status(404).json({ erro: `Não existe a cena ${codigo}` });
       return;
     }
     // A lista das escolhas começa no 0: a escolha 1 está na posição 0.
     // Uma cena final não tem escolhas, e qualquer número fica de fora.
     const escolha = encontradas[0].escolhas[numero - 1];
     if (escolha === undefined) {
       res.status(404).json({ erro: `A cena ${codigo} não tem a escolha ${numero}` });
       return;
     }
     const destinos = await Cena.find({ codigo: escolha.destino });
     res.json(destinos[0]);
   });
   ```

   A rota segue a tabela de respostas do contrato: primeiro o 400, depois os dois 404, cada um com o seu `return`, e no fim a cena do destino. O `Number.isInteger` recusa o `NaN` de `"abc"` e o 1.5 de `"1.5"`, e uma posição que a lista não tem, como a 5 numa lista de três, dá `undefined`.

2. Guarda o ficheiro. O que deves ver: no primeiro terminal, o jogo reinicia e volta a escrever `Ligada à base de dados fechado-na-escola` e `Fechado na escola em http://localhost:3000`. Se aparecer um erro, vê [O jogo reinicia e para](#o-jogo-reinicia-e-para-com-failed-running-srcserverjs).

3. Prevê que cena aparece em `http://localhost:3000/api/cenas/corredor/escolhas/3`, e depois abre-o.

   O que deves ver: a cena com o código `escadas` e o título "O primeiro andar". No seed, a terceira escolha do corredor é "Subir as escadas", com o destino `escadas`. O número 3 passou à posição 2 da lista, e o servidor leu lá o destino.

### Paragem 2

A escolha funciona na primeira versão, com tudo no `server.js`, que cresceu quase 30 linhas.

Pensa antes de continuares: a rota verifica o número antes de procurar a cena. O que responde `/api/cenas/cave/escolhas/abc`, em que nem a cena existe nem o número serve? A resposta: 400, com a mensagem do número, e a rota nem chega a perguntar à base de dados pela cena `cave`. Um número que não serve é um pedido mal feito, seja qual for a cena. Com as verificações pela ordem contrária, a resposta era 404, com `Não existe a cena cave`.

## Fase 3: A primeira versão verificada fica de referência

Verificas a primeira versão contra o contrato, pedido a pedido, e a tabela desta fase fica de referência para o resto do laboratório. Nas fases 4 a 7, o código muda de ficheiro, e as respostas têm de continuar exatamente estas. Rever: [A primeira versão verificada fica de referência](../04-api-express-e-contratos.md#a-primeira-versão-verificada-fica-de-referência).

1. Faz os pedidos da tabela, com o separador "Rede" aberto. Começam todos por `http://localhost:3000`, e cada um aparece numa linha da "Rede", com o código de estado da resposta. Antes de cada um, prevê de cabeça o código e a resposta, só com o contrato e o código à frente, e depois compara.

   O que deves ver:

   | Pedido | Código | Resposta |
   | --- | --- | --- |
   | `/api/estado` | 200 | `{"estado":"ok","aplicacao":"Fechado na escola"}` |
   | `/api/cenas` | 200 | as onze cenas |
   | `/api/cenas/inicio` | 200 | a cena "A biblioteca às escuras" |
   | `/api/cenas/cave` | 404 | `{"erro":"Não existe a cena cave"}` |
   | `/api/cenas/corredor/escolhas/3` | 200 | a cena `escadas`, "O primeiro andar" |
   | `/api/cenas/inicio/escolhas/2` | 200 | a cena `carregador`, "Atrás do balcão" |
   | `/api/cenas/corredor/escolhas/abc` | 400 | `{"erro":"O número da escolha tem de ser um número inteiro maior do que 0"}` |
   | `/api/cenas/corredor/escolhas/0` | 400 | o mesmo erro |
   | `/api/cenas/cave/escolhas/1` | 404 | `{"erro":"Não existe a cena cave"}` |
   | `/api/cenas/corredor/escolhas/4` | 404 | `{"erro":"A cena corredor não tem a escolha 4"}` |
   | `/api/cenas/fim-alarme/escolhas/1` | 404 | `{"erro":"A cena fim-alarme não tem a escolha 1"}` |
   | `/api/cena` | 404 | `{"erro":"Rota não encontrada"}` |

2. Repara em duas linhas: `/api/cenas/corredor/escolhas/abc` dá 400, e `/api/cenas/corredor/escolhas/4` dá 404. Porque é que não dão as duas 400, se nenhuma das duas escolhas existe?

   A resposta: `abc` nem sequer é um número, e por isso o pedido está mal feito: 400. O 4 é um número de escolha válido, e o pedido está bem feito, mas o corredor só tem três escolhas, e o que se pediu não existe: 404. A cena `fim-alarme` dá 404 pela mesma razão, porque uma cena final tem a lista das escolhas vazia.

### Paragem 3

A primeira versão responde ao que o contrato diz em todas as linhas da tabela.

Pensa antes de continuares: a rota da escolha mistura três tipos de trabalho. O HTTP é ler o pedido e escolher a resposta; as regras do jogo valem com ou sem HTTP; e os dados são as consultas à base. A que tipo pertence cada parte da rota? A resposta:

| Parte da rota da escolha | Tipo | Porquê |
| --- | --- | --- |
| Ler o `codigo` e o `numero` do `req.params` | HTTP | vêm no endereço do pedido |
| Converter e verificar o número, e responder 400 | HTTP | é o pedido que está mal feito |
| `Cena.find({ codigo: codigo })` | dados | usa o modelo e a linguagem do MongoDB |
| Responder 404 quando não há cena ou escolha | HTTP | é escolher o código da resposta |
| A escolha N está na posição N - 1, e uma cena final não tem escolhas | regra do jogo | é assim que o jogo funciona, com ou sem HTTP |
| `Cena.find({ codigo: escolha.destino })` | dados | a mesma consulta, outra vez |
| `res.json(...)` | HTTP | é a resposta |

Os três tipos alternam na mesma função. A consulta pelo código está escrita três vezes no ficheiro: uma na rota de uma cena e duas na rota da escolha. As fases 4 a 7 separam-nos, cada tipo no seu ficheiro, de baixo para cima: primeiro os dados, depois a regra, depois o HTTP e, por fim, as rotas. Rever: [O ficheiro único mistura HTTP, regras e dados](../04-api-express-e-contratos.md#o-ficheiro-único-mistura-http-regras-e-dados).

## Fase 4: As camadas ligam-se com `export` e `import`

Crias o repository, a camada de baixo, com a consulta pelo código que está três vezes no `server.js`, e ligas o `server.js` a ele. Cada camada é um ficheiro que exporta as suas funções com `export`, e a camada de cima pede-as com `import`. Rever: [As camadas ligam-se com `export` e `import`](../04-api-express-e-contratos.md#as-camadas-ligam-se-com-export-e-import) e [O servidor divide-se em quatro camadas](../03-arquitetura-e-setup-node.md#o-servidor-divide-se-em-quatro-camadas).

1. Dentro de `src`, cria a pasta `repositories` e, nela, o ficheiro `cenas.repository.js`, com este conteúdo:

   ```js
   // src/repositories/cenas.repository.js: o acesso às cenas na base de dados.
   // Das camadas do jogo, é a única que usa o modelo Cena e que escreve os
   // filtros na linguagem do MongoDB.
   import { Cena } from "../models/cena.model.js";

   /**
    * Procura todas as cenas da história, pela ordem em que estão na base.
    * @returns {Promise<object[]>} as cenas, possivelmente nenhuma
    */
   export async function procurarTodas() {
     const cenas = await Cena.find({});
     return cenas;
   }

   /**
    * Procura uma cena pelo código, no campo codigo, e não pelo _id.
    * @param {string} codigo o código da cena, como "corredor"
    * @returns {Promise<object | null>} a cena, ou null se não existir
    */
   export async function procurarPorCodigo(codigo) {
     // O find devolve sempre uma lista. Como não há duas cenas com o mesmo
     // código, a lista vem com uma cena, ou vazia.
     const encontradas = await Cena.find({ codigo: codigo });
     if (encontradas.length === 0) {
       return null;
     }
     return encontradas[0];
   }
   ```

   As duas funções têm `export`, porque o `server.js` vai pedi-las, e o caminho do `import` sobe com `..` de `src/repositories/` para `src/`. Nos comentários `/** */`, o `Promise<object[]>` quer dizer que a lista chega com `await`, e o `object | null`, que chega uma cena ou `null`.

   O que deves ver: nada de novo no primeiro terminal. Nenhum ficheiro importa ainda o repository, e por isso o jogo não reinicia.

2. Liga o `server.js` ao repository: substitui todo o `src/server.js` por esta versão.

   ```js
   // src/server.js: o servidor do jogo Fechado na escola.
   // Uma API em JSON, com as cenas da história. As rotas ainda estão todas neste
   // ficheiro, e as consultas à base de dados já estão no repository.
   import express from "express";
   import { ligarBaseDeDados } from "./db/mongoose.js";
   import { procurarTodas, procurarPorCodigo } from "./repositories/cenas.repository.js";

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

   // Todas as cenas da história, pedidas ao repository.
   app.get("/api/cenas", async (req, res) => {
     const cenas = await procurarTodas();
     res.json(cenas);
   });

   // Uma cena: GET /api/cenas/corredor. O repository devolve null se não existir.
   app.get("/api/cenas/:codigo", async (req, res) => {
     const codigo = req.params.codigo;
     const cena = await procurarPorCodigo(codigo);
     if (cena === null) {
       res.status(404).json({ erro: `Não existe a cena ${codigo}` });
       return;
     }
     res.json(cena);
   });

   // Uma escolha numa cena: GET /api/cenas/corredor/escolhas/3. Responde com a
   // cena para onde a escolha leva.
   app.get("/api/cenas/:codigo/escolhas/:numero", async (req, res) => {
     const codigo = req.params.codigo;
     const numero = Number(req.params.numero); // chega como texto, "3", e passa a número
     if (!Number.isInteger(numero) || numero < 1) {
       res.status(400).json({ erro: "O número da escolha tem de ser um número inteiro maior do que 0" });
       return;
     }
     const cena = await procurarPorCodigo(codigo);
     if (cena === null) {
       res.status(404).json({ erro: `Não existe a cena ${codigo}` });
       return;
     }
     // A lista das escolhas começa no 0: a escolha 1 está na posição 0.
     // Uma cena final não tem escolhas, e qualquer número fica de fora.
     const escolha = cena.escolhas[numero - 1];
     if (escolha === undefined) {
       res.status(404).json({ erro: `A cena ${codigo} não tem a escolha ${numero}` });
       return;
     }
     const seguinte = await procurarPorCodigo(escolha.destino);
     res.json(seguinte);
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

   Mudaram os comentários e o terceiro `import`, que pede ao repository as duas funções em vez do modelo `Cena`. Nas três rotas das cenas, cada `Cena.find` deu lugar a uma chamada ao repository, e o `encontradas.length === 0`, ao `cena === null`.

3. Guarda o `server.js`. O que deves ver: o jogo reinicia, como na fase 2. É a primeira vez que o `server.js` carrega o repository, e por isso um erro de `import` apareceria agora. Abre `/api/cenas/inicio`, `/api/cenas/corredor/escolhas/3` e `/api/cenas/cave`, que dão o mesmo que na tabela da fase 3.

4. Provoca um erro de propósito: no `server.js`, no `import` do repository, apaga o `.js` do fim do caminho e guarda.

   O que deves ver: várias linhas, e no meio delas uma que começa por `Error [ERR_MODULE_NOT_FOUND]: Cannot find module` (não foi possível encontrar o módulo). Segue-se o caminho de `src/repositories/cenas.repository`, sem o `.js`, e `imported from` (importado por), com o caminho do `server.js`: o ficheiro que o Node não encontrou e quem o pediu. As linhas com `node:internal` e as que começam por `at` são de dentro do Node, e no fim o `--watch` escreve `Failed running 'src/server.js'` e fica à espera.

   Nos módulos do Node, a extensão é obrigatória nos caminhos dos teus ficheiros. Repõe o `.js` e guarda, e o jogo volta a arrancar sozinho.

### Paragem 4

O `server.js` já não faz nenhuma consulta à base de dados: pede as cenas ao repository, e as respostas não mudaram.

Pensa antes de continuares: que ficheiros do projeto importam agora o modelo `Cena`? A resposta: o repository e o seed. O repository é a camada da aplicação que fala com a base de dados. O seed não faz parte da aplicação: corre à parte, com o `npm run seed`, para pôr as cenas na base.

## Fase 5: O service fica com as regras, sem `req` nem `res`

Crias o service, com a regra da escolha que está no meio da rota, e o `server.js` passa a usá-lo em vez do repository. O service recebe valores simples e devolve valores simples, sem `req` nem `res` e sem saber que base de dados está por baixo. Rever: [O service fica com as regras, sem `req` nem `res`](../04-api-express-e-contratos.md#o-service-fica-com-as-regras-sem-req-nem-res).

1. Cria a pasta `src/services` e, nela, o ficheiro `cenas.service.js`, com este conteúdo:

   ```js
   // src/services/cenas.service.js: as regras do jogo sobre as cenas.
   // Recebe valores simples e devolve valores simples. Não sabe nada de HTTP,
   // nem de MongoDB: pede as cenas ao repository.
   import { procurarTodas, procurarPorCodigo } from "../repositories/cenas.repository.js";

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
   ```

   A `listarCenas` e a `obterCena` só chamam o repository e devolvem o que ele dá. Existem para a camada de cima falar só com o service, porque cada camada conhece só a de baixo. A `cenaSeguinte` recebe a cena, e não o código, porque quem a chama já a foi buscar para saber se ela existia. Assim, a mesma cena não se procura duas vezes.

2. Passa o `server.js` a usar o service, com esta versão do ficheiro inteiro:

   ```js
   // src/server.js: o servidor do jogo Fechado na escola.
   // Uma API em JSON, com as cenas da história. As rotas ainda estão todas neste
   // ficheiro, e as regras do jogo estão no service, que pede as cenas ao repository.
   import express from "express";
   import { ligarBaseDeDados } from "./db/mongoose.js";
   import { listarCenas, obterCena, cenaSeguinte } from "./services/cenas.service.js";

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

   // Todas as cenas da história, pedidas ao service.
   app.get("/api/cenas", async (req, res) => {
     const cenas = await listarCenas();
     res.json(cenas);
   });

   // Uma cena: GET /api/cenas/corredor. O service devolve null se não existir.
   app.get("/api/cenas/:codigo", async (req, res) => {
     const codigo = req.params.codigo;
     const cena = await obterCena(codigo);
     if (cena === null) {
       res.status(404).json({ erro: `Não existe a cena ${codigo}` });
       return;
     }
     res.json(cena);
   });

   // Uma escolha numa cena: GET /api/cenas/corredor/escolhas/3. Responde com a
   // cena para onde a escolha leva.
   app.get("/api/cenas/:codigo/escolhas/:numero", async (req, res) => {
     const codigo = req.params.codigo;
     const numero = Number(req.params.numero); // chega como texto, "3", e passa a número
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

   O terceiro `import` pede agora as três funções ao service, e o `server.js` deixa de conhecer o repository. Na rota da escolha, as linhas da posição e do destino deram lugar à `cenaSeguinte`, com o 404 quando ela devolve `null`. O que sobra nas três rotas é só HTTP: ler o pedido, verificar o número, chamar o service e escolher a resposta.

3. Guarda e confirma no primeiro terminal que o jogo reiniciou. Abre `/api/cenas/corredor/escolhas/3`, `/api/cenas/corredor/escolhas/4` e `/api/cenas/fim-alarme/escolhas/1`, e compara cada resposta com a sua linha da tabela da fase 3.

4. Provoca outro erro de propósito: no `cenas.service.js`, no `import`, muda `procurarPorCodigo` para `procurarCena` e guarda.

   O que deves ver: `SyntaxError: The requested module '../repositories/cenas.repository.js' does not provide an export named 'procurarCena'` (o módulo pedido não exporta nenhum nome `procurarCena`). Por cima, a mensagem mostra a linha do `import`, com o nome assinalado. O ficheiro existe, mas as chavetas pedem um nome exato, e esse nome não está exportado. Repõe `procurarPorCodigo` e guarda, e o jogo volta a arrancar.

### Paragem 5

A regra da escolha está num só sítio, o service, e as respostas continuam as da fase 3.

Pensa antes de continuares: se as cenas passassem para uma base de dados MariaDB, como as de Sistemas de Informação, que ficheiros do projeto mudavam? A resposta: os que usam o Mongoose, isto é, o repository, a ligação, o modelo e o seed. O service não mudava, porque não sabe que base de dados está por baixo: pede uma cena pelo código e recebe uma cena ou `null`. É para isso que o repository existe.

## Fase 6: O controller verifica o pedido e escolhe a resposta

Mudas as funções das rotas para o controller, onde ganham nome, porque depois da fase 5 já só fazem HTTP. O controller lê e verifica o pedido, chama o service e escolhe a resposta, e é ele que transforma o `null` do service num 404. Rever: [O controller verifica o pedido e escolhe a resposta](../04-api-express-e-contratos.md#o-controller-verifica-o-pedido-e-escolhe-a-resposta).

1. Cria a pasta `src/controllers` e, nela, o ficheiro `cenas.controller.js`, com este conteúdo:

   ```js
   // src/controllers/cenas.controller.js: a ponte entre o HTTP e o service.
   // Lê e verifica o que vem no pedido, chama o service e escolhe a resposta,
   // sempre em JSON, como diz o contrato.
   import { listarCenas, obterCena, cenaSeguinte } from "../services/cenas.service.js";

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
   ```

   Cada função exportada é a função de uma das rotas do teu `server.js`, com as mesmas linhas, agora com nome. O comentário por cima diz que pedido trata. A `escolher` faz as verificações pela ordem da primeira versão: o número (400), a cena (404) e a escolha (404).

2. Troca as rotas do `server.js` pelas funções do controller, com esta versão do ficheiro:

   ```js
   // src/server.js: o servidor do jogo Fechado na escola.
   // Uma API em JSON, com as cenas da história. As rotas ainda estão neste
   // ficheiro, e as funções que respondem a cada uma estão no controller.
   import express from "express";
   import { ligarBaseDeDados } from "./db/mongoose.js";
   import { listar, obter, escolher } from "./controllers/cenas.controller.js";

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

   // As rotas das cenas. Cada uma passa ao Express a função do controller que
   // responde ao pedido, sem a chamar: é o Express que a chama quando o pedido chega.
   app.get("/api/cenas", listar);
   app.get("/api/cenas/:codigo", obter);
   app.get("/api/cenas/:codigo/escolhas/:numero", escolher);

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

   As três rotas das cenas, que tinham quase 40 linhas, ficaram em três: o método, o caminho e o nome da função que responde. Lidas de cima para baixo, são o índice da API das cenas.

3. Guarda, confirma que o jogo reiniciou e abre `/api/cenas`, `/api/cenas/inicio` e `/api/cenas/corredor/escolhas/abc`. O que deves ver: as respostas que a tabela da fase 3 dá a estes três pedidos.

### Paragem 6

O HTTP das cenas está num só ficheiro, o controller, e o `server.js` diz só que função responde a cada pedido.

Pensa antes de continuares: no `server.js` escreve-se `listar`, e não `listar()`. O que acontecia com os parênteses? A resposta: a função era chamada logo no arranque, sem nenhum pedido, e o Express recebia o resultado dela, e não a função. O jogo nem arrancava, e o terminal mostrava `TypeError: argument handler must be a function` (o argumento que trata o pedido tem de ser uma função).

## Fase 7: As rotas ficam num router, que o `server.js` monta

Juntas as três rotas das cenas num router, num ficheiro próprio, e o `server.js` fica só com o arranque. O router agrupa as rotas que começam por `/api/cenas`, e o `server.js` monta-o nesse caminho com um só `app.use`. Rever: [As rotas ficam num router, que o `server.js` monta](../04-api-express-e-contratos.md#as-rotas-ficam-num-router-que-o-serverjs-monta).

1. Cria a pasta `src/rotas` e, nela, o ficheiro `cenas.rotas.js`, com este conteúdo:

   ```js
   // src/rotas/cenas.rotas.js: que pedido da API das cenas vai para que função do controller.
   // Os caminhos são relativos ao sítio onde este router é montado, em server.js:
   // "/" quer dizer /api/cenas, e "/:codigo" quer dizer /api/cenas/:codigo.
   import express from "express";
   import { listar, obter, escolher } from "../controllers/cenas.controller.js";

   const router = express.Router();

   router.get("/", listar);
   router.get("/:codigo", obter);
   router.get("/:codigo/escolhas/:numero", escolher);

   export default router;
   ```

   Cada `router.get` liga um caminho a uma função, como os `app.get` da fase 6, mas sem o `/api/cenas`. O `export default` exporta uma só coisa, sem nome: quem a importa escreve-a sem chavetas e escolhe o nome.

2. Deixa no `server.js` só o arranque, com esta versão, a última deste passo:

   ```js
   // src/server.js: o ponto de arranque do jogo Fechado na escola.
   // Cria a aplicação Express, monta as rotas da API, liga-se à base de dados
   // e só depois à porta. As regras e as consultas estão nas camadas.
   import express from "express";
   import { ligarBaseDeDados } from "./db/mongoose.js";
   import cenasRotas from "./rotas/cenas.rotas.js";

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

   // Todos os pedidos começados por /api/cenas seguem para o router das cenas.
   app.use("/api/cenas", cenasRotas);

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

   O `import cenasRotas` não tem chavetas, por causa do `export default`, e as três rotas das cenas deram lugar a um só `app.use`, com o caminho onde o router se monta. Fora a ligação no arranque, nenhuma linha deste ficheiro fala com a base de dados.

3. Guarda e confirma que o jogo reiniciou. É a primeira vez que o `server.js` carrega a cadeia toda das camadas:

   ```mermaid
   flowchart TD
       SV["server.js"] -->|importa| R["rotas/cenas.rotas.js"]
       R -->|importa| C["controllers/cenas.controller.js"]
       C -->|importa| S["services/cenas.service.js"]
       S -->|importa| RE["repositories/cenas.repository.js"]
       RE -->|importa| M["models/cena.model.js"]
   ```

   O `server.js` importa as rotas, que importam o controller, que importa o service, que importa o repository. Das camadas, só o repository importa o modelo. Abre `/api/estado`, `/api/cenas/inicio` e `/api/cenas/corredor/escolhas/3`: as respostas não mudaram, e agora passam pelas camadas todas.

4. Provoca o último erro de propósito: no `server.js`, muda `import cenasRotas from` para `import { cenasRotas } from` e guarda. Antes de olhares para o terminal, prevê: o ficheiro do router existe, e então a mensagem vai ser parecida com qual das duas que já viste?

   O que deves ver: `SyntaxError: The requested module './rotas/cenas.rotas.js' does not provide an export named 'cenasRotas'`, parecida com a da fase 5. O router foi exportado com `export default`, sem nome, e as chavetas pedem um export com o nome `cenasRotas`, que não existe. Repõe o `import` sem chavetas e guarda.

### Paragem 7

A API responde pelas camadas, e cada ficheiro tem um só trabalho.

Pensa antes de continuares: dentro do router, o caminho de uma cena é `"/:codigo"`. Porque é que o terminal escreve `GET /api/cenas/inicio`, com o caminho todo, e não `GET /inicio`? A resposta: quem escreve a linha é o middleware de registo, que está no `server.js`, antes do `app.use` do router. Vê o pedido antes de ele chegar ao router, ainda com o caminho completo. Só dentro do router é que o `/api/cenas` deixa de contar.

## Fase 8: O middleware final fica depois de todas as rotas

Mudas de propósito o `app.use` do router para depois do middleware final, para veres porque é que este fica no fim do `server.js`. O middleware final responde a todos os pedidos que lhe chegam e não os passa à frente. Rever: [O middleware final fica depois de todas as rotas](../04-api-express-e-contratos.md#o-middleware-final-fica-depois-de-todas-as-rotas).

1. Abre `http://localhost:3000/api/cenas/corredor/escolhas`, sem o número.

   O que deves ver: o 404 do middleware final, com `{"erro":"Rota não encontrada"}`. O pedido começa por `/api/cenas` e entra no router, mas nenhuma rota dele serve. O `"/:codigo"` só aceita um bocado do caminho, como viste na fase 1, e o `"/:codigo/escolhas/:numero"` precisa do número. O router passa o pedido à frente, e quem responde é o middleware final.

2. Provoca um erro de propósito: no `server.js`, passa a linha `app.use("/api/cenas", cenasRotas);`, com o comentário por cima, para depois do middleware final, logo antes do `try` da ligação à base. Guarda. Prevê o que respondem `/api/estado` e `/api/cenas/inicio`, e depois abre-os.

   O que deves ver: `/api/estado` responde como sempre, porque a rota de estado está antes do middleware final. `/api/cenas/inicio` dá 404, com `{"erro":"Rota não encontrada"}`: o middleware final responde a todos os pedidos que lhe chegam, e o router, abaixo dele, nunca é usado.

3. Põe o `app.use` do router outra vez antes do middleware final, guarda e confirma que `/api/cenas/inicio` volta a mostrar a primeira cena.

### Paragem 8

O `server.js` voltou a ficar como no fim da fase 7, com o router antes do middleware final.

Pensa antes de continuares: e se fosse o middleware de registo a ficar depois do middleware final? A resposta: o terminal deixava de escrever os pedidos, todos eles. Cada pedido acaba respondido pela rota de estado, pelo router ou pelo middleware final, e quem responde não passa o pedido à frente. Nenhum pedido chegava ao registo.

## Fase 9: Cada linha do contrato verifica-se com um pedido

Verificas a API em camadas contra o contrato, com os doze pedidos da fase 3 e mais quatro, e no fim jogas uma partida só com pedidos. Três dos novos são casos de fronteira, pedidos no limite do que o contrato aceita, que apanham erros que o pedido normal esconde. Rever: [Cada linha do contrato verifica-se com um pedido](../04-api-express-e-contratos.md#cada-linha-do-contrato-verifica-se-com-um-pedido).

1. Faz os dezasseis pedidos da tabela, com o separador "Rede" aberto. Os doze da fase 3 já os previste, e basta compará-los. Os quatro novos são os casos de fronteira `/api/cenas/corredor/escolhas/1`, o menor número aceite, `/api/cenas/corredor/escolhas/1.5` e `/api/cenas/corredor/escolhas`, sem o número, e `/api/cenas/cave/escolhas/abc`, com a cena e o número errados. Antes de cada um, prevê o código com o contrato e o código à frente, como na fase 3.

   O que deves ver:

   | Pedido | Código | Resposta |
   | --- | --- | --- |
   | `/api/estado` | 200 | `{"estado":"ok","aplicacao":"Fechado na escola"}` |
   | `/api/cenas` | 200 | as onze cenas |
   | `/api/cenas/inicio` | 200 | a cena "A biblioteca às escuras" |
   | `/api/cenas/cave` | 404 | `{"erro":"Não existe a cena cave"}` |
   | `/api/cenas/corredor/escolhas/3` | 200 | a cena `escadas`, "O primeiro andar" |
   | `/api/cenas/inicio/escolhas/2` | 200 | a cena `carregador`, "Atrás do balcão" |
   | `/api/cenas/corredor/escolhas/1` | 200 | a cena `secretaria`, "A secretaria" |
   | `/api/cenas/corredor/escolhas/abc` | 400 | `{"erro":"O número da escolha tem de ser um número inteiro maior do que 0"}` |
   | `/api/cenas/corredor/escolhas/0` | 400 | o mesmo erro |
   | `/api/cenas/corredor/escolhas/1.5` | 400 | o mesmo erro |
   | `/api/cenas/cave/escolhas/abc` | 400 | o mesmo erro |
   | `/api/cenas/cave/escolhas/1` | 404 | `{"erro":"Não existe a cena cave"}` |
   | `/api/cenas/corredor/escolhas/4` | 404 | `{"erro":"A cena corredor não tem a escolha 4"}` |
   | `/api/cenas/fim-alarme/escolhas/1` | 404 | `{"erro":"A cena fim-alarme não tem a escolha 1"}` |
   | `/api/cenas/corredor/escolhas` | 404 | `{"erro":"Rota não encontrada"}` |
   | `/api/cena` | 404 | `{"erro":"Rota não encontrada"}` |

   Os doze pedidos que vêm da fase 3 dão as mesmas respostas que lá deram. As camadas mudaram a organização do código, e não o que a API responde.

2. Se alguma linha não conferir, o erro está no código ou no contrato: descobre qual, corrige-o e volta a fazer o pedido dessa linha. Um 400 que mudou procura-se primeiro no controller, uma escolha que leva à cena errada, no service, e uma cena que não aparece, no repository.

3. Agora joga, só com o número das escolhas, como quem as vê numa página. Começa em `/api/cenas/inicio`, lê o texto e as escolhas, e faz a que quiseres com `/api/cenas/inicio/escolhas/1` ou `/api/cenas/inicio/escolhas/2`. Em cada cena seguinte, faz o mesmo, com o código dela no lugar de `inicio`, até chegares a uma cena com `"final": true`. Consegues sair da escola sem seres apanhado?

   A resposta: há uma saída, a cena `fim-telhado`, "Cá fora!". As outras três cenas finais acabam com o alarme, com a ronda das 23h ou fechado no ginásio.

### Paragem 9

A tua API dá as dezasseis respostas da tabela, com códigos 200, 400 e 404, e jogaste uma partida só com pedidos.

Pensa antes de continuares: a tabela não tem o pedido `/api/cenas/sala-12/escolhas/3`. Sem o fazeres, o que diz o contrato que ele responde? A resposta: 404, com um erro, porque a sala 12 existe e tem só duas escolhas. O teu código escreve `{"erro":"A cena sala-12 não tem a escolha 3"}`. A tabela verifica um exemplo de cada linha do contrato, e a linha diz o que responde qualquer outro pedido do mesmo caso.

## Fase 10: Guardar no Git

Guardas o passo 2 num commit, com o contrato e as camadas, como guardaste o passo 1. Rever: [Um commit guarda uma fotografia do projeto](../03-arquitetura-e-setup-node.md#um-commit-guarda-uma-fotografia-do-projeto).

1. No segundo terminal, corre `git status`, para veres o que mudou desde o commit do passo 1. O que deves ver: o `src/server.js` em "Changes not staged for commit" (alterações por preparar), como `modified`. Em "Untracked files" (ficheiros que o Git ainda não segue), estão o `contrato-da-api.md` e as pastas novas `src/controllers/`, `src/repositories/`, `src/rotas/` e `src/services/`. O `.env` não aparece, porque o `.gitignore` o deixa de fora.

2. Faz o commit e vê o histórico:

   ```bash
   git add .
   git commit -m "Passo 2: contrato da API, escolha da cena seguinte e camadas"
   git log --oneline
   ```

   O que deves ver: o `git log` mostra o commit deste passo no topo da lista, com o do passo 1 por baixo. Se o Git escrever `Please tell me who you are`, ou `Your name and email address were configured automatically`, vê [este problema](#please-tell-me-who-you-are-ou-your-name-and-email-address-were-configured-automatically).

3. Para o jogo, porque o passo 3 liga outro servidor e precisa da porta livre: no primeiro terminal, carrega em Ctrl+C. O que deves ver: o terminal volta a aceitar comandos, e `http://localhost:3000/api/estado` deixa de responder.

### Paragem 10

O passo 2 está guardado no Git, o jogo está parado, e o teu projeto está igual à pasta [fechado-na-escola-passo-02](../../exemplos/acesso-a-dados/fechado-na-escola-passo-02/README.md), o ponto de partida do passo 3. Esse passo faz-se nas aulas de Sistemas de Informação, com este mesmo projeto. O contrato e o código das camadas são o que este passo entrega: o professor vê-os na sala, no teu projeto e no commit.

Pensa antes de continuares: porque é que o commit vem depois da verificação da fase 9, e não logo no fim da fase 7? A resposta: um commit guarda o projeto como ele está. Com a verificação antes, o que fica guardado como passo 2 é uma API que cumpre o contrato. Sem ela, um erro que só a tabela apanha ficava no histórico como se fosse o passo 2 acabado.

## Se alguma coisa falhar

1. Estás na pasta certa? Os comandos correm-se na pasta do jogo, onde está o `package.json`. O `pwd` mostra a pasta atual (no Windows, na linha de comandos clássica, `cd`, sem mais nada).
2. Guardaste o ficheiro? Vê [O jogo não reinicia depois de guardar](#o-jogo-não-reinicia-depois-de-guardar).
3. O jogo arrancou? Depois de guardares, o primeiro terminal tem de voltar a mostrar `Fechado na escola em http://localhost:3000`. Se mostrar um erro, vê [O jogo reinicia e para](#o-jogo-reinicia-e-para-com-failed-running-srcserverjs).
4. A resposta não é a que o contrato diz? Procura a diferença na camada que decide essa parte da resposta, como no passo 2 da [fase 9](#fase-9-cada-linha-do-contrato-verifica-se-com-um-pedido).
5. Um pedido que já tinha dado 200 aparece com 304? Marca "Disable cache" no separador "Rede", como no passo 4 de [Preparar o projeto](#preparar-o-projeto).
6. O teu ficheiro está igual ao do laboratório? A pasta [fechado-na-escola-passo-02](../../exemplos/acesso-a-dados/fechado-na-escola-passo-02/README.md), nos exemplos, tem os ficheiros como ficam no fim da fase 7: compara com ela o ficheiro que falha. O `server.js` muda em cada fase, e só fica igual ao dela no fim da fase 7. O contrato dela tem, a mais, a imagem do cabeçalho e a do rodapé dos documentos dos exemplos.

### O seed ou o jogo não chegam à base de dados

O seed escreve `O seed falhou`, ou o jogo escreve `Não foi possível ligar à base de dados` e não aceita pedidos. Confirma que tens internet, que o `.env` tem a tua cadeia de ligação na linha `MONGODB_URI=` e que o Atlas aceita o endereço IP da rede onde estás. O resto da mensagem diz a causa, e o [laboratório do passo 1](03-arquitetura-e-setup-node-laboratorio.md#se-alguma-coisa-falhar) tem a solução de cada uma.

### O jogo não reinicia depois de guardar

O `--watch` só vigia os ficheiros que o jogo já carregou. Um ficheiro novo, que nenhum `import` usa, não o faz reiniciar. Nas fases 4 a 7, o ficheiro novo só passa a contar quando guardas o `server.js` que o importa, e está certo. Se ficares na dúvida, para o jogo com Ctrl+C e volta a correr `npm run dev`.

### O jogo reinicia e para, com "Failed running 'src/server.js'"

Há um erro num ficheiro, e o `--watch` fica à espera de que o corrijas. Na mensagem, por cima dessa linha, procura a que começa pelo tipo do erro, como `SyntaxError` ou `Error`: diz o que está mal e, muitas vezes, em que ficheiro. Corrige e guarda, e o jogo volta a arrancar sozinho.

### Os pedidos às cenas dão erro 500, com "Cena is not defined"

No `server.js` saiu o `import` do modelo, mas ficou uma rota que ainda usa o `Cena.find`. O jogo arranca, mas o pedido dessa rota falha, e o terminal mostra `ReferenceError: Cena is not defined` (`Cena` não está definido). O browser recebe o 500 do Express, numa página em HTML, e não em JSON: é um erro do servidor, que neste passo fica fora do contrato. Acontece a quem muda o `server.js` à mão, em vez de substituir o ficheiro todo. Volta a copiar o `server.js` da fase em que estás. O mesmo vale para `procurarPorCodigo is not defined` e `obterCena is not defined`, nas fases 5 e 6.

### Cannot set headers after they are sent to the client

Falta o `return` depois de um `res.status(...).json(...)`. A função responde ao pedido e continua, e tenta responder-lhe outra vez. O browser recebe a primeira resposta, e o erro aparece no terminal. Põe o `return` a seguir a cada resposta de erro.

### A escolha 1 leva à cena da escolha 2

Escreveste `escolhas[numero]` em vez de `escolhas[numero - 1]`. A escolha 1 do corredor mostra a porta principal, em vez da secretaria, e a escolha 3 dá 404, porque a posição 3 não existe numa lista de três. O número da escolha começa no 1, e a posição na lista começa no 0.

### Os pedidos às cenas dão todos "Rota não encontrada"

Há duas causas possíveis. A primeira é o `app.use` do router estar depois do middleware final, como no erro provocado da fase 8. A segunda são os caminhos dentro do router escritos completos, como `"/api/cenas/:codigo"` em vez de `"/:codigo"`: a rota fica em `/api/cenas/api/cenas/:codigo`. A pista é a rota de estado, que está no `server.js` e continua a responder.

### O jogo não arranca, com "argument handler must be a function"

Numa rota, escreveste o nome da função com parênteses, como `listar()`. O Express só aceita a própria função, sem a chamar. A primeira linha da mensagem aponta para um ficheiro dentro da `node_modules`, o `router/lib/route.js`, de um pacote que o Express usa. Nas linhas que começam por `at`, procura a que tem o teu ficheiro, que diz a linha da rota.

### Please tell me who you are, ou Your name and email address were configured automatically

O Git não tem o teu nome nem o teu email nesta pasta. No passo 1, ficaram configurados só na pasta desse projeto, e uma pasta copiada precisa do `git config` de [O que precisas](#o-que-precisas). Corre `git config user.name "O teu nome"` e `git config user.email "o teu email da escola"`. Se o Git recusou o commit, repete-o. Se o fez com o nome da conta do computador, os commits seguintes já levam o teu nome. Não uses o comando com `--global` que o Git sugere.

## Desafios

1. As cenas finais. Acrescenta ao contrato e à API o pedido `GET /api/cenas/finais`, que lista as cenas que acabam a partida. Escreve primeiro a entrada do contrato, e só depois o código, uma camada de cada vez. Pista: pensa no que a rota `"/:codigo"` faz a um pedido como `/api/cenas/finais`.
2. As escolhas de uma cena. Na fase 8, `/api/cenas/corredor/escolhas` dava `Rota não encontrada`. Acrescenta ao contrato e à API o pedido `GET /api/cenas/:codigo/escolhas`, que responde só com as escolhas da cena. Cada escolha leva o texto que o jogador lê e o número que se usa no pedido da escolha. Decide no contrato a forma da resposta, e só depois escreve o código. Pista: o número de cada escolha não está guardado na base de dados.

## Antes de terminares

- [ ] O teu `contrato-da-api.md`, na raiz do projeto, tem o formato dos erros, a forma da cena, os quatro pedidos e a resposta a qualquer outro pedido.
- [ ] A tua API dá as respostas da tabela da fase 9, e verificaste pelo menos um 200, um 400 e um 404.
- [ ] O `server.js` só tem o arranque, e as cenas passam pelas rotas, pelo controller, pelo service e pelo repository.
- [ ] O `git log --oneline` mostra o commit deste passo no topo.
- [ ] O jogo está parado.
- [ ] Consegues explicar, por palavras tuas, o caminho de um pedido de escolha pelas camadas: que função de que ficheiro correu, e quem decidiu o código da resposta.

![Rodapé](../../imagens/rodape.png)
