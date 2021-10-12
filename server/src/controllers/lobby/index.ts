import { IEventProps } from "../../interfaces/EventProps";
import * as model from "../../models/game";
import { isGameFull } from "../../models/game/index";

/**
 * Event handler for finding an existing game
 * @param io - socket.io server
 * @param socket - socket.io socket
 * @returns a new method that finds an existing game given a game ID
 */
export const findGame =
    ({ io, socket }: IEventProps) =>
    (gameID: string) => {
        const found = model.getGame(gameID) !== undefined;
        socket.emit("found_game", found);
    };

/**
 * Event handler for creating a new game
 * @param io - socket.io server
 * @param socket - socket.io socket
 * @returns a new method that creates a new game given a game ID
 */
export const createGame =
    ({ io, socket }: IEventProps) =>
    (gameID: string) => {
        let game = model.getGame(gameID);
        if (!game) {
            game = model.createGame(gameID, socket.id);
            socket.emit("create_success", gameID);
            socket.emit("colour", game.players[socket.id]);
            io.emit("game_data", game);
        } else {
            socket.emit("create_error", "Room taken. Please try another.");
        }
    };

/**
 * Event handler for joining a game
 * @param io - socket.io server
 * @param socket - socket.io socket
 * @returns a new method that joins a game given a game ID
 */
export const joinGame =
    ({ io, socket }: IEventProps) =>
    (gameID: string) => {
        const game = model.getGame(gameID);
        if (game && !isGameFull(gameID)) {
            model.addPlayer(gameID, socket.id);
            socket.emit("join_success", gameID);
            socket.emit("colour", game.players[socket.id]);
            io.emit("game_data", game);
        } else {
            socket.emit("join_error", "Room is full. Please try another");
        }
    };
