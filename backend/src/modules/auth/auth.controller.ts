import { Request, Response } from "express";
import * as service from "./auth.service";
import * as usersService from "../users/user.service";
import { AuthRequest } from "../../lib/auth";

function fromBase64(str: string) {
  return Buffer.from(str, "base64").toString("utf-8");
}

export async function login(req: Request, res: Response) {
  const email = fromBase64(req.body.email);
  const password = fromBase64(req.body.password);
  const result = await service.login(email, password);
  res.json(result);
}

export async function register(req: Request, res: Response) {
  const dto = {
    name: fromBase64(req.body.name),
    surname: fromBase64(req.body.surname),
    email: fromBase64(req.body.email),
    password: fromBase64(req.body.password),
  };
  const user = await usersService.createUser(dto);
  res.status(201).json(user);
}

export async function me(req: AuthRequest, res: Response) {
  const user = await usersService.getById(req.user!.id);
  res.json(user);
}
