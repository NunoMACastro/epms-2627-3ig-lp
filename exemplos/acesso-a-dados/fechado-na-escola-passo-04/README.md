![Cabeçalho](../../../imagens/cabecalho.png)

# Fechado na escola, no fim do passo 4

Este é o jogo Fechado na escola como fica no fim do passo 4, o [laboratório do tema 05 Ligação segura, CRUD e regras de domínio](../../../01-acesso-a-dados/laboratorios/05-ligacao-segura-crud-e-regras-de-dominio-laboratorio.md). A API das cenas cria, altera e apaga cenas, numa base de teste, e recusa o que partiria a história. A cena do arquivo não está no seed: cria-se com os pedidos da fase 8 do laboratório. É usado no tema [05 Ligação segura, CRUD e regras de domínio](../../../01-acesso-a-dados/05-ligacao-segura-crud-e-regras-de-dominio.md).

Parte do [passo 3](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/exemplos/aplicacoes-em-browser/fechado-na-escola-passo-03/README.md), feito em Sistemas de Informação, e é o ponto de partida do [passo 5](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/01-aplicacoes-em-browser/laboratorios/05-formularios-e-validacao-laboratorio.md), em Sistemas de Informação. Se faltaste ao passo 4, ou se o teu projeto não arranca, copia esta pasta e continua daqui.

## O que está nesta pasta

- `contrato-da-api.md`: o contrato, com os sete pedidos da API, as regras de cada campo do corpo e as respostas.
- `src/server.js`: o arranque do jogo, com a leitura do corpo em JSON, os dois routers, o middleware final e o middleware de erros, que responde em JSON.
- `src/rotas/cenas.rotas.js`: que pedido da API vai para que função do controller, com o `POST`, o `PATCH` e o `DELETE`.
- `src/controllers/cenas.controller.js`: lê o corpo pela lista fechada, chama o service e escolhe o código da resposta.
- `src/services/cenas.service.js`: as regras do jogo, também as três que precisam da base. Não há duas cenas com o mesmo código, cada destino existe, e o início e as cenas de destino não se apagam.
- `src/repositories/cenas.repository.js`: o acesso às cenas na base de dados, a única camada que usa o modelo.
- `src/models/cena.model.js`: o modelo das cenas, com as regras de cada campo no schema.
- `src/db/mongoose.js`: a ligação à base de dados, que usa a base de teste quando falta o `DB_NAME`.
- `src/seed.js`: as cenas da história, que reconstroem a base de teste. Só corre numa base acabada em `-teste`.
- `src/rotas/paginas.rotas.js`, `src/controllers/paginas.controller.js` e a pasta `views/`: as páginas do jogo em EJS, como no passo 3.
- `package.json` e `package-lock.json`: o projeto e as versões exatas dos pacotes.
- `.env.example` e `.gitignore`: a configuração sem segredos, já com a base de teste, e o que o Git ignora.

## Como correr

Precisas do Node.js 22 ou mais recente, do teu cluster no Atlas e de internet. Copia esta pasta para fora do repositório e, num terminal dentro dela:

```bash
npm install
cp .env.example .env
```

No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`.

Abre o `.env` e escreve na linha `MONGODB_URI=` a cadeia de ligação do teu cluster, com a palavra-passe do utilizador da base de dados. Encontras a cadeia no Atlas como no passo 5 da [fase 2 do laboratório do passo 1](../../../01-acesso-a-dados/laboratorios/03-arquitetura-e-setup-node-laboratorio.md#fase-2-o-segredo-fica-só-no-servidor). A linha `DB_NAME=` já diz `fechado-na-escola-teste`. Depois, reconstrói a base de teste e liga o servidor:

```bash
npm run seed
npm run dev
```

O que deves ver: o seed escreve `Ligada à base de dados fechado-na-escola-teste`, uma linha com as cenas apagadas e `Inseridas 11 cenas`. O servidor escreve a mesma linha da base e `Fechado na escola em http://localhost:3000`. No browser, `http://localhost:3000/` mostra a página inicial do jogo, e `http://localhost:3000/api/cenas/inicio` a primeira cena em JSON. Os pedidos que escrevem na base fazem-se na consola do browser, numa página do jogo. O passo 2 da [fase 8 do laboratório](../../../01-acesso-a-dados/laboratorios/05-ligacao-segura-crud-e-regras-de-dominio-laboratorio.md#fase-8-cada-linha-do-contrato-verifica-se-com-um-pedido) tem o bloco das funções e das variáveis a colar, e o passo 3 os treze pedidos para conferires. Para parar, Ctrl+C.

Se alguma coisa falhar, os problemas mais comuns estão no fim do laboratório, em [Se alguma coisa falhar](../../../01-acesso-a-dados/laboratorios/05-ligacao-segura-crud-e-regras-de-dominio-laboratorio.md#se-alguma-coisa-falhar).

## Versões e compatibilidade

As versões usadas são o Node.js 26 e o npm 11. O `package-lock.json` fixa o Express 5.3.0, o Mongoose 9.11.4 e o EJS 7.0.1, como no passo 3. Não há pacotes novos: o `express.json()` vem com o Express.

![Rodapé](../../../imagens/rodape.png)
