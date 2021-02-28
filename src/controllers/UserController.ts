import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import UsersRepository from "../repositories/UsersRepository";
import HttpResponses from "../utils/http/HttpResponses";

export class UserController {
  constructor() {}

  async create(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      const usersRepo = getCustomRepository(UsersRepository);

      // Valida se já existe um usuário com o e-mail utilizado
      const alreadyExistsWithEmail = await usersRepo.findOne({ email });
      if (alreadyExistsWithEmail) {
        return res
          .status(400)
          .send({ message: "Já existe um usuário com esse e-mail" });
      }

      const user = usersRepo.create({
        name,
        email,
      });

      const createdUser = await usersRepo.save(user);

      return HttpResponses.created(res, createdUser);
    } catch (error) {
      return HttpResponses.internalError(res, error.message, error.name);
    }
  }
}
