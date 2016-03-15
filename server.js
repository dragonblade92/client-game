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

var lob = new Lobby('Lobby');
lob.ID = 'Lobby';
lob.MaxPlayers = 99999;
lob.Available = true;
var lobbies = [lob];


//message handeling--------------------------------------------
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
		var newplay = new Player();
		newplay.ID = socket.id;
		newplay.Name = username;
		newplay.room = "Lobby";
		lobbies['Lobby'].Players.Add(newplay);
        socket.join('Lobby');
        socket.emit('updatechat', 'SERVER', 'you have connected to Lobby');
        socket.broadcast.to('Lobby').emit('updatechat', 'SERVER', username + ' has connected to this room');
        socket.emit('updaterooms', rooms, 'Lobby');
    });

    socket.on('create', function(room) {
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
			}
		}
		
        socket.join(newroom);
		
        socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
        socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
        socket.emit('updaterooms', rooms, newroom);		
        io.sockets.emit('updaterooms', rooms, socket.room);
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

function Lobby(Room)
{
	this.ID;
	this.Players = [];
	this.MaxPlayers;
	this.Available;
	this.Blocks = [];
	this.room = Room;
	
	function CheckAvailable()
	{
		if(this.Players.length == this.MaxPlayers)
		{
			this.Available = false;
		}
		else
		{
			this.Available = true;
		}
	}
	
	function SetBlocked(Player)
	{
		this.Blocks.ForEach(Block)
		{
			var Loc = new Location();
			switch(Player.Direction)
			{
				case "up":
				Loc.Height = Player.Height + 16;
				case "down":
				Loc.Height = Player.Height - 16;
				case "left":
				Loc.Height = Player.Height + 16;
				case "right":
				Loc.Height = Player.Height - 16;
			}
			
			if(this.Location == Loc)
			{
				this.Blocked = true;
			}
		}
	}
	
	function GetPlayer(ID)
	{
		for (i = 0; i < this.Players.length; i++)
		{
			if(this.Players[i].ID == ID)
			{
				return this.Players[i];
			}
		}		
		return null;
	}
}

function Player()
{
	this.ID;
	this.Name;
	this.Location;
	this.Color;
	this.Direction;
}

function Block()
{
	this.Blocked;
	this.ID;
	this.Color;
	this.Location;
}

function Location()
{
	this.width;
	this.height;
}

function FindPlayerLobby(PlayerID)
{
	for (i = 0; i < lobbies.length; i++)
	{
		var x = lobbies[i].GetPlayer(PlayerID);
		if(x != null)
		{
			return lobbies[i];
		}
	}	
	return null;
}

function FindPlayer(PlayerID)
{
	for (i = 0; i < lobbies.length; i++)
	{
		var x = lobbies[i].GetPlayer(PlayerID);
		if(x != null)
		{
			return x;
		}
	}	
	return null;
}