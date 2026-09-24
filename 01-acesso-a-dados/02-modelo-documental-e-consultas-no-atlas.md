![Cabeçalho](../imagens/cabecalho.png)

# Modelo documental e primeiras consultas no Atlas

Módulo M14, Acesso a Bases de Dados. Três aulas de 60 minutos: a primeira é de teoria e as outras duas são de laboratório no MongoDB Atlas, que se usa no browser. Não precisas de instalar nada.

## O que vais aprender

Este ano vais construir uma aplicação que guarda os dados numa base de dados MongoDB. Antes de escreveres uma linha de código para falar com a base de dados, precisas de perceber como é que ela organiza a informação e como se lhe fazem perguntas. É isso que este guia trata, sem código: só com a base de dados e o browser.

No fim deste guia deves conseguir explicar o que são um documento, uma coleção e uma base de dados, e para que serve o campo `_id`. Deves conseguir decidir, num problema concreto, que informação fica dentro de um documento e que informação fica noutro documento, ligada por uma referência, e justificar a decisão. E deves conseguir criar uma base de dados no MongoDB Atlas, inserir documentos e fazer-lhe consultas com filtros, escolha de campos e ordenação, prevendo o resultado antes de carregar no botão.

## O que já sabes e vais usar

No 11.º ano trabalhaste com objetos JavaScript. Um objeto junta várias informações sobre a mesma coisa, cada uma com um nome. Este objeto descreve um artigo de uma papelaria:

```js
const artigo = {
  nome: 'Caderno A4 quadriculado',
  categoria: 'Papel',
  stock: 12,
  precoCentimos: 250,
};
```

Cada par nome e valor chama-se uma propriedade. Chega-se a cada valor com o ponto: `artigo.stock` dá `12`. Um array de objetos é uma lista destes objetos, e com `filter`, `map` e `sort` escolhes, transformas e ordenas os elementos da lista.

Também viste o JSON, que é a forma de escrever objetos como texto para os guardar num ficheiro ou os enviar pela rede. O objeto acima, em JSON, fica igual mas com os nomes entre aspas duplas: `{ "nome": "Caderno A4 quadriculado", "categoria": "Papel", "stock": 12, "precoCentimos": 250 }`.

O preço está em cêntimos, como número inteiro: `250` quer dizer 2,50 €. Guarda-se assim porque os números com casas decimais nem sempre dão contas exatas no computador, e com dinheiro uma conta errada por um cêntimo é um erro a sério.

Se alguma destas ideias estiver pouco firme, é normal. Vais usá-las muitas vezes neste guia, e o professor retoma-as sempre que for preciso.

## Porque é que uma aplicação precisa de uma base de dados

Um array de objetos vive na memória do computador enquanto o programa está a correr. Quando o programa termina, ou o computador se desliga, os dados desaparecem. Para a maior parte das aplicações isso não serve: numa papelaria, o stock de ontem tem de estar lá amanhã.

Podias guardar os dados num ficheiro JSON, e para um programa pequeno usado por uma só pessoa isso funciona. Mas imagina a papelaria da escola com três funcionários a vender ao mesmo tempo, em três computadores. Se dois programas escreverem no mesmo ficheiro ao mesmo tempo, um apaga o trabalho do outro. Se o ficheiro tiver dez mil artigos, encontrar os que têm pouco stock obriga a ler o ficheiro inteiro de cada vez. E se o computador se desligar a meio de uma escrita, o ficheiro pode ficar estragado.

Uma **base de dados** é um programa especializado em guardar dados de forma segura e em encontrá-los depressa, mesmo com muitos utilizadores ao mesmo tempo. A tua aplicação não guarda os dados ela própria: pede à base de dados que os guarde e pergunta-lhe o que precisa de saber.

O MongoDB é uma dessas bases de dados. O **MongoDB Atlas** é o MongoDB a funcionar na cloud, em servidores geridos pela empresa que o faz. Tu crias a tua base de dados numa página web, e a empresa trata de a manter ligada, protegida e com cópias de segurança. É o que vais usar este ano.

## O modelo documental

Cada base de dados tem uma forma de organizar a informação, a que se chama o seu modelo. O MongoDB usa o **modelo documental**: a informação guarda-se em documentos.

### Documento, coleção e base de dados

Um **documento** é um conjunto de campos, cada um com um nome e um valor, que descreve uma coisa: um artigo, um fornecedor, uma venda. Tem a mesma forma de um objeto JavaScript. Os campos de um documento são o equivalente às propriedades de um objeto.

Uma **coleção** é um conjunto de documentos do mesmo tipo. Todos os artigos da papelaria ficam na coleção `artigos`, todos os fornecedores na coleção `fornecedores`, todas as vendas na coleção `vendas`.

Uma **base de dados** é um conjunto de coleções que pertencem à mesma aplicação. A base de dados `papelaria` tem as três coleções anteriores.

Uma forma de fixar as três ideias é pensar num arquivo em papel. Cada documento é uma ficha preenchida. Cada coleção é uma gaveta onde se guardam as fichas do mesmo tipo: a gaveta dos artigos e a gaveta dos fornecedores. A base de dados é o armário com as gavetas todas da papelaria.

No Atlas há ainda dois níveis por cima destes, que vais encontrar ao criar a conta. Um **cluster** é o conjunto de servidores onde o MongoDB está a correr e onde vivem as tuas bases de dados. Um **projeto** agrupa clusters, e uma **organização** agrupa projetos. Do maior para o mais pequeno:

```text
organização → projeto → cluster → base de dados → coleção → documento
```

### Um documento parece um objeto JavaScript, mas não é bem igual

Quando escreves um documento no Atlas, escreves-o com a mesma forma de um objeto JavaScript ou de um JSON. Mas o MongoDB não o guarda como texto. Guarda-o num formato binário chamado **BSON**, que tem mais tipos de valores do que o JSON.

A diferença que mais interessa agora é esta. Em JSON, uma data é apenas texto, como `"2026-10-01"`. Para o computador, isso é uma sequência de carateres, e não uma data: não sabe que outubro vem depois de setembro. No BSON existe um tipo de data a sério, que se pode comparar e ordenar corretamente. No Atlas escreve-se assim: `ISODate('2026-10-01T10:15:00Z')`. O mesmo acontece com o identificador de cada documento, que tem um tipo próprio, o ObjectId, explicado já a seguir.

Por isso, quando neste guia vires um documento escrito com `ISODate(...)` ou `ObjectId(...)`, é a forma de dizer ao MongoDB que aquele valor tem um tipo especial, e não é um simples texto.

### O campo _id e o ObjectId

Cada documento de uma coleção tem obrigatoriamente um campo chamado `_id`, com um valor diferente do de todos os outros documentos da mesma coleção. É o que permite dizer "este documento e não outro", mesmo que haja dois artigos com o mesmo nome.

Se inserires um documento sem `_id`, o MongoDB cria um automaticamente, do tipo **ObjectId**. Um ObjectId aparece escrito como 24 carateres, com algarismos e letras de `a` a `f`, por exemplo `ObjectId('66fb1c2a9d3e4f5a6b7c8d01')`. Por dentro são 12 bytes com três partes: os primeiros 4 guardam o momento em que foi criado, em segundos, os 5 seguintes são um valor aleatório gerado pelo programa que o criou, e os últimos 3 são um contador que sobe de cada vez. Esta combinação torna praticamente impossível que dois ObjectId saiam iguais, mesmo criados ao mesmo tempo em computadores diferentes.

Na prática, não inventas valores de `_id` à mão. Deixas o MongoDB criá-los e usas o que ele criou.

### Os documentos de uma coleção não têm de ser iguais

Numa folha de cálculo, todas as linhas têm as mesmas colunas. No MongoDB, dois documentos da mesma coleção podem ter campos diferentes. Um artigo pode ter um campo `cor` e outro não ter. Diz-se que o MongoDB tem um **esquema flexível**.

Isto dá jeito quando os dados variam de verdade, mas também é um perigo. Se escreveres `categria` em vez de `categoria` num documento, o MongoDB aceita sem dizer nada: para ele, é só um campo com outro nome. Depois, quando procurares os artigos de uma categoria, esse documento não aparece, e não há nenhuma mensagem de erro a avisar. O mesmo acontece se guardares o stock como texto (`"12"`) num documento e como número (`12`) nos outros.

Por isso, a responsabilidade de manter os documentos coerentes é tua e da tua aplicação. Mais à frente no módulo vais escrever o código que verifica os dados antes de os guardar. Por agora, a regra é escrever os documentos de uma coleção sempre com os mesmos nomes de campos e os mesmos tipos.

### Se já trabalhaste com tabelas

Se em Sistemas de Informação já trabalhaste com bases de dados de tabelas, esta comparação ajuda a situar as ideias. Se ainda não trabalhaste, podes saltá-la.

| Base de dados de tabelas | MongoDB |
| --- | --- |
| Tabela | Coleção |
| Linha | Documento |
| Coluna | Campo |
| Chave primária | Campo `_id` |
| Todas as linhas têm as mesmas colunas | Os documentos podem ter campos diferentes |
| Informação relacionada fica noutra tabela e junta-se com uma consulta | Informação relacionada pode ficar dentro do próprio documento |

A última linha é a grande diferença, e é o assunto da secção seguinte.

## Embutir ou referenciar

Quando uma informação está relacionada com outra, o MongoDB deixa-te escolher entre duas formas de a guardar.

**Embutir** é guardar a informação dentro do próprio documento. A localização de um artigo na papelaria (corredor e prateleira) pode ficar dentro do documento do artigo, como um documento dentro de outro:

```js
{
  nome: "Caderno A4 quadriculado",
  categoria: "Papel",
  localizacao: { corredor: "A", prateleira: 1 }
}
```

A um documento guardado dentro de outro chama-se **documento embutido**. Também se pode embutir um array, por exemplo a lista das linhas de uma venda.

**Referenciar** é guardar a informação num documento separado, noutra coleção, e guardar no primeiro documento apenas o `_id` do segundo. O fornecedor de um artigo pode ficar na coleção `fornecedores`, e o artigo guarda só o identificador do fornecedor:

```js
{
  nome: "Caderno A4 quadriculado",
  categoria: "Papel",
  fornecedorId: ObjectId('66fb1c2a9d3e4f5a6b7c8d01')
}
```

### Como decidir

Há duas perguntas que ajudam a decidir: "que ecrã vai ler estes dados?" e "que dados mudam ao mesmo tempo?". A partir delas chega-se a duas regras.

Embute-se quando a informação é sempre lida juntamente com o documento principal e não pode crescer sem limite. A localização de um artigo aparece sempre que se mostra o artigo, e cada artigo tem uma só localização. Embutir é a escolha natural: com uma só leitura tens tudo o que o ecrã precisa.

Referencia-se quando a informação é reutilizada por muitos documentos ou é alterada de forma independente. O mesmo fornecedor fornece dezenas de artigos. Se o contacto do fornecedor mudar e estiver embutido em cada artigo, tens de o alterar em dezenas de sítios, e basta esquecer um para a informação ficar contraditória. Referenciado, o contacto está num só documento e altera-se uma vez.

A regra do crescimento tem uma razão concreta: cada documento tem um tamanho máximo de 16 MiB, cerca de 16 milhões de bytes. Nenhum artigo chega perto disso, mas uma lista que cresce sempre, como todas as vendas de um artigo desde que a papelaria abriu, acabaria por chegar. Uma lista assim nunca se embute. Cada venda é um documento da sua coleção.

### Copiar de propósito

Há um caso em que se guarda uma cópia de propósito, e percebê-lo evita um erro frequente. Numa venda, cada linha diz que artigo se vendeu. Podias guardar só a referência ao artigo. Mas se em janeiro o preço do caderno subir de 2,50 € para 2,80 €, as vendas de outubro passariam a mostrar o preço novo, e a faturação de outubro deixaria de bater certo.

Por isso, cada linha da venda guarda a referência ao artigo e também uma cópia do nome e do preço no momento da venda. Não é uma repetição descuidada: é o registo do que aconteceu naquele dia, e esse registo não deve mudar quando o artigo mudar.

### O MongoDB não verifica as referências

Quando um artigo guarda `fornecedorId`, o MongoDB não confirma que existe mesmo um fornecedor com esse `_id`. Aceita qualquer ObjectId. E se um fornecedor for apagado, os artigos que o referiam continuam a apontar para um documento que já não existe.

A regra simples é esta: é a tua aplicação que tem de confirmar que o documento referido existe antes de guardar a referência, e que tem de decidir o que acontece às referências quando um documento é apagado. Vais ver isto na prática no laboratório.

## Modelar a partir das perguntas

Um bom modelo não se desenha a pensar nas coisas que existem. Desenha-se a pensar nas perguntas que a aplicação vai ter de responder. O método tem cinco passos:

1. Escrever as perguntas que a aplicação tem de responder, tal como quem a usa as faria.
2. Para cada pergunta, identificar a informação necessária.
3. Agrupar essa informação em coleções, uma por tipo de coisa.
4. Para cada informação relacionada, decidir se se embute ou se se referencia, com as regras acima.
5. Escrever um documento de exemplo de cada coleção e confirmar, pergunta a pergunta, que a resposta está lá.

O quinto passo é o mais importante e o mais esquecido. Um modelo que não responde a uma das perguntas está errado, por mais arrumado que pareça.

## Exemplo guiado: modelar o inventário da papelaria

A papelaria da escola quer uma aplicação para gerir o stock e as vendas. Vamos seguir os cinco passos.

### Passo 1: as perguntas

Depois de falar com quem trabalha na papelaria, chegámos a estas perguntas:

1. Que artigos há de uma dada categoria (papel, escrita, desenho)?
2. Que artigos têm pouco stock?
3. Que artigos estão abaixo do stock mínimo e precisam de ser encomendados?
4. Onde está arrumado um artigo?
5. Quem fornece um artigo, e qual é o contacto desse fornecedor?
6. O que se vendeu num dia, e quanto se faturou?

### Passo 2: a informação de que cada pergunta precisa

As perguntas 1 e 2 precisam da categoria e do stock de cada artigo. A pergunta 3 precisa de uma informação que ainda não tínhamos: o stock mínimo de cada artigo, abaixo do qual é preciso encomendar. Repara que "pouco stock" e "abaixo do mínimo" são perguntas diferentes. Cinco resmas de papel podem ser poucas, e cinco compassos podem ser muitos. O mínimo depende do artigo, por isso tem de ficar guardado em cada artigo.

A pergunta 4 precisa do corredor e da prateleira. A pergunta 5 precisa do nome e do contacto do fornecedor. A pergunta 6 precisa da data de cada venda, dos artigos vendidos, das quantidades e dos preços.

### Passo 3: as coleções

Há três tipos de coisas: artigos, fornecedores e vendas. Ficam três coleções: `artigos`, `fornecedores` e `vendas`.

### Passo 4: embutir ou referenciar

A localização do artigo embute-se no artigo. É sempre lida com o artigo, cada artigo tem uma só, e não cresce.

O fornecedor referencia-se a partir do artigo. Um fornecedor fornece muitos artigos, e o seu contacto muda sem que os artigos mudem.

As linhas de uma venda embutem-se na venda. São sempre lidas com a venda, pertencem só àquela venda, e uma venda tem um número limitado de linhas. Cada linha referencia o artigo vendido e guarda uma cópia do nome e do preço no momento da venda, pela razão explicada em "Copiar de propósito".

As vendas não se embutem nos artigos. Um artigo vende-se todos os dias, e a lista cresceria sem limite.

### Passo 5: os documentos de exemplo

Um documento da coleção `artigos`:

```js
{
  _id: ObjectId('66fb1c2a9d3e4f5a6b7c8d10'),
  nome: "Caderno A4 quadriculado",
  categoria: "Papel",
  stock: 12,
  stockMinimo: 5,
  precoCentimos: 250,
  localizacao: { corredor: "A", prateleira: 1 },
  fornecedorId: ObjectId('66fb1c2a9d3e4f5a6b7c8d01')
}
```

Um documento da coleção `fornecedores`:

```js
{
  _id: ObjectId('66fb1c2a9d3e4f5a6b7c8d01'),
  nome: "Fornecedor Exemplo, Lda.",
  telefone: "210000000",
  email: "encomendas@fornecedor.example"
}
```

Um documento da coleção `vendas`:

```js
{
  _id: ObjectId('66fb1c2a9d3e4f5a6b7c8d90'),
  data: ISODate('2026-10-01T10:15:00Z'),
  linhas: [
    {
      artigoId: ObjectId('66fb1c2a9d3e4f5a6b7c8d10'),
      nome: "Caderno A4 quadriculado",
      quantidade: 2,
      precoCentimos: 250
    },
    {
      artigoId: ObjectId('66fb1c2a9d3e4f5a6b7c8d11'),
      nome: "Esferográfica azul",
      quantidade: 3,
      precoCentimos: 60
    }
  ],
  totalCentimos: 680
}
```

Os valores de `_id` são exemplos para leres o modelo. Na base de dados verdadeira é o MongoDB que os cria. O `fornecedorId` do artigo é igual ao `_id` do fornecedor, e o `artigoId` da primeira linha da venda é igual ao `_id` do artigo: é assim que se lê uma referência. O telefone e o email do fornecedor são fictícios.

O total da venda confere: duas vezes 250 cêntimos dá 500, três vezes 60 dá 180, e 500 mais 180 dá 680 cêntimos, ou seja, 6,80 €.

Agora, a confirmação pergunta a pergunta:

| Pergunta | Onde está a resposta |
| --- | --- |
| 1. Artigos de uma categoria | Campo `categoria` de cada artigo |
| 2. Artigos com pouco stock | Campo `stock` de cada artigo |
| 3. Artigos abaixo do mínimo | Campos `stock` e `stockMinimo` de cada artigo |
| 4. Onde está um artigo | Documento embutido `localizacao` do artigo |
| 5. Quem fornece um artigo | `fornecedorId` do artigo, que leva ao documento do fornecedor |
| 6. O que se vendeu num dia e quanto se faturou | Campos `data`, `linhas` e `totalCentimos` das vendas desse dia |

Todas as perguntas têm resposta. O modelo serve.

## O MongoDB Atlas

O Atlas tem vários planos. Este ano usas o plano gratuito, que dá a cada projeto um cluster gratuito. Os limites deste cluster chegam folgadamente para o que vais fazer: 0,5 GB de dados, até 500 ligações ao mesmo tempo e até 100 operações por segundo. Há uma regra a lembrar: se o cluster passar 30 dias sem nenhuma ligação, o Atlas põe-no em pausa. Isso pode acontecer nas férias.

Na turma, cada um cria a sua conta, o seu projeto e o seu cluster. Assim, os teus dados são só teus, ninguém os estraga por engano, e o mesmo cluster vai servir para o teu projeto final. Para o professor poder ver e acompanhar o teu trabalho, dás-lhe acesso de leitura ao teu projeto.

O Atlas muda o aspeto das páginas de vez em quando. Os nomes dos botões deste guia foram confirmados na documentação da MongoDB em setembro de 2026. Se um botão não tiver exatamente o mesmo nome no teu ecrã, procura o que tem a mesma função: os passos são os mesmos.

## Laboratório, parte 1: criar a conta, o cluster e dar acesso ao professor

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

## Laboratório, parte 2: criar a base de dados e inserir os artigos

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

## Laboratório, parte 3: primeiras consultas

### A barra de consulta

Por cima da lista de documentos há uma barra de consulta. O campo principal é o **filtro** ("Filter"), onde escreves a condição que os documentos têm de cumprir. Carregas em "Find" para executar a consulta e em "Reset" para voltar a ver todos os documentos.

Ao lado do filtro há mais campos: "Project", para escolher que campos aparecem, "Sort", para ordenar, e "Limit", para limitar o número de documentos. Se não estiverem visíveis, abre as opções da barra de consulta.

Estes campos fazem na base de dados o que já fazias com arrays em JavaScript:

| Barra de consulta do Atlas | Em JavaScript, com um array |
| --- | --- |
| Filter | `filter` |
| Project | `map`, a escolher só alguns campos |
| Sort | `sort` |
| Limit | `slice(0, n)` |

A diferença é quem faz o trabalho. Com um array, é o teu programa que percorre os dados. Com a base de dados, é ela que procura e devolve só o resultado. Com oito artigos não se nota. Com cem mil, é a diferença entre esperar um instante e esperar minutos.

Em cada consulta, antes de carregares em "Find", escreve no caderno o resultado que esperas. Depois compara. Quando o resultado for diferente do que previste, a explicação dessa diferença é o que mais te ensina.

### Consulta 1: artigos de uma categoria

```js
{ categoria: "Papel" }
```

O filtro lê-se "documentos cujo campo `categoria` é igual a `Papel`". Resultado: o Caderno A4 quadriculado, o Bloco de notas A5 e a Resma de papel A4, três documentos.

Experimenta agora `{ categoria: "papel" }`, com minúscula. Não aparece nada, e não há erro. O MongoDB compara o texto exatamente como está escrito, e `papel` não é igual a `Papel`.

### Consulta 2: artigos com pouco stock

Para comparar com "menor do que", "maior do que" e semelhantes, usa-se um **operador**. Os operadores começam sempre por `$` e escrevem-se como um documento dentro do filtro:

```js
{ stock: { $lt: 5 } }
```

Lê-se "documentos cujo campo `stock` é menor do que 5". Resultado: a Esferográfica azul (3), o Bloco de notas A5 (0), a Resma de papel A4 (4) e o Compasso escolar (1), quatro documentos.

Os operadores de comparação mais usados são estes:

| Operador | Significado | Exemplo |
| --- | --- | --- |
| `$eq` | igual a | `{ stock: { $eq: 0 } }` |
| `$ne` | diferente de | `{ categoria: { $ne: "Papel" } }` |
| `$gt` | maior do que | `{ stock: { $gt: 10 } }` |
| `$gte` | maior ou igual a | `{ stock: { $gte: 10 } }` |
| `$lt` | menor do que | `{ stock: { $lt: 5 } }` |
| `$lte` | menor ou igual a | `{ stock: { $lte: 5 } }` |
| `$in` | igual a um dos valores da lista | `{ categoria: { $in: ["Papel", "Desenho"] } }` |

O `$eq` raramente se escreve, porque `{ stock: 0 }` quer dizer o mesmo que `{ stock: { $eq: 0 } }`.

### Consulta 3: duas condições ao mesmo tempo

```js
{ categoria: "Escrita", stock: { $lt: 10 } }
```

Quando o filtro tem vários campos, o documento tem de cumprir todos. Lê-se "categoria é Escrita e stock é menor do que 10". Resultado: a Esferográfica azul (3) e o Marcador fluorescente (8), dois documentos. O Lápis HB é da categoria Escrita, mas tem 25 de stock e fica de fora.

### Consulta 4: um intervalo de valores

```js
{ precoCentimos: { $gte: 100, $lte: 300 } }
```

Dois operadores no mesmo campo também têm de se cumprir os dois: "preço maior ou igual a 100 cêntimos e menor ou igual a 300 cêntimos", ou seja, entre 1,00 € e 3,00 €. Resultado: o Caderno A4 quadriculado (250), o Bloco de notas A5 (180) e a Régua de 30 cm (120), três documentos.

### Consulta 5: um campo de um documento embutido

```js
{ "localizacao.corredor": "C" }
```

Para chegar a um campo dentro de um documento embutido, junta-se o nome dos dois campos com um ponto, como em JavaScript. Neste caso o nome tem de ficar entre aspas, porque tem um ponto no meio. Resultado: a Régua de 30 cm e o Compasso escolar, dois documentos.

### Consulta 6: escolher os campos que aparecem

Escreve no filtro a consulta 2, `{ stock: { $lt: 5 } }`, e no campo "Project" escreve:

```js
{ nome: 1, stock: 1, _id: 0 }
```

O `1` quer dizer "mostrar este campo" e o `0` quer dizer "esconder este campo". A isto chama-se **projeção**. Os documentos são os mesmos quatro da consulta 2, mas cada um mostra só o nome e o stock.

O `_id` aparece sempre, a não ser que o escondas com `_id: 0`. Numa projeção não se podem misturar campos a mostrar e campos a esconder, com uma única exceção, que é precisamente o `_id`. Se escreveres `{ nome: 1, stock: 0 }`, o Atlas dá erro.

### Consulta 7: ordenar e limitar

Deixa o filtro vazio, para considerar todos os artigos. No campo "Sort" escreve:

```js
{ precoCentimos: -1 }
```

e no campo "Limit" escreve `3`. O `-1` quer dizer ordem decrescente, do maior para o menor, e o `1` quer dizer ordem crescente. O limite fica só com os três primeiros. Resultado: os três artigos mais caros, por esta ordem: Resma de papel A4 (520), Compasso escolar (450) e Caderno A4 quadriculado (250).

### A pergunta que a barra de consulta não faz

A pergunta 3 do exemplo guiado era "que artigos estão abaixo do stock mínimo?". Tenta escrevê-la com o que já sabes. Não consegues com os operadores da tabela, porque eles comparam um campo com um valor fixo, e esta pergunta compara dois campos do mesmo documento: `stock` com `stockMinimo`. No MongoDB isso faz-se com o operador `$expr`, e a documentação do Atlas diz que a barra de consulta não o aceita.

Esta pergunta vai ser respondida mais à frente, no código da tua aplicação. Por agora, responde-lhe à mão, olhando para os oito artigos: devem aparecer a Esferográfica azul (3 de 10), o Bloco de notas A5 (0 de 4), o Marcador fluorescente (8 de 10) e o Compasso escolar (1 de 2).

Compara esta lista com o resultado da consulta 2. A Resma de papel A4 tem pouco stock (4), mas está acima do mínimo (3), por isso ainda não é preciso encomendar. O Marcador fluorescente tem 8 unidades, o que não parece pouco, mas o mínimo é 10. É esta diferença que justifica ter guardado o stock mínimo em cada artigo.

## Laboratório, parte 4: guardar uma referência

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

## Erros frequentes

### Uma consulta que não devolve nada, sem erro

É o erro mais comum, e tem quase sempre uma de três causas. A primeira é o nome do campo mal escrito, como `categria`: o MongoDB procura um campo que nenhum documento tem. A segunda é uma diferença de maiúsculas e minúsculas no valor, como `"papel"` em vez de `"Papel"`. A terceira é o tipo do valor: se um documento tiver `stock: "12"`, com aspas, o valor é texto e não número, e `{ stock: { $lt: 20 } }` não o encontra, porque o MongoDB não compara números com texto. Quando uma consulta não devolve o que esperavas, abre um documento que devia aparecer e compara, campo a campo, o nome, a escrita e o tipo.

### O operador sem o `$`

`{ stock: { lt: 5 } }`, sem o `$`, procura documentos em que `stock` seja exatamente o documento `{ lt: 5 }`. Não há nenhum, e a consulta volta vazia sem erro.

### Um nome de campo com ponto, sem aspas

`{ localizacao.corredor: "C" }` não é aceite. O nome com ponto tem de ir entre aspas: `{ "localizacao.corredor": "C" }`.

### Uma projeção que mistura 1 e 0

`{ nome: 1, stock: 0 }` dá erro. Ou escolhes os campos que queres ver, ou os que queres esconder. A única exceção é `_id: 0`.

### Documentos inseridos duas vezes

Carregar duas vezes em "Insert" duplica os documentos, cada cópia com um `_id` diferente. Para o MongoDB não são repetidos: são documentos diferentes que por acaso têm os mesmos campos. Confirma sempre o número de documentos depois de inserir.

### A palavra-passe da base de dados no sítio errado

Quem tiver essa palavra-passe e um endereço autorizado entra na tua base de dados. Nunca a escrevas no código, num ficheiro do projeto ou numa mensagem.

## Verificar o que aprendeste

Consegues fazer cada uma destas coisas sem olhar para o guia? Se não, volta à secção indicada.

- Explicar a diferença entre documento, coleção e base de dados, com um exemplo diferente da papelaria (secção "O modelo documental").
- Explicar o que é o `_id` e quem o cria (secção "O campo _id e o ObjectId").
- Num problema novo, dizer se uma informação se embute ou se referencia, e justificar com as duas regras (secção "Embutir ou referenciar").
- Explicar porque é que as linhas de uma venda guardam uma cópia do preço (secção "Copiar de propósito").
- Prever o resultado de um filtro com um operador de comparação antes de o executar, e explicar porque é que cada documento aparece ou não (laboratório, parte 3).
- Explicar porque é que "abaixo do mínimo" não se pergunta na barra de consulta, e porque é que o resultado difere de "pouco stock" (laboratório, parte 3).


## O que vem a seguir

No próximo tema vais preparar o Node.js e perceber o papel de um servidor: é o programa que recebe os pedidos da aplicação e fala com a base de dados. Depois vais escrever uma API com Express. Só então ligas o servidor à base de dados que criaste hoje, com o utilizador e a palavra-passe que guardaste.

Quando lá chegares, as consultas vão ser quase iguais às da barra de consulta. O filtro `{ stock: { $lt: 5 } }` escreve-se no código da mesma forma. A diferença é que o código espera pela resposta com `await`, como no `fetch` do 11.º ano.

No projeto final do ano vais modelar a tua própria aplicação. O método é o deste guia: começar pelas perguntas que a aplicação tem de responder. Vale a pena ires pensando no problema que queres resolver.

## Para saber mais

Documentação oficial da MongoDB, em inglês:

- [Documentos](https://www.mongodb.com/docs/manual/core/document/)
- [Tipos BSON, incluindo o ObjectId](https://www.mongodb.com/docs/manual/reference/bson-types/)
- [Consultar dados no Data Explorer do Atlas](https://www.mongodb.com/docs/atlas/atlas-ui/query/filter/)
- [Limites do cluster gratuito](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)

![Rodapé](../imagens/rodape.png)
