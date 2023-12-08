const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const isTestEnvironment = process.env.NODE_ENV === "test";
const DBSOURCE = isTestEnvironment
  ? ":memory:"
  : path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to SQLite database");
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT,
        telefones TEXT,
        data_criacao TEXT,
        data_atualizacao TEXT,
        ultimo_login TEXT
      )`,
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          // Table created successfully, you can execute more queries here if needed
        }
      }
    );
  }
});

module.exports = db;
