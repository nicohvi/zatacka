//The View
//move to view-app.js
Game.Views.App = Backbone.View.extend({

	curves: Game.curves,

	el:$("#players"),

	events: {
		'click #add-new-player':'newPlayer',
		'keydown':'keypressGame',
		'keyup':'keyupGame'
	},

	startCountdown: function(count, restartGame, timeout) {
		if (count <= 0) { 
			restartGame();
		} 
		else {
			$('#count-down').html(count);
			var self = this;
			setTimeout(function() {
				self.startCountdown(count - 1, restartGame, timeout);
			}, timeout);
		}
	},

	initialize: function(){
		_.bindAll(this,'update','restart','newPlayer','updateScores');
		_.each(Game.keyMaps,function(keyMap,key){
			if(keyMap.inUse==false)
			{
				$('#new-player-controls').append(
						$('<option></option>').val(key).html(keyMap.label)
					);
			}
		});
	},

	restart: function(){
		config.context.clearRect(0,0,config.canvasWidth,config.canvasHeight);
		websocket.send(JSON.stringify({
			event: 'new-round'
		}));
		this.curves.each(function(curve){
			curve.initialize();
		});
	},

	newPlayer: function(name, uuid){
		if (uuid == null) { uuid = 'wtf-where-is-your-uuid'; }
		
		var playerNumber = $('#players li').length;
		var curve = new Game.Curve({
			name: name,
			color: Game.colors.pop(),
			uuid: uuid
		});

		curve.view = new Game.Views.Curve({model:curve});
		curve.playerView = new Game.Views.Players({model:curve});
		$('#players').append(curve.playerView.render().el);
		this.curves.add(curve);
	},

	updateScores: function(){
		this.curves.updateScores();
		if(this.curves.alive() < 2){
			Game.Controller.finshRound();
			rankings = this.curves.gameRankings();
			_(rankings).each(function(curve){
				$('#round-score-players').append('<div class="color" style="background:'+curve.get('color')+'"></div><div>'+curve.get('name')+'</div><div>'+curve.get('score')+'</div><br/>');
			});
			
			var count = 5;
			$('#count-down').html(count);
			this.startCountdown(count, this.restartGame, 1000);

			$('#round-score').fadeIn();
		}
	},

	restartGame: function(){
		$('#round-score').fadeOut();
		$('#round-score-players').empty();
		Game.Controller.restart();
	},

	update: function(){
		var state = [];
		this.curves.each(function(curve){
			curve.view.render();

			state.push({ 
				uuid: curve.attributes.uuid.substring(0,8), 
				x: curve.attributes.x, 
				y: curve.attributes.y,
				vx: curve.attributes.vx,
				vy: curve.attributes.vy,
				jmp: {
					hole: curve.attributes.hole,
					gap: curve.attributes.gap
				}
			});

		});
		websocket.send( JSON.stringify( { event: 'state', state: state } ) );
	},

	keypressGame: function(e){
		if(e.keyCode === 80)
		{
			Game.Controller.pause();
		}
		Game.keys[e.keyCode] = true;
	},

	keyupGame: function(e){
		Game.keys[e.keyCode] = false;
	}

});
