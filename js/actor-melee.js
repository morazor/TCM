function _13ActorMelee(_world, bName, bW, bH) {
	var _retObj = _13Actor(_world, bName, bW, bH, 'melee');

	_retObj.w *= 0.17;
	_retObj.h *= 0.45;
	
	var _bulFrames = 3;
	
	_13Each(_retObj.bullets, function(_cbul) {
		_cbul.afterUpdate = function (timePassed) {
			var _bulLife = timePassed * _bulFrames;
			this.lifespan = _13Min(this.lifespan, _bulLife);
			this.alpha = 0; // glow effect on sword requires that bullets get hidden after the first frame
		}
	});
	
	var _didJump = false;
	var _plSpeed;
	var _plJump = 600;
	
	var _atkType;
	var _atkTime;
	var _preAtkTime;
	var _atkSpeed;

	if(bName == 'player')
	{
		_13ObjExtend(_retObj, {
			atkspeed: 1.2,
			damval: 5,
			health: _13LimVal(250),
			revpow: _13LimVal(100, 0),
			onRev: function() {
				_13Each(this.bullets, function(_cbul) {
					_cbul.rev();
				});
			}
		});
	}

	return _13ObjExtend(_retObj, {
		onDie: function() {
			_13Each(this.bullets, function(_cbul) {
				_cbul.die();
			});

			var _vx = this.vel[0] * 0.5;
			var _mob = this;
			
			_13SkelAllBones(this.texture.skel, function (tb) {		
				if(tb.texture != null && tb.alpha != 0)
				{
					_13ObjExtend(_world.addBody(tb.texture), {
						name: 'bone',
						fixed: false,
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
						vel: [
							_13RandBetween(_vx - 50, _vx + 50), 
							_13RandBetween(-100, 0)
						],
						pos: [
							_mob.pos[0] + _13RandBetween(-0.5, 0.5) * _mob.w,
							_mob.pos[1] + _13RandBetween(-0.5, 0.5) * _mob.h
						],
						rot: _13RandBetween(0, 2.8),
						rotvel: _13RandBetween(-10, 10)
					});
				}
			});			
		},
		action: {
			move: 0,
			jump: false,
			watch: [0, 0],
			attack: false,
			block: false
		},
		lastgy: 0,
		isattack: false,
		isshield: false,
		canshield: _retObj.level != 0,
		shnrg: _13LimVal(3), // shield energy: AI monsters decrase parry chance when they parry something
		_sndatk: {}, // ugly property to avoid spamming attack sounds
		beforeUpdate: function(timePassed) {
			// REV CHECK
			
			if(this.revpow != null)
			{
				if(this.revved)
				{
					if(this.revpow.perc == 0) {
						this.rev();
						_13MediaSounds.rev.play();
					}
				}
				else
				{
					this.revpow.add(timePassed / 300);
					if(this.revpow.perc == 1) {
						this.rev();
						_13MediaSounds.rev.play();
					}
				}
				
				this.revmult = (this.revved ? 1.3 : 1);
			}			

			_plSpeed = this.speed * this.revmult;
		
			var _act = this.action;
			
			if(this.block.d) this.lastgy = this.pos[1];

			if(_act.jump) {
				if(!_didJump)
				{
					if(this.block.d) { // JUMP
						_didJump = true;
						this.vel[1] = -_plJump;
					}
				}
			}
			else if(this.block.d) _didJump = false;
			
			var _vx = this.vel[0];
			
			var _cPVel = ((!this.isshield && ((_vx > 0 && this.facing) || (_vx < 0 && !this.facing))) ? (1) : (0.5)) * _plSpeed;
				
			var _brakeTo = _cPVel; // TOO FAST
			if(this.block.d && (_act.move == 0 || _act.move * _vx < 0)) _brakeTo = 0; // STOPPING

			// MOVING
			_vx += _act.move * timePassed;

			var _absx = Math.abs(_vx);
			
			if(_absx > _brakeTo)
			{
				var _brakeM = _13Max(_brakeTo, _absx - timePassed * 2);
				_vx = (_vx < 0 ? -_brakeM : _brakeM);
			}
			
			this.vel[0] = _vx;
		},
		afterUpdate: function(timePassed) {
			var _act = this.action;

			// always change facing instatly regardless of attacks because AI sometimes gets stuck
			
			/*if(!this.isattack) */ this.facing = _act.watch[0] > 0;

			var _wxabs = Math.abs(_act.watch[0]); // need abs on this because of facing handling
			
			var _hbrot = Math.atan2(_act.watch[1], _wxabs) * 0.2; // watch direction

			if(!this.block.d)
			{
				this.texture.play('jump', this.revmult);
			}
			else
			{
				var _vx = this.vel[0]
				
				if(_vx == 0) this.texture.play('stand', this.revmult);
				else {
					var _animSpeed = (((this.facing && _vx > 0) || (!this.facing && _vx < 0)) ? (1) : (-1));
					this.texture.play('run', _animSpeed * this.revmult, _13Max(0.2, Math.abs(_vx) / _plSpeed));
				}
			}
			
			// WATCH
			
			_13Each(this.baserev.texture, function (_csk) {
				
				if(_csk != null)
				{
					var _headbone = _csk.skel.bones.head[0];
				
					_headbone.rot = PI + _hbrot;
					
					if(_act.watch[1] > 0)
					{
						_headbone.x = -_hbrot * 15;
					}
					else _headbone.x = 0;
					
					var _bbone =  _csk.skel.bones.body;
					_13Each(_bbone, function(_cb) {
						_cb.rot = _headbone.rot;
					});
				}
			});
			
			// ATTACK
			
			this.didatk -= timePassed;
			
			_atkSpeed = this.atkspeed * this.revmult;
			
			var _animatk = this.texture.anim.attack;
			_atkTime = _animatk.dur / _atkSpeed;
			_preAtkTime = _animatk.dur * _animatk.chain.split[0] / _atkSpeed;
			
			if(this.didatk <= -_atkTime * 0.2) { // attack delay
				this._sndatk = {};
				this.isattack = false;
				if(_act.attack) {
					this.didatk = _atkTime;
					this.stopatk = false;
					
					/*if(_hbrot > 0.25) _atkType = -1; // low swing, removed
					else */
					if(_hbrot < (_didJump ? 0 : -0.20)) _atkType = 1; // high swing
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
			var _this = this;
			
			if(this.didatk > timePassed && !this.stopatk && 
				this.didatk < _atkTime - _preAtkTime) { // let the attack telegraph end
				
				if(!this._sndatk.swing) {
					_13MediaSounds.swing.play();
					this._sndatk.swing= true;
				}
				
				var _bulnum = 3;
				
				var _cSkel = this.texture.lastFrame;
				var _rotSum = _cSkel.rot;
				var _pds = [0, 0]; // starting sword point
				var _pde = [0, 0]; // ending sword point
				
				var _dn = ((this.facing) ? (-1) : (1));
				_13Rep(4, function() {
					_pds = _13ObjClone(_pde);					
					
					_cSkel = _cSkel.link[0];
					_rotSum += _cSkel.rot;
					
					_pde[0] += _dn * (_cSkel.x + _13Sin(_rotSum) * _cSkel.size);
					_pde[1] += _cSkel.y + _13Cos(_rotSum) * _cSkel.size;
				})
						
				_13Each(this.bullets, function(_cbul) {
					if(_cbul.dead)
					{
						_cbul.undie(timePassed * _bulFrames);
						_cbul.alpha = 1;
						
						_13Rep(2, function(i) {
							var _pdd = (_pde[i] - _pds[i]) * (0.1 + 0.3 * _bulnum); // _bulnum is 3 to 1
							_cbul.pos[i] = _this.pos[i] + _pds[i] + _pdd;
							
							/*** 
							now i have this problem:
							an attack does damage for each animation frame
							slower attacks last more frames, so overall they do more damage
							it shouln't be this way, usually you expect the same damage per attack
							so i have to normalize damage to get the same damage per attack
							***/
							
							_cbul.dammod = _atkSpeed * timePassed / 30;
						});

						if(--_bulnum <= 0) return true;
					}
				});
			}
			
			_13Each(this.bullets, function(_cbul) {
				_cbul.vel = _13ObjClone(_this.vel);
			});
		}
	});
}
