// src/seed.js: reconstrói a base de teste da papelaria com os oito artigos.
// Corre-se à parte, com npm run seed. Apaga primeiro os artigos que lá
// estiverem, por isso pode correr-se as vezes que for preciso: depois de cada
// experiência, a base volta a ficar como estava no início.
import mongoose from "mongoose";
import { ligarBaseDeDados } from "./db/mongoose.js";
import { Artigo } from "./models/artigo.model.js";

// Os artigos da papelaria, os mesmos do laboratório do Atlas, sem o _id:
// o MongoDB dá um a cada artigo quando o insere.
const artigos = [
  { nome: "Caderno A4 quadriculado", categoria: "Papel", stock: 12, stockMinimo: 5, precoCentimos: 250 },
  { nome: "Esferográfica azul", categoria: "Escrita", stock: 3, stockMinimo: 10, precoCentimos: 60 },
  { nome: "Bloco de notas A5", categoria: "Papel", stock: 0, stockMinimo: 4, precoCentimos: 180 },
  { nome: "Lápis HB", categoria: "Escrita", stock: 25, stockMinimo: 10, precoCentimos: 35 },
  { nome: "Resma de papel A4", categoria: "Papel", stock: 4, stockMinimo: 3, precoCentimos: 520 },
  { nome: "Marcador fluorescente", categoria: "Escrita", stock: 8, stockMinimo: 10, precoCentimos: 95 },
  { nome: "Régua de 30 cm", categoria: "Desenho", stock: 6, stockMinimo: 3, precoCentimos: 120 },
  { nome: "Compasso escolar", categoria: "Desenho", stock: 1, stockMinimo: 2, precoCentimos: 450 },
];

try {
  await ligarBaseDeDados();
  // O seed apaga todos os artigos da base onde está ligado. Na base papelaria,
  // a do laboratório do Atlas, perdias o que lá inseriste à mão. Por isso,
  // só continua se o nome da base acabar em -teste.
  const nomeDaBase = mongoose.connection.name;
  if (!nomeDaBase.endsWith("-teste")) {
    console.error(`O seed só corre numa base de teste, e esta é a ${nomeDaBase}. Muda o DB_NAME no .env.`);
  } else {
    const apagados = await Artigo.deleteMany({});
    console.log(`Apagados ${apagados.deletedCount} artigos`);
    // O insertMany verifica cada artigo com as regras do schema antes de inserir.
    const inseridos = await Artigo.insertMany(artigos);
    console.log(`Inseridos ${inseridos.length} artigos`);
  }
} catch (erro) {
  console.error(`O seed falhou: ${erro.message}`);
}

// A ligação fica aberta até alguém a fechar. Sem esta linha, o programa
// ficava à espera e não voltava ao terminal.
await mongoose.disconnect();
