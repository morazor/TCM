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
		pos: { x: 0, y: 0},
		vel: { x: 0, y: 0},
		acc: { x: 0, y: 0},
		rot: 0,
		rotvel: 0,
		scale: 1, 
		alpha: 1,
		list: _pList,
		min: {
			pos: { x: 0, y: 0},
			vel: { x: 0, y: 0},
			acc: { x: 0, y: 0},
			rot: 0,
			rotvel: 0,
			scale: 0, // all props get summed with min-max, so i need 0 here
			alpha: 0
		},
		max: {
			pos: { x: 0, y: 0},
			vel: { x: 0, y: 0},
			acc: { x: 0, y: 0},
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
			if(this.link != null)
			{
				this.pos.x = this.link.pos.x;
				this.pos.y = this.link.pos.y;
				
				this.vel.x = this.link.vel.x * 0.5;
				this.vel.y = this.link.vel.y * 0.5;
				
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

				for(var j = 0; j < _pnum; j++)
				{
					for(var k = 0; k < this.list.length; k++)
					{
						var _cP = this.list[k];
						if(_cP.dead)
						{
							this.beforeEmit(_cP);
							_13Obj.extend(_cP, {
								dead: false,
								lifespan: this.lifespan,
								grav: this.grav,
								collide: this.collide,
								bounce: this.bounce,
								autorot: this.autorot,
								start: {},
								beforeUpdate: function () {
									for(var _i in _em.fx)
									{
										var _bp = this.lifespan / _em.lifespan; // 1 to 0
										this[_i] = this.start[_i] * Math.pow((_em.fx) ? (_bp) : (1 -_bp), 0.5); // 0 to 1 if is false
									}
								}
							});
							
							for(var _i in this.min)
							{
								if(_cP[_i].x != null)
								{
									_cP[_i].x = this[_i].x + _13Random.between(this.min[_i].x, this.max[_i].x);
									_cP[_i].y = this[_i].y + _13Random.between(this.min[_i].y, this.max[_i].y);
								}
								else {
									_cP[_i] = this[_i] + _13Random.between(this.min[_i], this.max[_i]);
									_cP.start[_i] = _cP[_i];
								}
							}
							
							break;
						}
					}
				}
			}
		},
		beforeEmit: function(_cP)
		{
		}
	}
}
