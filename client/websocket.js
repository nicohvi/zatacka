(function(module) {
	if (module == null) {
		window.webSocket = {};
		module = window.webSocket;
	}

	// URI to the WS server.

	function createWebSocket() {

		websocket = new WebSocket(wsUri);
		
		websocket.onopen = function (evt) {
			onOpen(evt)
		};
		websocket.onclose = function (evt) {
			onClose(evt)
		};
		websocket.onmessage = function (evt) {
			onMessage(evt)
		};
		websocket.onerror = function (evt) {
			onError(evt)
		};

	}

	// open is a function passed to the 
	// init function of the web socket to be called as soon as the socket
	// connects to the server.
	function init(open) {
		createWebSocket();
		_onOpen = open;
	}

	var _listenCallback;
	var listen = function(callback) {
		_listenCallback = callback;
	}

	function onMessage(evt) {
		if (_listenCallback != null) {
			_listenCallback(evt);
		}
	}


	function onClose(evt) {
	}

	function onError(evt) {

	}

	function doSend(message) {
		websocket.send(message);
	}

	function onOpen(evt) {
		
		if (_onOpen != null) _onOpen( { 
			send: doSend, 
			listen: listen
		} );
	}

	module.init = init;	

})(window.webSocket);