// src/controllers/artigos.controller.js: a ponte entre o HTTP e o service.
// Lê e verifica o que vem no pedido, chama o service e escolhe o código
// e o corpo da resposta, sempre em JSON, como diz o contrato da API.
import {
  listarArtigos,
  obterArtigo,
  artigosAbaixoDoMinimo,
  criarArtigo,
  alterarArtigo,
  apagarArtigo,
} from "../services/artigos.service.js";

// Os campos que o corpo de um pedido pode trazer, para criar ou alterar um
// artigo. É uma lista fechada: um campo que não esteja aqui é recusado.
const CAMPOS_DE_TEXTO = ["nome", "categoria"];
const CAMPOS_INTEIROS = ["stock", "stockMinimo", "precoCentimos"];

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

/**
 * Diz se um texto tem a forma de um identificador do MongoDB, um ObjectId
 * escrito em texto: 24 carateres, cada um de 0 a 9 ou de a a f.
 * Não diz se o artigo existe; isso só a base de dados sabe.
 * @param {string} texto o valor tal como chegou no caminho do pedido
 * @returns {boolean}
 */
function eIdentificador(texto) {
  if (typeof texto !== "string" || texto.length !== 24) {
    return false;
  }
  for (const carater of texto.toLowerCase()) {
    if (!"0123456789abcdef".includes(carater)) {
      return false;
    }
  }
  return true;
}

/**
 * Lê do corpo do pedido os campos de um artigo: só os da lista, cada um com o tipo certo.
 * Não verifica os valores, como o mínimo ou as categorias: essas são regras da
 * papelaria, e quem as verifica é o schema do modelo.
 * @param {unknown} corpo o req.body, tal como o express.json() o deixou
 * @returns {object} { erro } com a mensagem do primeiro problema, ou { dados } com os campos lidos
 */
function lerCamposDoArtigo(corpo) {
  // Sem corpo em JSON, o req.body fica undefined.
  if (typeof corpo !== "object" || corpo === null || Array.isArray(corpo)) {
    return { erro: "O corpo do pedido tem de ser um objeto JSON" };
  }
  // O objeto dados recebe só os campos da lista, copiados um a um.
  // O req.body nunca segue inteiro para o service.
  const dados = {};
  for (const campo of Object.keys(corpo)) {
    const valor = corpo[campo];
    if (CAMPOS_DE_TEXTO.includes(campo)) {
      // Um objeto no lugar de um texto, como { "$ne": null }, é recusado aqui.
      // Se chegasse a um filtro, seria lido como um operador do MongoDB.
      if (typeof valor !== "string") {
        return { erro: `O campo ${campo} tem de ser um texto` };
      }
    } else if (CAMPOS_INTEIROS.includes(campo)) {
      if (!Number.isInteger(valor)) {
        return { erro: `O campo ${campo} tem de ser um número inteiro` };
      }
    } else {
      return { erro: `O campo ${campo} não é aceite` };
    }
    dados[campo] = valor;
  }
  return { dados: dados };
}

/** GET /api/artigos, com os filtros opcionais ?categoria= e ?stockMaximo= */
export async function listar(req, res) {
  const filtros = {};

  if (req.query.categoria !== undefined) {
    // Repetido, como ?categoria=Papel&categoria=Escrita, o parâmetro chega
    // como um array, e não como um texto.
    if (typeof req.query.categoria !== "string") {
      res.status(400).json({ erro: "O parâmetro categoria tem de ser um texto, e só pode vir uma vez" });
      return;
    }
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

  const artigos = await listarArtigos(filtros);
  res.json(artigos);
}

/** GET /api/artigos/abaixo-do-minimo */
export async function abaixoDoMinimo(req, res) {
  const artigos = await artigosAbaixoDoMinimo();
  res.json(artigos);
}

/** GET /api/artigos/:id */
export async function obter(req, res) {
  const id = req.params.id;
  if (!eIdentificador(id)) {
    res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
    return;
  }
  const artigo = await obterArtigo(id);
  if (artigo === null) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
}

/** POST /api/artigos, com o artigo novo no corpo, em JSON */
export async function criar(req, res) {
  const leitura = lerCamposDoArtigo(req.body);
  if (leitura.erro) {
    res.status(400).json({ erro: leitura.erro });
    return;
  }
  // Se uma regra do schema falhar, o criarArtigo rejeita a promessa, e o
  // Express passa o erro ao middleware de erros, no server.js, que responde 400.
  const artigo = await criarArtigo(leitura.dados);
  res.status(201).json(artigo);
}

/** PATCH /api/artigos/:id, com os campos a alterar no corpo, em JSON */
export async function alterar(req, res) {
  const id = req.params.id;
  if (!eIdentificador(id)) {
    res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
    return;
  }
  const leitura = lerCamposDoArtigo(req.body);
  if (leitura.erro) {
    res.status(400).json({ erro: leitura.erro });
    return;
  }
  if (Object.keys(leitura.dados).length === 0) {
    res.status(400).json({ erro: "O pedido não traz nenhum campo para alterar" });
    return;
  }
  const artigo = await alterarArtigo(id, leitura.dados);
  if (artigo === null) {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  res.json(artigo);
}

/** DELETE /api/artigos/:id */
export async function apagar(req, res) {
  const id = req.params.id;
  if (!eIdentificador(id)) {
    res.status(400).json({ erro: "O identificador do artigo tem de ter 24 carateres, de 0 a 9 e de a a f" });
    return;
  }
  const resultado = await apagarArtigo(id);
  if (resultado === "nao-existe") {
    res.status(404).json({ erro: `Não existe o artigo ${id}` });
    return;
  }
  if (resultado === "tem-stock") {
    res.status(409).json({ erro: "Não se pode apagar um artigo que ainda tem stock" });
    return;
  }
  // 204: apagado, e a resposta não tem corpo.
  res.status(204).end();
}
