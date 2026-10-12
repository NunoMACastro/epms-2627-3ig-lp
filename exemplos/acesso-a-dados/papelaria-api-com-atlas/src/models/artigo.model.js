// src/models/artigo.model.js: o modelo dos artigos da papelaria, no Mongoose.
// O schema descreve a forma dos documentos da coleção artigos, a mesma que
// inseriste no Atlas: cada campo e o seu tipo. O modelo é o que o resto da API
// usa para falar com essa coleção.
import mongoose from "mongoose";

const artigoSchema = new mongoose.Schema({
  nome: String,
  categoria: String,
  stock: Number,
  stockMinimo: Number,
  precoCentimos: Number,
  // A localização está embutida: é um documento dentro do artigo, e o schema
  // descreve-a da mesma forma, com os seus próprios campos.
  localizacao: {
    corredor: String,
    prateleira: Number,
  },
  // A referência ao fornecedor, que só a Cola em bastão tem, desde o
  // laboratório do Atlas: guarda o _id de um documento da coleção fornecedores.
  fornecedorId: mongoose.Schema.Types.ObjectId,
});

// O terceiro argumento é o nome da coleção. Sem ele, o Mongoose inventava o
// nome a partir do nome do modelo, com as regras do plural em inglês: "Artigo"
// dava "artigos", por sorte, mas "Fornecedor" dava "fornecedors", e as
// consultas iam a uma coleção vazia. Escrever o nome evita a surpresa.
export const Artigo = mongoose.model("Artigo", artigoSchema, "artigos");
