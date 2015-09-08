function _13Actor(_world, bName, bW, bH, bType) {
	var _retObj = _world.addBody(bName, bW, bH);
	
	var _spnam = (bType == 'melee' ? 'sparks' : 'sparks_' + bName);
	var _pgrav = (bType == 'melee' ? 1 : 0);
	
	var _sparks = _13Particles(_world, _spnam, 10);
	_13ObjExtend(_sparks, {
		rotvel: 10,
		grav: _pgrav,
		lifespan: 350,
		freq: 0,
		collide: 'wall',
		fx: { scale: 1, alpha: 1 }
	});
	
	_sparks.rnd.vel = [350, 350]

	var _blood = _13ObjExtend(_13Particles(_world, 'blood_' + bName, 5), {
		lifespan: 350,
		freq: 0,
		grav: _pgrav,
		fx: { scale: 1 }
	});
	
	_blood.rnd.scale = 0.5;

	if(bName == 'player' || bName == 'rev_player') {
		_blood.autorot = true;
	}
	else {
		_blood.rnd.rot = PI;
		_blood.rnd.rotvel = 10;
	}
	
	_blood.rnd.vel = [200, 200]
	
	if(bType == 'ranged') {
		_blood.fx.alpha = 1;
	}
	
	_retObj.bullets = [];
	_13Rep(bType == 'melee' ? 10 : 2, function() {
		var _cbul = _world.addBody('bullet_' + bName);
		_13ObjExtend(_cbul, {
			grav: 0,
			w: 25,
			h: 25,
			dead: true,
			collide: false,
			overlap: true,
			owner: _retObj,
			dammod: 1, // useful for damage normalization for different speed swing animations
			onOverlap: function (tbod) {
				_retObj.onHit(tbod, this);
			}
		});
		
		_retObj.bullets.push(_cbul);
	});
	
	var _lev = bName.match(/\d$/);
	if(_lev != null) _lev = parseInt(_lev[0], 10);
	
	_13ObjExtend(_retObj, {
		type: bType,
		level: _lev,
		faction: (bName == 'player' ? 'good' : 'evil'),
		awake: false,
		stopatk: false,
		didatk: 0,
		health: _13LimVal(100 + 100 * _lev), // should go in melee-actor
		damval: 2,
		atkspeed: 1,
		speed: 400,
		revmult: 1,
		damage: function(bullet) {		
			// DAMAGE
			if(!this.dead)
			{
				var _cdam = bullet.owner.damval * bullet.owner.revmult * bullet.dammod;
				var _this = this;
				
				if(this.revved) {
					var _maxh = _13Min(this.revpow.c, _cdam); // maximum convertible damage is current rewpow
					this.revpow.add(-_maxh); 
					this.health.add(_maxh);
					this.health.add(_maxh - _cdam); // apply exceeding damage
				}
				else this.health.add(-_cdam);
				
				_13Rep(2, function(i) {
					_blood.pos[i] = (bullet.pos[i] + _this.pos[i] * 2) / 3;

					_blood.vel[i] = _this.vel[i] * 1.5;
				});
				
				_blood.on = 3;
				
				if(this.health.c <= 0) {
					this.die(bullet); // DIE!!!
				}
				else this.onDamage(bullet);
			}
		},
		pushback: function (tbod, _pushc) {
			// PUSHBACK
			this.vel[0] = (this.pos[0] > tbod.pos[0]) ? (300) : (-300) * _pushc;
			this.vel[1] = -120 * _pushc;
		},
		onHit: function(tbod, bullet)
		{
			var _stopped = false;
			if(tbod.name == 'wall')
			{
				_stopped = true;
			}
			else if(tbod.faction != null && tbod.faction != this.faction)
			{
				bullet.die();
				
				var _atkbod = bullet;
				if(this.type == 'melee') _atkbod = this;

				if(tbod.isshield) {
					var _watchang = Math.atan2(tbod.action.watch[1], tbod.action.watch[0]);
					
					// the parry angle is different from _watchang
					// basically, i don't want the player to parry to the ground
					// watch up is - PI / 2, so let's make it zero
					
					_watchang = (_watchang + PI * 4.5) % (PI2); // now angle is 0 to PI * 2
						
					if(_watchang > PI) _watchang = _watchang - PI2; // now it's - PI to PI
					
					// now let's reduce the difference
					
					_watchang *= 0.8;
					var _bonusAngle = Math.abs(_watchang * 0.6); // bigger horizontal shield
					
					// and back
					
					_watchang -= PI / 2;
					
					var _pang = 1.4 + _bonusAngle;
					
					var _atkang = _13Ang(_atkbod.pos, tbod.pos);

					// let's not mess up with angles. hit is parried if is in watch +- _pang / 2
					// so _watchang - _pang / 2 is my zero and _atkang must be > 0 and < _pang
					
					_watchang -= _pang / 2;

					_atkang = (_atkang - _watchang + PI * 4) % (PI2);

					
					if(_atkang > 0 && _atkang < _pang) { // BLOCKED
						_stopped = true;
						
						tbod.shnrg.add(-1);
						tbod.pushback(_atkbod, 0.3 * this.revmult);
						
						if(this.type == 'melee') this.pushback(tbod, 0.7 * tbod.revmult);
					}
				}
				
				if(!_stopped) {
					tbod.pushback(_atkbod, this.revmult);
					tbod.damage(bullet);
				
					if(this.type == 'melee')
					{
						if(!bullet.owner._sndatk.hit) {
							bullet.owner._sndatk.hit = true;
							_13MediaSounds.hit.play();
						}
					}
					else _13MediaSounds.hit.play();
				}
			}
			
			if(_stopped)
			{
				_sparks.on = 5;
				bullet.die();
				
				this.stopatk = true;
				
				_sparks.pos = _13ObjClone(bullet.pos);
				
				if(this.type == 'melee') {
					if(!bullet.owner._sndatk.block) {
						bullet.owner._sndatk.block = true;
						_13MediaSounds.block.play();
					}
				}
				else _13MediaSounds.miss.play();
			}
		},
		beforeCollide: function (tbod) {
			// removed collision with the player
			// so there's a way to escape insta-killing sandwiches
			return tbod.type != this.type;
		},
		onDamage: function() {},
		onDie: function() {}
	});
	
	_world.actors.push(_retObj);
	
	return _retObj;
}