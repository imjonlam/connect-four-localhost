import React from "react";
import GamePiece from "../GamePiece";
import "./index.css";

interface IColumnProps {
    gamePieces: string[];
    onClick: () => void;
}

const Column = ({ gamePieces, onClick }: IColumnProps) => {
    return (
        <div className="column" onClick={onClick}>
            {gamePieces.map((colour: string, idx: number) => (
                <GamePiece key={idx} colour={colour} />
            ))}
        </div>
    );
};

export default Column;
