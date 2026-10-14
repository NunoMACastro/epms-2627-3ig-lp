![Cabeçalho](../../../imagens/cabecalho.png)

# Documentos da aula de embutir ou referenciar

Os documentos preparados para a aula de embutir ou referenciar, no tema [02 Modelo documental e primeiras consultas no Atlas](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md). A matéria está explicada no guia, nas secções "A informação relacionada embute-se ou referencia-se", "Como decidir", "Copiar de propósito" e "O MongoDB não verifica as referências".

São versões mais curtas dos documentos do guia: cada artigo tem só os campos de que o exemplo precisa, e cada ficheiro mostra uma ideia só. Os artigos, o fornecedor e os telefones são fictícios.

## O que está nesta pasta

- `1-documento-embutido.js`: um artigo com a localização embutida, e sem `_id`. No guia, "A informação relacionada embute-se ou referencia-se" e "O campo _id e o ObjectId".
- `2-fornecedor-copiado.js`: o mesmo fornecedor copiado para dentro de três artigos, depois de o telefone ter mudado. No guia, "Como decidir".
- `3-fornecedor-referenciado.js`: o fornecedor numa coleção à parte, e cada artigo só com o `fornecedorId`. No guia, o parágrafo sobre seguir a referência.
- `4-vendas-dentro-do-artigo.js`: as vendas de um artigo guardadas dentro dele. No guia, "Como decidir", a condição de não crescer sem limite.
- `5-venda-sem-copia.js`: uma venda de outubro que só guarda a referência ao artigo, depois de o preço subir em janeiro. No guia, "Copiar de propósito".
- `6-venda-com-copia.js`: a mesma venda, com uma cópia do nome e do preço desse dia. No guia, "Copiar de propósito".

Os exemplos 2, 4 e 5 mostram de propósito uma escolha que dá problemas, e os exemplos 3 e 6 mostram a escolha que os evita. Para cada um, responde às duas perguntas do guia, "que ecrã vai ler estes dados?" e "que dados mudam ao mesmo tempo?", e diz que problema aparece e quando. No exemplo 3, escreve as duas consultas que a aplicação tem de fazer para mostrar o furador com o telefone do fornecedor. São o filtro na coleção `artigos` e o filtro na coleção `fornecedores`.

## Como correr

Para os perceberes, basta lê-los, aqui no GitHub ou no editor. Cada ficheiro está escrito na sintaxe que a janela "Insert Document" (inserir documento) do Data Explorer aceita, e cada array tem por cima um comentário com a coleção onde entra.

Se quiseres experimentar o exemplo 3 no teu cluster, cria uma base de dados `exemplos`, separada da `papelaria`. Cola um array de cada vez, na coleção que o comentário por cima dele indica, sem a linha do comentário. Os exemplos 4, 5 e 6 são só para ler: não precisas de os inserir.

O que deves ver: na coleção `fornecedores`, um fornecedor; na coleção `artigos`, três artigos, cada um com o `fornecedorId` desse fornecedor.

## Versões com que foi testado

Os seis ficheiros foram inseridos tal como estão num MongoDB 9.0.4 instalado no próprio computador, com o mongosh 2.13.0, a 14 de outubro de 2026. Deram o que o guia explica. Antes, a 8 de outubro, num MongoDB 8.2. Não foram experimentados na janela de inserção do Atlas.

[Voltar à área de acesso a dados](../../../01-acesso-a-dados/README.md)

![Rodapé](../../../imagens/rodape.png)
