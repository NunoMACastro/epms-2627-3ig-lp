![Cabeçalho](../../../imagens/cabecalho.png)

# API da papelaria, num só ficheiro

A primeira versão da API da papelaria: o esqueleto do tema anterior, com as rotas do contrato escritas todas no `src/server.js`, ao lado dos artigos, que ainda estão num array. É usada no tema [04 API Express e contratos](../../../01-acesso-a-dados/04-api-express-e-contratos.md), e é o `server.js` do fim do passo 2 do exemplo guiado do guia.

Responde 200, 400 e 404 como o contrato diz, com uma exceção, que é de propósito. Um caminho que não existe, como `/api/artigo`, ainda recebe a página de erro do Express, em HTML, porque esta versão não tem o middleware final.

É o ponto de partida da separação em camadas. A versão seguinte dá as mesmas respostas, com o código dividido em rotas, controller, service e dados, e já responde em JSON ao caminho que não existe. Está em [papelaria-api-com-camadas](../papelaria-api-com-camadas/README.md), que tem também o [contrato da API](../papelaria-api-com-camadas/contrato-da-api.md).

## O que está nesta pasta

- `src/server.js`: o ficheiro único, com os artigos, a verificação dos pedidos, as regras da papelaria e as respostas das quatro rotas.
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

O que deves ver: o terminal mostra as duas linhas do npm e `API a correr em http://localhost:3000`. No browser, faz os pedidos do contrato, com o separador Rede das ferramentas de programador aberto e "Disable cache" marcado, para veres o código de cada resposta. A tabela do [passo 2 do exemplo guiado do guia](../../../01-acesso-a-dados/04-api-express-e-contratos.md#passo-2-tudo-no-serverjs-e-verificar) diz o que cada um deve responder. Para parar, Ctrl+C.

## Versões e compatibilidade

As versões usadas são o Node.js 26 e o npm 11. O `package-lock.json` fixa o Express 5.3.0.

![Rodapé](../../../imagens/rodape.png)
