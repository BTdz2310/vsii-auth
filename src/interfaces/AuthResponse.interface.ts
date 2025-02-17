import { Role } from '@prisma/client';

export interface AuthResponse {
  id: string;
  username: string;
  role: Role;
}
