	$(document).ready(function() {

	// kids skal klare:
	// 1: opprette leap controller
	// 2: sette spillernavn

	var open = function(websocketMethods) {
		console.log('Connection open');

			// Create new socketWrapper
			// initialize controller with socketWrapper
			// bind sending and listening for the socketWrapper
			// 		sending: send to the websocket
			// 		listening: listen to the input controller
			//
			// The websocket begins listening to the socketWrapper
			// once the wrapper's bindings are completed.
			//
			// Finally the new player is registered.


			var socketWrapper = SocketWrapper.init();
			var controller = ctrl.init(socketWrapper);

			socketWrapper.bindSend(websocketMethods.send);
			socketWrapper.bindListen(inputListener(controller));

			websocketMethods.listen(socketWrapper.listen)
			
			console.log('Register player');
			controller.register(playerName);

		};

		webSocket.init(open);
	});