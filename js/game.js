function _13Game() {
	
	var _allCanvas = [];
	
	_13Rep(2, function() {
		var _canvas = _13Canv(1920, 1080);
		_allCanvas.push(_canvas);
		
		document.body.appendChild(_canvas);
	});
	
	var _bgCanv = _allCanvas[0];
	var _mainCanv = _allCanvas[1];
	
	/*** SCALE HANDLING ***/
	
	var _scaleRatio = 1;
	
	window.onresize = function () {
		_scaleRatio = window.innerHeight / 1080;
		
		_13Each(_allCanvas, function(_cvs) {
			_cvs.style.height = 1080 * _scaleRatio;
			_cvs.style.width = 1920 * _scaleRatio;
			_cvs.style.display = 'block';
			_cvs.style.left = (window.innerWidth / 2 - _cvs.offsetWidth / 2) + 'px';
		});
	}
	
	window.onresize();
	
	/*** INPUT HANDLING ***/

	var _keyPressed = [];
	var _mousePos = [0, 0];
	var _mousePressed = { l: false, r: false };
	
	document.body.addEventListener('keydown', function(eventObj){
		_keyPressed[eventObj.keyCode] = true;
	});
	
	document.body.addEventListener('keyup', function(eventObj){
		_keyPressed[eventObj.keyCode] = false;
	});
	
	document.body.addEventListener('mousemove', function(eventObj){
		_mousePos = [
			(eventObj.clientX - _mainCanv.offsetLeft) / _scaleRatio,
			(eventObj.clientY - _mainCanv.offsetTop) / _scaleRatio
		]
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
	
	_mainCanv.addEventListener('click', function() {
		if(_world.status == 0) {
			_world.setst(1);
		}
	});
	
	var _camOffset = [0, -150];
	
	/*** WORLD INIT ***/
	
	_13MediaGen();
	
	var _ctx = _13Ctx(_bgCanv);
	_ctx.drawImage(_13MediaTextures.landscape, 0, 0);

	var _ctx = _13Ctx(_mainCanv);
	
	

	var _world = _13World();
	
	var _player = _13WorldGen(_world);
	
	/*** MAIN CYCLE ***/
	
	var _updTime = 30;

	_13HUD(_ctx, _player, _world);
	
	setInterval(function () {
		if(_world.status > 0)
		{
			var _act = {
				move: 0,
				jump: _keyPressed[38] || _keyPressed[87],
				attack: _mousePressed.l,
				shield: _mousePressed.r,
				watch: [
					_mousePos[0] / 1920 - 0.5,
					(_mousePos[1] + _camOffset[1]) / 1080 - 0.5
				]
			}
			
			if(_keyPressed[37] || _keyPressed[65]) {
				_act.move --;
			}
			if(_keyPressed[39] || _keyPressed[68]) {
				_act.move ++;
			}
			
			_player.action = _act;
			
			var _wasalive = !_player.dead;
		
			var _worlspeed = (_world.status == 1 ? 1 : 0.2);
			
			_world.update(_updTime * _worlspeed);

			var _camPos = [ _player.pos[0] + _camOffset[0], _player.pos[1] + _camOffset[1] - _player.h * 0.5 ]; // adding player height to center on player
			
			_world.render(_ctx, _camPos);
			
			if(_player.dead && _wasalive) _world.setst(2);
		}
		
		_world.sttime += _updTime;
		
		_13HUD(_ctx, _player, _world);
	}, _updTime);
}