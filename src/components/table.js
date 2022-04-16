import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://localhost:300', {
    transports: ['websocket', 'polling']
})

const Table = () => {
    const [players, setPlayers] = useState([]);
    const [hands, setHands] = useState([]);
    const [deck, setDeck] = useState([]);

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit("players", players);
        });
        socket.on('connect', () => {
            socket.emit("hands", hands);
        });
        socket.on('connect', () => {
            socket.emit("deck", deck);
        });
        socket.on('disconnected', () => {
            socket.emit("deck", deck);
        });
    })

    return (
        <div></div>
    );
}

export default Table;