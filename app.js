var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , _ = require('underscore')
  , uuid = require('node-uuid')
  , WebSocket = require('ws')
  , WebSocketServer = WebSocket.Server;

server.listen(8000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.use('/zatacka', express.static('Zatacka'));
app.use('/client', express.static('client'));

var sockets = {};
var serversocket;

console.log('Starting websockets')
var wss = new WebSocketServer({port: 8080});

wss.on('connection', function(ws) {
  console.log('Connection received');
  var id;
    ws.on('message', function(message) {
      var data = JSON.parse(message);
      
      if (data.event == 'im_server') {
        serversocket = ws;
        console.log('Server registered');
        return;
      }

      if (serversocket == null) {
        console.log('Server not conneted');
        return; 
      }

      if (data.event == 'register') {
        id = uuid.v4();
        data['uuid'] = id;
        serversocket.send( JSON.stringify(data) );
        sockets[id] = { socket: ws, success: false };
      }
      else if (data.event == 'register_response') {
        id = data.uuid;
        data.event = 'register';
        sockets[id].success = true;
        sockets[id].socket.send( JSON.stringify( data ) );
      }
      else if (data.event == 'move_up' || data.event == 'move_down' || data.event == 'none') {
        serversocket.send( JSON.stringify( data ) );
      }

      if (ws == serversocket) {
        if (_.contains(['state', 'new-round'], data.event)) {
          _.each(sockets, function(Socket) {
            var sock = Socket.socket; 
            sock.send( message );
          });
        }
      }

    });

    ws.on('close', function() {
      if (ws != serversocket) {
        serversocket.send( JSON.stringify( { event: 'deregister', uuid: id  } ) );
        sockets = _.omit( sockets, id );
      }
    });

});