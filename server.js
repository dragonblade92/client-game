var http = require('http');
var server = http.createServer( handler );
server.listen(8000);
console.log("listening on port 8000");

function handler( request, response ) {
	response.writeHead(200 , { "Content-Type": "text/plain"});
 	response.write("Hello World");

	
    response.end();
    console.log("response sent..");
};

	var io = require("socket.io").listen(server);

	io.sockets.on("connection", function(socket) {
		console.log("user connected: " + socket.id);
		socket.on("ClientMessage", function (data) {
			socket.broadcast.emit("ServerMessage", data); //to all other connected clients
			//io.sockets.emit("message", data); //to all connected clients
		});
	});
	
	// mysql module
	var mysql = require("mysql");  

	// Create the connection 
	var connection = mysql.createConnection({ 
	host: "localhost:3307",
	user: "root", 
	password: "usbw", 
	database: "db_name"}); 

	connection.connect();
	
	
	function dbHandler(error, rows, fields) 
	{
		response.writeHead(200, {'Content-Type': 'x-application/json'}); 
		response.end(JSON.stringify(rows));
	};

	// Query the database. 
	console.log(connection.query('SELECT * FROM your_table;', dbHandler));

	connection.destroy();
