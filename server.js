//global variables ---------------------------
var http = require('http');
var server = http.createServer( handler );
var usernames = {};
var rooms = ['Lobby'];
var Player = require("./JavaScript/objects").Player;
var Lobby = require("./JavaScript/objects").Lobby;
var Location = require("./JavaScript/objects").Location;
var Block = require("./JavaScript/objects").Block;

function handler( request, response ) 
{
	response.writeHead(200 , { "Content-Type": "text/plain"});
 	response.write("Hello World");
	
    response.end();
    console.log("response sent..");
}

server.listen(8081);
console.log("listening on port 8081");
var io = require("socket.io").listen(server);
io.sockets.on("connection", Connect);

//creating the gameroom lobby
var l = new Lobby();
l.ID = "Lobby";
l.MaxPlayers = 1000;
l.Available = true;
l.room = rooms["Lobby"];
var gameRooms = [l];

function Connect(socket)
{
	console.log("user connected: " + socket.id);
	
	socket.on("ClientMessage", function(data)
	{	
		socket.broadcast.emit("ServerMessage", data);	
	}); 
	
	//adduser ---------------------------------------------------------
	// adds a user to the system
        socket.on('adduser', function(username) {
		console.log("Trying to add new player: " + username);
		
		var bool = true;
		
		//checks to see if player exists
		var p = FindUser(username);		
		if(p != undefined)
		{			
			console.log("Player already exists");
			socket.emit("PlayerExists");
			bool = false;
		}	
		if(bool)
		{
			//player doesnt exist
			//player joins the lobby
			socket.username = username;
			socket.room = 'Lobby';
			usernames[username] = username;
			socket.join('Lobby');		

			//making the player
			var p = new Player();
			p.ID = username;
			p.Ready = false;
			
			if(gameRooms[0].Players.length == gameRooms[0].MaxPlayers)
			{
				console.log("room full");
				gameRooms[0].Available = false;
			}
			else
			{
				console.log("room available");
				gameRooms[0].Players.push(p);
				gameRooms[0].Available = true;
			}
			if(!gameRooms[0].Available)
			{
				console.log("something went wrong");
			}
			
			socket.emit("PlayerInfo", p);
			socket.emit('updatechat', 'SERVER', 'you have connected to Lobby');
			socket.broadcast.to('Lobby').emit('updatechat', 'SERVER', username + ' has connected to this room');
			socket.emit('updaterooms', rooms, 'Lobby');
		}
    });

	//Game room stuff:
	//Create ==============================================================
	// Creates a new room and gameroom with the given name
    socket.on('create', function(room) {
		console.log("created room");
		var bool = true;
		rooms.forEach(function( index, value ) 
		{
			if(bool){
				console.log( index + ": " + value );
				if(index == room)
				{
					console.log("room already exists");
					socket.emit("exists");
					bool = false;
				}
			}
		});		
		if(bool)
		{
			rooms.push(room);
			console.log("ROOMS");
			console.log(room);
			var l = new Lobby();
			l.ID = room;
			l.MaxPlayers = 2;
			l.Available = true;
			l.room = rooms[room];
			gameRooms.push(l);
			console.log("GAMEROOMS");
			console.log(gameRooms);
			ChangeRoom(socket, room);
			io.sockets.emit('updaterooms', rooms, socket.room);
		}
    });

	//sendchat ===============================================
	// sends chat to everyone in the room
    socket.on('sendchat', function(data) {
        io.sockets["in"](socket.room).emit('updatechat', socket.username, data);
    });
	
	//switchRoom =======================================================
	// switches the user from one room to another.
    socket.on('switchRoom', function(newroom)
	{
		ChangeRoom(socket, newroom);
	}); 
	
	//add a new block to the lobby the player is in.
	socket.on('NewBlock', function(block) 
	{
		var gr = FindRoomOccupiedByUser(socket.username);
		AddBlock(gr, block);
    });

	//sets new location of player,
	//also checks for collisions
	socket.on('location', function(Location)
	{
		var pl = FindUser(socket.username);
		var gr = FindRoomOccupiedByUser(socket.username);
		pl.Location.posX = Location.posX;
		pl.Location.posY = Location.posY;
		var check = CheckCollision(gr);
		if(check != undefined)
		{
			io.to(gr.room).emit('lose', check.ID);
		}
	});
	
	//resets the blocks and locations of the players
	socket.on('restart', function()
	{
		var pl = FindUser(socket.username);
		var gr = FindRoomOccupiedByUser(socket.username);
		
		gr.Players.forEach(function(value, index){
			value.Ready = false;
		});
		
		NewPLayerLocation(gr);
		StartGame(socket);
	});
	
	socket.on('ready', function()
	{
		console.log("Ik wil ready");
		var pl = FindUser(socket.username);
		var gr = FindRoomOccupiedByUser(socket.username);
		pl.Ready = true;
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

function GetIndexOfRoom(name)
{
	var r = -1;
	gameRooms.forEach( function (value, index)
	{
		if(gameRooms[index].ID == name)
		{
			r = index;
		}
	});
	return r;
}

function ChangeRoom(socket, newRoom)
{
	if(socket.room != newRoom)
	{
		var index = GetIndexOfRoom(newRoom);
		
		if(index == -1)
		{
			console.log("gameRoom not found!");
			socket.emit("NonExi");
			return;
		}
		
		//gameroom has space left for players
		if(gameRooms[index].Available)
		{					
			var pl = FindUser(socket.username);
			//leave the old room
			var oldroom;
			oldroom = socket.room;
			socket.leave(socket.room);
			
			//finding the current room of the player;
			r = FindRoomOccupiedByUser(socket.username);
			
			//finding him in the array
			var playerindex = r.Players.indexOf(pl);
			
			//remove the player from the old room
			if (playerindex > -1)
			{
				r.Players.splice(playerindex, 1);
			}
			console.log(gameRooms[index]);
			if (gameRooms[index] == undefined) {
				console.log("UNDEFINED");
			}
			if(gameRooms[index].Players == undefined) {
					gameRooms[index].Players = [pl];
					//add player to the new gameroom
			}else {
				gameRooms[index].Players.push(pl);
			}

			console.log("---");
			console.log(gameRooms);
			//als de room 0 spelers heeft dan delete de room.
			if(getUsersInRoomNumber(oldroom) == null && oldroom != "Lobby")
			{
				var index = rooms.indexOf(oldroom);
				if (index > -1) 
				{
					rooms.splice(index, 1);			
					io.sockets.emit('deleteRoom', oldroom);				
					console.log("Room deleted: " + oldroom);
				}
			}
			
			//join the new room
			socket.join(newRoom);
			
			socket.emit('updatechat', 'SERVER', 'you have connected to ' + newRoom);
			socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
			socket.room = newRoom;
			socket.broadcast.to(newRoom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
			socket.emit('updaterooms', rooms, newRoom);
			//StartGame(socket);
		}
		else
		{
			console.log("full");
			socket.emit("Roomfull");
		}
	}
}

function FindUser(username)
{
	var player;

	gameRooms.forEach( function (value, index)
	{			
		gameRooms[index].Players.forEach( function (value2, index2)
		{
			if(username == gameRooms[index].Players[index2].ID)
			{
				console.log("found player");
				player = gameRooms[index].Players[index2];
			}
		});
	});
	
	return player;
}

function FindRoomOccupiedByUser(username)
{
	var player;

	gameRooms.forEach( function (value, index)
	{			
		gameRooms[index].Players.forEach( function (value2, index2)
		{
			if(username == gameRooms[index].Players[index2].ID)
			{
				console.log("found player");
				player = gameRooms[index];
			}
		});
	});
	
	return player;
}

function getUsersInRoomNumber(roomName, namespace) {
    if (!namespace) namespace = '/';
    var room = io.nsps[namespace].adapter.rooms[roomName];
    if (!room) return null;
    return Object.keys(room).length;
}

function NewPLayerLocation(gr)
{
	gr.Players[0].Location = new Location();
	gr.Players[0].Location.posX = 32;
    gr.Players[0].Location.posY = 304;
	gr.Players[0].Direction = "up";
	
	if(gr.Players[1] != undefined)
	{		
		gr.Players[1].Location = new Location();
		gr.Players[1].Location.posX = 592;
		gr.Players[1].Location.posY = 320;
		gr.Players[1].Direction = "down";
	}
}

function AddBlock(gr, NewBlock)
{
	var b = new Block();
	var highestid = 0;
	gr.Blocks.forEach( function (value, index) {
		if(value.ID >= highestid)
		{
			highestid = value.ID + 1;
		}
	});
	b.ID = highestid;
	b.Blocked = NewBlock.Blocked;
	b.Location = new Location();
	b.Location.posX = NewBlock.Location.posX;
	b.Location.posY = NewBlock.Location.posY;
	gr.Blocks.push(b);
}

function StartGame(socket)
{
	var gr = FindRoomOccupiedByUser(socket.username);
	NewPLayerLocation(gr);
	var pl = FindUser(socket.username);
	//socket.emit('BlockInfo', gr.Blocks);
	io.sockets["in"](socket.room).emit('gameroom', gr);
        setTimeout(everyOneReady(), 3000);
}

function CheckCollision(gr)
{	
    var player;
    if(gr.Blocks != undefined){
            gr.Players.forEach( function (value, index)
            {
                    gr.Blocks.forEach( function (value2, index2)
                    {
                            if(value2.Blocked)
                            {
                                    console.log("check5");
                                    if(value.Location.posX == value2.Location.posX)
                                    {
                                            console.log("pos X ok");
                                            console.log(value.Location.posY);
                                            console.log(value2.Location.posY );
                                            if(value.Location.posY == value2.Location.posY)
                                            {
                                                    console.log("Collision by: " + value.ID);
                                                    player = value;
                                            }
                                    }
                            }
                    });
            });
    }
    return player;
}

function everyOneReady()
{
    if(gr.Players.length >= 2) {
            var r = false;
            console.log("Ik wil ready3");
            gr.Players.forEach(function (value, index) {
                    if (!value.Ready) {
                            r = true;
                            console.log("Ik wil ready4"+value.Ready);

                    }
            });

            console.log(r);

            if (!r) {
                    StartGame(socket);
                    console.log("Ik wil ready5");
            }
    } else {
            console.log("Less than two players");
            socket.emit('moreplayers');
    }
}