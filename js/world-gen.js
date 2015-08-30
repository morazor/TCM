function _13WorldGen(_world) {
	
	var _player;
	
	var _walls = [
	]
	
	var _spawnp = [
	]
	
	_13Each([-1, 1], function(_dir) {
		var _cy = 370;
		var _cx = 250 * _dir;
		
		_13Rep(5, function(i) {
			var _cw = (i % 3 == 0 ? 600 : 200) + 50 * Math.round(Math.random() * 5);
			
			_walls.push({x: _cx +_cw / 2 * _dir, y: _cy, w: _cw, h: 500, t: Math.random() > 0.4, g: Math.random() > 0.4 });
			
			_cx += _dir * (_cw - 50);
			_cy += _13RandPick([-1, 1, 2]) * 50;
		});
		
		_walls.push({x: _cx + 500 *_dir, y: _cy, w: 1000, h: 500});
		_spawnp.push({ x: _cx + 500 *_dir, y: _cy -390 });
	});

	_13Rep(3, function(i) {
		_walls.push({ x : 0, y: 225 + 50 * i, w: 150 + 100 * i * i, h: 500 });
	});

	// FIXED STUFF MUST BE ADDED FIRST!
	var _im = { t: Math.floor(Math.random() * 7), g: Math.floor(Math.random() * 7) };
	
	_13Each(_walls, function(_bw) {
		_13ObjExtend(_world.addBody('wall', _bw.w, _bw.h), {
			pos: { x: _bw.x, y: _bw.y },
			fixed: true
		});
		
		_13Each(['t','g'], function (i) {
			if(_bw[i]) {
				
				var _cName = 'tree';
				var _cOffY = 200;
				if(i == 'g') {
					_cName = 'grave';
					_cOffY = 50;
				}
				
				_13ObjExtend(_world.addBody(_cName +'_' + _im[i]), {
					pos: { x: _bw.x + _13RandBetween(-1, 1) * _bw.w / 4, y: _bw.y - _bw.h / 2 - _cOffY },
					fixed: true,
					collide: false
				});
				
				_im[i] = (_im[i] + 1) % 7;
			}
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
	
	_13Each(_spawnp, function(_spp, i) {
		_13ObjExtend(_world.addBody('bone_pile_' + i), {
			pos: _spp,
			fixed: true,
			collide: 'player',
			w: 300,
			h:400
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
							pos: { x: 0, y: -200 },
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
								pos: _13ObjClone(_13RandPick(_spawnp)),
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
		pos: { x: 0,y: -200 }
	});
	
	return _player;
}