function _13ActorRanged(_world, bName, bW, bH) {
	
	var _auraProps = {
		grav: -0.5,
		lifespan: 600,
		freq: 60,
		on: true,
		fx: { scale: true, alpha: false }
	}
	
	var _aura = _world.addParticles('aura_' + bName, 10);	
	_13Obj.extend(_aura, _auraProps);
	
	_aura.min.pos = { x: -5, y: -5 }
	_aura.max.pos = { x: 5, y: 5 }
	_aura.min.vel.y = 0;
	_aura.max.vel.y = 10;
	
	// particles created before body because i need them under the body
	
	var _retObj = new _13Actor(_world, bName, bW, bH, 'ranged');
	_aura.link = _retObj;
	
	var _bulLife = 2500;
	var _bulVel = 500;
	
	for(var i = 0; i < _retObj.bullets.length; i++)
	{
		var _cbul = _retObj.bullets[i];
		_cbul.w = 20;
		_cbul.h = 20;
		
		var _aura = _world.addParticles('aura_bullet_' + bName, 20);	
		_13Obj.extend(_aura, _auraProps);
		_aura.lifespan = 400;
		_aura.freq = 60;
		_aura.min.vel.y = -50;
		_aura.max.vel.y = 50;
	
		_aura.link = _cbul;
	}
	
	var _atkTime = 2000;
	
	return _13Obj.extend(_retObj, {
		w: 50,
		h: 50,
		grav: 0,
		collide: 'bullet_player',
		action: {
			move: null,
			watch: { x: 0, y: 0 },
			attack: false
		},
		health: new _13LimVal(15),
		damval: 25,
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
				for(var _i in this.acc)
				{
					this.acc[_i] = timePassed * 0.2 * ((_act.move[_i] - this.pos[_i]) - this.vel[_i]);
				}
			}
			
			if(this.level > 0) this.alpha = 1 - Math.min(0.97, _13Geom.dist(this.vel, { x: 0, y: 0}) / 500);
			
			if(!this.awake) this.didatk = _atkTime;
		
			if(this.didatk <= 0 && _act.attack)
			{
				this.didatk = _atkTime; // RANGED ATTACK

				for(var i = 0; i < this.bullets.length; i++)
				{
					var _cbul = this.bullets[i];
					if(_cbul.dead)
					{
						var _adir = _wdir;
						
						_cbul.undie(_bulLife);
						
						_cbul.pos.x = this.pos.x;
						_cbul.pos.y = this.pos.y;
						
						_cbul.vel.x = Math.cos(_adir) * _bulVel;
						_cbul.vel.y = Math.sin(_adir) * _bulVel;
						
						break;
					}
				}
			}
		}
	});
}