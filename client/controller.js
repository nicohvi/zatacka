window.ctrl = {};
(function (module) {
	module.init = function(socket) {
		var innerModule = {};
		
		innerModule.moveLeft = function (uuid) {
			socket.send( { uuid: uuid, event: 'move_up' } );
		};
		
		innerModule.moveRight = function(uuid) {
			socket.send( { uuid: uuid, event: 'move_down' } );
		};
		
		innerModule.register = function(name) {
			socket.send( { event: 'register', name: name } );
		};
		
		innerModule.straight = function(uuid) {
			socket.send( { uuid: uuid, event: 'none' } );
		};

		return innerModule;
	};
})(ctrl);	
