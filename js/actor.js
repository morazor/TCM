function _13Actor(_world, bName, bW, bH, bType) {
	var _retObj = _world.addBody(bName, bW, bH);
	
	var _isMelee = bType == 'melee';
	
	var _spnam = (_isMelee ? 'sparks' : 'sparks_' + bName);
	var _pgrav = (_isMelee ? 1 : 0);
	
	var _sparks = _13Particles(_world, _spnam, 10); // particles for blocked attacks
	_13ObjExtend(_sparks, {
		grav: _pgrav,
		collide: 'wall',
		fx: { scale: 1, alpha: 1 }
	});
	
	_sparks.rnd.vel = [350, 350]

	var _blood = _13ObjExtend(_13Particles(_world, 'blood_' + bName, 5), { // particles when it gets hit
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
	
	if(!_isMelee) {
		_blood.fx.alpha = 1;
	}
	
	_retObj.bullets = [];
	_13Rep(_isMelee ? 15 : 2, function() {
		var _cbul = _world.addBody('bullet_' + bName);
		_13ObjExtend(_cbul, {
			fixed: false,
			grav: 0,
			w: 25,
			h: 25,
			dead: true,
			overlap: true,
			owner: _retObj,
			scale: (_isMelee ? 0.5 : 1), // to avoid creating different size textures based on type... space limit :<
			dammod: 1, // useful for damage normalization for different speed swing animations
			onOverlap: function (tbod) {
				_retObj.onHit(tbod, this);
			}
		});
		
		_retObj.bullets.push(_cbul);
	});
	
	var _lev = bName.match(/\d$/);
	if(_lev != null) _lev = parseInt(_lev[0], 10);
	
	var _maxHealth = (_isMelee ? 100 + 100 * _lev : 10 + 80 * _lev)
	
	_13ObjExtend(_retObj, {
		fixed: false,
		type: bType,
		level: _lev,
		lastai: 0, // last AI check
		faction: (bName == 'player' ? 0 : 1),
		awake: false,
		stopatk: false,
		didatk: 0,
		health: _13LimVal(_maxHealth), // should go in melee-actor
		damval: (_isMelee ? 2 : 25),
		atkspeed: 1,
		speed: 400,
		revmult: 1, // originally used to store the bonus when reversed, i planned to change the bonus according to hps of the player
					// now it's just a general multiplier used for moving speed, attack speed, damage also for mobs
		collide: true,
		damage: function(bullet) {		
			// SUSTAIN DAMAGE
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
					this.die(bullet);
				}
				else this.onDamage(bullet);
			}
		},
		pushback: function (tbod, _pushc) {
			// PUSHBACK
			if(_isMelee)
			{
				this.vel[0] = (this.pos[0] > tbod.pos[0]) ? (300) : (-300) * _pushc;
				this.vel[1] = -120 * _pushc;
			}
			else{
				var _pusha = _13Ang(this.pos, tbod.pos);
				this.vel[0] = _13Cos(_pusha) * 300 * _pushc;
				this.vel[1] = _13Sin(_pusha) * 300 * _pushc;
			}
		},
		onHit: function(tbod, bullet)
		{
			// HITTING SOMETHING
			var _stopped = false;
			if(tbod.name == 'wall')
			{
				_stopped = true;
			}
			else if(tbod.faction != null && tbod.faction != this.faction)
			{
				bullet.die();
				
				var _atkbod = bullet;
				if(_isMelee) _atkbod = this;

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
						
						if(_isMelee) this.pushback(tbod, 0.7 * tbod.revmult);
					}
				}
				
				if(!_stopped) {
					tbod.pushback(_atkbod, this.revmult);
					tbod.damage(bullet);
				
					if(_isMelee)
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
				
				if(_isMelee) {
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