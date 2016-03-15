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