import * as repo from "./course.repository";
import * as service from "./course.service";
import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("./course.repository");

describe("course.service", () => {
  beforeEach(() => vi.resetAllMocks());

  describe("createCourse validations", () => {
    it("throws when title missing", async () => {
      await expect(
        service.createCourse({
          title: "",
          description: "d",
          price: 1000,
          duration: 60,
        })
      ).rejects.toThrow("title is required");
    });

    it("throws when description missing", async () => {
      await expect(
        service.createCourse({
          title: "t",
          description: "",
          price: 1000,
          duration: 60,
        })
      ).rejects.toThrow("description is required");
    });

    it("throws when price missing", async () => {
      await expect(
        service.createCourse({
          title: "t",
          description: "d",
          price: -1,
          duration: 60,
        })
      ).rejects.toThrow("price is required");
    });

    it("throws when duration missing", async () => {
      await expect(
        service.createCourse({
          title: "t",
          description: "d",
          price: 1000,
          duration: 0,
        })
      ).rejects.toThrow("duration is required");
    });
  });

  it("createCourse calls repo", async () => {
    vi.spyOn(repo, "createCourse").mockResolvedValue({
      id: 1,
      title: "t",
      description: "d",
      price: 1000,
      duration: 60,
      category_id: null,
      author_id: null,
      preview_url: null,
    } as any);
    const res = await service.createCourse({
      title: "t",
      description: "d",
      price: 1000,
      duration: 60,
    });
    expect(res).toMatchObject({ id: 1, title: "t" });
  });

  it("getCourse hides files when not purchased", async () => {
    vi.spyOn(repo, "findCourseById").mockResolvedValue({
      id: 1,
      title: "t",
      description: "d",
      price: 1000,
      duration: 60,
      category_id: null,
      author_id: null,
      preview_url: null,
    } as any);
    vi.spyOn(repo, "hasPurchase").mockResolvedValue(false);
    const course = await service.getCourse(1, 2);
    expect(course?.files).toEqual([]);
  });

  it("getCourse returns files when purchased", async () => {
    vi.spyOn(repo, "findCourseById").mockResolvedValue({
      id: 1,
      title: "t",
      description: "d",
      price: 1000,
      duration: 60,
      category_id: null,
      author_id: null,
      preview_url: null,
    } as any);
    vi.spyOn(repo, "hasPurchase").mockResolvedValue(true);
    vi.spyOn(repo, "listFiles").mockResolvedValue([
      { id: 1, course_id: 1, url: "u", type: "video" },
    ] as any);
    const course = await service.getCourse(1, 2);
    expect(course?.files.length).toBe(1);
  });
});
