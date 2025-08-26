export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string; // хранится уже hash
  role_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDTO {
  name: string;
  surname: string;
  email: string;
  password: string; // raw
  role_id?: number;
}

export interface UpdateUserDTO {
  name?: string;
  surname?: string;
  email?: string;
  password?: string; // raw
  role_id?: number;
}

export type UserDTO = Omit<User, "password">;
