//global variables ---------------------------
var http = require('http');
var server = http.createServer( handler );
var usernames = {};
var rooms = ['Lobby'];

function handler( request, response ) 
{
	response.writeHead(200 , { "Content-Type": "text/plain"});
 	response.write("Hello World");
	
    response.end();
    console.log("response sent..");
};

server.listen(8080);
console.log("listening on port 8080");
var io = require("socket.io").listen(server);
io.sockets.on("connection", Connect);



function Connect(socket)
{
	console.log("user connected: " + socket.id);
	
	socket.on("ClientMessage", function(data)
	{	
		socket.broadcast.emit("ServerMessage", data);	
	}); 
	
    socket.on('adduser', function(username) {
        socket.username = username;
        socket.room = 'Lobby';
        usernames[username] = username;
        socket.join('Lobby');
        socket.emit('updatechat', 'SERVER', 'you have connected to Lobby');
        socket.broadcast.to('Lobby').emit('updatechat', 'SERVER', username + ' has connected to this room');
        socket.emit('updaterooms', rooms, 'Lobby');
    });

    socket.on('create', function(room) {
		room.users = 0;
		console.log(room.users);
        rooms.push(room);
        io.sockets.emit('updaterooms', rooms, socket.room);
    });

    socket.on('sendchat', function(data) {
        io.sockets["in"](socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('switchRoom', function(newroom) {
        var oldroom;
        oldroom = socket.room;
        socket.leave(socket.room);
		
		//als de room 0 spelers heeft dan delete de room.
		if(getUsersInRoomNumber(oldroom) == null && oldroom != "Lobby")
		{
			var index = rooms.indexOf(oldroom);
			if (index > -1) 
			{
				console.log("Room deleted: " + oldroom);
				rooms.splice(index, 1);			
				io.sockets.emit('deleteRoom', oldroom);
			}
		}
        socket.join(newroom);
		
        socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
        socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
    });

    socket.on('disconnect', function() {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        socket.leave(socket.room);
    });
	
	//to all other connected clients
	//io.sockets.emit("message", data); //to all connected clients
}

var getUsersInRoomNumber = function(roomName, namespace) {
    if (!namespace) namespace = '/';
    var room = io.nsps[namespace].adapter.rooms[roomName];
    if (!room) return null;
    return Object.keys(room).length;
}
/*
// voeg gebruiker aan lobby toe
function AddUser(username)
{
	socket.username = username;
	socket.room = 'Lobby';
	usernames[username] = username;
	socket.join('Lobby');
	socket.emit('updatechat', 'SERVER', 'you have connected to Lobby');
	socket.broadcast.to('Lobby').emit('updatechat', 'SERVER', username + ' has connected to this room');
	socket.emit('updaterooms', rooms, 'Lobby');
};
 
 //creerd nieuwe room/lobby
function Create(room) 
{
	rooms.push(room);
	socket.emit('updaterooms', rooms, socket.room);
}

//speler wisselt van room
function ChangeRoom(newroom)
{
	var oldroom;
	oldroom = socket.room;
	socket.leave(socket.room);
	socket.join(newroom);
	socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
	socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
	socket.room = newroom;
	socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
	socket.emit('updaterooms', rooms, newroom);
}

//speler disconnect
function Disconnect()
{
	delete usernames[socket.username];
	io.sockets.emit('updateusers', usernames);
	socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	socket.leave(socket.room);
}

*/
