![Cabeçalho](../imagens/cabecalho.png)

# Diagnóstico inicial das bases do 11.º ano: a papelaria da escola

Este ano, nas aulas, constróis peça a peça uma aplicação. Uma parte corre num servidor e guarda os dados numa base de dados, e outra usa-se no browser. No fim do ano, nas horas da PAP, fazes a tua própria aplicação, sobre um problema que escolhes. Tudo isto usa as bases do 11.º ano, e este diagnóstico mostra quais estão firmes e quais precisas de rever. Não tem nota. As tuas respostas decidem o que fazes nas duas aulas seguintes: quem precisa de rever uma parte trabalha essa parte, e quem já a domina faz um desafio.

## A papelaria da escola

Várias perguntas usam o inventário da papelaria da escola. Cada artigo é um objeto com um identificador (`id`), o nome, a categoria, a quantidade em armazém (`stock`) e o preço em cêntimos (`precoCentimos`).

O preço é um número inteiro de cêntimos: `250` quer dizer 2,50 €. Guarda-se assim porque as contas com casas decimais nem sempre dão certo em JavaScript: `0.1 + 0.2` dá `0.30000000000000004`, e não `0.3`. Com cêntimos inteiros, as somas e as subtrações de dinheiro dão sempre o valor certo, e só se passa a euros para mostrar o preço.

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

## O que precisas de saber antes

Nada para estudar. O diagnóstico mede o que trazes do 11.º ano.

## Como está organizado

Respondes numa folha, à mão, sem computador. Escreve o teu nome e o teu número no topo da folha, e o número de cada pergunta antes da resposta. Não podes consultar apontamentos, a internet nem ferramentas de inteligência artificial. O que interessa é o que sabes agora: uma resposta copiada ou adivinhada pode fazer-te saltar a revisão de que precisas.

O diagnóstico dura 60 minutos:

| Tempo | O que fazes |
| --- | --- |
| 5 minutos | O professor explica o diagnóstico |
| 10 minutos | Parte A: terminal e npm |
| 10 minutos | Parte B: objetos e arrays |
| 10 minutos | Parte C: módulos |
| 15 minutos | Parte D: pedidos assíncronos e erros |
| 10 minutos | Parte E: React e formulários |

Os tempos servem para te orientares e não são um limite rígido. É normal não te lembrares de tudo. Se ficares preso numa pergunta, escreve o que te lembras, ou "não me lembro", que mostra onde está a lacuna. Depois avança para a seguinte; se sobrar tempo, voltas a ela. Uma resposta em branco não mostra nada, porque quem a lê não sabe se não sabias, se te faltou tempo ou se saltaste a pergunta.

Quase todas as perguntas pedem uma explicação. Escreve-a por palavras tuas, em frases completas: uma resposta certa sem explicação pode ter sido um palpite, e uma errada bem explicada mostra onde está o engano. Quando se pede código, não tens de acertar em todos os pormenores de sintaxe. Interessa que a ideia esteja certa.

## Parte A: terminal e npm (10 minutos)

Nesta parte trabalhas com um projeto chamado `inventario-web`. É um projeto React criado com Vite, do mesmo tipo dos que usaste no 11.º ano. Está numa pasta chamada `inventario-web`, dentro de uma pasta `projetos`, que está dentro da tua pasta pessoal.

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

Além do `package.json`, a pasta do projeto tem um ficheiro chamado `package-lock.json`. Não tem a pasta `node_modules`, porque o projeto foi descarregado do GitHub, e essa pasta nunca se envia para o GitHub.

### Pergunta 1: chegar à pasta do projeto

Abriste o terminal e ele está na tua pasta pessoal. Escreve os comandos que usas para entrar na pasta do projeto e para confirmares que estás no sítio certo. Explica o que faz cada um dos comandos. Podes usar os comandos do Windows, do macOS ou do Linux.

### Pergunta 2: instalar as dependências

Que comando escreves para instalar as dependências do projeto? Explica o que acontece quando o executas e para que serve o ficheiro `package-lock.json`.

### Pergunta 3: dois erros ao arrancar o projeto

Dois colegas tentaram arrancar o projeto e tiveram erros diferentes. Para cada um, explica o que correu mal, como o percebeste pela mensagem de erro e o que devia ter feito. Das mensagens, mostram-se só as linhas que interessam.

a) Uma colega escreveu `npm start` dentro da pasta do projeto e apareceu esta mensagem:

```text
npm error Missing script: "start"
```

b) Um colega escreveu `npm run dev` e apareceu esta mensagem:

```text
npm error code ENOENT
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/home/aluno/package.json'
```

## Parte B: objetos e arrays (10 minutos)

### Pergunta 4: prever o resultado de um filtro

Lê este código, que usa o array `artigos` da papelaria.

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

a) Explica o que esta mensagem de erro quer dizer. Para isso, explica a diferença entre uma exportação com nome (`export function`) e uma exportação por omissão (`export default`).

b) Corrige o programa de duas maneiras diferentes: uma em que só alteras o `app.js`, e outra em que só alteras o `precos.js`. Em cada uma, basta escreveres as linhas que mudam.

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

a) Em cada uma das situações, o `fetch` lança um erro? Explica o que acontece na função em cada uma.

b) Acrescenta à função as linhas que lançam um erro sempre que o servidor não responde ou responde com um código de erro, como o 404 ou o 500. A mensagem do erro diz o código de estado que o servidor enviou, quando ele respondeu. Basta escreveres as linhas novas e dizeres onde ficam na função.

c) Escreve o código que chama a função `carregarArtigos` e mostra os artigos na consola quando tudo corre bem. Quando acontece qualquer uma das duas situações, o código mostra uma mensagem de erro compreensível.

## Parte E: React e formulários (10 minutos)

Este componente React deveria permitir escrever o nome de um artigo numa caixa de texto e, ao carregar no botão, acrescentá-lo a uma lista mostrada por baixo. Tem dois erros, que vais descobrir nas perguntas 9 e 10.

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

Na página, clica-se na caixa de texto e escreve-se, mas nada aparece. A caixa fica sempre vazia. Explica porque é que isto acontece e reescreve a linha do `input` corrigida.

### Pergunta 10: a lista que não se atualiza

Depois da correção anterior, já se consegue escrever na caixa. Escreve-se "Régua de 30 cm", carrega-se em "Adicionar", e a lista continua vazia no ecrã. Explica porque é que isto acontece e reescreve a função `adicionar` corrigida. Na tua versão, a caixa de texto deve ficar vazia depois de o artigo ser adicionado.

### Pergunta 11: a mensagem de lista vazia

Quando ainda não há nenhum artigo, a página deve mostrar a frase "Ainda não há artigos." em vez da lista vazia. Escreve o JSX que faz isto e indica em que sítio do componente o colocas.

## Como é avaliado

O professor dá a cada parte um de quatro níveis:

- não demonstrado: a resposta ainda não mostra a ideia;
- com apoio: mostras parte da ideia;
- funcional: resolves e explicas, mesmo com pequenos erros;
- autónomo: resolves, explicas e vais além do que se pede.

A explicação pesa mais do que o resultado, e "não me lembro" fica em não demonstrado.

## Entrega

Entregas a folha de respostas no fim da aula. Antes de a entregares, confirma que escreveste o número de cada resposta e uma explicação em todas as perguntas que a pedem.

![Rodapé](../imagens/rodape.png)
