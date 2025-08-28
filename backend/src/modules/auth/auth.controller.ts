import { Request, Response } from "express";
import * as service from "./auth.service";
import * as usersService from "../users/user.service";
import { AuthRequest } from "../../lib/auth";

export async function login(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;
  const result = await service.login(email, password);
  res.json(result);
}

export async function register(req: Request, res: Response) {
  const dto = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
  };
  const user = await usersService.createUser(dto);
  res.status(201).json(user);
}

export async function me(req: AuthRequest, res: Response) {
  const user = await usersService.getById(req.user!.id);
  res.json(user);
}

export async function refresh(req: Request, res: Response) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "unauthorized" });
  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const result = await service.refresh(token);
    res.json(result);
  } catch (e) {
    res.status(401).json({ error: "invalid_token" });
  }
}
