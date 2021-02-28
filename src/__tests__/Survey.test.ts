import request from "supertest";
import { app } from "../app";

import createConnection from "../database";

describe("Survey integration tests", () => {
  beforeAll(async () => {
    const conn = await createConnection();
    await conn.runMigrations();
  });

  it("Should return a new survey when a valid body is submted", async () => {
    const surveyToCreate = { title: "Teste Title", description: "dsc" };
    const response = await request(app).post("/surveys").send(surveyToCreate);
    expect.assertions(3);
    expect(response.status).toEqual(201);
    expect(response.body.title).toEqual(surveyToCreate.title);
    expect(response.body.description).toEqual(surveyToCreate.description);
  });
});
