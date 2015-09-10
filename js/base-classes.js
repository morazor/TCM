function _13Sprite(bTexture) {
	// main class for animations and images, stores both things
	if(bTexture == null || bTexture.skel == null) return bTexture;
	else {
		var _retObj = {
			width: bTexture.w,
			height: bTexture.h,
			skel: _13SkelClone(bTexture.skel),
			anim: _13ObjClone(bTexture.anim, true),
			trail: bTexture.trail
		}
		
		var _fxCanv = _13Canv(bTexture.w, bTexture.h)
		var _fxctx = _fxCanv.getContext('2d');
		
		// ANIMATION HANLDING
		return _13ObjExtend(_retObj, {
			play: function(animName, animSpeed, animCoeff) {
				for(var i in this.anim)
				{
					var _cAnim = this.anim[i];
					if(i != animName) {
						// turns off other animation on the same layer
						if(_cAnim.layer == this.anim[animName].layer) _cAnim.on = false;
					}
					else {
						if(!_cAnim.on)
						{
							_cAnim.on = true;
							_cAnim.time = 0;
						}
						
						if(animSpeed != null) _cAnim.speed = animSpeed;
						else _cAnim.speed = 1;
						
						if(animCoeff != null) _cAnim.coeff = animCoeff;
						else _cAnim.coeff = 1;
					}
				}
			},
			stop: function(animName) {
				this.anim[animName].on = false;
			},
			refresh: function(timePassed) {
				// refreshing skeletons poses
				var _frSkel = _13SkelClone(this.skel);

				for(var i in this.anim)
				{
					var _cAnim = this.anim[i];
					
					if(_cAnim.on) {
						_cAnim.time += timePassed * _cAnim.speed;
						
						var _ap = _cAnim.time / _cAnim.dur;
						
						// default case: animations playing once and remaining at the last frame, ie: blocking
						
						if (_cAnim.reset && _ap > 1) { // animations playing just once, ie: attacks
							this.stop(i);
						}
						else {
							if(_cAnim.loop) {
								if(typeof _cAnim.loop == 'number' && _ap > 1)
								{
									// animations with partial loops, ie: jump
									// first part on animation gets player once, second part is looped
									_ap -= 1;
									_ap = _cAnim.loop + ((_ap * 1000) % (_cAnim.loop * 1000)) / 1000;
								}
								else  _ap -= Math.floor(_ap); // regular loop, ie: run, stand
							}
							else {
								_ap = _13Min(1, _ap);
							}
							
							var _ac = _cAnim.coeff;
							// coeff is a parameter that can be passed to animation for internal calculations
							// for example: angle with for walking/running, thrusting or swinging attack

							if(_cAnim.chain) // animation chains, ie: attack telegraph, actual attack
							{
								var _splSum = 0;
								_13Each(_cAnim.chain.split, function(_cspl, i) {
									if(_splSum + _cspl >= _ap)
									{
										_ap -= _splSum;
										_ap /= _cspl;
					
										_cAnim.chain.trans[i](_frSkel, _ap, _ac);
										
										return true;
									}
									else _splSum += _cspl;
								});
							}
							else
							{
								_frSkel = _cAnim.trans(_frSkel, _ap, _ac);
							}
						}
					}
				}
			
				// for smoother transitions, frames are averaged with the last frame played
				if(this.lastFrame != null && timePassed > 0) _13SkelAverage(_frSkel, this.lastFrame, 1 - Math.pow(0.3, timePassed / 30));
				this.lastFrame = _frSkel;
			},
			render: function(tContext, posX, posY) {
				if(this.trail != null) { // trail effect for reversed player
					_13SkelDraw(_fxctx, this.lastFrame);
					
					_fxctx.save();
					_fxctx.fillStyle = this.trail;
					_fxctx.globalAlpha = 0.65;
					_fxctx.globalCompositeOperation = 'source-in';
					_fxctx.fillRect(0, 0, _fxCanv.width, _fxCanv.height);
					_fxctx.restore();

					tContext.drawImage(_fxCanv, posX + _13RandBetween(-3, 3), posY + _13RandBetween(-3, 3));
				}

				if(this.skip > 0)
				{
					// skip frames on player reverse (only the trail effect is visible)
					this.skip--;
				}
				else
				{
					tContext.save();
					tContext.translate(posX, posY);
					_13SkelDraw(tContext, this.lastFrame);
					tContext.restore();
				}
			}
		})
	}
}

function _13Body(_world, bName, bW, bH) {
	// base class for physics stuff
	if(typeof bName == 'string')
	{
		var bTexture = _13Sprite(_13MediaTextures[bName]); // don't use new, always return empty object if function returns null
	}
	else {
		var bTexture = bName;
		bName = '';
	}
	
	var _cCanvas = bTexture;
	
	if(bW == null || bH == null)
	{
		if(bTexture == null)
		{
			bW = 0;
			bH = 0;
		}
		else {
			bW = bTexture.width;
			bH = bTexture.height;
		}
	}
	else if(bTexture != null) { // repeat texture on size, used for walls with rounded corners regardless of wall's size
		var _cCanvas = _13Canv(bW, bH);
		
		var _cContext = _cCanvas.getContext('2d');
		
		_cContext.drawImage(bTexture, 0, 0, 50, 50, 0, 0, 50, 50);
		_cContext.drawImage(bTexture, bTexture.width - 50, 0, 50, 50, _cCanvas.width - 50, 0, 50, 50);
		
		for(var i = 50; i < _cCanvas.width - 50; i += 50)
		{
			_cContext.drawImage(bTexture, 50, 0, 50, 50, i, 0, 50, 50);
		}
		
		for(var i = 0; i < _cCanvas.width; i += 50)
		{
			for(var j = 50; j < _cCanvas.height; j += 50)
			{
				_cContext.drawImage(bTexture, 50, 50, 50, 50, i, j, 50, 50);
			}
		}
	}

	var lightC = [_13MediaLights[bName], _13MediaLights['rev_' + bName]];
	
	_13Rep(2, function(i) {
		// creating light textures from color value
		if(lightC[i] != null)
		{
			lightC[i] = _13Gradient(lightC[i].r, lightC[i].c, null, 80, 2, 0);
		}
	});
	
	var revTexture = _13Sprite(_13MediaTextures['rev_' + bName]);
	if(revTexture != null) {
		revTexture.anim = _cCanvas.anim;
	}

	var _retObj = {
		name: bName,
		texture: _cCanvas,
		light: lightC[0],
		w: bW,
		h: bH,
		pos: [0, 0],
		vel: [0, 0],
		acc: [0, 0],
		rot: 0,
		rotvel: 0,
		fixed: true,
		facing: true,
		bounce: 0,
		frict: 1,
		grav: 1,
		collide: false,
		overlap: false,
		onCollide: function () {},
		onOverlap: function () {},
		dead: false,
		lifespan: null,
		die: function(bullet) {
			this.dead = true;
			this.onDie(bullet);
		},
		undie: function(ls) {
			this.dead = false;
			this.lifespan = ls;
		},
		onDie: function () {
		},
		block: {
			u: false,
			d: false,
			l: false,
			r: false
		},
		beforeUpdate: function() {},
		afterUpdate: function() {},
		beforeCollide: function() { return true; },
		afterRefresh: function() {},
		scale: 1,
		alpha: 1,
		autorot: false, // if true body texture is rotated according to moving speed, ie: blood or rain
		canrev: true,
		revved: false,
		rev: function () {
			this.revved = !this.revved;

			if(this.revved) {
				this.texture = this.baserev.texture[1];
				if(this.texture) this.texture.skip = 5;
				this.light = this.baserev.light[1];
			}
			else
			{
				this.texture = this.baserev.texture[0];
				this.light = this.baserev.light[0];
			}
			
			if(this.onRev != null) this.onRev();
		},
		baserev: {
			texture: [_cCanvas, revTexture],
			light: lightC
		}
	};
	
	_world.bodies.push(_retObj);
	
	return _retObj;
}

function _13LimVal(maxval, cval)
{
	// helper class for limited valued (health, revpower)
	if(cval == null) cval = maxval;
	
	return {
		c: cval,
		max: maxval,
		perc: cval / maxval,
		add: function(aval) {
			this.c = _13Max(0, _13Min(this.c + aval, this.max));
			this.perc = this.c / this.max;
		}
	}
}