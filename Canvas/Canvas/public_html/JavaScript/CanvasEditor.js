var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var splashUp = false;
var gameStarted = false;
var hit = false;
var bewogen = false;
//Images
var splashImage = new Image();
var gridImage = new Image();
var playImage = new Image();
//Image sources
splashImage.src = "images/SplashScreen.png";
gridImage.src = "images/grid.png";
playImage.src = "images/menu/play.PNG";
//Array with button locations
var buttonX = [384,384,384,384];
var buttonY = [350,400,450,500];
var buttonWidth = [100,100,100,100];
var buttonHeight = [25,25,25,25];

//Drawing splash screen on canvas
splashImage.onload = function() {
    ctx.drawImage(splashImage, 0, 0);
    splashUp = true;
};
//Continue to menu by clicking anywhere on canvas
$("#myCanvas").click(function () {
   if(splashUp == true) {
       ctx.clearRect(0,0, c.width, c.height);
       ctx.drawImage(playImage, buttonX[0], buttonY[0]);
       splashUp = false;
   }
});
//Or press any key to continue to menu
document.onkeydown = function(evt){
    if(splashUp === true) {
        ctx.clearRect(0,0, c.width, c.height);
        ctx.drawImage(playImage, buttonX[0], buttonY[0]);
        splashUp = false;
    }
 };
//Function that handles the mouse position in order to recognize which button is clicked
function getPosition(event) {
    var x,
        y;
    if (event.x != undefined && event.y != undefined) {
        x = event.x;
        y = event.y;
    } else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= c.offsetLeft;
    y -= c.offsetTop;
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    mouseX = x;
    mouseY = y;

    //To detect if Play button is pressed, and if pressed to handle its event.
    if (mouseX > buttonX[0] &&
        mouseX < buttonX[0] + buttonWidth[0] &&
        mouseY > buttonY[0] &&
        mouseY < buttonY[0] + buttonHeight[0]) {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(gridImage, 0, 0);
        startGame();
        gameStarted = true;
    }
}
//Function to start the game
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
    }
}



