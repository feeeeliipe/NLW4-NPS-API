import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import SurveysUsersRepository from "../repositories/SurveysUsersRepository";
import HttpResponses from "../utils/http/HttpResponses";

export class NpsController {
  constructor() {}

  /*
  Detratores => 0 - 6
  Passivos => 7 - 8
  Promotores => 9 - 10

  (Número de Promotores - Número de Detratores) / (Número de Participantes) x 100
  */

  async calculate(req: Request, res: Response) {
    try {
      const { survey_id } = req.params;

      const surveysUsersRepo = getCustomRepository(SurveysUsersRepository);

      // Todas as Respostas
      const npsResponses = await surveysUsersRepo.find({
        survey_id,
        value: Not(IsNull()),
      });
      if (npsResponses.length <= 0) {
        return HttpResponses.badRequest(
          res,
          "Nenhuma resposta encontrada para essa pesquisa!"
        );
      }

      // Detratores
      const detractors = npsResponses.filter(
        (r) => r.value >= 0 && r.value <= 6
      );

      // Passivos
      const passives = npsResponses.filter((r) => r.value >= 7 && r.value <= 8);

      // Promotores
      const promoters = npsResponses.filter((r) => r.value >= 9);

      const npsResult =
        ((promoters.length - detractors.length) / npsResponses.length) * 100;

      return HttpResponses.success(res, {
        promoters: promoters.length,
        passives: passives.length,
        detractors: detractors.length,
        result: npsResult,
      });
    } catch (error) {
      return HttpResponses.internalError(res, error.message, error.name);
    }
  }
}
