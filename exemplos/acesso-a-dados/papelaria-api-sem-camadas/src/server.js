// src/server.js: a API da papelaria, primeira versão, com tudo neste ficheiro.
// Os dados, a verificação dos pedidos, as regras da papelaria e as respostas
// estão juntos, como nos servidores de Sistemas de Informação. A versão
// seguinte separa-os em camadas, sem mudar nenhuma das respostas.
import express from "express";

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, a API usa a 3000.
const PORTA = process.env.PORT || 3000;

const app = express();

// Os artigos da papelaria, em memória. São dados temporários: no tema da
// ligação segura, passam a vir do MongoDB Atlas. São os mesmos que inseriste
// no Atlas, com um id numérico em vez do _id.
const artigos = [
  { id: 1, nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250 },
  { id: 2, nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60 },
  { id: 3, nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180 },
  { id: 4, nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35 },
  { id: 5, nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520 },
  { id: 6, nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95 },
  { id: 7, nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120 },
  { id: 8, nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450 },
];

/**
 * Converte um texto num inteiro, ou devolve null se o texto não for um inteiro.
 * @param {string} texto o valor tal como chegou no pedido
 * @returns {number | null}
 */
function paraInteiro(texto) {
  // Number("") e Number("  ") dão 0, e não NaN. Sem esta verificação,
  // ?stockMaximo= (o parâmetro sem valor) seria tratado como ?stockMaximo=0.
  // Um parâmetro repetido, como ?stockMaximo=1&stockMaximo=2, chega como
  // um array, que não é texto: também não é um inteiro.
  if (typeof texto !== "string" || texto.trim() === "") {
    return null;
  }
  const numero = Number(texto);
  return Number.isInteger(numero) ? numero : null;
}

// Rota de estado: serve para confirmar que a API está ligada e a responder.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "API da papelaria" });
});

// GET /api/artigos, com os filtros opcionais ?categoria= e ?stockMaximo=.
// Só se leem os dois parâmetros que o contrato prevê; os outros são ignorados.
app.get("/api/artigos", (req, res) => {
  let resultado = artigos;

  if (req.query.categoria !== undefined) {
    resultado = resultado.filter((artigo) => artigo.categoria === req.query.categoria);
  }

  if (req.query.stockMaximo !== undefined) {
    const stockMaximo = paraInteiro(req.query.stockMaximo);
    if (stockMaximo === null || stockMaximo < 0) {
      res.status(400).json({ erro: "O parâmetro stockMaximo tem de ser um número inteiro, zero ou maior" });
      return;
    }
    resultado = resultado.filter((artigo) => artigo.stock <= stockMaximo);
  }

  res.json(resultado);
});

// GET /api/artigos/abaixo-do-minimo. O caminho fixo vem antes do caminho com
// parâmetro. Ao contrário, /abaixo-do-minimo seria tratado como um :id, e daria 400.
app.get("/api/artigos/abaixo-do-minimo", (req, res) => {
  // Regra da papelaria: um artigo está abaixo do mínimo quando o stock é
  // menor do que o stock mínimo definido para ele, e é preciso encomendá-lo.
  const aEncomendar = artigos.filter((artigo) => artigo.stock < artigo.stockMinimo);
  res.json(aEncomendar);
});

// GET /api/artigos/:id
app.get("/api/artigos/:id", (req, res) => {
  const id = paraInteiro(req.params.id);
  if (id === null || id < 1) {
    res.status(400).json({ erro: "O identificador do artigo tem de ser um número inteiro positivo" });
    return;
  }
  const artigo = artigos.find((artigo) => artigo.id === id);
  if (!artigo) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
});

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a API: ${erro.message}`);
    return;
  }
  console.log(`API a correr em http://localhost:${PORTA}`);
});
