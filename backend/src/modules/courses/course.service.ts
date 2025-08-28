import * as repo from "./course.repository";
import { CreateCourseDTO } from "./course.types";

function assertCreate(dto: CreateCourseDTO) {
  if (!dto.title?.trim()) throw new Error("title is required");
  if (!dto.description?.trim()) throw new Error("description is required");
  if (dto.price == null || dto.price < 0) throw new Error("price is required");
  if (dto.duration == null || dto.duration <= 0)
    throw new Error("duration is required");
}

export async function createCourse(dto: CreateCourseDTO) {
  assertCreate(dto);
  const files = dto.files ?? [];
  const data = { ...dto } as any;
  delete data.files;
  return repo.createCourse(data, files);
}

export async function listCourses() {
  return repo.listCourses();
}

export async function getCourse(id: number, userId?: number) {
  const course = await repo.findCourseById(id);
  if (!course) return undefined;
  const purchased = userId ? await repo.hasPurchase(userId, id) : false;
  const files = purchased ? await repo.listFiles(id) : [];
  return { ...course, files, purchased };
}
