const jwt = require("jsonwebtoken");
const db = require("../config/database");
const bcrypt = require("bcrypt");

exports.getAllUsers = (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
};

// exports.createUser = async (req, res) => {
//   const { nome, email, senha, telefones } = req.body;

//   try {
//     const row = await new Promise((resolve, reject) => {
//       // Verificar se o email já está cadastrado
//       db.get("SELECT email FROM users WHERE email = ?", [email], (err, row) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve(row);
//       });
//     });

//     if (row) {
//       res.status(400).json({ mensagem: "Email já existente" });
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(senha, 10);
//     const data_criacao = new Date().toISOString();
//     const data_atualizacao = new Date().toISOString();

//     const insertQuery = `
//       INSERT INTO users (nome, email, senha, telefones, data_criacao, data_atualizacao)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;

//     await new Promise((resolve, reject) => {
//       db.run(
//         insertQuery,
//         [
//           nome,
//           email,
//           hashedPassword,
//           JSON.stringify(telefones),
//           data_criacao,
//           data_atualizacao,
//         ],
//         function (err) {
//           if (err) {
//             reject(err);
//             return;
//           }

//           const userID = this.lastID;

//           const secretKey = "sua_chave_secreta";
//           const token = jwt.sign({ userID }, secretKey, { expiresIn: "1h" });

//           const responseData = {
//             id: userID,
//             nome: nome,
//             email: email,
//             data_criacao: data_criacao,
//             data_atualizacao: data_atualizacao,
//             ultimo_login: null,
//             token: token,
//           };

//           res.status(201).json(responseData);
//           resolve();
//         }
//       );
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const sqlite = require("sqlite");

exports.createUser = async (req, res) => {
  try {
    const { nome, email, senha, telefones } = req.body;

    const row = await db.get("SELECT email FROM users WHERE email = ?", [
      email,
    ]);

    if (row) {
      res.status(400).json({ mensagem: "Email já existente" });
      return;
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const data_criacao = new Date().toISOString();
    const data_atualizacao = new Date().toISOString();

    const db = await sqlite.open("./database.sqlite");
    const result = await db.run(
      "INSERT INTO users (nome, email, senha, telefones, data_criacao, data_atualizacao) VALUES (?, ?, ?, ?, ?, ?)",
      nome,
      email,
      hashedPassword,
      JSON.stringify(telefones),
      data_criacao,
      data_atualizacao
    );

    const userID = result.lastID;
    const secretKey = "sua_chave_secreta";
    const token = jwt.sign({ userID }, secretKey, { expiresIn: "1h" });

    const responseData = {
      id: userID,
      nome: nome,
      email: email,
      data_criacao: data_criacao,
      data_atualizacao: data_atualizacao,
      ultimo_login: null,
      token: token,
    };

    res.status(201).json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
