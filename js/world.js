function _13World() {	

	function _calcPoints(cBody) {
		cBody.left = cBody.pos[0] - cBody.w / 2;
		cBody.right = cBody.pos[0] + cBody.w / 2;
		cBody.top = cBody.pos[1] - cBody.h / 2;
		cBody.bottom = cBody.pos[1] + cBody.h / 2;
	}

	var _lastUpdate = 0;

	var _livebod = [];
	var _mirror;
	var _player;
	
	return {
		status: 0,
		bodies: [],
		actors: [],
		particles: [],
		sttime: 0,
		setst: function(stnum) {
			this.status = stnum;
			this.sttime = 0;
			_13MediaSounds[(stnum == 1 ? 'rev': 'over')].play();
		},
	
		/*	SEQUENCE EXPLAINED:
			
			beforeUpdate: input handling
			update: movement & collisions
			afterUpdate: animations setting
			refresh: skeletons refresh
			afterRefresh: stuff needing refreshed skeletons
			render: texture is rendered */

		/*** UPDATE ***/
	
		update: function (timePassed) {
			_lastUpdate += timePassed;

			/* PARTICLES */
			_13Each(this.particles, function(_cParticles) {
				_cParticles.update(timePassed);
			});
			
			/* BODIES */
			_livebod = [];

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
					
					_cBody.vel[0] += _cBody.acc[0] * timePassed / 1000;
					_cBody.vel[1] += _cBody.acc[1] * timePassed / 1000 + _cgrav;
					
					var _velang = Math.atan2(_cBody.vel[1], _cBody.vel[0]);
					var _frict = [
						_cBody.frict * _13Cos(_velang) * timePassed * 0.1, 
						_cBody.frict * _13Sin(_velang) * timePassed * 0.1
					]
					
					_13Rep(2, function (i) {
						if(Math.abs(_frict[i]) > Math.abs(_cBody.vel[i])) _cBody.vel[i] = 0;
						else _cBody.vel[i] -= _frict[i];
						
						_cBody.pos[i] += _cBody.vel[i] * timePassed / 1000;
					});
					
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
					
						var _overlap = [
							_13Max(0, _13Min(_r1.right,_r2.right) - _13Max(_r1.left,_r2.left)),
							_13Max(0, _13Min(_r1.bottom,_r2.bottom) - _13Max(_r1.top,_r2.top))
						]
				
						if(_overlap[0] * _overlap[1] > 0)
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
							
								if(_bounce[0] && _bounce[1]) // is this check right?
								{
									if(_overlap[0] < _overlap[1])
									{
										_bounce[1] = false;
									}
									else
									{
										_bounce[0] = false;
									}
								}
								
								var _sides = [
									[ 'l', 'r' ],
									[ 'u', 'd' ]
								]
								
								_13Rep(2, function(i) {
									if(_bounce[i])
									{
										// _r2 is never fixed: all fixed stuff is added first										
										// after the removal of collision between player and skeletons _r1 is always fixed
										
										_r2.vel[i] = -_r2.bounce * _r2.vel[i];
									
										if(_relVel[i] > 0) _r2.pos[i] += _overlap[i];
										else _r2.pos[i] -= _overlap[i];
										
										if(_r2.pos[i] < _r1.pos[i]) _r2.block[_sides[i][1]] = true; // left or up
										else _r2.block[_sides[i][0]] = true; // right or down
									}
								});

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

			_13Each(this.actors, function(_cact) {
				_13AI(_cact, _player, timePassed);
			});
		},
		render: function (tCtx, cameraPos) {
			tCtx.save();
			
			var _cc = [Math.round(-cameraPos[0] + tCtx.canvas.width / 2), Math.round(-cameraPos[1] + tCtx.canvas.height / 2)];
		
			tCtx.clearRect(0, 0, tCtx.canvas.width, tCtx.canvas.height);
			
			tCtx.translate(_cc[0], _cc[1]);
			
			var _cameraRect = { 
				pos: cameraPos,
				w: 2120, // some items have textures larger than body
				h: 1280  // should be handled in a better way
			}

			_calcPoints(_cameraRect);
			
			var _lscl = -_13Sin((_lastUpdate % 150) / 300 * PI) * 0.07; // flickering lights	

			// MIRROR
			
			// i was rendering this stuff on the mirror's texture, but webkit has a huge performace drop
			// i don't know why, it should be heavier to do such things on a bigger canvas...
			
			var _mrrs = _mirror._basetxt.width;
			
			tCtx.save();
			tCtx.translate(_mirror.pos[0], _mirror.pos[1]);
			
			tCtx.drawImage(_mirror._basetxt, - _mrrs / 2, - _mrrs / 2);

			if(!_player.dead && _player.revpow != null) {
				tCtx.save();
				
				tCtx.scale(1.4, 1.4);
				
				tCtx.translate(_player.pos[0] - _mirror.pos[0], _player.pos[1] - _mirror.pos[1]);

				var _ri = (_player.revved ? 0 : 1);

				var _crev = _player.baserev.texture[_ri];
				_crev.refresh(0); // this skips easing between frames but it's not very noticeable

				if(!_player.facing) tCtx.scale(-1, 1);
				
				_crev.render(tCtx,  - _crev.width / 2,  - _crev.height / 2);
				
				var _cl = _player.baserev.light[_ri];
				
				tCtx.scale(1 - _lscl, 1 - _lscl);
				tCtx.drawImage(_cl, - _cl.width / 2, - _cl.height / 2);
				
				tCtx.restore();
			}
			
			tCtx.globalCompositeOperation = 'destination-in';
			tCtx.drawImage(_mirror._basetxt, - _mrrs / 2, - _mrrs / 2);
			
			tCtx.restore();
			
			if(this.thunder)
			{
				this.thunder = false;
				tCtx.fillStyle = 'white';
				tCtx.fillRect(-_cc[0], -_cc[1], tCtx.canvas.width, tCtx.canvas.height);
			}
			
			// MAIN RENDER CYCLE
			
			_13Each(['texture', 'light'], function (prop) {
				_13Each(_livebod, function(_cBody) {
					var _target = _cBody[prop];
					
					if(_target != null && _13RectInters(_cBody, _cameraRect))
					{
						tCtx.save();
						tCtx.translate(_cBody.pos[0], _cBody.pos[1]);
						tCtx.rotate(_cBody.rot);
						tCtx.scale(_cBody.scale, _cBody.scale);
						
						if(prop == 'light') {
							tCtx.scale(1 - _lscl, 1 - _lscl);
						}
						
						tCtx.globalAlpha = _cBody.alpha;
						
						if(!_cBody.facing) tCtx.scale(-1, 1);
						
						var _bpos = [ -_target.width / 2, -_target.height / 2 ];
						
						if(_target.render != null)
						{
							_target.render(tCtx, _bpos[0], _bpos[1]);
						}
						else
						{
							tCtx.drawImage(_target, _bpos[0], _bpos[1]);
						}
						
						tCtx.restore();
					}
				});
			});
			
			// BODY DEBUG
			/*
			for(var i = 0; i < this.bodies.length; i++)
			{
				var _cBody = this.bodies[i];
				
				if(!_cBody.dead && (_cBody.overlap || _cBody.collide))
				{
					tCtx.save();
					tCtx.translate(_cBody.pos[0], _cBody.pos[1]);
							
					tCtx.beginPath();
					tCtx.strokeStyle = 'rgba(255,200,0,0.3)';
					tCtx.fillStyle = 'rgba(255,0,0,0.15)'
					tCtx.fillRect(-_cBody.w / 2, -_cBody.h / 2, _cBody.w, _cBody.h);
					tCtx.strokeRect(-_cBody.w / 2, -_cBody.h / 2, _cBody.w, _cBody.h);
					tCtx.stroke();
					
					if(_cBody.health != null)
					{
						tCtx.save();
					
						tCtx.translate(0, -_cBody.h / 2 - 5);
						tCtx.fillStyle = 'white';
						tCtx.font = '28px monospace';
						tCtx.textAlign = 'center';
						tCtx.fillText(Math.round(_cBody.health.c) + '/' + _cBody.health.max, 0, 0);
						
						tCtx.restore();
					}
					
					if(_cBody.canshield)
					{
						tCtx.save();
					
						tCtx.translate(0, -_cBody.h / 2 - 25);
						tCtx.fillStyle = 'white';
						tCtx.font = '28px monospace';
						tCtx.textAlign = 'center';
						tCtx.fillText(Math.round(_cBody.shnrg.c) + '/' + _cBody.shnrg.max, 0, 0);
						
						tCtx.restore();
					}
					
					if(_cBody.isshield)
					{
						var _watchang = Math.atan2(_cBody.action.watch[1], _cBody.action.watch[0]);
					
						// the parry angle is different from _watchang
						// basically, i don't want the player to parry to the ground
						// whatch up is - PI / 2, so let's make it zero
						
						_watchang = (_watchang + PI / 2 + PI * 4) % (PI2); // now angle is 0 to PI * 2
						
						if(_watchang > PI) _watchang = _watchang - PI2; // now it's - PI to PI
						
						// now let's reduce the difference
						
						_watchang *= 0.8;
						var _bonusAngle = Math.abs(_watchang * 0.6);
						
						// and back
						
						_watchang -= PI / 2;
						
						var _pang = 1.4 + _bonusAngle;
						
						tCtx.save();

						tCtx.rotate(_watchang - _pang / 2);

						tCtx.fillStyle = 'rgba(127,127,127,0.3)';
						tCtx.strokeStyle = 'rgba(255,255,255,0.3)';
						
						tCtx.beginPath();
						tCtx.moveTo(0, 0);
						tCtx.arc(0, 0, 150, 0, _pang);
						tCtx.closePath();
						tCtx.fill();
						tCtx.stroke();
						
						tCtx.restore();
					}
					
					tCtx.restore();
				}
			}*/
			
			tCtx.restore();
		},
		/*** CLASSES ***/
		
		addBody: function (bName, bW, bH) {
			var _retObj = _13Body(this, bName, bW, bH);
			
			if(bName == 'mirror_inner') {
				_mirror = _retObj;
				_mirror._basetxt = _mirror.texture
				_mirror.texture = null;
			}
		
			return _retObj;
		},
		addActor: function(bName) {
			if(bName.match(/wotw/) != null) return _13ActorRanged(this, bName);
			else {
				var _retObj = _13ActorMelee(this, bName);
				if(bName == 'player') _player = _retObj;
				return _retObj;
			}
		}
	}
}

