import { iGame } from "./i-game";

export interface iUser {
  id:number,
  email:string,
  nickname:string,
  password:string,
  description:string,
  favorites:iGame[],
  avatar:string
}
