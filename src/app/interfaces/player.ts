import { Countries } from './countries.enum';
import { SquadNumber } from './squadNumber.enum';

export interface Player {
  $key?: string;
  name: string;
  lastName: string;
  position: SquadNumber;
  weight: number;
  height: number;
  nationality: Countries;
  leftFooted: boolean;
}