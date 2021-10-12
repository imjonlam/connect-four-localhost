import { IEventProps } from "../../interfaces/EventProps";
import { getGameBySocket } from "../../models/game/index";
import { leaveGame } from "../game";

/**
 * Event handler when a socket is connected
 * @param io - socket.io server
 * @param socket - socket.io socket
 */
export const connect = async ({ io, socket }: IEventProps) => {
    console.log("connected to:", socket.id);
};

/**
 * Event handler when a socket is disconnected
 * @param io - socket.io server
 * @param socket - socket.io socket
 */
export const disconnect =
    ({ io, socket }: IEventProps) =>
    () => {
        const game = getGameBySocket(socket.id);
        if (game) {
            leaveGame({ io, socket })(game.id);
        } else {
            socket.emit("disconnect_error");
        }
    };
