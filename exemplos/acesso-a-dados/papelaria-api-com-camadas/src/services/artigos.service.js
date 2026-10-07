// src/services/artigos.service.js: as regras da papelaria sobre os artigos.
// Recebe valores simples e devolve valores simples. Não sabe nada de HTTP:
// não usa req nem res, e por isso pode ser usado e testado sem servidor.
import { artigos } from "../dados/artigos.dados.js";

/**
 * Devolve os artigos que cumprem os filtros recebidos.
 * Os filtros já chegam verificados pelo controller; os que faltam não se aplicam.
 * @param {object} filtros com categoria (texto) e stockMaximo (número), os dois opcionais
 * @returns {object[]} uma lista nova, possivelmente vazia
 */
export function listarArtigos(filtros) {
  let resultado = artigos;
  if (filtros.categoria !== undefined) {
    resultado = resultado.filter((artigo) => artigo.categoria === filtros.categoria);
  }
  if (filtros.stockMaximo !== undefined) {
    resultado = resultado.filter((artigo) => artigo.stock <= filtros.stockMaximo);
  }
  return resultado;
}

/**
 * Procura um artigo pelo id.
 * @param {number} id um inteiro positivo, já verificado pelo controller
 * @returns {object | null} o artigo, ou null se não existir
 */
export function obterArtigo(id) {
  const artigo = artigos.find((artigo) => artigo.id === id);
  if (!artigo) {
    return null;
  }
  return artigo;
}

/**
 * Regra da papelaria: um artigo está abaixo do mínimo quando o stock é
 * menor do que o stock mínimo definido para ele, e é preciso encomendá-lo.
 * @returns {object[]} os artigos a encomendar, possivelmente nenhum
 */
export function artigosAbaixoDoMinimo() {
  return artigos.filter((artigo) => artigo.stock < artigo.stockMinimo);
}
