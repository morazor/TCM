	/* // SPRITESHEET HANDLING
	function _13Sprite(bTexture, frameW) {
		var _retObj = {
			anim: { 
				list: {}, 
				current: null, 
				time: 0 
			},
			texture: bTexture,
			width: frameW,
			height: bTexture.height,
			frame: 0,
			speed: 1
		};
		
		_retObj.anim.add = function(animName, framesArray, loops) {
			if(loops == null) loops = false;
			this.list[animName] = { frames: framesArray, loops: loops };
		}	

		_retObj.anim.play = function(animName, animSpeed) {
			if(animName != this.current)
			{
				this.current = animName;
				this.time = 0;
			}
			
			if(animSpeed != null) this.speed = animSpeed;
			else this.speed = 1;
		}
		
		_retObj.update = function(timePassed) {
			var _frameNum = 0;
			
			if(this.anim.current != null)
			{
				this.anim.time += timePassed * this.anim.speed;
				
				var _frameNum = Math.abs(Math.floor(this.anim.time / 30));
				var _cAnim = this.anim.list[this.anim.current];
				
				if(_cAnim.loops) {
					if(typeof _cAnim.loops == 'number')
					{
						if(_frameNum >= _cAnim.frames.length)
						{
							var _loopL = _cAnim.frames.length - _cAnim.loops;
							_frameNum = _cAnim.loops + (_frameNum - _cAnim.frames.length) % _loopL;
						}
					}
					else
					{
						_frameNum = _frameNum % _cAnim.frames.length;
					}
				}
				else if(_frameNum >= _cAnim.frames.length) {
					_frameNum = _cAnim.frames.length - 1;
				}
				
				_frameNum = _cAnim.frames[_frameNum];
			}

			this.frame = _frameNum;
		}
		
		_retObj.render = function (tContext, posX, posY) {
			tContext.drawImage(this.texture, this.width * this.frame, 0, this.width, this.texture.height, posX, posY, this.width, this.height);
		}
		
		return _retObj;
	}*/

function _13Sprite(bTexture) {
	if(bTexture == null || bTexture.skel == null) return bTexture;
	else {
		var _retObj = {
			texture: document.createElement('canvas'),
			width: bTexture.w,
			height: bTexture.h,
			skel: _13Skeleton.Clone(bTexture.skel),
			anim: _13Obj.clone(bTexture.anim, true),
			trail: bTexture.trail
		}
		
		_retObj.texture.width = bTexture.w;
		_retObj.texture.height = bTexture.h;
		
		var _fxCanv = document.createElement('canvas');
		_fxCanv.width = bTexture.w;
		_fxCanv.height = bTexture.h;
		var _fxctx = _fxCanv.getContext('2d');
		
		return _13Obj.extend(_retObj, {
			play: function(animName, animSpeed, animCoeff) {
				for(var _i in this.anim)
				{
					var _cAnim = this.anim[_i];
					if(_i != animName) {
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
				var _frSkel = _13Skeleton.Clone(this.skel);

				for(var _i in this.anim)
				{
					var _cAnim = this.anim[_i];
					
					if(_cAnim.on) {
						_cAnim.time += timePassed * _cAnim.speed;
						
						var _ap = _cAnim.time / _cAnim.dur;
						
						if (_cAnim.reset && _ap > 1) {
							this.stop(_i);
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
								for(var i = 0; i < _cAnim.chain.split.length; i++)
								{
									var _cspl = _cAnim.chain.split[i];
									
									if(_splSum + _cspl >= _ap)
									{
										_ap -= _splSum;
										_ap /= _cspl;
					
										_cAnim.chain.trans[i](_frSkel, _ap, _ac);
										
										break;
									}
									else _splSum += _cspl;
								}
							}
							else
							{
								_frSkel = _cAnim.trans(_frSkel, _ap, _ac);
							}
						}
					}
				}
			
				if(this.lastFrame != null) _13Skeleton.Average(_frSkel, this.lastFrame, 0.7);
				this.lastFrame = _frSkel;
			},
			render: function(tContext, posX, posY) {
				var _ctx = this.texture.getContext('2d');
				
				if(this.trail)
				{
					_ctx.save();
					_ctx.fillStyle = '#770000';
					_ctx.globalCompositeOperation = 'source-atop';
					_ctx.fillRect(0, 0, this.texture.width, this.texture.height);
					_ctx.restore();
					
					_fxctx.clearRect(0, 0, this.texture.width, this.texture.height);
					_fxctx.drawImage(this.texture, _13Random.between(-5, 5), _13Random.between(-5, 5));
					tContext.drawImage(_fxCanv, posX, posY);
				}
				
				_ctx.clearRect(0, 0, this.texture.width, this.texture.height);
				
				_13Skeleton.Draw(_ctx, this.lastFrame);
				
				if(this.skip > 0) this.skip--;
				else tContext.drawImage(this.texture, posX, posY);
			}
		})
	}
}

function _13Body(_world, bName, bW, bH) {

	if(typeof bName == 'string')
	{
		var bTexture = _13Sprite(_world.media.textures[bName]); // don't use new, always return empty object if function returns null
	}
	else {
		bTexture = bName;
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
		var _cCanvas = document.createElement('canvas');
		_cCanvas.width = bW;
		_cCanvas.height = bH;
		
		var _cContext = _cCanvas.getContext('2d');
		
		_cContext.drawImage(bTexture, 0, 0, 100, 100, 0, 0, 100, 100);
		_cContext.drawImage(bTexture, bTexture.width - 100, 0, 100, 100, _cCanvas.width - 100, 0, 100, 100);
		
		for(var i = 100; i < _cCanvas.width - 100; i += 100)
		{
			_cContext.drawImage(bTexture, 100, 0, 100, 100, i, 0, 100, 100);
		}
		
		for(var i = 0; i < _cCanvas.width; i += 100)
		{
			for(var j = 100; j < _cCanvas.height; j += 100)
			{
				_cContext.drawImage(bTexture, 100, 100, 100, 100, i, j, 100, 100);
			}
		}
	}
	
	var _lCanv = null;
	
	var lightC = [_world.media.lights[bName], _world.media.lights['rev_' + bName]];
	
	for(var i = 0; i < 2; i++)
	{
		if(lightC[i] != null)
		{
			var _cs = lightC[i].r;
			_lCanv = document.createElement('canvas');
			_lCanv.width = _cs;
			_lCanv.height = _cs;
			
			var _lCtx = _lCanv.getContext('2d');
			
			_lCtx.translate(_cs / 2, _cs / 2);
			
			var _grd = _lCtx.createRadialGradient(0, 0, 0, 0, 0, _cs / 2);

			_grd.addColorStop(0, lightC[i].c);
			_grd.addColorStop(1, 'rgba(0,0,0,0)');
			
			_lCtx.globalAlpha = 0.5;
			_lCtx.beginPath();
			_lCtx.fillStyle = _grd;
			_lCtx.arc(0, 0, _cs / 2, 0, Math.PI * 2);
			_lCtx.closePath();
			
			_lCtx.fill();
			
			lightC[i] = _lCanv;
		}
	}
	
	var revTexture = _13Sprite(_world.media.textures['rev_' + bName]);
	if(revTexture != null) {
		revTexture.anim = _cCanvas.anim;
	}

	return {
		name: bName,
		texture: _cCanvas,
		light: lightC[0],
		w: bW,
		h: bH,
		pos: { x: 0, y: 0},
		vel: { x: 0, y: 0},
		acc: { x: 0, y: 0},
		rot: 0,
		rotvel: 0,
		fixed: false,
		facing: true,
		bounce: 0,
		frict: 1,
		grav: 1,
		collide: true,
		overlap: false,
		onCollide: function (tbod) {},
		onOverlap: function (tbod) {},
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
		beforeUpdate: function(timePassed) {},
		afterUpdate: function(timePassed) {},
		onRender: function() {},
		beforeCollide: function(tbod) { return true; },
		scale: 1,
		alpha: 1,
		autorot: false,
		canrev: true,
		revved: false,
		rev: function () {
			this.revved = !this.revved;

			if(this.revved) {
				this.texture = this.baserev.texture[1];
				this.texture.skip = 5;
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