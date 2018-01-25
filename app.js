// Global variables
let http = require('http');
let express = require('express');
let io = require('socket.io');
let five = require("johnny-five");

// Create board instance
let board = new five.Board({ port: "COM3" });
// Create app instance
let app = new express();

// Set the port number
let port = 3000;

// Set the app instance to read the public directory
// Will find index.html
app.use(express.static(__dirname + '/public'));

// board.on
board.on("ready", function() {
  // Connection message in the console
  console.log('ARDUINO BOARD READY STATE: TRUE');

  // As an example, i have included here the code which enables a DS18B20 Temperature Sensor 
  // This requires OneWire support using the ConfigurableFirmata
  // Create a thermometer instance
  let thermometer = new five.Thermometer({
    controller: "DS18B20",
    pin: 2
  });

  // On.change
  thermometer.on("change", function() {
    //Prints data to 'server' console
    console.log(this.celsius + "°C");

  // Send data via sockets.io
  io.emit('data', this.celsius);
  }); // End of thermometer
});

// Begin 'listening' on the pre defined port number (3000)
const server = http.createServer(app).listen(port, function(req, res){
  console.log('LISTENING ON PORT ' + port);
});

// Set up socket.io to 'listen'
io = io.listen(server);

// Display a conection message
io.on('connection', function(socket){
  console.log('SOCKET.IO CONNECTED');

  // Display a disconnection message
  socket.on('disconnect', function(){
    console.log('SOCKET.IO DISCONNECTED');
  })
});