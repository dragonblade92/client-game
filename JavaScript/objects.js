function Lobby()
{
    this.ID;
    this.Players = [];
    this.MaxPlayers;
    this.Available;
    this.Blocks = [];
    this.room;
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

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;
exports.Block = Block;
exports.Location = Location;
exports.Lobby = Lobby;