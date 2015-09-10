function _13WorldGen(_world) {
	var _walls = [
	]
	
	var _spawnp = [
	]
	
	_13Each([-1, 1], function(_dir) {
		// randomly creating walls
		var _cy = 370;
		var _cx = 250 * _dir;
		
		_13Rep(3, function(i) {
			var _cw = (i % 2 == 0 ? 700 : 300) + 50 * Math.round(_13Rand() * 4);
			// alternating a log and a short one
			
			_walls.push({x: _cx +_cw / 2 * _dir, y: _cy, w: _cw, h: 500, furn: true });
			
			_cx += _dir * (_cw - 50);
			_cy += _13RandPick([-1, 1, 1.5]) * 50;
		});
		
		_walls.push({x: _cx + 500 *_dir, y: _cy, w: 1000, h: 500}); // spawn point on this
		_walls.push({x: _cx + 1450 *_dir, y: _cy + 50, w: 1000, h: 500, furn: true}); // beyond the spawn point
		_spawnp.push([ _cx + 500 *_dir, _cy -390 ]);
	});

	_13Rep(3, function(i) {
		_walls.push({ x : 0, y: 225 + 50 * i, w: 150 + 100 * i * i, h: 500 }); // under the mirror
	});

	// FIXED STUFF MUST BE ADDED FIRST!

	_13Each(_walls, function(_bw) {
		_13ObjExtend(_world.addBody('wall', _bw.w, _bw.h), {
			pos: [_bw.x, _bw.y],
			collide: true
		});
	});
	
	var _treeArray = [];
	
	// graves and trees
	_13Each([ 't0', 't1', 'g' ], function(i) {
		var _mutcount = 0;
		var _furncount = 0;
		_13Each(_walls, function(_bw) {
			if(_bw.furn)
			{
				var _toadd = Math.floor(_bw.w / 200);
				
				if(i != 'g') {
					var _treeType = i.match(/\d$/)[0];
					_toadd = _bw.w > 650 || _treeType == 0;
				}
				
				_13Rep(_toadd, function(j) {

					var _rVal = _13RandBetween(0.15, 0.55);
					var _cOffY = 50;
					var _cName = 'grave_';

					if(i != 'g')
					{						
						_rVal =  _13Rand() * 0.45 + (_treeType == _furncount % 2 ? 0 : 0.55);
						_cOffY = 250;
						_cName = 'tree_' + _treeType;
					}
					
					var _rnd = ((j + _rVal) / _toadd) * 2 - 1;
					
					var _cbod = _13ObjExtend(_world.addBody(_cName + _mutcount), {
						pos: [
							_bw.x + _rnd * _bw.w / 3.1, 
							_bw.y - _bw.h / 2 - _cOffY
						]
					});
					
					if(i != 'g')  {
						_treeArray.push(_cbod);
					}
					
					_mutcount = (_mutcount + 1) % 10;
				});
				
				_furncount++;
			}
		});
	})

	_13ObjExtend(_world.addBody('mirror_inner'), {
		pos: [0, -150]
	});
	
	_13ObjExtend(_world.addBody('mirror'), {
		pos: [0, -150]
	});
	
	_13Each(_spawnp, function(_spp, i) {
		_13ObjExtend(_world.addBody('bone_pile_' + i), {
			pos: _spp,
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
	
		
	var _player = _13ObjExtend(_world.addActor('player'), {
		pos: [0, -100]
	});
	
	var _spawnList = [];
	
	_13Rep(_endWave, function(i) {
		var _mobLvl = i % 10;
						
		// 0: miniboss, 1+: popcorn spawn
		// starts with 1

		_mobLvl = _13Max(0, 1 - _mobLvl);

		_spawnList[i] = _13ObjExtend(_world.addActor(_13RandPick(['enemy_skel_', 'enemy_wotw_']) + _mobLvl), {
			pos: _13ObjClone(_13RandPick(_spawnp)),
			awake: true,
			dead: true,
			revmult: (_mobLvl == 0 ? 0.8 : 1.1)
		});
	});
		
	var _rain = _13ObjExtend(_13Particles(_world, 'rain', 40), {
		freq: 60,
		lifespan: 2000,
		collide: 'wall',
		diecoll: true,
		autorot: true,
		grav: 0
	});
	
	var _clouds = _world.addBody('clouds');
	
	_spawner.beforeUpdate = function(timePassed) { 
	// must be before update because if i add mobs after update they will be rendered without a skeleton refresh
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

			if(_waveTime % 101 == 0 && _13Rand() < (_waveStep - 35) / _endWave) {
				// 101 is a prime number, % 101 means that this check will be done every 101 updates
				// this doesn't work well if you change the refresh rate
				_13MediaSounds.thunder.play();
				_world.thunder = true;
			}
			
			if(_finalRound)
			{
				if(_finalBoss == null)
				{
					if(_liveEnemies == 0)
					{
						_finalBoss = _13ObjExtend(_world.addActor('rev_player'), {
							pos: [0, -100],
							health: _13LimVal(600),
							revmult: 1.3
						});
						
						if(_player.revved) _player.rev();
						
						_13MediaSounds.rev.play();
						
						_player.health.add(_player.health.max);
						_player.revpow = null;
						_player.revmult = 1.3;
						_player.texture.trail = '#aabbff';
						_player.texture.skip = 5;
					}
				}
				else {
					_world._wadv = 1;
					_world._wlive = _finalBoss.health.perc;
					if(_finalBoss.dead) _world.setst(3); // finish status
				}
			}
			else {
				if(_waveTime > _nextStep) {	
					_waveStep++;
				
					if(_waveStep >= _endWave)
					{
						_finalRound = true;
					}
					else
					{
						var _cMob = _spawnList[_waveStep];
						
						_cMob.undie();
						
						_waveTime = 0;
						_nextStep = (4500 - 2500 * _adv) * (_cMob.level * 2 + 1);
					}				
				}
			}
		}
	}
	
	_spawner.afterUpdate = function() {
		// must be done after update to align clouds and player before rendering
		var _wp = (_waveStep + _waveTime / _nextStep) / _endWave;
		var _ccp = Math.log(_wp + 0.3);
		if(_ccp > 0) _ccp /= 2;
		
		_13ObjExtend(_clouds, {
			pos: [
				_player.pos[0] + 1920 * _ccp,
				_player.pos[1] - 700
			]
		})
		
		if(_waveStep > 30)
		{
			_13ObjExtend(_rain, { 
				pos: [
					_13RandBetween(-960, 960) + _player.pos[0] + _player.vel[0] / 2 - _wp * 250,
					_player.pos[1] - 800
				],
				vel: [_wp * 500, 1200],
				on: true,
				freq: _13Max(1000 / (_waveStep - 29), 30)
			})
		}
		
		_13Each(_treeArray, function(_ctree) {
			_ctree.texture.play('stand', 1 + _wp, _wp);
		});
	}
	
	return _player;
}