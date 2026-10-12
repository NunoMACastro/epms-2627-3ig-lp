![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria, ligada ao Atlas

A API da papelaria a ir buscar os artigos ao MongoDB Atlas, com o Mongoose. Parte do servidor que construíste em Sistemas de Informação, no laboratório "a API da papelaria", organizado como projeto no tema [Arquitetura e setup Node](../../../01-acesso-a-dados/03-arquitetura-e-setup-node.md), e dá um passo a mais: a lista dos artigos deixa de vir do array e passa a vir da base `papelaria` que criaste no [laboratório do Atlas](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas-laboratorio.md).

Só a lista mudou. A rota de detalhe ainda lê do array, com o id de 1 a 8. Passar o resto da API para a base, com o `_id` que o MongoDB dá a cada documento, é do tema da ligação segura.

## O que está nesta pasta

| Ficheiro | Para que serve |
| --- | --- |
| `src/server.js` | O servidor: o middleware, as rotas e o arranque, que liga primeiro à base e só depois aceita pedidos |
| `src/db/mongoose.js` | A ligação ao Atlas, com a cadeia de ligação lida do `.env` |
| `src/models/artigo.model.js` | O modelo dos artigos: a forma dos documentos da coleção `artigos` |
| `package.json`, `package-lock.json` | O projeto e as versões exatas dos pacotes, agora com o Mongoose |
| `.env.example`, `.gitignore` | A configuração sem segredos, e o que o Git ignora |

## Antes de começar

Precisas do Node.js 22 ou 24 e de internet. No Atlas, precisas da base `papelaria` como ficou no fim do laboratório do Atlas, com a coleção `artigos` e os seus nove documentos: os oito artigos do início e a Cola em bastão. Precisas também do utilizador da base de dados que criaste nesse laboratório, com a sua palavra-passe, e de o endereço IP do computador onde estás estar autorizado no Atlas.

## Como correr

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. `npm install`. Instala o Express e o Mongoose.
3. Cria o `.env` a partir do exemplo: `cp .env.example .env` (no Windows, na linha de comandos clássica, `copy .env.example .env`).
4. No Atlas, carrega em "Connect" no teu cluster e escolhe a ligação por driver. Copia a cadeia de ligação, que começa por `mongodb+srv://`, para a linha `MONGODB_URI=` do `.env`, e troca o marcador da palavra-passe, a parte entre `<` e `>`, pela palavra-passe do utilizador da base de dados. A partir deste momento, o `.env` tem um segredo: não o copies para mais lado nenhum.
5. `npm run dev`. O terminal mostra duas linhas: `Ligada à base de dados papelaria` e `API a correr em http://localhost:3000`.
6. No browser, experimenta os pedidos da tabela seguinte.
7. Para parar, Ctrl+C.

## O que cada pedido deve responder

| Pedido | Código | Resposta |
| --- | --- | --- |
| `/api/estado` | 200 | `{"estado":"ok","aplicacao":"API da papelaria"}` |
| `/api/artigos` | 200 | Os nove artigos da base, cada um com o `_id` que o MongoDB lhe deu e a `localizacao` embutida |
| `/api/artigos?categoria=Papel` | 200 | Os três artigos de papel, como a consulta `{ categoria: "Papel" }` na barra do Atlas |
| `/api/artigos?categoria=papel` | 200 | `[]`, porque a base distingue maiúsculas de minúsculas |
| `/api/artigos/2` | 200 | A esferográfica azul, ainda do array: tem o `id` 2 e não tem `_id` nem `localizacao` |
| `/api/artigos/9` | 404 | `{"erro":"Não existe o artigo 9"}` |
| `/nao-existe` | 404 | `{"erro":"Rota não encontrada"}` |

Repara que a lista e o detalhe já não concordam. A lista tem nove artigos, porque vem da base, e o detalhe só conhece os oito do array, por isso diz que o artigo 9 não existe. É o que acontece quando metade de uma API lê de um sítio e a outra metade lê de outro, e é por isso que, no tema da ligação segura, todas as rotas passam a ler da base.

## Problemas frequentes

### Não foi possível ligar à base de dados: falta a MONGODB_URI no ficheiro .env

O `.env` existe, mas a linha `MONGODB_URI=` está vazia. Volta ao passo 4. Se o terminal disser `node: .env: not found`, é o próprio ficheiro `.env` que falta: volta ao passo 3.

### A lista vem [] e não aparece nenhum erro

A API ligou-se a uma base vazia. Na primeira linha do terminal, a API diz a que base se ligou: tem de ser `papelaria`, escrita exatamente como no Atlas. Se lá estiver outro nome, corrige o `DB_NAME` no `.env`. Se o nome estiver certo, confirma no Atlas que a coleção se chama `artigos` e que tem os documentos.

### A API fica parada uns 30 segundos e termina com um erro de ligação

O Mongoose tenta ligar-se durante 30 segundos e depois desiste, e a API termina com a razão no terminal. Com o Atlas, as causas mais comuns são o endereço IP do computador onde estás não estar autorizado no Atlas, que é o que acontece quando mudas de computador ou de rede, ou não haver internet.

### bad auth : authentication failed

O Atlas recusou o utilizador ou a palavra-passe da cadeia de ligação. Confirma que trocaste o marcador da palavra-passe, com os `<` e `>` incluídos, e que usaste o utilizador da base de dados e não o da tua conta no Atlas. Se a palavra-passe tiver carateres como `@`, `:` ou `/`, a cadeia de ligação fica partida: o mais simples é criar no Atlas uma palavra-passe só com letras e algarismos.

## Versões com que foi testado

Node.js 24.17.0, npm 11.13.0, Express 5.3.0 e Mongoose 9.11.1, em macOS, a 12 de outubro de 2026, contra um MongoDB 8.2.6 instalado no próprio computador, com a base preparada como no fim do laboratório do Atlas. Não foi testado contra o Atlas.

![Rodapé](../../../imagens/rodape.png)
