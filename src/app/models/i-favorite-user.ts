import { iUser } from './i-user';

export interface iFavoriteUser {
  id?: number;
  userId: number;
  user: iUser;
}
