// Global variables
let http = require('http');
let express = require('express');
let io = require('socket.io');
let five = require("johnny-five");

// Create board instance
let board = new five.Board();
// Create app instance
let app = new express();

// Set the port number
let port = 3000;

// Set the app instance to read the public directory
// Will find index.html
app.use(express.static(__dirname + '/public'));

// board.on
board.on("ready", function() {
  // Connection meassage in the console
  console.log('ARDUINO BOARD READY STATE: TRUE');

  // This requires OneWire support using the ConfigurableFirmata
  // Create a thermometer instance
  let thermometer = new five.Thermometer({
    controller: "DS18B20",
    pin: 2
  });

  let servo = new five.Servo(10);

  this.repl.inject({
    servo: servo
  });

  servo.write(90);

  // On.change
  thermometer.on("change", function() {
    // Prints data to 'server' console
    console.log(this.celsius + "°C");
    // console.log("0x" + this.address.toString(16));

    // Send data via io
    io.emit('data', this.celsius);
  });
});

// Begin 'listening' on pre defined port number
const server = http.createServer(app).listen(port, function(req, res){
  console.log('LISTENING ON PORT ' + port);
});

// Set up socket.io
io = io.listen(server);

io.on('connection', function(socket){
  console.log('SOCKET.IO CONNECTED');

  socket.on('disconnect', function(){
    console.log('SOCKET.IO DISCONNECTED');
  })
});