function _13ActorMelee(_world, bName, bW, bH) {
	var _retObj = new _13Actor(_world, bName, bW, bH, 'melee');

	_retObj.w *= 0.17;
	_retObj.h *= 0.45;
	
	var _bulLife = 150;
	
	for(var i = 0; i < _retObj.bullets.length; i++)
		_retObj.bullets[i].afterUpdate = function () {
			this.scale = this.lifespan / _bulLife;
		}
	
	var _didJump = false;
	var _plSpeed = 0;
	var _plJump = 600;
	
	var _atkType = 0
	var _atkTime = 0;
	var _preAtkTime = 0;

	var _revMult = 1;
	
	if(bName == 'player')
	{
		_13Obj.extend(_retObj, {
			atkspeed: 1.2,
			damval: 10,
			health: new _13LimVal(250),
			revpow: new _13LimVal(100, 0),
			onRev: function() {
				for(var i = 0; i < this.bullets.length; i++)
				{
					this.bullets[i].rev();
				}
			},
		});
	}

	return _13Obj.extend(_retObj, {
		onDie: function(bullet) {
			for(var i = 0; i < this.bullets.length; i++) this.bullets[i].die();

			var _vx = this.vel.x * 0.5;
			var _mob = this;
			
			_13Skeleton.AllBones(this.texture.skel, function (tb) {		
				if(tb.texture != null && tb.alpha != 0)
				{
					var _cBone = _13Obj.extend(_world.addBody(tb.texture), {
						name: 'bone',
						dead: false,
						w: tb.size * 0.5,
						h: tb.size * 0.5,
						bounce: 0.5,
						collide: 'wall',
						lifespan: 20000,
						afterUpdate: function() {
							if(this.block.d) this.frict = 7;
							else this.frict = 1;
							
							if(this.lifespan <= 2500) this.alpha = this.lifespan / 2500;
						},
						vel: { 
							x: _13Random.between(_vx - 50, _vx + 50), 
							y: _13Random.between(-100, 0)
						},
						pos: {
							x: _mob.pos.x + _13Random.between(-0.5, 0.5) * _mob.w,
							y: _mob.pos.y + _13Random.between(-0.5, 0.5) * _mob.h
						},
						rot: _13Random.between(0, 2.8),
						rotvel: _13Random.between(-10, 10)
					});
				}
			});			
		},
		action: {
			move: 0,
			jump: false,
			watch: { x: 0, y: 0 },
			attack: false,
			block: false
		},
		lastgy: 0,
		isattack: false,
		isshield: false,
		canshield: (bName != 'enemy_skel_0'),
		beforeUpdate: function(timePassed) {
			// REV CHECK
			
			if(this.revpow != null)
			{
				var _revbase = timePassed / 250;
				if(this.revved)
				{
					this.revpow.add(-_revbase * (0.5 + this.health.perc));
					if(this.revpow.perc == 0) {
						this.rev();
					}
				}
				else
				{
					this.revpow.add(_revbase * (1.5 - this.health.perc));
					if(this.revpow.perc == 1) {
						this.rev();
					}
				}	
			}			
			
			this.revmult = (this.revved ? 1.5 : 1);
			
			_plSpeed = this.speed * this.revmult;
		
			var _act = this.action;
			
			if(this.block.d) this.lastgy = this.pos.y;

			if(_act.jump) {
				if(!_didJump)
				{
					if(this.block.d) { // JUMP
						_didJump = true;
						this.vel.y = -_plJump;
					}
				}
			}
			else _didJump = false;
			
			var _cPVel = ((!this.isshield && ((this.vel.x > 0 && this.facing) || (this.vel.x < 0 && !this.facing))) ? (1) : (0.5)) * _plSpeed;
			
			var _brakeTo = _cPVel; // TOO FAST
			if((_act.move == 0 || _act.move * this.vel.x < 0) && this.block.d) _brakeTo = 0; // STOPPING

			// MOVING
			this.vel.x += _act.move * timePassed;
			
			var _absx = Math.abs(this.vel.x);
			
			if(_absx > _brakeTo)
			{
				var _brakeM = Math.max(_brakeTo, _absx - timePassed);
				this.vel.x = (this.vel.x < 0 ? -_brakeM : _brakeM);
			}
		},
		afterUpdate: function(timePassed) {
			var _act = this.action;

			this.facing = _act.watch.x > 0;

			_act.watch.x = Math.abs(_act.watch.x); // need abs on this because of facing handling
			
			var _hbrot = Math.atan2(_act.watch.y, _act.watch.x) * 0.2; // watch dir

			if(!this.block.d)
			{
				this.texture.play('jump', this.revmult);
			}
			else
			{
				if(this.vel.x == 0) this.texture.play('stand', this.revmult);
				else {
					var _animSpeed = (((this.facing && this.vel.x > 0) || (!this.facing && this.vel.x < 0)) ? (1) : (-1));
					this.texture.play('run', _animSpeed * this.revmult, Math.max(0.2, Math.abs(this.vel.x) / _plSpeed));
				}
			}
			
			// WATCH
			
			for(var j = 0; j < this.baserev.texture.length; j++)
			{
				var _csk = this.baserev.texture[j];
				
				if(_csk != null)
				{
					var _headbone = _csk.skel.bones.head[0];
				
					_headbone.rot = Math.PI + _hbrot;
					
					if(_act.watch.y > 0)
					{
						_headbone.x = -_hbrot * 15;
					}
					else _headbone.x = 0;
					
					var _bbone =  _csk.skel.bones.body;
					for(var i = 0; i < _bbone.length; i++)
					{
						_bbone[i].rot = _headbone.rot;
					}
				}
			}
			
			// ATTACK
			
			this.didatk -= timePassed;
			
			var _atkSpeed = this.atkspeed * this.revmult;
			
			var _animatk = this.texture.anim.attack;
			_atkTime = _animatk.dur / _atkSpeed;
			_preAtkTime = _animatk.dur * _animatk.chain.split[0] / _atkSpeed;
			
			if(this.didatk <= -_atkTime * 0.2) { // attack delay
				this.isattack = false;
				if(_act.attack) {
					this.didatk = _atkTime;
					this.stopatk = false;
					
					if(_hbrot > 0.25) _atkType = -1; // low swing
					else if(_hbrot < -0.2) _atkType = 1; // high swing
					else { // middle thrust
						_atkType = _hbrot;
					}
				
					this.texture.play('attack', _atkSpeed, _atkType);
					this.isattack = true;
				}
			}
			
			if(this.didatk > 0 && this.stopatk)
			{
				this.texture.stop('attack');
				this.isattack = false;
			}
			
			// BLOCK
			
			if(_act.shield && this.didatk <= 0) {
				this.texture.play('block', this.revmult, _hbrot);
				this.isshield = true;
			}
			else {
				this.texture.stop('block');
				this.isshield = false;
			}
		},
		afterRefresh: function(timePassed) {
			if(this.didatk > 0 && !this.stopatk && 
				this.didatk < _atkTime - _preAtkTime) { // let the attack telegraph end
				var _bulnum = 3;
				
				var _cSkel = this.texture.lastFrame;
				var _rotSum = _cSkel.rot;
				var _pds = { x:0, y: 0}; // starting sword point
				var _pde = { x:0, y: 0}; // ending sword point
				
				var _dn = ((this.facing) ? (-1) : (1));
				for(var i = 0; i < 4; i++)
				{
					_pds = { x: _pde.x, y: _pde.y };					
					
					_cSkel = _cSkel.link[0];
					_rotSum += _cSkel.rot;
					
					_pde.x += _dn * (_cSkel.x + Math.sin(_rotSum) * _cSkel.size);
					_pde.y += _cSkel.y + Math.cos(_rotSum) * _cSkel.size;
				}
						
				for(var i = 0; i < this.bullets.length; i++)
				{ // BULLETS SPRAY
					var _cbul = this.bullets[i];
					
					if(_cbul.dead)
					{
						_cbul.undie(_bulLife);
						
						for(var _i in _pds)
						{
							var _pdd = (_pde[_i] - _pds[_i]) * (0.1 + 0.3 * _bulnum); // _bulnum is 3 to 1
							_cbul.pos[_i] = this.pos[_i] + _pds[_i] + _pdd;
						}
						
						_cbul.alpha = (_bulnum < 3 ? 0 : 1);
						_cbul.dammod = 0.2 * _bulnum;

						if(--_bulnum <= 0) break;
					}
				}
			}
			
			for(var i = 0; i < this.bullets.length; i++)
			{
				var _cbul = this.bullets[i];
				_cbul.vel.x = this.vel.x
				_cbul.vel.y = this.vel.y
			}
		}
	});
}
