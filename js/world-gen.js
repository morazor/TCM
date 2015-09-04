function _13WorldGen(_world) {
	
	var _player;
	
	var _walls = [
	]
	
	var _spawnp = [
	]
	
	_13Each([-1, 1], function(_dir) {
		var _cy = 370;
		var _cx = 250 * _dir;
		
		_13Rep(3, function(i) {
			var _cw = (i % 2 == 0 ? 700 : 300) + 50 * Math.round(Math.random() * 4);
			
			_walls.push({x: _cx +_cw / 2 * _dir, y: _cy, w: _cw, h: 500, furn: true });
			
			_cx += _dir * (_cw - 50);
			_cy += _13RandPick([-1, 1, 1.5]) * 50;
		});
		
		_walls.push({x: _cx + 500 *_dir, y: _cy, w: 1000, h: 500});
		_spawnp.push([ _cx + 500 *_dir, _cy -390 ]);
	});

	_13Rep(3, function(i) {
		_walls.push({ x : 0, y: 225 + 50 * i, w: 150 + 100 * i * i, h: 500 });
	});

	// FIXED STUFF MUST BE ADDED FIRST!
	var _im = { t: 0, g: 0 };
	
	_13Each(_walls, function(_bw) {
		_13ObjExtend(_world.addBody('wall', _bw.w, _bw.h), {
			pos: [_bw.x, _bw.y],
			fixed: true
		});
		
		if(_bw.furn)
		{
			var _cwt = _bw.w / 700;
			var _cwg = _cwt * 3;
			
			var _toadd = { t: Math.floor(_cwt), g: Math.floor(_cwg) };
			_toadd.t += (Math.random() > _cwt - _toadd.t ? 1 : 0)
			_toadd.g += (Math.random() > _cwg - _toadd.g ? 1 : 0)
			
			for(var i in _toadd)
			{
				_13Rep(_toadd[i], function(j) {
					var _rnd = ((j + _13RandBetween(0.15, 0.85)) / _toadd[i]) * 2 - 1;

					var _cName = 'tree';
					var _cOffY = 200;
					if(i == 'g') {
						_cName = 'grave';
						_cOffY = 50;
					}
					
					_13ObjExtend(_world.addBody(_cName + '_' + _im[i]), {
						pos: [
							_bw.x + _rnd * _bw.w / 3.1, 
							_bw.y - _bw.h / 2 - _cOffY
						],
						fixed: true,
						collide: false
					});
					
					_im[i] = (_im[i] + 1) % 7;
				});
			}
		}
	})
	
	_13ObjExtend(_world.addBody('mirror_inner'), {
		pos: [0, -150],
		fixed: true,
		collide: false
	});
	
	_13ObjExtend(_world.addBody('mirror'), {
		pos: [0, -150],
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
	var _nextStep = 4000;
	
	var _endWave = 69;
	var _finalRound = false;
	var _finalBoss = null;
	
	_spawner.beforeUpdate = function(timePassed) { // must be before update because if i add mobs after update they will be rendered without a skeleton refresh
		if(_world.status == 1)
		{
			_waveTime += timePassed;
			
			var _adv = (_waveStep - 1) / _endWave;
			
			var _liveEnemies = 0;
			
			_13Each(_world.actors, function(_cact) {
				if(_cact.name != 'player' && !_cact.dead)
				{
					_liveEnemies++;
				}
			});
			
			_world._wadv = _waveStep / _endWave;
			_world._wlive = _liveEnemies / _endWave;
			
			if(_finalRound)
			{
				if(_finalBoss == null)
				{
					if(_liveEnemies == 0)
					{
						_finalBoss = _13ObjExtend(_world.addActorMelee('rev_player'), {
							pos: [0, -200],
							health: _13LimVal(600),
							revmult: 1.3
						});
						
						if(_player.revved) _player.rev();
						
						_13MediaSounds.rev.play();
						
						_player.health.add(_player.health.max);
						_player.revpow = null;
						_player.revmult = 1.3;
						_player.texture.trail = '#aabbff';
					}
				}
				else {
					_world._wadv = 1;
					_world._wlive = _finalBoss.health.perc;
					if(_finalBoss.dead) _world.setst(3);
				}
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
						
						// 0: miniboss, 1+: popcorn spawn

						_mobLvl = Math.max(0, 1 - _mobLvl);
					
						var _bName = _13RandPick(['enemy_skel_', 'enemy_wotw_']);
						_13ObjExtend(_world.addEnemy(_bName + _mobLvl), {
							pos: _13ObjClone(_13RandPick(_spawnp)),
							awake: true,
							revmult: (_mobLvl == 0 ? 0.8 : 1.1)
						});
						
						_waveTime = 0;
						_nextStep = (4500 - 2500 * _adv) * (_mobLvl * 2 + 1);
					}				
				}
			}
		}
	}
	
	_player = _13ObjExtend(_world.addActorMelee('player'), {
		pos: [0, -200]
	});
	
	return _player;
}