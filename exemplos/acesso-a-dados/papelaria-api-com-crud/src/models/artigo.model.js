// src/models/artigo.model.js: o modelo dos artigos da papelaria, no Mongoose.
// O schema descreve a forma dos documentos da coleção artigos e guarda as
// regras de cada campo: o que é obrigatório, os mínimos e as categorias.
// Tudo o que escreve artigos passa por estas regras: a API, o seed e os scripts.
import mongoose from "mongoose";

// As categorias que a papelaria vende. Um artigo de outra categoria é recusado.
const CATEGORIAS = ["Papel", "Escrita", "Desenho"];

const artigoSchema = new mongoose.Schema({
  nome: {
    type: String,
    // O segundo valor de cada regra é a mensagem que a API devolve quando
    // a regra falha. Sem ele, o Mongoose escrevia uma mensagem em inglês.
    required: [true, "O nome é obrigatório"],
    // O trim tira os espaços do início e do fim antes de verificar e guardar.
    // Um nome só com espaços fica vazio, e o required recusa-o.
    trim: true,
    maxlength: [60, "O nome tem no máximo 60 carateres"],
  },
  categoria: {
    type: String,
    required: [true, "A categoria é obrigatória"],
    enum: { values: CATEGORIAS, message: "A categoria tem de ser Papel, Escrita ou Desenho" },
  },
  stock: {
    type: Number,
    required: [true, "O stock é obrigatório"],
    min: [0, "O stock não pode ser negativo"],
  },
  stockMinimo: {
    type: Number,
    required: [true, "O stock mínimo é obrigatório"],
    min: [0, "O stock mínimo não pode ser negativo"],
  },
  precoCentimos: {
    type: Number,
    required: [true, "O preço é obrigatório"],
    min: [1, "O preço tem de ser de pelo menos 1 cêntimo"],
  },
});

// O terceiro argumento é o nome da coleção, escrito à mão, para o Mongoose
// não o inventar com as regras do plural em inglês.
export const Artigo = mongoose.model("Artigo", artigoSchema, "artigos");
