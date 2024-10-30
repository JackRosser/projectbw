import { iGame } from './i-game';

export interface iFavoriteGame {
  userId: number;
  game: iGame;
  id?: number;
}
