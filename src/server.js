const server = require('http').createServer();
const io = require('socket.io')(server, {
    transports: ['websocket', 'polling']
});
const players = {};
io.on('connection', client => {
    client.on('username', username => {
        const player = {
            name: username,
            id: client.id,
        };
        players[client.id] = player;
        io.emit('connected', player);
        io.emit('players', Object.values(players))
    })
})