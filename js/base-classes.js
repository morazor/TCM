function _13Sprite(bTexture) {
	if(bTexture == null || bTexture.skel == null) return bTexture;
	else {
		var _retObj = {
			texture: _13Canv(bTexture.w, bTexture.h),
			width: bTexture.w,
			height: bTexture.h,
			skel: _13SkelClone(bTexture.skel),
			anim: _13ObjClone(bTexture.anim, true),
			trail: bTexture.trail
		}
		
		var _fxCanv = _13Canv(bTexture.w, bTexture.h)
		var _fxctx = _fxCanv.getContext('2d');
		
		return _13ObjExtend(_retObj, {
			play: function(animName, animSpeed, animCoeff) {
				for(var i in this.anim)
				{
					var _cAnim = this.anim[i];
					if(i != animName) {
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
				var _frSkel = _13SkelClone(this.skel);

				for(var i in this.anim)
				{
					var _cAnim = this.anim[i];
					
					if(_cAnim.on) {
						_cAnim.time += timePassed * _cAnim.speed;
						
						var _ap = _cAnim.time / _cAnim.dur;
						
						if (_cAnim.reset && _ap > 1) {
							this.stop(i);
						}
						else {
							if(_cAnim.loop) {
								if(typeof _cAnim.loop == 'number' && _ap > 1)
								{
									_ap -= 1;
									_ap = _cAnim.loop + ((_ap * 1000) % (_cAnim.loop * 1000)) / 1000;
								}
								else  _ap -= Math.floor(_ap);
							}
							else {
								_ap = Math.min(1, _ap);
							}
							
							var _ac = _cAnim.coeff;

							if(_cAnim.chain)
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
			
				if(this.lastFrame != null && timePassed > 0) _13SkelAverage(_frSkel, this.lastFrame, 1 - Math.pow(0.3, timePassed / 30));
				this.lastFrame = _frSkel;
			},
			render: function(tContext, posX, posY) {
				var _ctx = this.texture.getContext('2d');
				
				if(this.trail != null)
				{
					_ctx.save();
					_ctx.fillStyle = this.trail;
					_ctx.globalCompositeOperation = 'source-atop';
					_ctx.fillRect(0, 0, this.texture.width, this.texture.height);
					_ctx.restore();
					
					_fxctx.globalAlpha = 0.5;
					
					_fxctx.save();
					_fxctx.globalCompositeOperation = 'destination-in';
					_fxctx.fillRect(0, 0, this.texture.width, this.texture.height);
					_fxctx.restore();
					_fxctx.drawImage(this.texture, _13RandBetween(-3, 3), _13RandBetween(-3, 3));
					tContext.drawImage(_fxCanv, posX, posY);
				}
				
				_ctx.clearRect(0, 0, this.texture.width, this.texture.height);
				
				_13SkelDraw(_ctx, this.lastFrame);
				
				if(this.skip > 0) this.skip--;
				else tContext.drawImage(this.texture, posX, posY);
			}
		})
	}
}

function _13Body(_world, bName, bW, bH) {

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
	else if(bTexture != null) { // repeat texture on size
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
	
	var _lCanv = null;
	
	var lightC = [_13MediaLights[bName], _13MediaLights['rev_' + bName]];
	
	_13Rep(2, function(i) {
		if(lightC[i] != null)
		{
			lightC[i] = _13Gradient(lightC[i].r, lightC[i].c, null, 80, 2, 0);
		}
	});
	
	var revTexture = _13Sprite(_13MediaTextures['rev_' + bName]);
	if(revTexture != null) {
		revTexture.anim = _cCanvas.anim;
	}

	return {
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
		fixed: false,
		facing: true,
		bounce: 0,
		frict: 1,
		grav: 1,
		collide: true,
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
		autorot: false,
		canrev: true,
		revved: false,
		rev: function () {
			this.revved = !this.revved;

			if(this.revved) {
				this.texture = this.baserev.texture[1];
				if(this.texture != null) this.texture.skip = 5;
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
}

function _13LimVal(maxval, cval)
{
	if(cval == null) cval = maxval;
	
	return {
		c: cval,
		max: maxval,
		perc: cval / maxval,
		add: function(aval) {
			this.c = Math.max(0, Math.min(this.c + aval, this.max));
			this.perc = this.c / this.max;
		}
	}
}