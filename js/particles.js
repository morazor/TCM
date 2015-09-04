function _13Particles(_world, bName, maxNum) {
	var _pList = [];
	for(var i = 0; i < maxNum; i++)
	{
		var _cBody = _world.addBody(bName);
		_cBody.collide = false;
		_cBody.die();
		_pList.push(_cBody);
	}
	
	return {
		pos: [0, 0],
		vel: [0, 0],
		acc: [0, 0],
		rot: 0,
		rotvel: 0,
		scale: 1, 
		alpha: 1,
		list: _pList,
		min: {
			pos: [0, 0],
			vel: [0, 0],
			acc: [0, 0],
			rot: 0,
			rotvel: 0,
			scale: 0, // all props get summed with min-max, so i need 0 here
			alpha: 0
		},
		max: {
			pos: [0, 0],
			vel: [0, 0],
			acc: [0, 0],
			rot: 0,
			rotvel: 0,
			scale: 0,
			alpha: 0
		},
		grav: 1,
		lifespan: 1000,
		collide: false,
		bounce: 1,
		autorot: false,
		freq: 250,
		on: false,
		fx: {},
		update: function(timePassed)
		{
			if(this.link)
			{
				for(var i in this.pos)
				{
					this.pos[i] = this.link.pos[i];
					this.vel[i] = this.link.vel[i] * 0.65;
				}
				
				this.alpha = this.link.alpha;
				
				this.on = !this.link.dead;				
			}
			
			if(this.on)
			{
				var _pnum = 0;
				var _em = this;
				
				if(this.freq <= 0) // explosion
				{
					if(typeof this.on == 'number') _pnum = this.on;
					else _pnum = this.list.length;
					this.on = false;
				}
				else{
					if(this._lastEmit == null) this._lastEmit = 0;
					this._lastEmit += timePassed;
				
					_pnum = Math.floor(this._lastEmit / this.freq);
					this._lastEmit = this._lastEmit % this.freq;
					
					if(typeof this.on == 'number') {
						if(this.on <= _pnum) {
							_pnum = this.on;
							this.on = false;
						}
						else this.on -= _pnum;
					}
				}

				_13Rep(_pnum, function () {
					_13Each(_em.list, function (_cP) {
						if(_cP.dead)
						{
							_13ObjExtend(_cP, {
								dead: false,
								lifespan: _em.lifespan,
								grav: _em.grav,
								collide: _em.collide,
								bounce: _em.bounce,
								autorot: _em.autorot,
								start: {},
								beforeUpdate: function () {
									for(var i in _em.fx)
									{
										var _bp = this.lifespan / _em.lifespan; // 1 to 0
										this[i] = this.start[i] * Math.pow(_bp, 0.5);
									}
								}
							});
							
							for(var i in _em.min)
							{
								if(_cP[i].length != null)
								{
									_13Rep(2, function(j) {
										_cP[i][j] = _em[i][j] + _13RandBetween(_em.min[i][j], _em.max[i][j]);
									});
								}
								else {
									_cP[i] = _em[i] + _13RandBetween(_em.min[i], _em.max[i]);
									_cP.start[i] = _cP[i];
								}
							}
							
							return true;
						}
					});
				});
			}
		}
	}
}
