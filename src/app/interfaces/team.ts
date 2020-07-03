import { Countries } from './countries.enum';
import { Player } from './player';

export interface Team {
  $key?: string;
  name: string;
  country: Countries;
  players: Player[];
}
