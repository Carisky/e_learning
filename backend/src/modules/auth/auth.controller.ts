import { Request, Response } from "express";
import * as service from "./auth.service";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await service.login(email, password);
  res.json(result);
}
