![Cabeçalho](../imagens/cabecalho.png)

# Laboratório: o esqueleto da API da papelaria

Laboratório do terceiro tema de Acesso a dados. Duas aulas de 60 minutos. Começas por desenhar o servidor que vais construir ao longo do módulo e depois preparas, no teu computador, o projeto da API da papelaria: a pasta, os scripts, a configuração num `.env`, o `.gitignore` e o primeiro commit. No fim, traças um pedido do browser até à API e de volta.

Cada passo diz o que fazer e o que deves ver. As ideias estão explicadas no [guia do tema](03-arquitetura-e-setup-node.md), e cada parte diz em que secção. Quando o que vês não bater certo com o que está escrito, para e tenta perceber porquê antes de avançar: a maior parte destas partes tem um erro de propósito, para o veres acontecer num sítio controlado.

Se, em Sistemas de Informação, fizeste o laboratório "a API da papelaria", não crias um projeto novo: continuas a pasta que lá criaste. Lê primeiro a secção [Se já tens a API da papelaria de Sistemas de Informação](#se-já-tens-a-api-da-papelaria-de-sistemas-de-informação), que diz o que muda nas partes 2 a 7.

## Antes de começar

Precisas de:

- o Node.js, versão 22 ou 24 (`node --version`);
- o Git (`git --version` deve mostrar uma versão; se disser que o comando não existe, chama o professor);
- um editor de código, como o Visual Studio Code, e um terminal;
- internet, para o `npm install`;
- o browser com as ferramentas de programador.

Ao longo do laboratório, regista no caderno, ou num ficheiro de texto fora do projeto, os comandos que corres e o que aconteceu. No fim vais precisar desse registo, do diagrama da parte 1 e da tabela da parte 7.

## Se já tens a API da papelaria de Sistemas de Informação

Em Sistemas de Informação, no laboratório "a API da papelaria", criaste uma pasta `papelaria-api` com o `package.json`, o Express instalado e um `server.js` com os oito artigos, a rota da lista com o filtro por categoria, a rota de detalhe, o middleware de registo e o middleware final. É o servidor de um só ficheiro de que fala a secção "O que já fizeste e o que muda agora" do guia. Este laboratório transforma-o num projeto, sem lhe mudar nenhuma resposta.

A parte 1 faz-se como está, em papel. As partes 2 e 3 fazem-se pelos passos desta secção, em vez dos que estão nelas, porque o projeto já existe. As partes 4 a 7 fazem-se como estão, com as diferenças que esta secção indica no fim.

### Parte 2, no teu projeto: a pasta src e os scripts

Guia: secções "A estrutura de pastas" e "Os scripts do package.json".

1. Abre no editor a pasta `papelaria-api` de Sistemas de Informação. Confirma que tem o `package.json`, o `package-lock.json`, a pasta `node_modules` e o `server.js`. Se a trouxeste de outro computador sem a `node_modules`, corre `npm install` dentro da pasta: o npm lê o `package.json` e volta a instalar o Express.
2. Cria a pasta `src` na raiz do projeto, ao lado do `package.json`, e muda o `server.js` para dentro dela. No Visual Studio Code, basta arrastá-lo para a pasta `src`. A partir daqui, o código vive em `src`, e a configuração e os ficheiros do npm ficam na raiz, como na secção "A estrutura de pastas" do guia.
3. No `package.json`, o `"type"` já está em `module`, desde Sistemas de Informação. Substitui a secção `"scripts"`, que tem o `"test"`, pela mesma do passo 2 da parte 2:

   ```json
   {
     "scripts": {
       "start": "node src/server.js",
       "dev": "node --watch --env-file=.env src/server.js"
     }
   }
   ```

   (Copias só a parte de dentro das chavetas de fora, a partir de `"scripts"`, e a vírgula no fim da secção mantém-se.)

4. Guarda e, no terminal, escreve `npm run`, sem mais nada.

O que deves ver: a lista dos scripts, com o `start` e o `dev`, como na parte 2. Se o npm se queixar do JSON (`EJSONPARSE`), há uma vírgula ou uma aspa a mais ou a menos: a mensagem diz a linha e a coluna.

Pergunta para o caderno: em Sistemas de Informação arrancavas o servidor com `node --watch server.js`. Se agora escreveres esse mesmo comando na raiz do projeto, o que acontece, e porquê?

### Parte 3, no teu projeto: a porta e a rota de estado

Guia: secção "Exemplo guiado", passo 4.

1. Abre o `src/server.js`. A porta está escrita no código, na linha `const PORTA = 3000;`. Substitui essa linha pelas três do passo 4 do exemplo guiado: os dois comentários e `const PORTA = process.env.PORT || 3000;`. O resto do ficheiro fica como estava.
2. Acrescenta a rota de estado do passo 4, `GET /api/estado`, logo a seguir ao middleware de registo e antes das rotas dos artigos. Antes de a escreveres, responde no caderno: o que aconteceria se a escrevesses no fim do ficheiro, depois do middleware final? A resposta está na ordem da fila do middleware, que viste em Sistemas de Informação.
3. Arranca a API com o script `start`:

   ```text
   npm start
   ```

   O terminal mostra as duas linhas do npm (`> papelaria-api@1.0.0 start` e o comando) e depois `API a correr em http://localhost:3000`.

4. No browser, abre `http://localhost:3000/api/estado` e depois `http://localhost:3000/api/artigos?categoria=Papel`. Deves ver o objeto com `"estado": "ok"` e, a seguir, os três artigos da categoria Papel, como em Sistemas de Informação. No terminal, o middleware de registo escreve uma linha por pedido.
5. Para a API com Ctrl+C.

Pergunta para o caderno: não há nenhum ficheiro `.env`, e a API arrancou na porta 3000. De onde veio o 3000?

### As partes 4 a 7 no teu projeto

- **Partes 4 e 5:** fazem-se como estão. No terminal aparecem também as linhas do middleware de registo, uma por pedido.
- **Parte 6:** faz-se como está. No passo 6, a mensagem do commit diz o que o teu projeto tem: por exemplo, `API da papelaria organizada como projeto, com a rota /api/estado`.
- **Parte 7:** os passos 1 a 4 fazem-se como estão. O passo 5 muda, porque no teu projeto a rota `/api/artigos` já existe. Em vez dele, abre `http://localhost:3000/api/artigos/abc`, regista o código e a mensagem, e escreve, numa frase, que linha do `src/server.js` escolheu esse código.

## Parte 1: o diagrama de camadas

Guia: secções "A tua aplicação tem três partes" e "As camadas dentro do servidor". Faz-se em papel, antes de abrir o computador.

1. Desenha as três partes da aplicação da papelaria (React, API e MongoDB Atlas). Em cada seta, escreve o que viaja: "HTTP com JSON" ou "driver do MongoDB". Assinala com um círculo o único sítio onde a cadeia de ligação ao Atlas existe.
2. Desenha as quatro camadas da API para o pedido `GET /api/artigos?stockMaximo=5`, como no guia, e escreve ao lado de cada uma o que faz neste pedido.
3. Agora, um pedido que o guia não tem: `GET /api/artigos/valor-do-stock`. A interface quer mostrar quanto vale, em dinheiro, tudo o que a papelaria tem em loja: para cada artigo, o stock vezes o preço, e no fim a soma de todos. Desenha as mesmas quatro camadas para este pedido e responde, ao lado do desenho:
   - Em que camada se faz a conta? O que é que a camada de baixo lhe entrega para a poder fazer?
   - Os preços estão guardados em cêntimos. A API responde com o valor em cêntimos ou em euros? E, se o ecrã tiver de mostrar o valor escrito como "80,65 €", em que parte da aplicação se faz essa transformação: na API ou no React?
   - Se a papelaria ainda não tiver nenhum artigo, que código e que valor deve ter a resposta? Que camada chega a esse valor, e que camada escolhe o código?
   - Este pedido não tem parâmetros. Há algum caso em que deva responder 400? Porquê?

Mostra o desenho ao professor antes de passares à parte 2. É uma das duas coisas que este tema te pede para entregar.

## Parte 2: a pasta e o package.json

Guia: secções "Preparar um projeto Node" e "Os scripts do package.json".

1. Na tua pasta de trabalho de Linguagens de Programação (não dentro do repositório dos materiais), cria o projeto e instala o Express:

   ```text
   mkdir papelaria-api
   cd papelaria-api
   npm init -y
   npm install express
   mkdir src
   ```

2. Abre a pasta `papelaria-api` no editor. No `package.json`:
   - na linha do `"type"`, muda só a palavra `commonjs` para `module`;
   - substitui a secção `"scripts"`, que tem o `"test"`, por esta:

     ```json
     {
       "scripts": {
         "start": "node src/server.js",
         "dev": "node --watch --env-file=.env src/server.js"
       }
     }
     ```

     (Copias só a parte de dentro das chavetas de fora, a partir de `"scripts"`. A vírgula no fim da secção mantém-se, porque há outras secções a seguir.)

3. Guarda e, no terminal, escreve `npm run`, sem mais nada.

O que deves ver: a lista dos scripts do projeto. O `start` aparece numa parte da lista e o `dev` noutra, com o comando de cada um por baixo. Se o npm se queixar do JSON (`EJSONPARSE`), há uma vírgula ou uma aspa a mais ou a menos no `package.json`: a mensagem diz a linha e a coluna.

## Parte 3: o servidor e o primeiro arranque

Guia: secção "Exemplo guiado", passo 4.

1. Cria o ficheiro `src/server.js`, dentro da pasta `src`, com o código do passo 4 do exemplo guiado. Escreve-o em vez de o copiar, e lê cada linha.
2. Arranca a API com o script `start`:

   ```text
   npm start
   ```

   O terminal mostra as duas linhas do npm (`> papelaria-api@1.0.0 start` e o comando) e depois `API a correr em http://localhost:3000`.

3. No browser, abre `http://localhost:3000/api/estado`. Deves ver o objeto com `"estado": "ok"`.
4. Para a API com Ctrl+C.

Pergunta para o caderno: não há nenhum ficheiro `.env`, e a API arrancou na porta 3000. De onde veio o 3000?

## Parte 4: a configuração no .env

Guia: secção "Configuração fora do código: o .env".

1. Tenta arrancar com o script de desenvolvimento:

   ```text
   npm run dev
   ```

   Prevê antes: o que vai acontecer? Depois executa. O terminal mostra `node: .env: not found` e a API não arranca.

2. Na raiz do projeto (ao lado do `package.json`, e não dentro de `src`), cria o ficheiro `.env.example` com o conteúdo da secção "O ficheiro .env.example" do guia. Cria-o no editor de código: no Windows, o Bloco de Notas pode acrescentar `.txt` ao nome sem o mostrar.
3. Cria o `.env` como cópia do `.env.example`:

   ```text
   cp .env.example .env
   ```

   No Windows, na linha de comandos clássica: `copy .env.example .env`. Também podes criar o ficheiro no editor e copiar o conteúdo.

4. Volta a correr `npm run dev`. Agora a API arranca na porta 3000.
5. Abre o `.env` e o `.env.example` lado a lado no editor. Neste momento são iguais. Escreve no caderno o que vai ser diferente entre os dois quando chegares ao tema da ligação segura.

## Parte 5: mudar a configuração sem mexer no código

Guia: exemplo guiado, passo 6, e "Erros frequentes".

1. Com a API ligada pelo `npm run dev`, abre o `.env`, muda `PORT=3000` para `PORT=3001` e guarda.
2. Olha para o terminal. Aparece `Restarting 'src/server.js'` e depois `API a correr em http://localhost:3001`. O `--watch` viu a mudança e reiniciou a API.
3. No browser, `http://localhost:3000/api/estado` dá agora "ligação recusada", e `http://localhost:3001/api/estado` responde.
4. Agora um erro de propósito. No `.env`, muda o nome da variável de `PORT` para `PORTA` (fica `PORTA=3001`) e guarda.
5. Prevê: em que porta fica a API? Depois olha para o terminal.

O que deves ver: a API reinicia na porta 3000. O código lê `process.env.PORT`, e essa variável deixou de existir: a `PORTA` é outra variável, que ninguém lê. Sem `PORT`, o `||` usou o 3000. Não houve mensagem de erro nenhuma, e é isso que torna este engano difícil de encontrar.

6. Repõe `PORT=3000` no `.env`, guarda e confirma que a API volta a responder em `http://localhost:3000/api/estado`.

## Parte 6: guardar no Git sem guardar segredos

Guia: secções "O que vai para o Git: o .gitignore" e "O mínimo de Git".

Nesta parte vais ver o `.env` a aparecer na lista do Git antes de existir o `.gitignore`. É de propósito. Segue os passos pela ordem e não faças `git add` antes do passo 5.

1. Para a API com Ctrl+C. Na pasta `papelaria-api`, começa o histórico:

   ```text
   git init
   ```

   O Git responde `Initialized empty Git repository in` seguido do caminho da pasta, e pode escrever antes umas linhas de sugestão (`hint`) sobre o nome do ramo principal. Podes ignorá-las.

2. Vê o estado:

   ```text
   git status --short
   ```

   O que deves ver: uma lista com `??` à frente de cada nome, onde aparecem o `.env` e a `node_modules/`. Se fizesses agora `git add .`, o teu `.env` ia para o histórico. Não faças.

3. Na raiz do projeto, cria o ficheiro `.gitignore` com o conteúdo da secção "O que vai para o Git" do guia, e guarda.
4. Volta a correr `git status --short`.

   O que deves ver: a lista tem agora o `.env.example`, o `.gitignore`, o `package-lock.json`, o `package.json` e `src/`. O `.env` e a `node_modules/` desapareceram. Se algum dos dois ainda aparecer, para: confirma o nome do ficheiro `.gitignore` (sem `.txt`) e a pasta onde está.

5. Diz ao Git quem és, só neste projeto:

   ```text
   git config user.name "O teu nome"
   git config user.email "o teu email da escola"
   ```

6. Guarda o primeiro commit e confirma-o:

   ```text
   git add .
   git commit -m "Esqueleto da API da papelaria, com a rota /api/estado"
   git log --oneline
   ```

   O `git log` mostra um commit, com um código curto à frente da mensagem.

7. Corre outra vez `git status`. O Git diz que não há nada para guardar: tudo o que devia estar no histórico está lá, e o `.env` continua fora.

Pergunta para o caderno: um colega fez o `git add .` antes de criar o `.gitignore`, e o `.env` foi no primeiro commit. Basta-lhe acrescentar o `.env` ao `.gitignore` agora? Porquê?

## Parte 7: traçar o pedido

Guia: secção "Traçar um pedido".

1. Liga a API com `npm run dev` e abre no browser as ferramentas de programador, no separador Rede.
2. Abre `http://localhost:3000/api/estado`.
3. Clica no pedido `estado` e regista no caderno: o método, o endereço completo, o código de estado, o `content-type` da resposta e o Remote Address, que é o endereço do computador que respondeu (o teu, que pode aparecer como `127.0.0.1` ou `[::1]`, seguido de `:3000`).
4. Copia para o caderno a tabela dos cinco passos do guia para este pedido e, em cada linha, acrescenta o que observaste que o confirma. Por exemplo, no passo 3, que linha do `server.js` foi executada; no passo 4, o código e o tipo que viste no separador Rede.
5. Abre também `http://localhost:3000/api/artigos`. Regista o código e explica, numa frase, porque é que esta rota ainda não existe e quando vai existir.

A tabela desta parte é a evidência do tema: vais explicá-la ao professor, passo a passo, sem a ler.

## Parte 8 (opcional): o esqueleto da tua aplicação

Se já tens uma ideia para a tua aplicação, repete as partes 2 a 6 numa pasta nova, com o nome da tua aplicação seguido de `-api` (por exemplo `biblioteca-api`), e muda o texto da rota de estado para o nome da tua aplicação. Faz também o diagrama de camadas da parte 1 para o pedido mais importante da tua aplicação. Vais reaproveitar os dois no projeto final.

## Problemas frequentes no laboratório

### O npm não corre na PowerShell do Windows

Aparece uma mensagem a dizer que o ficheiro `npm.ps1` não pode ser carregado porque a execução de scripts está desativada. Não mudes a regra do Windows: usa a linha de comandos clássica (cmd), ou escreve `npm.cmd` em vez de `npm`.

### O ficheiro ficou com .txt no fim

No Windows, `.env.txt` ou `.gitignore.txt`. O Node não encontra o `.env`, e o Git não lê o `.gitignore`. Muda o nome no editor de código, que mostra o nome completo.

### cp não é reconhecido como comando

Estás na linha de comandos clássica do Windows: usa `copy .env.example .env`. Na PowerShell, o `cp` funciona.

### O .env está dentro da pasta src

O `--env-file=.env` procura o ficheiro na pasta onde corres o `npm run dev`, que é a raiz do projeto. O `.env`, o `.env.example` e o `.gitignore` ficam todos ao lado do `package.json`.

### fatal: not a git repository

Correste um comando do Git fora da pasta do projeto, ou antes do `git init`. Confirma em que pasta estás e entra na `papelaria-api`.

### Please tell me who you are

O Git recusou o commit porque não sabe o teu nome. Faz o passo 5 da parte 6 e repete o commit.

### O .env foi para um commit

Não tentes resolver sozinho: chama o professor. Neste laboratório o `.env` ainda não tem segredos, por isso não há dano, mas é o momento certo para aprender como se corrige.

### A porta 3000 está ocupada

Tens outro servidor ligado, por exemplo o catálogo de equipamentos de Sistemas de Informação. Para-o, ou muda a porta da API no `.env`: é para isso que ela lá está.

## O que fica no teu caderno

1. O diagrama de três partes e os dois diagramas de camadas da parte 1, com as respostas sobre o valor do stock.
2. O registo dos comandos das partes 2 a 6 e do que aconteceu, incluindo os dois erros provocados: o `.env` em falta e a variável com o nome errado.
3. As respostas às perguntas das partes 3 e 6.
4. A tabela do pedido da parte 7, com as observações.

Mostra também ao professor o resultado do `git log --oneline` e do `git status`: são a prova de que o projeto está guardado e de que o `.env` ficou de fora.

![Rodapé](../imagens/rodape.png)
