// LANDSCAPE STUFF COMMENTED OUT :<

/*var _lastAp = 0;

function _13Landscape(_textures, _canvas, _ap) {
	if(_lastAp != _ap && _ap <= 2)
	{
		_lastAp = _ap;
		
		var _ctx = _canvas.getContext('2d');
		_ctx.clearRect(0, 0, _canvas.width, _canvas.height);
	
		for(var i = 0; i < 3; i++)
		{
			_ctx.save();
			
			switch(i) {
				case 1: {
					if(_ap < 1) {
						_ctx.globalAlpha = _ap;
					}
					else {
						_ctx.globalAlpha = 2 - _ap;
						_ctx.translate(0, (_ap - 1) * _canvas.height);
					}
				} 
				break;
				case 2: {
					if(_ap >= 1) _ctx.globalAlpha = _ap - 1;
					else _ctx.globalAlpha = 0;
				} 
				break;
			}
			
			_ctx.drawImage(_textures.landscape.sky[i], 0, 0);
			
			_ctx.restore();
		}
		
		if(_ap < 1)
		{
			for(var i = 0; i < 2; i++)
			{
				_ctx.save();
				
				var _csun = _textures.landscape.sun[i];
				
				_ctx.translate(_canvas.width * 0.5 - _csun.width * 0.5, _ap * _canvas.height * 0.8);
				_ctx.scale(1 + 1 * _ap, 1 + 1 * _ap);
				
				if(i == 1) {
					_ctx.globalAlpha = _ap;
				}
				
				_ctx.drawImage(_csun, 0, 0);
				
				_ctx.restore();
			}
		}
		
		for(var i = 0; i < 2; i++)
		{
			_ctx.save();
			
			if(i == 1) {
				if(_ap >= 1) _ctx.globalAlpha = _ap - 1;
				else _ctx.globalAlpha = 0;
			}
			
			_ctx.drawImage(_textures.landscape.hills[i], 0, 0);
			
			_ctx.restore();
		}
	}
}*/