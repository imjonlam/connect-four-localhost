import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import "./App.css";
import Game from "./components/Game";
import Lobby from "./components/Lobby";

enum Player {
    None = "#ffffff",
    One = "#f2c250",
    Two = "#f85b71",
}

interface IGameProps {
    id: string;
    turn: Player;
    players: IPlayerProps;
    board: string[][];
}

export interface IPlayerProps {
    [key: string]: string;
}

function App() {
    const [clientSocket, setClientSocket] = useState<Socket | null>(null);
    const [game, setGame] = useState<IGameProps | null>(null);
    const [gameID, setGameID] = useState("");
    const [colour, setColour] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);
    const [inLobby, setInLobby] = useState(true);
    const [lobbyLabel, setLobbyLabel] = useState(
        "Create or join an existing game"
    );

    useEffect(() => {
        const socket = io("http://localhost:9000");
        socket.on("create_success", (gameID) => setGameID(gameID));
        socket.on("create_error", (message) => setLobbyLabel(message));
        socket.on("join_success", (gameID) => setGameID(gameID));
        socket.on("join_error", (message) => setLobbyLabel(message));
        socket.on("game_over", () => setIsGameOver(true));
        socket.on("colour", (colour) => setColour(colour));

        socket.on("game_data", (game) => {
            setGame(game);
            setInLobby(false);
        });

        socket.on("disconnect", () => resetGame());
        socket.on("end_game", () => resetGame());

        setClientSocket(socket);
    }, []);

    useEffect(() => {
        if (isGameOver) {
            console.log("game over");
        }
    }, [isGameOver]);

    /**
     * Join an existing game or create one
     * @param gameID - the desired game ID
     */
    const joinGame = (gameID: string) => {
        clientSocket?.emit("find_game", gameID);
        clientSocket?.on("found_game", (found) => {
            if (found) {
                clientSocket?.emit("join_game", gameID);
            } else {
                clientSocket?.emit("create_game", gameID);
            }
        });
    };

    /**
     * Leaves the current game room
     */
    const leaveGame = () => {
        clientSocket?.emit("leave_game", gameID);
    };

    /**
     * Attempts to place a pice in the specified column
     */
    const makeMove = (column: number) => {
        if (!isGameOver && game?.turn === colour)
            clientSocket?.emit("make_move", gameID, column);
    };

    /**
     * Reset states
     */
    const resetGame = () => {
        setGame(null);
        setGameID("");
        setColour("");
        setInLobby(true);
        setIsGameOver(false);
        setLobbyLabel("Create or join an existing game");
    };

    /**
     * Retrieves the game's status
     * @returns - the game status message
     */
    const getGameStatus = (): string => {
        if (isGameOver) return "GAME OVER";
        if (game?.turn === colour) return "It's YOUR turn";
        return "Opponents turn";
    };

    return (
        <div className="app">
            <h1 className="title">Connect 4</h1>

            {inLobby && !game && (
                <Lobby onSubmit={joinGame} labelText={lobbyLabel} />
            )}

            {!inLobby && game && (
                <>
                    <Game
                        game={game}
                        onClick={makeMove}
                        onGameOver={leaveGame}
                    />
                    <h2 className="game_message" style={{ color: colour }}>
                        {getGameStatus()}
                    </h2>
                </>
            )}
        </div>
    );
}

export default App;
