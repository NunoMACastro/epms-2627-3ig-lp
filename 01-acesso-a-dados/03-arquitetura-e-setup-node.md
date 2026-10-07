![Cabeçalho](../imagens/cabecalho.png)

# Arquitetura e setup Node

Módulo M14, Acesso a Bases de Dados. Três aulas de 60 minutos. A primeira é de teoria, com este guia. As outras duas são de laboratório, em que preparas o projeto da API da papelaria no teu computador, seguindo o [guia do laboratório](03-arquitetura-e-setup-node-laboratorio.md). Os exercícios para fazeres sozinho estão na [ficha](03-arquitetura-e-setup-node-exercicios.md).

## Neste guia

1. O que vais aprender
2. O que já sabes e vais usar
3. A tua aplicação tem três partes
4. O papel do servidor
5. As camadas dentro do servidor
6. Preparar um projeto Node
7. Configuração fora do código: o .env
8. O que vai para o Git: o .gitignore
9. O mínimo de Git
10. Exemplo guiado: o esqueleto da API da papelaria
11. Traçar um pedido
12. Erros frequentes
13. Verificar o que aprendeste
14. O que vem a seguir
15. Para saber mais

## O que vais aprender

No tema anterior criaste no MongoDB Atlas a base de dados da papelaria e fizeste-lhe perguntas pelo browser. Uma aplicação não funciona assim: os utilizadores não abrem o Atlas, abrem a aplicação, e é a aplicação que fala com a base de dados por eles. Neste tema vais perceber como se organiza essa aplicação, peça a peça, e vais preparar a primeira dessas peças: o projeto do servidor, a que se chama API.

Ainda não ligas o servidor ao Atlas nem escreves as rotas da papelaria: isso vem nos dois temas seguintes. Este tema trata da planta da casa e das fundações. São as decisões que, se ficarem mal tomadas agora, custam caro mais tarde: onde fica a palavra-passe da base de dados, como se arruma o código para não ser um ficheiro de mil linhas, e o que nunca pode ir parar ao GitHub.

No fim deste guia deves conseguir:

- desenhar as três partes da tua aplicação (React, API e MongoDB Atlas), dizer onde corre cada uma e o que viaja entre elas;
- explicar porque é que o React nunca fala diretamente com o Atlas e porque é que o endereço do Atlas só pode estar no servidor;
- dizer o que faz cada camada do servidor (rotas, controller, service e repository) e desenhar o diagrama de camadas de um pedido;
- preparar um projeto Node com módulos ES, scripts, um ficheiro `.env`, um `.env.example` e um `.gitignore`;
- guardar o projeto no Git, confirmando antes que nenhum segredo vai junto;
- explicar um pedido do browser até ao servidor e de volta.

## O que já sabes e vais usar

Em Linguagens de Programação:

- **o modelo documental**, do tema anterior: documentos, coleções, o `_id` e as consultas com filtros. Vais usar a papelaria e a sua coleção `artigos`;
- **o React**, do 11.º ano: componentes, estado, e o `fetch` com `await` para ir buscar dados, dentro de um `useEffect`;
- **o JSON**, a forma de escrever objetos como texto para os enviar pela rede;
- **os módulos**, com `import` e `export`.

Em Sistemas de Informação, que é a mesma turma, já tiveste os guias "Do pedido à resposta" e "Primeiro servidor". Este guia dá por sabido o que eles explicam e não o repete:

- o pedido e a resposta HTTP, as partes de um endereço, os métodos `GET` e `POST` e os códigos de estado;
- o que é o Node.js, o processo servidor e a porta;
- o npm, o `package.json`, a pasta `node_modules`, o `package-lock.json` e a troca de `"commonjs"` por `"module"` no campo `"type"`;
- um servidor Express com rotas `GET`, `res.send` e `res.json`, e o `app.listen` com o `if (erro)`;
- como ler uma mensagem de erro do Node.

Se faltaste a essas aulas, lê os dois guias de Sistemas de Informação antes deste. As ideias são as mesmas nas duas disciplinas; o que muda é o que cada uma faz com elas.

## A tua aplicação tem três partes

A aplicação que vais construir este ano tem três partes, e cada uma corre num sítio diferente.

O **cliente** é a interface em React. Corre no browser de quem usa a aplicação. Mostra os dados, recebe os cliques e o que se escreve nos formulários e, quando precisa de dados, pede-os ao servidor com `fetch`.

A **API** é um servidor em Node.js com Express. Corre num computador servidor; enquanto desenvolves, no teu. Recebe os pedidos do React, aplica as regras da aplicação, fala com a base de dados e responde com dados em JSON. API quer dizer Application Programming Interface, interface de programação de aplicações: é a porta por onde outros programas, como o teu React, usam o teu servidor.

A **base de dados** é o MongoDB Atlas, que já conheces. Corre nos servidores da MongoDB, na internet. Guarda os documentos e responde às consultas que a API lhe faz.

```text
 browser                    servidor (o teu computador)              MongoDB Atlas
┌─────────────────┐        ┌───────────────────────────┐        ┌──────────────────┐
│  React          │  HTTP  │  API em Node e Express    │ Driver │  base papelaria  │
│                 │ ─────→ │                           │ ─────→ │                  │
│  mostra e pede  │  JSON  │  regras e acesso a dados  │        │  coleção artigos │
│                 │ ←───── │                           │ ←───── │                  │
└─────────────────┘        └───────────────────────────┘        └──────────────────┘
```

Entre o React e a API, a conversa é em HTTP, com JSON no corpo: o React pede `GET /api/artigos` e recebe uma lista de artigos em JSON. Entre a API e o Atlas, a conversa não é em HTTP: é feita por uma biblioteca chamada **driver** do MongoDB, que fala o protocolo próprio do MongoDB e precisa de um endereço com utilizador e palavra-passe para se ligar. Vais instalá-la e usá-la no tema da ligação segura.

### O que muda em relação a Sistemas de Informação

Em Sistemas de Informação, o servidor Express gera as páginas: recebe o pedido, vai buscar os dados e responde com HTML pronto a mostrar. O browser só desenha o que recebe. Aqui, o mesmo Express responde com dados, em JSON, e é o React, dentro do browser, que constrói a página a partir deles.

| | Sistemas de Informação | Linguagens de Programação |
| --- | --- | --- |
| Quem constrói a página | o servidor, com EJS | o React, no browser |
| O que a resposta traz | HTML | dados em JSON |
| Base de dados | PostgreSQL, com SQL | MongoDB Atlas, com o driver |
| O que o browser faz | mostra o HTML recebido | corre o React, que pede dados e desenha |

As duas formas são usadas no mundo real, e a mesma tecnologia, o Express, serve as duas. Saber em qual estás é o que te diz o que uma rota deve devolver: numa, uma página; na outra, dados.

## O papel do servidor

Parece mais simples o React pedir os dados diretamente ao Atlas: há menos uma peça. Não se faz, e as razões são as que tornam o servidor indispensável.

**O segredo.** Para se ligar ao Atlas, um programa precisa da cadeia de ligação, um endereço que começa por `mongodb+srv://` e leva lá dentro o utilizador e a palavra-passe da base de dados. Ora, o código do React é descarregado para o browser de cada utilizador: quem quiser, abre as ferramentas de programador e lê-o. Uma palavra-passe que esteja no código do React deixou de ser secreta no momento em que alguém abriu a aplicação. Quem a tivesse podia ler, alterar ou apagar a base de dados inteira. Por isso a regra é absoluta: **o segredo fica só no servidor.** O browser nunca o recebe.

Há uma armadilha em que é fácil cair. No React feito com o Vite, as variáveis de um ficheiro `.env` cujo nome começa por `VITE_` são copiadas para o código que vai para o browser. É de propósito, para configurações públicas, como o endereço da API. Uma `VITE_MONGODB_URI` seria, portanto, publicada. O endereço do Atlas vai para o `.env` do servidor, e só para esse.

**As regras.** A papelaria não pode vender mais cadernos do que tem em stock. Se esta regra estiver no React, quem quiser contorna-a: o browser está nas mãos do utilizador, e qualquer pessoa pode enviar um pedido sem passar pelo formulário, ou alterar o código que corre no seu browser. As regras têm de ser verificadas num sítio que o utilizador não controla, e esse sítio é o servidor. O React pode ajudar, avisando antes de enviar, mas essa ajuda é conforto e não proteção.

**A persistência.** Os dados de uma aplicação têm de sobreviver: ao fecho do browser, ao reinício do servidor, à troca de computador. O estado do React desaparece quando se fecha o separador. Um array na memória do servidor desaparece quando o servidor para, como viste em Sistemas de Informação. É a base de dados que guarda os dados de forma permanente, e é o servidor que lhe pede para os guardar.

**Um só sítio para vários clientes.** Hoje o cliente é a tua interface React. Amanhã pode ser uma aplicação de telemóvel, ou um relatório gerado por outro programa. Todos usam a mesma API, com as mesmas regras, sem cada um ter de as repetir.

### Para confirmar

1. Porque é que a cadeia de ligação ao Atlas não pode estar no código do React?
2. Um colega pôs a regra "o stock não pode ficar negativo" só no formulário React, com um `if` antes do `fetch`. A regra está garantida? Porquê?
3. Onde devia ficar uma variável `VITE_MONGODB_URI`? E uma `MONGODB_URI`?

## As camadas dentro do servidor

### Porque se divide o servidor

Em Sistemas de Informação, o primeiro servidor tinha tudo num ficheiro: os dados, as rotas e o que cada rota fazia. Para duas rotas, está certo. Uma API a sério tem dezenas de rotas, e cada rota faz várias coisas diferentes: lê o pedido, verifica se os dados fazem sentido, aplica as regras do negócio, fala com a base de dados e escolhe a resposta. Se tudo isto estiver junto, dentro de cada rota, o ficheiro cresce até ninguém o conseguir ler, a mesma regra aparece copiada em três rotas, e uma mudança na base de dados obriga a mexer em todas.

A solução é dividir o servidor em **camadas**, cada uma com uma só responsabilidade, e fazer o pedido passar por elas sempre pela mesma ordem. A arquitetura que vais usar este ano tem quatro:

```text
pedido HTTP
    │
    ↓
┌──────────────┐
│ rotas        │  que método e que caminho vão para que controller
└──────────────┘
    │
    ↓
┌──────────────┐
│ controller   │  lê o pedido, chama o service, escolhe o código e responde
└──────────────┘
    │
    ↓
┌──────────────┐
│ service      │  as regras da aplicação, sem saber nada de HTTP
└──────────────┘
    │
    ↓
┌──────────────┐
│ repository   │  o único que fala com o MongoDB
└──────────────┘
    │
    ↓
MongoDB Atlas
```

Os nomes estão em inglês porque é assim que estas camadas se chamam em todo o lado: na documentação, nos fóruns e nas ofertas de emprego. Vale a pena conhecê-los pelo nome que vais encontrar.

### O que faz cada camada

As **rotas** são o índice da API. Dizem que método e que caminho correspondem a que função: `GET /api/artigos` vai para a função que lista artigos, `GET /api/artigos/:id` para a que mostra um artigo. Não fazem mais nada. Quem quiser saber que pedidos a API aceita, lê as rotas.

O **controller** (controlador) é a camada que conhece o HTTP. Recebe o `req` e o `res`. Lê do pedido o que interessa, como um parâmetro do endereço ou os dados do corpo, e converte-os, por exemplo de texto para número. Chama o service com esses valores. Depois, conforme o resultado, escolhe o código de estado (200, 400, 404) e envia a resposta em JSON. O controller não sabe as regras da papelaria nem fala com a base de dados.

O **service** (serviço) é onde estão as regras da aplicação: "o stock não pode ficar negativo", "um artigo com o stock abaixo do seu stock mínimo tem de ser encomendado", "o preço é sempre em cêntimos inteiros". Recebe valores simples e devolve valores simples. Não sabe o que é um pedido HTTP: não usa `req` nem `res`. É por isso que se consegue testar sozinho, sem browser e sem servidor ligado.

O **repository** (repositório) é a única camada que fala com o MongoDB. Sabe o nome da coleção e escreve as consultas com o driver: `find`, `insertOne`, `updateOne`. Recebe e devolve objetos JavaScript. Mais ninguém no servidor sabe que a base de dados é o MongoDB.

### Um pedido a atravessar as camadas

O React quer mostrar os artigos com pouco stock, até 5 unidades, e pede `GET /api/artigos?stockMaximo=5`.

| Camada | O que faz neste pedido |
| --- | --- |
| Rotas | Vê que é `GET /api/artigos` e passa o pedido à função do controller que lista artigos |
| Controller | Lê `stockMaximo` dos parâmetros de pesquisa, que chega como texto, `"5"`, e converte-o para o número 5. Se não for um número válido, responde 400 e o pedido acaba aqui. Se for, chama o service |
| Service | Pede ao repository os artigos com stock até ao limite. Se não viesse limite nenhum, pedia todos |
| Repository | Executa no Atlas a consulta `{ stock: { $lte: 5 } }` na coleção `artigos` e devolve os documentos encontrados |
| Service | Devolve a lista ao controller |
| Controller | Responde 200 com a lista em JSON |

A consulta `{ stock: { $lte: 5 } }` é a do guia do tema anterior, com o `$lte`, menor ou igual, porque o limite é um máximo e um artigo com exatamente 5 unidades deve aparecer. Vai aparecer no repository quase igual.

### Porque vale a pena

**Cada mudança tem um sítio.** Se a papelaria decidir encomendar um artigo quando o stock chega ao mínimo, e não só quando fica abaixo dele, muda-se uma linha no service. Se a papelaria trocar o MongoDB por outra base de dados, muda-se o repository, e as rotas, os controllers e os services ficam iguais.

**Cada camada testa-se sozinha.** O service não precisa de HTTP nem de base de dados para se verificar se aplica bem a regra do stock. Vais aproveitar isto no tema da robustez e dos testes.

**Encontra-se o código.** Um erro na resposta, como um código 200 em vez de 404, está no controller. Um resultado errado da regra está no service. Uma consulta que não encontra nada está no repository. As camadas são também um mapa para procurar erros.

Uma nota de proporção. Esta arquitetura existe para organizar uma aplicação pequena ou média, como a tua, e não para a tornar complicada. Cada camada é um ficheiro com algumas funções simples, por recurso da API: um ficheiro de rotas para os artigos, um controller, um service e um repository. Não precisas de classes, de bibliotecas especiais nem de mais camadas do que estas quatro.

### Para confirmar

1. Em que camada fica a regra "não se pode vender mais do que o stock"? E a conversão de `"5"` para `5`?
2. Em que camada aparece `res.status(404)`? E `colecao.find(...)`?
3. O service pode usar `req.query`? Porquê?

## Preparar um projeto Node

### O que já fizeste e o que muda agora

Em Sistemas de Informação, preparaste a pasta de um servidor com o mínimo: `npm init -y`, a troca do `"type"` e `npm install express`, e um `server.js` ao lado do `package.json`. Chegou para um exemplo de aula. Um projeto que vai crescer durante o ano inteiro, e que vais entregar e instalar noutro computador, precisa de mais quatro coisas, e é delas que tratam as próximas secções:

- uma pasta `src` para o código, onde as camadas vão viver;
- scripts no `package.json`, para arrancar a API sempre da mesma maneira;
- a configuração fora do código, num ficheiro `.env`, com um `.env.example` que documenta o que lá deve estar;
- um `.gitignore` e o Git, para guardar o trabalho sem guardar o que não deve.

### A estrutura de pastas

O esqueleto da API da papelaria, no fim deste tema, fica assim:

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

O código fica dentro de `src` (de source, código-fonte), e a configuração e os ficheiros do npm ficam na raiz do projeto. Quando as camadas chegarem, no tema seguinte, ficam também dentro de `src`, em pastas próprias. Os ficheiros que começam por ponto, como `.env` e `.gitignore`, são ficheiros normais: o ponto só faz com que alguns sistemas os escondam por omissão.

### Os scripts do package.json

O `package.json` tem uma secção `scripts`, que dá nomes curtos a comandos. Para a API, interessam dois:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch --env-file=.env src/server.js"
  }
}
```

(No ficheiro real, esta secção substitui a `scripts` que o `npm init -y` criou, com o `"test"`, e o resto do ficheiro fica igual.)

O script `dev` é o que usas enquanto desenvolves. Corre-se com `npm run dev` e faz duas coisas além de arrancar a API. O `--watch` reinicia a API sempre que guardas um ficheiro do projeto, para não teres de a parar e voltar a ligar à mão. O `--env-file=.env` lê o ficheiro `.env` e põe a configuração que lá está à disposição do código, como a secção seguinte explica.

O script `start` é o arranque "a sério": é o comando que se usa quando a API é instalada noutro computador para funcionar, e não para ser desenvolvida. Aí a configuração vem do próprio sistema, e não de um ficheiro `.env`, e não faz sentido reiniciar a cada alteração. Corre-se com `npm start`.

Repara na diferença entre os dois comandos: `npm start`, sem `run`, e `npm run dev`, com `run`. O `start` é um dos poucos scripts que o npm conhece pelo nome e deixa correr sem o `run`; todos os outros precisam dele. Antes de executar o comando, o npm escreve duas linhas a dizer que script está a correr, por exemplo:

```text
> papelaria-api@1.0.0 dev
> node --watch --env-file=.env src/server.js
```

O que vem a seguir a essas duas linhas é já a tua API.

Há uma razão para usar scripts em vez de escrever o comando completo: quem chega ao projeto, incluindo tu daqui a três meses, não tem de saber de cor que opções a API precisa. Lê os scripts, ou escreve `npm run`, sem mais nada, que mostra a lista.

## Configuração fora do código: o .env

### O que é configuração

Há valores de que a API precisa que não são código: a porta onde escuta, o endereço do Atlas, o nome da base de dados. Têm duas características. Mudam de computador para computador: no teu, a porta 3000 está livre; no do colega, tem lá outro servidor. E alguns são segredos: a cadeia de ligação ao Atlas tem a palavra-passe.

Se estes valores estiverem escritos no código, cada mudança obriga a alterar o código, e o segredo vai para onde quer que o código vá: para o GitHub, para o colega a quem mandas o projeto, para o professor. A solução é tirá-los do código e pô-los no **ambiente** do processo.

### As variáveis de ambiente

Cada processo, quando arranca, recebe um conjunto de pares nome e valor, a que se chama **variáveis de ambiente**. O sistema operativo já põe lá algumas, como a pasta pessoal do utilizador. Em Node, lêem-se através do objeto `process.env`:

```js
const PORTA = process.env.PORT || 3000;
```

`process.env.PORT` é o valor da variável de ambiente `PORT`, se existir. Se não existir, é `undefined`, e o `||` faz a constante ficar com 3000. O `||` já o conheces: devolve o valor da esquerda se ele existir, e o da direita se não.

Um pormenor que vai contar mais tarde: os valores das variáveis de ambiente são sempre texto. Se o `.env` disser `PORT=3000`, o `process.env.PORT` é `"3000"`, entre aspas, e não o número 3000. Para a porta não faz diferença, porque o `app.listen` aceita as duas formas. Quando leres do ambiente um valor que tenha de ser usado como número numa conta, converte-o com `Number(...)`, como fazes com o que chega num formulário.

### O ficheiro .env

Para não teres de definir as variáveis à mão sempre que arrancas a API, escreve-as num ficheiro chamado `.env`, na raiz do projeto, uma por linha, no formato `NOME=valor`:

```text
# Porta onde a API escuta.
PORT=3000

# Ligação ao MongoDB Atlas. Fica vazia até ao tema da ligação segura.
MONGODB_URI=
```

As linhas que começam por `#` são comentários. Os nomes escrevem-se em maiúsculas, com `_` entre palavras: é a convenção para variáveis de ambiente. O `--env-file=.env` do script `dev` lê este ficheiro quando a API arranca e põe cada linha em `process.env`.

Duas consequências do `--env-file`. Se o ficheiro `.env` não existir, a API não arranca: o Node escreve `node: .env: not found` e termina. E, com o `--watch`, se mudares o `.env` e guardares, a API reinicia sozinha e passa a usar os valores novos. Experimentas as duas coisas no laboratório.

O `.env` é teu e é deste computador. Não vai para o Git, não se envia a ninguém, não se cola numa mensagem nem numa captura de ecrã. Quando o professor precisar de ver o teu projeto, vê-o sem o `.env`.

### O ficheiro .env.example

Se o `.env` não vai para o Git, como é que quem descarrega o projeto sabe que variáveis tem de definir? É para isso que serve o **`.env.example`**: tem os mesmos nomes do `.env`, com valores de exemplo ou vazios, e comentários que explicam cada um. Nunca tem segredos.

```text
# Porta onde a API escuta. Muda-a se a 3000 estiver ocupada.
PORT=3000

# Ligação ao MongoDB Atlas, no formato mongodb+srv://utilizador:palavra-passe@...
# Copia o endereço do Atlas para o teu .env, nunca para este ficheiro.
MONGODB_URI=
```

Quem descarrega o projeto copia o `.env.example` para um ficheiro `.env` e preenche os valores. O `.env.example` vai para o Git, porque documenta a configuração sem a revelar. Se um dia acrescentares uma variável ao `.env`, acrescentas também o nome ao `.env.example`: é a forma de não deixares os outros, e a ti próprio noutro computador, a adivinhar.

### Para confirmar

1. Que diferença há entre o `.env` e o `.env.example`? Qual deles vai para o Git?
2. Com o `.env` a dizer `PORT=3001`, que valor tem `process.env.PORT` dentro da API? De que tipo é?
3. Corres `npm start`, que não usa o `--env-file`, e não definiste `PORT` no sistema. Em que porta fica a API?

## O que vai para o Git: o .gitignore

O Git guarda versões dos ficheiros de um projeto. Antes de guardar, olha para todos os ficheiros da pasta e propõe-se guardá-los todos. Há dois que nunca devem ir: a pasta `node_modules`, porque se recria com `npm install` e tem milhares de ficheiros que não são teus; e o `.env`, porque tem segredos.

O ficheiro **`.gitignore`**, na raiz do projeto, diz ao Git o que ignorar, uma regra por linha:

```text
# Dependências: recriam-se com npm install.
node_modules/

# Configuração local e segredos: nunca vão para o Git.
.env
```

Com este ficheiro, o Git passa a agir como se a pasta `node_modules` e o `.env` não existissem. O `.env.example` não é ignorado, porque o nome é outro, e é isso que se quer.

O `.gitignore` tem de existir antes de o `.env` ser guardado pela primeira vez. Se o `.env` já foi guardado num commit, acrescentá-lo ao `.gitignore` depois não o apaga do histórico: as versões antigas continuam lá, com o segredo, e quem tiver acesso ao repositório pode lê-las. Se isso acontecer com uma palavra-passe verdadeira, a única correção segura é mudar a palavra-passe no Atlas. Por isso a ordem certa é: primeiro o `.gitignore`, depois o primeiro commit.

## O mínimo de Git

O Git é o programa que guarda o histórico do teu projeto: cada vez que fazes um **commit**, ele tira uma fotografia de todos os ficheiros e guarda-a com uma mensagem tua e a data. Podes voltar a qualquer fotografia, ver o que mudou entre duas, e enviar o histórico para o GitHub para o teres noutro computador ou para o mostrares a alguém. Neste tema usas só o essencial: começar o histórico, ver o estado da pasta e fazer commits.

| Comando | O que faz |
| --- | --- |
| `git init` | Começa um histórico novo nesta pasta. Faz-se uma vez por projeto. Cria uma pasta escondida `.git`, onde o histórico fica guardado |
| `git status` | Mostra o estado: que ficheiros mudaram, quais são novos e quais estão preparados para o próximo commit. É o comando que vais usar mais vezes |
| `git add .` | Prepara para o próximo commit todos os ficheiros novos ou alterados da pasta, menos os ignorados pelo `.gitignore` |
| `git commit -m "mensagem"` | Guarda a fotografia dos ficheiros preparados, com a mensagem |
| `git log --oneline` | Lista os commits já feitos, um por linha |

No `git status`, um ficheiro novo que o Git ainda não conhece aparece como "untracked" (não seguido); na forma curta, `git status --short`, aparece com `??` à frente. É aqui que se vê se o `.gitignore` está a funcionar: se o `.env` ou a `node_modules` aparecerem na lista, alguma coisa está mal, e não se faz `git add` antes de perceber o quê.

Antes do primeiro commit num computador, o Git precisa de saber quem és, para pôr o teu nome em cada commit. Nos computadores da escola, que são partilhados, configura isto só para o teu projeto, dentro da pasta dele:

```text
git config user.name "O teu nome"
git config user.email "o teu email da escola"
```

Sem `--global`, a configuração fica só neste projeto e não passa para quem usar o computador a seguir. Se não o fizeres, conforme o computador, o Git ou recusa o commit com a mensagem `Please tell me who you are`, ou inventa um nome a partir do nome do computador e avisa-te.

A mensagem de um commit diz o que mudou, em português e numa frase, para quem a ler daqui a um mês perceber sem abrir os ficheiros. "Esqueleto da API da papelaria, com a rota /api/estado" diz o que lá está. "Commit 1", "alterações" ou "teste" não dizem nada.

## Exemplo guiado: o esqueleto da API da papelaria

Este exemplo junta as secções anteriores. Começa pelo desenho, porque é o desenho que diz o que o código vai ter de fazer, e acaba no primeiro commit.

### Passo 1: o que o React vai pedir

No tema anterior modelaste a papelaria a partir de perguntas. A interface React vai precisar de fazer estas três, e cada uma passa a ser um pedido à API:

| Pergunta | Pedido à API |
| --- | --- |
| Que artigos têm pouco stock? | `GET /api/artigos?stockMaximo=5` |
| Que informação há sobre este artigo? | `GET /api/artigos/:id` |
| Vendi três cadernos: o stock tem de baixar | `POST /api/vendas` |

Todos os caminhos começam por `/api`. É uma convenção que separa os endereços da API dos endereços das páginas da aplicação, e que vai dar jeito quando juntares o React ao servidor. Não precisas de escrever estas rotas agora: o tema seguinte trata delas. Mas escrevê-las já mostra que o projeto tem um destino.

### Passo 2: o diagrama de camadas

Para o primeiro pedido, o dos artigos com pouco stock, o diagrama é o da secção "Um pedido a atravessar as camadas". No caderno ou numa folha, desenha-o com as quatro camadas e o Atlas, e escreve ao lado de cada camada o que faz neste pedido. Este diagrama é o plano do servidor, e é uma das duas coisas que este tema te pede para entregar.

O terceiro pedido, o da venda, é um bom teste ao diagrama: onde fica a verificação de que há stock suficiente? No service, porque é uma regra da papelaria. E a mensagem de erro, com o código 400, quando não há? No controller, porque é ele que fala HTTP. Se conseguires responder a estas duas perguntas sem hesitar, percebeste as camadas.

### Passo 3: preparar a pasta

```text
mkdir papelaria-api
cd papelaria-api
npm init -y
npm install express
mkdir src
```

No `package.json`: muda `"commonjs"` para `"module"` e substitui a secção `scripts` pelos dois scripts da secção "Os scripts do package.json".

### Passo 4: os ficheiros do esqueleto

`src/server.js`:

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

`.env.example`, com o conteúdo da secção "O ficheiro .env.example". `.gitignore`, com o conteúdo da secção "O que vai para o Git". E o `.env`, que se cria copiando o `.env.example`:

```text
cp .env.example .env
```

(No Windows, na linha de comandos clássica, `copy .env.example .env`.) Com o `MONGODB_URI` vazio, por agora, chega: a API ainda não fala com o Atlas.

O esqueleto completo, com todos estes ficheiros, está na pasta de exemplos do repositório: [papelaria-api](../exemplos/acesso-a-dados/papelaria-api/README.md).

### Passo 5: ligar e confirmar

```text
npm run dev
```

O terminal mostra as duas linhas do npm e a seguir `API a correr em http://localhost:3000`. No browser, `http://localhost:3000/api/estado` mostra:

```json
{ "estado": "ok", "aplicacao": "API da papelaria" }
```

No separador Rede das ferramentas de programador, o pedido tem o código 200 e o tipo `application/json`.

### Passo 6: mudar a porta sem mexer no código

Com a API ligada, muda no `.env` a linha da porta para `PORT=3001` e guarda. O `--watch` reinicia a API, que escreve `API a correr em http://localhost:3001`. O endereço antigo passa a dar "ligação recusada", e o novo responde. Não mudaste uma única linha do `server.js`: é exatamente para isto que serve a configuração fora do código. Volta a pôr `PORT=3000`.

### Passo 7: guardar no Git

```text
git init
git status --short
```

Com o `.gitignore` já criado, a lista mostra o `.env.example`, o `.gitignore`, o `package.json`, o `package-lock.json` e a pasta `src/`. Não mostra o `.env` nem a `node_modules`. Confirmado isso, e configurado o teu nome no projeto:

```text
git add .
git commit -m "Esqueleto da API da papelaria, com a rota /api/estado"
git log --oneline
```

O `git log` mostra um commit, com um código curto à frente da mensagem.

## Traçar um pedido

A evidência deste tema é explicares um pedido do browser até ao servidor e de volta. Explicar um pedido é dizer, por ordem, quem faz o quê, onde corre e o que viaja. Para o pedido de estado, que já funciona:

| Passo | Onde | O que acontece |
| --- | --- | --- |
| 1 | browser | Escreves `http://localhost:3000/api/estado`. O browser faz um pedido `GET /api/estado` ao computador `localhost`, porta 3000 |
| 2 | sistema operativo | O pedido chega à porta 3000, onde o processo da API está à escuta |
| 3 | API (Node e Express) | O Express procura uma rota para `GET /api/estado`, encontra-a e chama a sua função |
| 4 | API | A função responde com `res.json(...)`: o Express converte o objeto para JSON e junta o código 200 e o tipo `application/json` |
| 5 | browser | Recebe a resposta e mostra o JSON. O código e o tipo veem-se no separador Rede |

O mesmo traçado, para o pedido que a aplicação vai fazer quando estiver completa, já tem as camadas e o Atlas:

| Passo | Onde | O que acontece |
| --- | --- | --- |
| 1 | browser (React) | O componente da lista de stock baixo faz `fetch("/api/artigos?stockMaximo=5")` e espera com `await` |
| 2 | API, rotas | `GET /api/artigos` vai para o controller dos artigos |
| 3 | API, controller | Lê `stockMaximo`, `"5"`, e converte-o para 5; chama o service |
| 4 | API, service | Pede ao repository os artigos com stock até 5 |
| 5 | API, repository | Executa `{ stock: { $lte: 5 } }` na coleção `artigos`, através do driver, com a cadeia de ligação lida do `.env` |
| 6 | MongoDB Atlas | Devolve os documentos que cumprem o filtro |
| 7 | API, controller | Responde 200 com a lista em JSON |
| 8 | browser (React) | Recebe o JSON, guarda-o no estado do componente e desenha a lista |

Repara no passo 5: a cadeia de ligação, com a palavra-passe, é usada só aí, dentro do servidor. Em nenhum dos oito passos ela viaja para o browser. É o que quer dizer "o segredo fica só no servidor", agora visto num pedido concreto.

## Erros frequentes

### npm run dev diz que não encontra o .env

```text
node: .env: not found
```

O script `dev` usa `--env-file=.env`, e não há `.env` na raiz do projeto. Cria-o a partir do `.env.example`. Confirma também o nome: tem de ser exatamente `.env`, sem nada antes nem depois.

### O ficheiro chama-se .env.txt ou .gitignore.txt

No Windows, alguns editores e o Explorador de Ficheiros acrescentam `.txt` ao nome sem o mostrar. O Node não encontra o `.env`, e o Git ignora um `.gitignore.txt`. Cria os ficheiros a partir do editor de código, e não do Bloco de Notas, e confirma o nome com `dir` ou no próprio editor.

### npm dev não funciona

```text
Unknown command: "dev"
```

Falta o `run`: `npm run dev`. Só o `start` (e poucos outros) dispensam o `run`. Se a mensagem for `Missing script: "dev"`, o script não existe no `package.json`, ou o nome está mal escrito; `npm run`, sozinho, mostra os scripts que existem.

### A API arranca na porta errada

O `process.env.PORT` está vazio, e a API usou a porta 3000 por omissão. Ou arrancaste com `npm start`, que não lê o `.env`, ou o nome da variável no `.env` é diferente do que o código lê: `PORTA` no ficheiro e `PORT` no código são duas variáveis diferentes.

### O git status mostra o .env ou a node_modules

O `.gitignore` não existe, tem outro nome, está noutra pasta, ou a regra está mal escrita. Não faças `git add` até a lista estar certa. Se já tiveres feito um commit com o `.env`, chama o professor: tirá-lo do histórico tem passos próprios, e se o `.env` tiver uma palavra-passe verdadeira, ela tem de ser mudada.

### O .env.example tem a palavra-passe verdadeira

É o erro mais perigoso deste tema, porque o `.env.example` vai para o Git de propósito. Deixa os valores secretos vazios, ou com um texto que mostre o formato sem ser verdadeiro.

### A cadeia de ligação ao Atlas no React

Num `.env` do projeto React, numa variável `VITE_`, ou escrita num componente. Vai para o browser de todos os utilizadores. O endereço do Atlas existe só no `.env` da API.

### Pôr tudo no controller

A tentação, quando o projeto ainda é pequeno, é escrever a regra e a consulta dentro da função da rota. Funciona hoje e espalha-se amanhã. Quando escreveres as camadas, pergunta em cada linha: isto é HTTP, regra ou base de dados?

## Verificar o que aprendeste

1. Desenha as três partes da tua aplicação. Em cada seta, escreve o que viaja e como (HTTP com JSON, ou o driver do MongoDB).
2. Que diferença há entre o que um servidor responde em Sistemas de Informação e o que a tua API responde?
3. Dá três razões para o React não falar diretamente com o Atlas.
4. O que faz cada uma das quatro camadas? Em qual delas não pode aparecer `req` nem `res`?
5. Em que camada fica a regra "não se vende mais do que o stock"? E a resposta 400 quando a venda é recusada?
6. Para que serve o script `dev`? Que faz cada uma das duas opções que ele passa ao Node?
7. Qual é a diferença entre `.env` e `.env.example`? O que acontece se o `.env` não existir e correres `npm run dev`?
8. O `.env` diz `PORT=3001`. De que tipo é `process.env.PORT`?
9. Porque é que o `.gitignore` tem de existir antes do primeiro commit?
10. Explica, passo a passo, o pedido `GET /api/estado`, desde que escreves o endereço até veres a resposta.

## O que vem a seguir

No tema 4, API Express e contratos, escreves as primeiras rotas da papelaria com as camadas que desenhaste neste tema: as rotas, o controller e o service, ainda com os artigos num array, sem base de dados. Vais escrever o contrato da API, que diz, para cada pedido, o que se envia e o que se recebe, incluindo os erros, e verificar as respostas 200, 400 e 404. Depois, no tema da ligação segura, o repository liga-se ao Atlas, com a cadeia de ligação no `.env` que preparaste agora.

Antes disso, faz o [laboratório](03-arquitetura-e-setup-node-laboratorio.md), em que preparas este esqueleto no teu computador, e a [ficha](03-arquitetura-e-setup-node-exercicios.md), com a aplicação do torneio de futsal.

## Para saber mais

Consultados a 7 de outubro de 2026:

- [Ficheiros .env no Node.js](https://nodejs.org/docs/latest-v24.x/api/environment_variables.html), na documentação oficial, em inglês: o formato do ficheiro e a opção `--env-file`.
- [Scripts do npm](https://docs.npmjs.com/cli/v11/using-npm/scripts), em inglês: o que é um script e como o npm os corre.
- [Livro Pro Git](https://git-scm.com/book/pt-pt/v2), em português: os capítulos 1 e 2 explicam o que é o Git e os comandos deste guia.

![Rodapé](../imagens/rodape.png)
