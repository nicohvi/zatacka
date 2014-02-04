var config = {
	curveWidth: 6
};

function GameState() {
	var context = document.getElementById('canvas').getContext('2d'),
	players = {},
	initPlayers = function(state) {
		_.each(state, function(player) {
			var transformed = { 
				id: player.uuid,
				color: "#000", 
				x: player.x,
				y: player.y,
				vx: player.vx,
				vy: player.vy,
				jmp: player.jmp,
				pre: {
					x: player.x,
					y: player.y
				}
			};

			players[player.uuid] = transformed;
		});
	},
	resetPlayers = function() {
		players = {};
	},
	getPlayers = function() {
		return players;
	},
	noPlayers = function(state) {
		return _.isEmpty(players);
	},
	updatePlayers = function(state) {
		_.each(state, function(player) {
			var transformed = getPlayers()[player.uuid];
			if (player.jmp.hole > 0) {
				transformed.pre.x = transformed.x;
				transformed.pre.y = transformed.y
			} else {
				transformed.pre.x = player.x + player.gap * player.vx;
				transformed.pre.y = player.y + player.gap * player.vy;
			}
			transformed.x = player.x;
			transformed.y = player.y;
			transformed.vx = player.vx;
			transformed.vy = player.vy;
			transformed.jmp = player.jmp;

			players[player.uuid] = transformed;
		});
	},
	drawPlayer = function(player) {
		
		if (player.jmp.hole > 0) {
			context.beginPath();
			context.fillStyle = player.color;
			context.strokeStyle = player.color;
			context.lineWidth = config.curveWidth;
			context.moveTo(player.pre.x, player.pre.y);
			context.lineTo(player.x,player.y);	
			context.stroke();
		}
		
		
		
	};

	var timeout = 1/24,
	pending = false,
	promise = 0;
	return {
		updateState: function(state) {
			if (noPlayers()) initPlayers(state);
			else updatePlayers(state);
			
		},
		draw: function() {

			var perform = function () {
				_.each(getPlayers(), function(player) {
					drawPlayer(player);
				});
			}

			if (pending) return;

			promise = setTimeout(function() {
				perform();
				pending = false;
			}, timeout);
		},
		newRound: function() {
			context.clearRect(0,0,800,600);
			resetPlayers();
		}
	}
}

var game = GameState();