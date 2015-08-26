function _13Game() {
	var _mCanvas = document.getElementById('main-canvas');
	var _mContext = _mCanvas.getContext('2d');
	
	var _bgCanvas = document.getElementById('bg-canvas');

	var _allCanvas = [_bgCanvas, _mCanvas ];
	
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
		_mousePos.x = (eventObj.clientX - _mCanvas.offsetLeft) / _scaleRatio;
		_mousePos.y = (eventObj.clientY - _mCanvas.offsetTop) / _scaleRatio;
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
	
	var _camOffset = { x: 0, y: -150 };
	
	/*** WORLD INIT ***/
	
	var _media = _13MediaGen();
	
	var _ctx = _bgCanvas.getContext('2d');
	_ctx.drawImage(_media.textures.landscape, 0, 0);
	
	window.setTimeout(function () { _media.sounds.music.play(); }, 1000);
	
	var _world = new _13World(_media);
	
	var _player = _13WorldGen(_world);
	
	/*** MAIN CYCLE ***/
	
	var _updTime = 30;
	var _liveTime = 0;
	
	setInterval(function () {
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
		
		// LANDSCAPE STUFF COMMENTED OUT :<
		
		//var _totalTime = (_updTime * _cycleCount);
		
		//var _tp = 1.2 + _totalTime / 100000;
		//var _tp = 2;
		_world.render(_mContext, _camPos) //, _tp - 1);
		
		//if(_cycleCount % 5 == 0) _13Landscape(_media.textures, _bgCanvas, _tp);
		
		if(!_player.dead) _liveTime += _updTime;
		
		_13HUD(_mContext, _player, _liveTime);
		
	}, _updTime);
}

function _13HUD(_mContext, _player, _totalTime) {
	_mContext.save();
	_mContext.translate(_mContext.canvas.width / 2, 0);
	
	var _csec = Math.floor(_totalTime / 1000);
	var _cmin = Math.floor(_csec / 60);
	_csec = _csec % 60;
	if(_csec < 10) _csec = '0' + _csec.toString();
	
	_mContext.font = '50px monospace';
	_mContext.fillStyle = 'white';
	_mContext.fillText(_cmin + ':' + _csec, 0, 50);
	
	_mContext.translate(0, _mContext.canvas.height - (_player.revpow == null ? 54 : 81));
	
	_mContext.fillStyle = 'black';
	_mContext.fillRect(-102, 0, 204, 81);	

	_mContext.fillStyle = '#990000';
	_mContext.fillRect(-100, 2, 200 * _player.health.perc, 50);	
	
	if(_player.revpow != null)
	{
		_mContext.fillStyle = 'white';
		_mContext.fillRect(-100, 54, 200 * _player.revpow.perc, 25);
	}	
	
	_mContext.restore();
}