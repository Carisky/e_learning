import * as repo from "./user.repository";
import * as service from "./user.service";
import bcrypt from "bcryptjs";
import type { CreateUserDTO, User } from "./user.types";
import { vi, describe, beforeEach, it, expect } from "vitest";
vi.mock("./user.repository");

describe("user.service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("createUser validations", () => {
    it("throws when name missing", async () => {
      await expect(
        service.createUser({
          name: "",
          surname: "q",
          email: "e",
          password: "123456",
        })
      ).rejects.toThrow("name is required");
    });
    it("throws when surname missing", async () => {
      await expect(
        service.createUser({
          name: "a",
          surname: "",
          email: "e",
          password: "123456",
        })
      ).rejects.toThrow("surname is required");
    });
    it("throws when email missing", async () => {
      await expect(
        service.createUser({
          name: "a",
          surname: "b",
          email: "",
          password: "123456",
        })
      ).rejects.toThrow("email is required");
    });
    it("throws when password too short", async () => {
      await expect(
        service.createUser({
          name: "a",
          surname: "b",
          email: "e",
          password: "12345",
        })
      ).rejects.toThrow("password min 6 chars");
    });
  });

  it("createUser hashes password, checks uniqueness, sets default role", async () => {
    vi.spyOn(repo, "findByEmail").mockResolvedValue(undefined);
    vi.spyOn(bcrypt, "hash").mockImplementation(async () => "HASH");
    vi.spyOn(repo, "create").mockImplementation(
      async (data: CreateUserDTO) =>
        ({
          id: 1,
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: "HASH",
          role_id: data.role_id ?? 3,
        } as User)
    );
    const created = await service.createUser({
      name: "A",
      surname: "B",
      email: "e",
      password: "123456",
    });
    expect(created).toMatchObject({
      id: 1,
      name: "A",
      surname: "B",
      email: "e",
    });
  });

  it("createUser rejects on duplicate email", async () => {
    vi.spyOn(repo, "findByEmail").mockResolvedValue({
      id: 1,
      name: "N",
      surname: "S",
      email: "e",
      password: "x",
      role_id: 1,
    } as User);
    await expect(
      service.createUser({
        name: "A",
        surname: "B",
        email: "e",
        password: "123456",
      })
    ).rejects.toThrow("email already in use");
  });

  it("getById sanitizes password", async () => {
    vi.spyOn(repo, "findById").mockResolvedValue({
      id: 1,
      password: "x",
      email: "e",
      name: "A",
      surname: "B",
      role_id: 1,
    } as User);
    const user = await service.getById(1);
    expect(user).toEqual({
      id: 1,
      email: "e",
      name: "A",
      surname: "B",
      role_id: 1,
    });
  });

  it("getList maps items and returns total", async () => {
    vi.spyOn(repo, "list").mockResolvedValue([
      {
        id: 1,
        name: "A",
        surname: "B",
        email: "e1",
        password: "x",
        role_id: 1,
      },
      {
        id: 2,
        name: "C",
        surname: "D",
        email: "e2",
        password: "y",
        role_id: 2,
      },
    ] as User[]);
    vi.spyOn(repo, "count").mockResolvedValue(2);
    const res = await service.getList(10, 0);
    expect(res.total).toBe(2);
    type PublicUser = Omit<User, "password">;
    const items = res.items as PublicUser[];
    expect(items.every((u) => !("password" in u))).toBe(true);
  });

  describe("updateUser", () => {
    it("validates password length", async () => {
      await expect(
        service.updateUser(1, { password: "12345" })
      ).rejects.toThrow("password min 6 chars");
    });

    it("rejects duplicate email", async () => {
      vi.spyOn(repo, "findByEmail").mockResolvedValue({
        id: 2,
        name: "E",
        surname: "F",
        email: "e",
        password: "x",
        role_id: 2,
      } as User);
      await expect(service.updateUser(1, { email: "e" })).rejects.toThrow(
        "email already in use"
      );
    });

    it("hashes password when provided and returns sanitized", async () => {
      vi.spyOn(repo, "findByEmail").mockResolvedValue(undefined);
      vi.spyOn(bcrypt, "hash").mockImplementation(async () => "HASH");
      vi.spyOn(repo, "update").mockResolvedValue({
        id: 1,
        email: "e",
        password: "HASH",
        name: "A",
        surname: "B",
        role_id: 1,
      } as User);
      const res = await service.updateUser(1, { password: "123456" });
      expect(res).toEqual({
        id: 1,
        email: "e",
        name: "A",
        surname: "B",
        role_id: 1,
      });
    });
  });

  it("deleteUser calls repo.remove", async () => {
    const spy = vi.spyOn(repo, "remove").mockResolvedValue(1);
    await service.deleteUser(1);
    expect(spy).toHaveBeenCalledWith(1);
  });
});
