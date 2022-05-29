const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

app.use(cors());

let players = 0;
io.on('connection', socket => {
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });

    socket.on('createTable', (data) => {
        io.to(data.table).emit(data);
    });

    socket.on('sendMessage', (data) => {
        socket.to(data.table).emit('getMessages', data);
    });

    // Users joins the table created
    socket.on('joinTable', (data) => {
        socket.join(data);
    });

    // Identifies player 1 as the dealer and player 2 as the player
    socket.on('setPlayer', () => {
        if (players === 0) {
            players++;
            socket.emit('Dealer')
        } else if (players === 1) {
            socket.emit('Player');
            players = 0
        }
    })

    // Update the current state for all users
    // Occurs when a user would hit, stay, or the hand ends
    socket.on('updateState', state => {
        console.log('updateState', state)

    });
})

server.listen(3001, () => {
    console.log('It is working!');
})