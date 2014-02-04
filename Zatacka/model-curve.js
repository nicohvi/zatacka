//the Model (move to model-curve.js)
Game.Curve = Backbone.Model.extend({

	defaults: {
		name: 'Death',
		x:0,
		y:0,
		vx:0,
		vy:0,
		angle:0,
		color:"#0FF",
		toMove:false,
		direction:0,
		speed:1,
		hole:0,
		alive:true,
		gap: Math.round(Math.random() * 250) + 50,
		gapping: false,
		score:0,
		playing:true,
		upKey:37,
		downKey:39,
		keyLabel:'',
		matchScore:0,
		uuid: "must be set"
	},

	initialize: function(){
		var x = Math.round(Math.random() * (config.canvasWidth - (config.canvasWidth*0.4))) + config.canvasWidth*0.2,
		y = Math.round(Math.random() * (config.canvasHeight - (config.canvasHeight*0.4))) +  config.canvasHeight*0.2,

	  //generate a random movement angle for the curve
	  angle = (Math.random()*360) * Math.PI / 180,

	  //calculate the angular velocity
	  vx = Math.cos(angle)* this.get('speed'),
	  vy = Math.sin(angle)* this.get('speed');
	  this.set({	  
	  	x:x,
	  	y:y,
	  	angle:angle,
	  	vx:vx,
	  	vy:vy,
	  	alive: true,
	  	matchScore: 0,
	  });

	  var self = this;
	  websocket.addListener(function(event) {
	  	var uuid = self.attributes.uuid;
	  	var parsed = JSON.parse(event.data);
	  	if (parsed.uuid == uuid) {
	  		if (_.contains(['move_up', 'move_down', 'none'], parsed.event)) Game.move[uuid] = parsed.event;
	  		if ('deregister' == parsed.event) {
	  			Game.colors.push(self.attributes.color);
	  			self.destroy();
	  		}
	  	}
	  });


	},

	hittest: function(newx,newy){

		if ( 	
				//if curve has hit the right end
				newx > config.canvasWidth || 
				// if curve has hit the left end
				newx < 0 || 
				//if curve has hit the bottom end
				newy > config.canvasHeight ||
				//if the curve has hit top end
				newy < 0 || 
				//if the curve hit another curve or itself
				config.context.getImageData(newx,newy,1,1).data[3] > 100)
		{
				//return true -> inidicates that the curve hit something.
				return true;
			}
			//did not hit anything
			return false;
		},

		updateScore:function(){
			this.set({
				score: this.attributes.score+1,
				matchScore: this.attributes.matchScore+1,
			});
		},

		resetGap: function() {
			this.attributes.gapping = false
		},

		create: function(){
			var newx,
			newy,
			context,
			updated;

			if(this.attributes.alive === false)
				return;

			context = config.context;

		// if the curve is in rotating condition right now
		// calculate the new angular velocity

		// Use an unique identifier instead, and let the controller
		// modify Game.Move[identifier_for_up_or_down]. 
		if(Game.move[this.attributes.uuid] === 'move_up')
		{
			updated = true;
			this.attributes.angle = this.attributes.angle + (3 * Math.PI/180);
		}
		else if(Game.move[this.attributes.uuid] === 'move_down')
		{
			updated = true;
			this.attributes.angle = this.attributes.angle - (3 * Math.PI/180);
		}

		if(updated)
		{
			this.attributes.vx = Math.cos(this.attributes.angle) * this.attributes.speed;
			this.attributes.vy = Math.sin(this.attributes.angle) * this.attributes.speed;
		}	

		//calculate the new curve position
		newx = this.attributes.x + this.attributes.vx;
		newy = this.attributes.y + this.attributes.vy;

		//check for hittest of the curve.

		// draw gap for curve
		// if curve is in gap-mode: 
		// 

		if(this.attributes.gap <= 0 && !this.attributes.gapping)
		{

			// var gap = config.curveWidth * ( 2 + Math.random()*2 )
			this.attributes.gapping = true;
			// this.attributes.gap = gap;
			newx+= this.attributes.vx
			newy+= this.attributes.vy
			// this.attributes.hole = Math.round(Math.random() * 250) + 50;
			gap = Math.round(Math.random() * 250) + 50;
			this.attributes.gap = gap
			var context = this;
			setTimeout(function() { context.resetGap() }, Math.round(Math.random()*250)+200)
		}

		else if (this.attributes.gap > 0 && !this.attributes.gapping)
		{
			if(this.hittest(newx,newy) === true)
			{
				this.set('alive', false);
				Game.Controller.updateScores();
			}

			//create a path from the previous position to the new position
			this.draw(context, newx, newy);
		}

		this.attributes.x = newx;
		this.attributes.y = newy;
		this.attributes.gap -= 1

	},

	draw: function(context, newx, newy) {
		context.beginPath();
		context.fillStyle = this.attributes.color;
		context.strokeStyle = this.attributes.color;
		context.lineWidth = config.curveWidth;
		context.moveTo(this.attributes.x,this.attributes.y);
		context.lineTo(newx,newy);
		context.stroke();
		this.attributes.hole--;
	}	
});

