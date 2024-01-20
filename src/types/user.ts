interface User {
  id: number;
  username: string;
  password: string;
  salt: string;
  access_token: string;
  role: string | null;
}

export type { User };