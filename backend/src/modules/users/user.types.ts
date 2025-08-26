export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string; // хранится уже hash
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDTO {
  name: string;
  surname: string;
  email: string;
  password: string; // raw
}

export interface UpdateUserDTO {
  name?: string;
  surname?: string;
  email?: string;
  password?: string; // raw
}
