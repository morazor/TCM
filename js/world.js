function _13World() {	

	function _calcPoints(cBody) {
		cBody.left = cBody.pos.x - cBody.w / 2;
		cBody.right = cBody.pos.x + cBody.w / 2;
		cBody.top = cBody.pos.y - cBody.h / 2;
		cBody.bottom = cBody.pos.y + cBody.h / 2;
	}
	
	var _lCanv = _13Canv(1920, 1080);
	var _lCtx = _lCanv.getContext('2d');

	var _lastUpdate = 0;

	var _particles = [];
	
	return {
		status: 0,
		player: null,
		bodies: [],
		actors: [],
	
	/*	SEQUENCE EXPLAINED:
		
		beforeUpdate: input handling
		update: movement & collisions
		afterUpdate: animations setting
		refresh: skeletons refresh
		afterRefresh: stuff needing refreshed skeletons
		onRender: before texture is rendered
		render: texture is rendered */

	/*** UPDATE ***/
	
		update: function (timePassed) {
			_lastUpdate += timePassed;
			
			/* PARTICLES */
			for(var i = 0; i < _particles.length; i++)
			{
				_particles[i].update(timePassed);
			}
			
			/* BODIES */
			
			var _livebod = [];
			
			_13Each(this.bodies, function(_cBody) {
				// killing stuff that must die
				
				if(_cBody.lifespan != null) {
					_cBody.lifespan -= timePassed;
					if(_cBody.lifespan <= 0) {
						_cBody.lifespan = null;
						_cBody.die();
					}
				}
				
				if(!_cBody.dead)
				{
					_cBody.beforeUpdate(timePassed);
					_livebod.push(_cBody);
				}
			});
			
			_13Each(_livebod, function(_cBody) {
				
				// MOVEMENT

				if(!_cBody.fixed)
				{
					var _cgrav = _cBody.grav * timePassed; // gravity
					
					_cBody.vel.x += _cBody.acc.x * timePassed / 1000;
					_cBody.vel.y += _cBody.acc.y * timePassed / 1000 + _cgrav;
					
					var _velang = Math.atan2(_cBody.vel.y, _cBody.vel.x);
					var _frict = { 
						x: _cBody.frict * Math.cos(_velang) * timePassed * 0.1, 
						y: _cBody.frict * Math.sin(_velang) * timePassed * 0.1
					}
					
					for(var i in _frict)
					{
						if(Math.abs(_frict[i]) > Math.abs(_cBody.vel[i])) _cBody.vel[i] = 0;
						else _cBody.vel[i] -= _frict[i];
					}

					_cBody.pos.x += _cBody.vel.x * timePassed / 1000;
					_cBody.pos.y += _cBody.vel.y * timePassed / 1000;
					
					if(_cBody.autorot)
					{
						_cBody.rot = _velang;
					}
					else{
						var _frict = _cBody.frict * timePassed * 0.001 * (_cBody.rotvel > 0 ? 1 : -1);
						
						if(Math.abs(_frict) > Math.abs(_cBody.rotvel)) _cBody.rotvel = 0;
						else _cBody.rotvel -= _frict;
					}
					
					_cBody.rot += _cBody.rotvel * timePassed / 1000;
					
					for(var i in _cBody.block) _cBody.block[i] = false;
				}
				
				_calcPoints(_cBody);
			});
			
			// COLLISIONS - incomplete implementation, just for the game's purposes
			
			for(var k = 0; k < _livebod.length; k++)
			{
				var _r1 = _livebod[k];
				
				for(var j = k + 1; j < _livebod.length; j++)
				{
					var _r2 = _livebod[j];
					
					if((!_r1.fixed || !_r2.fixed) &&
					((_r1.overlap || _r1.collide == true || _r1.collide == _r2.name) && (_r2.overlap || _r2.collide == true || _r2.collide == _r1.name)) &&
					(_r1.beforeCollide(_r2) && _r2.beforeCollide(_r1))) {
					
						var _overlap = {
							x: Math.max(0, Math.min(_r1.right,_r2.right) - Math.max(_r1.left,_r2.left)),
							y: Math.max(0, Math.min(_r1.bottom,_r2.bottom) - Math.max(_r1.top,_r2.top))
						}
				
						if(_overlap.x * _overlap.y > 0)
						{
							if(_r1.overlap || _r2.overlap)
							{
								_r1.onOverlap(_r2);
								_r2.onOverlap(_r1);
							}
							else {
								if(!_r1.autorot) _r1.rotvel *= _r1.bounce;
								if(!_r2.autorot) _r2.rotvel *= _r2.bounce;
								
								var _relVel = {};
								var _bounce = {};
								
								for(var i in _overlap)
								{
									_relVel[i] = _r1.vel[i] - _r2.vel[i];
									_bounce[i] = 
										((_relVel[i] < 0 && _r1.pos[i] > _r2.pos[i]) || 
										(_relVel[i] > 0 && _r1.pos[i] < _r2.pos[i]));
								}
							
								if(_bounce.x && _bounce.y) // is this check right?
								{
									if(_overlap.x < _overlap.y)
									{
										_bounce.y = false;
									}
									else
									{
										_bounce.x = false;
									}
								}
								
								var _sides = {
									x: [ 'l', 'r' ],
									y: [ 'u', 'd' ]
								}
								
								for(var i in _bounce)
								{
									if(_bounce[i])
									{
										
										// _r2 is never fixed: all fixed stuff is added first
										/*if(_r2.fixed) { 
											_r1.vel.x = -_r1.bounce * _r1.vel.x;
										
											if(_relVelX < 0) _r1.pos.x += _overlapX;
											else _r1.pos.x -= _overlapX;
											
											if(_r1.pos.x < _r2.pos.x) _r1.block.r = true;
											else _r1.block.l = true;
										}
										else */
									
										if(_r1.fixed) { 
											_r2.vel[i] = -_r2.bounce * _r2.vel[i];
										
											if(_relVel[i] > 0) _r2.pos[i] += _overlap[i];
											else _r2.pos[i] -= _overlap[i];
											
											if(_r2.pos[i] < _r1.pos[i]) _r2.block[_sides[i][1]] = true; // left or up
											else _r2.block[_sides[i][0]] = true; // right or down
										}
										else
										{
											var _r1Vel = _r1.vel[i];
											_r1.vel[i] = _r1.bounce * _r2.vel[i];
											_r2.vel[i] = _r2.bounce * _r1Vel;
										}
									}
								}

								_r1.onCollide(_r2);	
								_r2.onCollide(_r1);									
							}
						}
					}
				}
				
				_calcPoints(_r1);
				_calcPoints(_r2);
			}
			
			// REFRESHING skeletons
			_13Each(_livebod, function(_cBody) {
				
				_cBody.afterUpdate(timePassed);
				if(_cBody.texture != null && _cBody.texture.refresh != null)
				{
					_cBody.texture.refresh(timePassed);
					_cBody.afterRefresh(timePassed);
				}
			})
			
			/* AI */
			var _world = this;
			_13Each(this.actors, function(_cact) {
				_13AI(_cact, _world, timePassed);
			});
		},
		render: function (tCtx, cameraPos) {
			tCtx.save();
			
			var _cc = [Math.round(-cameraPos.x + tCtx.canvas.width / 2), Math.round(-cameraPos.y + tCtx.canvas.height / 2)];
		
			tCtx.clearRect(0, 0, tCtx.canvas.width, tCtx.canvas.height);
			tCtx.translate(_cc[0], _cc[1]);
			
			_lCtx.save();
			_lCtx.clearRect(0, 0, _lCtx.canvas.width, _lCtx.canvas.height);
			_lCtx.translate(_cc[0], _cc[1]);
			
			var _cameraRect = { 
				pos: cameraPos,
				w: 2120, // some items have textures larger than body
				h: 1280  // should be handled in a better way
			}

			_calcPoints(_cameraRect);
			
			var _lscl = -Math.sin((_lastUpdate % 150) / 300 * Math.PI) * 0.07; // flickering lights		
			
			_13Each(this.bodies, function(_cBody) {
				
				if(!_cBody.dead && _13RectInters(_cBody, _cameraRect))
				{
					if(_cBody.texture != null)
					{
						_cBody.onRender();
						
						tCtx.save();
						tCtx.translate(_cBody.pos.x, _cBody.pos.y);
						tCtx.rotate(_cBody.rot);
						tCtx.scale(_cBody.scale, _cBody.scale);
						tCtx.globalAlpha = _cBody.alpha;
						
						if(!_cBody.facing) tCtx.scale(-1, 1);
						
						var _bpos = { x: -_cBody.texture.width / 2, y: -_cBody.texture.height / 2}
						
						if(_cBody.texture.render != null)
						{
							_cBody.texture.render(tCtx, _bpos.x, _bpos.y);
						}
						else
						{
							tCtx.drawImage(_cBody.texture, _bpos.x, _bpos.y);
						}
						
						tCtx.restore();
					}
					
					if(_cBody.light != null)
					{
						_lCtx.save();
						
						_lCtx.translate(_cBody.pos.x, _cBody.pos.y);
						_lCtx.scale(_cBody.scale - _lscl, _cBody.scale - _lscl);
						
						_lCtx.globalAlpha = _cBody.alpha;
						
						_lCtx.drawImage(_cBody.light, -_cBody.light.width / 2, -_cBody.light.height / 2)
						
						_lCtx.restore();
					}
				}
			});
			
			// BODY DEBUG
			/*for(var i = 0; i < this.bodies.length; i++)
			{
				var _cBody = this.bodies[i];
				
				if(!_cBody.dead && (_cBody.overlap || _cBody.collide))
				{
					tCtx.save();
					tCtx.translate(_cBody.pos.x, _cBody.pos.y);
							
					tCtx.strokeStyle = 'rgba(255,200,0,0.3)';
					tCtx.fillStyle = 'rgba(255,0,0,0.15)'
					tCtx.fillRect(-_cBody.w / 2, -_cBody.h / 2, _cBody.w, _cBody.h);
					tCtx.strokeRect(-_cBody.w / 2, -_cBody.h / 2, _cBody.w, _cBody.h);
					tCtx.stroke();
					
					if(_cBody.health != null)
					{
						tCtx.translate(0, -_cBody.h / 2 - 5);
						tCtx.fillStyle = 'white';
						tCtx.font = '28px monospace';
						tCtx.textAlign = 'center';
						tCtx.fillText(_cBody.health.c + '/' + _cBody.health.max, 0, 0);
					}
					
					tCtx.restore();
				}
			}*/
			
			tCtx.restore();
			
			tCtx.save();
			tCtx.globalAlpha = 0.5; // lights layer
			tCtx.drawImage(_lCanv, 0, 0);
			tCtx.restore();
			
			_lCtx.restore();
		},
		/*** CLASSES ***/
		
		addBody: function (bName, bW, bH) {
			var _retObj = new _13Body(this, bName, bW, bH);
			
			this.bodies.push(_retObj);
		
			return _retObj;
		},
		addActorRanged: function(bName, bW, bH) {
			var _retObj = new _13ActorRanged(this, bName, bW, bH);
			
			this.actors.push(_retObj);
		
			return _retObj;
		},
		addActorMelee: function(bName, bW, bH) {
			var _retObj = new _13ActorMelee(this, bName, bW, bH);
			
			if(bName == 'player') this.player = _retObj;
			
			this.actors.push(_retObj);
		
			return _retObj;
		},
		addEnemy: function(bName, bW, bH) {
			if(bName.match(/wotw/) != null) return this.addActorRanged(bName);
			else return this.addActorMelee(bName);
		},
		addParticles: function(bName, maxNum)
		{	
			var _retObj = new _13Particles(this, bName, maxNum)
			_particles.push(_retObj);

			return _retObj;
		}
	}
}

