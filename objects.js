function Lobby()
{
	this.ID
	this.Players = [];
	this.MaxPlayers;
	this.Available;
	this.Blocks = [];
	this.room;
	
	function AddPlayer(p)
	{		
		console.log("adding player");
		if(this.Players.length == this.MaxPlayers)
		{
			console.log("not available");
			this.Available = false;
		}
		else
		{
			console.log("available");
			Players.push(p);
			this.Available = true;
		}
		return Available;
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

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;
exports.Block = Block;
exports.Location = Location;
exports.Lobby = Lobby;