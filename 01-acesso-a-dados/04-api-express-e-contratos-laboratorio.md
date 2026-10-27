![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: API Express e contratos

Laboratório do tema API Express e contratos, do módulo M14, Acesso a Bases de Dados. Vais escrever o contrato da API da papelaria e uma primeira versão que o cumpre com tudo no `server.js`, e depois separá-la em camadas, sem mudar nenhuma resposta. Cada passo diz o que fazer, porquê e o que deves ver. Avanças ao teu ritmo: o que não acabares na aula, acabas em casa ou na aula seguinte. Tudo o que precisas está aqui; o [guia do tema](04-api-express-e-contratos.md) tem a teoria completa, para quem quiser saber mais.

## O que vais construir

No fim, o projeto `papelaria-api` tem o contrato da API escrito, e uma API que o cumpre, organizada em camadas, cada uma no seu ficheiro:

```text
papelaria-api/
├── contrato-da-api.md                 o contrato: o que a API aceita e o que responde
└── src/
    ├── server.js                      o arranque, que monta as rotas
    ├── dados/
    │   └── artigos.dados.js           os artigos, por agora num array
    ├── services/
    │   └── artigos.service.js         as regras da papelaria
    ├── controllers/
    │   └── artigos.controller.js      o HTTP dos artigos
    └── rotas/
        └── artigos.rotas.js           que pedido vai para que função
```

No caderno, ficam duas tabelas de verificação, com o que previste e o que obtiveste em cada pedido. Ficas a saber escrever o contrato de uma API, cumpri-lo e verificá-lo, e separar o código em camadas ligadas com `import` e `export`.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | O `contrato-da-api.md` | O contrato dos pedidos e dos erros, com a tua decisão sobre um caso que ele não resolvia |
| 2 | O `src/server.js`: os artigos, a conversão dos números e as três rotas, primeiro pela ordem errada | A primeira versão responde a todos os pedidos do contrato |
| 3 | A primeira tabela de verificação | A primeira versão verificada, que fica de referência |
| 4 | Os dados e o service, em ficheiros próprios | As regras da papelaria experimentadas sem servidor |
| 5 | O controller | O HTTP dos artigos num ficheiro próprio |
| 6 | As rotas, num router, e o `server.js` que as monta | A API responde pelas camadas, com as mesmas respostas |
| 7 | Três erros de módulos, provocados e corrigidos | Sabes ler as mensagens de um `import` errado |
| 8 | O middleware final | Todos os erros da API com a forma do contrato |
| 9 | A segunda tabela de verificação | A API cumpre o contrato, pedido a pedido |
| 10 | O commit | O segundo commit no histórico |

## Palavras que vais usar

- Contrato de uma API: o documento que diz, para cada pedido, o método e o caminho, os parâmetros e todas as respostas possíveis, incluindo as de erro. Para saber mais, vê a secção "O que é o contrato de uma API" do [guia](04-api-express-e-contratos.md).
- Parâmetro de pesquisa: um valor que vem depois do `?` no endereço, como `categoria` em `?categoria=Papel`; lê-se em `req.query`, e chega sempre como texto.
- Parâmetro de caminho: um valor que vem dentro do caminho, como o `2` em `/api/artigos/2`; lê-se em `req.params`, e também chega como texto.
- Verificar à entrada: confirmar, no princípio da função que trata o pedido, que os valores que chegaram servem, antes de os usar.
- `NaN`: "não é um número", o que o `Number` devolve quando o texto não é um número.
- Módulo: cada ficheiro `.js` de um projeto com `"type": "module"`; o que lá se declara fica fechado lá dentro.
- `export` e `import`: o `export` deixa um nome ser usado por outros ficheiros; o `import` pede-o, com o caminho do ficheiro.
- `export default`: exporta uma só coisa, sem nome, que se importa sem chavetas.
- Router (em português, encaminhador): um conjunto de rotas que se monta, todo de uma vez, num caminho do servidor.
- Camadas: as rotas dizem que pedido vai para que função; o controller trata o HTTP; o service tem as regras da papelaria; os dados guardam os artigos. Para saber mais, vê a secção "As camadas em código" do [guia](04-api-express-e-contratos.md).
- Middleware final: a função registada com `app.use`, sem caminho, que responde aos pedidos que nenhuma rota tratou.
- Repository: a camada que vai buscar os dados à base de dados, e a única que usa o Mongoose para isso. Só aparece neste laboratório no caminho do cinema; na papelaria, chega no tema seguinte.

## O que precisas

- O projeto `papelaria-api` do laboratório do tema anterior, com o `.env`, o `npm run dev` a funcionar e o primeiro commit feito. Se não o tiveres, copia a pasta [papelaria-api](../exemplos/acesso-a-dados/papelaria-api/README.md) dos exemplos para a tua pasta de trabalho. Dentro dela, corre `npm install`, cria o `.env` a partir do `.env.example` e faz o `git init` e o primeiro commit, como na fase 6 desse laboratório.
- Se fizeste a ficha do cinema da escola, de Sistemas de Informação, podes fazer este laboratório no projeto `cinema-da-escola`, em vez da papelaria. Nesse caso, lê primeiro a secção "Se vens do projeto do cinema da escola".
- O Node.js e o npm. Confirma com `node --version` e `npm --version`; devem aparecer dois números de versão, o do Node a começar por `v`.
- Um editor de código e dois terminais: um para a API, outro para os comandos.
- O browser, com as ferramentas de programador (F12) no separador "Rede" (ou "Network"), para veres o código de cada resposta.
- O caderno, para as previsões e as duas tabelas de verificação.

Antes de começares, liga a API com `npm run dev` e deixa-a ligada. Com o `--watch`, ela reinicia sozinha sempre que guardas um ficheiro que ela já usa. Mantém o terminal à vista, porque é lá que os erros aparecem.

## Se alguma coisa falhar

1. Estás na pasta certa? Os comandos correm-se na pasta `papelaria-api`, onde está o `package.json`. `pwd` mostra a pasta atual (no Windows, na linha de comandos clássica, `cd`, sem mais nada).
2. Guardaste o ficheiro? O `--watch` só reinicia a API depois de guardares.
3. A API arrancou? Depois de guardares um ficheiro que a API já usa, o terminal tem de voltar a mostrar `API a correr em http://localhost:3000`. Nas fases 4 e 5, os ficheiros novos ainda não a fazem reiniciar, e está certo. Se mostrar um erro, a mensagem diz o ficheiro e, quase sempre, a linha.
4. A resposta não é a que esperavas? Compara com o contrato, linha a linha, e procura a diferença no código da camada que decide essa parte da resposta.

## Se a tua API veio de Sistemas de Informação

Em Sistemas de Informação construíste a API da papelaria num só ficheiro, e no tema anterior transformaste-a num projeto. O teu `src/server.js` já tem boa parte da primeira versão deste tema. Tem os oito artigos, a rota `GET /api/artigos` com o filtro por categoria e a rota `GET /api/artigos/:id` com o 400 e o 404. Tem também o middleware de registo, a rota de estado e o middleware final, que responde em JSON. Faltam-lhe a função `paraInteiro`, o filtro `stockMaximo` e a rota dos artigos a encomendar. Este laboratório completa esse ficheiro, em vez de o escrever de novo, e depois separa-o em camadas, como no caminho normal.

Antes de começares, confirma que o teu `src/server.js` tem estas peças, por esta ordem:

- o `import` do Express, a `app` e a `PORTA` lida do ambiente (a `app` e a `PORTA` podem estar pela ordem inversa);
- o array dos artigos;
- o middleware de registo e a rota de estado;
- as duas rotas dos artigos;
- o middleware final e o `app.listen`.

Confirma também que o `git log --oneline` mostra o primeiro commit, do tema anterior. Se faltar alguma destas peças, chama o professor. Quem não tiver a API de Sistemas de Informação faz o laboratório pelo caminho normal, a partir do esqueleto.

As fases 1, 4, 7 e 10 fazem-se como estão. As outras têm as diferenças que vêm a seguir. Como a tua primeira versão já vem quase feita, é provável que acabes a fase 3 antes do fim da primeira aula. Nesse caso, começa logo a fase 4.

### Fase 2, no teu projeto: o que falta à primeira versão

1. O array dos artigos já está no teu `server.js`, desde Sistemas de Informação. Não o copies outra vez. Faz só o passo 2 da fase 2, que confirma que os artigos são os mesmos que tens no Atlas.

2. A seguir ao array, acrescenta a função `paraInteiro` do passo 3 da fase 2, com o comentário que a acompanha.

3. Na rota de detalhe, troca a verificação que escreveste em Sistemas de Informação. A linha `const id = Number(req.params.id);` passa a `const id = paraInteiro(req.params.id);`, e a condição do 400, `!Number.isInteger(id) || id < 1`, passa a `id === null || id < 1`. Escreve no caderno, numa frase, porque mudas uma verificação que já funcionava.

   A resposta: para usar a mesma verificação nos dois parâmetros que são números, e porque a do `stockMaximo` tem de recusar o texto vazio. Para o `id`, a verificação de Sistemas de Informação chegava. Um `id` só com espaços dava 0, que fica abaixo de 1 e dá 400 na mesma. Para o `stockMaximo` não chega, porque lá o 0 é um valor válido, e o `Number("")` daria 0 sem ninguém o ter escrito.

4. Agora a rota da lista. A tua aplica um filtro e acaba logo ali, com `res.json` e `return`. O contrato acrescenta-lhe um segundo filtro, o `stockMaximo`, e um pedido pode trazer os dois ao mesmo tempo, como `/api/artigos?categoria=Papel&stockMaximo=4`. Antes de mudares o código, responde no caderno. Imagina que acrescentavas o `stockMaximo` noutro `if`, igual ao da categoria e a seguir a ele, com o seu próprio `res.json` e `return`. Que artigos responderia a tua rota a esse pedido? E quais deviam ser, pelo contrato?

   A resposta: o pedido entrava no `if` da categoria, que responde e acaba ali. A rota devolvia os três artigos de papel, o caderno (12), o bloco de notas (0) e a resma (4), e o `stockMaximo` era ignorado sem erro nenhum. Pelo contrato, deviam ser só o bloco de notas e a resma. Com os dois `if` trocados, ignorava-se a categoria, e vinham os quatro artigos com stock até 4, de todas as categorias. Dois filtros que se podem juntar não cabem em ramos que respondem cada um por si. Têm de reduzir o mesmo resultado, um a seguir ao outro, com uma só resposta no fim.

5. Reescreve a rota da lista como a do passo 4 da fase 2. O resultado começa com todos os artigos, num `let`, e cada filtro que veio no pedido vai-o reduzindo. Só no fim há um `res.json`. Não deixes ficar o `if (categoria)` antigo, com o seu `return`, acima do `let`.

6. No passo 5 da fase 2, escreve só a rota dos artigos a encomendar, a seguir à tua rota de detalhe, que já existe. Depois faz os passos 6 a 9. Vês o 400, e passas a rota nova para antes da de detalhe. As duas ficam entre a rota da lista e o middleware final, que continua no fim do ficheiro.

### Fase 3, no teu projeto

Faz a fase 3 como está, com uma diferença no passo 4. O teu `/api/artigo` não mostra a página do Express. O teu servidor tem o middleware final desde Sistemas de Informação, e por isso responde `{"erro":"Rota não encontrada"}`, com 404, que é o que o contrato pede. A tua primeira versão cumpre todas as linhas do contrato, incluindo essa. Regista-o na tabela.

No passo 5, compara o que a rota reescrita responde ao `?categoria=` com o que a tua rota de Sistemas de Informação respondia, com o `if (categoria)`. Escreve no caderno porque são diferentes.

A resposta: a rota reescrita responde 200 com `[]`, e a de Sistemas de Informação respondia 200 com os oito artigos. No `if (categoria)`, o texto vazio conta como falso, e a rota não filtrava. Na rota reescrita, o texto vazio não é `undefined`, entra no filtro, e nenhum artigo tem a categoria vazia. O que conta é o teu contrato. Se a rota não o cumpre, muda a rota, como no passo 5 da fase 3.

### Fase 5, no teu projeto

No passo 3, compara a `listar` com a rota da lista do teu `server.js` no fim da fase 3, que já cumpria o teu contrato. Se as duas responderem de forma diferente ao `?categoria=`, muda a `listar`, para o controller cumprir o mesmo contrato.

### Fase 6, no teu projeto: o que fica no server.js

No passo 2, apaga do `server.js` o array, a `paraInteiro` e as três rotas dos artigos, como no caminho normal. Deixa ficar o middleware de registo e o middleware final, além da rota de estado. O `import` do router fica a seguir ao `import` do Express, e o `app.use("/api/artigos", artigosRotas)` fica depois da rota de estado e antes do middleware final. No fim desta fase, o teu `server.js` tem os dois `import`, a `app` e a `PORTA`, o middleware de registo e a rota de estado. A seguir vêm o `app.use` das rotas, o middleware final e o `app.listen`.

No passo 4, o terminal continua a mostrar uma linha por pedido, com o endereço completo, como `GET /api/artigos/abaixo-do-minimo`, porque o middleware de registo está antes do router.

### Fase 8, no teu projeto: a ordem do middleware final

O teu middleware final já existe, e a fase 3 mostrou que o `/api/artigo` já responde em JSON. Em vez dos passos da fase 8:

1. Lê a introdução da fase 8, que explica porque é que todas as respostas de erro têm a mesma forma.
2. Confirma que o middleware final está depois do `app.use` das rotas.
3. Provoca um erro de propósito. Muda o `app.use("/api/artigos", artigosRotas)` para depois do middleware final, logo antes do `app.listen`. Prevê o que respondem `/api/estado` e `/api/artigos/2`. Guarda e abre os dois.

   O que deves ver: `/api/estado` responde como sempre, porque a rota de estado está acima do middleware final. `/api/artigos/2` dá `{"erro":"Rota não encontrada"}`, com 404. O middleware final responde a todos os pedidos que lhe chegam e não os passa à frente, por isso o router, abaixo dele, nunca é usado. É a regra da ordem do middleware de Sistemas de Informação, aplicada agora a um router.

4. Repõe o `app.use` das rotas antes do middleware final e confirma que `/api/artigos/2` volta a responder.

### Fase 9, no teu projeto

No passo 5, todas as linhas que estão nas duas tabelas têm de dar as mesmas respostas, incluindo o `/api/artigo`, que já vinha em JSON na primeira versão.

## Se vens do projeto do cinema da escola

Na [ficha do cinema da escola](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/01-aplicacoes-em-browser/04-ejs-e-reutilizacao-no-servidor-exercicios-cinema.md), de Sistemas de Informação, construíste uma aplicação num só ficheiro, com os filmes lidos do MongoDB Atlas. Tem a lista com os filtros, um filme de cada vez e o cartaz. Podes fazer este laboratório nesse projeto, em vez da papelaria. Escreves o contrato da API do cinema e separas o teu `server.js` em camadas, sem mudar nenhuma resposta. Como os filmes já vêm do Atlas, há uma camada a mais do que na papelaria: o repository, a camada que vai buscar os filmes à base de dados. Na papelaria, ele só chega no tema seguinte.

No fim, o teu projeto fica assim. Os ficheiros que não mudam estão na ficha:

```text
cinema-da-escola/
├── contrato-da-api.md                 o contrato: o que a API aceita e o que responde
├── src/
│   ├── server.js                      o arranque, que monta as rotas e o cartaz
│   ├── seed.js                        não muda
│   ├── db/
│   │   └── mongoose.js                não muda
│   ├── models/
│   │   └── filme.model.js             não muda
│   ├── repositories/
│   │   └── filmes.repository.js       o acesso aos filmes na base de dados
│   ├── services/
│   │   └── filmes.service.js          as regras do clube de cinema
│   ├── controllers/
│   │   └── filmes.controller.js       o HTTP da API e do cartaz
│   └── rotas/
│       └── filmes.rotas.js            que pedido da API vai para que função
└── views/
    └── cartaz.ejs                     não muda
```

Antes de começares, confirma três coisas:

- Na pasta `cinema-da-escola`, o `npm run dev` escreve `Ligada à base de dados cinema` e `Cinema da escola em http://localhost:3000`.
- O teu `src/server.js` tem estas peças, por esta ordem. Primeiro, os três `import`: o do Express, o da ligação e o do modelo. Depois, a `app` e a `PORTA`, o `app.set` do EJS, o middleware de registo e a rota de estado. A seguir, as rotas `/api/filmes`, `/api/filmes/:numero` e `/cartaz`. No fim, o middleware final, a ligação à base e o `app.listen`.
- O `git log --oneline` mostra o primeiro commit do cinema. Se ainda não o fizeste, faz a fase 6 do laboratório do tema anterior na pasta do cinema. O `.gitignore` já existe desde o exercício 1 da ficha, por isso o `.env` e a `node_modules` não aparecem na lista do `git status`.

Este caminho precisa de internet em todas as fases, porque a aplicação só arranca depois de se ligar ao Atlas. Se a rede falhar, segue o caminho normal, com a papelaria, que funciona sem rede. Se faltar alguma das peças, chama o professor.

Se fizeste os exercícios 6 e 7 da ficha, o teu código tem mais duas peças, que este laboratório não escreve por ti. São o filtro da duração máxima, na API, e a idade no cartaz. As fases 4 e 5 dizem para onde vai cada parte, e és tu que mudas o teu código de sítio. Se não os fizeste, segue só os blocos de código do laboratório.

Em todas as fases, lê primeiro a introdução da fase do caminho normal, que explica a ideia nova, e depois faz os passos que estão aqui. A fase 7 faz-se como está, só com os nomes dos ficheiros do cinema.

### Fase 1, no teu projeto: o contrato do cinema

1. Na raiz do projeto, ao lado do `package.json`, cria o ficheiro `contrato-da-api.md`, como no passo 1 da fase 1.

2. Escreve no contrato as secções que se seguem. Escreve-as tu, linha a linha, e pergunta-te, em cada linha, o que ela obriga a API a fazer.

   **Formato dos erros.** Todas as respostas de erro da API têm esta forma, com uma mensagem para quem usa a aplicação:

   ```json
   { "erro": "Não existe o filme 9" }
   ```

   **O filme.** Cada filme, nas respostas, tem esta forma:

   ```json
   { "sessao": { "dia": "18 de novembro", "hora": "15:30" }, "_id": "6ae11910bf8e13468ada5528", "numero": 3, "titulo": "Os Goonies", "genero": "Aventura", "duracaoMinutos": 114, "idadeMinima": 12, "__v": 0 }
   ```

   O `_id` é o identificador que o MongoDB deu ao documento, e o teu é outro. O `__v` é o número de versão que o Mongoose acrescenta. O `numero` é o número que o clube deu ao filme, um inteiro de 1 para cima, e é por ele que se pede um filme.

   **GET /api/estado.** Confirma que a API está ligada. Sem parâmetros.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | sempre | `{ "estado": "ok", "aplicacao": "Cinema da escola" }` |

   **GET /api/filmes.** Lista os filmes.

   | Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
   | --- | --- | --- | --- | --- |
   | `genero` | pesquisa | texto | não | qualquer; só aparecem os filmes desse género |
   | `idade` | pesquisa | inteiro | não | 1 ou mais; só aparecem os filmes que um aluno dessa idade pode ver, com a idade mínima até esse valor, incluído |

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | os parâmetros são válidos | lista de filmes, possivelmente vazia |
   | 400 | `idade` não é um número inteiro maior do que 0 | erro |

   **GET /api/filmes/:numero.** Mostra um filme.

   | Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
   | --- | --- | --- | --- | --- |
   | `numero` | caminho | inteiro | sim | 1 ou mais |

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | o filme existe | o filme |
   | 400 | o `numero` não é um inteiro positivo | erro |
   | 404 | não existe nenhum filme com esse `numero` | erro |

   **Qualquer outro pedido.**

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 404 | não há nenhuma rota com esse método e esse caminho | `{ "erro": "Rota não encontrada" }` |

   Se fizeste o exercício 6 da ficha, acrescenta à tabela dos parâmetros de `GET /api/filmes` a linha do `duracaoMaxima`. Vem na pesquisa, é um inteiro e não é obrigatório. Os valores válidos são 1 ou mais, e só aparecem os filmes que duram esse número de minutos ou menos. Acrescenta também, na linha do 400, o `duracaoMaxima` que não é um número inteiro maior do que 0.

3. O contrato deixa um caso por decidir: o pedido `/api/filmes?idade=`, com o parâmetro `idade` presente, mas sem valor. Decide o que a API deve responder, com que código e com que corpo, e escreve a tua decisão no contrato, na secção de `GET /api/filmes`. No caderno, escreve porque escolheste essa resposta. Pensa em quem pode fazer este pedido. Pode ser alguém que se esqueceu de escrever o número, ou um formulário com uma opção "qualquer idade", que envia o campo vazio. Escreve a tua decisão antes de leres a resposta.

   A resposta: há duas decisões defensáveis, e qualquer uma serve, desde que esteja escrita no contrato e que o código a cumpra.

   | Decisão | Argumento a favor |
   | --- | --- |
   | 200 com os filmes, como se a `idade` não viesse | Um formulário com a opção "qualquer idade" envia o campo vazio, e quem o usa quer os filmes todos |
   | 400 | É o tratamento do `?stockMaximo=` vazio da papelaria: quem pediu esqueceu-se do valor, e a API diz-lho, em vez de adivinhar |

   O que não pode acontecer é o contrato não dizer nada sobre este caso. A fase 2 confronta a tua decisão com o código.

#### Paragem 1, no teu projeto

O `contrato-da-api.md` tem o formato dos erros, a forma do filme, os três pedidos, a resposta a qualquer outro pedido e a tua decisão sobre o `?idade=`.

Pensa antes de continuares: o cartaz não entra no contrato. Porquê, se também responde a pedidos? A resposta: o contrato da API é para programas, como uma interface em React, que leem o JSON e têm de saber o que vão receber. O cartaz é uma página para pessoas. Quem a recebe é o browser, que a mostra, e não um programa que tenha de a interpretar.

### Fase 2, no teu projeto: a primeira versão já existe

A tua primeira versão é o `server.js` da ficha, e já cumpre quase todo o contrato. Não a escrevas outra vez. A ordem das rotas, que o caminho normal treina nesta fase, volta no desafio deste caminho.

1. Lê a rota de `/api/filmes` e descobre o que ela responde ao pedido `/api/filmes?idade=`. Escreve-o no caderno e confirma no browser.

   A resposta: 200, com os oito filmes. O `if (idade)` trata o texto vazio como falso, e a idade não filtra.

2. Se o teu contrato diz 400, na rota da lista, muda a linha `if (idade) {` para `if (idade !== undefined) {`. Antes de guardares, prevê o que responde agora `/api/filmes?idade=`, e porquê. Guarda e confirma no browser.

   A resposta: 400, com a mensagem da idade. O texto vazio não é `undefined`, por isso entra no `if`. Lá dentro, o `Number("")` dá 0, que fica abaixo de 1.

Pensa antes de continuares: na papelaria, o `Number("")` dava 0 sem ninguém o ter escrito, e foi preciso uma função própria, a `paraInteiro`. Porque é que no cinema a verificação da ficha chega? A resposta: porque no cinema o 0 nunca é um valor válido. A idade e o número do filme começam em 1, e a duração máxima também. O texto vazio dá 0, e o 0 é recusado pela condição `< 1`. Na papelaria, o `?stockMaximo=0` é um pedido válido, e o texto vazio passava por ele. Um parâmetro repetido, como `?idade=12&idade=14`, também é recusado, porque chega como um array, e o `Number` de um array com dois valores dá `NaN`.

### Fase 3, no teu projeto: verificar a primeira versão

Faz a fase 3 do caminho normal com estes pedidos, que são os do cinema.

1. Copia para o caderno esta coluna de pedidos e acrescenta-lhe duas colunas, "previsto" e "obtido": `/api/estado`, `/api/filmes`, `/api/filmes?genero=Aventura`, `/api/filmes?idade=10`, `/api/filmes?genero=Aventura&idade=10`, `/api/filmes?idade=doze`, `/api/filmes/3`, `/api/filmes/abc`, `/api/filmes/9`, `/api/filme` e `/cartaz?genero=Aventura`.

2. Preenche a coluna da previsão, só a olhar para o teu `contrato-da-api.md` e para o teu `server.js`.

3. Faz cada pedido no browser, com o separador Rede aberto, e preenche a coluna do obtido, com o código e o corpo.

   O que deves ver:

   | Pedido | Código | Resposta |
   | --- | --- | --- |
   | `/api/estado` | 200 | `{"estado":"ok","aplicacao":"Cinema da escola"}` |
   | `/api/filmes` | 200 | os oito filmes |
   | `/api/filmes?genero=Aventura` | 200 | Os Goonies e Jumanji |
   | `/api/filmes?idade=10` | 200 | Shrek, Toy Story e O Rei Leão |
   | `/api/filmes?genero=Aventura&idade=10` | 200 | `[]` |
   | `/api/filmes?idade=doze` | 400 | `{"erro":"A idade tem de ser um número inteiro maior do que 0"}` |
   | `/api/filmes/3` | 200 | Os Goonies |
   | `/api/filmes/abc` | 400 | `{"erro":"O número do filme tem de ser um número inteiro positivo"}` |
   | `/api/filmes/9` | 404 | `{"erro":"Não existe o filme 9"}` |
   | `/api/filme` | 404 | `{"erro":"Rota não encontrada"}` |
   | `/cartaz?genero=Aventura` | 200 | a página "Cartaz: Aventura", com Os Goonies e o Jumanji |

4. A tua primeira versão cumpre todas as linhas do contrato, incluindo o `/api/filme`, porque o middleware final já existe desde a ficha. Se fizeste os exercícios 6 e 7, acrescenta à tabela os pedidos das tabelas desses dois exercícios da ficha, com o que obtiveste. Na fase 9, têm de dar o mesmo.

#### Paragem 3, no teu projeto

A primeira versão está verificada, e a tabela do caderno é a referência para o resto do laboratório. As camadas não podem mudar nenhuma destas respostas.

Pensa antes de continuares: porque é que `/api/filmes?genero=Aventura&idade=10` responde 200 com uma lista vazia, e não com um erro? A resposta: os dois parâmetros são válidos, e o pedido está bem feito. Só que nenhum filme de aventura é para menos de 12 anos. Uma pesquisa sem resultados responde 200 com a lista vazia. O 404 fica para quando se pede uma coisa concreta que não existe, como o filme 9.

### Fase 4, no teu projeto: o repository e o service, e um teste sem servidor

A tua primeira versão mistura tudo. Na rota da lista, o `req.query` é HTTP. A regra "um aluno de 12 anos pode ver os filmes para 12" é do clube de cinema. O `Filme.find` e o `$lte` são da base de dados. E no cartaz o filtro do género volta a ser construído da mesma maneira. As camadas separam isto. Na papelaria, os artigos estão num array, e a separação começa pelos dados e pelo service. No cinema, os filmes estão no Atlas, e o lugar dos dados é ocupado por uma camada nova, o repository. É a única camada que usa o modelo `Filme` e que escreve filtros do MongoDB. O service fica com as regras do clube e pede os filmes ao repository. A ordem é a do caminho normal, de dentro para fora: primeiro o repository e o service, depois o controller, por fim as rotas e o `server.js`.

1. Dentro de `src`, cria a pasta `repositories` e, nela, o ficheiro `filmes.repository.js`, com este conteúdo:

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
   ```

   Leitura guiada: começa pelo `import` do modelo `Filme`. Depois da fase 6, é a única camada da aplicação que o importa. A `procurarFilmes` recebe as condições já com nomes do clube, como `idadeMinimaAte`, e transforma-as no filtro do MongoDB, o mesmo que escreverias na barra do Atlas. A `procurarPorNumero` é o `find` da tua rota de um filme, e devolve `null` quando não encontra. Não sabe o que é um 404. As duas são `async`, porque esperam pela base de dados, e quem as chama tem de usar o `await`.

   No `server.js`, não mudes nada por agora. As rotas de lá continuam a usar o modelo até à fase 6.

2. Cria a pasta `src/services` e, nela, o ficheiro `filmes.service.js`, com este conteúdo:

   ```js
   // src/services/filmes.service.js: as regras do clube de cinema sobre os filmes.
   // Recebe valores simples e devolve valores simples. Não sabe nada de HTTP,
   // nem de MongoDB: pede os filmes ao repository, com as condições que as
   // regras do clube dão.
   import { procurarFilmes, procurarPorNumero } from "../repositories/filmes.repository.js";

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
   ```

   Leitura guiada: o `import` pede as duas funções ao repository, dentro das mesmas chavetas, e os `..` sobem de `src/services/` para `src/`. A `listarFilmes` recebe os filtros como o controller os vai entregar, com a idade já em número, e escreve a regra da idade como uma condição: `idadeMinimaAte`. Não há nenhum `$lte` neste ficheiro. A `obterFilme` só passa o pedido ao repository. É curta, e existe para o controller nunca falar diretamente com o repository: cada camada conhece só a do lado. Se um dia o clube tiver uma regra sobre um filme, por exemplo esconder os de sessões que já passaram, é aqui que ela entra.

3. Se fizeste o exercício 6, a duração máxima passa pelas duas camadas que acabaste de escrever. No `listarFilmes`, copia `filtros.duracaoMaxima` para `condicoes.duracaoMinutosAte`, num `if` igual ao do género. No `procurarFilmes`, a condição que escreveste no filtro do teu `server.js` para a duração entra a seguir à da idade, a ler `condicoes.duracaoMinutosAte`. Acrescenta também os dois nomes novos à documentação das duas funções.

4. Na raiz do projeto, cria um ficheiro `experimentar-service.js`, com este conteúdo:

   ```js
   // experimentar-service.js: usa o service sem servidor e sem HTTP.
   // Precisa da base de dados, por isso liga-se a ela e desliga-se no fim, como
   // o seed. Serve só para este laboratório; apaga-o no fim da fase 4.
   import mongoose from "mongoose";
   import { ligarBaseDeDados } from "./src/db/mongoose.js";
   import { listarFilmes, obterFilme } from "./src/services/filmes.service.js";

   try {
     await ligarBaseDeDados();
     console.log("Todos:", (await listarFilmes({})).length);
     console.log("Aventura:", (await listarFilmes({ genero: "Aventura" })).map((filme) => filme.titulo));
     console.log("Para 10 anos:", (await listarFilmes({ idade: 10 })).map((filme) => filme.titulo));
     console.log("Filme 3:", (await obterFilme(3)).titulo);
     console.log("Filme 9:", await obterFilme(9));
   } catch (erro) {
     console.error(`A experiência falhou: ${erro.message}`);
   }

   await mongoose.disconnect();
   ```

   Leitura guiada: como o seed, o ficheiro liga-se à base antes de usar o service e desliga-se no fim. Sem o `disconnect`, o programa ficava à espera e não voltava ao terminal. Cada linha chama o service e escreve só o que interessa: quantos filmes vieram, os títulos, ou o `null` de um filme que não existe.

5. Antes de o correres, escreve no caderno o que esperas em cada uma das cinco linhas que começam pelo nome da experiência.

6. No segundo terminal, na raiz do projeto, corre o ficheiro com o `.env`, como o seed:

   ```bash
   node --env-file=.env experimentar-service.js
   ```

   O que deves ver:

   ```text
   Ligada à base de dados cinema
   Todos: 8
   Aventura: [ 'Os Goonies', 'Jumanji' ]
   Para 10 anos: [ 'Shrek', 'Toy Story', 'O Rei Leão' ]
   Filme 3: Os Goonies
   Filme 9: null
   ```

   Isto quer dizer que o service funciona sem servidor e sem HTTP. Ao contrário do da papelaria, precisa da base de dados, e por isso do `.env`. Sem o `--env-file=.env`, o ficheiro escreve `A experiência falhou: falta a MONGODB_URI no ficheiro .env`.

7. Compara com a tua previsão. Na linha "Para 10 anos", o service recebeu `{ idade: 10 }`, e nenhuma linha do service tem o `$lte`. Escreve no caderno quem o escreveu, e com que valor.

   A resposta: o repository. O service transformou a idade na condição do clube, `idadeMinimaAte: 10`, e o repository transformou essa condição no filtro do MongoDB, `{ idadeMinima: { $lte: 10 } }`.

8. Apaga o ficheiro `experimentar-service.js`. Ele mostrou o que interessava.

#### Paragem 4, no teu projeto

O repository e o service existem, e o service funciona sem servidor. A aplicação continua a responder com as rotas do `server.js`, como na fase 3.

Pensa antes de continuares: se o clube passasse os filmes para uma base de dados MariaDB, como as de Sistemas de Informação, que ficheiros mudavam? A resposta: o repository, a ligação e o modelo, que são os que usam o Mongoose. O service não mudava, porque não sabe que base de dados está por baixo. O controller e as rotas também não. É para isso que o repository existe.

### Fase 5, no teu projeto: o controller

No cinema, o mesmo controller serve a API, que responde em JSON, e o cartaz, que responde com uma página. As duas coisas são HTTP: ler o pedido, verificar o que chegou e escolher a resposta.

1. Cria a pasta `src/controllers` e, nela, o ficheiro `filmes.controller.js`, com este conteúdo. As verificações são as do teu `server.js`, tal como estão; as três funções exportadas são as três rotas, agora com nome e a chamar o service. Se, na fase 2, mudaste o `if (idade)` para cumprir o teu contrato, faz a mesma mudança na `listar`.

   ```js
   // src/controllers/filmes.controller.js: a ponte entre o HTTP e o service.
   // Lê e verifica o que vem no pedido, chama o service e escolhe a resposta:
   // JSON na API dos filmes, como diz o contrato, e uma página no cartaz.
   import { listarFilmes, obterFilme } from "../services/filmes.service.js";

   /** GET /api/filmes, com os filtros opcionais ?genero= e ?idade= */
   export async function listar(req, res) {
     const genero = req.query.genero;
     const idade = req.query.idade;

     // O objeto dos filtros começa vazio e só recebe o que o contrato prevê,
     // já verificado. O req.query nunca segue inteiro para o service.
     const filtros = {};
     if (genero) {
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
   ```

   Leitura guiada: o `import` pede duas funções ao service, e nenhuma ao repository nem ao modelo. A `listar` constrói o objeto `filtros` só com os parâmetros que o contrato prevê, com a idade já verificada e em número. A `obter` faz as duas verificações, primeiro 400 e depois 404, e traduz o `null` do service num 404. A `mostrarCartaz` é a tua rota do cartaz, agora com nome: o mesmo filtro do género, a mesma função do service, e o `res.render` em vez do `res.json`. As três são `async`, porque esperam pelo service.

2. Se fizeste o exercício 6, a verificação da duração máxima da tua rota da lista entra na `listar`, a seguir à da idade. O valor convertido segue no `filtros`, com o nome `duracaoMaxima`, que é o que o service lê.

3. Se fizeste o exercício 7, a tua rota do cartaz passa para a `mostrarCartaz`. A verificação da idade, a resposta 400 com a página e o título com as duas partes ficam lá, porque são o pedido e a página. Sai só a condição da idade que escreveste no filtro. A idade convertida segue no `filtros`, como na `listar`, e é o service que aplica a regra. Depois, responde no caderno: a verificação da idade está agora na `listar` e na `mostrarCartaz`. Porque é que não passou para o service, como a regra?

   A resposta: porque cada função responde de maneira diferente a uma idade inválida. A API responde com JSON, como diz o contrato, e o cartaz com uma página. Escolher a resposta é HTTP, e é do controller. O que deixou de estar repetido é a regra e a consulta, que agora estão uma só vez, no service e no repository.

4. Responde no caderno: na `listar`, porque é que o `filtros` começa vazio e só recebe o que veio no pedido? O que aconteceria se se passasse o `req.query` diretamente ao `listarFilmes`?

   A resposta: o `filtros` só recebe os parâmetros que o contrato prevê, já convertidos e verificados. Com o `req.query` passado diretamente, a idade chegava ao service como texto, sem verificação. E qualquer parâmetro que alguém inventasse seguiria até às camadas de baixo. No cinema, o que lá chega acaba num filtro do MongoDB. Passar o `req.query` inteiro seria deixar quem faz o pedido escrever a consulta.

Ainda não há nada de novo para ver no browser. Nenhuma rota chama o controller, e a aplicação continua a responder com as rotas do `server.js`.

#### Paragem 5, no teu projeto

O repository, o service e o controller estão nos seus ficheiros. A aplicação continua a responder como na fase 3.

Pensa antes de continuares: a `mostrarCartaz` responde com uma página, e não com JSON. Porque é que está no controller? A resposta: porque trata um pedido HTTP. Lê o `req.query`, verifica-o e escolhe a resposta. Uma página ou um JSON são só a forma da resposta. Como cada filme aparece continua a ser decidido pelo modelo `cartaz.ejs`, que não muda.

### Fase 6, no teu projeto: as rotas e o server.js que as monta

1. Cria a pasta `src/rotas` e, nela, o ficheiro `filmes.rotas.js`, com este conteúdo:

   ```js
   // src/rotas/filmes.rotas.js: que pedido da API dos filmes vai para que função do controller.
   // Os caminhos são relativos ao sítio onde este router é montado, em server.js:
   // "/" quer dizer /api/filmes, e "/:numero" quer dizer /api/filmes/:numero.
   import express from "express";
   import { listar, obter } from "../controllers/filmes.controller.js";

   const router = express.Router();

   router.get("/", listar);
   router.get("/:numero", obter);

   export default router;
   ```

   Leitura guiada: o router vai ser montado em `/api/filmes`, por isso `"/"` quer dizer `/api/filmes`, e `"/:numero"` quer dizer `/api/filmes/:numero`. Cada rota passa ao Express o nome de uma função do controller, sem a chamar. No fim, o `export default` exporta uma só coisa, o router, sem lhe dar nome. O cartaz não está aqui, porque não faz parte da API.

2. Substitui o conteúdo do `src/server.js` por este. Saem o `import` do modelo e as três rotas, que já estão nas camadas. Entram o `import` do router e o da `mostrarCartaz`, o `app.use` das rotas da API e a rota do cartaz. O resto fica como estava. Se fizeste os exercícios 6 e 7, o `server.js` é este na mesma, porque as tuas soluções já estão nas camadas.

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

   Leitura guiada: dos dois `import` novos, o do router não tem chavetas, porque o ficheiro das rotas tem um `export default`, e o nome `filmesRotas` é escolhido aqui. O da `mostrarCartaz` tem chavetas, porque pede um nome que o controller exporta. O `app.use("/api/filmes", filmesRotas)` quer dizer: os pedidos começados por `/api/filmes` seguem para este router. O `app.get("/cartaz", mostrarCartaz)` passa a função ao Express, sem a chamar, como dentro do router.

3. Guarda e confirma no terminal que a aplicação reiniciou sem erros, com `Ligada à base de dados cinema` e `Cinema da escola em http://localhost:3000`. Se houver um erro de `import` num dos ficheiros novos, é agora que aparece. É a primeira vez que o `server.js` carrega as rotas e o controller, que carrega o service, que carrega o repository.

4. Abre `/api/estado`, `/api/filmes?genero=Aventura`, `/api/filmes/3` e `/cartaz?genero=Aventura`. O que deves ver: as mesmas respostas da fase 3, que agora vêm das camadas. O terminal continua a mostrar uma linha por pedido, com o endereço completo, porque o middleware de registo está antes do router.

#### Paragem 6, no teu projeto

A aplicação responde pelas camadas. O `server.js` já não importa o modelo `Filme`, e nenhuma linha dele fala com a base de dados, a não ser a ligação no arranque.

Pensa antes de continuares: que ficheiros do teu projeto importam agora o modelo `Filme`, e porquê esses? A resposta: o repository e o seed. O repository é a camada da aplicação que fala com a base de dados. O seed não faz parte da aplicação: corre à parte, com o `npm run seed`, para pôr os filmes na base.

### Fase 7, no teu projeto

Faz a fase 7 como está, com os nomes do cinema. No passo 1, apaga o `.js` do `import` do controller, em `filmes.rotas.js`. No passo 2, muda o `listar` do mesmo `import` para `listarTodos`. No passo 3, no `server.js`, muda `import filmesRotas from` para `import { filmesRotas } from`. As mensagens são as da fase 7, com os nomes dos teus ficheiros: o caminho `src/controllers/filmes.controller`, sem o `.js`, `'../controllers/filmes.controller.js' does not provide an export named 'listarTodos'` e `'./rotas/filmes.rotas.js' does not provide an export named 'filmesRotas'`. Depois de cada correção, confirma que o terminal voltou a escrever `Cinema da escola em http://localhost:3000`.

### Fase 8, no teu projeto: a ordem do middleware final

O teu middleware final já existe desde a ficha, e a fase 3 mostrou que o `/api/filme` já responde em JSON. Em vez dos passos da fase 8:

1. Confirma que o middleware final está depois do `app.use` das rotas e da rota do cartaz.
2. Provoca um erro de propósito. Muda o `app.use("/api/filmes", filmesRotas)` para depois do middleware final, logo antes do `try` da ligação à base. Prevê o que respondem `/api/estado`, `/api/filmes/3` e `/cartaz?genero=Aventura`. Guarda e abre os três.

   O que deves ver: `/api/estado` e o cartaz respondem como sempre, porque as suas rotas estão acima do middleware final. `/api/filmes/3` dá `{"erro":"Rota não encontrada"}`, com 404. O middleware final responde a todos os pedidos que lhe chegam e não os passa à frente, por isso o router, abaixo dele, nunca é usado.

3. Repõe o `app.use` das rotas antes do middleware final e confirma que `/api/filmes/3` volta a responder.

### Fase 9, no teu projeto: verificar o contrato

1. Copia para o caderno a coluna dos pedidos abaixo e acrescenta-lhe três colunas: "código previsto", "código obtido" e "corpo confere com o contrato". Os pedidos são estes: `/api/filmes`, `/api/filmes?genero=Musical`, `/api/filmes?idade=10`, `/api/filmes?genero=Ficção científica&idade=14`, `/api/filmes?genero=Aventura&idade=10`, `/api/filmes?idade=doze`, `/api/filmes?idade=0`, `/api/filmes?idade=12.5`, `/api/filmes/3`, `/api/filmes/abc`, `/api/filmes/0`, `/api/filmes/9` e `/api/filme`.

2. Acrescenta duas linhas, para os dois pedidos do teu contrato que não estão nesta lista: o `/api/estado` e o `/api/filmes?idade=`, com a resposta que decidiste na fase 1. Se fizeste os exercícios 6 e 7, acrescenta também os pedidos das tabelas desses exercícios da ficha.

3. Preenche a coluna da previsão, só a olhar para o teu `contrato-da-api.md`.

4. Faz cada pedido no browser, com o separador Rede aberto, e preenche as outras duas colunas.

   O que deves ver:

   | Pedido | Código | Resposta |
   | --- | --- | --- |
   | `/api/filmes` | 200 | os oito filmes |
   | `/api/filmes?genero=Musical` | 200 | `[]` |
   | `/api/filmes?idade=10` | 200 | Shrek, Toy Story e O Rei Leão |
   | `/api/filmes?genero=Ficção científica&idade=14` | 200 | Regresso ao Futuro, Matrix e Interstellar |
   | `/api/filmes?genero=Aventura&idade=10` | 200 | `[]` |
   | `/api/filmes?idade=doze` | 400 | `{"erro":"A idade tem de ser um número inteiro maior do que 0"}` |
   | `/api/filmes?idade=0` | 400 | o mesmo erro |
   | `/api/filmes?idade=12.5` | 400 | o mesmo erro |
   | `/api/filmes/3` | 200 | Os Goonies |
   | `/api/filmes/abc` | 400 | `{"erro":"O número do filme tem de ser um número inteiro positivo"}` |
   | `/api/filmes/0` | 400 | o mesmo erro |
   | `/api/filmes/9` | 404 | `{"erro":"Não existe o filme 9"}` |
   | `/api/filme` | 404 | `{"erro":"Rota não encontrada"}` |
   | `/api/estado` | 200 | `{"estado":"ok","aplicacao":"Cinema da escola"}` |
   | `/api/filmes?idade=` | o que decidiste | a resposta do teu contrato |

5. Compara com a tabela da fase 3. Os pedidos que estão nas duas têm de dar as mesmas respostas, também o `/api/filme` e os dos exercícios 6 e 7, se os acrescentaste. As camadas mudaram a organização do código, e não o que a aplicação responde.

6. Se alguma linha não conferir, há um erro no código ou no contrato. Descobre qual, corrige-o e volta a verificar a linha. Um 400 que mudou procura-se primeiro no controller. Uma lista que mudou procura-se nas condições que o service passa e, depois, no filtro que o repository constrói.

No fim, a tabela tem de ter pelo menos um 200, um 400 e um 404 verificados.

### Fase 10, no teu projeto

Faz a fase 10 como está, com uma diferença. O `git status` mostra o `contrato-da-api.md`, as alterações ao `src/server.js` e as quatro pastas novas dentro de `src`. Não deve aparecer o `experimentar-service.js`, que apagaste, nem o `.env`. O commit leva esta mensagem:

```bash
git add .
git commit -m "Cinema: contrato e camadas, com o repository a falar com o Atlas"
git log --oneline
```

O que deves ver: o `git log` mostra agora dois commits, o primeiro do cinema e este.

### O desafio, no teu projeto

Os desafios do fim do laboratório são da papelaria. No cinema, faz este: um pedido novo, que devolve a lista dos géneros dos filmes, cada um só uma vez. Decide o caminho (por exemplo, `/api/generos` ou `/api/filmes/generos`), a camada de cada parte e a ordem dos géneros, e escreve-o no contrato antes do código. Pista: se o caminho começar por `/api/filmes`, pensa no que a rota `"/:numero"` faz a um pedido como `/api/filmes/generos`.

### Antes de terminares, no teu projeto

A lista do fim do laboratório vale também para ti, com três diferenças. A decisão do contrato é sobre o pedido `?idade=`. Na fase 4, a explicação que fica no caderno é a do `$lte`, que o service não escreve. E o `git log --oneline` mostra os dois commits do cinema. No fim, o professor vai pedir-te que escolhas uma linha da tabela da fase 9 e expliques o caminho desse pedido pelas camadas. No cinema, esse caminho acaba no repository e no Atlas.

## Fase 1: o contrato, antes do código

Uma API é usada por programas, como a tua interface em React, e um programa não consegue adivinhar. Precisa de saber exatamente o que pedir e o que vai receber, incluindo quando corre mal. O contrato de uma API diz isso, pedido a pedido. Diz o método e o caminho, e os parâmetros: onde vêm, de que tipo são e que valores servem. Diz também a resposta quando corre bem, e todas as respostas de erro. Escreve-se antes do código e obriga as duas partes: a API compromete-se a responder assim, e o cliente a pedir assim. E é com ele que se verifica a API. Se responde ao que o contrato diz, está certa. Para saber mais, lê a secção "O que é o contrato de uma API" do [guia](04-api-express-e-contratos.md).

1. Na raiz do projeto, ao lado do `package.json`, cria o ficheiro `contrato-da-api.md`. Escreve-o em Markdown, o formato destes documentos. Um título começa por `#`. Uma tabela escreve-se com uma linha de texto por cada linha da tabela, com `|` entre as colunas. Logo a seguir à linha dos títulos vem uma linha só com traços, como `| --- | --- | --- |`. Um bloco de JSON fica entre duas linhas de três acentos graves, a primeira com a palavra `json`.

2. Escreve no contrato as secções que se seguem. Escreve-as tu, linha a linha, e pergunta-te, em cada linha, o que ela obriga a API a fazer.

   **Formato dos erros.** Todas as respostas de erro têm esta forma, com uma mensagem para quem usa a aplicação:

   ```json
   { "erro": "Não existe o artigo 99" }
   ```

   **O artigo.** Cada artigo, nas respostas, tem esta forma:

   ```json
   { "id": 1, "nome": "Caderno A4 quadriculado", "categoria": "Papel", "stock": 12, "stockMinimo": 5, "precoCentimos": 250 }
   ```

   O `id` é um inteiro, de 1 para cima, e o preço vem em cêntimos: 250 são 2,50 €.

   **GET /api/estado.** Confirma que a API está ligada. Sem parâmetros.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | sempre | `{ "estado": "ok", "aplicacao": "API da papelaria" }` |

   **GET /api/artigos.** Lista os artigos.

   | Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
   | --- | --- | --- | --- | --- |
   | `categoria` | pesquisa | texto | não | qualquer; só aparecem os artigos dessa categoria |
   | `stockMaximo` | pesquisa | inteiro | não | 0 ou mais; só aparecem os artigos com stock até esse valor, incluído |

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | os parâmetros são válidos | lista de artigos, possivelmente vazia |
   | 400 | `stockMaximo` vem vazio (`?stockMaximo=`), não é um inteiro, ou é negativo | erro |

   **GET /api/artigos/abaixo-do-minimo.** Lista os artigos com o stock abaixo do stock mínimo, que é preciso encomendar. Sem parâmetros.

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | sempre | lista de artigos, possivelmente vazia |

   **GET /api/artigos/:id.** Mostra um artigo.

   | Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
   | --- | --- | --- | --- | --- |
   | `id` | caminho | inteiro | sim | 1 ou mais |

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 200 | o artigo existe | o artigo |
   | 400 | o `id` não é um inteiro positivo | erro |
   | 404 | não existe nenhum artigo com esse `id` | erro |

   **Qualquer outro pedido.**

   | Código | Quando | Corpo |
   | --- | --- | --- |
   | 404 | não há nenhuma rota com esse método e esse caminho | `{ "erro": "Rota não encontrada" }` |

3. O contrato deixa um caso por decidir: o pedido `/api/artigos?categoria=`, com o parâmetro `categoria` presente, mas sem valor. Decide o que a API deve responder a este pedido, com que código e com que corpo, e escreve a tua decisão no contrato, na secção de `GET /api/artigos`. No caderno, escreve porque escolheste essa resposta e não outra. Pensa em quem pode fazer este pedido. Pode ser alguém que se esqueceu de escrever a categoria, ou um formulário do React com uma opção "todas as categorias", que envia o campo vazio. Escreve a tua decisão antes de leres a resposta.

   A resposta: há três decisões defensáveis, e qualquer uma serve, desde que esteja escrita no contrato e que o código a cumpra.

   | Decisão | Argumento a favor |
   | --- | --- |
   | 200 com a lista vazia, porque nenhum artigo tem a categoria vazia | É o que o contrato diz, à letra: a categoria é um texto qualquer, e não precisa de código novo |
   | 200 com todos os artigos: a `categoria` vazia não filtra, como se não viesse | Um formulário com a opção "todas as categorias" envia o campo vazio, e quem o usa quer a lista toda |
   | 400 | É o tratamento do `?stockMaximo=` vazio: quem pediu esqueceu-se do valor, e a API diz-lho, em vez de adivinhar |

   O que não pode acontecer é o contrato não dizer nada sobre este caso. A fase 3 confronta a tua decisão com o código.

### Paragem 1

O `contrato-da-api.md` tem o formato dos erros, a forma do artigo, os quatro pedidos, a resposta a qualquer outro pedido e a tua decisão sobre o `?categoria=`. É uma das duas coisas que este tema te pede para entregar; a outra é a tabela de verificação da fase 9.

Pensa antes de continuares: porque é que o contrato não diz se os artigos estão num array ou no Atlas? A resposta: porque isso é decisão de quem escreve a API, e pode mudar sem o contrato mudar. É o que vai acontecer no tema seguinte, quando os artigos passarem para o Atlas. As respostas ficam iguais.

## Fase 2: tudo no server.js, com as rotas primeiro pela ordem errada

Antes de dividir a API em camadas, escreve-se uma primeira versão que cumpre o contrato com tudo no `src/server.js`, como os servidores de Sistemas de Informação. Quase tudo já o conheces de lá: o `app.get`, o `req.query` e o `req.params`, sempre como texto, o `res.status(...).json(...)` e o `return` depois de um erro. Há duas coisas novas. A primeira é verificar à entrada. A rota só lê os parâmetros que o contrato prevê, converte os números e responde 400 se não servirem. A segunda é uma armadilha. O `Number("")` dá 0, e não `NaN`. E há uma regra que já viste em Sistemas de Informação, a ordem das rotas. O Express experimenta-as pela ordem em que foram registadas, e a primeira que corresponder responde. Para saber mais, lê a secção "Primeira versão: tudo no server.js" do [guia](04-api-express-e-contratos.md).

1. No `src/server.js`, a seguir à linha `const app = express();`, acrescenta o array dos oito artigos. Este podes copiá-lo. São dados, e escrevê-los à mão não ensina nada.

   ```js
   // Os artigos da papelaria, em memória. São dados temporários: no tema da
   // ligação segura, passam a vir do MongoDB Atlas. São os mesmos que inseriste
   // no Atlas, com um id numérico em vez do _id.
   const artigos = [
     { id: 1, nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250 },
     { id: 2, nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60 },
     { id: 3, nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180 },
     { id: 4, nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35 },
     { id: 5, nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520 },
     { id: 6, nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95 },
     { id: 7, nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120 },
     { id: 8, nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450 },
   ];
   ```

2. Confirma com os artigos que tens no Atlas, do laboratório do modelo documental. Os nomes, as categorias, os stocks, os stocks mínimos e os preços têm de ser os mesmos. Só o `id` é diferente, e a `localizacao` ficou de fora, porque nenhum pedido do contrato a usa.

3. A seguir ao array, acrescenta a função `paraInteiro`, que converte um texto num inteiro, ou devolve `null` se o texto não for um inteiro:

   ```js
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
   ```

   Leitura guiada: o `Number` tira os espaços das pontas do texto e converte o que sobra: `Number("5")` dá 5, e `Number("abc")` dá `NaN`. Mas, se não sobrar nada, dá 0: `Number("")` e `Number("   ")` dão os dois 0. No pedido `/api/artigos?stockMaximo=`, o parâmetro vem vazio; sem a verificação, a API trataria o pedido como `?stockMaximo=0`, e inventava um número que ninguém escreveu. Por isso a função recusa primeiro o texto vazio, com o `trim()`, que devolve o texto sem os espaços das pontas. O `typeof` diz o tipo de um valor: para um texto, é `"string"`. O `typeof texto !== "string"` protege de outro caso. Um parâmetro repetido, como `?stockMaximo=1&stockMaximo=2`, chega como um array, e um array não tem `trim`. Como a condição usa `||`, se a primeira metade for verdadeira, o JavaScript já não olha para a segunda, e o `trim` nunca é chamado sobre o array. No fim, o `Number.isInteger` confirma que o número é inteiro. A última linha usa o operador `? :`: `condição ? a : b` dá `a` se a condição for verdadeira, e `b` se não for. Aqui, se o número for inteiro, a função devolve-o; se não, devolve `null`.

4. A seguir à rota de estado, acrescenta a rota `GET /api/artigos`:

   ```js
   // GET /api/artigos, com os filtros opcionais ?categoria= e ?stockMaximo=.
   // Só se leem os dois parâmetros que o contrato prevê; os outros são ignorados.
   app.get("/api/artigos", (req, res) => {
     let resultado = artigos;

     if (req.query.categoria !== undefined) {
       resultado = resultado.filter((artigo) => artigo.categoria === req.query.categoria);
     }

     if (req.query.stockMaximo !== undefined) {
       const stockMaximo = paraInteiro(req.query.stockMaximo);
       if (stockMaximo === null || stockMaximo < 0) {
         res.status(400).json({ erro: "O parâmetro stockMaximo tem de ser um número inteiro, zero ou maior" });
         return;
       }
       resultado = resultado.filter((artigo) => artigo.stock <= stockMaximo);
     }

     res.json(resultado);
   });
   ```

   Leitura guiada: o resultado começa com todos os artigos, num `let`, e cada filtro que veio no pedido vai-o reduzindo, um a seguir ao outro. Só se leem os dois parâmetros que o contrato prevê. Um parâmetro como `?ordem=preco` é ignorado. O `stockMaximo` passa pela `paraInteiro`, e se não servir a rota responde 400, e o `return` acaba ali o pedido. Sem filtros, a rota devolve os oito artigos.

5. A seguir à rota da lista, e antes do `app.listen`, acrescenta as outras duas rotas do contrato, mas com uma diferença de propósito. Escreve primeiro a rota de um artigo, e só depois a dos artigos a encomendar, ao contrário do que devia ser. Primeiro, esta:

   ```js
   // GET /api/artigos/:id
   app.get("/api/artigos/:id", (req, res) => {
     const id = paraInteiro(req.params.id);
     if (id === null || id < 1) {
       res.status(400).json({ erro: "O identificador do artigo tem de ser um número inteiro positivo" });
       return;
     }
     const artigo = artigos.find((artigo) => artigo.id === id);
     if (!artigo) {
       res.status(404).json({ erro: `Não existe o artigo ${id}` });
       return;
     }
     res.json(artigo);
   });
   ```

   E, a seguir a ela, esta:

   ```js
   // GET /api/artigos/abaixo-do-minimo. O caminho fixo vem antes do caminho com
   // parâmetro. Ao contrário, /abaixo-do-minimo seria tratado como um :id, e daria 400.
   app.get("/api/artigos/abaixo-do-minimo", (req, res) => {
     // Regra da papelaria: um artigo está abaixo do mínimo quando o stock é
     // menor do que o stock mínimo definido para ele, e é preciso encomendá-lo.
     const aEncomendar = artigos.filter((artigo) => artigo.stock < artigo.stockMinimo);
     res.json(aEncomendar);
   });
   ```

   Leitura guiada: a rota de um artigo faz duas verificações, como a rota de detalhe de Sistemas de Informação. Primeiro, se o `id` faz sentido (400); depois, se o artigo existe (404). A dos artigos a encomendar aplica a regra da papelaria: o stock menor do que o stock mínimo.

6. Guarda e confirma no terminal que a API reiniciou sem erros.

7. Abre `http://localhost:3000/api/artigos/2`. O que deves ver: a esferográfica azul.

8. Prevê o que dá `http://localhost:3000/api/artigos/abaixo-do-minimo`. Depois abre-o.

   O que deves ver: 400, com `{"erro":"O identificador do artigo tem de ser um número inteiro positivo"}`. O pedido foi parar à rota de um artigo, porque `/api/artigos/:id` estava primeiro e aceita qualquer texto no lugar do `:id`, incluindo `abaixo-do-minimo`. Essa rota tentou converter `abaixo-do-minimo` num número, não conseguiu, e respondeu 400. A rota certa nunca chegou a correr.

9. Muda a ordem: a rota com o caminho fixo, `/api/artigos/abaixo-do-minimo`, antes da rota com o parâmetro. O que deves ver: `/api/artigos/abaixo-do-minimo` responde 200, com os quatro artigos a encomendar.

### Paragem 2

A primeira versão está escrita. O `src/server.js` completo, como deve estar agora:

```js
// src/server.js: a API da papelaria, primeira versão, com tudo neste ficheiro.
// Os dados, a verificação dos pedidos, as regras da papelaria e as respostas
// estão juntos, como nos servidores de Sistemas de Informação. A versão
// seguinte separa-os em camadas, sem mudar nenhuma das respostas.
import express from "express";

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, a API usa a 3000.
const PORTA = process.env.PORT || 3000;

const app = express();

// Os artigos da papelaria, em memória. São dados temporários: no tema da
// ligação segura, passam a vir do MongoDB Atlas. São os mesmos que inseriste
// no Atlas, com um id numérico em vez do _id.
const artigos = [
  { id: 1, nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250 },
  { id: 2, nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60 },
  { id: 3, nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180 },
  { id: 4, nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35 },
  { id: 5, nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520 },
  { id: 6, nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95 },
  { id: 7, nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120 },
  { id: 8, nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450 },
];

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

// Rota de estado: serve para confirmar que a API está ligada e a responder.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "API da papelaria" });
});

// GET /api/artigos, com os filtros opcionais ?categoria= e ?stockMaximo=.
// Só se leem os dois parâmetros que o contrato prevê; os outros são ignorados.
app.get("/api/artigos", (req, res) => {
  let resultado = artigos;

  if (req.query.categoria !== undefined) {
    resultado = resultado.filter((artigo) => artigo.categoria === req.query.categoria);
  }

  if (req.query.stockMaximo !== undefined) {
    const stockMaximo = paraInteiro(req.query.stockMaximo);
    if (stockMaximo === null || stockMaximo < 0) {
      res.status(400).json({ erro: "O parâmetro stockMaximo tem de ser um número inteiro, zero ou maior" });
      return;
    }
    resultado = resultado.filter((artigo) => artigo.stock <= stockMaximo);
  }

  res.json(resultado);
});

// GET /api/artigos/abaixo-do-minimo. O caminho fixo vem antes do caminho com
// parâmetro. Ao contrário, /abaixo-do-minimo seria tratado como um :id, e daria 400.
app.get("/api/artigos/abaixo-do-minimo", (req, res) => {
  // Regra da papelaria: um artigo está abaixo do mínimo quando o stock é
  // menor do que o stock mínimo definido para ele, e é preciso encomendá-lo.
  const aEncomendar = artigos.filter((artigo) => artigo.stock < artigo.stockMinimo);
  res.json(aEncomendar);
});

// GET /api/artigos/:id
app.get("/api/artigos/:id", (req, res) => {
  const id = paraInteiro(req.params.id);
  if (id === null || id < 1) {
    res.status(400).json({ erro: "O identificador do artigo tem de ser um número inteiro positivo" });
    return;
  }
  const artigo = artigos.find((artigo) => artigo.id === id);
  if (!artigo) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
});

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a API: ${erro.message}`);
    return;
  }
  console.log(`API a correr em http://localhost:${PORTA}`);
});
```

Pensa antes de continuares: se o mesmo parâmetro vier duas vezes, como em `?stockMaximo=1&stockMaximo=2`, o que recebe a `paraInteiro`, e o que responde a API? A resposta: a `paraInteiro` recebe um array com os dois textos, `["1", "2"]`. O `typeof` vê que não é um texto, a função devolve `null`, e a API responde 400, com a mensagem do contrato. Sem o `typeof`, o `trim` falhava sobre o array, e a API respondia com um erro 500.

## Fase 3: verificar a primeira versão

Cada linha do contrato diz o que a API responde a um pedido, e por isso cada linha se pode verificar. Faz-se o pedido e compara-se a resposta. Antes de cada pedido, prevês o código e a resposta, só com o contrato e o código à frente. Esta primeira tabela fica de referência. Na fase 4 o código começa a mudar de ficheiro, e as respostas têm de continuar as mesmas. Para saber mais, lê o passo 2 do exemplo guiado do [guia](04-api-express-e-contratos.md).

1. Copia para o caderno esta coluna de pedidos e acrescenta-lhe duas colunas, "previsto" e "obtido": `/api/estado`, `/api/artigos`, `/api/artigos?categoria=Papel&stockMaximo=4`, `/api/artigos?stockMaximo=`, `/api/artigos/2`, `/api/artigos/abc`, `/api/artigos/99`, `/api/artigos/abaixo-do-minimo` e `/api/artigo`.

2. Preenche a coluna da previsão, só a olhar para o teu `contrato-da-api.md` e para o teu `server.js`.

3. Faz cada pedido no browser, com o separador Rede aberto, e preenche a coluna do obtido, com o código e o corpo.

   O que deves ver:

   | Pedido | Código | Resposta |
   | --- | --- | --- |
   | `/api/estado` | 200 | `{"estado":"ok","aplicacao":"API da papelaria"}` |
   | `/api/artigos` | 200 | os oito artigos |
   | `/api/artigos?categoria=Papel&stockMaximo=4` | 200 | o bloco de notas (0) e a resma (4) |
   | `/api/artigos?stockMaximo=` | 400 | `{"erro":"O parâmetro stockMaximo tem de ser um número inteiro, zero ou maior"}` |
   | `/api/artigos/2` | 200 | a esferográfica azul |
   | `/api/artigos/abc` | 400 | `{"erro":"O identificador do artigo tem de ser um número inteiro positivo"}` |
   | `/api/artigos/99` | 404 | `{"erro":"Não existe o artigo 99"}` |
   | `/api/artigos/abaixo-do-minimo` | 200 | a esferográfica, o bloco de notas, o marcador e o compasso |
   | `/api/artigo` | 404 | a página de erro do Express, em HTML, com `Cannot GET /api/artigo` |

4. Repara na última linha. O código, 404, está certo, mas o corpo é uma página HTML, e não o JSON com `erro` que o contrato promete. A página diz `Cannot GET /api/artigo` (não é possível obter `/api/artigo`). É a única linha do contrato que esta versão não cumpre, e fica assim de propósito. É o assunto da fase 8.

5. Volta à tua decisão sobre o pedido `?categoria=`. Lê a rota de `/api/artigos` e descobre o que ela responde a esse pedido, com que código e com que corpo. Escreve-o no caderno e confirma no browser, com `http://localhost:3000/api/artigos?categoria=`.

   A resposta: 200, com `[]`. O `req.query.categoria` é o texto vazio, que não é `undefined`, por isso entra no filtro, e nenhum artigo tem a categoria vazia. Se o teu contrato diz isto, a rota já o cumpre. Se diz outra coisa, muda a rota, e volta a abrir o pedido:

   - para responder com todos os artigos, a condição do filtro da categoria passa a `req.query.categoria !== undefined && req.query.categoria !== ""`;
   - para responder 400, acrescenta, antes do filtro da categoria, um `if (req.query.categoria === "")` que responde `res.status(400).json({ erro: "O parâmetro categoria, quando vem, não pode estar vazio" })`, seguido de `return`.

   É o código que se acerta pelo contrato, e não o contrário. O contrato foi escrito primeiro, e é com ele que vais verificar a API na fase 9.

### Paragem 3

A primeira versão responde ao que o contrato diz, menos ao `/api/artigo`, e a tabela do caderno é a referência para o resto do laboratório.

Pensa antes de continuares: na tabela, `/api/artigos/abc` dá 400, e `/api/artigos/99` dá 404. Porque é que não dão os dois 404? A resposta: `abc` nem sequer é um identificador válido, por isso o pedido está mal feito, e a API diz-o com um 400. O 99 é um identificador válido, mas não há nenhum artigo com ele. O pedido está bem feito, e o que se pediu não existe. Por isso a rota verifica primeiro o identificador, e só depois procura o artigo.

## Fase 4: os dados e o service, e um teste sem servidor

A primeira versão funciona, mas mistura tudo. Os dados, o HTTP e as regras da papelaria estão nas mesmas funções. Para experimentar a regra dos artigos a encomendar, tens de ligar a API e fazer o pedido. As camadas separam isto. A separação faz-se de dentro para fora: primeiro os dados e o service, depois o controller, por fim as rotas e o `server.js`. O código não se reescreve. Cada parte muda de ficheiro. Cada ficheiro é um módulo, e os módulos ligam-se com `import` e `export`. Num projeto com `"type": "module"`, o que se declara num ficheiro fica fechado lá dentro. O `export` deixa outro ficheiro usar um nome, e o `import` pede-o, com o caminho do ficheiro. Nos teus ficheiros, o caminho começa por `./` (a mesma pasta) ou `../` (a pasta de cima) e acaba sempre em `.js`. O service fica com as regras, sem saber nada de HTTP, e por isso pode ser usado sem servidor. Para saber mais, lê as secções "Os dados temporários" e "O service" do [guia](04-api-express-e-contratos.md).

1. Dentro de `src`, cria a pasta `dados` e, nela, o ficheiro `artigos.dados.js`, com este conteúdo. É o array do teu `server.js`, copiado, com `export` à frente do `const`:

   ```js
   // src/dados/artigos.dados.js: os artigos da papelaria, em memória.
   // São dados temporários: no tema da ligação segura, passam a vir do MongoDB Atlas.
   // Os artigos são os mesmos que inseriste no Atlas, com um id numérico em vez do _id.

   export const artigos = [
     { id: 1, nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250 },
     { id: 2, nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60 },
     { id: 3, nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180 },
     { id: 4, nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35 },
     { id: 5, nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520 },
     { id: 6, nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95 },
     { id: 7, nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120 },
     { id: 8, nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450 },
   ];
   ```

   No `server.js`, deixa o array ficar por agora. As rotas de lá ainda precisam dele, até à fase 6. Durante as fases 4 e 5, o array fica nos dois sítios, de propósito.

2. Cria a pasta `src/services` e, nela, o ficheiro `artigos.service.js`, com este conteúdo:

   ```js
   // src/services/artigos.service.js: as regras da papelaria sobre os artigos.
   // Recebe valores simples e devolve valores simples. Não sabe nada de HTTP:
   // não usa req nem res, e por isso pode ser usado e testado sem servidor.
   import { artigos } from "../dados/artigos.dados.js";

   /**
    * Devolve os artigos que cumprem os filtros recebidos.
    * Os filtros já chegam verificados pelo controller; os que faltam não se aplicam.
    * @param {object} filtros com categoria (texto) e stockMaximo (número), os dois opcionais
    * @returns {object[]} uma lista nova, possivelmente vazia
    */
   export function listarArtigos(filtros) {
     let resultado = artigos;
     if (filtros.categoria !== undefined) {
       resultado = resultado.filter((artigo) => artigo.categoria === filtros.categoria);
     }
     if (filtros.stockMaximo !== undefined) {
       resultado = resultado.filter((artigo) => artigo.stock <= filtros.stockMaximo);
     }
     return resultado;
   }

   /**
    * Procura um artigo pelo id.
    * @param {number} id um inteiro positivo, já verificado pelo controller
    * @returns {object | null} o artigo, ou null se não existir
    */
   export function obterArtigo(id) {
     const artigo = artigos.find((artigo) => artigo.id === id);
     if (!artigo) {
       return null;
     }
     return artigo;
   }

   /**
    * Regra da papelaria: um artigo está abaixo do mínimo quando o stock é
    * menor do que o stock mínimo definido para ele, e é preciso encomendá-lo.
    * @returns {object[]} os artigos a encomendar, possivelmente nenhum
    */
   export function artigosAbaixoDoMinimo() {
     return artigos.filter((artigo) => artigo.stock < artigo.stockMinimo);
   }
   ```

   Leitura guiada: começa pelo `import`, que se lê assim: do ficheiro `../dados/artigos.dados.js`, quero o que foi exportado com o nome `artigos`. O nome vai entre chavetas e tem de ser exatamente o do `export`. Os `..` sobem de `src/services/` para `src/`, e daí o caminho desce para `dados/artigos.dados.js`. Depois vêm três funções, cada uma com `export`, porque o controller vai precisar delas. A `listarArtigos` são os dois filtros da tua rota da lista, agora a ler um objeto `filtros`, e não o `req.query`. A `obterArtigo` é o `find` da rota de um artigo, e devolve `null` quando não encontra. Não sabe o que é um 404. A `artigosAbaixoDoMinimo` é a linha da regra, tal e qual. Nenhuma usa `req` nem `res`.

3. Na raiz do projeto, cria um ficheiro `experimentar-service.js`, com este conteúdo:

   ```js
   // experimentar-service.js: usa o service sem servidor e sem HTTP.
   // Serve só para este laboratório; apaga-o no fim da fase 4.
   import { listarArtigos, obterArtigo, artigosAbaixoDoMinimo } from "./src/services/artigos.service.js";

   console.log("Todos:", listarArtigos({}).length);
   console.log("Papel:", listarArtigos({ categoria: "Papel" }).length);
   console.log("Stock até 3:", listarArtigos({ stockMaximo: 3 }).map((artigo) => artigo.nome));
   console.log("Artigo 99:", obterArtigo(99));
   console.log("A encomendar:", artigosAbaixoDoMinimo().map((artigo) => artigo.nome));
   ```

   Leitura guiada: o ficheiro importa as três funções do service e escreve o resultado de cinco chamadas. O caminho começa por `./`, porque a pasta `src` está na mesma pasta deste ficheiro.

4. Antes de o correres, escreve no caderno o que esperas em cada uma das cinco linhas.

5. No segundo terminal, na raiz do projeto, corre:

   ```bash
   node experimentar-service.js
   ```

   O que deves ver:

   ```text
   Todos: 8
   Papel: 3
   Stock até 3: [ 'Esferográfica azul', 'Bloco de notas A5', 'Compasso escolar' ]
   Artigo 99: null
   A encomendar: [
     'Esferográfica azul',
     'Bloco de notas A5',
     'Marcador fluorescente',
     'Compasso escolar'
   ]
   ```

   Isto quer dizer que o service funciona sozinho, sem browser, sem servidor e sem HTTP. Na primeira versão, para experimentar a mesma regra, tinhas de ligar a API e fazer o pedido.

6. Compara com a tua previsão. Repara no marcador fluorescente. Não está na lista do stock até 3, mas está na lista a encomendar. Escreve no caderno porquê.

   A resposta: tem 8 unidades, mais do que 3, por isso não entra no filtro do stock até 3. Mas o seu stock mínimo é 10, e 8 é menos do que 10, por isso tem de ser encomendado. "Pouco stock" é um número escolhido por quem faz o pedido; "abaixo do mínimo" é uma regra da papelaria, com um mínimo diferente para cada artigo.

7. Apaga o ficheiro `experimentar-service.js`. Ele mostrou o que interessava.

### Paragem 4

Os ficheiros dos dados e do service existem, e o service funciona sem servidor. A API continua a responder com as rotas do `server.js`, como na fase 3.

Pensa antes de continuares: porque é que o `import` do service escreve `../dados/artigos.dados.js`, com o `.js` no fim? A resposta: porque, nos módulos do Node, a extensão é obrigatória nos teus ficheiros; sem ela, o Node não encontra o ficheiro. O `import express from "express"` não tem extensão nem `./` porque não é um ficheiro teu. É um pacote, que o Node vai buscar à pasta `node_modules`.

## Fase 5: o controller

O controller é a camada que conhece o HTTP. Lê do pedido o que interessa, converte-o e verifica-o, e responde 400 se não servir. Depois chama o service e escolhe o código e o corpo da resposta. A verificação à entrada da primeira versão passa para aqui. Saber se `"abc"` é um número é um problema do pedido, e é do controller. Saber se um artigo tem de ser encomendado é uma regra, e é do service. Para saber mais, lê as secções "Verificar à entrada, no controller" e "O controller" do [guia](04-api-express-e-contratos.md).

1. Cria a pasta `src/controllers` e, nela, o ficheiro `artigos.controller.js`, com este conteúdo. A `paraInteiro` copia-la do teu `server.js`, tal como está; as três funções exportadas são as três rotas do teu `server.js`, agora com nome e a chamar o service.

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
   export function listar(req, res) {
     const filtros = {};

     if (req.query.categoria !== undefined) {
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

     res.json(listarArtigos(filtros));
   }

   /** GET /api/artigos/abaixo-do-minimo */
   export function abaixoDoMinimo(req, res) {
     res.json(artigosAbaixoDoMinimo());
   }

   /** GET /api/artigos/:id */
   export function obter(req, res) {
     const id = paraInteiro(req.params.id);
     if (id === null || id < 1) {
       res.status(400).json({ erro: "O identificador do artigo tem de ser um número inteiro positivo" });
       return;
     }
     const artigo = obterArtigo(id);
     if (artigo === null) {
       res.status(404).json({ erro: `Não existe o artigo ${id}` });
       return;
     }
     res.json(artigo);
   }
   ```

   Leitura guiada: começa pelo `import`, que pede três nomes ao service, dentro das mesmas chavetas. A `paraInteiro` não tem `export`. É uma ajuda interna, e um nome que não se exporta não pode ser usado por engano noutro sítio. Cada função exportada trata um pedido do contrato, e o comentário diz qual. A `listar` constrói o objeto `filtros` só com os parâmetros que vieram e que o contrato prevê. A `obter` faz as duas verificações, primeiro 400 e depois 404, e traduz o `null` do service num 404.

2. Responde no caderno: na função `listar`, porque é que o `filtros` começa vazio e só recebe o que veio no pedido? O que aconteceria se se passasse o `req.query` diretamente ao `listarArtigos`?

   A resposta: o `filtros` só recebe os parâmetros que o contrato prevê, já convertidos e verificados. Com o `req.query` passado diretamente, o `stockMaximo` chegava ao service como texto, e `"abc"` passava sem erro, com uma lista vazia em vez de um 400. E qualquer parâmetro que alguém inventasse chegaria ao service. No tema seguinte, esse objeto vai ser um filtro do MongoDB. Passá-lo inteiro seria deixar quem faz o pedido escrever a consulta.

3. Volta à tua decisão sobre o pedido `?categoria=`. Lê a função `listar` e a `listarArtigos` e descobre o que este código responde a esse pedido. Se, na fase 3, mudaste a rota para cumprir o contrato, faz a mudança equivalente na `listar`.

   A resposta: 200, com `[]`, como a rota da primeira versão antes de qualquer mudança. O texto vazio não é `undefined`, entra no `filtros`, e a `listarArtigos` compara cada categoria com `""`. A mudança, se for precisa, é a da fase 3, agora na `listar`. É no controller que se decide o que fazer com o que chega no pedido, e não no service.

Ainda não há nada para ver no browser. Nenhuma rota chama o controller, e a API continua a responder com as rotas do `server.js`.

### Paragem 5

Os dados, o service e o controller estão nos seus ficheiros. A API continua a responder como na fase 3.

Pensa antes de continuares: porque é que a `paraInteiro` ficou no controller, e não no service? A resposta: converter o texto que chega no pedido é trabalho de HTTP. O service recebe valores já verificados e do tipo certo, como o número 5, e não o texto `"5"`, e por isso não tem de desconfiar do que recebe.

## Fase 6: as rotas e o server.js que as monta

As rotas são o índice da API. Dizem que pedido vai para que função do controller. Num ficheiro próprio, ficam num router, criado com `express.Router()`: um conjunto de rotas que se monta, todo de uma vez, num caminho do servidor. Dentro do router, os caminhos são relativos ao sítio onde ele é montado. A regra da ordem continua a valer lá dentro. E o `server.js` fica só com o arranque: a porta, a rota de estado, a montagem do router e o `app.listen`. Para saber mais, lê as secções "As rotas" e "O server.js que monta as rotas" do [guia](04-api-express-e-contratos.md).

1. Cria a pasta `src/rotas` e, nela, o ficheiro `artigos.rotas.js`, com este conteúdo. Desta vez, a rota fixa vai logo antes da rota com o parâmetro. Viste porquê na fase 2.

   ```js
   // src/rotas/artigos.rotas.js: que pedido vai para que função do controller.
   // Os caminhos são relativos ao sítio onde este router é montado, em server.js:
   // "/" quer dizer /api/artigos, e "/:id" quer dizer /api/artigos/:id.
   import express from "express";
   import { listar, abaixoDoMinimo, obter } from "../controllers/artigos.controller.js";

   const router = express.Router();

   router.get("/", listar);
   // O caminho fixo vem antes do caminho com parâmetro. Ao contrário,
   // /abaixo-do-minimo seria tratado como um :id, e daria 400.
   router.get("/abaixo-do-minimo", abaixoDoMinimo);
   router.get("/:id", obter);

   export default router;
   ```

   Leitura guiada: o router vai ser montado em `/api/artigos`, por isso `"/"` quer dizer `/api/artigos`, e `"/:id"` quer dizer `/api/artigos/:id`. Cada rota passa ao Express o nome de uma função do controller, sem a chamar: `listar`, e não `listar()`. É o Express que a chama quando o pedido chega. No fim, o `export default` exporta uma só coisa, o router, sem lhe dar nome.

2. Substitui o conteúdo do `src/server.js` por este. Saem o array, a `paraInteiro` e as três rotas dos artigos, que já estão nas camadas; entram o `import` do router e o `app.use`. Ainda não há o middleware final.

   ```js
   // src/server.js: o ponto de arranque da API da papelaria.
   // Lê a configuração do ambiente, cria a aplicação Express, monta as rotas
   // e liga-a à porta.
   import express from "express";
   import artigosRotas from "./rotas/artigos.rotas.js";

   // A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
   // Se não estiver definida, a API usa a 3000.
   const PORTA = process.env.PORT || 3000;

   const app = express();

   // Rota de estado: serve para confirmar que a API está ligada e a responder.
   app.get("/api/estado", (req, res) => {
     res.json({ estado: "ok", aplicacao: "API da papelaria" });
   });

   // Todos os pedidos começados por /api/artigos seguem para o router dos artigos.
   app.use("/api/artigos", artigosRotas);

   app.listen(PORTA, (erro) => {
     if (erro) {
       console.error(`Não foi possível ligar a API: ${erro.message}`);
       return;
     }
     console.log(`API a correr em http://localhost:${PORTA}`);
   });
   ```

   Leitura guiada: o `import artigosRotas from "./rotas/artigos.rotas.js"` não tem chavetas, porque o ficheiro das rotas tem um `export default`, e o nome `artigosRotas` é escolhido aqui. O `app.use("/api/artigos", artigosRotas)` quer dizer: os pedidos começados por `/api/artigos` seguem para este router.

3. Guarda e confirma no terminal que a API reiniciou sem erros. Se houver um erro de `import` num dos ficheiros novos, é agora que aparece. É a primeira vez que o `server.js` carrega as rotas, que carregam o controller, que carrega o service. A mensagem diz que ficheiro faltou e quem o pediu.

4. Abre `/api/estado`, `/api/artigos` e `/api/artigos/abaixo-do-minimo`. O que deves ver: a rota de estado responde como no tema anterior, a lista mostra os oito artigos, e os artigos a encomendar são os mesmos quatro. As respostas vêm agora das camadas, e são as mesmas.

### Paragem 6

A API responde pelas camadas. O `server.js` tem a porta, a rota de estado, o `import` e o `app.use` do router e o `app.listen`, e mais nada.

Pensa antes de continuares: como sabes que as respostas vêm mesmo das camadas, e não de rotas antigas esquecidas no `server.js`? A resposta: se as rotas antigas tivessem ficado acima do `app.use`, eram elas que respondiam, com as mesmas respostas, e o router nunca era usado. Nenhum pedido mostrava a diferença. A confirmação é ler o `server.js`. Depois desta fase, não pode ter o array, a `paraInteiro` nem nenhuma rota dos artigos.

## Fase 7: três erros de módulos

Os `import` entre os teus ficheiros são a maior fonte de erros deste laboratório: a extensão `.js`, um nome que o outro ficheiro não exporta, e as chavetas num `export default`. Nesta fase provocas os três, para reconheceres as mensagens quando te acontecerem. Com o `--watch`, a API tenta reiniciar a cada gravação e falha; escreve o erro e depois `Failed running 'src/server.js'. Waiting for file changes before restarting...`, e volta a arrancar sozinha quando corriges o ficheiro. Para saber mais, lê a secção "Erros frequentes" do [guia](04-api-express-e-contratos.md).

Para cada erro: prevê, provoca, lê a mensagem no terminal, copia para o caderno a linha que interessa e corrige.

1. Sem extensão. No `artigos.rotas.js`, no `import` do controller, apaga o `.js` do fim do caminho e guarda.

   O que deves ver: uma mensagem que começa por `Error [ERR_MODULE_NOT_FOUND]: Cannot find module`, seguida do caminho de `src/controllers/artigos.controller`, sem o `.js`, e de `imported from`, com o caminho do ficheiro das rotas. Diz que ficheiro não encontrou e quem o pediu. Repõe o `.js`.

2. Um nome que não existe. No mesmo `import`, muda `listar` para `listarTodos` e guarda.

   O que deves ver: `SyntaxError: The requested module '../controllers/artigos.controller.js' does not provide an export named 'listarTodos'`. O controller não exporta nenhum nome `listarTodos`. Repõe `listar`.

3. Chavetas num `export default`. No `server.js`, muda `import artigosRotas from` para `import { artigosRotas } from` e guarda. Prevê: a mensagem vai ser parecida com qual das anteriores? Porquê, se o router existe?

   O que deves ver: `SyntaxError: The requested module './rotas/artigos.rotas.js' does not provide an export named 'artigosRotas'`. O router existe, mas foi exportado com `export default`, sem nome. As chavetas pedem um export com o nome `artigosRotas`, e esse não existe. Um `export default` importa-se sem chavetas, e o nome é escolhido por quem importa. Repõe o `import` sem chavetas.

Depois de cada correção, confirma no terminal que a API voltou a escrever `API a correr`.

## Fase 8: o middleware final

O contrato diz que todas as respostas de erro têm a mesma forma, `{ "erro": "..." }`. Assim, o cliente React trata qualquer erro da mesma maneira: lê a mensagem no campo `erro` do JSON e mostra-a, seja qual for o pedido que falhou. Falta uma resposta, que a API não escreve: a de um caminho que não existe, como `/api/artigo`, a que o Express responde sozinho, com uma página HTML. A solução é o middleware final, que já viste em Sistemas de Informação: uma função registada com `app.use`, sem caminho, que o Express chama quando nenhuma rota respondeu ao pedido. Por isso fica no fim, depois de todas as rotas. Para saber mais, lê a secção "Um formato único para os erros" do [guia](04-api-express-e-contratos.md).

1. Abre outra vez `http://localhost:3000/api/artigo`. O que deves ver: a página do Express, como na fase 3. As camadas mudaram a organização do código, e isto não mudou.

2. No `src/server.js`, depois do `app.use` das rotas e antes do `app.listen`, acrescenta o middleware final:

   ```js
   // Middleware final: nenhuma rota respondeu. Responde em JSON, como o resto
   // da API, para quem a usa encontrar sempre o erro no mesmo sítio.
   app.use((req, res) => {
     res.status(404).json({ erro: "Rota não encontrada" });
   });
   ```

3. Volta a abrir `/api/artigo`. O que deves ver: `{"erro":"Rota não encontrada"}`, com o código 404, no formato de erro do contrato.

### Paragem 8

O `src/server.js` completo, como deve estar agora:

```js
// src/server.js: o ponto de arranque da API da papelaria.
// Lê a configuração do ambiente, cria a aplicação Express, monta as rotas
// e liga-a à porta.
import express from "express";
import artigosRotas from "./rotas/artigos.rotas.js";

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, a API usa a 3000.
const PORTA = process.env.PORT || 3000;

const app = express();

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

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a API: ${erro.message}`);
    return;
  }
  console.log(`API a correr em http://localhost:${PORTA}`);
});
```

Pensa antes de continuares: e se o middleware final ficasse antes do `app.use` das rotas? A resposta: respondia `Rota não encontrada` a todos os pedidos dos artigos, mesmo aos que existem, porque responde a tudo o que lhe chega e não o passa à frente. O `/api/estado` continuava a funcionar, porque está acima dos dois.

## Fase 9: verificar o contrato

Cada linha desta tabela corresponde a uma linha do contrato. Quando todas conferem, a API cumpre o contrato nos casos verificados. A tabela verifica um exemplo de cada linha do contrato, e não todos os valores possíveis. Um pedido que não está nela, como `/api/artigos/0`, pode ainda ter um erro. Esta tabela é o que entregas para mostrar que a API cumpre o contrato. Para saber mais, lê o passo 7 do exemplo guiado do [guia](04-api-express-e-contratos.md).

1. Copia para o caderno a coluna dos pedidos abaixo e acrescenta-lhe três colunas: "código previsto", "código obtido" e "corpo confere com o contrato". Os pedidos são estes: `/api/artigos`, `/api/artigos?categoria=Desenho`, `/api/artigos?stockMaximo=3`, `/api/artigos?categoria=Papel&stockMaximo=4`, `/api/artigos?categoria=Cola`, `/api/artigos?stockMaximo=abc`, `/api/artigos?stockMaximo=`, `/api/artigos?stockMaximo=-1`, `/api/artigos/2`, `/api/artigos/abc`, `/api/artigos/99`, `/api/artigos/abaixo-do-minimo` e `/api/artigo`.

2. Acrescenta duas linhas, para os dois pedidos do teu contrato que não estão nesta lista: o `/api/estado` e o `/api/artigos?categoria=`, com a resposta que decidiste na fase 1.

3. Preenche a coluna da previsão, só a olhar para o teu `contrato-da-api.md`.

4. Faz cada pedido no browser, com o separador Rede aberto, e preenche as outras duas colunas.

   O que deves ver:

   | Pedido | Código | Resposta |
   | --- | --- | --- |
   | `/api/artigos` | 200 | os oito artigos |
   | `/api/artigos?categoria=Desenho` | 200 | a régua e o compasso |
   | `/api/artigos?stockMaximo=3` | 200 | a esferográfica (3), o bloco de notas (0) e o compasso (1) |
   | `/api/artigos?categoria=Papel&stockMaximo=4` | 200 | o bloco de notas (0) e a resma (4) |
   | `/api/artigos?categoria=Cola` | 200 | `[]` |
   | `/api/artigos?stockMaximo=abc` | 400 | `{"erro":"O parâmetro stockMaximo tem de ser um número inteiro, zero ou maior"}` |
   | `/api/artigos?stockMaximo=` | 400 | o mesmo erro |
   | `/api/artigos?stockMaximo=-1` | 400 | o mesmo erro |
   | `/api/artigos/2` | 200 | a esferográfica azul |
   | `/api/artigos/abc` | 400 | `{"erro":"O identificador do artigo tem de ser um número inteiro positivo"}` |
   | `/api/artigos/99` | 404 | `{"erro":"Não existe o artigo 99"}` |
   | `/api/artigos/abaixo-do-minimo` | 200 | a esferográfica, o bloco de notas, o marcador e o compasso |
   | `/api/artigo` | 404 | `{"erro":"Rota não encontrada"}` |
   | `/api/estado` | 200 | `{"estado":"ok","aplicacao":"API da papelaria"}` |
   | `/api/artigos?categoria=` | o que decidiste | a resposta do teu contrato |

5. Compara com a tabela da fase 3. Os pedidos que estão nas duas têm de dar as mesmas respostas, menos o `/api/artigo`, que agora vem em JSON. As camadas mudaram a organização do código, e não o que a API responde.

6. Se alguma linha não conferir, há um erro no código ou no contrato. Descobre qual, corrige-o e volta a verificar a linha. Um 400 que mudou procura-se primeiro no controller; uma lista que mudou, no service ou nos filtros que o controller lhe passa.

No fim, a tabela tem de ter pelo menos um 200, um 400 e um 404 verificados.

## Fase 10: guardar no Git

1. Corre `git status`. O que deves ver: o `contrato-da-api.md`, as alterações ao `src/server.js` e as pastas novas dentro de `src`. Não deve aparecer o `experimentar-service.js`, que apagaste, nem o `.env`.

2. Faz o commit:

   ```bash
   git add .
   git commit -m "API dos artigos: contrato, rotas, controller e service com dados temporários"
   git log --oneline
   ```

   O que deves ver: o `git log` mostra agora dois commits, o do tema anterior e este.

## Problemas frequentes

### A API não reinicia depois de guardar

O `--watch` só vigia os ficheiros que a API já carregou. Um ficheiro novo, que ainda nenhum `import` usa, não faz reiniciar; assim que o `import` existir, passa a fazer. Nas fases 4 e 5 é isto que acontece, e está certo. Os ficheiros novos só são carregados na fase 6. Se ficares na dúvida, para com Ctrl+C e volta a `npm run dev`.

### A API reinicia em ciclo, com o mesmo erro

Há um erro num ficheiro, e o `--watch` volta a tentar a cada gravação. Lê a mensagem: diz o ficheiro e, quase sempre, a linha. Corrige e guarda.

### Os pedidos dos artigos dão erro 500, com "artigos is not defined"

Tiraste o array do `server.js` na fase 4, quando as rotas de lá ainda o usavam. A API arranca sem erro, mas quase todos os pedidos aos artigos falham. O browser recebe uma página de erro com o código 500, e o terminal mostra `ReferenceError: artigos is not defined` (artigos não está definido). O `/api/estado` continua a funcionar, porque não usa o array. Volta a pôr o array no `server.js` até à fase 6, ou avança já para a fase 6.

### Cannot set headers after they are sent to the client

Falta o `return` depois de um `res.status(400).json(...)`. A função responde 400 e continua, e tenta responder outra vez ao mesmo pedido. Põe o `return` a seguir a cada resposta de erro.

### Os pedidos aos artigos dão todos 404

Ou o `app.use("/api/artigos", ...)` está depois do middleware final, ou, dentro do router, os caminhos foram escritos completos, como `"/api/artigos"` em vez de `"/"`. No segundo caso, a rota fica em `/api/artigos/api/artigos`.

### O browser mostra a lista de artigos ao pedir um só

Escreveste `router.get("/:id", listar)`. O pedido de um artigo vai parar à função da lista, que não lê o `:id` e devolve todos. Cada rota tem de passar a função certa: `listar` no `"/"`, `abaixoDoMinimo` no `"/abaixo-do-minimo"` e `obter` no `"/:id"`.

### /api/artigos responde 400 com a mensagem do identificador

Escreveste `router.get("/", obter)`. O pedido da lista vai parar à função de um artigo, que não encontra nenhum `:id` no caminho e responde 400. No `"/"`, a função é a `listar`.

## Desafios

1. Um filtro novo, `precoMaximo`. Acrescenta ao contrato e à API o parâmetro `?precoMaximo=`, em cêntimos, que deixa só os artigos com o preço até esse valor, incluído. Tem de funcionar junto com os outros dois filtros, e de responder 400 quando não for um inteiro, zero ou maior. Escreve primeiro a linha do contrato, e só depois o código. Pista: há duas camadas a mudar, e nenhuma delas é a das rotas.
2. Um pedido novo, que devolve a lista das categorias dos artigos, cada uma só uma vez. Decide o caminho (por exemplo, `/api/categorias` ou `/api/artigos/categorias`), a camada de cada parte e a ordem das categorias, e escreve-o no contrato antes do código. Pista: se o caminho começar por `/api/artigos`, lembra-te da fase 2.

## Antes de terminares

- [ ] O `contrato-da-api.md` está no projeto, com a rota de estado e a tua decisão sobre o pedido `?categoria=`, e a razão dessa decisão está no caderno.
- [ ] A tabela da fase 3 está no caderno, com a primeira versão verificada.
- [ ] As previsões e os resultados do teste do service, na fase 4, estão no caderno, com a explicação do marcador fluorescente.
- [ ] As respostas das fases 5 e 7 estão no caderno.
- [ ] A tabela da fase 9 está verificada, com pelo menos um 200, um 400 e um 404.
- [ ] O `git log --oneline` mostra dois commits.
- [ ] Consegues explicar, por palavras tuas, o caminho de um pedido pelas camadas: que função de que ficheiro correu, e quem decidiu o código da resposta.

O professor vai pedir-te que escolhas uma linha da tabela da fase 9 e expliques o caminho desse pedido pelas camadas.

![Rodapé](../imagens/rodape.png)
