![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: modelo documental e primeiras consultas no Atlas

Laboratório do tema Modelo documental e primeiras consultas no Atlas, do módulo M14, Acesso a Bases de Dados. Cerca de 110 minutos. Vais criar no MongoDB Atlas a base de dados de uma papelaria, fazer-lhe as primeiras consultas e guardar uma referência a um fornecedor. Cada passo diz o que fazer, porquê e o que deves ver. Tudo o que precisas está aqui; o [guia do tema](02-modelo-documental-e-consultas-no-atlas.md) tem a teoria completa, para quem quiser saber mais.

## O que vais construir

No fim, o teu cluster no Atlas tem a base de dados `papelaria`, com nove artigos na coleção `artigos` e um fornecedor na coleção `fornecedores`. Um dos artigos aponta para esse fornecedor. No caderno, ficam as tuas previsões e os resultados de sete consultas e de uma pergunta feita à mão.

Ficas a saber criar uma base de dados no Atlas, inserir documentos, escrever consultas com filtro, projeção, ordenação e limite, e guardar uma referência a outro documento.

| Fase | O que muda | O que funciona no fim |
| --- | --- | --- |
| 1 | A conta, o cluster, o utilizador da base de dados e o acesso do professor | O teu cluster gratuito, protegido, e o convite enviado ao professor |
| 2 | A base `papelaria`, a coleção `artigos` e os oito artigos | Oito documentos, cada um com o `_id` que o MongoDB lhe deu |
| 3 | As consultas 1 a 5, com filtros | Escolhes artigos por igualdade, por comparação, por duas condições, por um intervalo e por um campo embutido |
| 4 | A consulta 6, com uma projeção | Escolhes os campos que aparecem |
| 5 | A consulta 7, com ordenação e limite | Vês os três artigos mais caros |
| 6 | A pergunta feita à mão | Sabes que artigos estão abaixo do stock mínimo, e porque não é a lista da consulta 2 |
| 7 | A coleção `fornecedores` e um artigo com uma referência | Nove artigos, um fornecedor e uma referência que se segue com uma consulta |

## Palavras que vais usar

- MongoDB: um programa que guarda os dados de uma aplicação, organizados em documentos.
- Cluster: o conjunto de servidores onde o MongoDB está a correr e onde vivem as tuas bases de dados. No plano gratuito, o Atlas guarda os mesmos dados em três servidores. Para saber mais, vê a secção "O MongoDB guarda a informação em documentos" do [guia](02-modelo-documental-e-consultas-no-atlas.md).
- Projeto e organização: no Atlas, um projeto agrupa clusters, e uma organização agrupa projetos.
- Utilizador da base de dados: um nome e uma palavra-passe que um programa usa para entrar na base de dados. Não é a tua conta do Atlas.
- Base de dados: um conjunto de coleções que pertencem à mesma aplicação, como a `papelaria`.
- Coleção: um conjunto de documentos do mesmo tipo, como a coleção `artigos`.
- Documento: um conjunto de campos, cada um com um nome e um valor, que descreve uma coisa. Escreve-se com a forma de um objeto de JavaScript.
- Campo: cada par nome e valor de um documento, como uma propriedade de um objeto.
- Documento embutido: um documento guardado dentro de outro, como a `localizacao` de um artigo, com o corredor e a prateleira.
- `_id` e ObjectId: o `_id` é o campo que distingue cada documento da coleção. Se não o escreveres, o MongoDB cria-o, com um valor do tipo ObjectId: 24 carateres, só com algarismos e as letras de `a` a `f`.
- Data Explorer: a página do Atlas onde vês as bases de dados, as coleções e os documentos, e fazes as consultas.
- Consulta: um pedido de informação à base de dados. No Atlas, escreve-se na barra de consulta, por cima da lista dos documentos.
- Filtro: a parte da consulta que diz que documentos queres. O filtro vazio, `{}`, aceita todos.
- Operador: uma palavra começada por `$` que, dentro de um filtro, faz uma comparação, como `$lt`, menor do que.
- Projeção: a parte da consulta que diz que campos aparecem, com `1` para mostrar e `0` para esconder.
- Ordenação e limite: a ordenação diz por que ordem aparecem os documentos, com `1` para crescente e `-1` para decrescente. O limite diz quantos aparecem, no máximo.
- Referência: um campo que guarda o `_id` de outro documento, como o `fornecedorId` de um artigo.
- Seguir uma referência: usar o valor guardado na referência para chegar ao outro documento, com uma segunda consulta. Para saber mais, vê a secção "A informação relacionada embute-se ou referencia-se" do [guia](02-modelo-documental-e-consultas-no-atlas.md).

## O que precisas

- Um browser, para usares o Atlas. Confirma que chegas a ele: abre `https://www.mongodb.com/cloud/atlas/register`, e deve aparecer a página de registo do Atlas.
- Acesso ao teu email, para confirmares a conta do Atlas.
- O teu caderno, para escreveres as previsões antes de cada consulta.

Se já criaste a conta e o cluster numa aula anterior, começa na fase 2. Da fase 1, faz só o que te faltar do que a paragem 1 descreve, como o convite ao professor. Se já tens a base `papelaria` com os oito artigos da fase 2, confirma que são exatamente oito e começa na fase 3.

## Se alguma coisa falhar

1. Estás na coleção certa? No Data Explorer, a lista do lado esquerdo mostra a base `papelaria` e, dentro dela, as coleções. A consulta corre sobre a coleção que tens aberta.
2. A coleção tem o número certo de documentos? São oito no fim da fase 2 e nove no fim da fase 7. Se tiver mais, inseriste duas vezes: vê os [problemas frequentes](#problemas-frequentes).
3. Escreveste o filtro no campo do filtro e carregaste em "Find"? "Reset" limpa a consulta e volta a mostrar todos os documentos.
4. O resultado não é o que previste? Antes de mudares a consulta, abre um documento que devia aparecer e compara, campo a campo, o nome do campo, a escrita do valor e o tipo.

## Fase 1: o teu cluster no Atlas, protegido (25 minutos)

O MongoDB é um programa que guarda os dados de uma aplicação, organizados em documentos. O Atlas é o MongoDB a funcionar na nuvem: em servidores de um centro de dados da empresa que o faz, a que chegas pela internet. Para lá teres as tuas bases de dados, crias uma conta e, nela, um cluster gratuito, o conjunto de servidores onde vão viver as tuas bases de dados. Depois proteges a entrada com duas proteções: um utilizador com palavra-passe, para os programas, e a lista dos endereços de onde se pode ligar. Para saber mais, lê a secção "No Atlas, cada aluno tem o seu cluster" do [guia](02-modelo-documental-e-consultas-no-atlas.md).

Os nomes dos botões deste laboratório foram confirmados na documentação da MongoDB em setembro e a 14 de outubro de 2026. Na primeira vez, cada nome vem com a tradução, entre parênteses. O Atlas muda o aspeto das páginas de vez em quando. Se um botão não tiver exatamente o mesmo nome no teu ecrã, procura o que tem a mesma função: os passos são os mesmos.

1. Cria a conta, porque é nela que vão ficar o teu projeto e o teu cluster. Abre `https://www.mongodb.com/cloud/atlas/register`, cria a conta e confirma o endereço de email na mensagem que vais receber. Se o Atlas fizer perguntas de boas-vindas sobre o que vais construir, responde como quiseres: não mudam nada do que se segue.

   O que deves ver: a página inicial do Atlas, já com a tua conta. Se o email de confirmação não chegar, vê os [problemas frequentes](#problemas-frequentes).

2. Se o Atlas te pedir para criar uma organização e um projeto, dá-lhes um nome que te identifique, por exemplo o teu primeiro nome seguido de `lp12`. Se o Atlas já os tiver criado por ti, usa esses.

3. Cria o cluster gratuito, que é onde vão viver as tuas bases de dados:

   1. No menu lateral, abre a visão geral do projeto, "Project Overview".
   2. Carrega em "Create" (criar) para criar um cluster.
   3. Escolhe o plano gratuito, identificado como "M0" ou "Free".
   4. Escolhe o fornecedor de nuvem, a empresa dona dos servidores (qualquer um serve), e uma região na Europa, para os servidores ficarem perto.
   5. Dá um nome ao cluster, só com letras, algarismos e hífenes, por exemplo `cluster-lp12`. O nome não se pode mudar depois.
   6. Carrega em "Create".

   O que deves ver: o cluster na visão geral do projeto, pronto em poucos segundos.

4. Cria o utilizador da base de dados. Logo depois de criar o cluster, o Atlas mostra um assistente de segurança com dois passos. Nenhum é preciso neste laboratório, porque o browser chega aos dados pela página do Atlas. Mas vão ser precisos quando o teu programa se ligar à base de dados, por isso faz os dois agora.

   O primeiro passo é o utilizador da base de dados. Não é a tua conta do Atlas: é um nome e uma palavra-passe que o teu programa vai usar para entrar na base de dados. Escolhe um nome de utilizador, aceita a palavra-passe que o Atlas sugere ou escolhe uma longa, e carrega em "Create Database User" (criar utilizador da base de dados).

   Guarda a palavra-passe num sítio seguro, que só tu vês, como um gestor de palavras-passe, o programa que as guarda por ti. Nunca a escrevas no código, no caderno, num ficheiro partilhado ou publicado na internet, nem numa mensagem. Mais à frente vais aprender a forma certa de a entregar ao programa.

5. Diz ao Atlas de onde é permitido ligar, que é o segundo passo do assistente. Por omissão, o Atlas recusa ligações de qualquer lado. Carrega em "Add My Current IP Address" (acrescentar o meu endereço IP atual), para autorizar o endereço IP de onde estás agora, que é o da rede da escola. O endereço IP é o número que identifica, na internet, a rede de onde te ligas. Depois carrega em "Finish and Close" (acabar e fechar). Quando quiseres trabalhar em casa, acrescentas o endereço de casa na lista de acesso por endereço IP, na secção de segurança do menu lateral.

   Não autorizes o acesso de qualquer endereço (`0.0.0.0/0`). A palavra-passe continuaria a ser precisa, mas tirarias uma das duas proteções. É como deixar o portão da escola aberto a toda a gente e confiar só na chave da sala.

6. Dá acesso ao professor, para ele poder ver os teus documentos e acompanhar o teu trabalho:

   1. No menu lateral, na secção de segurança, abre "Project Identity & Access" (identidade e acesso ao projeto).
   2. No separador "Users" (utilizadores), carrega em "Invite to Project" (convidar para o projeto).
   3. Escreve o email que o professor indicar na aula.
   4. Escolhe o papel "Project Data Access Read Only" e retira o "Project Read Only", que o Atlas escolhe por omissão. Com o papel por omissão, o professor via o projeto, mas não conseguia ver os teus documentos.
   5. Carrega em "Grant Access" (dar acesso).

   O que deves ver: a confirmação de que o convite foi enviado. O professor recebe um email e só tem acesso depois de aceitar o convite.

### Paragem 1

Tens uma conta, um projeto e um cluster gratuito. Tens também um utilizador da base de dados, com a palavra-passe guardada num sítio seguro, o endereço da escola autorizado e um convite enviado ao professor.

Pensa antes de continuares: porque é que o Atlas pede duas proteções, o utilizador com palavra-passe e a lista de endereços, se uma já devia chegar? A resposta: cada uma trava um perigo diferente. A palavra-passe trava quem não a sabe. A lista de endereços trava quem a sabe mas está noutro sítio, por exemplo alguém que a viu num ficheiro publicado por engano. Para entrar na tua base de dados, é preciso ter as duas coisas.

## Fase 2: os artigos como documentos (10 minutos)

Uma base de dados é um conjunto de coleções que pertencem à mesma aplicação, e uma coleção é um conjunto de documentos do mesmo tipo. Pensa num arquivo em papel: cada documento é uma ficha preenchida, cada coleção é a gaveta das fichas do mesmo tipo, e a base de dados é o armário. Nesta fase crias o armário `papelaria`, a gaveta `artigos` e oito fichas, uma por artigo. Cada documento escreve-se como um objeto de JavaScript, com campos em vez de propriedades. Para saber mais, lê a secção "O MongoDB guarda a informação em documentos" do [guia](02-modelo-documental-e-consultas-no-atlas.md).

1. Cria a base de dados e a primeira coleção. No menu lateral, na secção da base de dados, abre o "Data Explorer" (explorador de dados). Passa o rato por cima do nome do teu cluster e carrega no botão que abre a janela "Create Database" (criar base de dados). Preenche os dois campos obrigatórios:

   - Database Name: `papelaria`
   - Collection Name: `artigos`

   Carrega em "Create Database". O que deves ver: a base de dados `papelaria` e, dentro dela, a coleção `artigos`, na lista do lado esquerdo.

   Os nomes das bases de dados e das coleções seguem a mesma regra dos nomes de ficheiros que usas: minúsculas, sem espaços e sem acentos. O MongoDB recusa alguns carateres nos nomes das bases de dados, como o espaço, o ponto e o `$`. Nos nomes das coleções, aceita o espaço e o ponto, mas recusa o `$`. Além disso, trata as maiúsculas de forma traiçoeira: `Papelaria` e `papelaria` contam como nomes diferentes, e tens de escrever sempre o mesmo, mas o MongoDB não deixa ter as duas bases ao mesmo tempo. Com minúsculas sempre, nunca tens o problema.

2. Insere os oito artigos. Com a coleção `artigos` aberta, carrega em "Add Data" (acrescentar dados) e escolhe "Insert Document" (inserir documento). Na janela que se abre, o modo de escrita por omissão aceita a sintaxe do JavaScript. Podes escrever os nomes dos campos sem aspas e inserir vários documentos de uma vez, dentro de um array. Apaga o que lá estiver, copia este array e carrega em "Insert" (inserir), uma só vez:

   ```js
   [
     { nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250, localizacao: { corredor: "A", prateleira: 1 } },
     { nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60, localizacao: { corredor: "B", prateleira: 1 } },
     { nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180, localizacao: { corredor: "A", prateleira: 2 } },
     { nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35, localizacao: { corredor: "B", prateleira: 1 } },
     { nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520, localizacao: { corredor: "A", prateleira: 3 } },
     { nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95, localizacao: { corredor: "B", prateleira: 2 } },
     { nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120, localizacao: { corredor: "C", prateleira: 1 } },
     { nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450, localizacao: { corredor: "C", prateleira: 1 } }
   ]
   ```

   Leitura guiada: o array tem oito documentos, um por linha e um por artigo. Todos têm os mesmos seis campos, com os mesmos nomes e os mesmos tipos. O nome e a categoria são texto. O stock, o stock mínimo e o preço são números inteiros, e o preço está em cêntimos: `250` quer dizer 2,50 €, porque os números com casas decimais nem sempre dão contas exatas no computador. O stock mínimo é a quantidade abaixo da qual a papelaria tem de encomendar mais. A `localizacao` é um documento embutido, com o corredor e a prateleira. Nenhum documento tem `_id`.

3. Confirma o que o MongoDB fez. Antes de abrires um documento, prevê: que campos tem agora cada artigo, se não escreveste nenhum `_id`?

   Abre um dos documentos. O que deves ver: os seis campos que escreveste e mais um, o `_id`, com um valor como `ObjectId('...')`, de 24 carateres. Isto quer dizer que o MongoDB deu a cada documento um identificador, porque todos os documentos de uma coleção têm de ter um `_id` diferente. O ObjectId é o tipo desse identificador.

   Confirma também que a coleção tem exatamente oito documentos. Se tiver dezasseis, carregaste em "Insert" duas vezes: vê os [problemas frequentes](#problemas-frequentes) antes de continuares, porque as consultas seguintes contam com oito.

### Paragem 2

A coleção `artigos` da base `papelaria` tem oito documentos, e cada um tem um `_id` do tipo ObjectId, que não escreveste.

Pensa antes de continuares: dois artigos com o mesmo nome podiam viver na mesma coleção? A resposta: sim. O que distingue dois documentos é o `_id`, e não o nome. Cada documento tem um `_id` diferente, mesmo que todos os outros campos sejam iguais. É por isso que carregar duas vezes em "Insert" dá dezasseis documentos, e não oito.

## Fase 3: um filtro escolhe os documentos (25 minutos)

Até agora vês todos os artigos. Na papelaria, quem lá trabalha quer só alguns: os de papel, ou os que têm pouco stock. Pedir informação a uma base de dados chama-se fazer uma consulta. No MongoDB, a consulta descreve os documentos que queres com um documento chamado filtro, escrito com a forma de um objeto de JavaScript. É a base de dados que percorre os documentos e devolve só os que cumprem o filtro, como o `filter` de um array. Para saber mais, lê a secção "Uma consulta descreve os documentos que queres" do [guia](02-modelo-documental-e-consultas-no-atlas.md).

A forma de trabalhar é sempre a mesma. Antes de executares uma consulta, escreves no caderno o número da consulta e os artigos que esperas. Depois executas e comparas. Quando o resultado é diferente do que previste, a explicação dessa diferença é o que mais te ensina, por isso não a saltes. Para preveres, usa esta tabela dos oito artigos:

| Artigo | Categoria | Stock | Stock mínimo | Preço (cêntimos) | Corredor |
| --- | --- | ---: | ---: | ---: | --- |
| Caderno A4 quadriculado | Papel | 12 | 5 | 250 | A |
| Esferográfica azul | Escrita | 3 | 10 | 60 | B |
| Bloco de notas A5 | Papel | 0 | 4 | 180 | A |
| Lápis HB | Escrita | 25 | 10 | 35 | B |
| Resma de papel A4 | Papel | 4 | 3 | 520 | A |
| Marcador fluorescente | Escrita | 8 | 10 | 95 | B |
| Régua de 30 cm | Desenho | 6 | 3 | 120 | C |
| Compasso escolar | Desenho | 1 | 2 | 450 | C |

1. Encontra a barra de consulta. Com a coleção `artigos` aberta no Data Explorer, há uma barra de consulta por cima da lista de documentos. O campo principal é o do filtro ("Filter"). Escreves lá o filtro e carregas em "Find" (procurar) para executar. "Reset" (repor) limpa a consulta e volta a mostrar todos os documentos.

2. Consulta 1, uma igualdade: os artigos de uma categoria. Prevê no caderno que artigos devolve este filtro. Depois escreve-o no campo do filtro e carrega em "Find":

   ```js
   { categoria: "Papel" }
   ```

   Lê-se "documentos cujo campo `categoria` é igual a `Papel`".

   O que deves ver: três documentos, o Caderno A4 quadriculado, o Bloco de notas A5 e a Resma de papel A4. A igualdade compara o texto exatamente como está escrito.

3. Provoca um engano de propósito: escreve `papel` com minúscula, e executa outra vez.

   ```js
   { categoria: "papel" }
   ```

   O que deves ver: nenhum documento, e nenhuma mensagem de erro. Isto acontece porque, para a base de dados, `papel` e `Papel` são textos diferentes. Um filtro que não encontra nada não é um erro: é uma resposta vazia. É o engano que mais vais encontrar, por isso lembra-te dele quando uma consulta voltar vazia.

4. Consulta 2, um operador: os artigos com pouco stock. Para perguntar "menor do que", usa-se um operador. Os operadores começam sempre por `$` e escrevem-se como um documento dentro do filtro. O `$lt` vem do inglês *less than*, menor do que. Prevê, e depois executa:

   ```js
   { stock: { $lt: 5 } }
   ```

   Lê-se "documentos cujo campo `stock` é menor do que 5". O `$` diz ao MongoDB que `lt` é um operador, e não o nome de um campo.

   O que deves ver: quatro documentos, a Esferográfica azul (3), o Bloco de notas A5 (0), a Resma de papel A4 (4) e o Compasso escolar (1). Ficam de fora a Régua (6), o Marcador (8), o Caderno (12) e o Lápis (25).

   Há outros operadores do mesmo género: `$lte`, menor ou igual; `$gt`, maior do que; `$gte`, maior ou igual. O `e` do fim vem de *or equal*, ou igual. A diferença entre ter ou não ter o igual só se nota num artigo com o valor exato da fronteira: `{ stock: { $lt: 5 } }` deixa de fora um artigo com 5 unidades, e `{ stock: { $lte: 5 } }` inclui-o.

5. Consulta 3, duas condições: os artigos de escrita com menos de 10 unidades. Quando o filtro tem dois campos, o documento tem de cumprir os dois. Prevê, e depois executa:

   ```js
   { categoria: "Escrita", stock: { $lt: 10 } }
   ```

   O que deves ver: dois documentos, a Esferográfica azul (3) e o Marcador fluorescente (8). O Lápis HB é da categoria Escrita, mas tem 25 unidades: cumpre a primeira condição, mas não a segunda. Se esperavas sete artigos, leste o filtro como "ou", com todos os de escrita e mais todos os que têm menos de 10. O filtro com dois campos pede as duas condições ao mesmo tempo.

6. Consulta 4, um intervalo: os artigos que custam entre 1,00 € e 3,00 €. Dois operadores no mesmo campo também têm de se cumprir os dois. Prevê, e depois executa:

   ```js
   { precoCentimos: { $gte: 100, $lte: 300 } }
   ```

   Lê-se "preço maior ou igual a 100 cêntimos e menor ou igual a 300 cêntimos".

   O que deves ver: três documentos, o Caderno A4 quadriculado (250), o Bloco de notas A5 (180) e a Régua de 30 cm (120). Ficam de fora o Lápis (35), a Esferográfica (60) e o Marcador (95), abaixo de 100, e a Resma (520) e o Compasso (450), acima de 300.

   Com estes dados, `$gt` e `$lt` davam o mesmo resultado, porque nenhum artigo custa exatamente 100 nem 300 cêntimos. Mas a pergunta é "entre 1,00 € e 3,00 €", com as fronteiras incluídas. Um artigo de 3,00 € exatos tem de aparecer, e com `$lt: 300` ficava de fora.

7. Consulta 5, um campo de um documento embutido: os artigos do corredor C. O corredor está dentro da `localizacao`. Para lá chegar, junta-se o nome dos dois campos com um ponto, como em JavaScript, e o nome fica entre aspas. Prevê, e depois executa:

   ```js
   { "localizacao.corredor": "C" }
   ```

   O que deves ver: dois documentos, a Régua de 30 cm e o Compasso escolar.

8. Provoca dois enganos de propósito, para os reconheceres quando te acontecerem:

   - Tira as aspas e escreve `{ localizacao.corredor: "C" }`. O que deves ver: a barra de consulta não aceita o filtro. Isto acontece porque o filtro tem a forma de um objeto de JavaScript, e num objeto um nome com um ponto no meio, sem aspas, não é válido. Entre aspas, o nome passa a ser um texto, e um texto pode ter pontos.
   - Tira o nome do documento embutido e escreve `{ corredor: "C" }`. O que deves ver: nenhum documento, e nenhum erro. Nenhum artigo tem um campo `corredor` no nível de cima, porque o corredor está dentro da `localizacao`.

### Paragem 3

Sabes escolher documentos por igualdade, com um operador, com duas condições, por um intervalo e por um campo embutido. No caderno, tens a previsão e o resultado das consultas 1 a 5.

Pensa antes de continuares: a consulta 3 devolveu dois artigos. Quantos devolveria `{ categoria: "Escrita" }`, sozinho, e porquê? A resposta: três, a Esferográfica azul, o Lápis HB e o Marcador fluorescente. Sem a segunda condição, o Lápis HB, com 25 unidades, já não fica de fora: basta-lhe ser da categoria Escrita.

## Fase 4: a projeção escolhe os campos (10 minutos)

Até agora, cada documento do resultado aparece com todos os campos. Às vezes só interessam alguns: para uma lista de encomendas, chegam o nome e o stock. A projeção diz que campos aparecem: cada campo recebe `1`, para aparecer, ou `0`, para ficar escondido. É como o `map` de um array, quando escolhe só alguns campos de cada objeto. Para saber mais, lê a secção "Uma consulta descreve os documentos que queres" do [guia](02-modelo-documental-e-consultas-no-atlas.md).

1. Mostra os outros campos da barra de consulta: carrega em "Options" (opções). Aparecem mais campos: "Project", para a projeção, "Sort", para a ordenação, e "Limit", para o limite. Repara que, no Atlas, "Project" quer dizer duas coisas: no menu lateral é o projeto, e aqui é a projeção.

2. Consulta 6: no filtro, a mesma condição da consulta 2, `{ stock: { $lt: 5 } }`. No campo "Project":

   ```js
   { nome: 1, stock: 1, _id: 0 }
   ```

   Leitura guiada: `nome: 1` e `stock: 1` dizem "mostra só estes dois campos". O `_id` aparece sempre, a não ser que o escondas, e por isso está lá `_id: 0`.

   Antes de executares, responde no caderno: aparecem os mesmos documentos da consulta 2, ou outros?

   O que deves ver: os mesmos quatro documentos da consulta 2, cada um só com o nome e o stock, como `{ nome: "Esferográfica azul", stock: 3 }`. A projeção muda o que se vê de cada documento, mas não muda que documentos aparecem. Isso é trabalho do filtro.

3. Provoca um erro de propósito: muda a projeção para `{ nome: 1, stock: 0 }` e executa.

   O que deves ver: uma mensagem de erro, como `Cannot do exclusion on field stock in inclusion projection`. Quer dizer "não se pode esconder o campo stock numa projeção de campos a mostrar". Com `1`, a projeção diz "mostra só estes"; com `0`, diz "mostra tudo menos estes". Misturados, o MongoDB não sabe o que fazer aos campos que não escreveste, e recusa a projeção. A única exceção é o `_id: 0`. Volta a pôr `{ nome: 1, stock: 1, _id: 0 }`.

### Paragem 4

Sabes escolher os campos que aparecem, sem mudar os documentos que o filtro escolheu.

Pensa antes de continuares: se quisesses ver todos os campos menos a localização, que projeção escrevias? A resposta: `{ localizacao: 0 }`. Com `0`, a projeção diz "mostra tudo menos estes", e todos os outros campos aparecem, incluindo o `_id`.

## Fase 5: ordenar e depois limitar (10 minutos)

Na papelaria, quem faz o inventário quer saber os três artigos mais caros. São duas coisas: pôr os artigos por ordem de preço e ficar só com os primeiros. A ordenação diz por que ordem aparecem os documentos: cada campo recebe `1`, para ordem crescente, ou `-1`, para ordem decrescente. O limite diz quantos aparecem, no máximo. É como o `sort` de um array, seguido de ficar só com os primeiros elementos. Para saber mais, lê a secção "Uma consulta descreve os documentos que queres" do [guia](02-modelo-documental-e-consultas-no-atlas.md).

1. Consulta 7: limpa a consulta com "Reset" e deixa o filtro vazio, para considerar todos os artigos. Um filtro vazio é o mesmo que `{}`: não impõe nenhuma condição, e todos os documentos o cumprem. No campo "Sort":

   ```js
   { precoCentimos: -1 }
   ```

   No campo "Limit", escreve `3`. Prevê no caderno que artigos aparecem, e por que ordem. Depois executa.

   O que deves ver: a Resma de papel A4 (520), o Compasso escolar (450) e o Caderno A4 quadriculado (250), por esta ordem. Primeiro, a ordenação põe os oito do mais caro para o mais barato. Depois, o limite deixa ficar só os três primeiros.

2. Provoca um engano de propósito: muda a ordenação para `{ precoCentimos: 1 }` e executa.

   O que deves ver: o Lápis HB (35), a Esferográfica azul (60) e o Marcador fluorescente (95), os três mais baratos. Com `1`, a ordem é crescente, do mais barato para o mais caro.

3. Apaga a ordenação e deixa só o limite de 3. O que deves ver: três artigos que não foram escolhidos pelo preço, provavelmente os três primeiros que inseriste. Sem ordenação, o MongoDB não garante nenhuma ordem, e o limite fica com três quaisquer. É por isso que o limite só faz sentido depois de ordenar.

### Paragem 5

Sabes ordenar os documentos e ficar só com os primeiros.

Pensa antes de continuares: com a ordenação `{ precoCentimos: -1 }` e o limite 1, o que aparecia? A resposta: só a Resma de papel A4, o artigo mais caro. A ordenação põe-na em primeiro lugar, e o limite 1 deixa ficar só esse.

## Fase 6: a pergunta que a barra de consulta não faz (10 minutos)

Na papelaria, a pergunta que mais importa é "que artigos estão abaixo do stock mínimo e precisam de ser encomendados?". Um artigo está abaixo do mínimo quando o seu `stock` é menor do que o seu `stockMinimo`. Parece uma pergunta como as outras, mas não é. Os operadores comparam um campo com um valor fixo, escrito no filtro, e esta pergunta compara dois campos do mesmo documento. O operador que compara dois campos, `$expr`, não é aceite na barra de consulta do Atlas. Por isso, desta vez respondes à mão. Para saber mais, lê a secção "Uma consulta descreve os documentos que queres" do [guia](02-modelo-documental-e-consultas-no-atlas.md).

1. Olha para a tabela dos oito artigos, na fase 3, e escreve no caderno os artigos em que o stock é menor do que o stock mínimo.

   O que deves ter no caderno: quatro artigos abaixo do mínimo. Compara, linha a linha, com esta tabela:

   | Artigo | Stock | Stock mínimo | Abaixo do mínimo? |
   | --- | ---: | ---: | --- |
   | Caderno A4 quadriculado | 12 | 5 | Não |
   | Esferográfica azul | 3 | 10 | Sim |
   | Bloco de notas A5 | 0 | 4 | Sim |
   | Lápis HB | 25 | 10 | Não |
   | Resma de papel A4 | 4 | 3 | Não |
   | Marcador fluorescente | 8 | 10 | Sim |
   | Régua de 30 cm | 6 | 3 | Não |
   | Compasso escolar | 1 | 2 | Sim |

2. Compara a tua lista com o resultado da consulta 2, nome a nome. As duas têm quatro artigos. São os mesmos?

   A resposta: não. Em comum têm a Esferográfica, o Bloco e o Compasso. A Resma de papel A4 está na consulta 2, porque tem 4 unidades, menos de 5, mas não está abaixo do mínimo, que é 3. O Marcador fluorescente não está na consulta 2, porque tem 8 unidades, mas está abaixo do mínimo, que é 10.

3. Provoca um engano de propósito: escreve no filtro `{ stock: { $lt: "stockMinimo" } }` e executa.

   O que deves ver: nenhum documento, e nenhum erro. Este filtro não compara o stock com o stock mínimo de cada artigo. Compara o stock com o texto `"stockMinimo"`, e o MongoDB não compara números com texto.

### Paragem 6

Sabes que artigos estão abaixo do stock mínimo, e porque é que a lista não é a da consulta 2.

Pensa antes de continuares: porque é que o stock mínimo tem de estar guardado em cada artigo? A resposta: "pouco stock" usa um limite fixo, igual para todos os artigos, como os 5 da consulta 2. "Abaixo do mínimo" usa um limite diferente em cada artigo: cinco resmas de papel podem ser poucas, e cinco compassos podem ser muitos. Se o mínimo não estivesse guardado em cada artigo, ninguém sabia qual era.

## Fase 7: uma referência a um fornecedor (20 minutos)

Cada artigo tem um fornecedor, e o mesmo fornecedor fornece muitos artigos. Se o telefone do fornecedor estivesse copiado em cada artigo, quando mudasse terias de o alterar em todos, e bastava esquecer um para a informação ficar contraditória. Por isso, o fornecedor fica num documento à parte, noutra coleção, e o artigo guarda só o `_id` dele, num campo `fornecedorId`. A isto chama-se referenciar, e ao campo chama-se referência. A localização ficou dentro de cada artigo por outra razão: é sempre lida com o artigo, cada artigo tem uma só, e não cresce. Isso é embutir. Seguir uma referência é usar o valor guardado para chegar ao outro documento: a partir do artigo, procura-se em `fornecedores` o documento cujo `_id` é igual ao `fornecedorId`. Também se pode ir no sentido contrário: a partir do fornecedor, procuram-se em `artigos` os documentos cujo `fornecedorId` é igual ao `_id` dele. Para saber mais, lê a secção "A informação relacionada embute-se ou referencia-se" do [guia](02-modelo-documental-e-consultas-no-atlas.md).

1. Cria a segunda coleção, `fornecedores`, na base `papelaria`. No Data Explorer, passa o rato sobre o nome da base de dados e carrega no ícone que abre a janela "Create Collection" (criar coleção). Escreve `fornecedores` e carrega em "Create Collection". O que deves ver: as duas coleções, `artigos` e `fornecedores`, dentro da base `papelaria`.

2. Na coleção `fornecedores`, insere este documento, sem `_id`, com "Add Data" e "Insert Document", como na fase 2:

   ```js
   { nome: "Fornecedor Exemplo, Lda.", telefone: "210000000", email: "encomendas@fornecedor.example" }
   ```

   O telefone e o email são fictícios.

3. Abre o documento inserido e copia o valor do `_id` que o MongoDB lhe deu: só os 24 carateres entre as aspas, sem a palavra `ObjectId` e sem os parênteses.

4. Volta à coleção `artigos` e insere mais um artigo, já com a referência ao fornecedor. Substitui `COLA_AQUI_O_ID` pelos 24 carateres que copiaste, mantendo as aspas:

   ```js
   { nome: "Cola em bastão", categoria: "Escrita", stock: 15, stockMinimo: 5, precoCentimos: 140, localizacao: { corredor: "B", prateleira: 3 }, fornecedorId: ObjectId('COLA_AQUI_O_ID') }
   ```

   Leitura guiada: o documento tem os mesmos seis campos dos outros artigos e mais um, o `fornecedorId`. O nome segue uma convenção: o nome da coisa referida, seguido de `Id`. O valor escreve-se com `ObjectId(...)`, para o MongoDB o guardar com o tipo ObjectId, o mesmo do `_id` do fornecedor. Se o escrevesses só entre aspas, ficava guardado como texto, e não seria igual ao `_id` do fornecedor.

   O que deves ver: o documento aceite, e a coleção com nove artigos. Se o Atlas não aceitar o documento, vê os [problemas frequentes](#problemas-frequentes).

5. Segue a referência no sentido contrário: parte do fornecedor e encontra os artigos dele, com o mesmo valor no filtro. Prevê, e depois executa:

   ```js
   { fornecedorId: ObjectId('COLA_AQUI_O_ID') }
   ```

   O que deves ver: só a Cola em bastão. Os outros oito artigos não têm o campo `fornecedorId`, e um documento sem o campo não cumpre uma condição sobre esse campo. É um exemplo de que os documentos da mesma coleção não têm de ter os mesmos campos. Numa aplicação a sério, todos os artigos teriam fornecedor.

6. Vê que o MongoDB não verifica as referências. Antes de inserires, prevê: o MongoDB aceita um artigo com uma referência a um fornecedor que não existe? Insere este artigo na coleção `artigos`:

   ```js
   { nome: "Artigo de teste", categoria: "Escrita", stock: 1, stockMinimo: 1, precoCentimos: 100, localizacao: { corredor: "B", prateleira: 3 }, fornecedorId: ObjectId('000000000000000000000000') }
   ```

   O que deves ver: o documento aceite, sem nenhum aviso, embora nenhum fornecedor tenha aquele `_id`. A base de dados guarda a referência, mas não confirma que ela leva a algum lado. Essa verificação vai ser trabalho da tua aplicação.

7. Apaga o "Artigo de teste": passa o rato sobre o documento, carrega no botão de apagar e confirma. O que deves ver: a coleção `artigos` com nove documentos, os oito do início e a Cola em bastão.

### Paragem 7

A base `papelaria` tem nove artigos e um fornecedor, e a Cola em bastão aponta para o fornecedor pelo `fornecedorId`.

Pensa antes de continuares: porque é que a localização ficou embutida no artigo e o fornecedor ficou numa coleção à parte? A resposta usa duas regras. A localização é sempre mostrada com o artigo, cada artigo tem uma só, e não cresce: embutida, uma só leitura dá tudo o que o ecrã do artigo precisa. O mesmo fornecedor fornece muitos artigos, e o contacto dele muda sem que os artigos mudem. Se estivesse embutido em cada artigo, mudar o telefone obrigava a alterar todos esses artigos, e bastava esquecer um para a informação ficar contraditória. Referenciado, o contacto está num só documento e altera-se uma vez. O custo é ter de seguir a referência, com uma segunda leitura, quando se quer mostrar o fornecedor com o artigo.

## Problemas frequentes

### A coleção tem dezasseis documentos

Carregaste duas vezes em "Insert", e os documentos ficaram duplicados, cada cópia com um `_id` diferente. Para o MongoDB não são repetidos: são documentos diferentes que, por acaso, têm os mesmos campos. Apaga as cópias antes de fazeres as consultas, porque os resultados deste laboratório contam com oito artigos. Passa o rato sobre uma das cópias, carrega no botão de apagar e confirma. Repete até ficar um documento de cada artigo, oito no total, e confere-os com a tabela da fase 3. Confirma sempre o número de documentos depois de inserir.

### Uma consulta não devolve nada, e não dá erro

Quase sempre é uma de três causas:

- um nome de campo mal escrito, como `categria`;
- uma diferença de maiúsculas e minúsculas no valor, como `"papel"`;
- um número guardado como texto, como `stock: "12"`.

Abre um documento que devia aparecer e compara, campo a campo, o nome, a escrita e o tipo. Se o filtro usa um operador, confirma também que ele tem o `$`. Sem o `$`, `{ stock: { lt: 5 } }` procura um stock que seja o documento `{ lt: 5 }`, e não devolve nada.

### O email de confirmação da conta não chega

Procura na pasta de spam. Enquanto esperas, acompanha as fases 3 a 6 no ecrã de um colega e escreve as tuas previsões no teu caderno. Faz as consultas no teu cluster quando a conta estiver confirmada.

### O professor vê o teu projeto, mas não os teus documentos

O convite foi feito com o papel por omissão, "Project Read Only". Em "Project Identity & Access", muda o papel do professor para "Project Data Access Read Only".

### O Atlas não aceita o artigo com o fornecedorId

O valor dentro de `ObjectId('...')` tem de ter exatamente 24 carateres, só com algarismos e as letras de `a` a `f`. O engano mais comum é colar o valor com a palavra `ObjectId` e os parênteses, e ficar com `ObjectId('ObjectId(...)')`. O outro é copiar menos de 24 carateres. Compara, caráter a caráter, com o `_id` do fornecedor.

### A consulta pelo fornecedorId não devolve nada

Escreveste o valor só entre aspas, como `{ fornecedorId: "66fb..." }`, sem `ObjectId(...)`. O valor guardado é um ObjectId, e o filtro procura um texto: valores de tipos diferentes nunca são iguais. Escreve `{ fornecedorId: ObjectId('...') }`, com os 24 carateres do `_id` do fornecedor.

### Autorizaste o acesso de qualquer endereço

Se na lista de endereços autorizados aparece `0.0.0.0/0`, qualquer computador na internet pode tentar entrar, e só a palavra-passe o trava. No menu lateral, na secção de segurança, abre a lista de acesso por endereço IP, apaga essa entrada e deixa só o endereço da escola e o de casa.

### A palavra-passe da base de dados no sítio errado

Quem tiver essa palavra-passe e um endereço autorizado entra na tua base de dados. Nunca a escrevas no código, num ficheiro do projeto, no caderno ou numa mensagem. Se isso aconteceu, muda-a no Atlas, na secção de segurança, onde estão os utilizadores da base de dados.

## Desafios

Estes desafios usam os nove artigos do fim da fase 7. Em cada um, escreve primeiro a consulta e o resultado que esperas, e só depois executa.

1. Os artigos de escrita ou de desenho com menos de 10 unidades. Pista: o operador `$in` recebe uma lista de valores, escrita entre parênteses retos, e o documento fica no resultado se o campo for igual a qualquer um deles.
2. Só o nome e o preço dos artigos de papel, do mais barato para o mais caro.
3. A Cola em bastão com o telefone do fornecedor. Escreve as duas consultas que a aplicação faria, uma em cada coleção. Pista: a primeira lê o artigo; a segunda usa o que encontraste nele.

## Antes de terminares

- [ ] A tua base `papelaria` tem nove artigos na coleção `artigos` e um fornecedor na coleção `fornecedores`.
- [ ] O convite ao professor está enviado, com o papel "Project Data Access Read Only".
- [ ] A palavra-passe do utilizador da base de dados está guardada num sítio seguro, fora do código e do caderno.
- [ ] No caderno, para cada uma das sete consultas e para a pergunta feita à mão, está o que previste e o que obtiveste.
- [ ] Para cada resultado diferente do previsto, escreveste a causa, como um campo mal escrito, uma maiúscula, um operador trocado ou a falta do `$`.
- [ ] Consegues explicar, por palavras tuas, porque é que a localização ficou embutida no artigo e o fornecedor ficou numa coleção à parte.

O professor pode pedir-te para explicares um destes pontos em voz alta, ou para preveres o resultado de uma consulta parecida, com outros valores. É assim que se verifica que o trabalho é teu.

![Rodapé](../imagens/rodape.png)
