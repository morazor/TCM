function _13HUD(_ctx, _player, _world) {
	var _overDelay = 5000;
	var _flipTime = 10000;
	
	if(_world.status == 1)
	{
		_ctx.fillStyle = 'rgba(0,0,0,' + _13Max(0, 1 - _world.sttime / 500) + ')';
		_ctx.fillRect(0, 0, 1920, 1080);
	
		_ctx.save();
	
		var _topd = (_player.revpow != null? 75 : 50);
		
		_ctx.translate(960, 1080 - _topd);

		_13Path(_ctx, { c: 'black', p: [
			[ 'rect', -100, 0, 200, 75 ]
		]});
		
		// health bar
		_13Path(_ctx, { c: 'red', p: [
			[ 'rect', -99, 1, 198 * _player.health.perc, 48 ]
		]});

		if(_player.revpow != null) // revpower bar
		{
			_13Path(_ctx, { c: 'white', p: [
				[ 'rect', -99, 50, 198 * _player.revpow.perc, 24 ]
			]});
		}	

		_ctx.restore();
	}
	else
	{
		var _text = [ // title
			'Developed for JS13K by morazor',
			'[click to start]',
			'The Cursed',
			[ 'Mir', 'Ror' ],
			[ 'A valiant knight', 'A vicious villain' ],
			[ 'To break free from the curse', 'The mirror has been broken' ],
			[ 'Fight with valour', 'Slay the nemesis' ]
		]
		
		if(_world.status == 2) // game over
		{
			_text = [ 
				'',
				'[reload to play again]',
				'You have died, fighting for the right to be',
				[ 'Your', 'Self' ]
			]
		}
		else if(_world.status == 3) // finished
		{
			_text = [ 
				'',
				'[reload to play again]',
				'You are finally free to live your life',
				[ 'Your', 'Way']
			]
		}
	
		_ctx.save();
		_ctx.beginPath();
		
		if(_world.status != 0) {
			_ctx.globalAlpha = _13Max(0, (_world.sttime - _overDelay) / 500);
			
			_ctx.fillStyle = 'rgba(0,0,0,0.5)';
			_ctx.fillRect(0, 0, 1920, 1080);
		}
		else {
			_ctx.fillStyle = 'black';
			_ctx.fillRect(0, 0, 1920, 1080);
			_ctx.globalAlpha = _world.sttime / 500;
		}

		_ctx.fillStyle = '#bbbbbb';
		
		_ctx.translate(960, 1080);
		
		_ctx.textAlign = 'center';
		
		_ctx.font = '24px monospace';
		_ctx.fillText(_text[0], 0, -20);
		
		_ctx.translate(0, -240);
		
		_ctx.fillText(_text[1], 0, -20);

		_ctx.textBaseline = 'middle';
		
		if(_world.status == 0) _ctx.font = '80px serif';
		else _ctx.font = '40px serif';
		
		_ctx.translate(0, -450);

		_ctx.fillText(_text[2], 0, -100);

		if(_world.status != 3)
		{
			var _flipPerc = ((_world.status == 0 ? 0 : _overDelay) + _world.sttime % _flipTime) / _flipTime;

			if(_13RandBetween(-0.2, 0.2) > _13Cos(_flipPerc * PI2 - 1.3))
			{
				_ctx.scale(-1, 1);
			}
		}
		
		_13Each(_text, function(_ctext, i) {
			if(i > 2) {
				_ctx.save();
				
				var _ch = (i > 3 ? 36 : 136)
				
				_ctx.fillRect(-1, -_ch / 2, 2, _ch);
				
				_ctx.font = _ch + 'px serif';

				_ctx.fillStyle = 'white';
				_ctx.textAlign = 'right';
				
				//_ctx.strokeStyle = 'black';
				//_ctx.lineWidth = 0.5;
				
				_13Each(_text[i], function (_ct, j) {
					if(j > 0) {
						_ctx.scale(-1, 1);
						if(_world.status != 3) _ctx.fillStyle = 'red';
					}
					
					_ctx.fillText(_text[i][j], -20, 0);
					//if(i > 3) _ctx.strokeText(_text[i][j], -20, 0);
				});
				
				_ctx.restore();
				_ctx.translate(0, (i > 3 ? _ch : _ch * 1.5));
			}
		});
		
		_ctx.restore();
	}
	
	if(_world.status != 0)
	{
		// progress bar
		_ctx.save();
		
		_ctx.translate(960, 80);
		_ctx.rotate(-PI / 2);
		
		_13Path(_ctx, { c: 'rgba(0,0,0,0.5)', p: [
			[ 'arc', 0, 0, 70 ]
		]});
		
		if(_world._wadv > 0) {
			_13Path(_ctx, { c: 'red', p: [
				[ 0, 0 ],
				[ 'arc', 0, 0, 69, 0, PI2 * _world._wadv ]
			]});
		}
		
		if(_world._wadv - _world._wlive > 0) {
			_13Path(_ctx, { c: 'white', p: [
				[ 0, 0 ],
				[ 'arc', 0, 0, 69, 0, PI2 * (_world._wadv - _world._wlive) ]
			]});
		}	
		
		_ctx.restore();
	}
}