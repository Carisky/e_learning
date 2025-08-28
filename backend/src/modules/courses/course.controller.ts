import { Request, Response } from "express";
import { AuthRequest } from "../../lib/auth";
import * as service from "./course.service";

export async function createCourse(req: AuthRequest, res: Response) {
  const course = await service.createCourse(req.body);
  res.status(201).json(course);
}

export async function listCourses(_req: Request, res: Response) {
  const courses = await service.listCourses();
  res.json(courses);
}

export async function getCourse(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const course = await service.getCourse(id, req.user?.id);
  if (!course) return res.status(404).json({ error: "not_found" });
  res.json(course);
}
