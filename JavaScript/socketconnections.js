//making a connection to the server.
socket = io.connect('http://localhost:8083');
//var socket = io.connect('http://tron.jasperkoning.com:8083');

//Getting the username of the user.
socket.on('connect', function()
{
    //werkt niet vanwege splashscreen
    socket.username = prompt("What is your username?");
    socket.emit('adduser', socket.username);
});

//recieve the new message.
socket.on('updatechat', function (username, data)
{
    $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>');
});

//to update the list with rooms
socket.on('updaterooms', function (rooms, current_room)
{
    $('#rooms').empty();
    $.each(rooms, function(key, value)
    {
        //this is the room the player is in/
        if(value == current_room)
        {
            $('#rooms').append('<div id=\''+value+'\'>' + value + '</div>');
        }
        else
        {
            //these are the other rooms.
            $('#rooms').append('<div id=\''+value+'\'><a href="#" onclick="SwitchRoom(\''+value+'\')">' + value + '</a></div>');
        }
    });
});

//to delete a room from the page
socket.on('deleteRoom', function (current_room) 
{
    var d = "#" + current_room;
    $(d).remove();
});

//if the room the user is trying to join is full this will trigger
socket.on('Roomfull', function () 
{
    alert("Room is full");
});

//if the roomname or player name already exists this will function will be triggered
socket.on('Exists', function () 
{
    socket.emit('create', prompt("what is your roomname?"));
});

//if the roomname or player name does not exists this will function will be triggered
socket.on('NonExi', function () 
{
    alert("This room doesnt exist.");
    socket.emit('SwitchRoom', prompt("what is your roomname?"));
});

//Playernaam bestaat al
socket.on('PlayerExists', function () 
{
    alert("There is already a Player with that name!");
    socket.username = prompt("What is your username?");
    socket.emit('adduser', prompt("what is your username?"));
});

//gets the gameroom and data
socket.on('gameroom', function(gr)
{
    gameRoom = gr;
    //console.log("gameRoom.Blocks = ");
    //console.log(gameRoom.Blocks);
});

//starts the game
socket.on('start', function()
{
    console.log("start");
    StartGameC();
});

//game ends
socket.on('lose', function(user)
{
    clearInterval(tickrate);
    if(socket.username == user.ID)
    {
        YouLose(user);
    }
    else
    {
        YouWin();
    }
});

function SwitchRoom(room)
{
    socket.emit('SwitchRoom', room);
}

$(function()
{
    $('#datasend').click( function()
    {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('sendchat', message);
    });

    $('#data').keypress(function(e)
    {
        if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });

    $('#roombutton').click(function()
    {
        var name = $('#roomname').val();
        $('#roomname').val('');
        socket.emit('create', name);
    });
});

socket.on('moreplayers', function()
{
    alert("You do not have enough players to start a game, but you're ready!");
});
