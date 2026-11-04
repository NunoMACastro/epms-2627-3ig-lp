![Cabeçalho](../../imagens/cabecalho.png)

# Laboratório: API Express e contratos

Laboratório do tema API Express e contratos, do módulo M14, Acesso a Bases de Dados. É o passo 2 do jogo Fechado na escola. Vais escrever o contrato da API do jogo, acrescentar o pedido que leva de uma cena à seguinte e separar o servidor em camadas, sem mudar nenhuma resposta. Cada passo diz o que fazer, porquê e o que deves ver. Avanças ao teu ritmo: o que não acabares na aula, acabas em casa ou na aula seguinte. Tudo o que precisas está aqui; o [guia do tema](../04-api-express-e-contratos.md) tem a teoria completa, para quem quiser saber mais.

## O que vais construir

No passo 1, o jogo ficou com as onze cenas da história no Atlas e uma API que mostra uma cena pelo código. Ainda não há maneira de fazer uma escolha. No fim deste passo, o pedido `/api/cenas/corredor/escolhas/3` faz a escolha 3 na cena do corredor e responde com a cena para onde ela leva. Com ele, consegues jogar uma partida inteira só com pedidos. O projeto fica com o contrato da API escrito e com o código separado em camadas, cada uma no seu ficheiro:

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

Ficas a saber escrever o contrato de uma API e verificá-lo pedido a pedido, e separar um servidor em camadas ligadas com `import` e `export`.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | O `contrato-da-api.md` | O contrato da API, com o pedido novo da escolha |
| 2 | O `src/server.js`, com a rota da escolha | A primeira versão da escolha, com tudo no `server.js` |
| 3 | Nada: verificas a primeira versão | A tabela de referência para o resto do laboratório |
| 4 | O repository, e o `server.js` a usá-lo | As consultas à base de dados num só ficheiro |
| 5 | O service, e o `server.js` a usá-lo | A regra da escolha num ficheiro próprio |
| 6 | O controller, e o `server.js` a usá-lo | O HTTP das cenas num ficheiro próprio |
| 7 | As rotas, num router, e o `server.js` que as monta | A API responde pelas camadas, com as mesmas respostas |
| 8 | Nada: provocas um erro na ordem do middleware final | Sabes porque é que o middleware final fica no fim |
| 9 | Nada: verificas o contrato e jogas | A API cumpre o contrato, pedido a pedido |
| 10 | O commit | O passo 2 guardado no Git |

## Palavras que vais usar

- Contrato de uma API: o documento que diz, para cada pedido, o método e o caminho, os parâmetros e todas as respostas possíveis, incluindo as de erro. Para saber mais, vê a secção "O que é o contrato de uma API" do [guia](../04-api-express-e-contratos.md).
- Parâmetro de rota: um valor que vem dentro do caminho, como `corredor` e `3` em `/api/cenas/corredor/escolhas/3`. Na rota escreve-se com dois pontos, `:codigo`, lê-se em `req.params` e chega sempre como texto.
- Código de estado: o número que vem em cada resposta e diz como correu o pedido. O 200 quer dizer que correu bem, o 400 que o pedido está mal feito e o 404 que o que se pediu não existe.
- Verificar à entrada: confirmar, no princípio da função que trata o pedido, que os valores que chegaram servem, antes de os usar.
- `NaN`: "não é um número", o que o `Number` devolve quando o texto não é um número, como em `Number("abc")`.
- Módulo: num projeto com `"type": "module"`, cada ficheiro `.js`. O que lá se declara fica fechado lá dentro.
- `export` e `import`: o `export` deixa um nome ser usado por outros ficheiros; o `import` pede-o, com o caminho do ficheiro. O `import { nome }`, com chavetas, pede um nome exportado com esse nome.
- `export default`: exporta uma só coisa, sem nome, que se importa sem chavetas.
- Caminho relativo, num `import`: um caminho que começa por `./`, a mesma pasta, ou por `../`, a pasta de cima, a partir do ficheiro que o escreve.
- Comentário de documentação: o comentário `/** … */` por cima de uma função descreve-a. O `@param` diz o que ela recebe, e o `@returns`, o que devolve. O `Promise<…>` quer dizer que o valor chega com `await`, `object[]` é uma lista de objetos, e `object | null` é um objeto ou `null`.
- Camadas: as partes em que se divide o código da API, cada uma com o seu trabalho. As rotas dizem que pedido vai para que função; o controller trata o HTTP; o service tem as regras do jogo; o repository fala com a base de dados. Para saber mais, vê a secção "As camadas em código" do [guia](../04-api-express-e-contratos.md).
- Router: um conjunto de rotas, criado com `express.Router()`, que se monta todo de uma vez num caminho do servidor.
- Middleware final: a função registada com `app.use`, sem caminho, que responde aos pedidos que nenhuma rota tratou.
- Formato único dos erros: todas as respostas de erro da API com a mesma forma, `{ "erro": "..." }`.

## O que precisas

- O projeto do jogo como ficou no fim do passo 1, com o commit desse passo. Se não o tiveres, copia a pasta [fechado-na-escola-passo-01](../../exemplos/acesso-a-dados/fechado-na-escola-passo-01/README.md) dos exemplos, sem o `README.md`, e segue o "Como correr" do README dela. Depois, guarda-a no Git com `git init`, `git add .` e `git commit -m "Passo 1"`.
- O Node.js e o npm. Confirma com `node --version` e `npm --version`. Devem aparecer dois números de versão, e o do Node começa por `v22` ou por um número maior, como no passo 1.
- A tua conta no Atlas, com o cluster do passo 1, e internet em todas as fases. O jogo só aceita pedidos depois de se ligar à base de dados.
- Um editor de código e dois terminais, os dois dentro da pasta do jogo: um para o jogo, que fica ligado, e outro para os comandos.
- O browser, com as ferramentas de programador (F12) no separador "Rede" (ou "Network"), para veres o código de estado de cada resposta.

Antes de começares, no segundo terminal, volta a pôr as cenas na base, como estavam no fim do passo 1:

```bash
npm run seed
```

O que deves ver: `Ligada à base de dados fechado-na-escola`, uma linha com as cenas apagadas e `Inseridas 11 cenas`. O seed apaga as cenas e volta a inseri-las, por isso podes corrê-lo as vezes que quiseres. Depois, no primeiro terminal, liga o jogo e deixa-o ligado:

```bash
npm run dev
```

O que deves ver: `Ligada à base de dados fechado-na-escola` e `Fechado na escola em http://localhost:3000`. Com o `--watch`, o jogo reinicia sozinho sempre que guardas um ficheiro que ele já usa. Mantém este terminal à vista, porque é lá que os erros aparecem.

## Se alguma coisa falhar

1. Estás na pasta certa? Os comandos correm-se na pasta do jogo, onde está o `package.json`. O `pwd` mostra a pasta atual (no Windows, na linha de comandos clássica, `cd`, sem mais nada).
2. Guardaste o ficheiro? O `--watch` só reinicia o jogo depois de guardares.
3. O jogo arrancou? Depois de guardares, o primeiro terminal tem de voltar a mostrar `Fechado na escola em http://localhost:3000`. Se mostrar um erro, procura, no meio das linhas, a que começa pelo tipo do erro, como `SyntaxError` ou `Error [ERR_MODULE_NOT_FOUND]`. É essa que diz o que falhou. As linhas com `node:internal` são de dentro do Node.
4. A resposta não é a que esperavas? Compara-a com o contrato, linha a linha, e procura a diferença na camada que decide essa parte da resposta.
5. O ficheiro está igual ao do laboratório? A pasta [fechado-na-escola-passo-02](../../exemplos/acesso-a-dados/fechado-na-escola-passo-02/README.md), nos exemplos, tem os ficheiros como ficam no fim da fase 7. Compara com ela o ficheiro que falha. O `server.js` muda em cada fase, e só fica igual ao dela no fim da fase 7. O contrato dela tem, a mais, as imagens do cabeçalho e do rodapé dos documentos dos exemplos, que o teu não leva.

## Fase 1: o contrato, antes do código

Uma API é usada por programas, como uma página ou uma interface em React, e um programa não consegue adivinhar. Tem de saber exatamente o que pedir e o que vai receber, também quando corre mal. O contrato de uma API diz isso, pedido a pedido. Diz o método e o caminho, e os parâmetros: onde vêm e que valores servem. Diz também a resposta quando corre bem, e todas as respostas de erro. Escreve-se antes do código, e obriga as duas partes: a API compromete-se a responder assim, e quem a usa, a pedir assim. É com ele que se verifica a API. Se responde ao que o contrato diz, está certa. Para saber mais, lê a secção "O que é o contrato de uma API" do [guia](../04-api-express-e-contratos.md).

1. Na raiz do projeto, ao lado do `package.json`, cria o ficheiro `contrato-da-api.md`. É um ficheiro em Markdown, o formato destes documentos. Um título começa por `#`. Uma tabela escreve-se com uma linha de texto por cada linha da tabela, com `|` entre as colunas. Logo a seguir à linha dos títulos vem uma linha só com traços, como `| --- | --- |`. Um bloco de JSON fica entre duas linhas de três acentos graves, a primeira com a palavra `json`.

2. Escreve no contrato este conteúdo. Ao copiar cada pedido, pergunta-te o que cada linha obriga a API a fazer.

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

   Leitura guiada: o contrato abre com duas regras que valem para todos os pedidos. Todas as respostas são JSON, e todos os erros têm a mesma forma, um objeto com o campo `erro`. Quem usa a API mostra sempre o mesmo campo ao jogador, seja qual for o pedido que falhou. Depois vem a forma de uma cena, que é a forma do documento que o seed pôs no Atlas. O `_id` do exemplo é o de uma base de dados, e o teu é outro. A seguir vêm os pedidos, cada um com duas tabelas: a dos parâmetros, quando os há, e a das respostas. Os três primeiros, o estado, a lista e uma cena, são os que o teu jogo já tem desde o passo 1, e o contrato passa a pô-los por escrito. O quarto é o pedido novo, que ainda não existe. A última secção diz o que acontece a todos os outros pedidos.

3. Pensa antes de continuares. O jogador está no corredor e escolhe "Subir as escadas", a terceira escolha. Há duas maneiras de passar à cena seguinte. Na primeira, a da partida que jogaste no passo 1, quem joga lê o destino da escolha, `escadas`, e pede `/api/cenas/escadas`. Na segunda, pede `/api/cenas/corredor/escolhas/3`, e é o servidor que vê para onde leva a escolha 3. O contrato escolheu a segunda. Porquê?

   A resposta: na segunda, é o servidor, e não o jogador, que diz para onde leva uma escolha. A regra do jogo fica num só sítio, junto das cenas. Quem mostra as cenas só tem de saber onde o jogador está e o número em que ele clicou. O servidor confirma que a escolha existe naquela cena, e recusa um número que não serve. Se a história mudar, mudam as cenas na base de dados, e quem mostra as cenas não muda. E, se um dia uma escolha passar a depender de uma regra, como só se poder entrar na sala 12 com a chave, é no servidor que essa regra entra.

4. Pensa outra vez: as listas do JavaScript começam no 0. Porque é que o contrato numera as escolhas a partir de 1?

   A resposta: porque o número é o que o jogador vê. Para quem joga, a primeira escolha é a 1, e não a 0. O contrato fala a língua de quem usa a API, e passar do número da escolha para a posição na lista é trabalho do servidor. Vais escrevê-lo na fase 2.

5. O contrato promete o pedido novo, mas o código ainda não o tem. Prevê o que responde agora `http://localhost:3000/api/cenas/corredor/escolhas/3`, e depois abre-o no browser.

   O que deves ver: `{"erro":"Rota não encontrada"}`, com o código 404. Nenhuma rota do teu `server.js` corresponde a este caminho, e o pedido chega ao middleware final, que escreveste no passo 1.

### Paragem 1

O `contrato-da-api.md` está na raiz do projeto, com o formato dos erros, a forma da cena, os quatro pedidos e a resposta a qualquer outro pedido. É uma das duas coisas que este tema te pede para entregar; a outra são as rotas. As duas ficam no teu projeto, guardadas no commit da fase 10, e é lá que o professor as vê.

Pensa antes de continuares: o contrato não diz em que ficheiro está cada rota, nem como o servidor procura uma cena. Porquê? A resposta: o contrato diz o que a API promete a quem a usa. Como ela o cumpre por dentro é decisão de quem a escreve, e pode mudar sem o contrato mudar. É o que vai acontecer nas fases 4 a 7: o código muda de ficheiro, a procura de uma cena passa para o repository, e nenhuma resposta muda.

## Fase 2: a escolha, primeiro no server.js

Antes de dividir o servidor em camadas, escreve-se o pedido novo no ficheiro onde já estão os outros, como no passo 1. Quase tudo já o conheces de Sistemas de Informação: o `req.params`, sempre como texto, o `res.status(...).json(...)` e o `return` depois de um erro. A ideia nova é verificar à entrada. O `numero` chega como texto, `"3"`, e passa a número com o `Number`. O `Number.isInteger` confirma que deu um número inteiro: `Number("abc")` dá `NaN`, e `Number("1.5")` dá 1.5, e nenhum dos dois é inteiro. Se o número não servir, a rota responde 400 logo ali, antes de ir à base de dados. Para saber mais, lê a secção "Verificar à entrada" do [guia](../04-api-express-e-contratos.md).

1. No `src/server.js`, a seguir à rota de uma cena, a `app.get("/api/cenas/:codigo", ...)`, e antes do middleware final, acrescenta esta rota:

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

   Leitura guiada: lê a rota pela ordem do contrato. Primeiro, os dois parâmetros de rota. Depois, as três respostas de erro, cada uma com o seu `return`. São o número que não serve (400), a cena que não existe (404) e a escolha que a cena não tem (404). A cena procura-se como na rota de uma cena, pelo campo `codigo`. Quando existe, `encontradas[0]` é a cena, e `encontradas[0].escolhas` é a lista das escolhas embutidas nela, a mesma que o seed lá pôs. Pedir uma posição que a lista não tem, como a posição 5 numa lista de três, dá `undefined`, e é isso que a rota verifica. No fim, a rota procura a cena do destino e responde com ela.

2. Guarda. O que deves ver: o primeiro terminal mostra que o jogo reiniciou, com `Ligada à base de dados fechado-na-escola` e `Fechado na escola em http://localhost:3000`.

3. Prevê que cena aparece em `http://localhost:3000/api/cenas/corredor/escolhas/3`, e depois abre-o.

   O que deves ver: a cena com o código `escadas` e o título "O primeiro andar". No seed, a terceira escolha do corredor é "Subir as escadas", com o destino `escadas`. O número 3 passou à posição 2 da lista, e o servidor leu lá o destino.

### Paragem 2

A primeira versão da escolha está escrita, e o `server.js` cresceu quase 30 linhas. A fase 3 verifica-a contra o contrato.

Pensa antes de continuares: a rota verifica o número antes de procurar a cena. O que responde ao pedido `/api/cenas/cave/escolhas/abc`, em que nem a cena existe nem o número serve? A resposta: 400, com a mensagem do número. A rota nem chega a perguntar à base de dados pela cena `cave`. Um número que não serve é um pedido mal feito, seja qual for a cena. Se a ordem das verificações fosse a contrária, a resposta era 404, com `Não existe a cena cave`.

## Fase 3: verificar a primeira versão

Cada linha do contrato diz o que a API responde a um pedido, e por isso cada linha se pode verificar. Faz-se o pedido e compara-se a resposta com o contrato. Antes de cada pedido, prevês de cabeça o código e a resposta, só com o contrato e o código à frente. A tabela desta fase fica de referência. Nas fases 4 a 7, o código muda de ficheiro, e as respostas têm de continuar as mesmas. Para saber mais, lê a secção "Passo 2: tudo no server.js, e verificar", do exemplo guiado do [guia](../04-api-express-e-contratos.md).

1. No browser, abre as ferramentas de programador (F12) e escolhe o separador "Rede" (ou "Network"). Cada pedido que fazes aparece numa linha, com o código de estado da resposta.

2. Os pedidos da tabela começam todos por `http://localhost:3000`, que a tabela não repete. Para cada um, prevê de cabeça o código e a resposta, faz o pedido e compara. Depois passa ao seguinte.

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

3. Repara em duas linhas da tabela: `/api/cenas/corredor/escolhas/abc` dá 400, e `/api/cenas/corredor/escolhas/4` dá 404. Porque é que não dão as duas 400, se as duas escolhas não existem?

   A resposta: `abc` nem sequer é um número, por isso o pedido está mal feito, e a API diz-o com um 400. O 4 é um número de escolha válido, e o pedido está bem feito. Só que o corredor tem três escolhas, e o que se pediu não existe: 404. A cena `fim-alarme` dá 404 pela mesma razão, porque uma cena final tem a lista das escolhas vazia.

### Paragem 3

A primeira versão responde a todas as linhas do contrato, e a tabela desta fase é a referência para o resto do laboratório.

Pensa antes de continuares: a rota da escolha mistura três tipos de trabalho. Há o HTTP, isto é, ler o pedido e escolher a resposta; há as regras do jogo; e há os dados, as consultas à base. A que tipo pertence cada parte da rota? A resposta:

| Parte da rota da escolha | Tipo | Porquê |
| --- | --- | --- |
| Ler o `codigo` e o `numero` do `req.params` | HTTP | vêm no endereço do pedido |
| Converter e verificar o número, e responder 400 | HTTP | é o pedido que está mal feito |
| `Cena.find({ codigo: codigo })` | dados | usa o modelo e a linguagem do MongoDB |
| Responder 404 quando não há cena ou escolha | HTTP | é escolher o código da resposta |
| A escolha N está na posição N - 1, e uma cena final não tem escolhas | regra do jogo | é assim que o jogo funciona, com ou sem HTTP |
| `Cena.find({ codigo: escolha.destino })` | dados | a mesma consulta, outra vez |
| `res.json(...)` | HTTP | é a resposta |

Os três tipos alternam na mesma função, e a consulta pelo código está escrita três vezes no ficheiro: uma na rota de uma cena e duas na rota da escolha. As fases 4 a 7 separam-nos, cada tipo no seu ficheiro, de dentro para fora: primeiro os dados, depois a regra, depois o HTTP e, por fim, as rotas.

## Fase 4: o repository, a camada que fala com a base de dados

Cada ficheiro `.js` do teu projeto é um módulo, porque o `package.json` tem `"type": "module"`. O que se declara num módulo fica fechado lá dentro. O `export` à frente de uma função deixa outro ficheiro usá-la, e o `import { nome } from "caminho"` pede-a, com o nome exato entre chavetas. Nos teus ficheiros, o caminho começa por `./`, a mesma pasta, ou por `../`, a pasta de cima, e acaba sempre em `.js`. Já o fizeste no passo 1: o modelo exporta o `Cena`, e o `import { Cena } from "./models/cena.model.js"` do `server.js` pede-o. Nesta fase e nas seguintes, cada camada nova exporta as suas funções para a camada de cima. A primeira é o repository, a camada que fala com a base de dados. É a única que usa o modelo `Cena` e que escreve consultas do MongoDB. A consulta pelo código, que está três vezes no `server.js`, passa a ser uma só função, com nome. Para saber mais, lê a secção "Onde fica cada camada" do [guia](../04-api-express-e-contratos.md).

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

   Leitura guiada: começa pelo `import`. Os `..` sobem de `src/repositories/` para `src/`, e daí o caminho desce para `models/cena.model.js`. Depois vêm as duas funções, cada uma com `export`, porque o `server.js` vai pedi-las. A `procurarTodas` é o `find` da rota da lista. A `procurarPorCodigo` é a consulta que estava repetida, com a verificação da lista vazia. Devolve a cena, ou `null` quando não a encontra, e não sabe o que é um 404. As duas são `async`, porque esperam pela base de dados, e quem as chama usa o `await`. Ainda não há nada para ver: nenhum ficheiro importa o repository, e o jogo não reinicia.

2. Substitui o conteúdo do `src/server.js` por este:

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

   Leitura guiada: compara com o teu ficheiro de antes. Mudaram o comentário do início e o terceiro `import`, que pede ao repository as duas funções, entre as mesmas chavetas, em vez do modelo. Nas três rotas das cenas, cada `Cena.find` deu lugar a uma chamada ao repository, e o `encontradas.length === 0` deu lugar ao `cena === null`. Os comentários das rotas também mudaram. Os da lista e de uma cena falam agora do repository. Na rota da escolha, saíram as explicações de quem lê o destino e de porque se verifica primeiro o número, que já leste na fase 2. As respostas, as verificações e a regra da escolha ficaram iguais, e o resto do ficheiro também.

3. Guarda. O que deves ver: o jogo reinicia, como na fase 2. É a primeira vez que o `server.js` carrega o repository, e por isso, se houver um erro de `import`, é agora que aparece. Abre `/api/cenas/inicio`, `/api/cenas/corredor/escolhas/3` e `/api/cenas/cave`. As respostas são as da tabela da fase 3.

4. Provoca um erro de propósito. No `server.js`, no `import` do repository, apaga o `.js` do fim do caminho e guarda.

   O que deves ver: várias linhas, e no meio delas uma que começa por `Error [ERR_MODULE_NOT_FOUND]: Cannot find module` (não foi possível encontrar o módulo). Nessa linha vem a seguir o caminho de `src/repositories/cenas.repository`, sem o `.js`, e depois `imported from` (importado por), com o caminho do `server.js`. Diz que ficheiro o Node não encontrou e quem o pediu. As linhas com `node:internal`, como `node:internal/modules/esm/resolve:241`, e as que começam por `at` são de dentro do Node. Neste erro, não apontam para o teu código. No fim, o `--watch` escreve `Failed running 'src/server.js'` e fica à espera de que corrijas. Isto acontece porque, nos módulos do Node, a extensão é obrigatória nos teus ficheiros. Repõe o `.js` e guarda. O jogo volta a arrancar sozinho.

### Paragem 4

O repository existe, e o `server.js` já não fala diretamente com a base de dados. As respostas são as mesmas da fase 3.

Pensa antes de continuares: que ficheiros do projeto importam agora o modelo `Cena`? A resposta: o repository e o seed. O repository é a camada da aplicação que fala com a base de dados. O seed não faz parte da aplicação: corre à parte, com o `npm run seed`, para pôr as cenas na base.

## Fase 5: o service, as regras do jogo

A regra da escolha está no meio da rota: o número da escolha passa a posição, uma cena final não tem escolhas, e a cena seguinte é a do destino. É uma regra do jogo, e valia na mesma se o jogo não usasse HTTP. O service é a camada que fica com as regras. Não sabe nada de HTTP, porque não recebe o `req` nem o `res`, e não sabe nada de MongoDB, porque pede as cenas ao repository. Recebe valores simples e devolve valores simples, como uma cena, uma lista ou `null`. Para saber mais, lê a secção "O service" do [guia](../04-api-express-e-contratos.md).

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

   Leitura guiada: o `import` pede ao repository as duas funções, e os `..` sobem de `src/services/` para `src/`. A `listarCenas` e a `obterCena` só passam o pedido ao repository. São curtas, e existem para quem responde aos pedidos falar só com o service: cada camada conhece só a que está por baixo dela. A `cenaSeguinte` tem a regra que estava no meio da rota da escolha. Recebe a cena, e não o código, porque quem a chama já foi buscar a cena para saber se ela existia. Assim, a mesma cena não se procura duas vezes. Quando a escolha não existe, devolve `null`, e quem a chama decide o que isso quer dizer no HTTP. Nenhuma das três funções usa o `req`, o `res` ou o modelo.

2. Substitui o conteúdo do `src/server.js` por este:

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

   Leitura guiada: o terceiro `import` pede agora as três funções ao service, e o `server.js` deixa de conhecer o repository. Nas rotas, a `procurarTodas` deu lugar à `listarCenas`, e a `procurarPorCodigo` à `obterCena`. Na rota da escolha, as linhas da posição e do destino saíram, e no lugar delas está a chamada à `cenaSeguinte`, com o 404 quando ela devolve `null`. Repara no que sobra nas três rotas: ler o pedido, verificar o número, chamar o service e escolher a resposta. É só HTTP.

3. Guarda e confirma no primeiro terminal que o jogo reiniciou. Abre `/api/cenas/corredor/escolhas/3`, `/api/cenas/corredor/escolhas/4` e `/api/cenas/fim-alarme/escolhas/1`. As respostas são as da tabela da fase 3.

4. Provoca um erro de propósito. No `cenas.service.js`, no `import`, muda `procurarPorCodigo` para `procurarCena` e guarda.

   O que deves ver: `SyntaxError: The requested module '../repositories/cenas.repository.js' does not provide an export named 'procurarCena'` (o módulo pedido não exporta nenhum nome `procurarCena`). Por cima, a mensagem mostra a linha do `import`, com o nome assinalado. O ficheiro existe, mas não exporta esse nome: as chavetas pedem um nome exato. Repõe `procurarPorCodigo` e guarda. O jogo volta a arrancar.

### Paragem 5

O service existe, e a regra da escolha está num só sítio. As respostas são as mesmas da fase 3.

Pensa antes de continuares: se as cenas passassem para uma base de dados MariaDB, como as de Sistemas de Informação, que ficheiros do projeto mudavam? A resposta: os que usam o Mongoose, isto é, o repository, a ligação, o modelo e o seed. O service não mudava, porque não sabe que base de dados está por baixo. Pede uma cena pelo código, e recebe uma cena ou `null`. É para isso que o repository existe.

## Fase 6: o controller, o HTTP das cenas

O controller é a camada que conhece o HTTP. Lê do pedido o que interessa, converte-o e verifica-o, e responde 400 se não servir. Depois chama o service e escolhe o código e o corpo da resposta, e é ele que transforma o `null` do service num 404. Olha para as rotas do teu `server.js`: depois da fase 5, já só fazem isto. São um controller sem nome, escrito dentro do `server.js`. Esta fase dá-lhes nome e muda-as de ficheiro. Para saber mais, lê a secção "O controller" do [guia](../04-api-express-e-contratos.md).

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

   Leitura guiada: o `import` pede as três funções ao service, e nenhuma ao repository nem ao modelo. Cada função exportada é a função de uma das rotas do teu `server.js`, com as mesmas linhas, agora com nome. O comentário de uma linha por cima diz que pedido trata. A `escolher` faz as verificações pela ordem da primeira versão: primeiro o número (400), depois a cena (404), por fim a escolha (404). As três recebem o `req` e o `res`, e o controller é a única camada que os usa.

2. Substitui o conteúdo do `src/server.js` por este:

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

   Leitura guiada: o terceiro `import` pede as três funções do controller. As três rotas das cenas, que tinham quase 40 linhas, ficaram em três linhas: o método, o caminho e o nome da função que responde. Lidas de cima para baixo, são o índice da API das cenas.

3. Guarda, confirma que o jogo reiniciou e abre `/api/cenas`, `/api/cenas/inicio` e `/api/cenas/corredor/escolhas/abc`. As respostas são as da tabela da fase 3.

### Paragem 6

O controller existe, e o HTTP das cenas está num só ficheiro. As respostas são as mesmas da fase 3.

Pensa antes de continuares: no `server.js` escreve-se `listar`, e não `listar()`. O que acontecia com os parênteses? A resposta: com os parênteses, a função era chamada logo no arranque, sem nenhum pedido, e o Express recebia o resultado dela, e não a função. O jogo nem arrancava. O terminal mostrava `TypeError: argument handler must be a function` (o argumento que trata o pedido tem de ser uma função).

## Fase 7: as rotas num router, e o server.js que as monta

As três rotas das cenas começam todas por `/api/cenas`. Num ficheiro próprio, ficam num router, criado com `express.Router()`: um conjunto de rotas que se monta, todo de uma vez, num caminho do servidor. Dentro do router, os caminhos escrevem-se sem esse começo. O ficheiro das rotas exporta o router com `export default`, que exporta uma só coisa, sem nome. Quem o importa escreve-o sem chavetas, e escolhe o nome. O `server.js` fica só com o arranque. Para saber mais, lê as secções "As rotas" e "O server.js que monta as rotas" do [guia](../04-api-express-e-contratos.md).

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

   Leitura guiada: o ficheiro importa o Express, para criar o router, e as três funções do controller. Cada `router.get` liga um caminho a uma função, como os `app.get` da fase 6, mas sem o `/api/cenas`. No fim, o `export default` exporta o router, a única coisa que o ficheiro tem para dar.

2. Substitui o conteúdo do `src/server.js` por este:

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

   Leitura guiada: este é o `server.js` final. O `import cenasRotas` não tem chavetas, porque o ficheiro das rotas tem um `export default`, e o nome `cenasRotas` escolhe-se aqui. As três rotas das cenas deram lugar a um só `app.use`, com o caminho onde o router se monta. Fica o arranque: a porta, o middleware de registo, a rota de estado, o router, o middleware final, a ligação à base e o `app.listen`. Nenhuma linha fala com a base de dados, a não ser a ligação no arranque.

3. Guarda e confirma que o jogo reiniciou. É a primeira vez que o `server.js` carrega as rotas, que carregam o controller, que carrega o service, que carrega o repository. Abre `/api/estado`, `/api/cenas/inicio` e `/api/cenas/corredor/escolhas/3`. As respostas são as da tabela da fase 3, e agora vêm das camadas.

4. Provoca um erro de propósito. No `server.js`, muda `import cenasRotas from` para `import { cenasRotas } from` e guarda. Antes de olhares para o terminal, prevê: a mensagem vai ser parecida com qual das duas que já viste? Porquê, se o router existe?

   O que deves ver: `SyntaxError: The requested module './rotas/cenas.rotas.js' does not provide an export named 'cenasRotas'`, parecida com a da fase 5. O router existe, mas foi exportado com `export default`, sem nome. As chavetas pedem um export com o nome `cenasRotas`, e esse não existe. Repõe o `import` sem chavetas e guarda.

### Paragem 7

A API responde pelas camadas, e cada ficheiro tem um só trabalho.

Pensa antes de continuares: dentro do router, o caminho de uma cena é `"/:codigo"`. Porque é que o terminal escreve `GET /api/cenas/inicio`, com o caminho todo, e não `GET /inicio`? A resposta: quem escreve a linha é o middleware de registo, que está no `server.js`, antes do `app.use` do router. Vê o pedido antes de ele chegar ao router, ainda com o caminho completo. Só dentro do router é que o `/api/cenas` deixa de contar.

## Fase 8: a ordem do middleware final

O contrato diz que qualquer outro pedido responde 404, com `{ "erro": "Rota não encontrada" }`, na mesma forma dos outros erros. O middleware final faz isso desde o passo 1. É uma função registada com `app.use`, sem caminho, e o Express chama-a quando nenhuma rota respondeu ao pedido. Responde a tudo o que lhe chega, e não passa o pedido à frente. Por isso, tem de ficar no fim, depois de todas as rotas. Já o viste em Sistemas de Informação; nesta fase vês o que acontece quando ele sai do sítio. Para saber mais, lê a secção "O middleware final" do [guia](../04-api-express-e-contratos.md).

1. Prevê o que responde `http://localhost:3000/api/cenas/corredor/escolhas`, sem o número, e depois abre-o.

   O que deves ver: `{"erro":"Rota não encontrada"}`, com o código 404. O pedido começa por `/api/cenas` e entra no router, mas nenhuma rota dele corresponde. O `"/:codigo"` só aceita um bocado do caminho, sem barras, e o `"/:codigo/escolhas/:numero"` precisa do número. O router passa o pedido à frente, e quem responde é o middleware final.

2. Provoca um erro de propósito. No `server.js`, muda a linha `app.use("/api/cenas", cenasRotas);`, com o comentário por cima, para depois do middleware final, logo antes do `try` da ligação à base. Guarda. Prevê o que respondem `/api/estado` e `/api/cenas/inicio`, e depois abre-os.

   O que deves ver: `/api/estado` responde como sempre, porque a rota de estado está antes do middleware final. `/api/cenas/inicio` dá 404, com `{"erro":"Rota não encontrada"}`. O middleware final responde a todos os pedidos que lhe chegam e não os passa à frente, e o router, abaixo dele, nunca é usado.

3. Põe o `app.use` do router outra vez antes do middleware final, guarda e confirma que `/api/cenas/inicio` volta a mostrar a primeira cena.

### Paragem 8

O `server.js` está como no fim da fase 7, com o router antes do middleware final.

Pensa antes de continuares: e se fosse o middleware de registo a ficar depois do middleware final? A resposta: o terminal deixava de escrever os pedidos, todos eles. Cada pedido acaba respondido pela rota de estado, pelo router ou pelo middleware final, e quem responde não passa o pedido à frente. Nenhum pedido chegava ao registo.

## Fase 9: verificar o contrato

Cada linha da tabela desta fase corresponde a uma linha do contrato. Quando todas conferem, a API cumpre o contrato nos casos verificados. A tabela verifica um exemplo de cada linha, e não todos os valores possíveis. Para saber mais, lê a secção "Passo 7: verificar o contrato", do exemplo guiado do [guia](../04-api-express-e-contratos.md).

1. Os pedidos começam outra vez por `http://localhost:3000`, e fazes todos com o separador "Rede" aberto. Os doze que vêm da tabela da fase 3 já os previste, por isso basta fazê-los e comparar o código e o corpo com o contrato. Os três novos são `/api/cenas/corredor/escolhas/1.5`, `/api/cenas/cave/escolhas/abc` e `/api/cenas/corredor/escolhas`, sem o número. Antes de cada um destes, prevê de cabeça o código, só a olhar para o teu `contrato-da-api.md`, e só depois faz o pedido e compara.

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
   | `/api/cenas/corredor/escolhas/1.5` | 400 | o mesmo erro |
   | `/api/cenas/cave/escolhas/abc` | 400 | o mesmo erro |
   | `/api/cenas/cave/escolhas/1` | 404 | `{"erro":"Não existe a cena cave"}` |
   | `/api/cenas/corredor/escolhas/4` | 404 | `{"erro":"A cena corredor não tem a escolha 4"}` |
   | `/api/cenas/fim-alarme/escolhas/1` | 404 | `{"erro":"A cena fim-alarme não tem a escolha 1"}` |
   | `/api/cenas/corredor/escolhas` | 404 | `{"erro":"Rota não encontrada"}` |
   | `/api/cena` | 404 | `{"erro":"Rota não encontrada"}` |

2. Compara com a tabela da fase 3. Os pedidos que estão nas duas têm de dar as mesmas respostas. As camadas mudaram a organização do código, e não o que a API responde.

3. Se alguma linha não conferir, há um erro no código ou no contrato. Descobre qual, corrige-o e volta a verificar a linha. Um 400 que mudou procura-se primeiro no controller. Uma escolha que leva à cena errada procura-se no service, e uma cena que não aparece, no repository.

4. Agora joga. No passo 1, jogaste a ler o destino de cada escolha. Agora jogas só com o número das escolhas, como quem as vê numa página. Começa em `/api/cenas/inicio`, lê o texto e as escolhas, e faz a escolha que quiseres com o pedido `/api/cenas/inicio/escolhas/1` ou `/api/cenas/inicio/escolhas/2`. Em cada cena seguinte, faz o mesmo, com o código dela no lugar de `inicio`. Continua até chegares a uma cena com `"final": true`. Consegues sair da escola sem seres apanhado?

   A resposta: há uma saída. Do início, a escolha 1 leva ao corredor, e no corredor a 3 leva às escadas. Nas escadas, a 1 leva à sala 12, e na sala 12 a 1 leva ao telhado. A cena `fim-telhado`, "Cá fora!", acaba a partida. Os pedidos são `/api/cenas/inicio/escolhas/1`, `/api/cenas/corredor/escolhas/3`, `/api/cenas/escadas/escolhas/1` e `/api/cenas/sala-12/escolhas/1`. As outras três cenas finais acabam com o alarme, com a ronda das 23h ou fechado no ginásio.

No fim, tens de ter verificado pelo menos um 200, um 400 e um 404.

## Fase 10: guardar no Git

1. No segundo terminal, corre `git status`. O que deves ver: o `contrato-da-api.md` e as pastas novas `src/controllers/`, `src/repositories/`, `src/rotas/` e `src/services/`, por guardar, e o `src/server.js`, alterado. Não deve aparecer o `.env`, que o `.gitignore` deixa de fora.

2. Faz o commit:

   ```bash
   git add .
   git commit -m "Passo 2: contrato da API, escolha da cena seguinte e camadas"
   git log --oneline
   ```

   O que deves ver: o `git log` mostra o commit deste passo no topo da lista, com o do passo 1 por baixo.

O passo 3 do jogo faz-se nas aulas de Sistemas de Informação, com este mesmo projeto.

## Problemas frequentes

### O jogo não arranca: "Não foi possível ligar à base de dados"

O servidor não chegou ao Atlas, e por isso nem começou a aceitar pedidos. Confirma que tens internet e que o `.env` tem a tua cadeia de ligação na linha `MONGODB_URI=`. Confirma também que o Atlas aceita o IP do computador onde estás, como no passo 1.

### O jogo não reinicia depois de guardar

O `--watch` só vigia os ficheiros que o jogo já carregou. Um ficheiro novo, que nenhum `import` usa, não o faz reiniciar. Nas fases 4 a 7, o ficheiro novo só passa a contar quando guardas o `server.js` que o importa, e está certo. Se ficares na dúvida, para o jogo com Ctrl+C e volta a correr `npm run dev`.

### O jogo reinicia e para, com "Failed running 'src/server.js'"

Há um erro num ficheiro, e o `--watch` fica à espera de que o corrijas. Lê a mensagem por cima dessa linha e procura a que começa pelo tipo do erro, como `SyntaxError` ou `Error`. É essa que diz o que está mal, e muitas vezes em que ficheiro. Corrige e guarda, e o jogo volta a arrancar sozinho.

### Os pedidos às cenas dão erro 500, com "Cena is not defined"

No `server.js` saiu o `import` do modelo, mas ficou uma rota que ainda usa o `Cena.find`. O jogo arranca, mas o pedido dessa rota falha, e o terminal mostra `ReferenceError: Cena is not defined` (`Cena` não está definido). O browser recebe o 500 do Express, uma página em HTML, e não JSON. O 500 é um erro do servidor, e neste passo fica fora do contrato. Acontece se mudares o `server.js` à mão em vez de substituíres o ficheiro todo. Volta a copiar o `server.js` da fase em que estás. O mesmo vale para `procurarPorCodigo is not defined` ou `obterCena is not defined`, nas fases 5 e 6.

### Cannot set headers after they are sent to the client

Falta o `return` depois de um `res.status(...).json(...)`. A função responde ao pedido e continua, e tenta responder-lhe outra vez. O browser recebe a primeira resposta, e o erro aparece no terminal. Põe o `return` a seguir a cada resposta de erro.

### A escolha 1 leva à cena da escolha 2

Escreveste `escolhas[numero]` em vez de `escolhas[numero - 1]`. A escolha 1 do corredor mostra a porta principal, em vez da secretaria, e a escolha 3 dá 404, porque a posição 3 não existe numa lista de três. O número da escolha começa no 1, e a posição na lista começa no 0.

### Os pedidos às cenas dão todos "Rota não encontrada"

Há duas causas possíveis. A primeira é o `app.use` do router estar depois do middleware final, como no erro provocado da fase 8. A segunda são os caminhos dentro do router escritos completos, como `"/api/cenas/:codigo"` em vez de `"/:codigo"`. Nesse caso, a rota fica em `/api/cenas/api/cenas/:codigo`. A pista é a rota de estado, que está no `server.js` e continua a responder.

### O jogo não arranca, com "argument handler must be a function"

Numa rota, escreveste o nome da função com parênteses, como `listar()`. O Express só aceita a própria função, sem a chamar. A primeira linha da mensagem aponta para um ficheiro do Express, dentro da `node_modules`. Nas linhas que começam por `at`, procura a que tem o teu ficheiro: diz a linha da rota.

## Desafios

1. As cenas finais. Acrescenta ao contrato e à API o pedido `GET /api/cenas/finais`, que lista as cenas que acabam a partida. Escreve primeiro a entrada do contrato, e só depois o código, uma camada de cada vez. Pista: pensa no que a rota `"/:codigo"` faz a um pedido como `/api/cenas/finais`.
2. As escolhas de uma cena. Na fase 8, `/api/cenas/corredor/escolhas` dava `Rota não encontrada`. Acrescenta ao contrato e à API o pedido `GET /api/cenas/:codigo/escolhas`, que responde só com as escolhas da cena. Cada escolha leva o texto que o jogador lê e o número que se usa no pedido da escolha. Decide no contrato a forma da resposta, e só depois escreve o código. Pista: o número de cada escolha não está guardado na base de dados.

## Antes de terminares

- [ ] O `contrato-da-api.md` está na raiz do projeto, com os quatro pedidos, o formato dos erros e a resposta a qualquer outro pedido.
- [ ] A tua API dá as respostas da tabela da fase 9, e verificaste pelo menos um 200, um 400 e um 404.
- [ ] O `server.js` só tem o arranque, e as cenas passam pelas rotas, pelo controller, pelo service e pelo repository.
- [ ] O `git log --oneline` mostra o commit deste passo no topo.
- [ ] Consegues explicar, por palavras tuas, o caminho de um pedido de escolha pelas camadas: que função de que ficheiro correu, e quem decidiu o código da resposta.

![Rodapé](../../imagens/rodape.png)
