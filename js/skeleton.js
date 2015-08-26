var _13Skeleton = {
	Init: function (tb, skipIndex) {
		if(tb.path != null)
		{
			var _cw = tb.size * 2;
			var _ch = tb.size * 3;
			
			tb.texture = document.createElement('canvas');
			tb.texture.width = _cw;
			tb.texture.height = _ch;
			
			var _ctx = tb.texture.getContext('2d');
			
			_ctx.translate(_cw / 2, _ch / 3); // paths goes -0.5 < x < 0.5, 0 < y < 1

			for(var k = 0; k < tb.path.length; k++)
			{
				_ctx.save();
				_ctx.beginPath();
			
				var _cPath = tb.path[k];
				
				if(typeof _cPath.c == 'object') {
					_cPath.c = _ctx.createPattern(_cPath.c, 'repeat');
				}
				
				_ctx.fillStyle = _cPath.c;
				_ctx.strokeStyle = _cPath.c;
				_ctx.moveTo(_cPath.p[0].x * tb.size, _cPath.p[0].y * tb.size);
				
				for(var i = 1; i < _cPath.p.length; i++)
				{
					var _cp = _cPath.p[i];
					switch(_cp.form)
					{
						case 'arc': _ctx.arc(_cp.x * tb.size, _cp.y * tb.size, _cp.r * tb.size, _cp.as, _cp.ae, _cp.rev); break;
						case 'rect': _ctx.rect(_cp.x * tb.size, _cp.y * tb.size, _cp.w * tb.size, _cp.h * tb.size); break;
						case 'bez': _ctx.bezierCurveTo(_cp.x1 * tb.size, _cp.y1 * tb.size, _cp.x2 * tb.size, _cp.y2 * tb.size, _cp.x * tb.size, _cp.y * tb.size); break;
						default: _ctx.lineTo(_cp.x * tb.size, _cp.y * tb.size); break;
					}
				}
				
				if(_cPath.line != null) {
					_ctx.lineWidth = _cPath.line * tb.size;
					_ctx.stroke();
				}
				else
				{
					_ctx.closePath();
					_ctx.fill();
					
					if(_cPath.b != null)
					{
						/*if(_cPath.b > 0) _ctx.strokeStyle = 'rgba(0,0,0,0.5)';
						else _ctx.strokeStyle = 'rgba(255,255,255,0.5)';*/
						
						_ctx.strokeStyle = 'rgba(127,127,127,0.5)';
						_ctx.lineWidth = 1;
						_ctx.stroke();
					}
				}
				
				_ctx.restore();
			}
			
			tb.path = null;
			
			// SHADE ON Z
			if(tb.z != null)
			{
				_ctx.fillStyle = 'rgba(0,0,0,0.1)';
				_ctx.globalCompositeOperation = 'source-atop';
				
				for(var i = 0; i < tb.z; i++)
				{
					_ctx.fillRect(-_cw / 2, -_ch / 2, _cw, _ch);
				}
			}
		}
	
		if(tb.link != null)
		{
			for(var i = 0; i < tb.link.length; i++)
			{
				this.Init(tb.link[i], true);
			}
		}
		
		if(!skipIndex)
		{
			this._Index(tb);
		}
	},
	_Index: function (tb, rootBone) {
		if(rootBone == null) {
			rootBone = tb;
			tb.bones = {};
		}
		
		if(tb.name != null)
		{
			if(rootBone.bones[tb.name] == null) rootBone.bones[tb.name] = [];
			rootBone.bones[tb.name].push(tb);
		}
		
		if(tb.link != null)
		{
			for(var i = 0; i < tb.link.length; i++)
			{
				this._Index(tb.link[i], rootBone);
			}
		}
	},
	Draw: function (tctx, tb) {
		tctx.save();
		tctx.translate(tb.x, tb.y);
		tctx.rotate(tb.rot);
		
		if(tb.scale != null)
		{
			tctx.scale(tb.scale.x, tb.scale.y);
		}
		
		tctx.translate(0, tb.size);
		
		if(tb.link != null)
		{
			for(var i = 0; i < tb.link.length; i++)
			{
				if(tb.link[i].under) this.Draw(tctx, tb.link[i]);
			}
		}
		
		tctx.translate(0, -tb.size);

		this._DrawBone(tctx, tb)
		
		tctx.translate(0, tb.size);
		
		if(tb.link != null)
		{
			for(var i = 0; i < tb.link.length; i++)
			{
				if(!tb.link[i].under) this.Draw(tctx, tb.link[i]);
			}
		}
		
		tctx.restore();
	},
	_DrawBone: function(tctx, tb) {
		if(tb.texture != null)
		{
			tctx.save();
			
			if(tb.alpha != null) tctx.globalAlpha = tb.alpha;
			if(tb.scale != null) tctx.scale(tb.scale, tb.scale);			

			tctx.drawImage(tb.texture, -tb.size, -tb.size);
			
			tctx.restore();
		}
	},
	Clone: function(tb) {
		var _retVal = _13Obj.clone(tb);

		if(tb.path != null)
		{
			_retVal.path = [];
			for(var i = 0; i < tb.path.length; i++)
			{
				_retVal.path.push(_13Obj.clone(tb.path[i]));
			}
		}
		
		if(tb.link != null)
		{
			_retVal.link = [];
			for(var i = 0; i < tb.link.length; i++)
			{
				_retVal.link.push(this.Clone(tb.link[i]));
			}
		}
		
		if(tb.bones != null)
		{
			this._Index(_retVal);
		}
		
		return _retVal;
	},
	AllBones: function(tb, onBone) {
		onBone(tb);
		
		if(tb.link != null)
		{
			for(var i = 0; i < tb.link.length; i++)
			{
				this.AllBones(tb.link[i], onBone);
			}
		}
	},
	Average: function(tb, sb, tc) {
		
		tb.x = tb.x * tc + sb.x * (1 - tc);
		tb.y = tb.y * tc + sb.y * (1 - tc);
		tb.rot = tb.rot * tc + sb.rot * (1 - tc);
		
		if(tb.link != null)
		{
			for(var i = 0; i < tb.link.length; i++)
			{
				this.Average(tb.link[i], sb.link[i], tc);
			}
		}
		
		return tb;
	}
};