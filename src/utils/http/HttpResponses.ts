import { Response } from "express";

export default class HttpResponses {
  constructor() {}

  static created(res: Response, body: any) {
    return res.status(201).send(body);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }

  static success(res: Response, body: any) {
    return res.status(200).send(body);
  }

  static badRequest(res: Response, message: string): Response {
    return res.status(400).send({ message });
  }

  static internalError(
    res: Response,
    errorMessage: string,
    errorName: string
  ): Response {
    return res.status(500).send({
      message: errorMessage,
      type: errorName,
    });
  }
}
