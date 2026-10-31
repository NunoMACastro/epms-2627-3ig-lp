// src/apagar-categoria.js: apaga da base de teste os artigos de uma categoria.
// Corre-se à parte, como o seed, com a categoria no fim do comando:
//   node --env-file=.env src/apagar-categoria.js Desenho
// Mostra primeiro o que o filtro escolhe, e só apaga quando lhe juntas --apagar.
import mongoose from "mongoose";
import { ligarBaseDeDados } from "./db/mongoose.js";
import { Artigo } from "./models/artigo.model.js";

// O process.argv é a lista das palavras do comando: o node, o caminho do
// script e, a partir da terceira posição, o que escreveste a seguir.
const categoria = process.argv[2];
const confirmado = process.argv.includes("--apagar");

try {
  await ligarBaseDeDados();
  const nomeDaBase = mongoose.connection.name;
  if (!nomeDaBase.endsWith("-teste")) {
    console.error(`Este script só corre numa base de teste, e esta é a ${nomeDaBase}.`);
  } else if (categoria === undefined || categoria === "--apagar") {
    console.error("Falta a categoria: node --env-file=.env src/apagar-categoria.js Desenho");
  } else {
    // Primeiro, ver o que vai mudar: o mesmo filtro, num find.
    const filtro = { categoria: categoria };
    const escolhidos = await Artigo.find(filtro);
    console.log(`O filtro escolhe ${escolhidos.length} artigos.`);
    for (const artigo of escolhidos) {
      console.log(`  ${artigo.nome}`);
    }
    if (!confirmado) {
      console.log("Nada foi apagado. Para apagar, corre o mesmo comando com --apagar no fim.");
    } else {
      // Depois, apagar com o mesmo filtro, e confirmar quantos saíram.
      const resultado = await Artigo.deleteMany(filtro);
      console.log(`Apagados ${resultado.deletedCount} artigos`);
    }
  }
} catch (erro) {
  console.error(`O script falhou: ${erro.message}`);
}

await mongoose.disconnect();
