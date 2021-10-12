import { Player } from "../enumerators/Player";
import { IPlayerProps } from "./PlayerProps";

export interface IGameProps {
    id: string;
    turn: Player;
    players: IPlayerProps;
    board: string[][];
}
