import {
    createGame,
    leaveGame,
    getGame,
    getGames,
    getGameBySocket,
    addPlayer,
    makeMove,
    isGameOver,
    isGameFull,
    isConnectFour,
} from "./index";
import { Player } from "../../enumerators/Player";
import { getPreviousPlayer } from "./index";
import { IGameProps } from "../../interfaces/GameProps";
import { GameState } from "../../enumerators/GameState";

const gameID = "test_game";
const playerOne = "cXwh-A_nqoIJtT-mAAAAN";
const playerTwo = "aBcd-A_nqoIJtT-mAAAAN";
let game: IGameProps;

beforeEach(() => {
    game = createGame(gameID, playerOne);
});

afterEach(() => {
    leaveGame(game.id);
    game = null;
});

describe("a new game", () => {
    it("should be defined", () => expect(game).toBeDefined());
    it("should have one player", () =>
        expect(Object.keys(game.players).length).toBe(1));
    it("should have player one in array", () =>
        expect(game.players[playerOne]).toBeDefined());
    it("should be added to the games list", () =>
        expect(getGames()[game.id]).toBeDefined());
});

describe("retrieving a game", () => {
    it("should be defined by game id", () =>
        expect(getGame(game.id)).toBeDefined());
    it("should be defined by a players id", () =>
        expect(getGameBySocket(playerOne)).toBeDefined());
});

describe("adding a new player", () => {
    beforeEach(() => addPlayer(gameID, playerTwo));

    it("should have two players", () =>
        expect(Object.keys(game.players).length).toBe(2));
    it("should make the game full", () =>
        expect(isGameFull(game.id)).toBeTruthy());
    it("should be added to the players list", () =>
        expect(game.players[playerTwo]).toBeDefined());
    it("should have different colour discs for player one and two", () =>
        expect(game.players[playerOne]).not.toEqual(game.players[playerTwo]));
});

describe("making an initial move", () => {
    it("should not be game over", () => {
        makeMove(gameID, 0);
        expect(isGameOver(game.id)).toBeFalsy();
    });
});

describe("making a move", () => {
    let turn: string;
    beforeEach(() => {
        turn = game.turn;
        makeMove(gameID, 0);
    });

    it("should place disc at index (0, 5)", () =>
        expect(game.board[0][5]).toBe(turn));
    it("should update the next player", () =>
        expect(turn).not.toEqual(game.turn));
});

describe("a connect four", () => {
    const sameLine = [Player.One, Player.One, Player.One, Player.One];
    const incompleteLine = [Player.One, Player.None, Player.One, Player.One];
    const mixedLine = [Player.One, Player.Two, Player.One, Player.One];

    it("should be true if four same in a row", () =>
        expect(isConnectFour(sameLine)).toBeTruthy());
    it("should be false if a blank slot exists", () =>
        expect(isConnectFour(incompleteLine)).toBeFalsy());
    it("should be false if a mixed line exists", () =>
        expect(isConnectFour(mixedLine)).toBeFalsy());
});

describe("making a connect four horizontal", () => {
    beforeEach(() => {
        makeMove(gameID, 0);
        makeMove(gameID, 6);
        makeMove(gameID, 1);
        makeMove(gameID, 5);
        makeMove(gameID, 2);
        makeMove(gameID, 4);
        makeMove(gameID, 3);
    });

    it("should end the game", () =>
        expect(isGameOver(game.id)).toBe(GameState.Won));
    it("should declare player one as the winner", () =>
        expect(getPreviousPlayer(game.id)).toBe(Player.One));
});

describe("making a connect four vertical", () => {
    beforeEach(() => {
        makeMove(gameID, 0);
        makeMove(gameID, 1);
        makeMove(gameID, 0);
        makeMove(gameID, 1);
        makeMove(gameID, 0);
        makeMove(gameID, 1);
        makeMove(gameID, 0);
    });

    it("should end the game", () =>
        expect(isGameOver(game.id)).toBe(GameState.Won));
    it("should declare player one as the winner", () =>
        expect(getPreviousPlayer(game.id)).toBe(Player.One));
});

describe("making a connect four diagonal left", () => {
    beforeEach(() => {
        makeMove(gameID, 0);
        makeMove(gameID, 1);
        makeMove(gameID, 1);
        makeMove(gameID, 2);
        makeMove(gameID, 2);
        makeMove(gameID, 3);
        makeMove(gameID, 2);
        makeMove(gameID, 3);
        makeMove(gameID, 3);
        makeMove(gameID, 4);
        makeMove(gameID, 3);
    });

    it("should end the game", () =>
        expect(isGameOver(game.id)).toBe(GameState.Won));
    it("should declare player one as the winner", () =>
        expect(getPreviousPlayer(game.id)).toBe(Player.One));
});

describe("making a connect four diagonal right", () => {
    beforeEach(() => {
        makeMove(gameID, 6);
        makeMove(gameID, 5);
        makeMove(gameID, 5);
        makeMove(gameID, 4);
        makeMove(gameID, 4);
        makeMove(gameID, 3);
        makeMove(gameID, 4);
        makeMove(gameID, 3);
        makeMove(gameID, 3);
        makeMove(gameID, 2);
        makeMove(gameID, 3);
    });

    it("should end the game", () =>
        expect(isGameOver(game.id)).toBe(GameState.Won));
    it("should declare player one as the winner", () =>
        expect(getPreviousPlayer(game.id)).toBe(Player.One));
});
