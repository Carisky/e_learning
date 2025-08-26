import { Request, Response } from "express";
import * as service from "./user.service";

export async function list(req: Request, res: Response) {
  const limit = Number(req.query.limit ?? 20);
  const offset = Number(req.query.offset ?? 0);
  const data = await service.getList(limit, offset);
  res.json(data);
}

export async function get(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await service.getById(id);
  if (!user) return res.status(404).json({ error: "not found" });
  res.json(user);
}

export async function create(req: Request, res: Response) {
  try {
    const user = await service.createUser(req.body);
    res.status(201).json(user);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await service.updateUser(id, req.body);
    if (!updated) return res.status(404).json({ error: "not found" });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export async function remove(req: Request, res: Response) {
  await service.deleteUser(Number(req.params.id));
  res.status(204).send();
}
