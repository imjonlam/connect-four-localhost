import { createServer } from "http";
import { Server } from "socket.io";
import { AddressInfo } from "net";
import { io as Client } from "socket.io-client";
import { makeMove, leaveGame } from "./index";
import { createGame } from "../lobby";
import { Player } from "../../enumerators/Player";

describe("testing lobby events", () => {
    let io, serverSocket, clientSocket;

    beforeEach((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            clientSocket = Client(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });

        clientSocket;
    });

    afterEach(() => {
        io.close();
        clientSocket.close();
    });

    it("should not be able to leave a non-existing game", (done) => {
        const gameID = "test_game";
        leaveGame({ io: io, socket: serverSocket })(gameID);
        clientSocket.on("leave_game_error", () => {
            done();
        });
    }, 10000);

    it("should be able to leave from an existing game", (done) => {
        const gameID = "test_game";
        createGame({ io: io, socket: serverSocket })(gameID);
        clientSocket.on("create_success", (id: string) => {
            leaveGame({ io: io, socket: serverSocket })(id);
            clientSocket.on("end_game", () => {
                done();
            });
        });
    }, 10000);

    it("should be able to make a move", (done) => {
        const gameID = "test_game_two";
        createGame({ io: io, socket: serverSocket })(gameID);
        clientSocket.on("create_success", (id: string) => {
            makeMove({ io: io, socket: serverSocket })(id, 0);
            clientSocket.on("move_made", () => {
                clientSocket.on("game_data", (game) => {
                    expect(game).toBeDefined();
                    expect(game.board[0][game.board[0].length - 1]).toBe(
                        Player.One
                    );
                    done();
                });
            });
        });
    }, 10000);
});
