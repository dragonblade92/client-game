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
        window.alert("Sample text");
        splashUp = false;
    }
});

document.onkeydown = function(){
    if(splashUp === true) {
        ctx.clearRect(0, 0, c.width, c.height);
        window.alert("Sample text2");
        splashUp = false;
    }
};