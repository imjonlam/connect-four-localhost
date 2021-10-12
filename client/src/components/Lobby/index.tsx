import React, { useState } from "react";
import "./index.css";

interface ILobbyProps {
    labelText: string;
    onSubmit: (roomID: string) => void;
}

const Lobby = ({ onSubmit, labelText }: ILobbyProps) => {
    const [roomID, setRoomID] = useState("");

    const handleChange = (event: any) => {
        setRoomID(event.target.value);
    };

    const handleSubmit = (event: any) => {
        onSubmit(roomID);
        event.preventDefault();
    };

    return (
        <form className="lobby_form" onSubmit={handleSubmit}>
            <input type="text" name="room" onChange={handleChange} />
            <label htmlFor="room">{labelText}</label>
        </form>
    );
};

export default Lobby;
