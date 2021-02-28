import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import SurveysRepository from "../repositories/SurveysReposity";
import SurveysUsersRepository from "../repositories/SurveysUsersRepository";
import UsersRepository from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import HttpResponses from "../utils/http/HttpResponses";
import path from "path";

export class SendMailController {
  constructor() {}

  async sendEmail(req: Request, res: Response) {
    try {
      const { email, survey_id } = req.body;

      // Instancia os repositórios
      const usersRepo = getCustomRepository(UsersRepository);
      const surveysRepo = getCustomRepository(SurveysRepository);
      const surveysUserRepo = getCustomRepository(SurveysUsersRepository);

      // Valida se o usuário existe na aplicação
      const user = await usersRepo.findOne({ email });
      if (!user) {
        return HttpResponses.badRequest(
          res,
          `Usuário com o e-mail '${email}' não existe na aplicação!`
        );
      }

      // Valida se a pesquisa existe
      const survey = await surveysRepo.findOne({ id: survey_id });
      if (!survey) {
        return HttpResponses.badRequest(
          res,
          `O id da pesquisa informado não é válido!`
        );
      }

      const variables = {
        name: user.name,
        title: survey.title,
        description: survey.description,
        survey_user_id: "",
        link: `${process.env.BASE_URL}:${process.env.PORT}/answer`,
      };

      // Salvar as informações na tabela surveys_users
      const alreadyExistsSurveyForUser = await surveysUserRepo.findOne({
        where: { user_id: user.id, value: null },
        relations: ["user", "survey"],
      });
      let createdSurveyUsers;
      if (!alreadyExistsSurveyForUser) {
        const surveyUser = surveysUserRepo.create({
          user_id: user.id,
          survey_id: survey_id,
        });
        createdSurveyUsers = await surveysUserRepo.save(surveyUser);
        variables.survey_user_id = createdSurveyUsers.id;
      } else {
        variables.survey_user_id = alreadyExistsSurveyForUser.id;
      }

      // Enviar e-mail para o usuário
      const npsPath = path.resolve(
        __dirname,
        "..",
        "views",
        "emails",
        "NpsMail.hbs"
      );

      await SendMailService.execute(
        user.email,
        `Pesquisa de Satisfação: ${survey.title}`,
        variables,
        npsPath
      );

      return HttpResponses.success(
        res,
        alreadyExistsSurveyForUser
          ? alreadyExistsSurveyForUser
          : createdSurveyUsers
      );
    } catch (error) {
      return HttpResponses.internalError(res, error.message, error.name);
    }
  }
}
