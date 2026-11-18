![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria, ligada ao Atlas

A API da papelaria a ir buscar a lista dos artigos ao MongoDB Atlas, com o Mongoose. Faz o que fizeste na aula em que ligaste ao Atlas o servidor da papelaria de Sistemas de Informação. O tema [05 Ligação segura, CRUD e regras de domínio](../../../01-acesso-a-dados/05-ligacao-segura-crud-e-regras-de-dominio.md) parte daqui: da ligação, do modelo e da primeira consulta feita pelo código.

A lista deixa de vir do array e passa a vir da base `papelaria` que criaste no [laboratório do tema 02](../../../01-acesso-a-dados/laboratorios/02-modelo-documental-e-consultas-no-atlas-laboratorio.md). Só a lista mudou: a rota de um artigo ainda lê do array, com o `id` de 1 a 8. O exemplo também não tem as camadas nem o contrato do tema 04, e por isso `/api/artigos/abaixo-do-minimo` responde 400 e o `stockMaximo` não filtra. No tema 05, é a versão com camadas que passa a ler da base, em [papelaria-api-com-crud](../papelaria-api-com-crud/README.md).

## O que está nesta pasta

- `src/server.js`: o servidor, com o middleware de registo, as rotas, o middleware final e o arranque, que liga primeiro à base e só depois aceita pedidos.
- `src/db/mongoose.js`: a ligação ao Atlas, com a cadeia de ligação lida do `.env`.
- `src/models/artigo.model.js`: o modelo dos artigos, a forma dos documentos da coleção `artigos`.
- `package.json` e `package-lock.json`: o projeto e as versões exatas dos pacotes, agora com o Mongoose.
- `.env.example` e `.gitignore`: a configuração sem segredos, e o que o Git ignora.

## Como correr

Precisas do Node.js 22 ou mais recente, e de internet. No Atlas, precisas da base `papelaria` como ficou no fim da [fase 7 do laboratório do tema 02](../../../01-acesso-a-dados/laboratorios/02-modelo-documental-e-consultas-no-atlas-laboratorio.md#fase-7-a-informação-relacionada-embute-se-ou-referencia-se). A coleção `artigos` tem de ter nove documentos: os oito artigos do início e a Cola em bastão, que essa fase acrescenta. Precisas também do utilizador da base de dados que criaste nesse laboratório, com a sua palavra-passe, e de ter autorizado no Atlas o endereço IP da rede onde estás.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. Instala o Express e o Mongoose, e cria o `.env` a partir do `.env.example`:

   ```bash
   npm install
   cp .env.example .env
   ```

   No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`.

3. No `.env`, põe na linha `MONGODB_URI=` a cadeia de ligação ao teu cluster, com a palavra-passe do utilizador da base de dados. Encontras a cadeia no Atlas como no passo 5 da [fase 2 do laboratório do tema 03](../../../01-acesso-a-dados/laboratorios/03-arquitetura-e-setup-node-laboratorio.md#fase-2-o-segredo-fica-só-no-servidor). A partir deste momento, o `.env` tem um segredo. Não o copies para mais lado nenhum.
4. Arranca a API:

   ```bash
   npm run dev
   ```

   O que deves ver: as duas linhas do npm, `Ligada à base de dados papelaria` e `API a correr em http://localhost:3000`.

5. No browser, faz os pedidos da tabela, com o separador Rede das ferramentas de programador aberto e "Disable cache" marcado, para veres o código de cada resposta. Cada pedido aparece também no terminal, escrito pelo middleware de registo. Para parar, Ctrl+C.

   | Pedido | Código | Resposta |
   | --- | --- | --- |
   | `/api/estado` | 200 | `{"estado":"ok","aplicacao":"API da papelaria"}` |
   | `/api/artigos` | 200 | Os nove artigos da base, cada um com o `_id` que o MongoDB lhe deu e a `localizacao` embutida |
   | `/api/artigos?categoria=Papel` | 200 | Os três artigos de papel, como a consulta `{ categoria: "Papel" }` na barra do Atlas |
   | `/api/artigos?categoria=papel` | 200 | `[]`, porque a base distingue maiúsculas de minúsculas |
   | `/api/artigos/2` | 200 | A esferográfica azul, ainda do array. Tem o `id` 2 e não tem `_id` nem `localizacao` |
   | `/api/artigos/9` | 404 | `{"erro":"Não existe o artigo 9"}` |
   | `/nao-existe` | 404 | `{"erro":"Rota não encontrada"}` |

   A lista e o detalhe já não concordam. A lista tem nove artigos, porque vem da base, e o detalhe só conhece os oito do array, por isso diz que o artigo 9 não existe. É o que acontece quando metade de uma API lê de um sítio e a outra metade lê de outro. Por isso, no tema 05, todas as rotas passam a ler da base.

## Se alguma coisa falhar

### A lista vem [] e não aparece nenhum erro

A API ligou-se a uma base sem artigos. Na linha `Ligada à base de dados ...`, a API diz a que base se ligou. Tem de ser `papelaria`, escrita exatamente como no Atlas. Se lá estiver outro nome, corrige o `DB_NAME` no `.env`. Se o nome estiver certo, confirma no Atlas que a coleção se chama `artigos` e que tem os nove documentos.

Os outros problemas da ligação ao Atlas estão no fim do laboratório do tema 03, que usa a mesma ligação, em [Se alguma coisa falhar](../../../01-acesso-a-dados/laboratorios/03-arquitetura-e-setup-node-laboratorio.md#se-alguma-coisa-falhar). Lá estão, por exemplo, o `.env` ou a `MONGODB_URI` em falta, a espera de 30 segundos e a palavra-passe recusada.

## Versões e compatibilidade

As versões usadas são o Node.js 26 e o npm 11. O `package-lock.json` fixa o Express 5.3.0 e o Mongoose 9.11.1.

![Rodapé](../../../imagens/rodape.png)
