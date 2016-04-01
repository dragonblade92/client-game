var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var splashUp = false;
var mainMenu = false;
var gameStarted = false;
var hit = false;
var bewogen = false;
var gameRoom;
var tickrate;
var playerReady = false;

//Images
var splashImage = new Image();
var gridImage = new Image();
var mainImage = new Image();
var newImage = new Image();
var joinImage = new Image();
var readyImage = new Image();
var restartImage = new Image();

//Array with button locations
var buttonX = [280,280,680,645];
var buttonY = [120,220,10,10];
var buttonWidth = [400,400,244,315];
var buttonHeight = [70,70,70,70];

//Image sources
splashImage.src = "images/SplashScreen.png";
gridImage.src = "images/grid.png";
mainImage.src= "images/menu/mainmenu.png";
newImage.src = "images/menu/new.png";
joinImage.src = "images/menu/join.png";
readyImage.src = "images/menu/ready.png";
restartImage.src = "images/menu/restart.png";

//Drawing splash screen on canvas
splashImage.onload = function() {
    ctx.drawImage(splashImage, 0, 0);
    splashUp = true;
};
//Continue to menu by clicking anywhere on canvas
$("#myCanvas").click(function () {
   loadMenu();
});
//Or press any key to continue to menu
document.onkeydown = function(evt){
    loadMenu();
 };
//Function that loads the menu
function loadMenu() {
    if(splashUp == true) {
        ctx.clearRect(0,0, c.width, c.height);
        ctx.drawImage(mainImage, 0, 0);
        ctx.drawImage(newImage, buttonX[0], buttonY[0]);
        ctx.drawImage(joinImage, buttonX[1], buttonY[1]);
        splashUp = false;
        mainMenu = true;
    }
}
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
    //new game button
    menuButton(0);
    //join game button
    menuButton(1);
    //ready button
    menuButton(2);
	//restart button
	menuButton(3);

}
//Clear canvas and draw new
function clearDraw() {
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.drawImage(gridImage, 0, 0);
	ctx.drawImage(readyImage, buttonX[2], buttonY[2]);
}

//function that adds functionality to buttons, with variable buttonIndex to know which coordinates to obtain from the array
function menuButton(buttonIndex) {
    if (mouseX > buttonX[buttonIndex] &&
        mouseX < buttonX[buttonIndex] + buttonWidth[buttonIndex] &&
        mouseY > buttonY[buttonIndex] &&
        mouseY < buttonY[buttonIndex] + buttonHeight[buttonIndex]) {
        if(gameStarted == false) {
            if(buttonIndex == 0) {
                //If it's the button "New Game"
                if(mainMenu == false) {
                    //If the splashscreen is up
                    mainMenu = true;
                } else
                {
                    var roomname = prompt("Making a new room. New room name: ");
                    socket.emit('create', roomname);
                    clearDraw();
                    gameStarted = true;
                }
            }
			
            //If it's button "Join game"
            if(buttonIndex == 1) {
                if(mainMenu == false) {
                    //If the splashscreen is up
                    mainMenu = true;
                } else {
                    var joinroom = prompt("Name of the room you want to join: ");
                    console.log(joinroom);
					socket.emit('switchRoom', joinroom);
                    clearDraw();
                    gameStarted = true;
                }
            }
        }
        if(gameStarted) {
            //To see if Ready button is pressed
            if(buttonIndex == 2) {
				console.log("player ready");
				playerReady = true;
				//ctx.clearRect(xcoordinate_of_img1,ycoordinate_of_img1,xcoordinate_of_img1 + img1.width ,ycoord_of_img1 +img1.height );
				ctx.clearRect(0, 0, c.width, c.height);
				ctx.drawImage(gridImage, 0, 0);
				ctx.drawImage(restartImage, buttonX[3], buttonY[3])
				socket.emit('ready');
			}
			if(playerReady) {
				if (buttonIndex == 3) {
					socket.emit('restart');
				}
			}
        }
    }
}

//Function to start the game
function startGame() 
{
	
	gameRoom.Players.forEach( function (value, index)
	{
		if(index == 0)
		{
			value.Color = "#0000FF";
		}
		else
		{
			value.Color = "#FF0000";
		}		
	});
    drawPlayers();
	tickrate = setInterval(update, 125);
}

function update()
{	
	//socket.emit
	moving();
	drawPlayers();
	bewogen = false;
}

function drawPlayers() 
{
	console.log("DRAWTIME");
	gameRoom.Players.forEach( function (value, index)
	{
		console.log(value);
		ctx.fillStyle= value.Color;
		ctx.fillRect(value.Location.posX, value.Location.posY,16,16);
	});
	
	gameRoom.Blocks.forEach( function (value, index)
	{
		console.log("blockss");
		console.log(value);
		//ctx.shadowBlur=10;
		var shadow = value.Color
		shadow = shadow.replace("FF", "88");
		ctx.shadowColor= shadow;
		ctx.fillStyle = value.Color;
		ctx.fillRect(value.Location.posX,value.Location.posY,16,16);
	});
	
}

function moving() 
{
	console.log("I like to move it move it");
	var pl;
	gameRoom.Players.forEach( function (value, index)
	{
		if(value.ID == socket.username)
		{			
			pl = value;
		}
	});
	
	switch(pl.Direction)
	{
		case "up":
		makeBlok(pl.Location);
		pl.Location.posY = pl.Location.posY - 16;
		if(pl.Location.posY < 0){
			alert("You failed!");
			clearInterval(tickrate);
		}
		break;
		case "down":
		makeBlok(pl.Location);
		pl.Location.posY = pl.Location.posY + 16;
		if(pl.Location.posY > 624){
			alert("You failed!");
			clearInterval(tickrate);
		}
		break;
		case "left":
		makeBlok(pl.Location);
		pl.Location.posX = pl.Location.posX - 16;
		if(pl.Location.posX < 0){
			alert("You failed!");
			clearInterval(tickrate);
		}
		break;
		case "right":
		makeBlok(pl.Location);
		pl.Location.posX = pl.Location.posX + 16;
		if(pl.Location.posX > 624){
			alert("You failed!");
			clearInterval(tickrate);
		}
		break;
	}
		
	socket.emit('location', pl.Location);
	bewogen = false;
}

document.onkeydown = checkKey;

function checkKey(e) {
	e = e || window.event;
	
	var player1;
	gameRoom.Players.forEach( function (value, index)
	{
		if(value.ID == socket.username)
		{			
			player1 = value;
		}
	});
	
	if(e.keyCode == '37') {
		// left arrow key
		if (player1.Direction == "up" && bewogen == false || player1.Direction == "down" && bewogen == false) {
			player1.Direction = "left";
			bewogen = true;
		}
	} else if(e.keyCode == '38') {
		// up arrow key
		if (player1.Direction == "left" && bewogen == false || player1.Direction == "right" && bewogen == false) {
			player1.Direction = "up";
			bewogen = true;
		}
	}
	else if(e.keyCode == '39') {
		// right arrow key
		if (player1.Direction == "up" && bewogen == false || player1.Direction == "down" && bewogen == false) {
			player1.Direction = "right";
			bewogen = true;
		}
	}
	else if(e.keyCode == '40') {
		// down arrow key
		if (player1.Direction == "left" && bewogen == false || player1.Direction == "right" && bewogen == false) {
			player1.Direction = "down";
			bewogen = true;
		}
	}
}

function youLose(user) {
	alert("You have collided");
	clearInterval(tickrate);
	
}

function makeBlok(location) {
    var blok = new Block();
	blok.Location = new Location();
    blok.Location.posY = location.posY;
	blok.Location.posX = location.posX;
    blok.Blocked = true;
	socket.emit('NewBlock', blok);
}