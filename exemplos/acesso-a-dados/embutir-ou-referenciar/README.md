![Cabeçalho](../../../imagens/cabecalho.png)

# Embutir ou referenciar, em seis documentos

Seis documentos curtos que mostram quando uma informação fica dentro de um documento e quando fica noutro, ligada por uma referência. São usados no tema [02 Modelo documental e primeiras consultas no Atlas](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md), e a matéria está na [Parte 3 do guia](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md#parte-3-desenhar-os-documentos-de-uma-aplicação).

São versões curtas dos documentos do guia: cada ficheiro mostra uma só ideia, e cada artigo tem só os campos de que ela precisa.

## O que está nesta pasta

- [`1-documento-embutido.js`](1-documento-embutido.js): um artigo com a localização embutida, e sem `_id`. No guia: [Um campo embutido escreve-se com um ponto](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md#um-campo-embutido-escreve-se-com-um-ponto) e [O campo `_id` e o ObjectId](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md#o-campo-_id-e-o-objectid).
- [`2-fornecedor-copiado.js`](2-fornecedor-copiado.js): o mesmo fornecedor copiado para dentro de três artigos. No guia: [Duas perguntas decidem entre embutir e referenciar](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md#duas-perguntas-decidem-entre-embutir-e-referenciar).
- [`3-fornecedor-referenciado.js`](3-fornecedor-referenciado.js): o fornecedor numa coleção à parte, e cada artigo só com o `fornecedorId`. No guia: [Seguir uma referência pede uma segunda consulta](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md#seguir-uma-referência-pede-uma-segunda-consulta).
- [`4-vendas-dentro-do-artigo.js`](4-vendas-dentro-do-artigo.js): as vendas de um artigo guardadas dentro dele. No guia: [Duas perguntas decidem entre embutir e referenciar](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md#duas-perguntas-decidem-entre-embutir-e-referenciar).
- [`5-venda-sem-copia.js`](5-venda-sem-copia.js): uma venda de outubro que só guarda a referência ao artigo. No guia: [Uma venda guarda uma cópia do preço, de propósito](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md#uma-venda-guarda-uma-cópia-do-preço-de-propósito).
- [`6-venda-com-copia.js`](6-venda-com-copia.js): a mesma venda, com uma cópia do nome e do preço desse dia. No guia: [Uma venda guarda uma cópia do preço, de propósito](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md#uma-venda-guarda-uma-cópia-do-preço-de-propósito).

Os ficheiros formam três pares: o 2 e o 3, com o fornecedor; o 4 e o 5, com as vendas; o 5 e o 6, com o preço. Em cada par, o primeiro mostra, de propósito, uma escolha que dá problemas, e o segundo mostra a que o evita. Ao leres o primeiro de cada par, faz-lhe as duas perguntas do guia: "que ecrã vai ler estes dados?" e "que dados mudam ao mesmo tempo?". Depois, pensa que problema aparece e quando, e vê no segundo como se evita.

A resposta: no 2, o mesmo fornecedor tem dois telefones diferentes, porque alguém mudou o número num artigo e esqueceu os outros. No 4, a lista das vendas cresce a cada venda, sem limite, dentro do artigo, e um documento não pode passar de 16 MiB. No 5, a venda de outubro só guarda a referência ao artigo. Quando o preço do caderno sobe em janeiro, a conta dá 2 vezes 280, 560 cêntimos, e não os 500 que o cliente pagou.

Nos exemplos 3, 5 e 6, os identificadores estão escritos à mão, só para os documentos se poderem referir uns aos outros sem copiares nada. Na tua aplicação, deixas o MongoDB criá-los, como o guia explica.

## Como correr

Os seis leem-se aqui no GitHub ou no editor, sem instalar nada. Só vale a pena inserir o exemplo 3, para fazeres as duas consultas que dão o telefone do fornecedor do furador.

1. No Data Explorer do teu cluster, cria a base de dados `exemplos`, com a coleção `fornecedores`, como criaste a `papelaria` na [fase 2 do laboratório do tema 02](../../../01-acesso-a-dados/laboratorios/02-modelo-documental-e-consultas-no-atlas-laboratorio.md#fase-2-o-mongodb-guarda-a-informação-em-documentos). Fica separada da `papelaria`, para as consultas do laboratório não mudarem.
2. Na coleção `fornecedores`, com "Add Data" e "Insert Document", cola o primeiro array do ficheiro, sem a linha do comentário que está por cima dele.
3. Cria a coleção `artigos` na base `exemplos`, como criaste a `fornecedores` na [fase 7 do laboratório do tema 02](../../../01-acesso-a-dados/laboratorios/02-modelo-documental-e-consultas-no-atlas-laboratorio.md#fase-7-a-informação-relacionada-embute-se-ou-referencia-se), e cola nela o segundo array, também sem o comentário.

O que deves ver: na coleção `fornecedores`, um fornecedor; na coleção `artigos`, três artigos, cada um com o `fornecedorId` desse fornecedor.

Depois, faz as duas consultas na barra de consulta: uma na coleção `artigos`, que encontra o furador, e outra na coleção `fornecedores`, com o valor que a primeira te deu. O que deves ver: a primeira mostra o furador, com o `fornecedorId` `ObjectId('670600000000000000000001')`; a segunda mostra a Distribuidora Fictícia, com o telefone 210000222. Se a segunda não encontrar nada, confirma que escreveste o valor com o `ObjectId(...)`, e não só entre aspas.

## Versões e compatibilidade

Os ficheiros estão escritos como os documentos do laboratório do tema 02, na forma que a janela "Insert Document" do Data Explorer aceita. Os nomes dos campos não têm aspas. As datas escrevem-se com o `ISODate(...)`, e os identificadores com o `ObjectId(...)`, dois tipos que o JSON não tem ([Um documento guarda tipos que o JSON não tem](../../../01-acesso-a-dados/02-modelo-documental-e-consultas-no-atlas.md#um-documento-guarda-tipos-que-o-json-não-tem)).

![Rodapé](../../../imagens/rodape.png)
