import { Router } from "express";
import { AnswerController } from "./controllers/AnswerController";
import { NpsController } from "./controllers/NpsController";
import { SendMailController } from "./controllers/SendMailController";
import { SurveyController } from "./controllers/SurveyController";
import { UserController } from "./controllers/UserController";

const router = Router();

// Users
const userController = new UserController();
router.post("/users", userController.create);

// Surveys
const surveyController = new SurveyController();
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.findAll);

// Send Mail
const sendMailController = new SendMailController();
router.post("/send-mail", sendMailController.sendEmail);

// Register Answer
const answerController = new AnswerController();
router.get("/answer/:value", answerController.save);

// NPS
const npsController = new NpsController();
router.get("/nps/:survey_id", npsController.calculate);

export default router;
