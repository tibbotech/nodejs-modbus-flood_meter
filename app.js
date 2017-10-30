const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use("/", express.static('public'));

const EventEmitter = require('events');
class ModbusMeterEmitter extends EventEmitter {}

const modbusMeterEmitter = new ModbusMeterEmitter();

client.connectRTUBuffered("/dev/ttyO1", {baudrate: 19200}, function(){
    setInterval(function(){
        client.setID(11);
        client.readInputRegisters(901, 1, function (err, data) {
            if(!err){
                try{
                    let value = data.data[0];
                    modbusMeterEmitter.emit('flood-event', value);
                }catch(err){
                    console.log(err)
                }
            }else{
                console.log(err)
            }
        });
    }, 1000);
});

let clients = io.on('connection', function(socket){
    console.log('USER CONNECTED');


    modbusMeterEmitter.on('flood-event', (value) => {
        clients.emit('flood-event', value);
    });

    socket.on('disconnect', function(){
        console.log('USER DISCONNECTED');
    });
});

// Runs HTTP server on :3000 port
http.listen(3000,function(){
    console.log("LISTENING");
});

