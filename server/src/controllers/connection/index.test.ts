import { createServer } from "http";
import { Server } from "socket.io";
import { AddressInfo } from "net";
import { io as Client } from "socket.io-client";
import { createGame } from "../lobby";
import { disconnect } from "./index";

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

    it("should not be able to disconnect from a game that player is not present", (done) => {
        const gameID = "test_game";
        disconnect({ io: io, socket: serverSocket })();
        clientSocket.on("disconnect_error", () => {
            done();
        });
    }, 10000);

    it("should be able to disconnect and remove game data", (done) => {
        const gameID = "test_game";
        createGame({ io: io, socket: serverSocket })(gameID);
        clientSocket.on("create_success", (id: string) => {
            disconnect({ io: io, socket: serverSocket })();
            clientSocket.on("end_game", () => {
                done();
            });
        });
    }, 10000);
});
