import { knex } from "../../db/knex";
import { Course, CourseFile, CreateCourseDTO } from "./course.types";

const COURSES = "courses";
const COURSE_FILES = "course_files";
const PURCHASES = "purchases";

export async function createCourse(
  data: CreateCourseDTO,
  files: { url: string; type?: string }[] = []
): Promise<Course> {
  return knex.transaction(async (trx) => {
    const { files: _, ...courseData } = data as any;
    const [course] = await trx<Course>(COURSES)
      .insert(courseData)
      .returning("*");
    if (files.length) {
      const rows = files.map((f) => ({ ...f, course_id: course.id }));
      await trx<CourseFile>(COURSE_FILES).insert(rows);
    }
    return course;
  });
}

export async function listCourses(): Promise<Course[]> {
  return knex<Course>(COURSES).select("*").orderBy("id", "asc");
}

export async function findCourseById(id: number): Promise<Course | undefined> {
  return knex<Course>(COURSES).where({ id }).first();
}

export async function listFiles(course_id: number): Promise<CourseFile[]> {
  return knex<CourseFile>(COURSE_FILES).where({ course_id }).select("*");
}

export async function hasPurchase(
  user_id: number,
  course_id: number
): Promise<boolean> {
  const row = await knex(PURCHASES)
    .where({ user_id, course_id })
    .first();
  return !!row;
}
