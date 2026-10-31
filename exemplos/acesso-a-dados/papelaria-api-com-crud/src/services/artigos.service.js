// src/services/artigos.service.js: as regras da papelaria sobre os artigos.
// Recebe valores simples e devolve valores simples. Não sabe nada de HTTP,
// nem de MongoDB: pede os artigos ao repository.
import {
  procurarArtigos,
  procurarPorId,
  inserirArtigo,
  alterarPorId,
  apagarPorId,
} from "../repositories/artigos.repository.js";

/**
 * Devolve os artigos que cumprem os filtros recebidos.
 * Os filtros já chegam verificados pelo controller; os que faltam não se aplicam.
 * @param {object} filtros com categoria (texto) e stockMaximo (número), os dois opcionais
 * @returns {Promise<object[]>} os artigos, possivelmente nenhum
 */
export async function listarArtigos(filtros) {
  const condicoes = {};
  if (filtros.categoria !== undefined) {
    condicoes.categoria = filtros.categoria;
  }
  if (filtros.stockMaximo !== undefined) {
    // O stock máximo inclui o valor: com 4, entram os artigos com stock 4.
    condicoes.stockAte = filtros.stockMaximo;
  }
  const artigos = await procurarArtigos(condicoes);
  return artigos;
}

/**
 * Procura um artigo pelo _id.
 * @param {string} id um identificador já verificado pelo controller
 * @returns {Promise<object | null>} o artigo, ou null se não existir
 */
export async function obterArtigo(id) {
  const artigo = await procurarPorId(id);
  return artigo;
}

/**
 * Regra da papelaria: um artigo está abaixo do mínimo quando o stock é
 * menor do que o stock mínimo definido para ele, e é preciso encomendá-lo.
 * @returns {Promise<object[]>} os artigos a encomendar, possivelmente nenhum
 */
export async function artigosAbaixoDoMinimo() {
  const artigos = await procurarArtigos({});
  return artigos.filter((artigo) => artigo.stock < artigo.stockMinimo);
}

/**
 * Cria um artigo novo. As regras de cada campo estão no schema do modelo.
 * @param {object} dados os campos do artigo, já com o tipo verificado pelo controller
 * @returns {Promise<object>} o artigo criado
 */
export async function criarArtigo(dados) {
  const artigo = await inserirArtigo(dados);
  return artigo;
}

/**
 * Altera os campos recebidos de um artigo.
 * @param {string} id um identificador já verificado pelo controller
 * @param {object} dados os campos a alterar, já com o tipo verificado
 * @returns {Promise<object | null>} o artigo alterado, ou null se não existir
 */
export async function alterarArtigo(id, dados) {
  const artigo = await alterarPorId(id, dados);
  return artigo;
}

/**
 * Apaga um artigo, se a regra da papelaria o deixar.
 * @param {string} id um identificador já verificado pelo controller
 * @returns {Promise<string>} o que aconteceu: "apagado", "nao-existe" ou "tem-stock"
 */
export async function apagarArtigo(id) {
  const artigo = await procurarPorId(id);
  if (artigo === null) {
    return "nao-existe";
  }
  // Regra da papelaria: um artigo só sai do catálogo quando já não há
  // unidades na loja. Enquanto houver stock, ainda há o que vender.
  if (artigo.stock > 0) {
    return "tem-stock";
  }
  await apagarPorId(id);
  return "apagado";
}
