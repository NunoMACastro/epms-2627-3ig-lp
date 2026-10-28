![Cabeçalho](../imagens/cabecalho.png)

# Ficha de exercícios: Diagnóstico e revisão dirigida

Ficha do tema Diagnóstico e revisão dirigida, do módulo M14, Acesso a Bases de Dados. Revês as bases do 11.º ano que as aulas deste ano usam a toda a hora. São o terminal e o npm, os objetos e os arrays, as funções, os módulos e os pedidos assíncronos e, no fim, o React. Fazes sozinho, ao teu ritmo: o que não acabares na aula, acabas em casa ou na aula seguinte.

## O que precisas de saber

O que aprendeste no 11.º ano. Podes consultar os teus apontamentos e estes capítulos do 11.º ano:

- os objetos: [Objetos e this](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/08-Objetos-e-this.md);
- as funções: [Funções](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/10-Funcoes.md);
- o `filter`, o `map`, o `find` e o `reduce`: [Arrays de ordem superior](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/11-Arrays-HighOrder.md);
- os erros, com o `try`, o `catch` e o `throw`: [Exceções](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/12-Excecoes.md);
- os módulos: [Módulos ES](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/13-Modulos-ES.md);
- o `async` e o `await`: [Assíncrono e event loop](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/15-Assincrono-EventLoop.md);
- o `fetch`: [Fetch e AJAX](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/17-Fetch-AJAX.md);
- o React, para a parte opcional: [Estado e eventos](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/React/04_estado_e_eventos.md), [Listas e condicionais](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/React/05_listas_e_condicionais.md) e [Formulários controlados](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/React/06_formularios_controlados.md).

Não precisas de nenhum trabalho anterior. Tudo o que os exercícios usam está nesta ficha.

## Como trabalhar

A parte obrigatória são as partes A e B, os exercícios 1 a 8, por esta ordem. A parte C, sobre o React, é opcional, como o desafio do fim.

Esta ficha é de revisão, e podes consultar os apontamentos e os capítulos indicados acima. Tenta primeiro sozinho, e consulta quando ficares preso. Assim percebes, e o professor também, onde precisas de rever.

Resolve no caderno. Nos exercícios com código, escreve primeiro o que esperas que aconteça, e só depois experimenta. Cada exercício constrói-se só com o que está na ficha. O exercício 1 cria a pasta `revisao-js`, onde experimentas os exercícios 2 a 8, se tiveres o computador. Os exercícios 7 e 8 precisam também de um servidor de teste, que a ficha dá antes do exercício 7 e se instala com internet; sem ele, responde em papel. A parte C faz-se em papel. Se precisares de ajuda, o [Apoio](#apoio) dá uma pista para cada exercício.

## O cenário: o clube de videojogos

O clube de videojogos da escola empresta jogos aos alunos. Cada jogo tem um número (`id`), o título, o género, o número máximo de jogadores (`jogadoresMax`), quantas vezes já foi requisitado (`requisicoes`) e se está disponível agora (`disponivel`).

```js
// jogos.js: os jogos que o clube de videojogos da escola empresta.
export const jogos = [
  { id: 1, titulo: "Minecraft", genero: "Construção", jogadoresMax: 8, requisicoes: 14, disponivel: true },
  { id: 2, titulo: "Mario Kart 8", genero: "Corrida", jogadoresMax: 4, requisicoes: 21, disponivel: false },
  { id: 3, titulo: "Tetris", genero: "Puzzle", jogadoresMax: 1, requisicoes: 3, disponivel: true },
  { id: 4, titulo: "Rocket League", genero: "Desporto", jogadoresMax: 4, requisicoes: 9, disponivel: true },
  { id: 5, titulo: "Among Us", genero: "Festa", jogadoresMax: 10, requisicoes: 0, disponivel: true },
  { id: 6, titulo: "Overcooked 2", genero: "Festa", jogadoresMax: 4, requisicoes: 6, disponivel: false },
];
```

## Parte A: o terminal e o npm

### Exercício 1: a pasta da revisão

Neste exercício crias, do zero, a pasta onde vais experimentar os exercícios seguintes. Se não tiveres o computador, responde a partir do que a ficha mostra.

a) Abre um terminal na tua pasta de trabalho, fora de qualquer outro projeto. Escreve os três comandos que criam uma pasta `revisao-js`, entram nela e criam lá dentro um projeto Node com as respostas por omissão. Explica para que serve cada um, e depois corre-os. O `package.json` que aparece é este:

```json
{
  "name": "revisao",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
```

b) Prepara o projeto para os exercícios seguintes. Muda o `"type"` para `"module"`, que é o que deixa usar o `import` e o `export`. Cria o ficheiro `ola.js`, com uma linha que escreve na consola `A pasta da revisão está pronta.`. Acrescenta aos scripts do `package.json` um script `ola` que corre esse ficheiro. Escreve no caderno as linhas do `package.json` que mudaste ou acrescentaste, e confirma com `npm run ola`.

c) Provoca dois erros. Para cada um, explica o que correu mal e como o percebes pela mensagem (mostram-se só as linhas que interessam).

- Corre `npm run ole`, com o nome do script mal escrito:

  ```text
  npm error Missing script: "ole"
  npm error
  npm error Did you mean this?
  npm error   npm run ola # run the "ola" package script
  ```

- Sobe para a pasta de cima, com `cd ..`, e corre lá `npm run ola`:

  ```text
  npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/home/aluno/package.json'
  ```

No fim, volta à pasta `revisao-js`, com `cd revisao-js`. Os exercícios seguintes correm-se todos nesta pasta.

## Parte B: JavaScript

Na pasta `revisao-js`, cria o ficheiro `jogos.js` com o conteúdo do cenário. Escreve cada exercício num ficheiro próprio, como `exercicio2.js`, que começa por esta linha:

```js
import { jogos } from "./jogos.js";
```

Corre-o com `node exercicio2.js`, na pasta `revisao-js`.

### Exercício 2: as propriedades de um jogo

Num ficheiro `exercicio2.js`, a seguir ao `import`, guarda o primeiro jogo da lista numa constante:

```js
const jogo = jogos[0];
```

a) Escreve as expressões que dão o título e o número máximo de jogadores desse jogo.

b) Escreve o código que mostra na consola esta frase, construída a partir do objeto, sem escreveres à mão nenhum dos três valores:

```text
Minecraft (Construção): até 8 jogadores
```

Depois, troca o `jogos[0]` por `jogos[4]` e confirma que a frase muda sozinha.

c) O que mostra `console.log(jogo.preco)`? Dá erro? Explica.

### Exercício 3: um jogo para quatro amigos

Quatro amigos querem um jogo para jogarem juntos, agora. Escreve o código que dá a lista dos títulos dos jogos que lhes servem: os que estão disponíveis e deixam jogar quatro pessoas, ou mais.

Antes de o correres, escreve no caderno os títulos que esperas. Depois, escreve o que mostra `console.log(jogos.length)` a seguir ao teu código, e porquê.

### Exercício 4: procurar um jogo

Escreve a função `procurarJogo(lista, id)`, que devolve o jogo da lista com esse `id`, ou `null` se não houver nenhum. Experimenta com o `id` 3 e com o `id` 9.

No caderno, responde: o que devolvia a tua função com o `id` 9 se tivesse só a linha `return lista.find((jogo) => jogo.id === id);`?

### Exercício 5: o total de requisições

Escreve a função `totalDeRequisicoes(lista)`, que devolve quantas vezes, ao todo, os jogos da lista já foram requisitados. Podes usar um ciclo ou o `reduce`.

Antes de experimentares, escreve no caderno o que esperas destas três chamadas, e depois confirma:

- com a lista `jogos`;
- com uma lista vazia, `[]`;
- com os jogos do género `"Festa"`, que obténs com um `filter`.

### Exercício 6: um import que falha

Um programa está dividido em dois ficheiros, na pasta `revisao-js`. O `estatisticas.js` tem uma função que conta os jogos disponíveis:

```js
// estatisticas.js: contas sobre os jogos do clube.

/**
 * Conta os jogos da lista que estão disponíveis agora.
 * @param {object[]} lista os jogos
 * @returns {number}
 */
function contarDisponiveis(lista) {
  return lista.filter((jogo) => jogo.disponivel).length;
}
```

O `app.js` usa essa função:

```js
// app.js: mostra quantos jogos estão disponíveis.
import { jogos } from "./jogos.js";
import { contarDisponiveis } from "./estatisticas.js";

console.log(contarDisponiveis(jogos));
```

Ao correr `node app.js`, aparece este erro:

```text
SyntaxError: The requested module './estatisticas.js' does not provide an export named 'contarDisponiveis'
```

a) Explica a mensagem: que ficheiro pediu o quê, e a que ficheiro.

b) Corrige o programa mudando um só ficheiro. Diz qual, e porque é esse.

c) Depois da correção, o que aparece na consola?

### O servidor de teste dos exercícios 7 e 8

Para experimentares os exercícios 7 e 8, a pasta `revisao-js` precisa de um servidor de teste, que responde com os jogos do clube. Se não tiveres internet para o instalar, faz os dois exercícios em papel.

1. Na pasta `revisao-js`, instala o Express. Precisa de internet.

   ```bash
   npm install express
   ```

2. Cria o ficheiro `servidor.js` com este conteúdo. Não faz parte de nenhum exercício: só responde aos pedidos dos exercícios 7 e 8.

   ```js
   // servidor.js: um servidor de teste, que responde com os jogos do clube.
   // Serve só para os exercícios 7 e 8.
   import express from "express";
   import { jogos } from "./jogos.js";

   const app = express();

   // GET /api/jogos: a lista dos jogos, em JSON.
   app.get("/api/jogos", (req, res) => {
     res.json(jogos);
   });

   // Qualquer outro pedido: 404, com a mensagem de erro em JSON.
   app.use((req, res) => {
     res.status(404).json({ erro: "Rota não encontrada" });
   });

   app.listen(3000, () => {
     console.log("Servidor de teste em http://localhost:3000");
   });
   ```

3. Num segundo terminal, também na pasta `revisao-js`, liga-o com `node servidor.js`. Deve aparecer `Servidor de teste em http://localhost:3000`. Para o desligar, carrega em Ctrl+C nesse terminal.

### Exercício 7: o que devolve uma função async

Esta função vai buscar os jogos ao servidor de teste:

```js
// exercicio7.js: o que devolve uma função async.
async function carregarJogos() {
  const resposta = await fetch("http://localhost:3000/api/jogos");
  const jogos = await resposta.json();
  return jogos;
}

const resultado = carregarJogos();
console.log(resultado);
```

a) Antes de experimentares, o que mostra a última linha? Explica, por palavras tuas, o que devolve uma função `async`.

b) Muda as duas últimas linhas para a consola mostrar quantos jogos vieram.

Se tiveres o servidor de teste ligado, experimenta as duas versões. Se não, responde em papel.

### Exercício 8: os três finais de um pedido

Esta versão da função verifica a resposta, e quem a chama trata os erros:

```js
// exercicio8.js: os três finais possíveis de um pedido.
async function carregarJogos(caminho) {
  const resposta = await fetch(`http://localhost:3000${caminho}`);
  if (!resposta.ok) {
    throw new Error(`O servidor respondeu ${resposta.status}`);
  }
  const jogos = await resposta.json();
  return jogos;
}

try {
  const jogos = await carregarJogos("/api/jogos");
  console.log(`Vieram ${jogos.length} jogos`);
} catch (erro) {
  console.log(`Não foi possível carregar os jogos: ${erro.message}`);
}
```

a) Copia esta tabela para o caderno e completa a última coluna. Para a situação 2, o pedido muda para `carregarJogos("/api/jogo")`.

| Situação | O que a consola mostra |
| --- | --- |
| 1. O servidor está ligado, e o pedido é a `/api/jogos` | |
| 2. O servidor está ligado, e o pedido é a `/api/jogo`, sem o `s` | |
| 3. O servidor está desligado | |

b) Nas situações 2 e 3, o erro vai parar ao `catch`. Em cada uma, quem o lança: o `fetch`, ou o teu código?

c) Imagina que apagavas as três linhas do `if (!resposta.ok)`. O que mostrava a consola na situação 2, e porquê?

## Parte C, opcional: React e formulários

Esta parte faz-se em papel: lês o componente e escreves as correções no caderno. Os três exercícios usam este componente, que devia deixar escrever o nome de um jogo e acrescentá-lo a uma lista de desejos. Tem dois erros, que vais encontrar nos exercícios 9 e 10. Lê o componente todo antes de começares.

```jsx
import { useState } from "react";

export default function ListaDeDesejos() {
  const [titulo, setTitulo] = useState("");
  const [desejos, setDesejos] = useState([]);

  function aoSubmeter(evento) {
    evento.preventDefault();
    setDesejos(desejos.push(titulo));
    setTitulo("");
  }

  return (
    <form onSubmit={aoSubmeter}>
      <label htmlFor="titulo">Jogo que queres experimentar</label>
      <input id="titulo" onChange={(evento) => setTitulo(evento.target.value)} />
      <button type="submit">Acrescentar</button>

      <ul>
        {desejos.map((desejo, indice) => (
          <li key={indice}>{desejo}</li>
        ))}
      </ul>
    </form>
  );
}
```

### Exercício 9: a lista que rebenta

Escreve-se "Tetris" na caixa e carrega-se em "Acrescentar". A página fica em branco, e a consola do browser mostra um erro com `desejos.map is not a function`.

a) O que é que o `push` devolve? Depois do `setDesejos`, o que fica guardado no estado `desejos`?

b) Reescreve a linha do `setDesejos` corrigida.

### Exercício 10: a caixa que não se esvazia

Com a linha corrigida, a lista já mostra o Tetris. Mas a caixa de texto continua a dizer "Tetris", apesar do `setTitulo("")`. Explica porquê, e reescreve a linha do `input` corrigida.

### Exercício 11: a lista vazia

Enquanto a lista não tem nenhum jogo, a página deve mostrar a frase "Ainda não escolheste nenhum jogo." no lugar da lista. Escreve o JSX que faz isto e diz em que sítio do componente o pões.

## Apoio

- Exercício 1: um script é uma linha dentro de `"scripts"`, com o nome entre aspas, os dois pontos e o comando, e uma vírgula a separá-la da linha anterior. Nas mensagens, lê o que o npm procurou e onde.
- Exercício 2: uma template string escreve-se entre acentos graves, e cada valor entra com `${...}`.
- Exercício 3: o `filter` recebe uma condição com duas partes. Repara no "ou mais".
- Exercício 4: experimenta o `find` sozinho, com o `id` 9, e vê o que aparece na consola.
- Exercício 5: uma variável que começa num valor e cresce a cada jogo. Pensa no valor com que começa.
- Exercício 6: num módulo, o que não leva `export` fica fechado dentro do ficheiro.
- Exercício 7: o `await` espera pela promessa e dá o que veio dentro dela.
- Exercício 8: a resposta tem o `ok` e o `status`. Um 404 também é uma resposta.
- Exercício 9: no Node, experimenta `console.log([].push("Tetris"))`.
- Exercício 10: num campo controlado, o estado e a caixa estão ligados nos dois sentidos.
- Exercício 11: o operador `? :` ou o `&&`, dentro do JSX.

## Desafio opcional

**O jogo mais requisitado.** Escreve a função `maisRequisitado(lista)`, que devolve o jogo da lista com mais requisições. Decide, e escreve no caderno, o que ela devolve com uma lista vazia, e o que acontece se dois jogos tiverem o mesmo número de requisições. Experimenta com a lista `jogos` e com duas listas inventadas por ti, uma para cada caso.

## Critérios de conclusão

- Os exercícios 1 a 8 têm resposta no caderno, com a previsão escrita antes do resultado nos que têm código.
- Nos exercícios 4 e 5, as funções dão o valor certo também com o `id` que não existe e com a lista vazia.
- No exercício 8, sabes dizer, em cada situação, quem lançou o erro.
- Se tiveste o computador, o `npm run ola` escreve a frase do exercício 1, e os exercícios 2 a 6 correm na pasta `revisao-js`.

## Autoavaliação

1. Que exercício te obrigou a consultar mais? O que foste procurar?
2. Que parte do 11.º ano sentes que ainda não dominas, e precisas de rever?
3. Nos exercícios 7 e 8, consegues explicar a um colega a diferença entre o servidor desligado e um 404?

![Rodapé](../imagens/rodape.png)
