var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var splash = document.getElementById("splashPlaatje");
var grid = document.getElementById("gridPlaatje");
var splashUp = false;
var gameStarted = false;
var hit = false;
var bewogen = false;

window.onload = function() { 
    ctx.drawImage(splash, 0, 0);
    splashUp = true;
};

$("#myCanvas").click(function () {
    if(splashUp === true) {
        ctx.clearRect(0, 0, c.width, c.height);
        splashUp = false;
    } else if(gameStarted === false) {
        startGame();
        ctx.drawImage(grid, 0, 0);
        gameStarted = true;
    }
});

document.onkeydown = function(evt){
    if(splashUp === true) {
        ctx.clearRect(0, 0, c.width, c.height);
        splashUp = false;
    } else if(gameStarted === false) {
        startGame();
        ctx.drawImage(grid, 0, 0);
        gameStarted = true;
    }
};

function startGame() {
    var player1 = new Player();
    player1.ID = 0;
    player1.posX = 32;
    player1.posY = 304;
    player1.Color = "Red";
    player1.Direction = "right";

    var player2 = new Player();
    player2.ID = 1;
    player2.posX = 608;
    player2.posY = 320;
    player2.Color = "Blue";
    player2.Direction = "left";
    ctx.fillStyle="#0000FF";
    ctx.fillRect(player2.posX,player2.PosY,16,16);
    var tickrate = setInterval(move, 125);


    function move() {
        ctx.fillStyle="#FF0000";
        ctx.fillRect(player1.posX,player1.posY,16,16);
        ctx.fillStyle="#0000FF";
        ctx.fillRect(player2.posX,player2.posY,16,16);
	moving(player1);
        bewogen = false;
    }
    
    function moving(Player) {
        switch(Player.Direction)
        {
            case "up":
            player1.posY = Player.posY - 16;
            if(player1.posY < 0){
                alert("You failed!");
                clearInterval(tickrate);
            }
            break;
            case "down":
            player1.posY = Player.posY + 16;
            if(player1.posY > 624){
                alert("You failed!");
                clearInterval(tickrate);
            }
            break;
            case "left":
            player1.posX = Player.posX - 16;
            if(player1.posX < 0){
                alert("You failed!");
                clearInterval(tickrate);
            }
            break;
            case "right":
            player1.posX = Player.posX + 16;
            if(player1.posX > 624){
                alert("You failed!");
                clearInterval(tickrate);
            }
            break;
        }
    }
    
    document.onkeydown = checkKey;
    
    function checkKey(e) {
        e = e || window.event;
        
        if(e.keyCode == '37') {
            // left arrow key
            //if (player1.Direction === "up" && bewogen === false || player1.Direction === "down" && bewogen === false)
            if (player1.Direction === "up" && bewogen === false || player1.Direction === "down" && bewogen === false) {
                player1.Direction = "left";
                bewogen = true;
            }
        } else if(e.keyCode == '38') {
            // up arrow key
            //if (player1.Direction === "left" && bewogen === false || player1.Direction === "right" && bewogen === false)
            if (player1.Direction === "left" && bewogen === false || player1.Direction === "right" && bewogen === false) {
                player1.Direction = "up";
                bewogen = true;
            }
        }
        else if(e.keyCode == '39') {
            // right arrow key
            //if (player1.Direction === "up" && bewogen === false || player1.Direction === "down" && bewogen === false)
            if (player1.Direction === "up" && bewogen === false || player1.Direction === "down" && bewogen === false) {
                player1.Direction = "right";
                bewogen = true;
            }
        }
        else if(e.keyCode == '40') {
            // down arrow key
            //if (player1.Direction === "left" && bewogen === false || player1.Direction === "right" && bewogen === false)
            if (player1.Direction === "left" && bewogen === false || player1.Direction === "right" && bewogen === false) {
                player1.Direction = "down";
                bewogen = true;
            }
        }
    };
}



