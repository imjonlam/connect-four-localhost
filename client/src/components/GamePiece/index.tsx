import React from "react";
import "./index.css";

interface IGamePieceProps {
    colour: string;
}

const GamePiece = ({ colour }: IGamePieceProps) => {
    return (
        <div className="game-piece" style={{ backgroundColor: colour }}></div>
    );
};

export default GamePiece;
