![Cabeçalho](../../../imagens/cabecalho.png)

# Contrato da API da papelaria

Versão ligada ao MongoDB Atlas, do tema Ligação segura, CRUD e regras de domínio. A API cria, lê, altera e apaga os artigos da base de teste. Todas as respostas, de sucesso e de erro, são JSON, menos a de um artigo apagado, que não tem corpo. Os pedidos e as respostas que aqui não estão não fazem parte da API.

## Formato dos erros

Todas as respostas de erro têm esta forma, com uma mensagem para quem usa a aplicação:

```json
{ "erro": "Não existe o artigo 000000000000000000000000" }
```

Qualquer pedido pode responder 500, com `{ "erro": "Erro interno do servidor" }`, quando a falha é do servidor, e não de quem pediu.

## O artigo

Cada artigo, nas respostas, tem esta forma:

```json
{ "_id": "6ae50cc456457b28519e9054", "nome": "Caderno A4 quadriculado", "categoria": "Papel", "stock": 12, "stockMinimo": 5, "precoCentimos": 250, "__v": 0 }
```

| Campo | Tipo | Significado e regras |
| --- | --- | --- |
| `_id` | texto | identificador que o MongoDB deu ao artigo: 24 carateres, de 0 a 9 e de a a f |
| `nome` | texto | nome do artigo; obrigatório; até 60 carateres, sem os espaços do início e do fim |
| `categoria` | texto | `Papel`, `Escrita` ou `Desenho`; obrigatório |
| `stock` | inteiro | unidades em loja; obrigatório; 0 ou mais |
| `stockMinimo` | inteiro | abaixo deste valor, o artigo tem de ser encomendado; obrigatório; 0 ou mais |
| `precoCentimos` | inteiro | preço em cêntimos, em que 250 são 2,50 €; obrigatório; 1 ou mais |
| `__v` | inteiro | número de versão que o Mongoose acrescenta; não se envia |

## GET /api/estado

Confirma que a API está ligada. Sem parâmetros.

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | sempre | `{ "estado": "ok", "aplicacao": "API da papelaria" }` |

## GET /api/artigos

Lista os artigos.

| Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
| --- | --- | --- | --- | --- |
| `categoria` | pesquisa | texto | não | qualquer, uma só vez; só aparecem os artigos dessa categoria |
| `stockMaximo` | pesquisa | inteiro | não | 0 ou mais; só aparecem os artigos com stock até esse valor, incluído |

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | os parâmetros são válidos | lista de artigos, possivelmente vazia |
| 400 | `categoria` vem repetida, ou `stockMaximo` vem vazio, não é um inteiro, ou é negativo | erro |

## GET /api/artigos/abaixo-do-minimo

Lista os artigos com stock abaixo do stock mínimo, que é preciso encomendar. Sem parâmetros.

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | sempre | lista de artigos, possivelmente vazia |

## GET /api/artigos/:id

Mostra um artigo.

| Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
| --- | --- | --- | --- | --- |
| `id` | caminho | texto | sim | 24 carateres, de 0 a 9 e de a a f |

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | o artigo existe | o artigo |
| 400 | o `id` não tem a forma de um ObjectId | erro |
| 404 | não existe nenhum artigo com esse `_id` | erro |

## POST /api/artigos

Cria um artigo. O corpo, em JSON, traz os cinco campos do artigo, e só esses: `nome`, `categoria`, `stock`, `stockMinimo` e `precoCentimos`, com os tipos e as regras da tabela do artigo.

| Código | Quando | Corpo |
| --- | --- | --- |
| 201 | o artigo foi criado | o artigo criado, com o `_id` |
| 400 | o corpo não é JSON, traz um campo que não é aceite ou com o tipo errado, falta um campo ou um valor não cumpre as regras | erro |

## PATCH /api/artigos/:id

Altera os campos que vierem no corpo, e deixa os outros como estão. O corpo, em JSON, traz um ou mais dos cinco campos do artigo, com os tipos e as regras da tabela do artigo.

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | o artigo foi alterado | o artigo depois da alteração |
| 400 | o `id` não tem a forma de um ObjectId, o corpo não traz nenhum campo, ou traz um campo que não é aceite, com o tipo errado ou que não cumpre as regras | erro |
| 404 | não existe nenhum artigo com esse `_id` | erro |

## DELETE /api/artigos/:id

Apaga um artigo. Um artigo só se apaga quando o stock é 0.

| Código | Quando | Corpo |
| --- | --- | --- |
| 204 | o artigo foi apagado | sem corpo |
| 400 | o `id` não tem a forma de um ObjectId | erro |
| 404 | não existe nenhum artigo com esse `_id` | erro |
| 409 | o artigo ainda tem stock | erro |

## Qualquer outro pedido

| Código | Quando | Corpo |
| --- | --- | --- |
| 404 | não há nenhuma rota com esse método e esse caminho | `{ "erro": "Rota não encontrada" }` |

![Rodapé](../../../imagens/rodape.png)
