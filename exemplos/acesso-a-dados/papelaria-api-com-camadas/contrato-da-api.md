![Cabeçalho](../../../imagens/cabecalho.png)

# Contrato da API da papelaria

Versão com dados temporários, do tema API Express e contratos. Todas as respostas, de sucesso e de erro, são JSON. Os pedidos e as respostas que aqui não estão não fazem parte da API.

## Formato dos erros

Todas as respostas de erro têm esta forma, com uma mensagem para quem usa a aplicação:

```json
{ "erro": "Não existe o artigo 99" }
```

## O artigo

Cada artigo, nas respostas, tem esta forma:

```json
{ "id": 1, "nome": "Caderno A4 quadriculado", "categoria": "Papel", "stock": 12, "stockMinimo": 5, "precoCentimos": 250 }
```

| Campo | Tipo | Significado |
| --- | --- | --- |
| `id` | inteiro | identificador do artigo, 1 ou mais |
| `nome` | texto | nome do artigo |
| `categoria` | texto | categoria, como `Papel`, `Escrita` ou `Desenho` |
| `stock` | inteiro | unidades em loja |
| `stockMinimo` | inteiro | abaixo deste valor, o artigo tem de ser encomendado |
| `precoCentimos` | inteiro | preço em cêntimos: 250 são 2,50 € |

## GET /api/estado

Confirma que a API está ligada. Sem parâmetros.

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | sempre | `{ "estado": "ok", "aplicacao": "API da papelaria" }` |

## GET /api/artigos

Lista os artigos.

| Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
| --- | --- | --- | --- | --- |
| `categoria` | pesquisa | texto | não | qualquer; só aparecem os artigos dessa categoria |
| `stockMaximo` | pesquisa | inteiro | não | 0 ou mais; só aparecem os artigos com stock até esse valor, incluído |

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | os parâmetros são válidos | lista de artigos, possivelmente vazia |
| 400 | `stockMaximo` vem vazio (`?stockMaximo=`), não é um inteiro, ou é negativo | erro |

## GET /api/artigos/abaixo-do-minimo

Lista os artigos com stock abaixo do stock mínimo, que é preciso encomendar. Sem parâmetros.

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | sempre | lista de artigos, possivelmente vazia |

## GET /api/artigos/:id

Mostra um artigo.

| Parâmetro | Onde | Tipo | Obrigatório | Valores válidos |
| --- | --- | --- | --- | --- |
| `id` | caminho | inteiro | sim | 1 ou mais |

| Código | Quando | Corpo |
| --- | --- | --- |
| 200 | o artigo existe | o artigo |
| 400 | o `id` não é um inteiro positivo | erro |
| 404 | não existe nenhum artigo com esse `id` | erro |

## Qualquer outro pedido

| Código | Quando | Corpo |
| --- | --- | --- |
| 404 | o método e o caminho não existem na API | `{ "erro": "Rota não encontrada" }` |

## Verificação

Todas as linhas deste contrato foram verificadas com a API ligada, a 9 de outubro de 2026, com os oito artigos dos dados temporários. A tabela dos pedidos e das respostas está no passo 7 do exemplo guiado do guia.

![Rodapé](../../../imagens/rodape.png)
