import { Server, Socket } from "socket.io";

export interface IEventProps {
    io: Server;
    socket: Socket;
}
