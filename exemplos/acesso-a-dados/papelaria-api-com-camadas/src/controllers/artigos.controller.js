// src/controllers/artigos.controller.js: a ponte entre o HTTP e o service.
// Lê e verifica o que vem no pedido, chama o service e escolhe o código
// e o corpo da resposta, sempre em JSON, como diz o contrato da API.
import { listarArtigos, obterArtigo, artigosAbaixoDoMinimo } from "../services/artigos.service.js";

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

/** GET /api/artigos, com os filtros opcionais ?categoria= e ?stockMaximo= */
export function listar(req, res) {
  const filtros = {};

  if (req.query.categoria !== undefined) {
    filtros.categoria = req.query.categoria;
  }

  if (req.query.stockMaximo !== undefined) {
    const stockMaximo = paraInteiro(req.query.stockMaximo);
    if (stockMaximo === null || stockMaximo < 0) {
      res.status(400).json({ erro: "O parâmetro stockMaximo tem de ser um número inteiro, zero ou maior" });
      return;
    }
    filtros.stockMaximo = stockMaximo;
  }

  res.json(listarArtigos(filtros));
}

/** GET /api/artigos/abaixo-do-minimo */
export function abaixoDoMinimo(req, res) {
  res.json(artigosAbaixoDoMinimo());
}

/** GET /api/artigos/:id */
export function obter(req, res) {
  const id = paraInteiro(req.params.id);
  if (id === null || id < 1) {
    res.status(400).json({ erro: "O identificador do artigo tem de ser um número inteiro positivo" });
    return;
  }
  const artigo = obterArtigo(id);
  if (artigo === null) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
}
