export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  category_id: number | null;
  author_id: number | null;
  preview_url?: string | null;
}

export interface CourseFile {
  id: number;
  course_id: number;
  url: string;
  type?: string | null;
}

export interface CreateCourseDTO {
  title: string;
  description: string;
  price: number;
  duration: number;
  category_id?: number;
  author_id?: number;
  preview_url?: string;
  files?: { url: string; type?: string }[];
}
