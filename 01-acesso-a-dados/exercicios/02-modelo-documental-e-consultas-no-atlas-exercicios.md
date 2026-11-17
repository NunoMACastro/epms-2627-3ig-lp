![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: Modelo documental e primeiras consultas no Atlas

Praticas, com o torneio de futsal da escola, o que o guia fez na papelaria. Lês um documento, decides o que se embute e o que se referencia, e fazes consultas no Atlas. Os exercícios 1 a 8 são obrigatórios, por esta ordem. Escreve tudo num ficheiro de texto, o `respostas-02.md`, com o número de cada exercício, incluindo as consultas que deram o resultado certo. O ficheiro fica na tua pasta de trabalho de Linguagens de Programação, e não dentro de um projeto. Para rever: o [guia do tema](../02-modelo-documental-e-consultas-no-atlas.md) e o [laboratório](../laboratorios/02-modelo-documental-e-consultas-no-atlas-laboratorio.md).

## O cenário

Todos os anos a escola organiza um torneio de futsal entre turmas. Cada turma inscreve uma equipa, com o nome da turma, a cor da camisola e entre 5 e 10 jogadores. Cada jogador tem nome, número da camisola e posição. Os jogos disputam-se por jornadas, e em cada jornada todas as equipas jogam uma vez. Cada jogo tem uma data, uma equipa da casa, uma equipa de fora, o resultado e a lista dos golos, com quem marcou e em que minuto. A escola tem dois recintos, o pavilhão, que é coberto, e o campo exterior, que não é.

A comissão do torneio quer uma aplicação que responda a estas perguntas:

1. Que jogadores tem uma equipa, e com que números de camisola?
2. Que jogos houve numa jornada, e com que resultados?
3. Que jogos teve uma dada equipa?
4. Quem são os melhores marcadores do torneio?
5. Em que recinto se joga cada jogo, e esse recinto é coberto?

## Modelar o torneio

### Exercício 1: ler um documento

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

a) Que valor identifica este jogo? Quem terá criado esse valor, e em que momento?

b) Que campos são referências a outros documentos? Para que coleção aponta cada um?

c) O que está embutido neste documento? Usa as duas regras do guia para explicar porque faz sentido estar embutido e não noutra coleção.

d) O documento não diz de que equipa é o jogador que marcou ao minuto 17. Como é que a aplicação o descobre?

e) O resultado do jogo está guardado duas vezes: nos campos `golosCasa` e `golosFora`, e na lista `golos`. O que pode correr mal por estar guardado duas vezes?

Rever: [O campo `_id` e o ObjectId](../02-modelo-documental-e-consultas-no-atlas.md#o-campo-_id-e-o-objectid), [Seguir uma referência pede uma segunda consulta](../02-modelo-documental-e-consultas-no-atlas.md#seguir-uma-referência-pede-uma-segunda-consulta), [Duas perguntas decidem entre embutir e referenciar](../02-modelo-documental-e-consultas-no-atlas.md#duas-perguntas-decidem-entre-embutir-e-referenciar) e [Passo 5: os documentos de exemplo](../02-modelo-documental-e-consultas-no-atlas.md#passo-5-os-documentos-de-exemplo).

### Exercício 2: embutir ou referenciar no torneio

Para cada uma destas informações, decide se fica embutida ou numa coleção à parte, ligada por referência. Justifica cada decisão com as duas regras do guia e diz que ecrã da aplicação vai ler esses dados.

a) Os jogadores de uma equipa.

b) As duas equipas de um jogo.

c) Os golos de um jogo.

d) O recinto onde se joga cada jogo, com o nome e se é coberto. A escola tem só dois recintos, e eles não mudam.

Em algumas alíneas há mais do que uma resposta defensável. Nesses casos, o que conta é a justificação, e é bom que digas qual seria a alternativa e porque a puseste de lado.

Rever: [A informação relacionada embute-se ou referencia-se](../02-modelo-documental-e-consultas-no-atlas.md#a-informação-relacionada-embute-se-ou-referencia-se) e [Duas perguntas decidem entre embutir e referenciar](../02-modelo-documental-e-consultas-no-atlas.md#duas-perguntas-decidem-entre-embutir-e-referenciar).

### Exercício 3: guardar ou contar os golos de cada jogador

A pergunta 4, "quem são os melhores marcadores", pode ser respondida de duas maneiras:

- Opção A: não se guarda nenhum total. Sempre que for preciso, contam-se os golos de cada jogador em todos os documentos da coleção `jogos`.
- Opção B: cada jogador tem um campo `golosMarcados`, que se atualiza de cada vez que um jogo é registado.

a) Na opção B, o que tem a aplicação de fazer sempre que regista um jogo?

b) Na opção B, o que acontece se, dias depois, se descobrir que um golo foi atribuído ao jogador errado e alguém o corrigir no jogo?

c) No guia, as linhas de uma venda guardavam uma cópia do preço, e isso estava certo. O campo `golosMarcados` também é uma cópia de informação que já existe noutro sítio. Explica porque é que os dois casos não são iguais.

d) Qual das duas opções escolhias para este torneio, e porquê?

Rever: [Uma venda guarda uma cópia do preço, de propósito](../02-modelo-documental-e-consultas-no-atlas.md#uma-venda-guarda-uma-cópia-do-preço-de-propósito) e [Passo 5: os documentos de exemplo](../02-modelo-documental-e-consultas-no-atlas.md#passo-5-os-documentos-de-exemplo).

### Exercício 4: as perguntas da comissão no teu modelo

Faz uma tabela com duas colunas, como a do passo 5 do exemplo guiado do guia. Na primeira coluna estão as cinco perguntas da comissão. Na segunda, escreve onde está a informação que responde a cada uma, no modelo que decidiste nos exercícios 2 e 3. Diz em que coleção, e em que campo ou lista dentro dela. Se uma pergunta não tiver resposta no teu modelo, o modelo está errado. Volta ao exercício 2 e corrige-o.

Os nomes que dás aos campos são escolha tua. O que interessa é que se perceba onde está cada informação e, quando a resposta precisa de duas coleções, que campo liga uma à outra.

Rever: [Um modelo desenha-se a partir das perguntas](../02-modelo-documental-e-consultas-no-atlas.md#um-modelo-desenha-se-a-partir-das-perguntas) e [Passo 5: os documentos de exemplo](../02-modelo-documental-e-consultas-no-atlas.md#passo-5-os-documentos-de-exemplo).

## Consultas no Atlas

No teu cluster, cria uma base de dados `torneio` com uma coleção `jogos`, da mesma forma que criaste a base `papelaria` no laboratório. Insere estes nove documentos, com "Add Data" e "Insert Document":

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

Estes documentos são mais simples do que os do teu modelo: as equipas aparecem pelo nome da turma, como texto, e não por referência, e os golos só como totais. O recinto aparece embutido, que é só uma das decisões possíveis do exercício 2.

Cada exercício diz quantos jogos tem a resposta. Se o teu número for diferente, procura a causa antes de passares à frente. Os enganos mais comuns estão em [Uma consulta volta vazia, e não dá erro](../02-modelo-documental-e-consultas-no-atlas.md#uma-consulta-volta-vazia-e-não-dá-erro), no guia.

### Exercício 5: os jogos da jornada 1 num recinto coberto

Os jogos da jornada 1 que se disputaram num recinto coberto. São 2 jogos.

Rever: [Um campo embutido escreve-se com um ponto](../02-modelo-documental-e-consultas-no-atlas.md#um-campo-embutido-escreve-se-com-um-ponto) e [Todas as condições de um filtro têm de se cumprir](../02-modelo-documental-e-consultas-no-atlas.md#todas-as-condições-de-um-filtro-têm-de-se-cumprir).

### Exercício 6: os jogos empatados

Os jogos que acabaram empatados. Se concluíres que não se consegue escrever na barra de consulta, explica porquê e encontra-os tu, nos nove documentos. São 3 jogos.

Rever: [Um operador compara um campo com um valor](../02-modelo-documental-e-consultas-no-atlas.md#um-operador-compara-um-campo-com-um-valor).

### Exercício 7: a equipa da casa do 10.º ano

Os jogos em que a equipa da casa foi uma turma do 10.º ano. Escreve-o com um só operador. São 3 jogos.

Rever: [Um operador compara um campo com um valor](../02-modelo-documental-e-consultas-no-atlas.md#um-operador-compara-um-campo-com-um-valor).

### Exercício 8: os jogos do 10.º A, em casa ou fora

Todos os jogos do 10.º A, tanto em casa como fora. Com os operadores do guia não consegues, nem mesmo com o que usaste no exercício 7. Explica porquê. O filtro escreve-se com o operador `$or`, que o guia não ensina. Aprendes a usá-lo na [página do operador `$or`](https://www.mongodb.com/docs/manual/reference/operator/query/or/), na documentação oficial da MongoDB, em inglês. São 3 jogos.

Rever: [Um operador compara um campo com um valor](../02-modelo-documental-e-consultas-no-atlas.md#um-operador-compara-um-campo-com-um-valor) e [Todas as condições de um filtro têm de se cumprir](../02-modelo-documental-e-consultas-no-atlas.md#todas-as-condições-de-um-filtro-têm-de-se-cumprir).

<details>
<summary>Pista</summary>

Não precisas de ler a página toda. Chegam a secção "Syntax" e o primeiro exemplo. Nos exemplos, o filtro é o primeiro documento dentro de `find()`.

</details>

## Desafios

Os exercícios 10 a 13 são consultas como as do laboratório, agora com os jogos do torneio, para treinares as que te correram mal.

### Exercício 9: os documentos do teu modelo

Escreve um documento de exemplo de cada coleção do teu modelo, com base nas decisões dos exercícios 2 e 3. Usa os nomes de campos que puseste na tabela do exercício 4. Nos valores de `_id` e das referências, podes escrever `ObjectId('...')`, com reticências, desde que se perceba que campo aponta para que documento.

Rever: [Passo 5: os documentos de exemplo](../02-modelo-documental-e-consultas-no-atlas.md#passo-5-os-documentos-de-exemplo).

### Exercício 10: os jogos da jornada 2

Os jogos da jornada 2. São 3 jogos.

Rever: [Um filtro escolhe os documentos](../02-modelo-documental-e-consultas-no-atlas.md#um-filtro-escolhe-os-documentos).

### Exercício 11: três golos ou mais em casa

Os jogos em que a equipa da casa marcou 3 golos ou mais. São 4 jogos.

Rever: [Um operador compara um campo com um valor](../02-modelo-documental-e-consultas-no-atlas.md#um-operador-compara-um-campo-com-um-valor).

### Exercício 12: só as equipas e os golos

Os jogos da jornada 3, mostrando só as duas equipas e os golos de cada uma, sem o `_id`. São 3 jogos, cada um só com quatro campos.

Rever: [A projeção escolhe os campos](../02-modelo-documental-e-consultas-no-atlas.md#a-projeção-escolhe-os-campos).

### Exercício 13: os jogos com mais golos de fora

Os três jogos com mais golos da equipa de fora, por ordem, do que tem mais para o que tem menos. O primeiro tem 5 golos da equipa de fora.

Rever: [Ordenar e depois limitar](../02-modelo-documental-e-consultas-no-atlas.md#ordenar-e-depois-limitar).

### Exercício 14: as perguntas de uma aplicação tua

Pensa numa aplicação que gostavas de fazer e que guarde dados, por exemplo a da tua PAP. Escreve cinco perguntas a que ela teria de responder, tal como quem a usa as faria, como as da comissão do torneio. Depois, para cada pergunta, escreve a informação de que precisa e em que coleção a guardavas. São os passos 1 a 3 do método do guia.

Rever: [Um modelo desenha-se a partir das perguntas](../02-modelo-documental-e-consultas-no-atlas.md#um-modelo-desenha-se-a-partir-das-perguntas).

### A classificação do torneio

A comissão quer a classificação do torneio: cada vitória vale 3 pontos, cada empate vale 1 ponto e cada derrota vale 0. Com os nove jogos da coleção, calcula tu os pontos de cada uma das seis equipas e faz a tabela da classificação, no `respostas-02.md`. Se duas equipas tiverem os mesmos pontos, ficam empatadas na tabela. A soma dos pontos das seis equipas dá 24. Explica também porque é que esta pergunta não se responde com uma consulta na barra do Atlas.

## Critérios de conclusão

- Os exercícios 1 a 8 estão no teu ficheiro das respostas, com o número de cada um, incluindo as consultas que deram o resultado certo.
- Cada decisão do exercício 2 tem uma justificação escrita, com as regras do guia.
- O teu modelo responde às cinco perguntas da comissão, como mostra a tabela do exercício 4.
- As consultas dos exercícios 5, 7 e 8 dão o número de jogos que cada exercício diz, e o exercício 6 tem os empates e a explicação.

![Rodapé](../../imagens/rodape.png)
