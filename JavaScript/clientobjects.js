function Lobby()
{
    this.ID;
    this.Players = [];
    this.MaxPlayers;
    this.Available;
    this.Blocks = [];
    this.room;

//    function SetBlocked(Player)
//    {
//        Lobby.Blocks.ForEach(Block)
//        {
//            var Loc = new Location();
//            Loc.posX = Player.posX;
//            Loc.posY = Player.posY;
//            this.Blocked = true;
//        }
//    }
}

function Player()
{
	this.ID;
	this.Location;
	this.Color;
	this.Direction;
	this.Ready;
}

function Block()
{
	this.Blocked = false;
	this.ID;
	this.Color;
	this.Location;
}

function Location()
{
	this.posX;
	this.posY;
}