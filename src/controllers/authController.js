const jwt = require("jsonwebtoken");
const db = require("../config/database");
const bcrypt = require("bcrypt");

exports.signIn = (req, res) => {
  const { email, senha } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(400).json({ mensagem: "Usuário e/ou senha incorretos" });
      return;
    }

    bcrypt.compare(senha, row.senha, (err, result) => {
      if (err) {
        res.status(500).json({ error: "Erro ao comparar as senhas" });
        return;
      }

      if (!result) {
        res.status(401).json({ mensagem: "Usuário e/ou senha incorretos" });
        return;
      }

      const userID = row.id;
      const secretKey = "sua_chave_secreta";
      const token = jwt.sign({ userID }, secretKey, { expiresIn: "1h" });

      const responseData = {
        id: userID,
        data_criacao: row.data_criacao,
        data_atualizacao: row.data_atualizacao,
        ultimo_login: null,
        token: token,
      };

      res.status(200).json(responseData);
    });
  });
};

exports.getAuthenticatedUser = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }

  jwt.verify(token, "sua_chave_secreta", (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ mensagem: "Sessão inválida" });
      }
      return res.status(401).json({ mensagem: "Não autorizado" });
    }

    const userId = decoded.userID;

    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (!row) {
        res.status(404).json({ mensagem: "Usuário não encontrado" });
        return;
      }

      // Retornar os dados do usuário autenticado
      res.status(200).json({
        id: row.id,
        email: row.email,
        // ... outros campos do usuário
      });
    });
  });
};
