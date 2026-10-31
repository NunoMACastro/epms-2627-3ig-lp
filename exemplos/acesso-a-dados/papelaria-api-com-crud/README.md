![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria, com o CRUD

A API da papelaria a criar, ler, alterar e apagar os artigos numa base de teste do MongoDB Atlas, com o Mongoose. Recusa o que não cumpre o contrato. São os campos que não estão na lista fechada, os valores que não cumprem as regras do schema e o apagamento de um artigo que ainda tem stock. É o ponto em que acaba o laboratório do tema [05 Ligação segura, CRUD e regras de domínio](../../../01-acesso-a-dados/05-ligacao-segura-crud-e-regras-de-dominio.md).

A versão anterior, com o contrato e as camadas e os artigos ainda num array, está em [papelaria-api-com-camadas](../papelaria-api-com-camadas/README.md).

## O que está nesta pasta

- `contrato-da-api.md`: o contrato, com os sete pedidos e as regras de cada campo de um artigo.
- `src/server.js`: o arranque, com o `express.json()`, a montagem das rotas, o middleware final e o middleware de erros, e a ligação à base antes de aceitar pedidos.
- `src/db/mongoose.js`: a ligação ao Atlas, com a cadeia de ligação lida do `.env`.
- `src/models/artigo.model.js`: o modelo dos artigos, com as regras de cada campo.
- `src/repositories/artigos.repository.js`: o acesso aos artigos na base de dados.
- `src/services/artigos.service.js`: as regras da papelaria, incluindo a de só apagar um artigo sem stock.
- `src/controllers/artigos.controller.js`: lê e verifica o pedido, com a lista fechada dos campos e a forma do `_id`, chama o service e responde.
- `src/rotas/artigos.rotas.js`: que pedido vai para que função do controller.
- `src/seed.js`: reconstrói a base de teste com os oito artigos, e só corre numa base cujo nome acabe em `-teste`.
- `src/apagar-categoria.js`: apaga os artigos de uma categoria da base de teste, mostrando antes o que vai apagar.
- `package.json` e `package-lock.json`: o projeto e as versões exatas dos pacotes.
- `.env.example` e `.gitignore`: a configuração sem segredos, e o que o Git ignora.

## Como correr

Precisas do Node.js 22 ou mais recente e de internet. No Atlas, precisas do teu cluster, do utilizador da base de dados com a sua palavra-passe e do endereço IP do computador onde estás autorizado.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. Instala o Express e o Mongoose, e cria o `.env` a partir do exemplo:

   ```bash
   npm install
   cp .env.example .env
   ```

   No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`.

3. No `.env`, põe na linha `MONGODB_URI=` a cadeia de ligação ao teu cluster, a que começa por `mongodb+srv://`, com a palavra-passe do utilizador da base de dados. No Atlas, encontra-se em "Connect" (ligar), na ligação por "Drivers". A partir deste momento, o `.env` tem um segredo. Não o copies para mais lado nenhum. Deixa o `DB_NAME=papelaria-teste`.
4. Põe os oito artigos na base de teste, e arranca a API:

   ```bash
   npm run seed
   npm run dev
   ```

   O que deves ver: o seed escreve `Ligada à base de dados papelaria-teste` e `Inseridos 8 artigos`; a API escreve outra vez a linha da base e, a seguir, `API a correr em http://localhost:3000`.

5. No browser, abre `/api/artigos`. Os pedidos com corpo, como o `POST`, o `PATCH` e o `DELETE`, fazem-se na consola das ferramentas de programador, com a função `pedir` da fase 5 do laboratório. A tabela da fase 10 do laboratório diz o que cada pedido deve responder. Para parar, Ctrl+C.

A base `papelaria`, a do laboratório do Atlas, não é usada. Se o `DB_NAME` disser `papelaria`, o seed recusa-se a correr.

## Versões e compatibilidade

Node.js 26.11.1, npm 11.20.0, Express 5.3.0 e Mongoose 9.11.4. O Mongoose 9 marca a opção `new: true` como obsoleta, e a API usa o `returnDocument: "after"`, que a substitui.

![Rodapé](../../../imagens/rodape.png)
