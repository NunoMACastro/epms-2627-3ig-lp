![Cabeçalho](../imagens/cabecalho.png)

# Diagnóstico inicial de Linguagens de Programação

12.º ano, Curso Profissional de Técnico/a de Informática de Gestão. Duração: 60 minutos. Nos primeiros 5, o professor explica o diagnóstico; ficam 55 para responderes.

## Para que serve este diagnóstico

Este ano, nas aulas, vais construir peça a peça uma aplicação completa, a da papelaria. Vai ter uma parte que corre num servidor e guarda os dados numa base de dados, e uma parte que o utilizador vê e usa no browser. Vai ter também relatórios com números úteis para quem gere, testes e documentação. No fim do ano, nas horas da PAP, fazes a tua própria aplicação, sobre um problema que escolhes.

Tudo isto assenta no que aprendeste no 11.º ano: JavaScript, objetos e arrays, módulos, pedidos assíncronos e React. Se uma destas bases estiver frágil, as aulas seguintes tornam-se muito mais difíceis, porque cada matéria nova usa as anteriores ao mesmo tempo. É por isso que se faz este diagnóstico: para saber que bases precisam de revisão antes de a matéria nova as usar.

Um diagnóstico não é um teste. Não tem nota e não conta para a classificação. Serve para o professor saber, parte a parte, o que ainda dominas, o que consegues fazer com alguma ajuda e o que precisas de rever. É com as tuas respostas que se decide o que se faz nas duas aulas seguintes. Quem precisar de rever um tema trabalha esse tema, e quem já o domina avança para um desafio. Por isso, uma resposta copiada ou adivinhada prejudica-te: faz com que revejas o que não precisavas e que saltes o que precisavas.

Também é normal não te lembrares de tudo. Passaram as férias de verão, e alguns destes temas foram dados há quase um ano. Escrever "não me lembro" é uma resposta útil, porque mostra exatamente onde está a lacuna. Uma resposta em branco não mostra nada: quem a lê não sabe se não sabias, se te faltou tempo ou se saltaste a pergunta sem querer.

## O que precisas de saber antes

- Nada para estudar. O diagnóstico mede o que trazes do 11.º ano:
  - o terminal e o npm;
  - os objetos e os arrays;
  - os módulos, com `import` e `export`;
  - os pedidos assíncronos, com `fetch` e `await`, e os erros;
  - o React e os formulários.

## Como está organizado

Respondes numa folha, à mão, e não precisas de computador. Escreve o teu nome e o teu número no topo da folha de respostas, e escreve o número de cada pergunta antes da resposta.

Não podes consultar apontamentos, a internet nem ferramentas de inteligência artificial. O objetivo é ver o que sabes agora, e não o que consegues procurar.

O diagnóstico tem cinco partes, com estes tempos:

- A, terminal e npm: 10 minutos;
- B, objetos e arrays: 10 minutos;
- C, módulos: 10 minutos;
- D, pedidos assíncronos e erros: 15 minutos;
- E, React e formulários: 10 minutos.

O tempo de cada parte serve para te orientares e não é um limite rígido. Se ficares preso numa pergunta, escreve o que pensas e avança para a seguinte; se sobrar tempo, voltas a ela.

Quase todas as perguntas pedem uma explicação, e a explicação conta mais do que o resultado. Uma resposta certa sem explicação diz pouco, porque pode ter sido um palpite. Uma resposta errada mas bem explicada mostra exatamente onde está o engano, e isso é o mais útil para preparar a revisão. Escreve por palavras tuas, em frases completas, como explicarias a um colega que faltou à aula.

Quando se pede código, não tens de acertar em todos os pormenores de sintaxe. Interessa que a ideia esteja certa e que expliques o que o código faz.

## Os dados usados nas perguntas

Várias perguntas usam o mesmo exemplo: o inventário de uma papelaria escolar. Cada artigo é um objeto com cinco propriedades: um identificador (`id`), um nome, uma categoria, a quantidade que existe em armazém (`stock`) e o preço em cêntimos (`precoCentimos`).

O preço está guardado em cêntimos, como número inteiro: `250` quer dizer 2,50 €. Guarda-se assim porque os números com casas decimais nem sempre dão contas exatas em JavaScript. Por exemplo, `0.1 + 0.2` dá `0.30000000000000004` e não `0.3`. Com cêntimos inteiros, as somas e as subtrações de dinheiro dão sempre o valor certo, e só se converte para euros no momento de mostrar o preço.

```js
const artigos = [
  { id: 1, nome: "Caderno A4", categoria: "Papel", stock: 12, precoCentimos: 250 },
  { id: 2, nome: "Esferográfica azul", categoria: "Escrita", stock: 3, precoCentimos: 60 },
  { id: 3, nome: "Bloco de notas", categoria: "Papel", stock: 0, precoCentimos: 180 },
  { id: 4, nome: "Lápis HB", categoria: "Escrita", stock: 25, precoCentimos: 35 },
  { id: 5, nome: "Papel de fotocópia", categoria: "Papel", stock: 4, precoCentimos: 520 },
  { id: 6, nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, precoCentimos: 120 },
];
```

## Parte A: terminal e npm (10 minutos)

Nesta parte trabalhas com um projeto chamado `inventario-web`. É um projeto React criado com Vite, do mesmo tipo dos que usaste no 11.º ano. Está numa pasta chamada `inventario-web`, dentro de uma pasta `projetos`, que por sua vez está dentro da tua pasta pessoal.

O ficheiro `package.json` do projeto é este:

```json
{
  "name": "inventario-web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.3.0",
    "react-dom": "^19.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.1.2",
    "vite": "^8.3.4"
  }
}
```

Além do `package.json`, a pasta do projeto tem um ficheiro chamado `package-lock.json`. Não tem a pasta `node_modules`, porque o projeto foi descarregado do GitHub e essa pasta nunca se envia para o GitHub.

### Pergunta 1: chegar à pasta do projeto

Abriste o terminal e ele está na tua pasta pessoal. Escreve os comandos que usas para entrar na pasta do projeto e para confirmares que estás no sítio certo. Explica o que faz cada um dos comandos. Podes usar os comandos do Windows, do macOS ou do Linux.

### Pergunta 2: instalar as dependências

Que comando escreves para instalar as dependências do projeto? Explica o que acontece quando o executas e para que serve o ficheiro `package-lock.json`.

### Pergunta 3: dois erros ao arrancar o projeto

Dois colegas tentaram arrancar o projeto e tiveram erros diferentes. Para cada um, explica o que correu mal, como percebeste isso a partir da mensagem de erro, e o que cada um devia ter feito.

a) Uma colega escreveu `npm start` dentro da pasta do projeto e apareceu esta mensagem (mostram-se só as linhas que interessam):

```text
npm error Missing script: "start"
```

b) Um colega escreveu `npm run dev` e apareceu esta mensagem (mostram-se só as linhas que interessam):

```text
npm error code ENOENT
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/home/aluno/package.json'
```

## Parte B: objetos e arrays (10 minutos)

### Pergunta 4: prever o resultado de um filtro

Lê este código, que usa o array `artigos` apresentado no início.

```js
const alerta = artigos
  .filter((artigo) => artigo.stock < 5)
  .map((artigo) => artigo.nome);

console.log(alerta);
console.log(artigos.length);
```

a) Escreve o que aparece na consola em cada uma das duas linhas com `console.log`. Não interessa a forma exata com que a consola mostra o array.

b) Explica, por palavras tuas, o que faz o `filter` e o que faz o `map` neste código, e porque é que `artigos.length` mostra o valor que indicaste.

### Pergunta 5: contar artigos de uma categoria

Escreve uma função chamada `contarPorCategoria` que recebe uma lista de artigos e o nome de uma categoria. A função devolve quantos artigos da lista (e não quantas unidades) pertencem a essa categoria. Podes usar o método que preferires: um ciclo, `filter` ou outro.

Depois, chama a tua função com o array `artigos` e indica o que ela devolve para a categoria `"Papel"` e para a categoria `"Mochilas"`. Explica como chegaste a cada um dos valores.

## Parte C: módulos (10 minutos)

### Pergunta 6: um import que não funciona

Um programa está dividido em dois ficheiros, na mesma pasta. O primeiro, `precos.js`, tem uma função que transforma um preço em cêntimos no texto que o cliente vê:

```js
/**
 * Converte um preço em cêntimos no texto que o cliente vê.
 * Exemplo: 899 cêntimos passa a "8,99 €".
 */
export function formatarPreco(centimos) {
  const euros = Math.floor(centimos / 100);
  const resto = String(centimos % 100).padStart(2, "0");
  return `${euros},${resto} €`;
}
```

O segundo, `app.js`, usa essa função:

```js
import formatarPreco from "./precos.js";

console.log(formatarPreco(1250));
```

Quando se executa o `app.js`, aparece este erro:

```text
SyntaxError: The requested module './precos.js' does not provide an export named 'default'
```

a) Explica o que esta mensagem de erro quer dizer. Para isso, explica a diferença entre exportar uma função com nome e exportar por omissão (`export default`).

b) Corrige o programa de duas maneiras diferentes: uma em que só alteras o `app.js`, e outra em que só alteras o `precos.js`.

c) Depois de corrigido, o que aparece na consola?

## Parte D: pedidos assíncronos e erros (15 minutos)

Imagina um servidor que, quando lhe fazem um pedido no endereço `http://localhost:3000/api/artigos`, responde com a lista de artigos da papelaria em formato JSON.

Uma colega escreveu esta função para ir buscar os artigos ao servidor:

```js
async function carregarArtigos() {
  const resposta = fetch("http://localhost:3000/api/artigos");
  const dados = resposta.json();
  return dados;
}
```

Quando a função é executada, aparece este erro:

```text
TypeError: resposta.json is not a function
```

### Pergunta 7: o que está dentro da variável resposta

a) O que é que a variável `resposta` contém realmente, logo depois da linha do `fetch`? Explica porque é que isso provoca o erro.

b) Reescreve a função corrigida.

### Pergunta 8: duas maneiras de um pedido correr mal

Com a função já corrigida, há duas situações em que o pedido corre mal:

- Situação 1: o servidor está desligado.
- Situação 2: o servidor está ligado, mas o endereço escrito no `fetch` tem um erro, por exemplo `/api/artigo`. O servidor responde com o código 404, que quer dizer "não encontrado", e com o corpo `{"erro":"Rota não encontrada"}`.

a) Numa destas situações, o `fetch` não lança nenhum erro e a função continua como se o pedido tivesse corrido bem. Qual é essa situação? Explica porquê.

b) Acrescenta à função o código necessário para que a situação da alínea a) passe a ser tratada como um erro. A mensagem do erro diz o código que o servidor enviou.

c) Escreve o código que chama a função `carregarArtigos` e mostra os artigos na consola quando tudo corre bem. Quando acontece qualquer uma das duas situações, o código mostra uma mensagem de erro compreensível.

## Parte E: React e formulários (10 minutos)

Este componente React deveria permitir escrever o nome de um artigo numa caixa de texto e, ao carregar no botão, acrescentá-lo a uma lista mostrada por baixo. Tem dois erros, que vais descobrir nas perguntas 9 e 10. Lê o componente todo antes de começares.

```jsx
import { useState } from "react";

export default function NovoArtigo() {
  const [nome, setNome] = useState("");
  const [artigos, setArtigos] = useState([]);

  function adicionar(evento) {
    evento.preventDefault();
    artigos.push(nome);
    setArtigos(artigos);
  }

  return (
    <form onSubmit={adicionar}>
      <label htmlFor="nome">Nome do artigo</label>
      <input id="nome" value={nome} />
      <button type="submit">Adicionar</button>

      <ul>
        {artigos.map((artigo, indice) => (
          <li key={indice}>{artigo}</li>
        ))}
      </ul>
    </form>
  );
}
```

### Pergunta 9: a caixa de texto que não deixa escrever

Na página, clica-se na caixa de texto e escreve-se, mas nada aparece: a caixa fica sempre vazia. Explica porque é que isto acontece e reescreve a linha do `input` corrigida.

### Pergunta 10: a lista que não se atualiza

Depois da correção anterior, já se consegue escrever na caixa. Escreve-se "Régua 30 cm", carrega-se em "Adicionar", e a lista continua vazia no ecrã. Explica porque é que isto acontece e reescreve a função `adicionar` corrigida. Na tua versão, a caixa de texto deve ficar vazia depois de o artigo ser adicionado.

### Pergunta 11: a mensagem de lista vazia

Quando ainda não há nenhum artigo, a página deve mostrar a frase "Ainda não há artigos." em vez da lista vazia. Escreve o JSX que faz isto e indica em que sítio do componente o colocas.

## Como é avaliado

Não tem nota. O professor dá a cada parte um de quatro níveis:

- não demonstrado: a resposta ainda não mostra a ideia;
- com apoio: mostras parte da ideia;
- funcional: resolves e explicas, mesmo com pequenos erros;
- autónomo: resolves, explicas e vais além do que se pede.

A explicação pesa mais do que o resultado. "Não me lembro" fica em não demonstrado, mas é uma resposta útil, porque mostra onde está a lacuna. É com esses níveis que se organiza a revisão das aulas seguintes.

## Entrega

Entregas a folha de respostas no fim da aula. Antes de a entregares, confirma que escreveste o número de cada resposta e que deste uma explicação em todas as perguntas que a pedem. Se não souberes responder a uma pergunta, escreve o que te lembras ou "não me lembro", em vez de a deixares em branco.

![Rodapé](../imagens/rodape.png)
