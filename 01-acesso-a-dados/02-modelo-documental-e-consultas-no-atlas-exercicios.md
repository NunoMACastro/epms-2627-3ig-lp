![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: modelo documental e consultas

## Objetivo e contexto

Esta ficha é do tema [Modelo documental e primeiras consultas no Atlas](02-modelo-documental-e-consultas-no-atlas.md). É para praticares sozinho, em casa ou quando acabares o [laboratório](02-modelo-documental-e-consultas-no-atlas-laboratorio.md). A parte obrigatória conta com cerca de hora e meia.

No guia e no laboratório trabalhaste com uma papelaria. Esta ficha usa outro domínio, de propósito: o torneio de futsal entre turmas da escola. As decisões que tomaste para a papelaria não servem todas aqui, e vais ter de voltar a pensar nelas com as mesmas regras. É assim que se percebe se uma regra foi compreendida ou só decorada.

Vais praticar três coisas: ler um documento e reconhecer o que está embutido e o que é referência; decidir e justificar o modelo de um problema novo; e escrever consultas no Atlas, prevendo o resultado antes de as executar.

## Como está organizada a ficha

A parte obrigatória tem oito exercícios, e faz-se por esta ordem: o exercício 1, acompanhado, em que lês um documento com a ajuda de pistas; os exercícios 2, 3 e 5, em que modelas o torneio; e os exercícios 8, 9, 10 e 13, em que fazes consultas no Atlas. Cada um traz uma só coisa nova em relação aos anteriores. É esta parte que conta com cerca de hora e meia.

Os outros seis exercícios, o 4, o 6, o 7, o 11, o 12 e o 14, estão no fim, na secção "Para ires mais longe", e são opcionais. Não contam para a hora e meia. Servem para treinar mais, se tiveres tempo ou se sentires que alguma coisa ainda não assentou.

Por isso, na parte obrigatória os números saltam: do 3 para o 5, do 5 para o 8 e do 10 para o 13. Não falta nada. Cada exercício ficou com o número que já tinha quando a ficha foi publicada, para que o exercício 9 seja o mesmo exercício no teu caderno, no de um colega e na aula.

## Pré-requisitos e preparação

Antes de começares, deves ter lido o guia, sobretudo as secções "O modelo documental", "Embutir ou referenciar", "Modelar a partir das perguntas" e "Como se pergunta ao MongoDB". Para os exercícios de consultas (o 8, o 9, o 10 e o 13, e os opcionais 6, 7, 11 e 12) precisas do teu cluster no Atlas, criado no laboratório.

Responde no caderno ou num ficheiro de texto teu, com o número de cada exercício. Nas perguntas que pedem uma justificação, a justificação é a parte mais importante da resposta: uma decisão certa sem razão escrita vale pouco, e uma decisão discutível bem justificada mostra que percebeste as regras.

## O cenário: o torneio de futsal da escola

Todos os anos a escola organiza um torneio de futsal entre turmas. Cada turma inscreve uma equipa, com o nome da turma, a cor da camisola e entre 5 e 10 jogadores. Cada jogador tem nome, número da camisola e posição. Os jogos disputam-se por jornadas, e em cada jornada todas as equipas jogam uma vez. Cada jogo tem uma data, uma equipa da casa, uma equipa de fora, o resultado e a lista dos golos, com quem marcou e em que minuto. A escola tem dois recintos, o pavilhão, que é coberto, e o campo exterior, que não é.

A comissão do torneio quer uma aplicação que responda a estas perguntas:

1. Que jogadores tem uma equipa, e com que números de camisola?
2. Que jogos houve numa jornada, e com que resultados?
3. Que jogos teve uma dada equipa?
4. Quem são os melhores marcadores do torneio?
5. Em que recinto se joga cada jogo, e esse recinto é coberto?

## Exercício acompanhado: ler um documento

### Exercício 1

Este é um documento da coleção `jogos`, tal como a aplicação o guardaria:

```js
{
  _id: ObjectId('66fc1a2b3c4d5e6f70810101'),
  jornada: 1,
  data: ISODate('2026-11-05T13:30:00Z'),
  casaId: ObjectId('66fc1a2b3c4d5e6f70810001'),
  foraId: ObjectId('66fc1a2b3c4d5e6f70810006'),
  golosCasa: 3,
  golosFora: 1,
  golos: [
    { jogadorId: ObjectId('66fc1a2b3c4d5e6f70810011'), minuto: 4 },
    { jogadorId: ObjectId('66fc1a2b3c4d5e6f70810012'), minuto: 11 },
    { jogadorId: ObjectId('66fc1a2b3c4d5e6f70810061'), minuto: 17 },
    { jogadorId: ObjectId('66fc1a2b3c4d5e6f70810011'), minuto: 25 }
  ]
}
```

Responde às cinco alíneas. Cada uma tem uma pista, que diz onde procurar a ideia no guia, e não a resposta.

a) Que valor identifica este jogo? Quem terá criado esse valor, e em que momento?

Pista: secção "O campo _id e o ObjectId".

b) Que campos são referências a outros documentos? Para que coleção aponta cada um?

Pista: uma referência guarda o `_id` de outro documento. Procura os campos cujo valor é um `ObjectId` e que não são o `_id` deste documento.

c) O que está embutido neste documento? Usa as duas regras do guia para explicar porque faz sentido estar embutido e não noutra coleção.

Pista: secção "Como decidir". Pergunta-te que ecrã da aplicação vai mostrar estes dados, e se a lista pode crescer sem limite.

d) O documento não diz de que equipa é o jogador que marcou ao minuto 17. Como é que a aplicação o descobre?

Pista: segue a referência `jogadorId`. O guia explica o que é seguir uma referência na secção "Embutir ou referenciar".

e) O resultado do jogo está guardado duas vezes: nos campos `golosCasa` e `golosFora`, e na lista `golos`. O que pode correr mal por estar guardado duas vezes?

Pista: imagina que um golo foi mal registado e alguém o corrige no dia seguinte. No guia, o passo 5 do exemplo guiado fala de um caso parecido: o total de uma venda.

## Exercícios de consolidação: modelar o torneio

### Exercício 2

Para cada uma destas informações, decide se fica embutida ou numa coleção à parte, ligada por referência. Justifica cada decisão com as duas regras do guia e diz que ecrã da aplicação vai ler esses dados.

a) Os jogadores de uma equipa.

b) As duas equipas de um jogo.

c) Os golos de um jogo.

d) O recinto onde se joga cada jogo, com o nome e se é coberto. Lembra-te de que a escola tem só dois recintos, e que eles não mudam.

Em algumas alíneas há mais do que uma resposta defensável. Nesses casos, o que conta é a justificação, e é bom que digas qual seria a alternativa e porque a puseste de lado.

### Exercício 3

A pergunta 4, "quem são os melhores marcadores", pode ser respondida de duas maneiras:

- Opção A: não se guarda nenhum total. Sempre que for preciso, contam-se os golos de cada jogador em todos os documentos da coleção `jogos`.
- Opção B: cada jogador tem um campo `golosMarcados`, que se atualiza de cada vez que um jogo é registado.

Responde:

a) Na opção B, o que tem a aplicação de fazer sempre que regista um jogo?

b) Na opção B, o que acontece se, dias depois, se descobrir que um golo foi atribuído ao jogador errado e alguém o corrigir no jogo?

c) No guia, as linhas de uma venda guardavam uma cópia do preço, e isso estava certo. O campo `golosMarcados` também é uma cópia de informação que já existe noutro sítio. Explica porque é que os dois casos não são iguais.

d) Qual das duas opções escolhias para este torneio, e porquê?

### Exercício 5

Faz uma tabela com duas colunas, como a do passo 5 do exemplo guiado do guia. Na primeira coluna estão as cinco perguntas da comissão. Na segunda, escreve onde está, no modelo que decidiste no exercício 2, a informação que responde a cada uma: em que coleção, e em que campo ou lista dentro dela. Se uma pergunta não tiver resposta no teu modelo, o modelo está errado: volta ao exercício 2 e corrige-o.

Os nomes que dás aos campos são escolha tua. O que interessa é que se perceba onde está cada informação e, quando a resposta precisa de duas coleções, que campo liga uma à outra.

## Exercícios de consolidação: consultas no Atlas

### Os dados para as consultas

No teu cluster, cria uma base de dados `torneio` com uma coleção `jogos`, da mesma forma que criaste a base `papelaria` no laboratório. Insere estes nove documentos:

```js
[
  { jornada: 1, casa: "10.º A", fora: "12.º B", golosCasa: 3, golosFora: 1, recinto: { nome: "Pavilhão", coberto: true } },
  { jornada: 1, casa: "11.º A", fora: "10.º B", golosCasa: 2, golosFora: 2, recinto: { nome: "Campo exterior", coberto: false } },
  { jornada: 1, casa: "12.º A", fora: "11.º B", golosCasa: 0, golosFora: 4, recinto: { nome: "Pavilhão", coberto: true } },
  { jornada: 2, casa: "12.º B", fora: "11.º A", golosCasa: 1, golosFora: 5, recinto: { nome: "Campo exterior", coberto: false } },
  { jornada: 2, casa: "10.º B", fora: "12.º A", golosCasa: 5, golosFora: 2, recinto: { nome: "Pavilhão", coberto: true } },
  { jornada: 2, casa: "11.º B", fora: "10.º A", golosCasa: 1, golosFora: 1, recinto: { nome: "Campo exterior", coberto: false } },
  { jornada: 3, casa: "10.º A", fora: "11.º A", golosCasa: 2, golosFora: 0, recinto: { nome: "Pavilhão", coberto: true } },
  { jornada: 3, casa: "12.º A", fora: "12.º B", golosCasa: 3, golosFora: 3, recinto: { nome: "Campo exterior", coberto: false } },
  { jornada: 3, casa: "11.º B", fora: "10.º B", golosCasa: 4, golosFora: 2, recinto: { nome: "Pavilhão", coberto: true } }
]
```

Confirma que a coleção ficou com nove documentos.

Repara numa simplificação: nestes documentos as equipas aparecem pelo nome da turma, como texto, e não por referência, e os golos aparecem só como totais. Fica assim para que as consultas sejam fáceis de ler. No exercício 2 decidiste como deviam ficar numa aplicação a sério.

Em cada exercício, escreve primeiro no caderno a consulta e os jogos que esperas que apareçam. Só depois a executas. No fim desta ficha, em "Resultados verificáveis", está quantos documentos cada consulta deve devolver, para confirmares.

### Exercício 8

Os jogos da jornada 1 que se disputaram num recinto coberto.

### Exercício 9

Os jogos que acabaram empatados. Antes de escreveres a consulta, pensa no que esta pergunta compara. Se concluíres que não se consegue escrever na barra de consulta, explica porquê e responde à mão, olhando para os nove documentos.

### Exercício 10

Os jogos em que a equipa da casa foi o 10.º A ou o 11.º B. Escreve-o com um só operador.

### Exercício 13

É o último exercício obrigatório, e o único em que vais aprender sozinho um operador que o guia não ensina.

Todos os jogos do 10.º A, tanto em casa como fora. Com os operadores do guia não consegues. O operador `$in` do exercício 10 também não serve: explica porquê. Depois lê a página do operador `$or` na documentação oficial, indicada nas fontes, e escreve o filtro. Executa-o e confirma o número de documentos.

A página está em inglês. Não precisas de a ler toda: procura nela a forma do filtro e um exemplo, e compara-os com os filtros que já escreveste.

## Para ires mais longe (opcional)

Os exercícios desta secção são opcionais e não contam para a hora e meia da parte obrigatória. Faz-os depois dela, pela ordem que quiseres.

O exercício 4 leva o teu modelo até ao fim: escreves os documentos tal como a aplicação os guardaria. Os exercícios 6, 7, 11 e 12 são consultas do mesmo tipo das do laboratório, agora com os jogos do torneio: o 6 é uma igualdade, como a consulta 1; o 7 obriga a decidir se o valor da fronteira entra ou não no resultado; o 11 escolhe os campos que aparecem, como a consulta 6; e o 12 ordena e limita, como a consulta 7. São bons para treinar se alguma dessas consultas te correu mal no laboratório. Usam a mesma coleção `jogos` da base `torneio`, e a regra é a mesma: escreve primeiro a consulta e os jogos que esperas, e só depois executa. O exercício 14 é uma extensão mais longa, sobre uma pergunta que nenhuma consulta da barra responde.

### Exercício 4 (opcional)

Escreve um documento de exemplo de cada coleção do teu modelo, com base nas decisões do exercício 2 e com os nomes de campos que usaste na tabela do exercício 5. Nos valores de `_id` e das referências podes escrever `ObjectId('...')`, com reticências. O que interessa é que se perceba que campo aponta para que documento.

### Exercício 6 (opcional)

Os jogos da jornada 2.

### Exercício 7 (opcional)

Os jogos em que a equipa da casa marcou 3 golos ou mais.

### Exercício 11 (opcional)

Os jogos da jornada 3, mostrando só as duas equipas e os golos de cada uma, sem o `_id`.

### Exercício 12 (opcional)

Os três jogos em que a equipa de fora marcou mais golos, do que marcou mais para o que marcou menos.

### Exercício 14 (opcional, extensão)

A comissão quer a classificação do torneio: cada vitória vale 3 pontos, cada empate vale 1 ponto e cada derrota vale 0. Com os nove jogos da coleção, calcula à mão os pontos de cada uma das seis equipas e faz a tabela da classificação. Depois explica porque é que esta pergunta não se responde com uma consulta na barra do Atlas. Mais à frente no módulo vais aprender a fazer este tipo de cálculo no código.

## Resultados verificáveis

Para as consultas, este é o número de documentos que cada uma deve devolver. Se o teu número for diferente, procura a causa antes de passares à frente. Os erros mais comuns estão no guia, na secção "Erros frequentes nas consultas".

| Exercício | Documentos |
| --- | ---: |
| 6 (opcional) | 3 |
| 7 (opcional) | 4 |
| 8 | 2 |
| 9 | 3 jogos, contados à mão |
| 10 | 4 |
| 11 (opcional) | 3, cada um só com quatro campos |
| 12 (opcional) | 3, e o primeiro tem 5 golos da equipa de fora |
| 13 | 3 |
| 14 (opcional) | A soma dos pontos das seis equipas dá 24 |

Para os exercícios de modelação não há um número a confirmar. Confirma antes que o teu modelo responde às cinco perguntas da comissão (exercício 5), e que cada decisão do exercício 2 tem uma justificação escrita com as regras do guia.

## Entrega e evidência

Guarda as respostas no caderno ou num ficheiro teu, incluindo as dos exercícios opcionais que fizeres. O professor pode pedir-te para explicares em voz alta uma das decisões do exercício 2, ou para preveres o resultado de uma consulta parecida com as desta ficha, com outros valores. É assim que se confirma que o trabalho é teu e que o percebeste.

## Ligação ao teu projeto

No projeto final vais modelar a tua própria aplicação, sobre um tema que escolhes. O primeiro passo é o desta ficha: escrever as perguntas que a aplicação tem de responder. Se já tens uma ideia para o projeto, escreve cinco perguntas que a tua aplicação teria de responder e guarda-as. Vais precisar delas.

## Fontes

Documentação oficial da MongoDB, em inglês:

- [Operador $or](https://www.mongodb.com/docs/manual/reference/operator/query/or/)
- [Operadores de comparação](https://www.mongodb.com/docs/manual/reference/operator/query-comparison/)
- [Modelação de dados](https://www.mongodb.com/docs/manual/data-modeling/)

![Rodapé](../imagens/rodape.png)
