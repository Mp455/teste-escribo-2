const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho para o arquivo do banco de dados SQLite
const dbPath = path.resolve(__dirname, "../caminho_desejado/database.sqlite");

// Cria uma nova instância de conexão com o banco de dados
const db = new sqlite3.Database(dbPath);

// Cria a tabela de usuários
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      password TEXT,
      telefone TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      lastLogin TEXT
    )
  `);
});

// Função para inserir um novo usuário
function createUser(name, email, password, telefone) {
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO users (name, email, password, telefone, createdAt, updatedAt, lastLogin)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(name, email, password, telefone, createdAt, createdAt, null);
  stmt.finalize();
}

// Função para buscar todos os usuários
function getAllUsers(callback) {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
}

// Exporta as funções para utilização em outros arquivos
module.exports = {
  createUser,
  getAllUsers,
};
