import { Player } from "../../enumerators/Player";
import { GameState } from "../../enumerators/GameState";
import { IGameProps } from "../../interfaces/GameProps";
import { IGamesProps } from "../../interfaces/GamesProps";

const gameStates: IGamesProps = {};

/**
 * Creates a new game
 * @param gameID - the game room's ID
 * @param socketID - the socket's ID
 * @returns game data (IGameProps)
 */
export const createGame = (gameID: string, socketID: string): IGameProps => {
    const game = {
        id: gameID,
        turn: Player.One,
        players: {
            [socketID]: Player.One,
        },
        board: new Array(7)
            .fill(Player.None)
            .map((x) => new Array(6).fill(Player.None)),
    };
    gameStates[gameID] = game;

    return game;
};

/**
 *  Adds a new player to the game room
 * @param gameID - the game room's ID
 * @param socketID - the socket's ID
 */
export const addPlayer = (gameID: string, socketID: string) => {
    const game = getGame(gameID);
    game.players[socketID] = Player.Two;
};

/**
 * Makes a new move
 * @param gameID - the game room's ID
 * @param col - the column to make move on
 * @returns - the updated game data (IGameProps)
 */
export const makeMove = (gameID: string, col: number) => {
    const game = getGame(gameID);
    const row = game.board[col].lastIndexOf(Player.None);
    if (row !== -1) {
        game.board[col][row] = game.turn;
        game.turn = game.turn === Player.Two ? Player.One : Player.Two;
    }
    return game;
};

/**
 * Checks if the game is over
 * @param gameID - the game room's ID
 * @returns the GameState of the game
 */
export const isGameOver = (gameID: string): GameState => {
    const game = getGame(gameID);
    const board = game.board;

    for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 6; r++) {
            const slice = [
                board[c][r],
                board[c + 1][r],
                board[c + 2][r],
                board[c + 3][r],
            ];
            if (isConnectFour(slice)) return GameState.Won;
        }
    }

    for (let c = 0; c < 7; c++) {
        for (let r = 0; r < 3; r++) {
            const slice = board[c].slice(r, r + 4);
            if (isConnectFour(slice)) return GameState.Won;
        }
    }

    for (let c = 0; c < 7; c++) {
        for (let r = 0; r < 3; r++) {
            if (c >= 3) {
                const slice = [
                    board[c][r],
                    board[c - 1][r + 1],
                    board[c - 2][r + 2],
                    board[c - 3][r + 3],
                ];
                if (isConnectFour(slice)) return GameState.Won;
            }
            if (c <= 3) {
                const slice = [
                    board[c][r],
                    board[c + 1][r + 1],
                    board[c + 2][r + 2],
                    board[c + 3][r + 3],
                ];
                if (isConnectFour(slice)) return GameState.Won;
            }
        }
    }

    const isDraw = board.some((inner: any) => !inner.includes(Player.None));
    if (isDraw) return GameState.Draw;

    return GameState.Playing;
};

/**
 * Checks if a subgroup on the board is connect4
 * @param line - an array of four pieces
 * @returns true if connect4
 */
export const isConnectFour = (line: string[]): boolean => {
    if (line.includes(Player.None)) {
        return false;
    }

    if (line.every((colour, _, arr) => colour === arr[0])) {
        return true;
    }

    return false;
};

/**
 * Retrieves the game data given a game ID
 * @param gameID - the game room's ID
 * @returns game data (IGameProps)
 */
export const getGame = (gameID: string): IGameProps => {
    return gameStates[gameID];
};

/**
 * Retrieves the game data given a socket ID
 * @param socketID - the socket's ID
 * @returns game data (IGameProps)
 */
export const getGameBySocket = (socketID: string): IGameProps => {
    return Object.values(gameStates).find((game: IGameProps) =>
        Object.keys(game.players).includes(socketID)
    ) as IGameProps;
};

/**
 * Laves a game given its game ID
 * @param gameID - the game room's ID
 */
export const leaveGame = (gameID: string) => {
    delete gameStates[gameID];
};

/**
 * Checks if the game room is full
 * @param gameID - the game room's ID
 * @returns true if game room is full
 */
export const isGameFull = (gameID: string): boolean => {
    const game = getGame(gameID);
    return Object.keys(game.players).length >= 2;
};

/**
 * Retrieves the previous player
 * @param gameID - the game room's ID
 * @returns a Player
 */
export const getPreviousPlayer = (gameID: string): Player => {
    const game = gameStates[gameID];
    return game.turn == Player.One ? Player.Two : Player.One;
};

/**
 * Returns an array of player socket IDs
 * @param gameID - the game room's ID
 * @returns an array of socket IDs
 */
export const getPlayers = (gameID: string): string[] => {
    const game = gameStates[gameID];
    return Object.keys(game.players);
};

/**
 * Retrieves all games
 * @returns a games object (IGamesProps)
 */
export const getGames = (): IGamesProps => {
    return gameStates;
};
