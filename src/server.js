const express = require("express");
const bcrypt = require("bcrypt");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());

// Defina as rotas de usuários primeiro
app.use(userRoutes);

// Em seguida, as rotas de autenticação
app.use(authRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
