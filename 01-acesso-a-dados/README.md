![Cabeçalho](../imagens/cabecalho.png)

# Acesso a dados

Primeira área do ano, que corresponde ao módulo M14 do programa (Acesso a Bases de Dados). Aqui constróis a base da tua aplicação: a base de dados onde a informação fica guardada, o servidor que a usa e a API que o browser chama.

Os guias estão numerados pela ordem em que são dados. Um número que falta é de um tema que ainda não tem guia publicado. Cada tema pode ter até três documentos com o mesmo número: o guia, para ler e estudar; o laboratório, com o sufixo `-laboratorio`, para seguir passo a passo no computador; e a ficha de exercícios, com o sufixo `-exercicios`, para praticares sozinho.

| Guia | Assunto |
| --- | --- |
| [02-modelo-documental-e-consultas-no-atlas.md](02-modelo-documental-e-consultas-no-atlas.md) | Documentos, coleções, embutir ou referenciar, e primeiras consultas no MongoDB Atlas |
| [02-modelo-documental-e-consultas-no-atlas-laboratorio.md](02-modelo-documental-e-consultas-no-atlas-laboratorio.md) | Laboratório do mesmo tema: conta e cluster no Atlas, inserir documentos, consultas e referências |
| [02-modelo-documental-e-consultas-no-atlas-exercicios.md](02-modelo-documental-e-consultas-no-atlas-exercicios.md) | Ficha de exercícios do mesmo tema, com o torneio de futsal da escola |
| [03-arquitetura-e-setup-node.md](03-arquitetura-e-setup-node.md) | As três partes da aplicação, o papel do servidor e o segredo só no servidor, as camadas da API, e a preparação de um projeto Node: scripts, .env, .gitignore e Git |
| [03-arquitetura-e-setup-node-laboratorio.md](03-arquitetura-e-setup-node-laboratorio.md) | Laboratório do mesmo tema: o diagrama de camadas e o esqueleto da API da papelaria, até ao primeiro commit |
| [03-arquitetura-e-setup-node-exercicios.md](03-arquitetura-e-setup-node-exercicios.md) | Ficha de exercícios do mesmo tema, com a API do torneio de futsal |
| [04-api-express-e-contratos.md](04-api-express-e-contratos.md) | O contrato de uma API, uma primeira versão que o cumpre com tudo no server.js, a separação em camadas (as rotas, o controller e o service em ficheiros separados, com um router e a verificação à entrada no controller), e um formato único para os erros |
| [04-api-express-e-contratos-laboratorio.md](04-api-express-e-contratos-laboratorio.md) | Laboratório do mesmo tema: o contrato da API da papelaria, a primeira versão num só ficheiro e depois as camadas, verificados pedido a pedido |
| [04-api-express-e-contratos-exercicios.md](04-api-express-e-contratos-exercicios.md) | Ficha de exercícios do mesmo tema, com as equipas e os jogos do torneio de futsal, a partir do esqueleto da papelaria; os pontos ficam num desafio opcional |

A API da papelaria, pronta a correr, está nos exemplos em três versões: o [esqueleto](../exemplos/acesso-a-dados/papelaria-api/README.md) do tema 3, e as duas do tema 4, a [primeira versão, num só ficheiro](../exemplos/acesso-a-dados/papelaria-api-sem-camadas/README.md), e a [versão com as camadas](../exemplos/acesso-a-dados/papelaria-api-com-camadas/README.md).

Os documentos preparados para a aula de embutir ou referenciar, do tema 2, também estão nos [exemplos](../exemplos/acesso-a-dados/embutir-ou-referenciar/README.md).

![Rodapé](../imagens/rodape.png)
