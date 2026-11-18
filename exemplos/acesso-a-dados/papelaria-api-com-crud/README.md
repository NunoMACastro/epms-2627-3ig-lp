![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria, com o CRUD

A API da papelaria a criar, ler, alterar e apagar os artigos numa base de teste do MongoDB Atlas, com o Mongoose. Recusa os campos que não estão na lista fechada, os valores que não cumprem as regras do schema e o apagamento de um artigo que ainda tem stock. É usada no tema [05 Ligação segura, CRUD e regras de domínio](../../../01-acesso-a-dados/05-ligacao-segura-crud-e-regras-de-dominio.md): tem o código das três partes do guia, sem a venda do exemplo guiado.

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

Precisas do Node.js 22 ou mais recente e de internet. No Atlas, precisas do teu cluster, do utilizador da base de dados com a sua palavra-passe e de ter autorizado o endereço IP da rede onde estás.

1. Copia esta pasta para fora do repositório e abre um terminal dentro dela.
2. Instala o Express e o Mongoose, e cria o `.env` a partir do `.env.example`:

   ```bash
   npm install
   cp .env.example .env
   ```

   No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`.

3. No `.env`, põe na linha `MONGODB_URI=` a cadeia de ligação ao teu cluster, a que começa por `mongodb+srv://`, com a palavra-passe do utilizador da base de dados. Encontras a cadeia no Atlas como no passo 5 da [fase 2 do laboratório do tema 03](../../../01-acesso-a-dados/laboratorios/03-arquitetura-e-setup-node-laboratorio.md#fase-2-o-segredo-fica-só-no-servidor). A partir deste momento, o `.env` tem um segredo. Não o copies para mais lado nenhum. Deixa o `DB_NAME=papelaria-teste`.
4. Põe os oito artigos na base de teste, e arranca a API:

   ```bash
   npm run seed
   npm run dev
   ```

   O que deves ver: o seed escreve `Ligada à base de dados papelaria-teste`, uma linha com os artigos apagados e `Inseridos 8 artigos`. A API escreve outra vez a linha da base e, a seguir, `API a correr em http://localhost:3000`.

5. No browser, `http://localhost:3000/api/artigos` mostra os oito artigos do seed, cada um com o `_id` que o MongoDB lhe deu. Os pedidos `POST`, `PATCH` e `DELETE` fazem-se na consola das ferramentas de programador, numa página da API, como `/api/estado`. Usa a função `pedir`, que está no guia em [O corpo do pedido chega em `req.body`](../../../01-acesso-a-dados/05-ligacao-segura-crud-e-regras-de-dominio.md#o-corpo-do-pedido-chega-em-reqbody). O `contrato-da-api.md` diz o que cada pedido deve responder. Depois das experiências, o `npm run seed` põe a base como estava no início. Para parar, Ctrl+C.

O script `src/apagar-categoria.js` corre-se à parte, como o seed, com a categoria no fim do comando. Sem o `--apagar`, só mostra os artigos que o filtro escolhe; com ele, apaga-os:

```bash
node --env-file=.env src/apagar-categoria.js Desenho
node --env-file=.env src/apagar-categoria.js Desenho --apagar
```

O que cada comando escreve está no guia, em [Antes de apagar muitos, vê o que o filtro escolhe](../../../01-acesso-a-dados/05-ligacao-segura-crud-e-regras-de-dominio.md#antes-de-apagar-muitos-vê-o-que-o-filtro-escolhe). Depois de apagares, o `npm run seed` repõe os artigos.

## Versões e compatibilidade

As versões usadas são o Node.js 26 e o npm 11. O `package-lock.json` fixa o Express 5.3.0 e o Mongoose 9.11.4.

![Rodapé](../../../imagens/rodape.png)
