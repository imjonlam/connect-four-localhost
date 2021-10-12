import React, { useEffect } from "react";
import Column from "../Column";
import "./index.css";

interface IGameProps {
    game: any;
    onClick: (idx: number) => void;
    onGameOver: () => void;
}

const Game = ({ game, onClick, onGameOver }: IGameProps) => {
    useEffect(() => {
        return () => onGameOver();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="board">
            {game.board.map((gamePieces: string[], idx: number) => (
                <Column
                    key={idx}
                    gamePieces={gamePieces}
                    onClick={() => onClick(idx)}
                />
            ))}
        </div>
    );
};

export default Game;
