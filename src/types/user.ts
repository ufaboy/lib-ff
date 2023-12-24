interface User {
  id: number;
  username: string;
  password: string;
  salt: string;
  access_token: string;
  role: string;
}

export type { User };