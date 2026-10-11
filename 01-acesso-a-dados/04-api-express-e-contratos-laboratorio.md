![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: o contrato e as camadas da papelaria

Laboratório do quarto tema de Acesso a dados. Duas aulas de 60 minutos. Continuas no projeto `papelaria-api` do tema anterior: escreves o contrato da API; depois uma primeira versão que o cumpre com tudo no `server.js`, e verificas essa versão; depois separas o código em camadas, de dentro para fora, sem mudar nenhuma resposta; e no fim acrescentas o middleware final e verificas a API contra o contrato, pedido a pedido. Pelo caminho, provocas quatro erros que vais encontrar muitas vezes: duas rotas fora de ordem, um `import` sem extensão, um nome que o ficheiro não exporta e chavetas num `export default`.

Na primeira aula fazes as partes 1 a 3, até à primeira versão verificada. Na segunda, as partes 4 a 10: as camadas, os erros de módulos, o middleware final, a verificação completa e o commit.

As ideias e o código estão no [guia do tema](04-api-express-e-contratos.md), e cada parte diz em que secção. Escreve o código em vez de o copiar, e lê cada linha. Há duas exceções. O array dos artigos podes copiá-lo do guia: são dados, e escrevê-los à mão não ensina nada. E, nas partes 4 a 6, o código que passa do teu `server.js` para as camadas podes copiá-lo de lá, porque já o escreveste na parte 2; o que é novo, escreve-lo.

## Antes de começar

Precisas do projeto `papelaria-api` do laboratório do tema anterior, com o `.env`, o `npm run dev` a funcionar e o primeiro commit feito. Se não o tiveres, copia a pasta [papelaria-api](../exemplos/acesso-a-dados/papelaria-api/README.md) dos exemplos, corre `npm install`, cria o `.env` a partir do `.env.example` e faz o `git init` e o primeiro commit, como na parte 6 desse laboratório.

Liga a API com `npm run dev` e deixa-a ligada: com o `--watch`, ela reinicia sozinha sempre que guardas um ficheiro. Mantém o terminal à vista, porque é lá que os erros aparecem.

Se a tua API veio de Sistemas de Informação, do laboratório "a API da papelaria", lê também a secção seguinte antes de começares.

## Se a tua API veio de Sistemas de Informação

Em Sistemas de Informação construíste a API da papelaria num só ficheiro, e no tema anterior transformaste-a num projeto. O teu `src/server.js` já tem boa parte da primeira versão deste tema: os oito artigos, a rota `GET /api/artigos` com o filtro por categoria, a rota `GET /api/artigos/:id` com o 400 e o 404, com as mensagens do contrato, o middleware de registo, a rota de estado e o middleware final, que responde em JSON. Faltam-lhe a função `paraInteiro`, o filtro `stockMaximo` e a rota dos artigos a encomendar. Este laboratório completa esse ficheiro, em vez de o escrever de novo, e depois separa-o em camadas como no caminho normal.

Antes de começares, confirma que o teu `src/server.js` tem, por esta ordem: o `import` do Express, a `PORTA` lida do ambiente, a `app`, o array dos artigos, o middleware de registo, a rota de estado, as duas rotas dos artigos, o middleware final e o `app.listen`. Confirma também que o `git log --oneline` mostra o primeiro commit, do tema anterior. Se faltar alguma destas peças, chama o professor: quem não tiver a API de Sistemas de Informação faz o laboratório pelo caminho normal, a partir do esqueleto.

As partes 1, 4, 7 e 10 fazem-se como estão. As outras têm as diferenças que vêm a seguir. Como a tua primeira versão já vem quase feita, é provável que acabes a parte 3 antes do fim da primeira aula: nesse caso, começa logo a parte 4.

### Parte 2, no teu projeto: o que falta à primeira versão

Guia: secção "Primeira versão: tudo no server.js", com as subsecções "O texto vazio e a função paraInteiro" e "A ordem das rotas".

1. O array dos artigos já está no teu `server.js`, desde Sistemas de Informação. Não o copies outra vez. Faz só o passo 2 da parte 2: confirma que os artigos são os mesmos que tens no Atlas.
2. A seguir ao array, acrescenta a função `paraInteiro` do guia, com o comentário de documentação que a acompanha.
3. Na rota de detalhe, troca a verificação que escreveste em Sistemas de Informação pela do guia: `const id = paraInteiro(req.params.id);` e, na condição do 400, `id === null || id < 1`. Lê o último parágrafo da subsecção "O texto vazio e a função paraInteiro" e escreve no caderno, numa frase, porque mudas uma verificação que já funcionava.
4. Agora a rota da lista. A tua aplica um filtro e acaba logo ali, com `res.json` e `return`. O contrato acrescenta-lhe um segundo filtro, o `stockMaximo`, e um pedido pode trazer os dois ao mesmo tempo, como `/api/artigos?categoria=Papel&stockMaximo=4`. Antes de mudares o código, responde no caderno: se acrescentasses o `stockMaximo` noutro `if`, igual ao da categoria e a seguir a ele, com o seu próprio `res.json` e `return`, que artigos responderia a tua rota a esse pedido? E quais deviam ser, pelo contrato?
5. Reescreve a rota da lista como a do guia: o resultado começa com todos os artigos, num `let`, e cada filtro que veio no pedido vai-o reduzindo, um a seguir ao outro; só no fim há um `res.json`. A verificação do `stockMaximo` com a `paraInteiro` e o 400 vêm do guia.
6. Faz os passos 5 a 9 da parte 2: a rota `GET /api/artigos/abaixo-do-minimo` primeiro depois da rota de detalhe, para veres o 400, e depois antes dela. As duas ficam entre a rota da lista e o middleware final, que continua no fim do ficheiro.

### Parte 3, no teu projeto: uma diferença na verificação

Faz a parte 3 como está, com uma diferença no passo 4: o teu `/api/artigo` não mostra a página do Express. O teu servidor tem o middleware final desde Sistemas de Informação, e por isso responde `{"erro":"Rota não encontrada"}`, com 404, que é o que o contrato pede. A tua primeira versão cumpre todas as linhas do contrato, incluindo essa. Regista-o na tabela.

No passo 5, repara no que a rota da lista que reescreveste responde ao `?categoria=`, e compara com o que a tua rota de Sistemas de Informação respondia, com o `if (categoria)`. Se forem diferentes, escreve no caderno porquê. O que conta é o teu contrato: se a rota não o cumpre, muda a rota.

### Parte 5, no teu projeto: o passo 3

No passo 3, compara a `listar` do guia com a rota da lista do teu `server.js` no fim da parte 3, que já cumpria o teu contrato. Se as duas responderem de forma diferente ao `?categoria=`, muda a `listar`, para o controller cumprir o mesmo contrato.

### Parte 6, no teu projeto: o que fica no server.js

No passo 2, apaga do `server.js` o array, a `paraInteiro` e as três rotas dos artigos, como no caminho normal, mas deixa ficar o middleware de registo e o middleware final, além da rota de estado. O `import` do router fica a seguir ao `import` do Express. O `app.use("/api/artigos", artigosRotas)` fica depois da rota de estado e antes do middleware final. No fim desta parte, o teu `server.js` tem: os dois `import`, a `PORTA`, a `app`, o middleware de registo, a rota de estado, o `app.use` das rotas, o middleware final e o `app.listen`. No passo 4, o terminal continua a mostrar uma linha por pedido, com o endereço completo, porque o middleware de registo está antes do router.

### Parte 8, no teu projeto: a ordem do middleware final

O teu middleware final já existe, e a parte 3 mostrou que o `/api/artigo` já responde em JSON. Em vez dos passos da parte 8:

1. Lê a secção "Um formato único para os erros" do guia, que explica porque é que todas as respostas de erro têm a mesma forma.
2. Confirma que o middleware final está depois do `app.use` das rotas.
3. Um erro de propósito. Muda o `app.use("/api/artigos", artigosRotas)` para depois do middleware final, logo antes do `app.listen`. Prevê o que respondem `/api/estado` e `/api/artigos/2`. Guarda e abre os dois.

O que deves ver: `/api/estado` responde como sempre, porque a rota de estado está acima do middleware final. `/api/artigos/2` dá `{"erro":"Rota não encontrada"}`, com 404: o middleware final responde a todos os pedidos que lhe chegam, e o router, abaixo dele, nunca é usado. É a regra de Sistemas de Informação, aplicada agora a um router.

4. Repõe o `app.use` das rotas antes do middleware final e confirma que `/api/artigos/2` volta a responder.

### Parte 9, no teu projeto: o passo 5

No passo 5, todas as linhas que estão nas tabelas das partes 3 e 9 têm de dar as mesmas respostas, incluindo o `/api/artigo`, que já vinha em JSON na primeira versão.

## Parte 1: o contrato, antes do código

Guia: secções "O que é o contrato de uma API" e "O contrato da API da papelaria".

1. Na raiz do projeto, ao lado do `package.json`, cria o ficheiro `contrato-da-api.md`.
2. Escreve nele o contrato dos três pedidos da secção 4 do guia e o formato dos erros. Usa as tabelas do guia, mas escreve-as tu, com o guia ao lado: ao escrever cada linha, pergunta-te o que ela obriga a API a fazer. Acrescenta também a secção do pedido `GET /api/estado`, que a API já tem desde o tema anterior: o contrato descreve todos os pedidos da API, e este não pode ficar de fora. O contrato do exemplo publicado tem essa secção, e podes comparar a tua com ela no fim.
3. O contrato do guia deixa um caso por decidir, e nem o guia nem o exemplo publicado o decidem por ti: o pedido `/api/artigos?categoria=`, com o parâmetro `categoria` presente, mas sem valor. Decide o que a API deve responder a este pedido, com que código e com que corpo, e escreve a tua decisão no contrato, na secção de `GET /api/artigos`. No caderno, escreve porque escolheste essa resposta e não outra. Pensa em quem pode fazer este pedido: alguém que se esqueceu de escrever a categoria, ou um formulário do React com uma opção "todas as categorias" que envia o campo vazio. Há mais do que uma decisão defensável. O que não pode acontecer é o contrato não dizer nada sobre este caso.

Guarda o ficheiro. É uma das duas coisas que este tema te pede para entregar.

## Parte 2: tudo no server.js, com as rotas primeiro pela ordem errada

Guia: secção "Primeira versão: tudo no server.js".

1. No `src/server.js`, a seguir ao `const app = express();`, acrescenta o array dos oito artigos do guia.
2. Confirma com os artigos que tens no Atlas, do laboratório do modelo documental: os nomes, as categorias, os stocks, os stocks mínimos e os preços têm de ser os mesmos. Só o `id` é diferente.
3. A seguir ao array, acrescenta a função `paraInteiro`. A subsecção "O texto vazio e a função paraInteiro" explica a verificação que vem antes do `Number`.
4. A seguir à rota de estado, acrescenta a rota `GET /api/artigos`.
5. Acrescenta as outras duas rotas do contrato, mas com uma diferença de propósito: escreve a rota `/api/artigos/:id` antes da rota `/api/artigos/abaixo-do-minimo`, ao contrário do que o guia faz.
6. Guarda e confirma no terminal que a API reiniciou sem erros.
7. Abre `http://localhost:3000/api/artigos/2`. Deve aparecer a esferográfica.
8. Prevê o que dá `http://localhost:3000/api/artigos/abaixo-do-minimo`. Depois abre-o.

O que deves ver: 400, com a mensagem de que o identificador tem de ser um número inteiro positivo. O pedido foi parar à rota de um artigo, porque `/api/artigos/:id` estava primeiro e aceita qualquer texto no lugar do `:id`.

9. Muda a ordem: a rota fixa antes da rota com o parâmetro, como no guia. Confirma que `/api/artigos/abaixo-do-minimo` responde 200 com os quatro artigos a encomendar.

## Parte 3: verificar a primeira versão

Guia: exemplo guiado, passo 2.

1. Copia para o caderno a tabela do passo 2 do guia, só com a coluna dos pedidos, e acrescenta duas colunas: "previsto" e "obtido".
2. Preenche a coluna da previsão, só a olhar para o teu `contrato-da-api.md` e para o teu `server.js`.
3. Faz cada pedido no browser, com o separador Rede aberto, e preenche a coluna do obtido, com o código e o corpo.
4. Na linha do `/api/artigo`, sem o `s`, regista o que aparece: é a página do Express, em HTML, e não JSON.
5. Volta à decisão que tomaste na parte 1 sobre o pedido `?categoria=`. Lê a rota de `/api/artigos` do teu `server.js` e descobre o que ela responde a esse pedido, com que código e com que corpo. Escreve-o no caderno e confirma no browser, com `http://localhost:3000/api/artigos?categoria=`. Se não for o que puseste no contrato, muda a rota para cumprir o contrato, e volta a abrir o pedido. É o código que se acerta pelo contrato, e não o contrário: o contrato foi escrito primeiro, e é com ele que vais verificar a API na parte 9.

No fim desta parte, a primeira versão responde ao que o contrato diz, menos ao `/api/artigo`. Fica a servir de referência para a segunda aula: as camadas vão mudar o código de sítio, e as respostas têm de continuar as mesmas.

## Parte 4: os dados e o service, e um teste sem servidor

Guia: secções "Os dados temporários" e "O service", e exemplo guiado, passo 3.

1. Dentro de `src`, cria a pasta `dados` e, nela, o ficheiro `artigos.dados.js`. Copia para lá o array do teu `server.js` e põe `export` à frente do `const`, como no guia. No `server.js`, deixa o array ficar por agora: as rotas de lá ainda precisam dele, até à parte 6.
2. Cria a pasta `src/services` e, nela, o ficheiro `artigos.service.js`, com as três funções do guia. Para cada uma, encontra no teu `server.js` a rota de onde ela veio, e repara no que ficou de fora.
3. Na raiz do projeto, cria um ficheiro `experimentar-service.js` com este conteúdo:

   ```js
   // experimentar-service.js: usa o service sem servidor e sem HTTP.
   // Serve só para este laboratório; apaga-o no fim da parte 4.
   import { listarArtigos, obterArtigo, artigosAbaixoDoMinimo } from "./src/services/artigos.service.js";

   console.log("Todos:", listarArtigos({}).length);
   console.log("Papel:", listarArtigos({ categoria: "Papel" }).length);
   console.log("Stock até 3:", listarArtigos({ stockMaximo: 3 }).map((artigo) => artigo.nome));
   console.log("Artigo 99:", obterArtigo(99));
   console.log("A encomendar:", artigosAbaixoDoMinimo().map((artigo) => artigo.nome));
   ```

4. Antes de o correres, escreve no caderno o que esperas em cada uma das cinco linhas.
5. Num segundo terminal (o primeiro está ocupado com a API), na raiz do projeto, corre `node experimentar-service.js`.

O que deves ver: `Todos: 8`; `Papel: 3`; três nomes com stock até 3 (a esferográfica, o bloco de notas e o compasso); `Artigo 99: null`; e quatro nomes a encomendar (a esferográfica, o bloco de notas, o marcador e o compasso).

6. Compara com a tua previsão. Repara no marcador fluorescente: não está na lista do stock até 3, mas está na lista a encomendar. Escreve no caderno porquê.
7. Apaga o ficheiro `experimentar-service.js`. Ele mostrou o que interessava: o service funciona sozinho, sem browser nem servidor. Na primeira versão, para experimentar a mesma regra, tinhas de ligar a API e fazer o pedido.

## Parte 5: o controller

Guia: secções "Verificar à entrada, no controller" e "O controller".

1. Cria a pasta `src/controllers` e, nela, o ficheiro `artigos.controller.js`, com o código do guia. A `paraInteiro` copia-la do teu `server.js`, tal como está. As três funções exportadas são as três rotas do teu `server.js`, agora com nome e a chamar o service.
2. Antes de continuares, responde no caderno: na função `listar`, porque é que o `filtros` começa vazio e só recebe o que veio no pedido? O que aconteceria se se passasse `req.query` diretamente ao `listarArtigos`?
3. Volta à decisão sobre o pedido `?categoria=`. Lê a função `listar`, e a `listarArtigos` do service, e descobre o que o código do guia responde a esse pedido. Escreve-o no caderno, e compara com o que a rota do teu `server.js` respondia na parte 3, antes de qualquer mudança. Se, na parte 3, mudaste a rota para cumprir o contrato, faz a mudança equivalente na `listar`: o controller tem de cumprir o mesmo contrato que a primeira versão cumpria.

Ainda não há nada para ver no browser: nenhuma rota chama o controller, e a API continua a responder com as rotas do `server.js`.

## Parte 6: as rotas e o server.js que as monta

Guia: secções "As rotas" e "O server.js que monta as rotas", e exemplo guiado, passo 5.

1. Cria a pasta `src/rotas` e, nela, o ficheiro `artigos.rotas.js`, com o código do guia. Desta vez, a rota fixa vai logo antes da rota com o parâmetro: viste porquê na parte 2.
2. No `src/server.js`, apaga o array, a `paraInteiro` e as três rotas dos artigos, que já estão nas camadas. Deixa a rota de estado. Acrescenta o `import` do router e o `app.use("/api/artigos", artigosRotas)`, como no guia. Ainda não acrescentes o middleware final.
3. Guarda e confirma no terminal que a API reiniciou sem erros. Se aparecer um erro de `import`, lê a mensagem: diz que ficheiro faltou e quem o pediu.
4. Abre `/api/estado` e `/api/artigos`: o primeiro tem de responder como no tema anterior, e o segundo tem de mostrar os oito artigos. Abre também `/api/artigos/abaixo-do-minimo`: 200, com os quatro artigos a encomendar.

## Parte 7: três erros de módulos

Guia: secção "Erros frequentes".

Para cada erro: prevê, provoca, lê a mensagem no terminal (com o `--watch`, a API tenta reiniciar e falha), copia a linha que interessa para o caderno e corrige.

1. **Sem extensão.** No `artigos.rotas.js`, no `import` do controller, apaga o `.js` do fim do caminho. Guarda. A mensagem começa por `Error [ERR_MODULE_NOT_FOUND]: Cannot find module`. Repõe o `.js`.
2. **Um nome que não existe.** No mesmo `import`, muda `listar` para `listarTodos`. Guarda. A mensagem diz `does not provide an export named 'listarTodos'`. Repõe `listar`.
3. **Chavetas num export default.** No `server.js`, muda `import artigosRotas from` para `import { artigosRotas } from`. Guarda. A mensagem é parecida com a anterior. Porquê, se o router existe? Responde no caderno e repõe o `import` sem chavetas.

Depois de cada correção, confirma no terminal que a API voltou a escrever `API a correr`.

## Parte 8: o middleware final

Guia: secção "Um formato único para os erros" e exemplo guiado, passo 6.

1. Abre outra vez `http://localhost:3000/api/artigo`. Continua a ser a página do Express, como na parte 3: as camadas mudaram a organização do código, e isto não mudou.
2. Acrescenta ao `src/server.js` o middleware final do guia, depois do `app.use` das rotas e antes do `app.listen`.
3. Volta a abrir `/api/artigo`. Agora a resposta é `{"erro":"Rota não encontrada"}`, com 404: o formato de erro do contrato.

## Parte 9: verificar o contrato

Guia: exemplo guiado, passo 7.

Esta é a parte que conta como evidência.

1. Copia para o caderno a tabela do passo 7 do guia, só com a coluna dos pedidos, e acrescenta três colunas: "código previsto", "código obtido" e "corpo confere com o contrato".
2. Preenche a coluna da previsão, só a olhar para o teu `contrato-da-api.md`.
3. Faz cada pedido no browser, com o separador Rede aberto, e preenche as outras duas colunas.
4. Acrescenta duas linhas, para os dois pedidos que puseste no contrato na parte 1 e que não estão na tabela do guia: o `GET /api/estado` e o `/api/artigos?categoria=`, com a resposta que decidiste.
5. Compara com a tabela da parte 3. Os pedidos que estão nas duas têm de dar as mesmas respostas, menos o `/api/artigo`, que agora vem em JSON.
6. Se alguma linha não conferir, há um erro no código ou no contrato. Descobre qual, corrige-o e volta a verificar a linha.

No fim, a tabela tem de ter pelo menos um 200, um 400 e um 404 verificados.

## Parte 10: guardar no Git

1. `git status`: devem aparecer o `contrato-da-api.md`, as alterações ao `server.js` e as pastas novas dentro de `src`. Não deve aparecer o `experimentar-service.js`, que apagaste, nem o `.env`.
2. Faz o commit:

   ```text
   git add .
   git commit -m "API dos artigos: contrato, rotas, controller e service com dados temporários"
   git log --oneline
   ```

   O `git log` mostra agora dois commits.

## Problemas frequentes no laboratório

### A API não reinicia depois de guardar

O `--watch` só vigia os ficheiros que a API já carregou. Um ficheiro novo, que ainda nenhum `import` usa, não faz reiniciar. Assim que o `import` existir, passa a fazer. Nas partes 4 e 5 é isto que acontece, e está certo: os ficheiros novos só são carregados na parte 6. Se ficares na dúvida, para com Ctrl+C e volta a `npm run dev`.

### A API reinicia em ciclo, com o mesmo erro

Há um erro num ficheiro, e o `--watch` volta a tentar a cada gravação. Lê a mensagem: diz o ficheiro e, quase sempre, a linha. Corrige e guarda.

### Os pedidos dos artigos dão erro 500, com "artigos is not defined"

Tiraste o array do `server.js` na parte 4, quando as rotas de lá ainda o usavam. A API arranca sem erro, mas cada pedido aos artigos falha: o browser recebe uma página de erro com o código 500, e o terminal mostra `ReferenceError: artigos is not defined`. O `/api/estado` continua a funcionar, porque não usa o array. Volta a pôr o array no `server.js` até à parte 6, ou avança já para a parte 6.

### Tudo dá 404, mesmo os caminhos que existem

Ou o `app.use("/api/artigos", ...)` está depois do middleware final, ou, dentro do router, os caminhos foram escritos completos (`"/api/artigos"` em vez de `"/"`).

### O browser mostra a lista de artigos ao pedir um só

Escreveste `router.get("/", obter)` ou trocaste os nomes das funções nas rotas. Cada rota tem de passar a função certa do controller.

### No Windows, o node -e do guia não funciona

As aspas simples do comando do passo 3 do guia não funcionam na linha de comandos clássica do Windows. Usa o ficheiro `experimentar-service.js` da parte 4 deste laboratório, que funciona em todo o lado.

## O que fica no teu caderno

1. O ficheiro `contrato-da-api.md`, no projeto, com a secção da rota de estado e a tua decisão sobre o pedido `?categoria=`; no caderno, a razão dessa decisão.
2. O resultado da parte 2, com as rotas pela ordem errada.
3. A tabela da parte 3, com a primeira versão verificada, e o que a rota respondia ao pedido `?categoria=` e o que mudaste, se mudaste.
4. As previsões e os resultados do teste do service, na parte 4, e a explicação do marcador fluorescente.
5. As respostas das partes 5 e 7, incluindo o que o código do guia respondia ao pedido `?categoria=` e o que mudaste na `listar`, se mudaste.
6. A tabela da parte 9, verificada, com pelo menos um 200, um 400 e um 404.

O professor vai pedir-te que escolhas uma linha da tabela da parte 9 e expliques o caminho do pedido pelas camadas: que função de que ficheiro correu, e quem decidiu o código.

![Rodapé](../imagens/rodape.png)
