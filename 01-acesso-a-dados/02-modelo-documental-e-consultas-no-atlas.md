![Cabeçalho](../imagens/cabecalho.png)

# Modelo documental e primeiras consultas no Atlas

Módulo M14, Acesso a Bases de Dados. Este guia explica como o MongoDB organiza a informação em documentos e como se decide o que fica dentro de cada documento. Explica também como se fazem as primeiras perguntas a uma base de dados. Lê-se em cerca de 75 minutos. Para praticar, há o [laboratório](02-modelo-documental-e-consultas-no-atlas-laboratorio.md) e a [ficha de exercícios](02-modelo-documental-e-consultas-no-atlas-exercicios.md) deste tema.

Este ano vais construir uma aplicação que guarda os dados numa base de dados MongoDB. Antes de escreveres uma linha de código para falar com a base de dados, precisas de perceber como é que ela organiza a informação e como se lhe fazem perguntas. É isso que este guia trata, ainda sem código: só com a base de dados e o browser.

## Neste guia

1. O que vais aprender
2. O que já sabes e vais usar
3. Uma aplicação guarda os dados numa base de dados
4. O MongoDB guarda a informação em documentos
5. A informação relacionada embute-se ou referencia-se
6. No Atlas, cada aluno tem o seu cluster
7. Uma consulta descreve os documentos que queres
8. Um modelo desenha-se a partir das perguntas
9. Exemplo guiado: modelar o inventário da papelaria
10. Erros frequentes
11. Palavras novas deste guia
12. Verificar o que aprendeste
13. O que vem a seguir
14. Para saber mais

## O que vais aprender

No fim deste guia, consegues:

- explicar o que são um documento, uma coleção e uma base de dados, e para que serve o campo `_id`;
- decidir, num problema concreto, se uma informação fica dentro de um documento ou noutro documento, ligada por uma referência, e justificar a decisão;
- criar uma base de dados no MongoDB Atlas e inserir documentos;
- escrever consultas com filtros, escolha de campos e ordenação, e prever o resultado antes de as executares;
- desenhar os documentos de uma aplicação a partir das perguntas a que ela tem de responder.

## O que já sabes e vais usar

- Os objetos de JavaScript, com propriedades a que se chega com o ponto, como `artigo.stock`, do 11.º ano.
- Os arrays de objetos e os métodos `filter`, `map` e `sort`, do 11.º ano.
- O JSON, a forma de escrever objetos como texto, do 11.º ano.
- O `fetch`, que pede dados a um servidor, e o `await`, que espera pela resposta, do 11.º ano.

Se alguma destas ideias estiver pouco firme, é normal. Vais usá-las muitas vezes neste guia, e o professor retoma-as sempre que for preciso.

## Uma aplicação guarda os dados numa base de dados

Um array de objetos vive na memória do computador enquanto o programa está a correr. Quando o programa termina, ou o computador se desliga, os dados desaparecem. Para a maior parte das aplicações isso não serve. Numa papelaria, o stock de ontem tem de estar lá amanhã.

Podias guardar os dados num ficheiro JSON, e para um programa pequeno usado por uma só pessoa isso funciona. Mas imagina a papelaria da escola com três funcionários a vender ao mesmo tempo, em três computadores. Se dois programas escreverem no mesmo ficheiro ao mesmo tempo, um apaga o trabalho do outro. Se o ficheiro tiver dez mil artigos, encontrar os que têm pouco stock obriga a ler o ficheiro inteiro de cada vez. E se o computador se desligar a meio de uma escrita, o ficheiro pode ficar estragado.

Para isso há programas especializados em guardar dados de forma segura e em encontrá-los depressa, mesmo com muitos utilizadores ao mesmo tempo. A tua aplicação não guarda os dados ela própria. Pede a um desses programas que os guarde, e pergunta-lhe o que precisa de saber. Os dados que o programa guarda para uma aplicação formam uma **base de dados**.

Esse programa corre num **servidor**: um computador que está sempre ligado e que presta um serviço a outros computadores através da rede. Neste caso, o serviço é guardar dados e responder a perguntas sobre eles. A mesma palavra, servidor, serve também para o programa que, nesse computador, presta o serviço.

O MongoDB é um desses programas. O **MongoDB Atlas** é o MongoDB a funcionar na **nuvem** (em inglês, *cloud*), em servidores geridos pela empresa que o faz. Estar na nuvem quer dizer que esses servidores não estão na escola nem em tua casa. Estão num centro de dados da empresa, e chegas-lhes pela internet, a partir de qualquer computador com um browser. Tu crias a tua base de dados numa página web, e a empresa trata de a manter ligada, protegida e com cópias de segurança. É o que vais usar este ano.

## O MongoDB guarda a informação em documentos

Cada um destes programas tem uma forma de organizar a informação, a que se chama o seu modelo. O MongoDB usa o **modelo documental**: a informação guarda-se em documentos.

### Documento, coleção e base de dados

No 11.º ano trabalhaste com objetos de JavaScript. Um objeto junta várias informações sobre a mesma coisa, cada uma com um nome. Este objeto descreve um artigo de uma papelaria:

```js
const artigo = {
  nome: 'Caderno A4 quadriculado',
  categoria: 'Papel',
  stock: 12,
  precoCentimos: 250,
};
```

Cada par nome e valor chama-se uma propriedade, e chega-se a cada valor com o ponto: `artigo.stock` dá `12`.

O preço está em cêntimos, como número inteiro: `250` quer dizer 2,50 €. Guarda-se assim porque os números com casas decimais nem sempre dão contas exatas no computador. Com dinheiro, uma conta errada por um cêntimo é um erro a sério.

Um **documento** é um conjunto de campos, cada um com um nome e um valor, que descreve uma coisa: um artigo, um fornecedor, uma venda. Tem a mesma forma de um objeto de JavaScript. Os **campos** de um documento são o equivalente às propriedades de um objeto. O artigo acima, guardado no MongoDB, é um documento com quatro campos.

Também viste o JSON, que é a forma de escrever objetos como texto, para os guardar num ficheiro ou os enviar pela rede. O artigo acima, em JSON, fica quase igual: `{ "nome": "Caderno A4 quadriculado", "categoria": "Papel", "stock": 12, "precoCentimos": 250 }`. Os nomes dos campos e os textos ficam entre aspas duplas, porque o JSON não aceita aspas simples. E desaparece a vírgula depois do último campo, que o JSON também não aceita.

Uma **coleção** é um conjunto de documentos do mesmo tipo. Todos os artigos da papelaria ficam na coleção `artigos`, todos os fornecedores na coleção `fornecedores`, todas as vendas na coleção `vendas`.

Uma **base de dados** é um conjunto de coleções que pertencem à mesma aplicação. A base de dados `papelaria` tem as três coleções anteriores.

Uma forma de fixar as três ideias é pensar num arquivo em papel. Cada documento é uma ficha preenchida. Cada coleção é uma gaveta onde se guardam as fichas do mesmo tipo: a gaveta dos artigos e a gaveta dos fornecedores. A base de dados é o armário com as gavetas todas da papelaria.

No Atlas há ainda três níveis por cima destes, que vais encontrar ao criar a conta. Um **cluster** é o conjunto de servidores onde o MongoDB está a correr e onde vivem as tuas bases de dados. Um **projeto** agrupa clusters, e uma **organização** agrupa projetos. Do maior para o mais pequeno:

```text
organização → projeto → cluster → base de dados → coleção → documento
```

A palavra cluster quer dizer agrupamento, e o nome explica-se porque um cluster não é um servidor só. No plano gratuito que vais usar, o Atlas guarda os mesmos dados em três servidores ao mesmo tempo, com cópias iguais. Se um deles avariar, os outros continuam a responder e não se perde nada. Para ti, que vais usar o cluster pela página do Atlas, isto não se vê. O cluster funciona como se fosse um único servidor.

### Um documento parece um objeto JavaScript, mas não é bem igual

Quando escreves um documento no Atlas, escreves-o com a mesma forma de um objeto de JavaScript ou de um JSON. Como em JavaScript, os textos podem ir entre aspas duplas ou simples. Mas o MongoDB não o guarda como texto. Guarda-o num formato binário chamado **BSON**, que tem mais tipos de valores do que o JSON. Binário quer dizer que o documento fica guardado numa forma pensada para o computador ler e escrever depressa, e não para uma pessoa ler. Se abrisses o ficheiro onde ele está guardado, não reconhecerias o texto que escreveste. É o Atlas que o volta a mostrar com a forma de um objeto, para tu o leres.

A diferença que mais interessa agora é esta. Em JSON, uma data é apenas texto, como `"2026-10-01"`. Para o computador, isso é uma sequência de carateres, e não uma data. Não sabe fazer contas com ela, como saber quantos dias passaram entre duas vendas, nem sabe que "1/10/2026" e "2026-10-01" são o mesmo dia. No BSON existe um tipo de data a sério, que se pode comparar e ordenar corretamente. No Atlas escreve-se assim: `ISODate('2026-10-01T10:15:00Z')`. O mesmo acontece com o identificador de cada documento, que tem um tipo próprio, o ObjectId, explicado já a seguir.

O texto dentro de `ISODate(...)` segue uma norma internacional para escrever datas e horas, a **ISO 8601**, que dá nome ao `ISODate`. Lê-se da esquerda para a direita, do maior para o mais pequeno:

- primeiro vêm o ano, o mês e o dia, separados por hífenes: `2026-10-01` é 1 de outubro de 2026;
- depois vem a letra `T`, que só serve para separar a data da hora;
- depois vêm as horas, os minutos e os segundos: `10:15:00`;
- no fim, a letra `Z` diz que a hora está em tempo universal coordenado, conhecido pela sigla **UTC**.

O UTC é a hora de referência usada no mundo inteiro, e não a hora de Portugal. A 1 de outubro, Portugal continental está na hora de verão, uma hora à frente do UTC, por isso `10:15` em UTC são 11:15 em Lisboa. No inverno, a hora de Portugal continental coincide com o UTC. Guardam-se as horas em UTC para que não haja confusões quando a hora muda entre o verão e o inverno, ou quando a aplicação é usada noutro país. É a aplicação que converte para a hora local quando a mostra.

Quando vires um documento escrito com `ISODate(...)` ou `ObjectId(...)`, é a forma de dizer ao MongoDB que aquele valor tem um tipo especial. Não é um simples texto.

### O campo _id e o ObjectId

Cada documento de uma coleção tem obrigatoriamente um campo chamado `_id`, com um valor diferente do de todos os outros documentos da mesma coleção. É o que permite dizer "este documento e não outro", mesmo que haja dois artigos com o mesmo nome.

Se inserires um documento sem `_id`, o MongoDB cria um automaticamente, do tipo **ObjectId**. Um ObjectId aparece escrito como 24 carateres, com algarismos e letras de `a` a `f`, por exemplo `ObjectId('66fb1c2a9d3e4f5a6b7c8d01')`. Por dentro são 12 bytes; um **byte** é a unidade de memória que guarda um número de 0 a 255. Os 12 bytes têm três partes:

- os primeiros 4 guardam o momento em que foi criado, em segundos contados desde 1 de janeiro de 1970;
- os 5 seguintes são um valor aleatório, gerado pelo programa que o criou;
- os últimos 3 são um contador, que sobe de cada vez.

Esta combinação torna praticamente impossível que dois ObjectId saiam iguais, mesmo criados ao mesmo tempo em computadores diferentes.

Os 12 bytes aparecem escritos como 24 carateres porque cada byte se escreve com dois carateres no sistema **hexadecimal**, também chamado base 16. Na base 10, que usas no dia a dia, há dez algarismos, de 0 a 9. Na base 16 são precisos dezasseis símbolos, por isso aos algarismos de 0 a 9 juntam-se as letras de `a` a `f`, que valem de 10 a 15. Com dois símbolos hexadecimais escrevem-se 16 vezes 16 valores, ou seja 256: exatamente os de um byte. É por isso que num ObjectId só aparecem algarismos e as letras de `a` a `f`, e nunca um `g` ou um `z`. Doze bytes, a dois carateres cada um, dão os 24 carateres.

Na prática, não inventas valores de `_id` à mão. Deixas o MongoDB criá-los e usas o que ele criou.

### Os documentos de uma coleção não têm de ser iguais

Numa folha de cálculo, todas as linhas têm as mesmas colunas. No MongoDB, dois documentos da mesma coleção podem ter campos diferentes. Um artigo pode ter um campo `cor` e outro não ter. Diz-se que o MongoDB tem um **esquema flexível**.

Isto dá jeito quando os dados variam de verdade, mas também é um perigo. Se escreveres `categria` em vez de `categoria` num documento, o MongoDB aceita sem dizer nada. Para ele, é só um campo com outro nome. Depois, quando procurares os artigos de uma categoria, esse documento não aparece, e não há nenhuma mensagem de erro a avisar. O mesmo acontece se guardares o stock como texto (`"12"`) num documento e como número (`12`) nos outros.

Por isso, a responsabilidade de manter os documentos coerentes é tua e da tua aplicação. Mais à frente no módulo vais escrever o código que verifica os dados antes de os guardar. Por agora, a regra é escrever os documentos de uma coleção sempre com os mesmos nomes de campos e os mesmos tipos.

### Se já trabalhaste com tabelas

Se já trabalhaste com bases de dados de tabelas, em Sistemas de Informação ou noutra disciplina, esta comparação ajuda a situar as ideias. Se ainda não trabalhaste, podes saltá-la.

| Base de dados de tabelas | MongoDB |
| --- | --- |
| Tabela | Coleção |
| Linha | Documento |
| Coluna | Campo |
| Chave primária | Campo `_id` |
| Todas as linhas têm as mesmas colunas | Os documentos podem ter campos diferentes |
| Informação relacionada fica noutra tabela e junta-se com uma consulta | Informação relacionada pode ficar dentro do próprio documento |

A última linha é a grande diferença, e é o assunto da secção seguinte.

## A informação relacionada embute-se ou referencia-se

Quando uma informação está relacionada com outra, o MongoDB deixa-te escolher entre duas formas de a guardar.

**Embutir** é guardar a informação dentro do próprio documento. A localização de um artigo na papelaria (corredor e prateleira) pode ficar dentro do documento do artigo, como um documento dentro de outro:

```js
{
  nome: "Caderno A4 quadriculado",
  categoria: "Papel",
  localizacao: { corredor: "A", prateleira: 1 }
}
```

A um documento guardado dentro de outro chama-se **documento embutido**. Também se pode embutir um array, por exemplo a lista das linhas de uma venda. Uma **linha de uma venda** é o que aparece numa linha do talão de compra: que artigo se vendeu, quantas unidades e a que preço. Uma venda de três artigos diferentes tem três linhas, e cada linha é ela própria um pequeno documento dentro do array.

**Referenciar** é guardar a informação num documento separado, noutra coleção, e guardar no primeiro documento apenas o `_id` do segundo. O fornecedor de um artigo pode ficar na coleção `fornecedores`, e o artigo guarda só o identificador do fornecedor:

```js
{
  nome: "Caderno A4 quadriculado",
  categoria: "Papel",
  fornecedorId: ObjectId('66fb1c2a9d3e4f5a6b7c8d01')
}
```

O campo `fornecedorId` é uma **referência**: guarda o `_id` de outro documento. O nome do campo segue uma convenção que vais ver muitas vezes: o nome da coisa referida, seguido de `Id`. Não é uma regra do MongoDB, que aceitaria qualquer outro nome. É uma ajuda para quem lê o documento: percebe logo que aquele valor é o `_id` de um fornecedor, e que é na coleção `fornecedores` que o deve procurar.

Ler uma referência obriga a um passo a mais. Para mostrar um artigo com o nome e o telefone do fornecedor, a aplicação faz duas perguntas à base de dados. Primeiro lê o artigo, e encontra nele o `fornecedorId`. Depois procura, na coleção `fornecedores`, o documento cujo `_id` é igual a esse valor. A isto chama-se **seguir a referência**.

A pergunta também se pode fazer no sentido contrário. Para saber que artigos tem um fornecedor, procuram-se na coleção `artigos` os documentos cujo `fornecedorId` é igual ao `_id` desse fornecedor. É esta segunda pergunta que vais fazer no laboratório.

### Como decidir

Há duas perguntas que ajudam a decidir: "que ecrã vai ler estes dados?" e "que dados mudam ao mesmo tempo?". A partir delas chega-se a duas regras.

Embute-se quando a informação é sempre lida juntamente com o documento principal e não pode crescer sem limite. A localização de um artigo aparece sempre que se mostra o artigo, e cada artigo tem uma só localização. Embutir é a escolha natural. Com uma só leitura tens tudo o que o ecrã precisa.

Referencia-se quando a informação é reutilizada por muitos documentos ou é alterada de forma independente. O mesmo fornecedor fornece dezenas de artigos. Se o contacto do fornecedor mudar e estiver embutido em cada artigo, tens de o alterar em dezenas de sítios, e basta esquecer um para a informação ficar contraditória. Referenciado, o contacto está num só documento e altera-se uma vez.

A condição de não crescer sem limite, que faz parte da regra de embutir, tem uma razão concreta. Cada documento tem um tamanho máximo de 16 MiB, cerca de 17 milhões de bytes. Nenhum artigo chega perto disso, mas uma lista que cresce sempre, como todas as vendas de um artigo desde que a papelaria abriu, acabaria por chegar. Uma lista assim nunca se embute. Cada venda é um documento da sua coleção.

### Copiar de propósito

Há um caso em que se guarda uma cópia de propósito, e percebê-lo evita um erro frequente. Numa venda, cada linha diz que artigo se vendeu. Podias guardar só a referência ao artigo. Mas imagina que, em janeiro, o preço do caderno sobe de 2,50 € para 2,80 €. As vendas de outubro passariam a mostrar o preço novo, e a faturação de outubro deixaria de bater certo.

Por isso, cada linha da venda guarda a referência ao artigo e também uma cópia do nome e do preço no momento da venda. Esta cópia é o registo do que aconteceu naquele dia, e esse registo não deve mudar quando o artigo mudar.

### O MongoDB não verifica as referências

Quando um artigo guarda `fornecedorId`, o MongoDB não confirma que existe mesmo um fornecedor com esse `_id`. Aceita qualquer ObjectId. E se um fornecedor for apagado, os artigos que o referiam continuam a apontar para um documento que já não existe.

A regra simples é esta. É a tua aplicação que tem de confirmar que o documento referido existe, antes de guardar a referência. E é também a aplicação que decide o que acontece às referências quando um documento é apagado. Vais ver isto na prática no laboratório.

## No Atlas, cada aluno tem o seu cluster

O Atlas tem vários planos. Este ano usas o plano gratuito, que dá a cada projeto um cluster gratuito. Os limites deste cluster chegam folgadamente para o que vais fazer: 0,5 GB de dados, até 500 ligações ao mesmo tempo e até 100 operações por segundo. Uma **ligação** é um programa ligado à base de dados, como a tua aplicação quando estiver a correr. Uma **operação** é cada pedido que esse programa lhe faz, por exemplo inserir um documento ou fazer uma consulta.

Há uma regra a lembrar. Se o cluster passar 30 dias sem nenhuma ligação, o Atlas põe-no em pausa. Isso pode acontecer nas férias.

Na turma, cada um cria a sua conta, o seu projeto e o seu cluster. Assim, os teus dados são só teus, ninguém os estraga por engano, e o mesmo cluster serve para o resto do ano. Para o professor poder ver e acompanhar o teu trabalho, dás-lhe acesso de leitura ao teu projeto. Os passos para criar a conta e o cluster e para dar acesso ao professor estão na fase 1 do [laboratório](02-modelo-documental-e-consultas-no-atlas-laboratorio.md).

## Uma consulta descreve os documentos que queres

Pedir informação a uma base de dados chama-se fazer uma **consulta**. No MongoDB, uma consulta descreve os documentos que queres com um documento chamado **filtro**, escrito com a mesma forma de um objeto de JavaScript. No laboratório vais escrever estas consultas na **barra de consulta** do Atlas, por cima da lista dos documentos. Aqui fica o que cada uma quer dizer e porque se escreve assim.

### Os oito artigos dos exemplos

Os exemplos desta secção usam os oito artigos da papelaria que vais inserir no laboratório. Cada artigo tem o nome, a categoria, o stock, o stock mínimo, o preço em cêntimos e a localização: o corredor e a prateleira onde está arrumado. O stock mínimo é a quantidade abaixo da qual a papelaria tem de encomendar mais.

| Artigo | Categoria | Stock | Stock mínimo | Preço (cêntimos) | Corredor e prateleira |
| --- | --- | ---: | ---: | ---: | --- |
| Caderno A4 quadriculado | Papel | 12 | 5 | 250 | A, 1 |
| Esferográfica azul | Escrita | 3 | 10 | 60 | B, 1 |
| Bloco de notas A5 | Papel | 0 | 4 | 180 | A, 2 |
| Lápis HB | Escrita | 25 | 10 | 35 | B, 1 |
| Resma de papel A4 | Papel | 4 | 3 | 520 | A, 3 |
| Marcador fluorescente | Escrita | 8 | 10 | 95 | B, 2 |
| Régua de 30 cm | Desenho | 6 | 3 | 120 | C, 1 |
| Compasso escolar | Desenho | 1 | 2 | 450 | C, 1 |

Na base de dados, cada linha da tabela é um documento da coleção `artigos`, com a localização guardada dentro dele, como um documento embutido. A primeira linha, por exemplo, é este documento:

```js
{ nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250, localizacao: { corredor: "A", prateleira: 1 } }
```

### As quatro partes de uma consulta

Uma consulta pode ter até quatro partes. O **filtro** diz que documentos queres. A **projeção** diz que campos de cada documento queres ver. A **ordenação** diz por que ordem os queres. O **limite** diz quantos queres no máximo. Só o filtro é sempre usado. As outras três são opcionais.

O filtro mais simples de todos é o filtro vazio, `{}`. Não impõe nenhuma condição, e por isso todos os documentos da coleção o cumprem. Usa-se quando não queres escolher documentos, mas queres fazer alguma coisa a todos eles, por exemplo ordená-los. Na barra de consulta do Atlas, deixar o campo do filtro vazio tem o mesmo efeito que escrever `{}`.

Estas partes fazem na base de dados o que já fazias com arrays em JavaScript:

| Parte da consulta | Em JavaScript, com um array |
| --- | --- |
| Filtro | `filter` |
| Projeção | `map`, a escolher só alguns campos |
| Ordenação | `sort` |
| Limite | `slice(0, n)`, que fica só com os primeiros `n` elementos |

A diferença é quem faz o trabalho. Com um array, é o teu programa que percorre os dados. Com a base de dados, é ela que procura e devolve só o resultado. Com oito artigos não se nota. Com cem mil, é a diferença entre esperar um instante e esperar minutos.

### Igualdade

O filtro mais simples pede documentos em que um campo tem um valor exato. Antes de leres o resultado, prevê, olhando para a tabela dos oito artigos: que artigos devolve este filtro?

```js
{ categoria: "Papel" }
```

Lê-se "documentos cujo campo `categoria` é igual a `Papel`". O resultado são três artigos: o Caderno A4 quadriculado, o Bloco de notas A5 e a Resma de papel A4.

O MongoDB compara o texto exatamente como está escrito. Por isso `{ categoria: "papel" }`, com minúscula, não encontra nenhum dos artigos de papel, e não dá nenhum erro. Para a base de dados, `papel` e `Papel` são textos diferentes.

### Operadores de comparação

Para perguntar "menor do que", "maior do que" e semelhantes, usa-se um **operador**. Os operadores começam sempre por `$` e escrevem-se como um documento dentro do filtro. Antes de leres o resultado, prevê: que artigos devolve este filtro?

```js
{ stock: { $lt: 5 } }
```

Lê-se "documentos cujo campo `stock` é menor do que 5". O `$` é o que diz ao MongoDB que `lt` é um operador e não o nome de um campo. O resultado são quatro artigos: a Esferográfica azul (3), o Bloco de notas A5 (0), a Resma de papel A4 (4) e o Compasso escolar (1).

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

Os nomes dos operadores são abreviaturas de palavras inglesas, e saber de onde vêm ajuda a não os trocar. `eq` vem de *equal*, igual. `ne` vem de *not equal*, diferente. `gt` vem de *greater than*, maior do que. `lt` vem de *less than*, menor do que. O `e` que aparece no fim de `gte` e de `lte` vem de *or equal*, ou igual. Assim, `$gte` lê-se "maior ou igual" e `$lt` lê-se "menor do que", sem o igual.

A diferença entre ter ou não ter o igual só se nota na fronteira, mas é aí que nascem muitos erros. `{ stock: { $lt: 5 } }` deixa de fora um artigo que tenha exatamente 5 unidades, e `{ stock: { $lte: 5 } }` inclui-o. Com os oito artigos da tabela, os dois filtros dão o mesmo resultado, porque nenhum artigo tem exatamente 5 unidades. No dia em que um artigo tiver 5, já não dão. Antes de escolheres o operador, pergunta-te se o valor da fronteira deve aparecer no resultado ou não.

O `$in` é o único operador da tabela que recebe uma lista, escrita entre parênteses retos, como um array de JavaScript. O filtro `{ categoria: { $in: ["Papel", "Desenho"] } }` lê-se "categoria é Papel ou é Desenho". Um documento fica no resultado se o valor desse campo for igual a qualquer um dos valores da lista. Antes de leres o resultado, prevê quantos artigos aparecem. São cinco: os três de papel e os dois de desenho. Ficam de fora os três de escrita.

### Várias condições ao mesmo tempo

Quando o filtro tem vários campos, o documento tem de cumprir todos. Antes de leres o resultado, prevê: que artigos devolve este filtro?

```js
{ categoria: "Escrita", stock: { $lt: 10 } }
```

Lê-se "categoria é Escrita e stock é menor do que 10". O resultado são dois artigos: a Esferográfica azul (3) e o Marcador fluorescente (8). O Lápis HB é da categoria Escrita, mas tem 25 unidades. Cumpre a primeira condição, mas não a segunda, e fica de fora.

Dois operadores no mesmo campo também têm de se cumprir os dois. É assim que se pede um intervalo. Prevê: que artigos devolve este filtro?

```js
{ precoCentimos: { $gte: 100, $lte: 300 } }
```

Lê-se "preço maior ou igual a 100 cêntimos e menor ou igual a 300 cêntimos", ou seja, entre 1,00 € e 3,00 €, com as duas fronteiras incluídas. O resultado são três artigos: o Caderno A4 quadriculado (250), o Bloco de notas A5 (180) e a Régua de 30 cm (120).

### Campos de um documento embutido

Para chegar a um campo que está dentro de um documento embutido, junta-se o nome dos dois campos com um ponto, como em JavaScript. Prevê: que artigos devolve este filtro?

```js
{ "localizacao.corredor": "C" }
```

Lê-se "documentos cujo campo `corredor`, dentro de `localizacao`, é igual a `C`". O resultado são dois artigos: a Régua de 30 cm e o Compasso escolar.

O nome tem de ficar entre aspas, porque tem um ponto no meio. Sem as aspas, o filtro não é aceite.

A razão vem do JavaScript, cuja forma o filtro segue. Num objeto, um nome de propriedade escrito sem aspas só pode ter letras, algarismos e os sinais `_` e `$`, e não pode começar por um algarismo. Um ponto no meio do nome faz com que o filtro deixe de ser um objeto bem escrito, e a barra de consulta não o aceita. Entre aspas, o nome passa a ser um texto como outro qualquer, e um texto pode ter pontos.

Também não chega escrever `{ corredor: "C" }`. Nenhum artigo tem um campo `corredor` no nível de cima, porque o corredor está dentro de `localizacao`. A consulta volta vazia, e sem erro.

### Escolher os campos: a projeção

A projeção é um documento em que cada campo recebe `1`, para aparecer, ou `0`, para ficar escondido. Prevê: com o filtro `{ stock: { $lt: 5 } }` e esta projeção, o que aparece?

```js
{ nome: 1, stock: 1, _id: 0 }
```

Aparecem os mesmos quatro artigos do filtro, cada um só com o nome e o stock, como `{ nome: "Esferográfica azul", stock: 3 }`. O `_id` aparece sempre, a não ser que o escondas com `_id: 0`.

Numa projeção não se podem misturar campos a mostrar e campos a esconder, com uma única exceção, que é precisamente o `_id`. A projeção `{ nome: 1, stock: 0 }` dá erro.

A razão é que os dois modos dizem coisas opostas sobre os campos que não escreveste. Com `1`, a projeção diz "mostra só estes", e todos os outros ficam escondidos. Com `0`, diz "mostra tudo menos estes", e todos os outros aparecem. Se misturasses os dois, o MongoDB não saberia o que fazer a um campo como `categoria`, que não está na projeção. Escondia-o, como manda o `1`, ou mostrava-o, como manda o `0`? Em vez de adivinhar, recusa a projeção. O `_id` é a exceção porque aparece sempre, mesmo quando não o escreves, e escondê-lo numa projeção de campos a mostrar é tão frequente que o MongoDB o permite.

A projeção não muda que documentos aparecem. Isso é trabalho do filtro. Muda só o que se vê de cada um.

### Ordenar e limitar

A ordenação é um documento em que cada campo recebe `1`, para ordem crescente, ou `-1`, para ordem decrescente. Prevê: com o filtro vazio, esta ordenação e um limite de 3, que artigos aparecem, e por que ordem?

```js
{ precoCentimos: -1 }
```

Aparecem os três artigos mais caros, do mais caro para o mais barato: a Resma de papel A4 (520), o Compasso escolar (450) e o Caderno A4 quadriculado (250). A ordenação põe os oito do preço maior para o menor, e o limite deixa ficar só os três primeiros dessa ordem.

A ordem importa. O limite aplica-se depois de ordenar, e é isso que garante que os três que ficam são os mais caros e não três quaisquer.

### O que uma consulta simples não consegue perguntar

"Que artigos estão abaixo do stock mínimo?" parece uma pergunta como as outras, mas os operadores desta secção não chegam para ela. Os operadores comparam um campo com um valor fixo, escrito no filtro. Esta pergunta compara dois campos do mesmo documento: `stock` com `stockMinimo`. No MongoDB isso faz-se com o operador `$expr`, e a barra de consulta do Atlas não o aceita. Esta pergunta vai ser respondida mais à frente, no código da aplicação. No laboratório vais responder-lhe à mão.

## Um modelo desenha-se a partir das perguntas

Um bom modelo não se desenha a pensar nas coisas que existem. Desenha-se a pensar nas perguntas que a aplicação vai ter de responder. O método tem cinco passos:

1. Escrever as perguntas que a aplicação tem de responder, tal como quem a usa as faria.
2. Para cada pergunta, identificar a informação necessária.
3. Agrupar essa informação em coleções, uma por tipo de coisa.
4. Para cada informação relacionada, decidir se se embute ou se se referencia, com as regras de "Como decidir".
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

As perguntas 1 e 2 precisam da categoria e do stock de cada artigo. A pergunta 3 precisa de uma informação que ainda não tínhamos: o stock mínimo de cada artigo, abaixo do qual é preciso encomendar.

Repara que "pouco stock" e "abaixo do mínimo" são perguntas diferentes. Cinco resmas de papel podem ser poucas, e cinco compassos podem ser muitos. O mínimo depende do artigo, por isso tem de ficar guardado em cada artigo. É também por isso que, como viste nas consultas, esta pergunta compara dois campos de cada artigo.

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

Os valores de `_id` são exemplos para leres o modelo. Na base de dados verdadeira é o MongoDB que os cria. O `fornecedorId` do artigo é igual ao `_id` do fornecedor. O `artigoId` da primeira linha da venda é igual ao `_id` do artigo. É assim que se lê uma referência. O telefone e o email do fornecedor são fictícios.

O total da venda confere: duas vezes 250 cêntimos dá 500, três vezes 60 dá 180, e 500 mais 180 dá 680 cêntimos, ou seja, 6,80 €.

Repara que o total podia ser calculado a partir das linhas sempre que fosse preciso, e mesmo assim ficou guardado na venda. Guardar um valor que se pode calcular traz uma vantagem e uma obrigação. A vantagem é que quem lê a venda tem logo o valor que o cliente pagou, sem fazer contas. A obrigação é que o valor guardado tem de bater sempre certo com aquilo de onde se calcula. Se as linhas disserem uma coisa e o total disser outra, o documento contradiz-se, e quem o ler não sabe qual das duas informações está certa. Neste modelo, uma venda registada não volta a ser alterada, por isso a obrigação cumpre-se uma só vez, no momento em que a venda é guardada. É por isso que vale a pena conferir o total, como acabámos de fazer.

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

## Erros frequentes

### Uma consulta que não devolve nada, sem erro

É o erro mais comum, e tem quase sempre uma de três causas:

- o nome do campo mal escrito, como `categria`: o MongoDB procura um campo que nenhum documento tem;
- uma diferença de maiúsculas e minúsculas no valor, como `"papel"` em vez de `"Papel"`;
- o tipo do valor: se um documento tiver `stock: "12"`, com aspas, o valor é texto e não número. O filtro `{ stock: { $lt: 20 } }` não o encontra, porque o MongoDB não compara números com texto.

Quando uma consulta não devolve o que esperavas, abre um documento que devia aparecer e compara, campo a campo, o nome, a escrita e o tipo.

### O operador sem o `$`

`{ stock: { lt: 5 } }`, sem o `$`, procura documentos em que `stock` seja exatamente o documento `{ lt: 5 }`. Não há nenhum, e a consulta volta vazia sem erro. Sem o `$`, o MongoDB lê `lt` como o nome de um campo, e não como um operador.

## Palavras novas deste guia

- Base de dados: os dados de uma aplicação, guardados por um programa especializado, como o MongoDB; no MongoDB, é um conjunto de coleções, como a `papelaria`.
- MongoDB: um programa especializado em guardar dados de forma segura e em encontrá-los depressa, que organiza a informação em documentos.
- Servidor: um computador sempre ligado, que presta um serviço a outros computadores através da rede, ou o programa que, nesse computador, presta o serviço.
- Nuvem (*cloud*): servidores num centro de dados de uma empresa, a que chegas pela internet.
- MongoDB Atlas: o MongoDB a funcionar na nuvem, em servidores geridos pela empresa que o faz.
- Modelo documental: a forma de organizar a informação do MongoDB, em documentos.
- Documento: um conjunto de campos, cada um com um nome e um valor, que descreve uma coisa; tem a forma de um objeto de JavaScript.
- Campo: cada par nome e valor de um documento, como uma propriedade de um objeto.
- Coleção: um conjunto de documentos do mesmo tipo, como a coleção `artigos`.
- Cluster: o conjunto de servidores onde o MongoDB está a correr e onde vivem as tuas bases de dados.
- Projeto: no Atlas, o que agrupa clusters.
- Organização: no Atlas, o que agrupa projetos.
- BSON: o formato binário em que o MongoDB guarda os documentos, com mais tipos de valores do que o JSON, como as datas.
- ISO 8601: a norma internacional para escrever datas e horas, como `2026-10-01T10:15:00Z`.
- UTC: o tempo universal coordenado, a hora de referência usada no mundo inteiro; a letra `Z` no fim de uma data diz que a hora está em UTC.
- `_id`: o campo que todos os documentos têm, com um valor diferente em cada documento da coleção.
- ObjectId: o tipo do `_id` que o MongoDB cria, escrito com 24 carateres hexadecimais.
- Byte: a unidade de memória que guarda um número de 0 a 255.
- Hexadecimal: o sistema de base 16, com os algarismos de 0 a 9 e as letras de `a` a `f`.
- Esquema flexível: os documentos da mesma coleção podem ter campos diferentes.
- Embutir: guardar uma informação dentro do próprio documento.
- Documento embutido: um documento guardado dentro de outro, como a `localizacao` de um artigo.
- Linha de uma venda: o que aparece numa linha do talão: que artigo se vendeu, quantas unidades e a que preço.
- Referenciar: guardar uma informação num documento à parte, noutra coleção, e guardar no primeiro documento só o `_id` do segundo.
- Referência: o campo que guarda o `_id` de outro documento, como o `fornecedorId`.
- Seguir uma referência: procurar o documento cujo `_id` é igual ao valor guardado na referência.
- Ligação: um programa ligado à base de dados.
- Operação: cada pedido que um programa faz à base de dados, como inserir um documento ou fazer uma consulta.
- Consulta: um pedido de informação a uma base de dados.
- Filtro: o documento que diz que documentos queres; o filtro vazio, `{}`, aceita todos.
- Operador: uma palavra começada por `$` que, dentro de um filtro, faz uma comparação, como `$lt`, menor do que.
- Projeção: o documento que diz que campos de cada documento queres ver, com `1` para mostrar e `0` para esconder.
- Ordenação: o documento que diz por que ordem queres os documentos, com `1` para crescente e `-1` para decrescente.
- Limite: o número máximo de documentos que queres no resultado.
- Barra de consulta: a barra do Atlas, por cima da lista dos documentos, onde se escrevem o filtro, a projeção, a ordenação e o limite.

## Verificar o que aprendeste

1. Qual é a diferença entre um documento, uma coleção e uma base de dados? Dá um exemplo que não seja da papelaria.
2. O que é o `_id`, e quem o cria quando inseres um documento sem ele?
3. Num problema novo, que duas perguntas fazes para decidir se uma informação se embute ou se referencia?
4. Porque é que as linhas de uma venda guardam uma cópia do preço?
5. Porque é que `{ categoria: "papel" }` não encontra os artigos de papel, e não dá erro?
6. Porque é que `{ stock: { $lt: 5 } }` e `{ stock: { $lte: 5 } }` podem dar resultados diferentes?
7. Uma projeção pode mudar quantos documentos aparecem no resultado? Porquê?
8. Porque é que "que artigos estão abaixo do stock mínimo?" não se pergunta na barra de consulta do Atlas?

## O que vem a seguir

Para praticar este tema, faz o [laboratório](02-modelo-documental-e-consultas-no-atlas-laboratorio.md) e depois a [ficha de exercícios](02-modelo-documental-e-consultas-no-atlas-exercicios.md). O tema seguinte é Arquitetura e setup Node.

No próximo tema vais preparar o Node.js, que corre JavaScript fora do browser, e perceber o papel de um servidor. O servidor é o programa que recebe os pedidos da aplicação e fala com a base de dados. Depois vais escrever uma API, o servidor a que a aplicação faz os pedidos, com o Express, uma biblioteca do Node.js para escrever servidores. Só então ligas o servidor à base de dados que criaste no laboratório, com o utilizador e a palavra-passe que guardaste.

Quando lá chegares, as consultas vão ser quase iguais às da barra de consulta. O filtro `{ stock: { $lt: 5 } }` escreve-se no código da mesma forma. A diferença é que o código espera pela resposta com `await`, como no `fetch` do 11.º ano.

O método deste guia serve para qualquer aplicação que venhas a desenhar. Começa sempre pelas perguntas a que ela tem de responder. Se a aplicação da tua PAP vai guardar dados, vale a pena ires pensando nessas perguntas.

## Para saber mais

Documentação oficial da MongoDB, em inglês:

- [Documentos](https://www.mongodb.com/docs/manual/core/document/): o que é um documento, as regras dos nomes dos campos e o tamanho máximo de um documento.
- [Tipos BSON, incluindo o ObjectId](https://www.mongodb.com/docs/manual/reference/bson-types/): todos os tipos de valores que um documento pode guardar, com as partes de um ObjectId e o tipo das datas.
- [Consultar dados no Data Explorer do Atlas](https://www.mongodb.com/docs/atlas/atlas-ui/query/filter/): como se escrevem as consultas na barra de consulta do Atlas.
- [Limites do cluster gratuito](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/): os limites do plano gratuito, como o espaço e as operações por segundo.

![Rodapé](../imagens/rodape.png)
