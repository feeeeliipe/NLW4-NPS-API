import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import SurveysUsersRepository from "../repositories/SurveysUsersRepository";
import HttpResponses from "../utils/http/HttpResponses";

export class AnswerController {
  constructor() {}

  async save(req: Request, res: Response) {
    try {
      const { u } = req.query;
      const { value } = req.params;

      const surveyUserRepo = getCustomRepository(SurveysUsersRepository);
      // Valida se o registro existe
      const surveyUser = await surveyUserRepo.findOne({ id: String(u) });
      if (!surveyUser) {
        return HttpResponses.badRequest(
          res,
          `Pesquisa não encontrada para o usuário!`
        );
      }

      surveyUser.value = Number(value);
      await surveyUserRepo.save(surveyUser);

      return HttpResponses.success(res, surveyUser);
    } catch (error) {
      return HttpResponses.internalError(res, error.message, error.name);
    }
  }
}
