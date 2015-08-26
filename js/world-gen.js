function _13WorldGen(_world) {
	
	var _player;
	
	var _walls = [
		{ x: 0, y: 350, w: 4000, h: 300 },
		{ x: 0, y: 300, w: 600, h: 300 },
		{ x: 0, y: 225, w: 400, h: 300 },
		{ x: 0, y: 125, w: 200, h: 300 },
		{ x: 2200, y: 350, w: 1000, h: 2000 },
		{ x: 1700, y: 200, w: 400, h: 100 },
	]

	var _maxi = _walls.length;
	for(var i = 0; i < _maxi; i++)
	{
		if(_walls[i].x != 0) {
			var _cwall = _13Obj.clone(_walls[i]);
			_cwall.x = -_walls[i].x;
			_walls.push(_cwall);
		}
	}
	
	// FIXED STUFF MUST BE ADDED FIRST!
	for(var i = 0; i < _walls.length; i++)
	{
		_13Obj.extend(_world.addBody('wall', _walls[i].w, _walls[i].h), {
			pos: { x: _walls[i].x, y: _walls[i].y },
			fixed: true
		});
	}
	
	_13Obj.extend(_world.addBody('mirror_inner'), {
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
				
				this.texture = document.createElement('canvas');
				this.texture.width = _mrrs;
				this.texture.height = _mrrs;
				
				// MAY BE USEFUL FOR TITLE SCREEN!
				//document.body.appendChild(this.texture);
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
	
	_13Obj.extend(_world.addBody('mirror'), {
		pos: { x: 0, y: -150 },
		fixed: true,
		collide: false
	});
	
	var _spawner = _world.addBody('spawner');
	_spawner.fixed = true;
	_spawner.collide = false;
	
	var _waveSeq = [
		{ l: [ 'enemy_wotw_0' ], r: [ ] },
		{ l: [ ], r: [ 'enemy_skel_0' ] },
		{ l: [ 'enemy_wotw_0' ], r: [ 'enemy_skel_0' ] },
		{ l: [ 'enemy_skel_1' ], r: [ ] },
		{ l: [ 'enemy_skel_0' ], r: [ 'enemy_wotw_1' ] }
	]
	
	for(var i = 0; i < _waveSeq.length; i++)
	{
		for(var _i in _waveSeq[i])
		{
			for(var j in _waveSeq[i][_i])
			{
				_waveSeq[i][_i][j] = _13Obj.extend(_world.addEnemy(_waveSeq[i][_i][j]), {
					pos: { x: (_i == 'l' ? -1650 : 1650), y: 0 },
					dead: true
				});
			}
		}
	}
	
	var _waveNum = 0;
	var _waveTime = 0;
	var _waveStep = 0;
	
	var _finalRound = false;
	
	_spawner.beforeUpdate = function(timePassed) { // must be before update because if i revive mobs after update they will be rendered without a skeleton refresh
		_waveTime += timePassed;
		var _cWave = _waveSeq[_waveNum];
		
		if(_cWave == null && !_finalRound)
		{
			_finalRound = true;
			_13Obj.extend(_world.addActorMelee('rev_player'), {
				pos: { x: 0,y: -100 }
			});
			
			if(_player.revved) _player.rev();
			_player.revpow = null;
		}
		else {
			if(_waveTime > (_waveStep + 1) * 2500) {			
				for(var _i in _cWave)
				{
					var _cmob = _cWave[_i][_waveStep];
					if(_cmob != null) {
						_cmob.undie();
						_cmob.awake = true;
						_cmob._spawned = true;
					}
				}
				
				_waveStep++;
			}
			
			var _someAlive = false;
			for(var _i in _cWave)
			{
				for(var j in _cWave[_i])
				{
					if(!_cWave[_i][j].dead || !_cWave[_i][j]._spawned) _someAlive = true;
				}
			}
			
			if(!_someAlive)
			{
				_waveNum++;
				_waveStep = 0;
				_waveTime = 0;
			}
		}
	}
	
	_player = _13Obj.extend(_world.addActorMelee('player'), {
		pos: { x: 0,y: -100 }
	});
	
	return _player;
}