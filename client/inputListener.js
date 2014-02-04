
	var moving = false;

	var inputListener = function(controller) {
		var leapController = new Leap.Controller({enableGestures: true});
		leapController.connect();
		
		// Return a function to be execute each time you receive
		// a message from the server.
		return function(message) {

			if (message.event == 'state') {
				if (game) {
					game.updateState(message.state);
					game.draw();
				}
			}

			if (message.event == 'new-round') {
				if (game) {
					game.newRound();
				}
			}
			
			if (message.event != 'register') return;

			leapController.on('ready', function() {
				console.log('leapmotion ready for input')
			})

			leapController.on('frame', function(frame) {
				if (frame.hands.length > 0) {
					var hand = frame.hands[0];
					var pointable = hand.pointables[0];
					if (pointable) {
						var x = pointable.tipPosition[0];
						var y = pointable.tipPosition[1];
						var z = pointable.tipPosition[2];
						leaping(controller, message.uuid, x, y, z);
					}
				}
				// if (frame.gestures.length) {
				// 	var gesture = frame.gestures[0];
				// 	if (gesture.type == 'swipe') {
				// 		var direction = Curtsy.direction(gesture).type
				// 		console.log('Swiping to the ', Curtsy.direction(gesture).type);

				// 		switch(direction) {
				// 			case 'left':
				// 			if(moving) {
				// 				break;
				// 			}
				// 			else
				// 			{
				// 				controller.moveDown(message.uuid)
				// 				moving = true
				// 			}
				// 			case 'right':
				// 			if(moving) {
				// 				break;
				// 			}
				// 			else
				// 			{
				// 				controller.moveUp(message.uuid)
				// 				moving = true
				// 			}
				// 		}

				// 		setTimeout(function() {controller.straight(message.uuid);moving = false}, 500)

				// 	}
				// }
			});


			// $(document).on('keydown', function(event) {
			// 	if (event.keyCode == 38) {
			// 		event.preventDefault(); 
			// 		controller.moveDown(message.uuid);
			// 	} 
			// 		event.preventDefault();
			// 		controller.moveUp(message.uuid);	
			// 	}
			// });

			// $(document).on('keyup', function(event) {
			// 	if (event.keyCode == 38 || event.keyCode == 40) {
			// 		event.preventDefault();	
			// 		controller.straight(message.uuid);
			// 	}
			// });

};
};