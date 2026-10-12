// src/server.js: a API da papelaria, ligada ao MongoDB Atlas.
// É o servidor de Sistemas de Informação, já organizado como projeto, com um
// passo a mais: a lista dos artigos passa a vir da base de dados, através do
// Mongoose. A rota de detalhe ainda lê do array.
import express from "express";
import { ligarBaseDeDados } from "./db/mongoose.js";
import { Artigo } from "./models/artigo.model.js";

const app = express();

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, a API usa a 3000.
const PORTA = process.env.PORT || 3000;

// Os artigos em memória, com um id numérico. A lista já não os usa, porque vem
// da base. Ficam só para a rota de detalhe, até ao tema da ligação segura, em
// que o id numérico dá lugar ao _id que o MongoDB dá a cada documento.
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

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rota de estado: serve para confirmar que a API está ligada e a responder.
// Responde em JSON, como todas as rotas de uma API.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "API da papelaria" });
});

// Lista de artigos, lida da base de dados. Com ?categoria=Papel, só os dessa
// categoria: o filtro é o mesmo documento que escreveste na barra de consultas
// do Atlas, { categoria: "Papel" }.
// A função é async porque perguntar à base demora: o await espera pela
// resposta do Atlas sem parar o servidor, que continua a atender outros pedidos.
app.get("/api/artigos", async (req, res) => {
  const categoria = req.query.categoria;
  if (categoria) {
    const daCategoria = await Artigo.find({ categoria });
    res.json(daCategoria);
    return;
  }
  const todos = await Artigo.find();
  res.json(todos);
});

// Um artigo: GET /api/artigos/2. O :id é um parâmetro de rota.
// Ainda lê do array, por isso usa o id de 1 a 8, e não o _id da base.
app.get("/api/artigos/:id", (req, res) => {
  const id = Number(req.params.id); // chega como texto, "2", e passa a número
  if (!Number.isInteger(id) || id < 1) {
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

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
// Numa API, até o "não encontrado" é uma resposta em JSON.
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Primeiro a ligação à base, e só depois o servidor: uma API que não chega aos
// dados não deve começar a aceitar pedidos. Se a ligação falhar, a API termina
// com a razão escrita no terminal.
try {
  await ligarBaseDeDados();
} catch (erro) {
  console.error(`Não foi possível ligar à base de dados: ${erro.message}`);
  process.exit(1);
}

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar a API: ${erro.message}`);
    return;
  }
  console.log(`API a correr em http://localhost:${PORTA}`);
});
