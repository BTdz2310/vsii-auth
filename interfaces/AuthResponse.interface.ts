import { Role } from 'enums/roles.enum';

export interface AuthResponse {
  id: string;
  username: string;
  role: Role;
  avatar: string;
}
