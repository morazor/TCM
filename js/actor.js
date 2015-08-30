function _13Actor(_world, bName, bW, bH, bType) {
	var _retObj = _world.addBody(bName, bW, bH);
	
	var _spnam = (bType == 'melee' ? 'sparks' : 'sparks_' + bName);
	
	var _sparks = _world.addParticles(_spnam, 10);
	_13ObjExtend(_sparks, {
		rotvel: 10,
		grav: 1,
		lifespan: 350,
		freq: 0,
		collide: 'wall',
		fx: { scale: true, alpha: false }
	});
	
	_sparks.min.vel = { x: -350, y: -350 };
	_sparks.max.vel = { x: 350, y: 350 };

	var _blood = _13ObjExtend(_world.addParticles('blood_' + bName, 5), {
		lifespan: 350,
		freq: 0,
		grav: 1,
		scale: 0.5,
		fx: { scale: true }
	});
	
	_blood.min.scale = 0.5;
	_blood.max.scale = 1;

	if(bName == 'player' || bName == 'rev_player') {
		_blood.autorot = true;
	}
	else {
		_blood.min.rot = 0;
		_blood.max.rot = 2.8;
		_blood.min.rotvel = -10;
		_blood.max.rotvel = 10;
	}
	
	_blood.min.vel = { x: -200, y: -200 };
	_blood.max.vel = { x: 200, y: 200 };
	
	if(bType == 'ranged') {
		_blood.fx.alpha = false;
	}
	
	_retObj.bullets = [];
	_13Rep(20, function() {
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
		health: new _13LimVal(100 + 100 * _lev), // should go in melee-actor
		damval: 2,
		atkspeed: 1,
		speed: 400,
		revmult: 1,
		damage: function(bullet) {		
			// DAMAGE
			if(!this.dead)
			{
				var _cdam = bullet.owner.damval * bullet.owner.revmult * bullet.dammod;
				
				if(this.revved) {
					var _maxh = Math.min(this.revpow.c, _cdam); // maximum convertible damage is current rewpow
					this.revpow.add(-_maxh); 
					this.health.add(_maxh);
					this.health.add(_maxh - _cdam); // apply exceeding damage
				}
				else this.health.add(-_cdam);
				
				_blood.pos.x = (bullet.pos.x + this.pos.x * 2) / 3;
				_blood.pos.y = (bullet.pos.y + this.pos.y * 2) / 3;
				
				_blood.vel.x = this.vel.x * 1.5;
				_blood.vel.y = this.vel.y * 1.5;
				
				_blood.on = 3;
				
				if(this.health.c <= 0) {
					this.die(bullet); // DIE!!!
				}
				else this.onDamage(bullet);
			}
		},
		pushback: function (tbod, _pushc) {
			// PUSHBACK
			this.vel.x = (this.pos.x > tbod.pos.x) ? (300) : (-300) * _pushc;
			this.vel.y = -150 * _pushc;
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
				
				if(this.type == 'melee')
				{
					if(tbod.isshield && tbod.facing != this.facing) { // MELEE ATTACK
						_stopped = true;
						this.pushback(tbod, 0.5 * tbod.revmult);
						tbod.pushback(this, 0.5 * this.revmult);
					}
					else {
						tbod.pushback(this, this.revmult);
						tbod.damage(bullet);
						
						if(!bullet.owner._sndatk.hit) {
							bullet.owner._sndatk.hit = true;
							_13MediaSounds.hit.play();
						}
					}
				}
				else{
					if(tbod.isshield && tbod.facing == (bullet.pos.x > tbod.pos.x)) { // RANGED ATTACK
						_stopped = true;
						tbod.pushback(bullet, 0.5 * this.revmult);
					}
					else {
						tbod.pushback(bullet, this.revmult);
						tbod.damage(bullet);
						_13MediaSounds.hit.play();
					}
				}
			}
			
			if(_stopped)
			{
				_sparks.on = 5;
				bullet.die();
				
				this.stopatk = true;
				
				_sparks.pos = { x: bullet.pos.x, y: bullet.pos.y };
				
				if(this.type == 'melee') {
					if(!bullet.owner._sndatk.block) {
						bullet.owner._sndatk.block = true;
						_13MediaSounds.block.play();
					}
				}
				else {
					_13MediaSounds.miss.play();
				}
			}
		},
		beforeCollide: function (tbod) {
			return tbod.faction != this.faction;
		},
		onDamage: function(bullet) {},
		onDie: function(bullet) {}
	});
	
	return _retObj;
}