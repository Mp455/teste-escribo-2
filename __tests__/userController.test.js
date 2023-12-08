const userController = require("../src/controllers/userController");

test("Deve criar um novo usuário corretamente", async () => {
  // Simular uma requisição com os dados do novo usuário
  const req = {
    body: {
      nome: "marcos",
      email: "marcos@gmail.com",
      senha: "senhadousuario",
      telefones: [
        {
          numero: "123456789",
          DDD: "11",
        },
      ],
    },
  };

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  await userController.createUser(req, res);

  // Verificar se o status e o JSON da resposta são os esperados
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      id: expect.any(Number),
      email: "marcos@gmail.com",
    })
  );
});
