![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: o contrato e as camadas da papelaria

Laboratório do quarto tema de Acesso a dados. Duas aulas de 60 minutos. Continuas no projeto `papelaria-api` do tema anterior: escreves o contrato da API, depois as camadas que o cumprem, de baixo para cima, e no fim verificas a API contra o contrato, pedido a pedido. Pelo caminho, provocas três erros que vais encontrar muitas vezes: um `import` sem extensão, um nome que o ficheiro não exporta e duas rotas fora de ordem.

As ideias e o código estão no [guia do tema](04-api-express-e-contratos.md), e cada parte diz em que secção. Escreve o código em vez de o copiar, e lê cada linha.

## Antes de começar

Precisas do projeto `papelaria-api` do laboratório do tema anterior, com o `.env`, o `npm run dev` a funcionar e o primeiro commit feito. Se não o tiveres, copia a pasta [papelaria-api](../exemplos/acesso-a-dados/papelaria-api/README.md) dos exemplos, corre `npm install`, cria o `.env` a partir do `.env.example` e faz o `git init` e o primeiro commit, como na parte 6 desse laboratório.

Liga a API com `npm run dev` e deixa-a ligada: com o `--watch`, ela reinicia sozinha sempre que guardas um ficheiro. Mantém o terminal à vista, porque é lá que os erros aparecem.

## Parte 1: o contrato, antes do código

Guia: secções "O que é o contrato de uma API" e "O contrato da API da papelaria".

1. Na raiz do projeto, ao lado do `package.json`, cria o ficheiro `contrato-da-api.md`.
2. Escreve nele o contrato dos três pedidos da secção 4 do guia e o formato dos erros. Usa as tabelas do guia, mas escreve-as tu, com o guia ao lado: ao escrever cada linha, pergunta-te o que ela obriga a API a fazer.
3. Acrescenta uma secção que o guia não tem: a do pedido `GET /api/estado`, que a API já tem desde o tema anterior. Que parâmetros tem? Que respostas pode dar?

Guarda o ficheiro. É uma das duas coisas que este tema te pede para entregar.

## Parte 2: os dados temporários

Guia: secção "Os dados temporários".

1. Dentro de `src`, cria a pasta `dados` e, nela, o ficheiro `artigos.dados.js`, com o array dos oito artigos do guia.
2. Confirma com os artigos que tens no Atlas, do laboratório do modelo documental: os nomes, as categorias, os stocks, os stocks mínimos e os preços têm de ser os mesmos. Só o `id` é diferente.

## Parte 3: o service, e um teste sem servidor

Guia: secção "O service" e exemplo guiado, passo 3.

1. Cria a pasta `src/services` e, nela, o ficheiro `artigos.service.js`, com as três funções do guia.
2. Na raiz do projeto, cria um ficheiro `experimentar-service.js` com este conteúdo:

   ```js
   // experimentar-service.js: usa o service sem servidor e sem HTTP.
   // Serve só para este laboratório; apaga-o no fim da parte 3.
   import { listarArtigos, obterArtigo, artigosAbaixoDoMinimo } from "./src/services/artigos.service.js";

   console.log("Todos:", listarArtigos({}).length);
   console.log("Papel:", listarArtigos({ categoria: "Papel" }).length);
   console.log("Stock até 3:", listarArtigos({ stockMaximo: 3 }).map((artigo) => artigo.nome));
   console.log("Artigo 99:", obterArtigo(99));
   console.log("A encomendar:", artigosAbaixoDoMinimo().map((artigo) => artigo.nome));
   ```

3. Antes de o correres, escreve no caderno o que esperas em cada uma das cinco linhas.
4. Num segundo terminal (o primeiro está ocupado com a API), na raiz do projeto, corre `node experimentar-service.js`.

O que deves ver: `Todos: 8`; `Papel: 3`; três nomes com stock até 3 (a esferográfica, o bloco de notas e o compasso); `Artigo 99: null`; e quatro nomes a encomendar (a esferográfica, o bloco de notas, o marcador e o compasso).

5. Compara com a tua previsão. Repara no marcador fluorescente: não está na lista do stock até 3, mas está na lista a encomendar. Escreve no caderno porquê.
6. Apaga o ficheiro `experimentar-service.js`. Ele mostrou o que interessava: o service funciona sozinho, sem browser nem servidor.

## Parte 4: o controller

Guia: secções "Verificar à entrada, no controller" e "O controller".

1. Cria a pasta `src/controllers` e, nela, o ficheiro `artigos.controller.js`, com o código do guia.
2. Antes de continuares, responde no caderno: na função `listar`, porque é que o `filtros` começa vazio e só recebe o que veio no pedido? O que aconteceria se se passasse `req.query` diretamente ao `listarArtigos`?

Ainda não há nada para ver no browser: nenhuma rota chama o controller.

## Parte 5: as rotas, primeiro pela ordem errada

Guia: secções "As rotas" e "A ordem das rotas dentro do router".

1. Cria a pasta `src/rotas` e, nela, o ficheiro `artigos.rotas.js`, com o código do guia, mas com uma diferença de propósito: escreve a rota `"/:id"` **antes** da rota `"/abaixo-do-minimo"`.
2. No `src/server.js`, acrescenta o `import` do router e o `app.use("/api/artigos", artigosRotas)`, como no guia. Ainda não acrescentes o middleware final.
3. Guarda e confirma no terminal que a API reiniciou sem erros.
4. Abre `http://localhost:3000/api/artigos/2`. Deve aparecer a esferográfica.
5. Prevê o que dá `http://localhost:3000/api/artigos/abaixo-do-minimo`. Depois abre-o.

O que deves ver: 400, com a mensagem de que o identificador tem de ser um número inteiro positivo. O pedido foi parar à função `obter`, porque `"/:id"` estava primeiro e aceita qualquer texto.

6. Muda a ordem: a rota fixa antes da rota com o parâmetro, como no guia. Confirma que `/api/artigos/abaixo-do-minimo` responde 200 com os quatro artigos a encomendar.

## Parte 6: o middleware final

Guia: secção "O server.js".

1. Abre `http://localhost:3000/api/artigo`, sem o `s`. Regista o que aparece: é a página do Express, em HTML, e não JSON.
2. Acrescenta ao `src/server.js` o middleware final do guia, depois do `app.use` das rotas.
3. Volta a abrir `/api/artigo`. Agora a resposta é `{"erro":"Rota não encontrada"}`, com 404: o formato de erro do contrato.

## Parte 7: três erros de módulos

Guia: secção "Erros frequentes".

Para cada erro: prevê, provoca, lê a mensagem no terminal (com o `--watch`, a API tenta reiniciar e falha), copia a linha que interessa para o caderno e corrige.

1. **Sem extensão.** No `artigos.rotas.js`, no `import` do controller, apaga o `.js` do fim do caminho. Guarda. A mensagem começa por `Error [ERR_MODULE_NOT_FOUND]: Cannot find module`. Repõe o `.js`.
2. **Um nome que não existe.** No mesmo `import`, muda `listar` para `listarTodos`. Guarda. A mensagem diz `does not provide an export named 'listarTodos'`. Repõe `listar`.
3. **Chavetas num export default.** No `server.js`, muda `import artigosRotas from` para `import { artigosRotas } from`. Guarda. A mensagem é parecida com a anterior. Porquê, se o router existe? Responde no caderno e repõe o `import` sem chavetas.

Depois de cada correção, confirma no terminal que a API voltou a escrever `API a correr`.

## Parte 8: verificar o contrato

Guia: exemplo guiado, passo 7.

Esta é a parte que conta como evidência.

1. Copia para o caderno a tabela do passo 7 do guia, só com a coluna dos pedidos, e acrescenta três colunas: "código previsto", "código obtido" e "corpo confere com o contrato".
2. Preenche a coluna da previsão, só a olhar para o teu `contrato-da-api.md`.
3. Faz cada pedido no browser, com o separador Rede aberto, e preenche as outras duas colunas.
4. Acrescenta uma linha para o `GET /api/estado` que puseste no contrato na parte 1.
5. Se alguma linha não conferir, há um erro no código ou no contrato. Descobre qual, corrige-o e volta a verificar a linha.

No fim, a tabela tem de ter pelo menos um 200, um 400 e um 404 verificados.

## Parte 9: guardar no Git

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

O `--watch` só vigia os ficheiros que a API já carregou. Um ficheiro novo, que ainda nenhum `import` usa, não faz reiniciar. Assim que o `import` existir, passa a fazer. Se ficares na dúvida, para com Ctrl+C e volta a `npm run dev`.

### A API reinicia em ciclo, com o mesmo erro

Há um erro num ficheiro, e o `--watch` volta a tentar a cada gravação. Lê a mensagem: diz o ficheiro e, quase sempre, a linha. Corrige e guarda.

### Tudo dá 404, mesmo os caminhos que existem

Ou o `app.use("/api/artigos", ...)` está depois do middleware final, ou, dentro do router, os caminhos foram escritos completos (`"/api/artigos"` em vez de `"/"`).

### O browser mostra a lista de artigos ao pedir um só

Escreveste `router.get("/", obter)` ou trocaste os nomes das funções nas rotas. Cada rota tem de passar a função certa do controller.

### No Windows, o node -e do guia não funciona

As aspas simples do comando do passo 3 do guia não funcionam na linha de comandos clássica do Windows. Usa o ficheiro `experimentar-service.js` da parte 3 deste laboratório, que funciona em todo o lado.

## O que fica no teu caderno

1. O ficheiro `contrato-da-api.md`, no projeto, com a secção da rota de estado.
2. As previsões e os resultados do teste do service, na parte 3, e a explicação do marcador fluorescente.
3. As respostas das partes 4 e 7.
4. O resultado da parte 5, com a rota pela ordem errada.
5. A tabela da parte 8, verificada, com pelo menos um 200, um 400 e um 404.

O professor vai pedir-te que escolhas uma linha da tabela da parte 8 e expliques o caminho do pedido pelas camadas: que função de que ficheiro correu, e quem decidiu o código.

![Rodapé](../imagens/rodape.png)
