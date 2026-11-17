![Cabeçalho](../imagens/cabecalho.png)

# Arquitetura e setup Node

Neste guia vês como se organiza uma aplicação com três partes: o React, a API e o MongoDB Atlas. Vês porque é que só o servidor fala com a base de dados, e as quatro camadas em que ele se divide. Depois preparas o projeto do servidor (em inglês, o setup): a pasta, os scripts, a configuração num `.env` e o Git, sem deixar sair a palavra-passe da base de dados.

Usa o que viste em Sistemas de Informação sobre a base de dados e o primeiro servidor Express, e o `fetch` do React do 11.º ano. Rever: [O browser não fala com a base de dados](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/01-aplicacoes-em-browser/01-do-pedido-a-resposta.md#o-browser-não-fala-com-a-base-de-dados), [O npm e o ficheiro package.json](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/01-aplicacoes-em-browser/02-primeiro-servidor.md#o-npm-e-o-ficheiro-packagejson) e [Buscar dados com fetch](https://github.com/NunoMACastro/edu-docs-2ig-js-guias-2526/blob/8cf6ade3cf3d4508ea0fb4fbc5b2bedb29869a8f/React/08_useEffect_e_dados.md#4-essencial-buscar-dados-com-fetch). Para praticar: [laboratório](laboratorios/03-arquitetura-e-setup-node-laboratorio.md) e [ficha de exercícios](exercicios/03-arquitetura-e-setup-node-exercicios.md).

## Neste guia

1. [Parte 1: Do browser à base de dados, por camadas](#parte-1-do-browser-à-base-de-dados-por-camadas)
2. [Parte 2: Preparar o projeto do servidor](#parte-2-preparar-o-projeto-do-servidor)
3. [Exemplo guiado: o esqueleto da API da papelaria](#exemplo-guiado-o-esqueleto-da-api-da-papelaria)

## Parte 1: Do browser à base de dados, por camadas

No tema anterior, fizeste perguntas à base de dados da papelaria no Atlas, pelo browser. Os utilizadores de uma aplicação não abrem o Atlas. Abrem a aplicação, e é ela que fala com a base de dados por eles.

### A tua aplicação tem três partes

A aplicação que vais construir este ano tem três partes, e cada uma corre num sítio diferente.

O cliente, como em Sistemas de Informação, é o programa que faz os pedidos. Aqui é a interface em React, que corre no browser de quem usa a aplicação. Mostra os dados, recebe os cliques e o que se escreve nos formulários e, quando precisa de dados, pede-os com `fetch`.

A API é um servidor em Node.js com Express. É a mesma palavra que usaste no 11.º ano com o `fetch`: o conjunto de pedidos que um servidor aceita, cada um com a sua resposta. A sigla vem do inglês e quer dizer interface de programação de aplicações, porque é por ela que outros programas, como o teu React, usam o servidor. A API recebe os pedidos do React, aplica as regras da aplicação, fala com a base de dados e responde com dados em JSON. Corre num computador servidor e, enquanto desenvolves, no teu.

A base de dados é o MongoDB Atlas, que já conheces. Corre nos servidores da MongoDB, na internet, guarda os documentos e responde às consultas da API. É ela que dá à aplicação **persistência**: os dados sobrevivem ao fecho do browser, ao reinício do servidor e à troca de computador. O estado do React desaparece quando se fecha o separador, e um array na memória do servidor desaparece quando o servidor para, como viste em Sistemas de Informação.

```mermaid
flowchart LR
    R["React<br/>no browser<br/>mostra e pede"] <-->|HTTP, com JSON| A["API em Node e Express<br/>no servidor<br/>regras e acesso aos dados"]
    A <-->|Mongoose| M["MongoDB Atlas<br/>na internet<br/>base papelaria"]
```

O diagrama mostra as três partes e as duas conversas. Entre o React e a API, a conversa é em HTTP, com JSON no corpo: o React pede `GET /api/artigos` e recebe a lista dos artigos em JSON. Entre a API e o Atlas, a conversa não é em HTTP. Faz-se com o Mongoose, o pacote do npm que já usaste no cinema da escola, que liga a API ao MongoDB por uma ligação própria. Para se ligar, o Mongoose precisa de um endereço com o utilizador e a palavra-passe da base de dados. Entre o React e o Atlas não há conversa nenhuma.

### A API responde com dados, e não com páginas

Nos primeiros temas de Sistemas de Informação, o servidor também respondeu em JSON, só para se verem os dados. Depois passou a gerar as páginas com o EJS, que junta os dados a um modelo de página. Nesse caso, o servidor recebe o pedido, vai buscar os dados e responde com o HTML pronto a mostrar, e o browser só desenha o que recebe. Aqui, o mesmo Express responde com dados, em JSON, e é o React, dentro do browser, que constrói a página a partir deles.

| | Sistemas de Informação | Linguagens de Programação |
| --- | --- | --- |
| Quem constrói a página | O servidor, que junta os dados ao HTML com o EJS | O React, no browser |
| O que a resposta traz | HTML | Dados em JSON |
| A base de dados | MariaDB, com SQL | MongoDB Atlas, com o Mongoose |
| O que o browser faz | Mostra o HTML recebido | Corre o React, que pede os dados e desenha |

As duas formas usam-se no mundo real, com o mesmo Express. Saber em qual estás diz-te o que uma rota deve devolver: numa, uma página; na outra, dados.

### O segredo fica só no servidor

Parece mais simples o React pedir os dados diretamente ao Atlas, com uma peça a menos. Em Sistemas de Informação, viste porque é que o browser não fala com a base de dados, pela palavra-passe e pelas regras. Na tua aplicação, a tentação é maior, porque é no browser que corre o código do React, que pede os dados.

Para se ligar ao Atlas, um programa precisa da **cadeia de ligação**. É um endereço que começa por `mongodb+srv://` e leva lá dentro o utilizador e a palavra-passe da base de dados. Quem a tiver pode ler, alterar e apagar a base inteira. Ora, o código do React é descarregado para o browser de cada utilizador, e quem quiser abre as ferramentas de programador e lê-o. Uma palavra-passe escrita no código do React deixa de ser secreta no momento em que alguém abre a aplicação.

A cadeia de ligação é um **segredo**: um valor que dá acesso a alguma coisa, e que por isso só pode estar onde o utilizador não chega. O segredo fica só no servidor, e o browser nunca o recebe.

### As regras ficam no servidor, para todos os clientes

A outra razão que viste em Sistemas de Informação são as regras. Imagina a regra "não se vendem mais cadernos do que os que há em stock" só no React. Quem quiser contorna-a, porque pode enviar um pedido sem passar pelo formulário. O React pode avisar antes de enviar, mas só o servidor garante a regra.

Com as regras no servidor, há um só sítio para vários clientes. Hoje, o cliente é a tua interface em React. Amanhã, pode ser uma aplicação de telemóvel ou um programa que gera relatórios. Todos usam a mesma API, com as mesmas regras, sem cada um as repetir.

### Um pedido vai do browser à base de dados e volta

Explicar um pedido é dizer, por ordem, quem faz o quê, onde corre e o que viaja, desde que o pedido sai do browser até a resposta lá chegar. É o que este tema te pede para saberes fazer.

Na papelaria, o React quer mostrar os artigos com pouco stock, até 5 unidades. O pedido faz este caminho:

```mermaid
sequenceDiagram
    participant R as React, no browser
    participant A as API, no servidor
    participant M as MongoDB Atlas
    Note over A: só a API conhece a cadeia de ligação
    A->>M: liga-se uma vez, quando arranca
    R->>A: GET /api/artigos?stockMaximo=5
    A->>M: a consulta dos artigos com stock até 5, pelo Mongoose
    M-->>A: os documentos que cumprem o filtro
    A-->>R: 200, com a lista em JSON
    R->>R: guarda a lista no estado e desenha-a
```

Pela ordem, o componente React faz o `fetch` de `/api/artigos?stockMaximo=5` e espera pela resposta com `await`. A API recebe o pedido e pede ao Atlas, através do Mongoose, os artigos da coleção `artigos` com o stock até 5. Usa a ligação que abriu quando arrancou, com a cadeia de ligação que só ela conhece. O Atlas devolve os documentos, e a API responde 200, com a lista em JSON. O React guarda a lista no estado do componente e desenha-a.

A cadeia de ligação só é usada no arranque, na seta da ligação ao Atlas, dentro do servidor. Não viaja em nenhuma seta entre o React e a API: o browser fala só com a API, e nunca com o Atlas.

### O servidor divide-se em quatro camadas

Em Sistemas de Informação, o primeiro servidor tinha tudo num ficheiro: os dados, as rotas e o que cada rota fazia. Para duas rotas, está certo. Uma API a sério tem dezenas de rotas. Cada uma faz várias coisas: lê o pedido, verifica se os dados fazem sentido, aplica as regras, fala com a base de dados e escolhe a resposta. Com tudo junto, dentro de cada rota, o ficheiro cresce até ninguém o conseguir ler. A mesma regra aparece copiada em três rotas, e uma mudança na base de dados obriga a mexer em todas.

A solução é dividir o servidor em **camadas**: partes com uma só tarefa cada uma, por onde o pedido passa sempre pela mesma ordem. A API deste ano tem quatro.

```mermaid
flowchart TD
    P([pedido HTTP]) --> RO[rotas]
    RO --> C[controller]
    C --> S[service]
    S --> RE[repository]
    RE --> M[(MongoDB Atlas)]
```

O pedido entra pelas rotas e desce camada a camada até ao repository, o único que chega ao Atlas. A resposta sobe pelo mesmo caminho até ao controller, que a envia.

| Camada | O que faz | O que não faz |
| --- | --- | --- |
| Rotas | Dizem que método e que caminho vão para que função do controller | Não tratam o pedido, só o encaminham |
| Controller (controlador) | Lê do pedido o que interessa, converte o que chega como texto, chama o service, escolhe o código de estado e responde em JSON | Não sabe as regras da aplicação nem fala com a base de dados |
| Service (serviço) | Aplica as regras da aplicação, com valores de JavaScript: números, textos, objetos e listas | Não usa `req` nem `res` |
| Repository (repositório) | Escreve as consultas com o Mongoose, como o `find`, que procura documentos com um filtro | Não aplica regras nem escolhe respostas |

As rotas são o índice da API: quem quiser saber que pedidos a API aceita, lê as rotas. O service tem regras como "o stock não pode ficar negativo" ou "um artigo com o stock abaixo do seu stock mínimo tem de ser encomendado". Como não sabe o que é um pedido HTTP, experimenta-se sozinho, chamando as suas funções com o `node`, sem browser e sem servidor ligado. Não é a pasta `services` do React do 11.º ano, que fazia os pedidos com `fetch`. O repository sabe o nome da coleção, e mais nenhuma camada sabe que a base de dados é o MongoDB.

Os nomes estão em inglês porque são os que vais escrever nos nomes das pastas e dos ficheiros, como `src/controllers/artigos.controller.js`, e os que encontras na documentação. Cada camada é um ficheiro com algumas funções simples, para cada coleção da API. Para os artigos, há um ficheiro de rotas, um controller, um service e um repository. Não precisas de classes, de pacotes especiais nem de mais camadas do que estas quatro.

O erro típico, quando o projeto ainda é pequeno, é escrever a regra e a consulta dentro da função da rota. Funciona, mas a mesma regra acaba copiada em várias rotas. Quando escreveres as camadas, pergunta em cada linha: isto é HTTP, regra ou base de dados?

### Um pedido atravessa as camadas sempre pela mesma ordem

Dentro da API, o pedido dos artigos com pouco stock, `GET /api/artigos?stockMaximo=5`, passa pelas quatro camadas assim:

| Camada | O que faz neste pedido |
| --- | --- |
| Rotas | Veem que é `GET /api/artigos` e passam o pedido à função do controller que lista artigos |
| Controller | Lê o `stockMaximo` dos parâmetros de pesquisa, que chega como texto, `"5"`, e converte-o no número 5. Se vier e não for um número válido, responde 400, e o pedido acaba aqui. Se for válido, ou se não vier, chama o service |
| Service | Pede ao repository os artigos com stock até ao limite. Se não viesse limite nenhum, pedia todos |
| Repository | Executa no Atlas a consulta `{ stock: { $lte: 5 } }` na coleção `artigos` e devolve os documentos encontrados |
| Service | Devolve a lista ao controller |
| Controller | Responde 200, com a lista em JSON |

O `"5"` chega como texto, como em Sistemas de Informação, e a consulta é a do tema anterior, com o `$lte`, menor ou igual. Rever: [Tudo chega como texto](https://github.com/NunoMACastro/epms-2627-3ig-si/blob/main/01-aplicacoes-em-browser/03-http-rotas-e-middleware.md#tudo-chega-como-texto) e [Um operador compara um campo com um valor](02-modelo-documental-e-consultas-no-atlas.md#um-operador-compara-um-campo-com-um-valor). O limite é um máximo, e por isso um artigo com exatamente 5 unidades aparece.

Com as camadas, cada mudança tem um sítio. Se a papelaria decidir encomendar um artigo quando o stock chega ao mínimo, e não só quando fica abaixo, muda-se uma linha no service. Se trocar o MongoDB por outra base de dados, muda-se o repository, e as rotas, os controllers e os services ficam iguais.

As camadas são também um mapa para procurar erros. Um código 200 onde devia vir 404 está no controller. Um resultado errado da regra está no service. Uma consulta que não encontra nada leva-te primeiro ao repository.

## Parte 2: Preparar o projeto do servidor

Em Sistemas de Informação, preparaste a pasta de um servidor com o mínimo: `npm init -y`, a troca do `"type"`, `npm install express` e um `server.js` ao lado do `package.json`. Um projeto que vai crescer durante o ano, e que vais entregar e instalar noutro computador, precisa de mais quatro coisas. São uma pasta para o código, os scripts, a configuração fora do código e o Git. O Git é o programa que guarda o histórico do projeto e o pode enviar para o GitHub.

### O código fica na pasta src

O esqueleto da API da papelaria fica assim:

```text
papelaria-api/
├── .env                 a configuração deste computador; nunca vai para o Git
├── .env.example         os nomes da configuração, sem segredos; vai para o Git
├── .gitignore           o que o Git deve ignorar
├── package.json
├── package-lock.json
├── node_modules/        recria-se com npm install; nunca vai para o Git
└── src/
    └── server.js        o arranque da API
```

O código fica dentro da pasta `src`, de source, código-fonte em inglês. A configuração e os ficheiros do npm ficam na raiz do projeto. As camadas, quando as escreveres, ficam também dentro de `src`, cada uma na sua pasta. Os ficheiros que começam por ponto, como o `.env` e o `.gitignore`, são ficheiros normais: o ponto só faz com que alguns sistemas os escondam.

### Os scripts do package.json

Para arrancar a API enquanto a desenvolves, o comando completo é `node --watch --env-file=.env src/server.js`. Quem chega ao projeto, incluindo tu daqui a três meses, não tem de saber de cor de que opções a API precisa. O `package.json` tem uma secção `scripts`, que dá nomes curtos a comandos, e cada um desses nomes é um **script**. Para a API, interessam dois:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "node --watch --env-file=.env src/server.js"
},
```

No ficheiro, esta secção substitui a `scripts` que o `npm init -y` criou, com o `"test"`, e o resto fica igual. A vírgula do fim mantém-se, porque há outras secções a seguir.

O script `dev` é o que usas enquanto desenvolves. Corre-se com `npm run dev` e faz duas coisas além de arrancar a API. O `--watch` reinicia a API sempre que guardas o `server.js`, um ficheiro que ele importe, ou o `.env`, para não a teres de parar e voltar a ligar à mão. O `--env-file=.env` lê o ficheiro `.env`, onde está a configuração da API, como a porta em que escuta. As duas opções precisam do Node 22 ou mais recente.

O script `start` é o arranque "a sério": o comando que se usa quando a API é instalada noutro computador para funcionar, e não para ser desenvolvida. Aí, quem instala a API define as variáveis no próprio computador, e não num ficheiro `.env`, e não faz sentido reiniciar a cada alteração. Corre-se com `npm start`.

O `npm start` não leva `run`, e o `npm run dev` leva. O `start` é um dos poucos scripts que o npm conhece pelo nome e deixa correr sem o `run`; todos os outros precisam dele. Antes de executar o comando, o npm escreve duas linhas a dizer que script está a correr:

```text
> papelaria-api@1.0.0 dev
> node --watch --env-file=.env src/server.js
```

O que vem a seguir a essas duas linhas já é a tua API. E o `npm run`, sem mais nada, mostra a lista dos scripts do projeto.

### A configuração fica fora do código

Há valores de que a API precisa e que não são código, como a porta onde escuta e a cadeia de ligação ao Atlas. São a **configuração** da API, e têm duas características. Mudam de computador para computador: no teu, a porta 3000 está livre; no do colega, tem lá outro servidor. E alguns são segredos, como a cadeia de ligação.

Se estes valores estiverem escritos no código, cada mudança obriga a mudar o código. E o segredo vai para onde quer que o código vá: para o GitHub, para o colega a quem mandas o projeto, para o professor. Por isso, a configuração sai do código e passa para o ambiente do processo.

Cada processo, quando arranca, recebe um conjunto de pares nome e valor, as **variáveis de ambiente**. O sistema operativo já põe lá algumas. Em Node, leem-se no objeto `process.env`:

```js
const PORTA = process.env.PORT || 3000;
```

O `process.env.PORT` é o valor da variável de ambiente `PORT`, se existir. A variável chama-se `PORT`, o nome habitual em inglês, e a constante do código chama-se `PORTA`, porque os nomes que escolhemos são em português. Se não existir, é `undefined`, e o `||` faz a constante ficar com 3000. O `||` já o conheces do 11.º ano: devolve o valor da esquerda, se ele existir e não estiver vazio, e o da direita, se não.

Prevê: se a variável `PORT` tiver o valor 3001, o `process.env.PORT` é o número 3001? Não. É o texto `"3001"`, entre aspas, porque os valores das variáveis de ambiente são sempre texto. Para a porta não faz diferença, porque o `app.listen` aceita as duas formas. Um valor que entre numa conta converte-se com `Number(...)`, como o que chega num formulário.

### O ficheiro .env guarda a configuração deste computador

Para não teres de definir as variáveis à mão sempre que arrancas a API, escreve-as num ficheiro chamado **`.env`**, na raiz do projeto, uma por linha, no formato `NOME=valor`:

```text
# Porta onde a API escuta. Muda-a se a 3000 estiver ocupada.
PORT=3000
```

As linhas que começam por `#` são comentários. Os nomes escrevem-se em maiúsculas, com `_` entre as palavras, como `MONGODB_URI`, que é a convenção das variáveis de ambiente. O `--env-file=.env` do script `dev` lê este ficheiro quando a API arranca e põe cada linha em `process.env`.

Se o ficheiro `.env` não existir, a API não arranca: o Node escreve `node: .env: not found` e termina.

O `.env` é teu e deste computador. Não vai para o Git, não se envia a ninguém e não se cola numa mensagem nem numa captura de ecrã. Quando o professor precisar de ver o teu projeto, vê-o sem o `.env`.

### O .env.example diz que variáveis é preciso definir

Se o `.env` não vai para o Git, quem recebe o projeto não sabe que variáveis tem de definir. Para isso há o **`.env.example`**, com os mesmos nomes do `.env`, valores de exemplo ou vazios, e comentários que explicam cada um. Nunca tem segredos:

```text
# Porta onde a API escuta. Muda-a se a 3000 estiver ocupada.
PORT=3000

# Ligação ao MongoDB Atlas, no formato mongodb+srv://utilizador:palavra-passe@...
# O endereço verdadeiro escreve-se só no .env. No .env.example, esta linha fica vazia.
MONGODB_URI=
```

Quem recebe o projeto copia o `.env.example` para um ficheiro `.env` e preenche os valores. O `.env.example` vai para o Git, porque documenta a configuração sem a revelar. Quando acrescentares uma variável ao `.env`, acrescenta também o nome ao `.env.example`, para ninguém ter de adivinhar, nem tu noutro computador.

### O .env do React não guarda segredos

O React feito com o Vite também pode ter um ficheiro `.env`. As variáveis desse ficheiro cujo nome começa por `VITE_` são copiadas para o código que vai para o browser. É de propósito, para configurações públicas, como o endereço da API. Uma `VITE_MONGODB_URI` seria, portanto, publicada, e a palavra-passe com ela. A cadeia de ligação ao Atlas vai para o `.env` do servidor, e só para esse.

### Um commit guarda uma fotografia do projeto

O Git é o programa que guarda o histórico do teu projeto. Cada vez que fazes um **commit**, o Git tira uma fotografia dos ficheiros que preparaste e guarda-a com uma mensagem tua e a data. Podes voltar a qualquer fotografia e ver o que mudou entre duas, e podes enviar o histórico para o GitHub, para o teres noutro computador. Neste tema, usas só o essencial:

| Comando | O que faz |
| --- | --- |
| `git init` | Começa um histórico novo nesta pasta, uma vez por projeto. Cria a pasta escondida `.git`, onde o histórico fica guardado |
| `git status` | Mostra que ficheiros mudaram, quais são novos e quais estão preparados para o próximo commit. É o comando que vais usar mais vezes |
| `git add .` | Prepara para o próximo commit todos os ficheiros novos ou alterados da pasta |
| `git commit -m "mensagem"` | Guarda a fotografia dos ficheiros preparados, com a mensagem |
| `git log --oneline` | Lista os commits já feitos, um por linha |

```mermaid
flowchart LR
    P["a pasta do projeto<br/>ficheiros novos e alterados"] -->|git add .| E["preparados<br/>para o próximo commit"]
    E -->|git commit -m| H["o histórico, na pasta .git<br/>um commit a seguir ao outro"]
```

O diagrama mostra os três sítios por onde passa um ficheiro. O `git add` leva-o da pasta para os preparados, e o `git commit` guarda os preparados no histórico, numa fotografia nova. O `git status` mostra o que está na pasta e o que está preparado.

A pasta do projeto, com o histórico na pasta `.git`, chama-se **repositório** (em inglês, repository, a palavra que o Git escreve no ecrã). Não tem nada a ver com a camada repository do servidor: a palavra é a mesma, e as coisas são diferentes.

No `git status`, um ficheiro novo, que o Git ainda não segue, aparece em "Untracked files" (ficheiros não seguidos); na forma curta, `git status --short`, aparece com `??` à frente.

Antes do primeiro commit num computador, o Git precisa de saber quem és, para pôr o teu nome em cada commit. Nos computadores da escola, que são partilhados, configura-o só para o teu projeto, dentro da pasta dele:

```bash
git config user.name "O teu nome"
git config user.email "o teu email da escola"
```

Sem `--global`, a configuração fica só neste projeto e não passa para quem usar o computador a seguir. Se não o fizeres, há computadores em que o Git recusa o commit, com a mensagem `Please tell me who you are` (diz-me quem és). Noutros, faz o commit com um nome e um email tirados da conta do computador. Nos dois casos, sugere um comando com `--global`, que nos computadores da escola não deves usar.

A mensagem de um commit diz o que mudou, em português e numa frase, para quem a ler daqui a um mês perceber sem abrir os ficheiros. "Esqueleto da API da papelaria, com a rota /api/estado" diz o que lá está. "Commit 1", "alterações" ou "teste" não dizem nada.

### O .gitignore deixa os segredos fora do Git

O `git add .` prepara todos os ficheiros da pasta. Há dois que nunca devem ir para o Git. A pasta `node_modules` recria-se com `npm install` e tem milhares de ficheiros que não são teus. O `.env` tem segredos.

O ficheiro **`.gitignore`**, na raiz do projeto, diz ao Git o que ignorar, uma regra por linha:

```text
# Dependências: recriam-se com npm install.
node_modules/

# Configuração local e segredos: nunca vão para o Git.
.env
```

Com este ficheiro, o Git passa a agir como se a pasta `node_modules` e o `.env` não existissem, e o `git add .` deixa-os de fora. O `.env.example` não é ignorado, porque o nome é outro, e é isso que se quer. É no `git status` que se vê se o `.gitignore` está a funcionar. Se o `.env` ou a `node_modules` aparecerem na lista, alguma coisa está mal, e não se faz `git add` antes de perceber o quê.

O `.gitignore` tem de existir antes do primeiro commit. Prevê: se o `.env` já foi num commit, acrescentá-lo depois ao `.gitignore` tira-o do Git? Não. O `.gitignore` só vale para os ficheiros que o Git ainda não guardou. As versões antigas do `.env` continuam no histórico, com o segredo, e quem tiver acesso ao repositório pode lê-las. Com uma palavra-passe verdadeira, a única correção segura é mudá-la no Atlas. E o Git continua a seguir o `.env`, por isso cada alteração, incluindo a palavra-passe nova, entra no commit seguinte, até alguém o tirar do Git, com passos próprios. A ordem é sempre esta: primeiro o `.gitignore`, depois o primeiro commit.

## Exemplo guiado: o esqueleto da API da papelaria

Este exemplo prepara o projeto da API da papelaria, do desenho ao primeiro commit. Começa pelo desenho, porque é ele que diz o que o código vai ter de fazer.

### Passo 1: o que o React vai pedir

Como no tema anterior, o desenho começa pelo que a aplicação precisa. A interface em React vai precisar destas três coisas, e cada uma passa a ser um pedido à API:

| O que a interface precisa | Pedido à API |
| --- | --- |
| Que artigos têm pouco stock? | `GET /api/artigos?stockMaximo=5` |
| Que informação há sobre este artigo? | `GET /api/artigos/:id` |
| Vendi três cadernos. O stock tem de baixar | `POST /api/artigos/:id/vendas` |

Todos os caminhos começam por `/api`. É uma convenção que separa os endereços da API dos endereços das páginas da aplicação. Estas rotas ainda não se programam neste exemplo: a tabela mostra para onde o projeto vai.

### Passo 2: o diagrama de camadas

Para o primeiro pedido, o dos artigos com pouco stock, o diagrama de camadas já está feito na Parte 1. São as quatro caixas de [O servidor divide-se em quatro camadas](#o-servidor-divide-se-em-quatro-camadas). Ao lado de cada uma, escreve-se o que ela faz neste pedido, como na tabela de [Um pedido atravessa as camadas sempre pela mesma ordem](#um-pedido-atravessa-as-camadas-sempre-pela-mesma-ordem). Esse diagrama é o plano do servidor.

O terceiro pedido, o da venda, é um bom teste ao plano. Onde fica a verificação de que há stock suficiente? No service, porque é uma regra da papelaria. E a resposta que recusa a venda, quando não há? No controller, porque é ele que fala HTTP e escolhe o código de estado.

### Passo 3: preparar a pasta

Os comandos criam a pasta do projeto e entram nela, criam o `package.json`, instalam o Express e criam a pasta `src`:

```bash
mkdir papelaria-api
cd papelaria-api
npm init -y
npm install express
mkdir src
```

No `package.json`, muda o `"commonjs"` para `"module"` e substitui a secção `scripts` pelos dois scripts de [Os scripts do package.json](#os-scripts-do-packagejson).

### Passo 4: os ficheiros do esqueleto

O `src/server.js`:

```js check
// src/server.js: o ponto de arranque da API da papelaria.
// Lê a configuração do ambiente, cria a aplicação Express e liga-a à porta.
import express from "express";

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, a API usa a 3000.
const PORTA = process.env.PORT || 3000;

const app = express();

// Rota de estado: serve para confirmar que a API está ligada e a responder.
// Responde em JSON, como todas as rotas de uma API.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "API da papelaria" });
});

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a API: ${erro.message}`);
    return;
  }
  console.log(`API a correr em http://localhost:${PORTA}`);
});
```

A única rota é uma **rota de estado**: não faz nada da papelaria, só responde que a API está viva. Muitas APIs têm uma, porque é a forma mais rápida de confirmar que o servidor está ligado e acessível, antes de procurar um erro noutro sítio.

O `.env.example` tem o conteúdo de [O .env.example diz que variáveis é preciso definir](#o-envexample-diz-que-variáveis-é-preciso-definir), e o `.gitignore`, o de [O .gitignore deixa os segredos fora do Git](#o-gitignore-deixa-os-segredos-fora-do-git). O `.env` cria-se como cópia do `.env.example`:

```bash
cp .env.example .env
```

Na linha de comandos clássica do Windows, escreve-se `copy .env.example .env`. Com a `MONGODB_URI` vazia, por agora, chega, porque esta API ainda não fala com o Atlas.

```mermaid
flowchart LR
    EX[".env.example<br/>os nomes, sem segredos"] -->|git add| G["o histórico do Git"]
    EX -->|cp| EN[".env<br/>os valores deste computador"]
    EN -.-x|o .gitignore deixa-o de fora| G
    EN -->|npm run dev, com o --env-file| PE["process.env.PORT"]
    PE --> S["a constante PORTA,<br/>no server.js"]
```

O diagrama mostra o caminho dos dois ficheiros. O `.env.example` vai para o histórico do Git. O `.env` é uma cópia dele, com os valores deste computador, e o `.gitignore` deixa-o fora do Git. Quando arrancas com `npm run dev`, o `--env-file` lê o `.env`, e a porta chega ao `server.js` em `process.env.PORT`.

O esqueleto completo, com todos estes ficheiros, está nos exemplos: [papelaria-api](../exemplos/acesso-a-dados/papelaria-api/README.md).

### Passo 5: ligar e confirmar

```bash
npm run dev
```

O terminal mostra as duas linhas do npm e, a seguir, `API a correr em http://localhost:3000`. O Node leu o `server.js` de cima para baixo, e o `app.listen`, no fim, ligou a API à porta e escreveu essa linha. No browser, `http://localhost:3000/api/estado` mostra:

```json
{ "estado": "ok", "aplicacao": "API da papelaria" }
```

No separador Rede das ferramentas de programador, o pedido tem o código 200 e o tipo `application/json`.

### Passo 6: mudar a porta sem mexer no código

Com a API ligada, muda no `.env` a linha da porta para `PORT=3001` e guarda. O `--watch` dá pela mudança, escreve `Restarting 'src/server.js'` e volta a arrancar a API, que escreve `API a correr em http://localhost:3001`. O endereço antigo passa a dar "ligação recusada", e o novo responde. Não mudaste nenhuma linha do `server.js`, e é para isto que serve a configuração fora do código. No fim, volta a pôr `PORT=3000`.

### Passo 7: guardar no Git

```bash
git init
git status --short
```

O `git init` pode escrever antes umas linhas `hint:` sobre o nome do ramo principal, que não pedem nada. Com o `.gitignore` já criado, a lista do `git status --short` mostra o `.env.example`, o `.gitignore`, o `package.json`, o `package-lock.json` e a pasta `src/`. Não mostra o `.env` nem a `node_modules`. Confirmado isso, os comandos seguintes põem o teu nome no projeto e fazem o primeiro commit:

```bash
git config user.name "O teu nome"
git config user.email "o teu email da escola"
git add .
git commit -m "Esqueleto da API da papelaria, com a rota /api/estado"
git log --oneline
```

O `git log` mostra um commit, com um código curto à frente da mensagem. Num terminal, pode aparecer também `(HEAD -> master)` ou `(HEAD -> main)` entre os dois, que diz em que ramo estás.

### Passo 8: traçar o pedido

Para o pedido de estado, que já funciona, explicar o pedido dá cinco passos:

| Passo | Onde | O que acontece |
| --- | --- | --- |
| 1 | browser | Escreves `http://localhost:3000/api/estado`. O browser faz um pedido `GET /api/estado` ao computador `localhost`, na porta 3000 |
| 2 | sistema operativo | O pedido chega à porta 3000, onde o processo da API está à escuta |
| 3 | API (Node e Express) | O Express procura uma rota para `GET /api/estado`, encontra-a e chama a sua função |
| 4 | API | A função responde com `res.json(...)`. O Express converte o objeto em JSON e junta o código 200 e o tipo `application/json` |
| 5 | browser | Recebe a resposta e mostra o JSON. O código e o tipo veem-se no separador Rede |

## Erros frequentes

### npm run dev diz que não encontra o .env

```text
node: .env: not found
```

O script `dev` usa o `--env-file=.env`, que procura o `.env` na raiz do projeto, ao lado do `package.json`. O npm corre o script sempre a partir daí, mesmo que estejas dentro de `src`. Ou o ficheiro não existe, e cria-se a partir do `.env.example`, ou está dentro de `src`, ou o nome está errado. No Windows, alguns editores e o Explorador de Ficheiros acrescentam `.txt` ao nome sem o mostrar, e o ficheiro fica `.env.txt`. Cria os ficheiros no editor de código, e não no Bloco de Notas, e confirma o nome com `dir` ou no próprio editor.

### npm dev não funciona

```text
Unknown command: "dev"
```

Falta o `run`. Escreve `npm run dev`, porque só o `start`, e poucos outros, dispensam o `run`. Se a mensagem for `Missing script: "dev"`, o script não existe no `package.json`, ou o nome está mal escrito. Para ver os scripts que existem, escreve só `npm run`.

### A API arranca na porta errada

O terminal mostra `API a correr em http://localhost:3000`, apesar de o `.env` dizer outra porta. O `process.env.PORT` está vazio, e a API usou a porta 3000. Ou arrancaste com `npm start`, que não lê o `.env`, ou o nome da variável no `.env` é diferente do que o código lê. `PORTA` no `.env` e `PORT` no código são duas variáveis diferentes.

### O git status mostra o .env ou a node_modules

O `.gitignore` não existe, tem outro nome, como `.gitignore.txt`, está noutra pasta, ou a regra está mal escrita. Não faças `git add` até a lista estar certa. Se o `.env` já foi num commit, chama o professor, porque tirá-lo do Git tem passos próprios, e muda no Atlas a palavra-passe que lá estava.

### O .env.example tem a palavra-passe verdadeira

O `git status` não mostra nada de estranho, porque o `.env.example` vai para o Git de propósito, e é isso que faz deste erro o mais perigoso do tema. Deixa os valores secretos vazios, ou com um texto que mostre o formato sem ser verdadeiro. Se já fizeste um commit com a palavra-passe verdadeira, muda-a no Atlas, como no erro anterior.

## Palavras novas deste guia

- Persistência: os dados sobreviverem ao fecho do browser, ao reinício do servidor e à troca de computador; é a base de dados que a garante.
- Cadeia de ligação: o endereço que leva a API ao Atlas, começado por `mongodb+srv://`, com o utilizador e a palavra-passe da base de dados lá dentro.
- Segredo: um valor que dá acesso a alguma coisa, como a cadeia de ligação; fica só no servidor e nunca vai para o browser nem para o Git.
- Camada: uma parte do servidor com uma só tarefa, por onde o pedido passa sempre pela mesma ordem.
- Controller: a camada que conhece o HTTP; lê o pedido, chama o service, escolhe o código de estado e responde.
- Service: a camada das regras da aplicação, que não sabe nada de HTTP.
- Repository: a única camada que fala com a base de dados.
- Script: um nome curto para um comando, na secção `scripts` do `package.json`, que se corre com `npm run` seguido do nome, ou com `npm start`.
- Configuração: os valores de que a API precisa e que não são código, como a porta e a cadeia de ligação.
- Variável de ambiente: um par nome e valor que o processo recebe quando arranca, e que se lê em `process.env`.
- `.env`: o ficheiro com as variáveis de ambiente deste computador; nunca vai para o Git.
- `.env.example`: o ficheiro com os nomes das variáveis, sem segredos, que documenta a configuração e vai para o Git.
- Git: o programa que guarda o histórico de um projeto.
- Commit: uma fotografia dos ficheiros do projeto, guardada no histórico com uma mensagem e a data.
- Repositório: a pasta de um projeto com o seu histórico do Git, que fica na pasta escondida `.git`; não é a camada repository do servidor.
- `.gitignore`: o ficheiro que diz ao Git o que ignorar, uma regra por linha.
- Rota de estado: uma rota que só responde que a API está ligada, como `GET /api/estado`.

## O que vem a seguir

O tema seguinte é API Express e contratos, em que escreves o contrato da API da papelaria e as primeiras rotas, e as divides nestas camadas.

## Para saber mais

- [Ficheiros .env no Node.js](https://nodejs.org/docs/latest-v24.x/api/environment_variables.html), na documentação oficial, em inglês: o formato do ficheiro e a opção `--env-file`.
- [Scripts do npm](https://docs.npmjs.com/cli/v11/using-npm/scripts), em inglês: o que é um script e como o npm os corre.
- [Livro Pro Git](https://git-scm.com/book/pt-pt/v2), em português: os capítulos 1 e 2 explicam o que é o Git e os comandos deste guia. A secção 2.2, a do `git add` e do `git commit`, ainda está em inglês.

![Rodapé](../imagens/rodape.png)
