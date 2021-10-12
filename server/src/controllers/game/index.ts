import { IEventProps } from "../../interfaces/EventProps";
import * as model from "../../models/game";
import { GameState } from "../../enumerators/GameState";

/**
 * Event handler for making a move
 * @param io - socket.io server
 * @param socket - socket.io socket
 * @returns a new method that places a new disc on the board
 */
export const makeMove =
    ({ io, socket }: IEventProps) =>
    (gameID: string, col: number) => {
        const game = model.makeMove(gameID, col);
        const gameOver = model.isGameOver(gameID);
        if (gameOver !== GameState.Playing) {
            const winner = model.getPreviousPlayer(gameID);
            model.getPlayers(gameID).forEach((socketID) => {
                const socket = io.sockets.sockets.get(socketID);
                socket.emit("winner", winner);
                socket.emit("game_over");
            });
        }

        socket.emit("move_made");
        io.emit("game_data", game);
    };

/**
 * Event handler for leaving an existing game
 * @param io - socket.io server
 * @param socket - socket.io socket
 * @returns a new method that leaves a game given a game ID
 */
export const leaveGame =
    ({ io, socket }: IEventProps) =>
    (gameID: string) => {
        const game = model.getGame(gameID);
        if (game) {
            model.getPlayers(gameID).forEach((socketID) => {
                const socket = io.sockets.sockets.get(socketID);
                socket?.emit("end_game");
            });

            model.leaveGame(gameID);
        } else {
            socket?.emit("leave_game_error");
        }
    };
