![Cabeçalho](../../imagens/cabecalho.png)

# Ficha de exercícios: Diagnóstico e revisão dirigida

Revês as bases do 11.º ano, e o npm de Sistemas de Informação, que as aulas deste ano usam a toda a hora. São o terminal e o npm, os objetos e os arrays, as funções, os módulos e os pedidos assíncronos. A parte obrigatória são as partes A e B, os exercícios 1 a 8, por esta ordem; a parte C, o React, é opcional. As respostas escritas ficam em comentários `//` nos ficheiros da pasta `revisao-js`, que crias no exercício 1. Sem computador, respondes numa folha, a partir do que a ficha mostra; sem internet para instalar o Express, os exercícios 7 e 8 fazem-se também em papel. Podes consultar os teus apontamentos e os capítulos do 11.º ano. Para rever: os capítulos de [JavaScript](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/README.md) e de [React](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/React/README.md).

## O cenário

Cada jogo do clube de videojogos da escola tem um número (`id`), o título, o género e o número máximo de jogadores (`jogadoresMax`). Tem também quantas vezes já foi requisitado (`requisicoes`) e se está disponível agora (`disponivel`).

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

a) Abre um terminal na tua pasta de trabalho, fora de qualquer outro projeto. Escreve e corre os três comandos que criam uma pasta `revisao-js`, entram nela e criam lá dentro um projeto Node com as respostas por omissão. O `package.json` que aparece é este:

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

b) Prepara o projeto para os exercícios seguintes. Muda o `"type"` para `"module"`, que é o que deixa usar o `import` e o `export`. Cria o ficheiro `ola.js`, com uma linha que escreve na consola a frase `A pasta da revisão está pronta.` Acrescenta aos scripts do `package.json` um script `ola` que corre esse ficheiro. Confirma com `npm run ola`.

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

No fim, volta à pasta `revisao-js`, com `cd revisao-js`.

As respostas escritas deste exercício vão em comentários no `ola.js`, porque o `package.json` não aceita comentários.

Rever: [Primeiro servidor, de Sistemas de Informação: o npm e o ficheiro package.json](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/01-aplicacoes-em-browser/02-primeiro-servidor.md#o-npm-e-o-ficheiro-packagejson).

<details>
<summary>Pista</summary>

Escreve o teu script como o `test`, que já lá está. Em cada erro, compara a mensagem com o que escreveste no terminal.

</details>

## Parte B: JavaScript

Na pasta `revisao-js`, cria o ficheiro `jogos.js` com o conteúdo do cenário. Nos exercícios 2 a 5, cada exercício vai num ficheiro próprio, como `exercicio2.js`, que começa por esta linha:

```js
import { jogos } from "./jogos.js";
```

Corre-o com `node exercicio2.js`.

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

Com `jogos[4]` no lugar de `jogos[0]`, o mesmo código mostra `Among Us (Festa): até 10 jogadores`.

c) O que mostra `console.log(jogo.preco)`? Dá erro? Explica.

Rever: [Objetos e `this`: o que é um objeto](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/08-Objetos-e-this.md#0-o-que-é-um-objeto) e [Strings: template literals](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/04-Strings.md#1-concatenar-e-usar-template-literals).

<details>
<summary>Pista</summary>

Uma template literal escreve-se entre acentos graves, e cada valor entra com `${...}`.

</details>

### Exercício 3: um jogo para quatro amigos

Quatro amigos querem um jogo para jogarem juntos, agora. Escreve o código que dá a lista dos títulos dos jogos que lhes servem: os que estão disponíveis e deixam jogar quatro pessoas, ou mais.

Com estes dados, devem aparecer três títulos. Escreve também o que mostra `console.log(jogos.length)` a seguir ao teu código, e porquê.

Rever: [Funções de alto nível em arrays: o `filter`](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/11-Arrays-HighOrder.md#2-filter---selecionar), [o `map`](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/11-Arrays-HighOrder.md#1-map---transformar) e [encadear com clareza](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/11-Arrays-HighOrder.md#8-encadear-com-clareza).

<details>
<summary>Pista</summary>

O `filter` fica com os jogos que servem, e o `map` fica com o título de cada um. Para a condição, diz primeiro por palavras quando é que um jogo serve aos quatro amigos, e confere-a com cada jogo da lista.

</details>

### Exercício 4: procurar um jogo

Escreve a função `procurarJogo(lista, id)`, que devolve o jogo da lista com esse `id`, ou `null` se não houver nenhum. Experimenta com o `id` 3 e com o `id` 9.

Responde: com o `id` 9, o que dá o `find`, e porque é que a tua função não pode devolver isso tal e qual?

Rever: [Funções: parâmetros e `return`](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/10-Funcoes.md#2-parâmetros-e-return) e [Funções de alto nível em arrays: o `find`](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/11-Arrays-HighOrder.md#4-find-e-findindex---primeiro-que-passa).

<details>
<summary>Pista</summary>

Experimenta o `find` sozinho, com o `id` 9, e vê o que aparece na consola.

</details>

### Exercício 5: o total de requisições

Escreve a função `totalDeRequisicoes(lista)`, que devolve quantas vezes, ao todo, os jogos da lista já foram requisitados. Podes usar um ciclo ou o `reduce`.

Experimenta-a com estas três listas, que devem dar estes resultados:

- a lista `jogos` dá 53;
- uma lista vazia, `[]`, dá 0;
- os jogos do género `"Festa"`, que obténs com um `filter`, dão 6.

Rever: [Ciclos: somar valores](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/06-Ciclos.md#somar-valores) e [Funções de alto nível em arrays: o `reduce`](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/11-Arrays-HighOrder.md#3-reduce---acumular).

<details>
<summary>Pista</summary>

Uma variável que cresce a cada jogo da lista, como um contador.

</details>

### Exercício 6: um import que falha

Cria na pasta `revisao-js` estes dois ficheiros novos. O `estatisticas.js` tem uma função que conta os jogos disponíveis:

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

Rever: [Módulos ES: exportar e importar](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/13-Modulos-ES.md#2-exportar-e-importar).

<details>
<summary>Pista</summary>

Compara o `estatisticas.js` com o `jogos.js`, que o `import` consegue usar. O que tem um que o outro não tem?

</details>

### O servidor de teste dos exercícios 7 e 8

Para experimentares os exercícios 7 e 8, a pasta `revisao-js` precisa de um servidor de teste, que responde com os jogos do clube.

1. Na pasta `revisao-js`, instala o Express.

   ```bash
   npm install express
   ```

2. Cria o ficheiro `servidor.js` com este conteúdo.

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

   app.listen(3000, (erro) => {
     if (erro) {
       console.error(`Não foi possível ligar o servidor de teste: ${erro.message}`);
       return;
     }
     console.log("Servidor de teste em http://localhost:3000");
   });
   ```

3. Num segundo terminal, também na pasta `revisao-js`, liga-o com `node servidor.js`. Deve aparecer `Servidor de teste em http://localhost:3000`. Se aparecer `Não foi possível ligar o servidor de teste`, outro servidor teu está a usar a porta 3000: desliga-o com Ctrl+C no terminal dele e volta a ligar este. Para desligar o servidor de teste, carrega em Ctrl+C no terminal dele.

### Exercício 7: o que devolve uma função async

Cria o `exercicio7.js` com este código, que vai buscar os jogos ao servidor de teste:

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

a) O que mostra a última linha? Explica, por palavras tuas, o que devolve uma função `async`.

b) Muda as duas últimas linhas para a consola mostrar quantos jogos vieram.

Rever: [Assíncrono e event loop: as promessas](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/15-Assincrono-EventLoop.md#4-promises), [o `async` e o `await`](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/15-Assincrono-EventLoop.md#5-asyncawait---ler-código-assíncrono-como-se-fosse-passo-a-passo) e [Módulos ES: o `await` fora de funções](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/13-Modulos-ES.md#5-top-level-await).

<details>
<summary>Pista</summary>

O `await` espera pela promessa e dá o que veio dentro dela.

</details>

### Exercício 8: os três finais de um pedido

Cria o `exercicio8.js` com este código. Esta versão da função verifica a resposta, e quem a chama trata os erros:

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

a) Escreve, num comentário no `exercicio8.js`, o que a consola mostra em cada situação:

1. o servidor ligado e o pedido a `/api/jogos`;
2. o servidor ligado e o pedido a `/api/jogo`, sem o `s`, com `carregarJogos("/api/jogo")`;
3. o servidor desligado, com Ctrl+C no terminal dele.

b) Nas situações 2 e 3, o erro vai parar ao `catch`. Em cada uma, quem o lança: o `fetch`, ou a própria função `carregarJogos`?

c) Imagina que apagavas as três linhas do `if (!resposta.ok)`. O que mostrava a consola na situação 2, e porquê?

Rever: [Fetch e AJAX: tratar erros](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/17-Fetch-AJAX.md#4-tratar-erros-rede-vs-http), [Exceções: erros assíncronos](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/12-Excecoes.md#7-erros-assíncronos-promessas-e-asyncawait) e [Módulos ES: o `await` fora de funções](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/JavaScript/13-Modulos-ES.md#5-top-level-await).

<details>
<summary>Pista</summary>

Em cada situação, pergunta-te se chegou alguma resposta do servidor.

</details>

## Parte C, opcional: React e formulários

Esta parte faz-se em papel: lês o componente e escreves as correções numa folha. Os três exercícios usam este componente, que devia deixar escrever o nome de um jogo e acrescentá-lo a uma lista de desejos. Tem dois erros que se notam quando o usas, e que vais encontrar nos exercícios 9 e 10.

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

Rever: [Estado e eventos: imutabilidade](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/React/04_estado_e_eventos.md#33-imutabilidade-não-alterar-diretamente-o-estado).

<details>
<summary>Pista</summary>

Se tiveres o computador, corre esta linha num ficheiro, com o `node`: `console.log([].push("Tetris"))`.

</details>

### Exercício 10: a caixa que não se esvazia

Com a linha corrigida, a lista já mostra o Tetris. Mas a caixa de texto continua a dizer "Tetris", apesar do `setTitulo("")`. Explica porquê, e reescreve a linha do `input` corrigida.

Rever: [Formulários controlados: o estado manda no input](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/React/06_formularios_controlados.md#11-a-ideia-central-o-estado-manda-no-input).

<details>
<summary>Pista</summary>

Pergunta-te de onde é que a caixa vai buscar o texto que mostra.

</details>

### Exercício 11: a lista vazia

Enquanto a lista não tem nenhum jogo, a página deve mostrar a frase "Ainda não escolheste nenhum jogo." no lugar da lista. Escreve o JSX que faz isto e diz em que sítio do componente o pões.

Rever: [Listas e condicionais: renderização condicional](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/React/05_listas_e_condicionais.md#3-essencial-renderização-condicional-no-jsx).

<details>
<summary>Pista</summary>

O operador `? :` ou o `&&`, dentro do JSX.

</details>

## Desafios

### O jogo mais requisitado

Escreve a função `maisRequisitado(lista)`, que devolve o jogo da lista com mais requisições. Decide, e escreve num comentário por cima da função, o que ela devolve com uma lista vazia, e o que acontece se dois jogos tiverem o mesmo número de requisições. Experimenta com a lista `jogos` e com duas listas inventadas por ti, uma para cada caso.

## Critérios de conclusão

- Os exercícios 1 a 8 têm resposta.
- Nos exercícios 4 e 5, as funções dão o valor certo também com o `id` que não existe e com a lista vazia.
- No exercício 8, sabes dizer quem lançou o erro nas situações 2 e 3.
- O `npm run ola` escreve a frase do exercício 1, e os exercícios 2 a 6 correm.

![Rodapé](../../imagens/rodape.png)
