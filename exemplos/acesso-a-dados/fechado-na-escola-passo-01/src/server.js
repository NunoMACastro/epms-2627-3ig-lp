// src/server.js: o servidor do jogo Fechado na escola.
// Uma API em JSON, com as cenas da história lidas do MongoDB Atlas através
// do Mongoose. Por agora, está tudo neste ficheiro.
import express from "express";
import { ligarBaseDeDados } from "./db/mongoose.js";
import { Cena } from "./models/cena.model.js";

const app = express();

// A porta vem do ambiente: em desenvolvimento, do ficheiro .env.
// Se não estiver definida, o jogo usa a 3000.
const PORTA = process.env.PORT || 3000;

// Middleware de registo: escreve no terminal cada pedido que chega,
// e passa-o à frente. Está antes das rotas, para ver todos os pedidos.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rota de estado: serve para confirmar que o servidor está ligado e a responder.
app.get("/api/estado", (req, res) => {
  res.json({ estado: "ok", aplicacao: "Fechado na escola" });
});

// Todas as cenas da história, lidas da base de dados.
app.get("/api/cenas", async (req, res) => {
  const cenas = await Cena.find({});
  res.json(cenas);
});

// Uma cena: GET /api/cenas/corredor. O :codigo é um parâmetro de rota, e
// procura-se no campo codigo de cada documento, e não no _id.
app.get("/api/cenas/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  // O find devolve sempre uma lista. Como não há duas cenas com o mesmo
  // código, a lista vem com uma cena, ou vazia, se o código não existir.
  const encontradas = await Cena.find({ codigo: codigo });
  if (encontradas.length === 0) {
    res.status(404).json({ erro: `Não existe a cena ${codigo}` });
    return;
  }
  res.json(encontradas[0]);
});

// Middleware final: só chega aqui um pedido a que nenhuma rota respondeu.
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Primeiro a ligação à base, e só depois o servidor: um jogo que não
// chega às cenas não deve começar a aceitar pedidos.
try {
  await ligarBaseDeDados();
} catch (erro) {
  console.error(`Não foi possível ligar à base de dados: ${erro.message}`);
  process.exit(1);
}

app.listen(PORTA, (erro) => {
  if (erro) {
    console.error(`Não foi possível ligar o servidor: ${erro.message}`);
    return;
  }
  console.log(`Fechado na escola em http://localhost:${PORTA}`);
});
