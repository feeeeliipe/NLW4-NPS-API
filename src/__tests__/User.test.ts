import request from "supertest";
import { getCustomRepository } from "typeorm";
import { app } from "../app";

import createConnection from "../database";
import UsersRepository from "../repositories/UsersRepository";

describe("User integration tests", () => {
  beforeAll(async () => {
    const conn = await createConnection();
    await conn.runMigrations();
    const userRepo = getCustomRepository(UsersRepository);
    await userRepo.clear();
  });

  it("Should return a new user when a valid body is submted", async () => {
    const userToCreate = { email: "user@test.com.br", name: "Test Name" };
    const response = await request(app).post("/users").send(userToCreate);
    expect.assertions(3);
    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual(userToCreate.name);
    expect(response.body.email).toEqual(userToCreate.email);
  });

  it("Should return a error when a existent email is submited", async () => {
    const response = await request(app)
      .post("/users")
      .send({ email: "user@test.com.br", name: "Test Name" });
    expect.assertions(2);
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual(
      "Já existe um usuário com esse e-mail"
    );
  });
});
