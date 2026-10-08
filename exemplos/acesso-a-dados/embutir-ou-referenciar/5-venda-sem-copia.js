// Coleção artigos: o preço do caderno subiu em janeiro, de 250 para 280 cêntimos
[
  { _id: ObjectId('670600000000000000000010'), nome: "Caderno A4 quadriculado", precoCentimos: 280 }
]

// Coleção vendas: uma venda de outubro, que só guarda a referência ao artigo
[
  {
    data: ISODate('2026-10-01T10:15:00Z'),
    linhas: [
      { artigoId: ObjectId('670600000000000000000010'), quantidade: 2 }
    ]
  }
]
