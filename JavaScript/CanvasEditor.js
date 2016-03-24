var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var splashUp = false;
var mainMenu = false;
var gameStarted = false;
var hit = false;
var bewogen = false;
//Images
var splashImage = new Image();
var gridImage = new Image();
var mainImage = new Image();
var playImage = new Image();
var joinImage = new Image();
//Image sources
splashImage.src = "images/SplashScreen.png";
gridImage.src = "images/grid.png";
mainImage.src= "images/menu/mainmenu.png";
playImage.src = "images/menu/play.png";
joinImage.src = "images/menu/join.png";
//Array with button locations
var buttonX = [330,330,330,330];
var buttonY = [110,240,310,440];
var buttonWidth = [315,300,300,300];
var buttonHeight = [100,100,100,100];

//Drawing splash screen on canvas
splashImage.onload = function() {
    ctx.drawImage(splashImage, 0, 0);
    splashUp = true;
};
//Continue to menu by clicking anywhere on canvas
$("#myCanvas").click(function () {
   if(splashUp === true) {
       ctx.clearRect(0,0, c.width, c.height);
       ctx.drawImage(mainImage, 0, 0);
       ctx.drawImage(playImage, buttonX[0], buttonY[0]);
       ctx.drawImage(joinImage, buttonX[1], buttonY[1]);
       splashUp = false;
       mainMenu = true;
   }
});
//Or press any key to continue to menu
document.onkeydown = function(evt){
    if(splashUp === true) {
        ctx.clearRect(0,0, c.width, c.height);
        ctx.drawImage(mainImage, 0, 0);
        ctx.drawImage(playImage, buttonX[0], buttonY[0]);
        ctx.drawImage(joinImage, buttonX[1], buttonY[1]);
        splashUp = false;
        mainMenu = true;
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
    //Play button
    if(gameStarted === false) {
        if (mouseX > buttonX[0] &&
            mouseX < buttonX[0] + buttonWidth[0] &&
            mouseY > buttonY[0] &&
            mouseY < buttonY[0] + buttonHeight[0]) {
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.drawImage(gridImage, 0, 0);
            //Checks to see if the splash screen has been passed yet.
            if (mainMenu === false) {
                mainMenu = true;
            } else {
                startGame();
                gameStarted = true;
            }
        }
    }
    //Join button
    if(gameStarted === false) {
        if (mouseX > buttonX[1] &&
            mouseX < buttonX[1] + buttonWidth[1] &&
            mouseY > buttonY[1] &&
            mouseY < buttonY[1] + buttonHeight[1]) {
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.drawImage(gridImage, 0, 0);
            if (mainMenu === false) {
                mainMenu = true;
            } else if (gameStarted === false) {
                startGame();
                gameStarted = true;
            }
        }
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
        ctx.fillStyle="#8DD5DF";
        ctx.shadowBlur=10;
        ctx.shadowColor="#74b1b9";
        ctx.fillRect(player1.posX,player1.posY,16,16);
        ctx.fillStyle="#FFDC33";
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



