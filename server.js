//global variables ---------------------------
var http = require('http');
var server = http.createServer(Handler);
var usernames = {};
var rooms = ['Lobby'];
var Player = require("./JavaScript/objects").Player;
var Lobby = require("./JavaScript/objects").Lobby;
var Location = require("./JavaScript/objects").Location;
var Block = require("./JavaScript/objects").Block;

function Handler(request, response)
{
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");

    response.end();
    console.log("response sent..");
}

//Making the server
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

//Handles incomming connections - Déan
function Connect(socket)
{
    //Send a message
    socket.on('ClientMessage', function (data)
    {
        socket.broadcast.emit('ServerMessage', data);
    });

    //adduser ---------------------------------------------------------
    // adds a user to the system
    socket.on('adduser', function (username)
    {
        var bool = true;

        //checks to see if player exists
        var p = FindUser(username);
        if (p != undefined)
        {
            //player already exists
            socket.emit("PlayerExists");
            bool = false;
        }
        if (bool)
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

            //check if gameroom is full
            if (gameRooms[0].Players.length == gameRooms[0].MaxPlayers)
            {
                gameRooms[0].Available = false;
            }
            //otherwise, go into gameRoom
            else
            {
                gameRooms[0].Players.push(p);
                gameRooms[0].Available = true;
            }
            //if gameRooms are not available
            if (!gameRooms[0].Available)
            {
                console.log("something went wrong");
            }

            //sent a message to the everybody in the server and the server itself that you joined
            socket.emit("PlayerInfo", p);
            socket.emit('updatechat', 'SERVER', 'you have connected to Lobby');
            socket.broadcast.to('Lobby').emit('updatechat', 'SERVER', username + ' has connected to this room');
            socket.emit('updaterooms', rooms, 'Lobby');
        }
    });

    //Game room stuff:
    //Create ==============================================================
    // Creates a new room and gameroom with the given name
    socket.on('create', function (room)
    {
        var bool = true;
        rooms.forEach(function (index, value)
        {
            if (bool)
            {
                //checks if the lobbyname exists
                if (index == room)
                {
                    socket.emit("exists");
                    bool = false;
                }
            }
        });
        //if there's no lobby yet
        if (bool)
        {
            //make new lobby
            rooms.push(room);
            var l = new Lobby();
            l.ID = room;
            l.MaxPlayers = 2;
            l.Available = true;
            l.room = rooms[room];
            gameRooms.push(l);
            ChangeRoom(socket, room);
            io.sockets.emit('updaterooms', rooms, socket.room);
        }
    });

    //sendchat ===============================================
    //sends chat to everyone in the room
    socket.on('sendchat', function (data)
    {
        io.sockets["in"](socket.room).emit('updatechat', socket.username, data);
    });

    //switchRoom =======================================================
    // switches the user from one room to another.
    socket.on('switchRoom', function (newroom)
    {
        ChangeRoom(socket, newroom);
    });

    //add a new block to the lobby the player is in.
    socket.on('NewBlock', function (block)
    {
        var gr = FindRoomOccupiedByUser(socket.username);
        AddBlock(gr, block);        
    });

    //sets new location of player,
    //also checks for collisions
    socket.on('location', function (Location)
    {
        var pl = FindUser(socket.username);
        var gr = FindRoomOccupiedByUser(socket.username);
        pl.Location.posX = Location.posX;
        pl.Location.posY = Location.posY;
        var check = CheckCollision(gr);
        
        //if not undefined the player that has lost will have his id sent to the clients
        if (check != undefined)
        {
            io.to(gr.room).emit('lose', check.ID);
        } 
        else
        {        
            io.sockets["in"](socket.room).emit('gameroom', gr);
        }
    });

    //resets the blocks and locations of the players
    socket.on('restart', function ()
    {
        var pl = FindUser(socket.username);
        var gr = FindRoomOccupiedByUser(socket.username);

        gr.Players.forEach(function (value, index)
        {
            value.Ready = false;
        });

        NewPlayerLocation(gr);
        StartGame(socket);
    });

    //sets the client as ready
    socket.on('ready', function ()
    {
        var gr = FindRoomOccupiedByUser(socket.username);
        gr.Players.forEach(function (value, index)
        {
            if (value.ID == socket.username)
            {
                var pl = new Player();
                pl.ID = value.ID;
                pl.Ready = true;
                gr.Players[index] = pl;
                StartGame(socket);
            }
        });
    });
    
    //changes the direction of the player
    socket.on('direct', function(dir)
    {
        var pl = FindUser(socket.username);
        pl.Direction = dir;
    });
    
    //removes the user from the room on disconnect
    socket.on('disconnect', function ()
    {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        socket.leave(socket.room);
        console.log("disconnected");
    });

    //to all other connected clients
    //io.sockets.emit("message", data); //to all connected clients
}

//gets the index of the room based on the username of the client - Déan
function GetIndexOfRoom(name)
{
    //gets the index of the gameRoom
    var r = -1;
    gameRooms.forEach(function (value, index)
    {
        if (gameRooms[index].ID == name)
        {
            r = index;
        }
    });
    return r;
}

//changes the client from one room to another - Déan
function ChangeRoom(socket, newRoom)
{
    //changes the room of the player
    if (socket.room != newRoom)
    {
        var index = GetIndexOfRoom(newRoom);

        if (index == -1)
        {
            //the room doesnt exist
            socket.emit('NonExi');
            return;
        }

        //gameroom has space left for players
        if (gameRooms[index].Available)
        {
            var pl = FindUser(socket.username);
            
            //leave the old room
            var oldRoom;
            oldRoom = socket.room;
            socket.leave(socket.room);

            //finding the current room of the player;
            r = FindRoomOccupiedByUser(socket.username);

            //finding him in the array
            var playerIndex = r.Players.indexOf(pl);

            //remove the player from the old room
            if (playerIndex > -1)
            {
                r.Players.splice(playerIndex, 1);
            }

            //gameRoom not found
            if (gameRooms[index] == undefined)
            {
                console.log("UNDEFINED GameRoom");
            }
            
            //add player to the new gameroom
            if (gameRooms[index].Players == undefined)
            {
                gameRooms[index].Players = [pl];
            }
            else
            {
                //add the player to the room
                gameRooms[index].Players.push(pl);
            }

            //als de room 0 spelers heeft dan delete de room.
            if (getUsersInRoomNumber(oldRoom) == null && oldRoom != "Lobby")
            {
                var index = rooms.indexOf(oldRoom);
                if (index > -1)
                {
                    rooms.splice(index, 1);
                    io.sockets.emit('deleteRoom', oldRoom);
                }
            }

            //join the new room
            socket.join(newRoom);

            socket.emit('updatechat', 'SERVER', 'you have connected to ' + newRoom);
            socket.broadcast.to(oldRoom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
            socket.room = newRoom;
            socket.broadcast.to(newRoom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
            socket.emit('updaterooms', rooms, newRoom);
            StartGame(socket);
        }
        else
        {
            socket.emit("Roomfull");
        }
    }
}

//find the user based on his username
function FindUser(username)
{
    var player;

    gameRooms.forEach(function (value, index)
    {
        gameRooms[index].Players.forEach(function (value2, index2)
        {
            if (username == gameRooms[index].Players[index2].ID)
            {
                player = gameRooms[index].Players[index2];
            }
        });
    });

    return player;
}

//finds the room the user is in based on username - Déan
function FindRoomOccupiedByUser(username)
{
    var player;

    gameRooms.forEach(function (value, index)
    {
        gameRooms[index].Players.forEach(function (value2, index2)
        {
            if (username == gameRooms[index].Players[index2].ID)
            {
                player = gameRooms[index];
            }
        });
    });

    return player;
}

//returns the ammount of users in the room
function getUsersInRoomNumber(roomName, namespace)
{
    if (!namespace)
        namespace = '/';
    var room = io.nsps[namespace].adapter.rooms[roomName];
    if (!room)
        return null;
    return Object.keys(room).length;
}

//sets the player location of the players in a certain room - Déan
function NewPlayerLocation(gr)
{
    gr.Players[0].Location = new Location();
    gr.Players[0].Location.posX = 32;
    gr.Players[0].Location.posY = 304;
    gr.Players[0].Direction = "up";

    if (gr.Players[1] != undefined)
    {
        gr.Players[1].Location = new Location();
        gr.Players[1].Location.posX = 592;
        gr.Players[1].Location.posY = 320;
        gr.Players[1].Direction = "down";
    }
}

//Adds a block to a gameroom - Déan
function AddBlock(gr, NewBlock)
{
    //add a block at location
    var b = new Block();
    var highestID = 0;
    
    gr.Blocks.forEach(function (value, index) {
        if (value.ID >= highestID)
        {
            highestID = value.ID + 1;
        }
    });
    
    b.ID = highestID;
    b.Blocked = NewBlock.Blocked;
    b.Location = new Location();
    b.Location.posX = NewBlock.Location.posX;
    b.Location.posY = NewBlock.Location.posY;
    gr.Blocks.push(b);
}

//sends the gameroom to the clients - Déan
function StartGame(socket)
{
    //start the game when everybody is ready
    var gr = FindRoomOccupiedByUser(socket.username);
    NewPlayerLocation(gr);
    var pl = FindUser(socket.username);

    //socket.emit('BlockInfo', gr.Blocks);
    io.sockets["in"](socket.room).emit('gameroom', gr);
    EveryOneReady(socket);
}

//checks collisions between the objects in gameroom - Déan
function CheckCollision(gr)
{
    //checks for collision with blocks
    var player;
    if (gr.Blocks != undefined)
    {
        gr.Players.forEach(function (value, index)
        {
            gr.Blocks.forEach(function (value2, index2)
            {
                if (value2.Blocked)
                {
                    if (value.Location.posX == value2.Location.posX)
                    {
                        if (value.Location.posY == value2.Location.posY)
                        {
                            player = value;
                        }
                    }
                }
            });
        });
    }
    return player;
}

//checks to see if everyone in a room is ready - Déan
function EveryOneReady(socket)
{
    //checks if everybody has pressed the ready button
    var gr = FindRoomOccupiedByUser(socket.username);
    var r = true;
    gr.Players.forEach(function (value, index)
    {
        if (!value.Ready)
        {
            r = false;
        }
    });

    if (r)
    {
        io.sockets["in"](socket.room).emit('start', gr);
    }
}