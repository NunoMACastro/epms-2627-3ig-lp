// src/db/mongoose.js: a ligação da API ao MongoDB Atlas, através do Mongoose.
// A cadeia de ligação leva o utilizador e a palavra-passe da base de dados:
// é um segredo, por isso vem do ficheiro .env e nunca está escrita no código.
import mongoose from "mongoose";

/**
 * Liga o Mongoose à base de dados da papelaria, no Atlas.
 * Lê a cadeia de ligação de MONGODB_URI e o nome da base de DB_NAME.
 * Se faltar a cadeia ou a ligação falhar, a promessa é rejeitada com o erro,
 * e quem chamou decide o que fazer: o server.js não deixa a API arrancar.
 * @returns {Promise<void>} cumprida quando a ligação está feita
 */
export async function ligarBaseDeDados() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("falta a MONGODB_URI no ficheiro .env");
  }

  // A cadeia que o Atlas te dá não diz que base de dados usar. Sem o DB_NAME,
  // a API usa a base de teste, e nunca a papelaria do laboratório do Atlas.
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || "papelaria-teste" });

  // Escreve o nome da base, e nunca a cadeia de ligação, que tem a palavra-passe.
  console.log(`Ligada à base de dados ${mongoose.connection.name}`);
}
