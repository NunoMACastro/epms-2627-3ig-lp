![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria, ligada ao Atlas

A API da papelaria a ir buscar os artigos ao MongoDB Atlas, com o Mongoose. É usada no tema 05, Ligação segura, CRUD e regras de domínio. Parte do servidor que construíste em Sistemas de Informação, no laboratório "a API da papelaria", organizado como projeto no tema [03 Arquitetura e setup Node](../../../01-acesso-a-dados/03-arquitetura-e-setup-node.md). Dá um passo a mais: a lista dos artigos deixa de vir do array e passa a vir da base `papelaria` que criaste no [laboratório do tema 02](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas-laboratorio.md).

Só a lista mudou. A rota de detalhe ainda lê do array, com o id de 1 a 8. Passar o resto da API para a base, com o `_id` que o MongoDB dá a cada documento, é do tema da ligação segura.

## O que está nesta pasta

- `src/server.js`: o servidor, com o middleware, as rotas e o arranque, que liga primeiro à base e só depois aceita pedidos.
- `src/db/mongoose.js`: a ligação ao Atlas, com a cadeia de ligação lida do `.env`.
- `src/models/artigo.model.js`: o modelo dos artigos, a forma dos documentos da coleção `artigos`.
- `package.json` e `package-lock.json`: o projeto e as versões exatas dos pacotes, agora com o Mongoose.
- `.env.example` e `.gitignore`: a configuração sem segredos, e o que o Git ignora.

## Como correr

Precisas do Node.js 22 ou mais recente, e de internet. No Atlas, precisas da base `papelaria` como ficou no fim do laboratório do tema 02. A coleção `artigos` tem de ter os seus nove documentos: os oito artigos do início e a Cola em bastão. Precisas também do utilizador da base de dados que criaste nesse laboratório, com a sua palavra-passe, e de ter autorizado no Atlas o endereço IP do computador onde estás.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. Instala o Express e o Mongoose, e cria o `.env` a partir do exemplo:

   ```bash
   npm install
   cp .env.example .env
   ```

   No Windows, na linha de comandos clássica, o segundo comando é `copy .env.example .env`.

3. No Atlas, carrega em "Connect" (ligar) no teu cluster e escolhe a ligação por "Drivers". Copia a cadeia de ligação, que começa por `mongodb+srv://`, para a linha `MONGODB_URI=` do `.env`. Troca o marcador da palavra-passe, a parte entre `<` e `>`, pela palavra-passe do utilizador da base de dados. A partir deste momento, o `.env` tem um segredo: não o copies para mais lado nenhum.
4. Arranca a API:

   ```bash
   npm run dev
   ```

   O que deves ver: duas linhas, `Ligada à base de dados papelaria` e `API a correr em http://localhost:3000`.

5. No browser, experimenta os pedidos da tabela seguinte. Para parar, Ctrl+C.

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

Repara que a lista e o detalhe já não concordam. A lista tem nove artigos, porque vem da base, e o detalhe só conhece os oito do array, por isso diz que o artigo 9 não existe. É o que acontece quando metade de uma API lê de um sítio e a outra metade lê de outro. É por isso que, no tema da ligação segura, todas as rotas passam a ler da base.

## Problemas frequentes

### Não foi possível ligar à base de dados: falta a MONGODB_URI no ficheiro .env

O `.env` existe, mas a linha `MONGODB_URI=` está vazia: volta ao passo 3. Se o terminal disser `node: .env: not found`, é o próprio ficheiro `.env` que falta: volta ao passo 2.

### A lista vem [] e não aparece nenhum erro

A API ligou-se a uma base vazia. Na primeira linha do terminal, a API diz a que base se ligou: tem de ser `papelaria`, escrita exatamente como no Atlas. Se lá estiver outro nome, corrige o `DB_NAME` no `.env`. Se o nome estiver certo, confirma no Atlas que a coleção se chama `artigos` e que tem os documentos.

### A API fica parada uns 30 segundos e termina com um erro de ligação

O Mongoose tenta ligar-se durante 30 segundos e depois desiste, e a API termina com a razão no terminal. Com o Atlas, as causas mais comuns são duas. Uma é o endereço IP do computador onde estás não estar autorizado no Atlas, que é o que acontece quando mudas de computador ou de rede. A outra é não haver internet.

### bad auth : authentication failed

O Atlas recusou o utilizador ou a palavra-passe da cadeia de ligação. Confirma que trocaste o marcador da palavra-passe, com os `<` e `>` incluídos, e que usaste o utilizador da base de dados, e não o da tua conta no Atlas. Se a palavra-passe tiver carateres como `@`, `:` ou `/`, a cadeia de ligação fica partida. O mais simples é criar no Atlas uma palavra-passe só com letras e algarismos.

## Versões com que foi testado

Node.js 26.11.1, npm 11.20.0, Express 5.3.0 e Mongoose 9.11.1, em macOS, a 14 de outubro de 2026. A base era um MongoDB 9.0.4 instalado no próprio computador, preparada como no fim do laboratório do tema 02. Antes, a 12 de outubro, no Node.js 24.17.0, contra um MongoDB 8.2.6. Não foi testado contra o Atlas.

![Rodapé](../../../imagens/rodape.png)
