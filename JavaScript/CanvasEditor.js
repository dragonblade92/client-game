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
var wins;
var lose;
var socket;
var mouseX;
var mouseY;

//Images
var splashImage = new Image();
var gridImage = new Image();
var mainImage = new Image();
var newImage = new Image();
var joinImage = new Image();
var readyImage = new Image();
var exitImage = new Image();

//Array with button locations
var buttonX = [280,280,680,720];
var buttonY = [120,220,10,550];
var buttonWidth = [400,400,244,170];
var buttonHeight = [70,70,70,70];

//Image sources
splashImage.src = "images/SplashScreen.png";
gridImage.src = "images/grid.png";
mainImage.src= "images/menu/mainmenu.png";
newImage.src = "images/menu/new.png";
joinImage.src = "images/menu/join.png";
readyImage.src = "images/menu/ready.png";
exitImage.src = "images/menu/exit.png";

//Drawing splash screen on canvas -Jasper & Michiel
splashImage.onload = function()
{
    ctx.drawImage(splashImage, 0, 0);
    splashUp = true;
};

//Continue to menu by clicking anywhere on canvas -Jasper en Michiel
$("#myCanvas").click(function ()
{
   LoadMenu();
});

//Or press any key to continue to menu -Jasper en Michiel
document.onkeydown = function()
{
    LoadMenu();
};
 
//Function that loads the menu -Jasper
function LoadMenu()
{
    if(splashUp == true) {
        ctx.clearRect(0,0, c.width, c.height);
        ctx.drawImage(mainImage, 0, 0);
        ctx.drawImage(newImage, buttonX[0], buttonY[0]);
        ctx.drawImage(joinImage, buttonX[1], buttonY[1]);
        splashUp = false;
        mainMenu = true;
    }
}

//Clear canvas and draw new game field -Jasper & Michiel
function DrawField()
{
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(gridImage, 0, 0);
    ctx.drawImage(readyImage, buttonX[2], buttonY[2]);
}

//Function that handles the mouse position in order to recognize which button is clicked -Jasper
function GetPosition(event)
{
    var x,
        y;
    if (event.x != undefined && event.y != undefined)
    {
        x = event.x;
        y = event.y;
    }
    else
    {
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
    MenuButton(0);
    //join game button
    MenuButton(1);
    //ready button
    MenuButton(2);
    //restart button
    MenuButton(3);

}
//function that adds functionality to buttons, with variable buttonIndex to know which coordinates to obtain from the array -Jasper
function MenuButton(buttonIndex)
{
    //Checking to see if the mouse clicked on the position of a button
    if (mouseX > buttonX[buttonIndex] &&
        mouseX < buttonX[buttonIndex] + buttonWidth[buttonIndex] &&
        mouseY > buttonY[buttonIndex] &&
        mouseY < buttonY[buttonIndex] + buttonHeight[buttonIndex])
    {
        if(gameStarted == false)
        {
            if(buttonIndex == 0)
            {
                //If it's the button "New Game"
                if(mainMenu == false)
                {
                    //If the splashscreen is up
                    mainMenu = true;
                } 
                else
                {                    
                    //var roomname = ShowInput("What is the roomname?");
                    var roomname = prompt("Making a new room. New room name: ");
                    socket.emit('create', roomname);
                    DrawField();
                    gameStarted = true;
                }
            }
			
            //If it's button "Join game"
            if(buttonIndex == 1)
            {
                if(mainMenu == false)
                {
                    //If the splashscreen is up
                    mainMenu = true;
                }
                else
                {
                    //var joinroom = ShowInput("What is your username?");
                    var joinroom = prompt("Name of the room you want to join: ");
                    console.log(joinroom);
                    socket.emit('switchRoom', joinroom);
                    DrawField();
                    gameStarted = true;
                }
            }
        }
        if(gameStarted)
        {
            //To see if Ready button is pressed
            if(buttonIndex == 2)
            {
                console.log("player ready");
                playerReady = true;
                //ctx.clearRect(xcoordinate_of_img1,ycoordinate_of_img1,xcoordinate_of_img1 + img1.width ,ycoord_of_img1 +img1.height );
                DrawField();
                ctx.drawImage(exitImage, buttonX[3], buttonY[3]);
                socket.emit('ready');
            }
            if(playerReady)
            {
                if (buttonIndex == 3)
                {
                splashUp = true;
                LoadMenu();
                playerReady = false;
                gameStarted = false;
                socket.emit('switchRoom', "Lobby");
                //socket.emit('restart');
                //socket.emit('ready');
                }
            }
        }
    }
}

//Function to start the game -Michiel
function StartGameC()
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
    DrawPlayers();
    setTimeout(function(){ tickrate = setInterval(Update, 125)}, 3000);
}

//Moves and draws the players -Michiel J
function Update()
{	
    //socket.emit
    Moving();
    DrawPlayers();
    bewogen = false;
    
}

//Draws the players -Jasper en Michiel
function DrawPlayers() 
{
    ctx.clearRect(0, 0, c.width, c.height);
    
    gameRoom.Players.forEach( function (value, index)
    {
        ctx.fillStyle= value.Color;
        ctx.fillRect(value.Location.posX, value.Location.posY,16,16);
    });    
    
    gameRoom.Blocks.forEach( function (value, index)
    {
        //ctx.shadowBlur=10;
        var shadow = value.Color;
        shadow = shadow.replace("FF", "88");
        ctx.shadowColor= shadow;
        ctx.fillStyle = value.Color;
        ctx.fillRect(value.Location.posX,value.Location.posY,16,16);
    });	
}

//Moves the player according to their direction -Michiel
function Moving() 
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

    MakeBlok(pl.Location);
    
    switch(pl.Direction)
    {
        case "up":
        pl.Location.posY = pl.Location.posY - 16;
        if(pl.Location.posY < 0)
        {
            alert("You failed!");
            clearInterval(tickrate);
        }
        break;
        case "down":
        pl.Location.posY = pl.Location.posY + 16;
        if(pl.Location.posY > 624)
        {
            alert("You failed!");
            clearInterval(tickrate);
        }
        break;
        case "left":
        pl.Location.posX = pl.Location.posX - 16;
        if(pl.Location.posX < 0)
        {
            alert("You failed!");
            clearInterval(tickrate);
        }
        break;
        case "right":
        pl.Location.posX = pl.Location.posX + 16;
        if(pl.Location.posX > 624)
        {
            alert("You failed!");
            clearInterval(tickrate);
        }
        break;
    }

    socket.emit('location', pl.Location);
    bewogen = false;
}

document.onkeydown = CheckKey;

//When there's an arrowkey input, changes the direction of the player -Michiel
function CheckKey(e) {
    e = e || window.event;

    var player1;
    gameRoom.Players.forEach( function (value, index)
    {
        if(value.ID == socket.username)
        {			
            player1 = value;
        }
    });

    var dir;
    if(e.keyCode == '37') {
        // left arrow key
        if (player1.Direction == "up" && bewogen == false || player1.Direction == "down" && bewogen == false)
        {
            player1.Direction = "left";
            bewogen = true;
            dir = "left";
        }
    } else if(e.keyCode == '38') {
        // up arrow key
        if (player1.Direction == "left" && bewogen == false || player1.Direction == "right" && bewogen == false)
        {
            player1.Direction = "up";
            bewogen = true;
            dir = "up";
        }
    }
    else if(e.keyCode == '39') {
        // right arrow key
        if (player1.Direction == "up" && bewogen == false || player1.Direction == "down" && bewogen == false)
        {
            player1.Direction = "right";
            bewogen = true;
            dir = "right";
        }
    }
    else if(e.keyCode == '40') {
        // down arrow key
        if (player1.Direction == "left" && bewogen == false || player1.Direction == "right" && bewogen == false)
        {
            player1.Direction = "down";
            bewogen = true;
            dir = "down";
        }
    }
    
    socket.emit('direct', dir);
}

function YouLose(user)
{
    lose += 1;
    alert("You have collided");
    //count looses
}

function YouWin()
{
    //count wins
    wins += 1;
    alert("You have won");
    
}

//Makes a block and sends it to the server -Michiel
function MakeBlok(location, color)
{
    var blok = new Block();
    blok.Location = new Location();
    blok.Location.posY = location.posY;
    blok.Location.posX = location.posX;
    blok.Color = color;
    blok.Blocked = true;
    socket.emit('NewBlock', blok);
}

//this code is mostely from: http://goldfirestudios.com/blog/108/CanvasInput-HTML5-Canvas-Text-Input
//doesnt work properly, it stays on the screen no matter what
function ShowInput(question, keyWord)
{
    var input = new CanvasInput(
    {
        canvas: document.getElementById('myCanvas'),
        fontSize: 18,
        fontFamily: 'Arial',
        fontColor: '#212121',
        fontWeight: 'bold',
        width: 300,
        padding: 8,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 3,
        boxShadow: '1px 1px 0px #fff',
        innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
        placeHolder: question,
        onsubmit: function()
        {           
            if(keyWord == "adduser")
            {
                socket.username = input._value;
            }
            
            socket.emit(keyWord, input._value);
            input.destroy();
            DrawField()
        }
    });
}