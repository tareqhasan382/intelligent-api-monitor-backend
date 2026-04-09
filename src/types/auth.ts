import { UserRole } from "../modules/user/user.interface";



export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}