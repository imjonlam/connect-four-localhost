import { createServer } from "http";
import { Server } from "socket.io";
import { AddressInfo } from "net";
import { io as Client } from "socket.io-client";
import { createGame, findGame, joinGame } from "./index";

describe("testing lobby events", () => {
    let io, serverSocket, clientSocket;

    beforeAll((done) => {
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

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    it("should not be able to find a non-existing game", (done) => {
        const gameID = "test_game";
        findGame({ io: io, socket: serverSocket })(gameID);
        clientSocket.on("found_game", (isFound: boolean) => {
            expect(isFound).toBeFalsy();
            done();
        });
    }, 10000);

    it("should create a new game", (done) => {
        const gameID = "test_game";
        createGame({ io: io, socket: serverSocket })(gameID);
        clientSocket.on("create_success", (id: string) => {
            expect(id).toBe(gameID);
            done();
        });
    }, 10000);

    it("should not create an existing game", (done) => {
        const gameID = "test_game";
        createGame({ io: io, socket: serverSocket })(gameID);
        clientSocket.on("create_error", (message: string) => {
            done();
        });
    }, 10000);

    it("should join an existing game", (done) => {
        const gameID = "test_game";
        joinGame({ io: io, socket: serverSocket })(gameID);
        clientSocket.on("join_success", (id: string) => {
            expect(id).toBe(gameID);
            done();
        });
    }, 10000);

    it("should not join a non-existing game", (done) => {
        const gameID = "test_game_extinct";
        joinGame({ io: io, socket: serverSocket })(gameID);
        clientSocket.on("join_error", (message: string) => {
            done();
        });
    }, 10000);
});
