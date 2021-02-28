import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import SurveysRepository from "../repositories/SurveysReposity";
import HttpResponses from "../utils/http/HttpResponses";
export class SurveyController {
  constructor() {}

  async create(req: Request, res: Response) {
    try {
      const { title, description } = req.body;

      const surveyRepo = getCustomRepository(SurveysRepository);

      const survey = surveyRepo.create({ title, description });

      const createdSurvey = await surveyRepo.save(survey);

      return HttpResponses.created(res, createdSurvey);
    } catch (error) {
      return HttpResponses.internalError(res, error.message, error.name);
    }
  }

  async findAll(_: Request, res: Response) {
    try {
      const surveyRepo = getCustomRepository(SurveysRepository);
      const surveys = await surveyRepo.find();
      return HttpResponses.success(res, surveys);
    } catch (error) {
      return HttpResponses.internalError(res, error.message, error);
    }
  }
}
