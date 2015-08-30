function _13ActorRanged(_world, bName, bW, bH) {
	
	var _auraProps = {
		grav: -0.5,
		lifespan: 600,
		freq: 60,
		on: true,
		fx: { scale: true, alpha: false }
	}
	
	var _aura = _world.addParticles('aura_' + bName, 10);	
	_13ObjExtend(_aura, _auraProps);
	
	_aura.min.pos = { x: -5, y: -5 }
	_aura.max.pos = { x: 5, y: 5 }
	_aura.min.vel.y = 0;
	_aura.max.vel.y = 10;
	
	// particles created before body because i need them under the body
	
	var _retObj = new _13Actor(_world, bName, bW, bH, 'ranged');
	_aura.link = _retObj;
	
	var _bulLife = 2500;
	var _bulVel = 500;
	
	_13Each(_retObj.bullets, function(_cbul) {
		_cbul.w = 20;
		_cbul.h = 20;
		
		var _aura = _world.addParticles('aura_bullet_' + bName, 20);	
		_13ObjExtend(_aura, _auraProps);
		_aura.lifespan = 400;
		_aura.freq = 60;
		_aura.min.vel.y = -50;
		_aura.max.vel.y = 50;
	
		_aura.link = _cbul;
	})
	
	var _atkTime = 2000;
	
	return _13ObjExtend(_retObj, {
		w: 60,
		h: 60,
		grav: 0,
		collide: 'bullet_player',
		action: {
			move: null,
			watch: { x: 0, y: 0 },
			attack: false
		},
		health: new _13LimVal(10 + 60 * _retObj.level),
		damval: 25,
		didatk: 2500,
		pushback: function (tbod, _pushc) {
			// PUSHBACK
			var _pusha = Math.atan2(this.pos.y - tbod.pos.y, this.pos.x - tbod.pos.x);
			this.vel.x = Math.cos(_pusha) * 300;
			this.vel.y = Math.sin(_pusha) * 300;
		},
		onDie: function(bullet) {
		},
		beforeUpdate: function(timePassed) {
			var _act = this.action;
		},
		afterUpdate: function(timePassed) {
			var _act = this.action;
			
			this.facing = _act.watch.x > 0;
			
			var _wdir = Math.atan2(_act.watch.y, _act.watch.x);
			
			this.didatk -= timePassed;
			
			if(_act.move != null) // MOVING
			{
				for(var i in this.acc)
				{
					this.acc[i] = timePassed * this.revmult * 0.2 * ((_act.move[i] - this.pos[i]) - this.vel[i]);
				}
			}
			
			this.alpha = 1 - Math.min(0.5 * this.level + 0.49, _13Dist(this.vel, { x: 0, y: 0}) / 500);
			
			if(this.didatk <= 0 && _act.attack)
			{
				this.didatk = _atkTime / this.revmult; // RANGED ATTACK

				var _this = this;
				_13Each(this.bullets, function (_cbul) {
					if(_cbul.dead)
					{
						var _adir = _wdir;
						
						_cbul.undie(_bulLife);
						
						_cbul.pos.x = _this.pos.x;
						_cbul.pos.y = _this.pos.y;
						
						_cbul.vel.x = Math.cos(_adir) * _bulVel;
						_cbul.vel.y = Math.sin(_adir) * _bulVel;
						
						return true;
					}
				});
				
				_13MediaSounds.shoot.play();
			}
		}
	});
}