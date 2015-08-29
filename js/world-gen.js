function _13WorldGen(_world) {
	
	var _player;
	
	var _walls = [
		{ x: 0, y: 370, w: 5000, h: 300 }
	]
	
	var _spawnp = {
		l: { x: -2075, y: 80 },
		r: { x: 2075, y: 80 }
	}
	
	_13Rep(5, function(i) {
		_walls.push({ x : 0, y: 125 + 50 * i, w: 150 + 50 * Math.round(Math.pow(i, 1.5)), h: 300 });
	});

	_13Each(_walls, function(_bw) {
		if(_bw.x != 0) {
			var _cwall = _13ObjClone(_bw);
			_cwall.x = -_bw.x;
			_walls.push(_cwall);
		}
	})
	
	// FIXED STUFF MUST BE ADDED FIRST!
	_13Each(_walls, function(_bw) {
		_13ObjExtend(_world.addBody('wall', _bw.w, _bw.h), {
			pos: { x: _bw.x, y: _bw.y },
			fixed: true
		});
	})
	
	_13ObjExtend(_world.addBody('mirror_inner'), {
		pos: { x: 0, y: -150 },
		fixed: true,
		collide: false,
		overlap: true,
		onOverlap: function(tbod) {
			if(tbod.name == 'player') this._ovlpl = true;
		},
		beforeUpdate: function() {
			this._ovlpl = false;
		},
		onRender: function() {
			var _mrrs = this.texture.width;
			
			if(this._basetxt == null) {
				
				this._basetxt = this.texture
				
				this.texture = _13Canv(_mrrs, _mrrs);
			}
			
			var _mctx = this.texture.getContext('2d');
			_mctx.clearRect(0, 0, _mrrs, _mrrs);
			_mctx.save();
			
			_mctx.drawImage(this._basetxt, 0, 0);
			
			_mctx.globalCompositeOperation = 'source-atop';
			
			if(this._ovlpl && _player.revpow != null) {
				_mctx.save();
				
				_mctx.translate(_mrrs / 2, _mrrs / 2);
				_mctx.scale(1.4, 1.4);
				var _ri = (_player.revved ? 0 : 1);
				var _cl = _player.baserev.light[_ri];
				
				_mctx.drawImage(_cl, 
					_player.pos.x - this.pos.x - _cl.width / 2, 
					_player.pos.y - this.pos.y - _cl.height / 2);
					
				var _cskt = _player.baserev.texture[_ri];
				_cskt.refresh(0);
				
				_mctx.translate(_player.pos.x - this.pos.x, _player.pos.y - this.pos.y);
				if(!_player.facing) _mctx.scale(-1, 1);
				
				_cskt.render(_mctx,  - _cskt.width / 2,  - _cskt.height / 2);
				
				_mctx.restore();
			}
			
			_mctx.fillStyle = 'rgba(127,127,127,0.25)'
			_mctx.fillRect(0, 0, _mrrs, _mrrs);
			
			_mctx.restore();
		}
	});
	
	_13ObjExtend(_world.addBody('mirror'), {
		pos: { x: 0, y: -150 },
		fixed: true,
		collide: false
	});
	
	_13Rep(2, function(i) {
		_13ObjExtend(_world.addBody('bone_pile_' + i), {
			pos: _13ObjClone(i == 0 ? _spawnp.r : _spawnp.l),
			fixed: true,
			collide: 'player',
			facing: i != 0,
			w: 300
		});
	})
	
	var _spawner = _world.addBody('spawner');
	_spawner.fixed = true;
	_spawner.collide = false;
	
	var _waveTime = 0;
	var _waveStep = 0; 
	var _nextStep = 0;
	
	var _endWave = 59;
	var _finalRound = false;
	var _finalBoss = null;
	
	_spawner.beforeUpdate = function(timePassed) { // must be before update because if i add mobs after update they will be rendered without a skeleton refresh
		if(_world.status == 1)
		{
			_waveTime += timePassed;
			
			var _adv = (_waveStep - 1) / _endWave;

			if(_finalRound)
			{
				if(_finalBoss == null)
				{
					var _alldead = true;
					_13Each(_world.actors, function(_cact) {
						if(_cact.name != 'player' && !_cact.dead)
						{
							_alldead = false;
							return true;
						}
					});
					
					if(_alldead)
					{
						_finalBoss = _13ObjExtend(_world.addActorMelee('rev_player'), {
							pos: { x: 0, y: -100 },
							health: new _13LimVal(450),
							revmult: 1.3
						});
						
						if(_player.revved) _player.rev();
						_player.health.add(_player.health.max);
						_player.revpow = null;
						_player.revmult = 1.3;
						_player.texture.trail = '#ffff77';
					}
				}
				else if(_finalBoss.dead) _world.status = 3;
			}
			else {
				if(_waveTime > _nextStep) {
					_waveStep++;	
					
					if(_waveStep > _endWave)
					{
						_finalRound = true;
					}
					else
					{
						var _mobLvl = _waveStep % 10;
						
						// 0: miniboss, 1: post boss pause, 2+: popcorn spawn

						if(_mobLvl != 1) {
							_mobLvl = Math.max(0, 1 - _mobLvl);
						
							var _bName = (Math.random() > 0.5 ? 'enemy_skel_' : 'enemy_wotw_');
							_13ObjExtend(_world.addEnemy(_bName + _mobLvl), {
								pos: _13ObjClone(Math.random() > 0.5 ? _spawnp.r : _spawnp.l),
								awake: true,
								revmult: (_mobLvl == 0 ? 0.8 : 1.1)
							});
						}
						
						_waveTime = 0;
						_nextStep = 5000 - 3000 * _adv;
					}				
				}
			}
			
			_world.adv = _adv;
		}
	}
	
	_player = _13ObjExtend(_world.addActorMelee('player'), {
		pos: { x: 0,y: -100 }
	});
	
	return _player;
}