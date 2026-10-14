![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: modelo documental e consultas

Ficha do tema Modelo documental e primeiras consultas no Atlas, do módulo M14, Acesso a Bases de Dados. Praticas a ler um documento, a decidir e justificar o modelo de um problema novo e a escrever consultas no Atlas, prevendo o resultado. Cerca de 90 minutos, para fazeres sozinho, em casa ou quando acabares o laboratório.

## O que precisas de saber

O [guia do tema](02-modelo-documental-e-consultas-no-atlas.md) e o [laboratório](02-modelo-documental-e-consultas-no-atlas-laboratorio.md).

## Como trabalhar

A parte obrigatória são os exercícios 1 a 8, por esta ordem, e leva cerca de hora e meia. Nos exercícios 1 a 4 modelas o torneio; nos exercícios 5 a 8 fazes consultas no Atlas. Cada exercício traz uma só coisa nova em relação aos anteriores.

O desafio opcional e os exercícios de "Para ires mais longe" são para depois, se tiveres tempo ou se alguma coisa ainda não assentou. Não contam para a hora e meia.

Responde no caderno ou num ficheiro de texto teu, com o número de cada exercício. Nas perguntas que pedem uma justificação, a justificação é a parte mais importante da resposta. Uma decisão certa sem razão escrita vale pouco. Uma decisão discutível, bem justificada, mostra que percebeste as regras.

Nas consultas, escreve primeiro no caderno a consulta e os jogos que esperas que apareçam, e só depois a executas. Para as consultas, precisas do teu cluster no Atlas, criado no laboratório.

O professor pode pedir-te para explicares em voz alta uma das decisões do exercício 2. Também pode pedir-te para preveres o resultado de uma consulta parecida com as desta ficha, com outros valores. É assim que se confirma que o trabalho é teu e que o percebeste.

## O cenário: o torneio de futsal da escola

No guia e no laboratório trabalhaste com uma papelaria. Esta ficha usa outro domínio, de propósito: o torneio de futsal entre turmas da escola. As decisões que tomaste para a papelaria não servem todas aqui, e vais ter de voltar a pensar nelas com as mesmas regras. É assim que se percebe se uma regra foi compreendida ou só decorada.

Todos os anos a escola organiza um torneio de futsal entre turmas. Cada turma inscreve uma equipa, com o nome da turma, a cor da camisola e entre 5 e 10 jogadores. Cada jogador tem nome, número da camisola e posição. Os jogos disputam-se por jornadas, e em cada jornada todas as equipas jogam uma vez. Cada jogo tem uma data, uma equipa da casa, uma equipa de fora, o resultado e a lista dos golos, com quem marcou e em que minuto. A escola tem dois recintos, o pavilhão, que é coberto, e o campo exterior, que não é.

A comissão do torneio quer uma aplicação que responda a estas perguntas:

1. Que jogadores tem uma equipa, e com que números de camisola?
2. Que jogos houve numa jornada, e com que resultados?
3. Que jogos teve uma dada equipa?
4. Quem são os melhores marcadores do torneio?
5. Em que recinto se joga cada jogo, e esse recinto é coberto?

## Modelar o torneio

### Exercício 1: ler um documento (15 minutos)

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

Este documento segue um dos modelos possíveis. No exercício 2, decides o teu.

Responde às cinco alíneas. Cada alínea tem uma pista no [Apoio](#apoio), que diz onde procurar a ideia no guia, e não a resposta.

a) Que valor identifica este jogo? Quem terá criado esse valor, e em que momento?

b) Que campos são referências a outros documentos? Para que coleção aponta cada um?

c) O que está embutido neste documento? Usa as duas regras do guia para explicar porque faz sentido estar embutido e não noutra coleção.

d) O documento não diz de que equipa é o jogador que marcou ao minuto 17. Como é que a aplicação o descobre?

e) O resultado do jogo está guardado duas vezes: nos campos `golosCasa` e `golosFora`, e na lista `golos`. O que pode correr mal por estar guardado duas vezes?

### Exercício 2: embutir ou referenciar no torneio (20 minutos)

Para cada uma destas informações, decide se fica embutida ou numa coleção à parte, ligada por referência. Justifica cada decisão com as duas regras do guia e diz que ecrã da aplicação vai ler esses dados.

a) Os jogadores de uma equipa.

b) As duas equipas de um jogo.

c) Os golos de um jogo.

d) O recinto onde se joga cada jogo, com o nome e se é coberto. Lembra-te de que a escola tem só dois recintos, e que eles não mudam.

Em algumas alíneas há mais do que uma resposta defensável. Nesses casos, o que conta é a justificação, e é bom que digas qual seria a alternativa e porque a puseste de lado.

### Exercício 3: guardar ou contar os golos de cada jogador (12 minutos)

A pergunta 4, "quem são os melhores marcadores", pode ser respondida de duas maneiras:

- Opção A: não se guarda nenhum total. Sempre que for preciso, contam-se os golos de cada jogador em todos os documentos da coleção `jogos`.
- Opção B: cada jogador tem um campo `golosMarcados`, que se atualiza de cada vez que um jogo é registado.

Responde:

a) Na opção B, o que tem a aplicação de fazer sempre que regista um jogo?

b) Na opção B, o que acontece se, dias depois, se descobrir que um golo foi atribuído ao jogador errado e alguém o corrigir no jogo?

c) No guia, as linhas de uma venda guardavam uma cópia do preço, e isso estava certo. O campo `golosMarcados` também é uma cópia de informação que já existe noutro sítio. Explica porque é que os dois casos não são iguais.

d) Qual das duas opções escolhias para este torneio, e porquê?

### Exercício 4: as perguntas da comissão no teu modelo (8 minutos)

Faz uma tabela com duas colunas, como a do passo 5 do exemplo guiado do guia. Na primeira coluna estão as cinco perguntas da comissão. Na segunda, escreve onde está a informação que responde a cada uma, no modelo que decidiste nos exercícios 2 e 3. Diz em que coleção, e em que campo ou lista dentro dela. Se uma pergunta não tiver resposta no teu modelo, o modelo está errado: volta ao exercício 2 e corrige-o.

Os nomes que dás aos campos são escolha tua. O que interessa é que se perceba onde está cada informação e, quando a resposta precisa de duas coleções, que campo liga uma à outra.

## Consultas no Atlas

No teu cluster, cria uma base de dados `torneio` com uma coleção `jogos`, da mesma forma que criaste a base `papelaria` no laboratório. Insere estes nove documentos, com "Add Data" e "Insert Document" (cerca de 5 minutos):

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

Repara numa simplificação: nestes documentos, as equipas aparecem pelo nome da turma, como texto, e não por referência, e os golos aparecem só como totais. O recinto aparece embutido, que é só uma das decisões possíveis do exercício 2. Fica assim para que as consultas sejam fáceis de ler. No exercício 2 decidiste como deviam ficar numa aplicação a sério.

### Exercício 5: os jogos da jornada 1 num recinto coberto (6 minutos)

Os jogos da jornada 1 que se disputaram num recinto coberto.

### Exercício 6: os jogos empatados (6 minutos)

Os jogos que acabaram empatados. Se concluíres que não se consegue escrever na barra de consulta, explica porquê e responde à mão, olhando para os nove documentos.

### Exercício 7: a equipa da casa do 10.º ano (6 minutos)

Os jogos em que a equipa da casa foi uma turma do 10.º ano. Escreve-o com um só operador.

### Exercício 8: os jogos do 10.º A, em casa ou fora (12 minutos)

É o último exercício obrigatório, e o único em que vais aprender sozinho um operador que o guia não ensina.

Todos os jogos do 10.º A, tanto em casa como fora. Com os operadores do guia não consegues. O operador que usaste no exercício 7 também não serve: explica porquê. Depois lê a [página do operador `$or`](https://www.mongodb.com/docs/manual/reference/operator/query/or/), na documentação oficial da MongoDB, e escreve o filtro. Executa-o e confirma o número de documentos.

A página está em inglês. Não precisas de a ler toda: procura nela a forma do filtro e um exemplo, e compara-os com os filtros que já escreveste.

## Apoio

- Exercício 1, alínea a): secção "O campo _id e o ObjectId" do guia.
- Exercício 1, alínea b): relê, no guia, o que guarda uma referência e como se costuma chamar o campo.
- Exercício 1, alínea c): secção "Como decidir" do guia. Pergunta-te que ecrã da aplicação vai mostrar estes dados, e se a lista pode crescer sem limite.
- Exercício 1, alínea d): olha para o que o golo do minuto 17 guarda sobre quem marcou. A secção "A informação relacionada embute-se ou referencia-se" do guia explica o que se faz com esse valor.
- Exercício 1, alínea e): no guia, o passo 5 do exemplo guiado fala de um caso parecido, o total de uma venda. O que pode acontecer a um jogo, depois de guardado, que não acontece a uma venda?
- Exercício 2: para cada informação, faz as duas perguntas da secção "Como decidir": que ecrã vai ler estes dados, e que dados mudam ao mesmo tempo. Confirma também se a informação pode crescer sem limite.
- Exercício 3: na alínea c), relê a secção "Copiar de propósito" do guia e pergunta-te para que serve cada uma das cópias.
- Exercício 4: quando uma pergunta precisa de duas coleções, diz que campo liga uma à outra, como o `fornecedorId` liga um artigo ao seu fornecedor.
- Exercício 5: o recinto é um documento embutido em cada jogo. A secção "Campos de um documento embutido" do guia mostra como se chega a um campo lá dentro.
- Exercício 6: antes de escreveres, pergunta-te com que valor comparas os golos da casa.
- Exercício 7: a igualdade compara o texto inteiro, como viste com `"papel"` e `"Papel"`.
- Exercício 8: na página do `$or`, procura o primeiro exemplo e compara a forma dele com a dos filtros que já escreveste.

Se quiseres ver todos os operadores de comparação, vê a página dos [operadores de comparação](https://www.mongodb.com/docs/manual/reference/operator/query-comparison/), na documentação oficial da MongoDB, em inglês. Sobre como se desenham os documentos, há a página da [modelação de dados](https://www.mongodb.com/docs/manual/data-modeling/).

## Desafio opcional

A comissão quer a classificação do torneio: cada vitória vale 3 pontos, cada empate vale 1 ponto e cada derrota vale 0. Com os nove jogos da coleção, calcula à mão os pontos de cada uma das seis equipas e faz a tabela da classificação. Se duas equipas tiverem os mesmos pontos, ficam empatadas na tabela. Depois explica porque é que esta pergunta não se responde com uma consulta na barra do Atlas. Mais à frente no módulo vais aprender a fazer este tipo de cálculo no código. Cerca de 15 minutos.

## Para ires mais longe

Estes exercícios são opcionais e não contam para a hora e meia da parte obrigatória. Faz-os depois dela, pela ordem que quiseres.

O exercício 9 leva o teu modelo até ao fim: escreves os documentos tal como a aplicação os guardaria. Os exercícios 10 a 13 são consultas do mesmo tipo das do laboratório, agora com os jogos do torneio. São bons para treinar se alguma dessas consultas te correu mal no laboratório. Usam a mesma coleção `jogos` da base `torneio`, e a regra é a mesma: escreve primeiro a consulta e os jogos que esperas, e só depois executa. O exercício 14 leva o método do guia a uma aplicação tua.

### Exercício 9: os documentos do teu modelo (10 minutos)

Escreve um documento de exemplo de cada coleção do teu modelo, com base nas decisões dos exercícios 2 e 3. Usa os nomes de campos que puseste na tabela do exercício 4. Nos valores de `_id` e das referências, podes escrever `ObjectId('...')`, com reticências. O que interessa é que se perceba que campo aponta para que documento.

### Exercício 10: os jogos da jornada 2 (5 minutos)

Os jogos da jornada 2.

### Exercício 11: três golos ou mais em casa (5 minutos)

Os jogos em que a equipa da casa marcou 3 golos ou mais.

### Exercício 12: só as equipas e os golos (5 minutos)

Os jogos da jornada 3, mostrando só as duas equipas e os golos de cada uma, sem o `_id`.

### Exercício 13: os jogos com mais golos de fora (5 minutos)

Os três jogos em que a equipa de fora marcou mais golos, do que marcou mais para o que marcou menos.

### Exercício 14: as perguntas de uma aplicação tua (10 minutos)

Pensa numa aplicação que gostavas de fazer e que guarde dados, por exemplo a da tua PAP. Escreve cinco perguntas a que ela teria de responder, tal como quem a usa as faria, como as da comissão do torneio. Depois, para cada pergunta, escreve a informação de que precisa e em que coleção a guardavas. São os passos 1 a 3 do método do guia.

## Critérios de conclusão

- Os exercícios 1 a 8 estão feitos, com o número de cada um.
- Cada decisão do exercício 2 tem uma justificação escrita, com as regras do guia.
- O teu modelo responde às cinco perguntas da comissão, como mostra a tabela do exercício 4.
- Cada exercício dá o número de jogos desta tabela. Se o teu número for diferente, procura a causa antes de passares à frente. Os enganos mais comuns estão na secção "Erros frequentes" do guia.

| Exercício | Documentos |
| --- | ---: |
| 5 | 2 |
| 6 | 3 |
| 7 | 3 |
| 8 | 3 |
| 10 (opcional) | 3 |
| 11 (opcional) | 4 |
| 12 (opcional) | 3, cada um só com quatro campos |
| 13 (opcional) | 3, e o primeiro tem 5 golos da equipa de fora |
| Desafio opcional | A soma dos pontos das seis equipas dá 24 |

## Autoavaliação

1. Que decisão do exercício 2 te custou mais a justificar, e porquê?
2. Em que consulta o resultado foi diferente do que previste? Qual foi a causa?
3. Conseguias explicar a um colega a diferença entre a cópia do preço numa venda e o total de golos de um jogador?

![Rodapé](../imagens/rodape.png)
