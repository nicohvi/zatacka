window.SocketWrapper = {};
(function(module) {

	module.init = function() {
		var module = {};

		module.bindSend = function(_send) {
			module.send = function(move) {
				_send(JSON.stringify(move));
			};
		};
		
		module.listen = function(message) {
			_listen( JSON.parse(message.data) );
		};

		module.bindListen = function(callback) {
			_listen = callback;
		};

		return module;
	};
})(window.SocketWrapper);