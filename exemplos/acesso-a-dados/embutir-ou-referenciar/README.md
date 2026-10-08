![Cabeçalho](../../../imagens/cabecalho.png)

# Documentos da aula de embutir ou referenciar

Estes são os documentos mostrados na aula do [modelo documental](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md), na parte de embutir ou referenciar. A matéria está explicada no guia, nas secções "Embutir ou referenciar", "Como decidir", "Copiar de propósito" e "O MongoDB não verifica as referências".

São versões mais curtas dos documentos do guia: cada artigo tem só os campos de que o exemplo precisa, e cada ficheiro mostra uma ideia só. Os artigos, o fornecedor e os telefones são fictícios.

Cada ficheiro está escrito na mesma sintaxe do laboratório, a que a janela "Insert Document" do Data Explorer aceita. Para os perceberes, basta lê-los, aqui no GitHub ou no editor. Se quiseres experimentar o exemplo 3 no teu cluster, cria uma base de dados `exemplos`, separada da `papelaria`, e cola um array de cada vez, na coleção que o comentário por cima dele indica, sem a linha do comentário. Os exemplos 4, 5 e 6 são só para ler: não precisas de os inserir.

| Ficheiro | O que mostra | No guia |
| --- | --- | --- |
| `1-documento-embutido.js` | Um artigo com a localização embutida, e sem `_id` | "Embutir ou referenciar" e "O campo _id e o ObjectId" |
| `2-fornecedor-copiado.js` | O mesmo fornecedor copiado para dentro de três artigos, depois de o telefone ter mudado | "Como decidir" |
| `3-fornecedor-referenciado.js` | O fornecedor numa coleção à parte, e cada artigo só com o `fornecedorId` | "Embutir ou referenciar", o parágrafo sobre seguir a referência |
| `4-vendas-dentro-do-artigo.js` | As vendas de um artigo guardadas dentro dele | "Como decidir", a regra do crescimento |
| `5-venda-sem-copia.js` | Uma venda de outubro que só guarda a referência ao artigo, depois de o preço subir em janeiro | "Copiar de propósito" |
| `6-venda-com-copia.js` | A mesma venda, com uma cópia do nome e do preço desse dia | "Copiar de propósito" |

Os exemplos 2, 4 e 5 mostram de propósito uma escolha que dá problemas, e os exemplos 3 e 6 mostram a escolha que os evita. Para cada um, responde às duas perguntas do guia, "que ecrã vai ler estes dados?" e "que dados mudam ao mesmo tempo?", e diz que problema aparece e quando.

No exemplo 3, escreve as duas leituras que a aplicação tem de fazer para mostrar o furador com o telefone do fornecedor: o filtro na coleção `artigos` e o filtro na coleção `fornecedores`.

[Voltar à área de acesso a dados](../../../01-acesso-a-dados/README.md)

![Rodapé](../../../imagens/rodape.png)
