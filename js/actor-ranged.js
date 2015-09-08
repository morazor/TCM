function _13ActorRanged(_world, bName, bW, bH) {
	
	var _auraProps = {
		grav: -0.5,
		lifespan: 600,
		freq: 60,
		on: true,
		fx: { scale: 1, alpha: 1 }
	}
	
	var _aura = _13Particles(_world, 'aura_' + bName, 10);	
	_13ObjExtend(_aura, _auraProps);
	
	_aura.rnd.pos = [ 5, 5 ]
	_aura.rnd.vel[1] = 10;
	
	// particles created before body because i need them under the body
	
	var _retObj = _13Actor(_world, bName, bW, bH, 'ranged');
	_aura.link = _retObj;
	
	var _bulLife = 2500;
	var _bulVel = 600;
	
	_13Each(_retObj.bullets, function(_cbul) {
		_cbul.w = 20;
		_cbul.h = 20;
		
		var _aura = _13Particles(_world, 'aura_bullet_' + bName, 20);	
		_13ObjExtend(_aura, _auraProps);
		_aura.lifespan = 300;
		_aura.freq = 60;
		_aura.rnd.vel[1] = 50;
	
		_aura.link = _cbul;
	})
	
	var _atkTime = 2200;
	
	return _13ObjExtend(_retObj, {
		w: 60,
		h: 60,
		grav: 0,
		collide: 'bullet_player',
		action: {
			move: null,
			watch: [0, 0],
			attack: false
		},
		health: _13LimVal(10 + 80 * _retObj.level),
		damval: 25,
		didatk: 0,
		pushback: function (tbod, _pushc) {
			// PUSHBACK
			var _pusha = _13Ang(this.pos, tbod.pos);
			this.vel[0] = _13Cos(_pusha) * 300 * _pushc;
			this.vel[1] = _13Sin(_pusha) * 300 * _pushc;
		},
		onDie: function() {
		},
		beforeUpdate: function() {
		},
		afterUpdate: function(timePassed) {
			var _act = this.action;
			var _this = this;
			
			this.facing = _act.watch[0] > 0;
			
			var _wdir = Math.atan2(_act.watch[1], _act.watch[0]);
			
			this.didatk -= timePassed;
			
			 // MOVING
			var _maxSpeed = 1000 * this.revmult;
			
			_13Rep(2, function(i) {
				if(_act.move != null && Math.abs(_this.vel[i]) < _maxSpeed) 
					_this.acc[i] = timePassed * _this.revmult * 0.15 * (_act.move[i] - _this.pos[i] - _this.vel[i] / 2);
				else {
					_this.acc[i] = 0;
					_this.vel[i] *= 0.99;
				}
			});

			this.alpha = 1 - _13Min(this.level, _13Dist(this.vel, [0, 0]) / 600);
			
			if(this.didatk <= 0 && _act.attack)
			{
				this.didatk = _atkTime / this.revmult; // RANGED ATTACK

				_13Each(this.bullets, function (_cbul) {
					if(_cbul.dead)
					{
						var _adir = _wdir;
						
						_cbul.undie(_bulLife);

						_cbul.pos = _13ObjClone(_this.pos);
						
						_cbul.vel[0] = _13Cos(_adir) * _bulVel;
						_cbul.vel[1] = _13Sin(_adir) * _bulVel;
						
						return true;
					}
				});
				
				_13MediaSounds.shoot.play();
			}
		}
	});
}