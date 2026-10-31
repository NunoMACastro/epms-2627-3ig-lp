// src/repositories/artigos.repository.js: o acesso aos artigos na base de dados.
// Das camadas da API, é a única que usa o modelo Artigo e que escreve filtros
// na linguagem do MongoDB, como o $lte. Recebe valores já verificados.
import { Artigo } from "../models/artigo.model.js";

/**
 * Procura os artigos que cumprem as condições recebidas.
 * As condições que faltam não se aplicam; sem nenhuma, vêm todos os artigos.
 * @param {object} condicoes com categoria (texto) e stockAte (número), os dois opcionais
 * @returns {Promise<object[]>} os artigos encontrados, possivelmente nenhum
 */
export async function procurarArtigos(condicoes) {
  // O filtro é o mesmo que escreverias na barra do Atlas, construído aqui a
  // partir das condições. Nenhum valor do pedido entra nele sem ter sido verificado.
  const filtro = {};
  if (condicoes.categoria !== undefined) {
    filtro.categoria = condicoes.categoria;
  }
  if (condicoes.stockAte !== undefined) {
    filtro.stock = { $lte: condicoes.stockAte };
  }
  const artigos = await Artigo.find(filtro);
  return artigos;
}

/**
 * Procura um artigo pelo _id.
 * @param {string} id um identificador com a forma de um ObjectId, já verificado pelo controller
 * @returns {Promise<object | null>} o artigo, ou null se não existir
 */
export async function procurarPorId(id) {
  // O findById devolve o documento, ou null quando nenhum tem este _id.
  const artigo = await Artigo.findById(id);
  return artigo;
}

/**
 * Insere um artigo novo. O schema verifica as regras de cada campo antes de
 * inserir; se alguma falhar, a promessa é rejeitada com um ValidationError.
 * @param {object} dados os campos do artigo, só os da lista do controller
 * @returns {Promise<object>} o artigo inserido, já com o _id que o MongoDB lhe deu
 */
export async function inserirArtigo(dados) {
  const artigo = await Artigo.create(dados);
  return artigo;
}

/**
 * Altera os campos recebidos de um artigo, e deixa os outros como estão.
 * @param {string} id um identificador com a forma de um ObjectId, já verificado
 * @param {object} dados os campos a alterar, só os da lista do controller
 * @returns {Promise<object | null>} o artigo depois da alteração, ou null se não existir
 */
export async function alterarPorId(id, dados) {
  // Sem as duas opções, o findByIdAndUpdate devolvia o artigo como estava
  // antes da alteração, e não verificava as regras do schema, que por omissão
  // só correm quando um documento é criado.
  const artigo = await Artigo.findByIdAndUpdate(id, dados, {
    returnDocument: "after",
    runValidators: true,
  });
  return artigo;
}

/**
 * Apaga um artigo.
 * @param {string} id um identificador com a forma de um ObjectId, já verificado
 * @returns {Promise<void>} cumprida quando o artigo foi apagado
 */
export async function apagarPorId(id) {
  await Artigo.findByIdAndDelete(id);
}
