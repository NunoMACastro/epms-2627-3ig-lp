![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: modelo documental e primeiras consultas no Atlas

Laboratório das aulas 2 e 3 do tema [Modelo documental e primeiras consultas no Atlas](02-modelo-documental-e-consultas-no-atlas.md). Este documento diz o que fazer, passo a passo, com o MongoDB Atlas aberto ao lado. As explicações do porquê estão no guia: quando um passo usa uma ideia, o texto diz em que secção do guia ela está explicada.

## Antes de começar

Precisas de um browser, de acesso ao teu email, para confirmares a conta do Atlas, e do teu caderno.

Antes do laboratório deves ter lido, no guia, as secções "O modelo documental", "Embutir ou referenciar" e "Como se pergunta ao MongoDB". O laboratório não repete essas explicações: aplica-as.

A forma de trabalhar é sempre a mesma. Antes de executares uma consulta, escreves no caderno o resultado que esperas. Depois executas e comparas. Quando o resultado é diferente do que previste, a explicação dessa diferença é o que mais te ensina, por isso não a saltes. Escrever primeiro obriga-te a pensar. Executar primeiro só te mostra o que o Atlas fez.

O Atlas muda o aspeto das páginas de vez em quando. Os nomes dos botões deste guia foram confirmados na documentação da MongoDB em setembro de 2026. Se um botão não tiver exatamente o mesmo nome no teu ecrã, procura o que tem a mesma função: os passos são os mesmos.

## Parte 1: criar a conta, o cluster e dar acesso ao professor

### Criar a conta

Abre a página de registo do Atlas, em `https://www.mongodb.com/cloud/atlas/register`, e cria a conta. Confirma o endereço de email na mensagem que vais receber. Se o Atlas fizer perguntas de boas-vindas sobre o que vais construir, responde como quiseres: não mudam nada do que se segue.

Se o Atlas te pedir para criar uma organização e um projeto, dá-lhes um nome que te identifique, por exemplo o teu primeiro nome seguido de `lp12`. Se já os tiver criado por ti, usa esses.

### Criar o cluster gratuito

1. No menu lateral, abre a visão geral do projeto, "Project Overview".
2. Carrega em "Create" para criar um cluster.
3. Escolhe o plano gratuito, identificado como "M0" ou "Free".
4. Escolhe o fornecedor de cloud (qualquer um serve) e uma região na Europa.
5. Dá um nome ao cluster, só com letras, algarismos e hífenes, por exemplo `cluster-lp12`. O nome não se pode mudar depois.
6. Carrega em "Create". O cluster fica pronto em poucos segundos.

### Os dois passos de segurança que o Atlas pede a seguir

Logo depois de criar o cluster, o Atlas mostra um assistente de segurança com dois passos. Nenhum dos dois é preciso para o laboratório de hoje, porque o browser acede aos dados pela página do Atlas. Mas vão ser precisos quando o teu programa se ligar à base de dados, por isso faz os dois agora.

O primeiro é criar um **utilizador da base de dados**. Não é a tua conta do Atlas: é um nome e uma palavra-passe que o teu programa vai usar para entrar na base de dados. Escolhe um nome de utilizador, aceita a palavra-passe que o Atlas sugere ou escolhe uma longa, e carrega em "Create Database User". Guarda a palavra-passe num gestor de palavras-passe ou noutro sítio seguro. Nunca a escrevas num ficheiro de código nem num ficheiro que vá para o GitHub. Mais à frente vais aprender a forma certa de a entregar ao programa.

O segundo é dizer ao Atlas de onde é permitido ligar. Por defeito, o Atlas recusa ligações de qualquer lado. Carrega em "Add My Current IP Address" para autorizar o endereço de onde estás agora, que é o da escola, e depois em "Finish and Close". Quando quiseres trabalhar em casa, acrescentas o endereço de casa da mesma forma. Não autorizes o acesso de qualquer endereço (`0.0.0.0/0`). A palavra-passe continuaria a ser precisa, mas tirarias uma das duas proteções: é como deixar o portão da escola aberto a toda a gente e confiar só na chave da sala.

### Dar acesso ao professor

1. No menu lateral, na secção de segurança, abre "Project Identity & Access".
2. No separador "Users", carrega em "Invite to Project".
3. Escreve o email que o professor indicar na aula.
4. Escolhe o papel "Project Data Access Read Only" e retira o "Project Read Only", que o Atlas escolhe por defeito. Com o papel por defeito, o professor via o projeto mas não conseguia ver os teus documentos.
5. Carrega em "Grant Access".

O professor recebe um email e só tem acesso depois de aceitar o convite.

## Parte 2: criar a base de dados e inserir os artigos

### Criar a base de dados e a primeira coleção

No menu lateral, na secção da base de dados, abre o "Data Explorer". Passa o rato por cima do nome do teu cluster e carrega no botão que abre a janela "Create Database". Preenche os dois campos obrigatórios:

- Database Name: `papelaria`
- Collection Name: `artigos`

Carrega em "Create Database". A base de dados e a coleção aparecem na lista do lado esquerdo.

Os nomes das bases de dados e das coleções seguem a mesma regra dos nomes de ficheiros que usas: minúsculas, sem espaços e sem acentos. O MongoDB recusa alguns carateres, como o espaço, o ponto e o `$`, e distingue maiúsculas de minúsculas de forma traiçoeira: não deixa ter ao mesmo tempo `Papelaria` e `papelaria`. Com minúsculas sempre, nunca tens o problema.

### Inserir os oito artigos

Com a coleção `artigos` aberta, carrega em "Add Data" e escolhe "Insert Document". Na janela que se abre, o modo de escrita por defeito aceita a sintaxe do JavaScript: nomes de campos sem aspas e vários documentos de uma vez, dentro de um array. Apaga o que lá estiver, copia este array e carrega em "Insert":

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

Repara que nenhum documento tem `_id`. Depois de inserir, abre um deles e confirma que o MongoDB lhe deu um `_id` do tipo ObjectId. Confirma também que a coleção tem exatamente oito documentos. Se tiver dezasseis, carregaste em "Insert" duas vezes: apaga os repetidos antes de continuar, porque as consultas seguintes contam com oito.

## Parte 3: primeiras consultas

### Onde se escrevem as consultas

Com a coleção `artigos` aberta no Data Explorer, há uma barra de consulta por cima da lista de documentos. O campo principal é o do filtro ("Filter"). Escreves lá o filtro e carregas em "Find" para executar. "Reset" limpa a consulta e volta a mostrar todos os documentos.

Ao lado do filtro há mais campos: "Project", para a projeção, "Sort", para a ordenação, e "Limit", para o limite. Se não estiverem visíveis, abre as opções da barra de consulta. O que cada um faz está explicado no guia, na secção "Como se pergunta ao MongoDB".

Em cada consulta: escreve no caderno o número da consulta e os artigos que esperas, executa, e anota o que apareceu. Os resultados certos estão no fim desta parte. Só os vês depois de teres feito as sete.

### Consulta 1: artigos de uma categoria

No filtro:

```js
{ categoria: "Papel" }
```

Depois de executares, experimenta a mesma consulta com `"papel"`, em minúscula, e anota o que acontece.

### Consulta 2: artigos com pouco stock

No filtro:

```js
{ stock: { $lt: 5 } }
```

### Consulta 3: duas condições ao mesmo tempo

No filtro:

```js
{ categoria: "Escrita", stock: { $lt: 10 } }
```

### Consulta 4: um intervalo de preços

No filtro:

```js
{ precoCentimos: { $gte: 100, $lte: 300 } }
```

### Consulta 5: um campo de um documento embutido

No filtro:

```js
{ "localizacao.corredor": "C" }
```

### Consulta 6: escolher os campos que aparecem

No filtro, a mesma condição da consulta 2, `{ stock: { $lt: 5 } }`. No campo "Project":

```js
{ nome: 1, stock: 1, _id: 0 }
```

Antes de executares, responde no caderno: aparecem os mesmos documentos da consulta 2 ou outros?

### Consulta 7: ordenar e limitar

Deixa o filtro vazio, para considerar todos os artigos. No campo "Sort":

```js
{ precoCentimos: -1 }
```

No campo "Limit", escreve `3`.

### A pergunta que a barra de consulta não faz

Responde à mão, olhando para os oito artigos que inseriste: que artigos estão abaixo do stock mínimo? Um artigo está abaixo do mínimo quando o seu `stock` é menor do que o seu `stockMinimo`. O guia explica, na secção "O que uma consulta simples não consegue perguntar", porque é que esta pergunta não se escreve na barra de consulta.

Depois, compara a tua lista com o resultado da consulta 2. São iguais? Se não, que artigos mudam, e porquê?

### Os resultados que deves obter

Compara com o que anotaste. Se algum resultado for diferente, procura a causa antes de passares à frente: os erros mais comuns estão no guia, na secção "Erros frequentes nas consultas".

| Consulta | Resultado |
| --- | --- |
| 1 | Caderno A4 quadriculado, Bloco de notas A5 e Resma de papel A4: três documentos. Com `"papel"`, em minúscula, não aparece nenhum, e não há erro |
| 2 | Esferográfica azul (3), Bloco de notas A5 (0), Resma de papel A4 (4) e Compasso escolar (1): quatro documentos |
| 3 | Esferográfica azul (3) e Marcador fluorescente (8): dois documentos. O Lápis HB é de Escrita, mas tem 25 e fica de fora |
| 4 | Caderno A4 quadriculado (250), Bloco de notas A5 (180) e Régua de 30 cm (120): três documentos |
| 5 | Régua de 30 cm e Compasso escolar: dois documentos |
| 6 | Os mesmos quatro documentos da consulta 2, cada um só com o nome e o stock |
| 7 | Resma de papel A4 (520), Compasso escolar (450) e Caderno A4 quadriculado (250), por esta ordem |
| À mão | Esferográfica azul (3 de 10), Bloco de notas A5 (0 de 4), Marcador fluorescente (8 de 10) e Compasso escolar (1 de 2) |

A lista feita à mão e a consulta 2 têm quatro artigos cada, mas não os mesmos. A Resma de papel A4 tem pouco stock (4), mas está acima do mínimo (3), por isso ainda não é preciso encomendar. O Marcador fluorescente tem 8 unidades, o que não parece pouco, mas o mínimo é 10. É esta diferença que justifica ter guardado o stock mínimo em cada artigo.

## Parte 4: guardar uma referência

### Criar o fornecedor e ligar-lhe um artigo

Cria uma segunda coleção, `fornecedores`, na base `papelaria`. No Data Explorer, passa o rato sobre o nome da base de dados e usa o botão que cria uma coleção nova.

Na coleção `fornecedores`, insere este documento, sem `_id`:

```js
{ nome: "Fornecedor Exemplo, Lda.", telefone: "210000000", email: "encomendas@fornecedor.example" }
```

Abre o documento inserido e copia o valor do `_id` que o MongoDB lhe deu: os 24 carateres entre as aspas.

Volta à coleção `artigos` e insere mais um artigo, já com a referência ao fornecedor. Substitui `COLA_AQUI_O_ID` pelos 24 carateres que copiaste, mantendo as aspas:

```js
{ nome: "Cola em bastão", categoria: "Escrita", stock: 15, stockMinimo: 5, precoCentimos: 140, localizacao: { corredor: "B", prateleira: 3 }, fornecedorId: ObjectId('COLA_AQUI_O_ID') }
```

Agora encontra os artigos desse fornecedor, com o mesmo `ObjectId` no filtro:

```js
{ fornecedorId: ObjectId('COLA_AQUI_O_ID') }
```

Deve aparecer só a Cola em bastão. Os outros oito artigos não têm o campo `fornecedorId`, e por isso não cumprem a condição. É mais um exemplo do esquema flexível: numa aplicação a sério, todos os artigos teriam fornecedor.

### Ver que o MongoDB não verifica as referências

Insere na coleção `artigos` um artigo com uma referência a um fornecedor que não existe:

```js
{ nome: "Artigo de teste", categoria: "Escrita", stock: 1, stockMinimo: 1, precoCentimos: 100, localizacao: { corredor: "B", prateleira: 3 }, fornecedorId: ObjectId('000000000000000000000000') }
```

O MongoDB aceita o documento sem nenhum aviso, embora nenhum fornecedor tenha aquele `_id`. É a demonstração do que se explicou na teoria: a base de dados guarda a referência, mas não confirma que ela leva a algum lado. Essa verificação vai ser trabalho da tua aplicação.

Apaga agora o "Artigo de teste": passa o rato sobre o documento, carrega no botão de apagar e confirma. A coleção `artigos` deve ficar com nove documentos: os oito do início e a Cola em bastão.

## Problemas frequentes no laboratório

### Documentos inseridos duas vezes

Carregar duas vezes em "Insert" duplica os documentos, cada cópia com um `_id` diferente. Para o MongoDB não são repetidos: são documentos diferentes que por acaso têm os mesmos campos. Confirma sempre o número de documentos depois de inserir, e apaga as cópias antes de fazeres as consultas, porque os resultados da tabela contam com oito artigos.

### Uma consulta que não devolve nada

Quase sempre é um nome de campo mal escrito, uma diferença de maiúsculas e minúsculas, ou um número guardado como texto. O guia explica as três causas e como as encontrar, na secção "Erros frequentes nas consultas".

### A palavra-passe da base de dados no sítio errado

Quem tiver essa palavra-passe e um endereço autorizado entra na tua base de dados. Nunca a escrevas no código, num ficheiro do projeto, no caderno que partilhas ou numa mensagem.

## O que fica no teu caderno

No fim das duas aulas, o teu caderno deve ter:

- para cada uma das sete consultas e para a pergunta feita à mão, o resultado que previste e o que obtiveste;
- para cada resultado diferente do previsto, uma frase a explicar a causa;
- por palavras tuas, porque é que a localização ficou embutida no artigo e o fornecedor ficou numa coleção à parte.

O professor pode pedir-te para explicares um destes pontos em voz alta. É assim que se verifica que o trabalho é teu.

![Rodapé](../imagens/rodape.png)
