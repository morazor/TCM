function _13Game() {
	
	var _allCanvas = [];
	
	for(var i = 0; i < 2; i++)
	{
		var _canvas = document.createElement('canvas')
		_canvas.width = 1920;
		_canvas.height = 1080;
		_allCanvas.push(_canvas);
		
		document.body.appendChild(_canvas);
	}
	
	/*** SCALE HANDLING ***/
	
	var _scaleRatio = 1;
	
	window.onresize = function () {
		_scaleRatio = window.innerHeight / 1080;
		
		for(var i = 0; i < _allCanvas.length; i++)
		{
			_allCanvas[i].style.height = 1080 * _scaleRatio;
			_allCanvas[i].style.width = 1920 * _scaleRatio;
			_allCanvas[i].style.display = 'block';
			_allCanvas[i].style.left = (window.innerWidth / 2 - _allCanvas[i].offsetWidth / 2) + 'px';
		}
	}
	
	window.onresize();
	
	/*** INPUT HANDLING ***/

	var _keyPressed = [];
	var _mousePos = { x: 0, y: 0};
	var _mousePressed = { l: false, r: false };
	
	document.body.addEventListener('keydown', function(eventObj){
		_keyPressed[eventObj.keyCode] = true;
	});
	
	document.body.addEventListener('keyup', function(eventObj){
		_keyPressed[eventObj.keyCode] = false;
	});
	
	document.body.addEventListener('mousemove', function(eventObj){
		_mousePos.x = (eventObj.clientX - _allCanvas[1].offsetLeft) / _scaleRatio;
		_mousePos.y = (eventObj.clientY - _allCanvas[1].offsetTop) / _scaleRatio;
	});
	
	document.body.addEventListener('mousedown', function(eventObj){
		switch(eventObj.button)
		{
			case 0: _mousePressed.l = true; break;
			case 2: _mousePressed.r = true; break;
		}
	});
	
	document.body.addEventListener('mouseup', function(eventObj){
		switch(eventObj.button)
		{
			case 0: _mousePressed.l = false; break;
			case 2: _mousePressed.r = false; break;
		}
	});
	
	_allCanvas[1].addEventListener('click', function(eventObj) {
		if(_world.status == 0) {
			_world.status = 1;
			_media.sounds.music.play();
		}
	});
	
	var _camOffset = { x: 0, y: -150 };
	
	/*** WORLD INIT ***/
	
	var _media = _13MediaGen();
	
	var _ctx = _allCanvas[0].getContext('2d');
	_ctx.drawImage(_media.textures.landscape, 0, 0);
	
	var _ctx = _allCanvas[1].getContext('2d');
	
	_ctx.save();
	_ctx.beginPath();
	_ctx.fillStyle = 'black';
	_ctx.fillRect(0, 0, 1920, 1080);
	_ctx.fillStyle = '#aaaaaa';
	
	_ctx.translate(960, 1080);
	
	_ctx.textAlign = 'center';
	
	_ctx.font = '24px monospace';
	_ctx.fillText('Developed for JS13K by morazor - Music by Vincenzo Canfora', 0, -20);
	
	_ctx.translate(0, -540);
	
	_ctx.font = '64px serif';
	
	_ctx.fillText("The cursed", 0, -30);
	
	_ctx.font = '96px serif';
	_ctx.fillText("|", 0, 60);
	
	_ctx.font = '96px bold serif';
	_ctx.fillStyle = 'white';
	_ctx.textAlign = 'right';
	_ctx.fillText("Mir", -12, 60);
	
	_ctx.fillStyle = 'red';
	_ctx.textAlign = 'left';
	_ctx.fillText("roR", 12, 60);
	_ctx.restore();

	var _world = new _13World(_media);
	
	var _player = _13WorldGen(_world);
	
	/*** MAIN CYCLE ***/
	
	var _updTime = 30;
	var _liveTime = 0;
	
	setInterval(function () {
		if(_world.status > 0)
		{
			var _act = {
				move: 0,
				jump: _keyPressed[38] || _keyPressed[87],
				attack: _mousePressed.l,
				shield: _mousePressed.r,
				watch: {
					x : _mousePos.x / 1920 - 0.5,
					y: (_mousePos.y + _camOffset.y) / 1080 - 0.5
				}
			}
			
			if(_keyPressed[37] || _keyPressed[65]) {
				_act.move --;
			}
			if(_keyPressed[39] || _keyPressed[68]) {
				_act.move ++;
			}
			
			_player.action = _act;
		

			_world.update(_updTime);
			
			var _camPos = { x: _player.pos.x + _camOffset.x, y:  _player.pos.y + _camOffset.y - _player.h * 0.5 }; // adding player height to center on player
			
			_world.render(_ctx, _camPos);
		}
		
		_13HUD(_ctx, _player, _world);
		
	}, _updTime);
}

function _13HUD(_ctx, _player, _world) {
	switch(_world.status)
	{
		case 1: // play
		{
			_ctx.save();
			
			_ctx.translate(960, 1080 - (_player.revpow == null ? 54 : 81));
			
			_ctx.fillStyle = 'black';
			_ctx.fillRect(-102, 0, 204, 81);	

			_ctx.fillStyle = '#990000';
			_ctx.fillRect(-100, 2, 200 * _player.health.perc, 50);	
			
			if(_player.revpow != null)
			{
				_ctx.fillStyle = 'white';
				_ctx.fillRect(-100, 54, 200 * _player.revpow.perc, 25);
			}	
			
			_ctx.restore();
		}
		break;
		case 2: // game over
		{
		}
		break;
		case 3: // finished
		{
		}
		break;
	}
}