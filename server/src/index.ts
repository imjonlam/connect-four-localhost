import { Server } from "socket.io";
import * as connConnection from "./controllers/connection";
import * as gameController from "./controllers/game";
import * as lobbyController from "./controllers/lobby";

const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    connConnection.connect({ io, socket });
    socket.on("disconnect", connConnection.disconnect({ io, socket }));

    socket.on("find_game", lobbyController.findGame({ io, socket }));
    socket.on("create_game", lobbyController.createGame({ io, socket }));
    socket.on("join_game", lobbyController.joinGame({ io, socket }));

    socket.on("leave_game", gameController.leaveGame({ io, socket }));
    socket.on("make_move", gameController.makeMove({ io, socket }));
});

server.listen(9000, () => {
    console.log("connected to :9000");
});
