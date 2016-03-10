var http = require('http');
var server = http.createServer( handler );
server.listen(8000);
console.log("listening on port 8000");

function handler( request, response ) 
{
	response.writeHead(200 , { "Content-Type": "text/plain"});
 	response.write("Hello World");

	
    response.end();
    console.log("response sent..");
};

var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) 
{
	console.log("user connected: " + socket.id);
	
	socket.on("ClientMessage", SendAllOthers("ServerMessage", data)); 
	//to all other connected clients
	//io.sockets.emit("message", data); //to all connected clients
});

function SendAllOthers(MessageType, data)
{
	socket.broadcast.emit(MessageType, data);
}

function Lobby()
{
	this.ID;
	this.Players[];
	this.MaxPlayers;
	this.Available;
	this.Blocks[];
	
	function CheckAvailable()
	{
		if(this.Players[].length == this.MaxPlayers)
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


