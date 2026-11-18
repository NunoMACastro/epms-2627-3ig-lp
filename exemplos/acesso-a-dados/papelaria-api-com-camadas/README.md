![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria, com camadas

A API da papelaria com o contrato escrito e as rotas, o controller e o service dos artigos em ficheiros separados. É usada no tema [04 API Express e contratos](../../../01-acesso-a-dados/04-api-express-e-contratos.md), e a pasta `src` é a do fim do passo 6 do exemplo guiado do guia. Os artigos ainda estão num array, em `src/dados/`. A versão do tema 05, que os lê do MongoDB Atlas, está em [papelaria-api-com-crud](../papelaria-api-com-crud/README.md).

O esqueleto do tema anterior, só com a rota de estado, está em [papelaria-api](../papelaria-api/README.md). A primeira versão deste tema, com tudo no `server.js`, está em [papelaria-api-sem-camadas](../papelaria-api-sem-camadas/README.md). Dá as mesmas respostas, menos a do caminho que não existe, que ainda vem em HTML.

## O que está nesta pasta

- `contrato-da-api.md`: o contrato, com os pedidos que a API aceita e as respostas que dá.
- `src/server.js`: o arranque da API, com a rota de estado, a montagem das rotas dos artigos e o middleware final.
- `src/rotas/artigos.rotas.js`: que pedido vai para que função do controller.
- `src/controllers/artigos.controller.js`: lê e verifica o pedido, chama o service e responde.
- `src/services/artigos.service.js`: as regras da papelaria sobre os artigos.
- `src/dados/artigos.dados.js`: os artigos, por agora num array.
- `package.json` e `package-lock.json`: o projeto e as versões exatas dos pacotes.
- `.env.example` e `.gitignore`: a configuração sem segredos, e o que o Git ignora.

## Como correr

Precisas do Node.js 22 ou mais recente, e de internet para o `npm install`. Copia esta pasta para fora do repositório e, num terminal dentro dela:

```bash
npm install
cp .env.example .env
npm run dev
```

No Windows, na linha de comandos clássica (cmd), o segundo comando é `copy .env.example .env`.

O que deves ver: o terminal mostra as duas linhas do npm e `API a correr em http://localhost:3000`. No browser, faz os pedidos do contrato, com o separador Rede das ferramentas de programador aberto e "Disable cache" marcado, para veres o código de cada resposta. A tabela do [passo 7 do exemplo guiado do guia](../../../01-acesso-a-dados/04-api-express-e-contratos.md#passo-7-verificar-o-contrato) diz o que cada um deve responder. Para parar, Ctrl+C.

## Versões e compatibilidade

As versões usadas são o Node.js 26 e o npm 11. O `package-lock.json` fixa o Express 5.3.0.

![Rodapé](../../../imagens/rodape.png)
