const db = require("../src/config/database");
const authController = require("../src/controllers/authController");

beforeAll((done) => {
  // Aguardar a inicialização do banco de dados antes de executar os testes
  function waitForDatabase() {
    if (db) {
      console.log("Database initialized");
      done();
    } else {
      setTimeout(waitForDatabase, 100);
    }
  }

  waitForDatabase();
});

describe("Auth Controller", (req, res) => {
  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("Deve autenticar o usuário corretamente", async () => {
    // Simular uma requisição com um usuário válido
    req.body = { email: "exemplo@gmail.com", senha: "senhadousuario" };

    // Chamar o método de autenticação do controlador com o mock de req e res
    await authController.signIn(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(Number),
        email: "exemplo@gmail.com",
      })
    );
  });
});
