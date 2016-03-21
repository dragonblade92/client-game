var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var splash = document.getElementById("splashPlaatje");
var splashUp = false;

window.onload = function() { 
    ctx.drawImage(splash, 0, 0);
    splashUp = true;
};

$("#myCanvas").click(function () {
    if(splashUp === true) {
        ctx.clearRect(0, 0, c.width, c.height);
        
        splashUp = false;
    } else {
        startGame();
    }
});





document.onkeydown = function(evt){
    if(splashUp === true) {
        ctx.clearRect(0, 0, c.width, c.height);
        
        splashUp = false;
    } else {
        new startGame();
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
    player2.posX = 604;
    player2.posY = 320;
    player2.Color = "Blue";
    player2.Direction = "left";
    ctx.fillStyle="#0000FF";
    ctx.fillRect(player2.posX,player2.PosY,16,16);
    move();
    new tickrate();
    
    function tickrate() {
        window.setInterval(move, 125);
    }

    function move() {
        ctx.fillStyle="#FF0000";
        ctx.fillRect(player1.posX,player1.PosY,16,16);
        ctx.fillStyle="#0000FF";
        ctx.fillRect(player2.posX,player2.PosY,16,16);
        setBlocked(player1);
        setBlocked(player2);
    }
}



