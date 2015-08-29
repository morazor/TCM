window._13Media = {
	textures: {},
	sounds: {}
}

function _13MediaGen() {
	var _lights = {
		player: { c: '#ffff77', r: 350 },
		enemy_wotw_0: { c: '#64a0ff', r: 250 },
		enemy_wotw_1: { c: '#e164ff', r: 250 }
	}
	
	for(var _i in _lights)
	{
		_lights['bullet_' + _i] = {
			c: _lights[_i].c,
			r: _lights[_i].r * 0.5
		}
	}
	
	_lights.rev_player = { c: '#cc0000', r: 350 };
	_lights.rev_bullet_player = { c: '#cc0000', r: 350 };
	_lights.bullet_rev_player = _lights.rev_bullet_player;
	_lights.sparks = { c: '#ffdd99', r: 30 }
	
	return {
		textures: _13TextureGen(),
		sounds: _13SoundGen(),
		lights: _lights
	}
}

function _13TextureGen() {
	var _retObj =  {};
	
	/*** COLORS AND PATTERNS ***/
	
	var _pw = 4; // pattern size
	var _plw = 1; // pattern line width

	var _chainc = _13Canv(_pw, _pw);

	var _cpctx = _chainc.getContext('2d');
	_cpctx.fillStyle = '#444444';
	_cpctx.fillRect(0, 0, _pw, _pw);

	_cpctx.lineWidth = _plw;
	_cpctx.strokeStyle = '#aaaadd';
	_cpctx.arc(_pw / 2, _pw / 2, _pw / 2 - _plw / 2, 0, Math.PI * 2);
	_cpctx.stroke();

	var _platec = '#f5f5ff';
	var _goldc = '#ffdd77';
	var _ironc = '#c0c0c0'; 
	var _bonec = '#ffffee'; 
	var _rustc = '#dd9977';
	var _borderc = 'rgba(127,127,127,0.5)';
	
	// MIRROR
	var _bls = 250;
	
	var _canvas = _13Canv(_bls, _bls);
	
	var _ctx = _canvas.getContext('2d');
	
	_ctx.translate(_bls / 2, _bls / 2);
	_ctx.scale(0.7, 1);
	
	_ctx.fillStyle = '#777777';
	_ctx.beginPath();
	_ctx.moveTo(_bls / 2, 0);
	_ctx.arc(0, 0, _bls / 2 - 1, 0, Math.PI * 2);
	_ctx.arc(0, 0, _bls / 2 - 15, 0, Math.PI * 2, true);
	_ctx.closePath();
	_ctx.fill();

	/*_ctx.fillStyle = '#333333';
	_ctx.beginPath();
	_ctx.moveTo(_bls / 2, 0);
	_ctx.arc(0, 0, _bls / 2 - 15, 0, Math.PI * 2);
	_ctx.closePath();
	_ctx.fill();*/
	
	_ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	_13Rep(3, function(i) {
		_ctx.save();
		_ctx.rotate(Math.random() / 2 + Math.PI * 1.5 * i); // Math.PI * 2 / 3
		
		var _mstep = -_bls / 2 + 15;
		
		_ctx.translate(0, -_mstep);
		_ctx.beginPath();
		_ctx.moveTo(0, 0);
		_ctx.lineTo(0, _mstep);
		_ctx.stroke();
		_ctx.closePath();
		
		if(i > 0) {
			_ctx.beginPath();
			_ctx.moveTo(0, _mstep / 3);
			_ctx.translate(0, _mstep);
			_ctx.rotate(0.3);
			_ctx.translate(0, -_mstep);
			_ctx.lineTo(0, 0);
			_ctx.stroke();
			_ctx.closePath();
		}
		
		_ctx.restore();
	})
		
	_retObj.mirror = _canvas;
	
	var _canvas = _13Canv(_bls, _bls);
	
	var _ctx = _canvas.getContext('2d');
	
	_ctx.translate(_bls / 2, _bls / 2);
	_ctx.scale(0.7, 1);

	_ctx.fillStyle = '#333333';
	_ctx.beginPath();
	_ctx.moveTo(_bls / 2, 0);
	_ctx.arc(0, 0, _bls / 2 - 15, 0, Math.PI * 2);
	_ctx.closePath();
	_ctx.fill();
	
	_retObj.mirror_inner = _canvas;
	
	// BLOOD PLAYER
	
	var _bls = 25;
	
	var _canvas = _13Canv(_bls, _bls);
	
	var _ctx = _canvas.getContext('2d');

	_ctx.fillStyle = '#ee0000';
	_ctx.lineWidth = 1;
	_ctx.strokeStyle = _borderc;
	
	_ctx.translate(0, _bls / 2);
	
	_ctx.beginPath();
	_ctx.moveTo(0, 0);
	_ctx.arc(_bls * 0.7, 0, _bls * 0.3 - 1, -1.4, 1.4);
	_ctx.closePath();

	_ctx.fill();
	_ctx.stroke();

	_retObj.blood_player = _canvas;
	_retObj.blood_rev_player = _canvas;
	
	// BLOOD SKELETONS
	
	var _bls = 25;
	
	var _canvas = _13Canv(_bls, _bls);
	
	var _ctx = _canvas.getContext('2d');
	_ctx.translate(_bls / 2, 0);

	_ctx.fillStyle = _bonec;
	_ctx.lineWidth = 1;
	_ctx.strokeStyle = _borderc;
	
	_ctx.beginPath();
	_ctx.moveTo(1, 1);
	_ctx.lineTo(- _bls / 3 + 1, _bls - 1);
	_ctx.lineTo(_bls / 3 - 1, _bls - 1);
	_ctx.closePath();

	_ctx.fill();
	_ctx.stroke();

	_retObj.blood_enemy_skel_0 = _canvas;
	_retObj.blood_enemy_skel_1 = _canvas;
	
	// SPARK
	var _canvas = _13Canv(4, 4);
	
	var _ctx = _canvas.getContext('2d');
	_ctx.fillStyle = 'yellow';
	_ctx.arc(2, 2, 2, 0, Math.PI * 2);
	_ctx.fill();

	_retObj.sparks = _canvas;
	
	// AURAS
	var _bls = 80;
	
	var _aurac = [ [ 'rgba(0,50,255,1)', 'rgba(0,0,255,0)' ], [ 'rgba(100,0,255,1)', 'rgba(50,0,255,0)' ] ];
	_13Each(_aurac, function(_cau, i) {
		var _canvas = _13Canv(_bls, _bls);
		
		var _ctx = _canvas.getContext('2d');
		_ctx.translate(_bls / 2, _bls / 2)

		var _grd = _ctx.createRadialGradient(0, 0, _bls * 0.2, 0, 0, _bls / 2);

		_grd.addColorStop(0, _cau[0]);
		_grd.addColorStop(1, _cau[1]);

		_ctx.fillStyle = _grd;
		
		_ctx.arc(0, 0, _bls / 2, 0, Math.PI * 2);
		_ctx.fill();

		_retObj['aura_enemy_wotw_' + i] = _canvas;
		
		var _bcanvas = _canvas;
		
		var _canvas = _13Canv(_bls / 2, _bls / 2);
		
		var _ctx = _canvas.getContext('2d');
		_ctx.scale(0.5, 0.5);
		
		_ctx.drawImage(_bcanvas, 0, 0);
		
		_retObj['aura_bullet_enemy_wotw_' + i] = _canvas;
		_retObj['blood_enemy_wotw_' + i] = _canvas;
		_retObj['sparks_enemy_wotw_' + i] = _canvas;
	});

	// WALL
	var _canvas = _13Canv(300, 300);
	
	var _ctx = _canvas.getContext('2d');
	
	_ctx.fillStyle = '#261f1f';
	_ctx.beginPath();
	_ctx.moveTo(0, 300);
	_ctx.arc(25, 25, 25, Math.PI, Math.PI * 1.5);
	_ctx.arc(275, 25, 25, Math.PI * 1.5, Math.PI * 2);
	_ctx.lineTo(300, 300);
	_ctx.closePath();
	_ctx.fill();
	
	_retObj.wall = _canvas;
	
	// skeletal textures paths goes -0.5 < x < 0.5, 0 < y < 1

	/**************** 
	 * PLAYER START *
	 ****************/

	var _fw = 400; // anim width
	var _fh = 400; // anim height

	var _pbs = _fw * 0.5; // base size for animation

	var _cSkel = { 
		x: _fw * 0.5,
		y: _fh * 0.5,
		rot: 0,
		size: 0,
		link: [ {
			x: 0,
			y:  _pbs * 0.05,
			rot: Math.PI,
			size: _pbs * 0.3,
			name: 'body',
			under: true,
			path: [
				{ c: _chainc, p: [ // body
					{ x: 0.25, y: 1 },
					{ form: 'arc', x: 0, y: 1, r: 0.25, as: 0, ae: Math.PI },
					{ form: 'arc', x: 0, y: 0, r: 0.2, as: Math.PI, ae: 0 }
				] },
				{ c: _platec, b: 1, p: [ // chest - back
					{ x: 0.25, y: 1 },
					{ form: 'arc', x: 0, y: 1, r: 0.25, as: 0, ae: Math.PI * 0.5 },
					{ x: 0, y: 1 },
					{ x: 0.1, y: 1 },
					{ x: -0.05, y: 0.45 },
					{ x: 0.25, y: 0.45 }
				] },
				{ c: _platec, b: 1, p: [ // chest - front
					{ x: 0, y: 1.25 },
					{ form: 'arc', x: 0, y: 1, r: 0.25, as: Math.PI * 0.5, ae: Math.PI * 0.9 },
					{ x: -0.3, y: 0.9 },
					{ x: -0.3, y: 0.6 },
					{ x: -0.2, y: 0.15 },
					{ x: -0.1, y: 0.25 },
					{ x: 0, y: 0.4 },
					{ x: 0.1, y: 0.45 },
					{ x: 0.1, y: 0.5 },
					{ x: 0, y: 0.55 },
					{ x: -0.1, y: 1 },
					{ x: 0, y: 1 }
				] },
				{ c: _platec, b: 1, p: [ // neck
					{ x: -0.15, y: 1.2 },
					{ x: -0.15, y: 1.5 },
					{ x: 0.07, y: 1.5 },
					{ x: 0.1, y: 1.2 }
				] }
			], 
			link: [ { // head
				x: 0,
				y: _pbs * 0.14,
				rot: Math.PI,
				size: _pbs * 0.2,
				name: 'head',
				path: [
					{ c: _platec, b: 1, p: [ // head
						{ x: 0.3, y: 0 },
						{ form: 'arc', x: 0, y: 0, r: 0.3, as: 0, ae: Math.PI * 1, rev: true  },
						{ x: -0.3, y: 0.3 },
						{ x: 0.4, y: 0.35 }
					] },
					{ c: 'black', p: [ // eye 
						{ x: 0.1, y: -0.04 },
						{ x: 0.25, y: -0.04 },
						{ x: 0.3, y: 0.02 },
						{ x: 0.1, y: 0.02 }
					] }
				]
			} ]
		}, { // leg
			x: 0,
			y: _pbs * 0.05,
			rot: -0.2,
			size: _pbs * 0.2,
			name: 'leg',
			under: true,
			path: [
				{ c: _chainc, p: [
					{ x: 0.35, y: 0 },
					{ form: 'arc', x: 0, y: 0, r: 0.35, as: -Math.PI * 0.8, ae: Math.PI * 0.8, rev: true },
					{ form: 'arc', x: 0, y: 1, r: 0.2, as: Math.PI, ae: 0, rev: true }
				] },
				{ c: _platec, b: 1, p: [
					{ x: -0.05, y: 0.1 },
					{ x: 0.38, y: -0.1 },
					{ x: 0.38, y: 0.15 },
					{ x: 0.25, y: 1 },
					{ x: -0.05, y: 0.8 }
				] }
			],
			link: [
				{
					x: 0,
					y: 0,
					rot: 0.25,
					size: _pbs * 0.2,
					name: 'leg_lk',
					path: [
						{ c: _chainc, p: [
							{ x: 0.2, y: 0 },
							{ form: 'arc', x: 0, y: 0, r: 0.2, as: 0, ae: Math.PI, rev: true },
							{ x: 0, y: 1 },
							{ x: 0.15, y: 1 }
						] },
						{ c: _platec, b: 1, p: [ // calf
							{ x: -0.05, y: 0 },
							{ x: 0.15, y: -0.1 },
							{ x: 0.3, y: -0.3 },
							{ x: 0.2, y: 1 },
							{ x: 0.1, y: 1 }
						] },
						{ c: _platec, b: 1, p: [ // feet
							{ x: 0.2, y: 0.9 },
							{ x: -0.05, y: 1 },
							{ x: -0.05, y: 1.15 },
							{ x: 0.65, y: 1.15 },
							{ x: 0.65, y: 1.1 }
						] }
					]
				}
			]
		}]
	}

	// FAKE BODY avoids layers handling
	var _farm = _13Skeleton.Clone(_cSkel.link[0]);
	_farm.under = false;
	_farm.path = null;
	_farm.link = [];
	_farm.link[0] = { // arm
		x: 0,
		y:  0,
		rot: Math.PI - 0.3,
		size: _pbs * 0.18,
		name: 'arm',
		path: [
			{ c: _chainc, p: [
				{ x: 0.35, y: 0 },
				{ form: 'arc', x: 0, y: 0, r: 0.35, as: 0, ae: Math.PI, rev: true },
				{ form: 'arc', x: 0, y: 1, r: 0.2, as: Math.PI, ae: 0, rev: true }
			] },
			{ c: _platec, b: 1, p: [
				{ x: -0.35, y: 0.15 },
				{ x: 0.35, y: 0.15 },
				{ x: 0.25, y: 0.8 },
				{ x: -0.25, y: 0.8 }
			] },
			{ c: _platec, b: 1, p: [
				{ x: 0.38, y: 0 },
				{ form: 'arc', x: 0, y: 0, r: 0.38, as: 0, ae: Math.PI, rev: true },
				{ x: 0, y: 0.3 }
			] }
		],
		link: [ {
				x: 0,
				y: 0,
				rot: -0.25,
				size: _pbs * 0.18,
				name: 'arm_lk',
				path: [
					{ c: _chainc, p: [ 
						{ x: 0.2, y: 0 },
						{ form: 'arc', x: 0, y: 0, r: 0.2, as: 0, ae: Math.PI, rev: true },
						{ x: 0, y: 1 },
						{ x: 0.15, y: 1 }
					] },
					{ c: _platec, b: 1, p: [ // hand
						{ x: -0.1, y: 0.9 },
						{ x: 0.2, y: 0.9 },
						{ x: 0.25, y: 1.2 },
						{ x: 0.20, y: 1.3 },
						{ x: -0.05, y: 1.3 },
						{ x: -0.1, y: 1.2 }
					] },
					{ c: _platec, b: 1, p: [ // vanbrace
						{ x: -0.22, y: 0.15 },
						{ x: 0, y: -0.1 },
						{ x: 0.22, y: 0.15 },
						{ x: 0.22, y: 0.9 },
						{ x: 0.12, y: 1.1 },
						{ x: -0.12, y: 0.9 }
					] }
				],
				link: [ {
					x: 0,
					y: _pbs * 0.03,
					rot: -Math.PI * 0.5,
					size: _pbs * 0.45,
					name: 'weapon',
					under: true,
					path: [ // weapon path y must be 1 at max for hit calculations
						{ c: _platec, b: 1, p: [ // blade
							{ x: 0.05, y: 0 },
							{ x: -0.05, y: 0 },
							{ x: -0.05, y: 0.85 },
							{ x: 0, y: 1 },
							{ x: 0.05, y: 0.85 }
						] },
						{ c: _goldc, b: 1, p: [ // hilt
							{ x: 0.07, y: 0.1 },
							{ x: -0.07, y: 0.1 },
							{ x: -0.14, y: 0.17 },
							{ x: 0.14, y: 0.17 }
						] }
					]
				} ]
			}
		]
	}

	_cSkel.link.push(_farm);

	// other leg
	var _bleg = _13Skeleton.Clone(_cSkel.link[1])
	_bleg.rot = -_bleg.rot;
	_bleg.under = true;
	_bleg.z = 4;
	_bleg.link[0].z = 4;

	_cSkel.link.splice(0, 0, _bleg);

	// other arm
	var _barm = _13Skeleton.Clone(_farm)
	_barm.link[0].rot = Math.PI - 0.15;
	_barm.under = true;
	_barm.link[0].z = 4;
	_barm.link[0].link[0].z = 4;
	_barm.link[0].link[0].link[0].z = 4;

	_cSkel.link.splice(0, 0, _barm);

	var _cshield =  {
		x: _pbs * 0.15,
		y: _pbs * 0,
		rot: Math.PI * 0.5,
		size: _pbs * 0.3,
		name: 'shield',
		path: [
			{ c: _platec, b: 1, p: [ // base
				{ x: 0.4, y: 0 },
				{ form: 'bez', x1: 0.4, y1: 0.6, x2: 0.5, y2: 1, x: 0, y: 1.4 },
				{ form: 'bez', x1: -0.5, y1: 1, x2: -0.4, y2: 0.6, x: -0.4, y: 0 }
			] },
			{ c: _goldc, b: 1, p: [ // cross
				{ x: 0, y: 0.1 },
				{ x: 0.05, y: 0.45 },
				{ x: 0.35, y: 0.5 },
				{ x: 0.05, y: 0.55 },
				{ x: 0, y: 1.3 },
				{ x: -0.05, y: 0.55 },
				{ x: -0.35, y: 0.5 },
				{ x: -0.05, y: 0.45 }
			] }
		]
	};

	var _cshield2 = _13Skeleton.Clone(_cshield);
	_cshield2.name = 'shieldside';
	_cshield2.alpha = 0;
	_cshield2.path = [{ c: _platec, b: 1, p: [ // sideways
		{ x: -0.1, y: 0 },
		{ x: 0.2, y: 0 },
		{ x: 0.2, y: 1.4 },
		{ x: -0.1, y: 1.4 }
	] }];

	_farm.link[0].link[0].link = [_cshield, _cshield2];

	var _skelObj = {
		skel: _cSkel,
		w: _fw,
		h: _fh,
		anim: {
			'stand': {
				dur: 1000,
				loop: true,
				trans: function (_frSkel, _ap) {
					var _crot = Math.sin(Math.PI * 2 * _ap) * 0.01;
					var _cbob = _crot * _pbs * 0.2;
					
					_frSkel.x += _cbob * 6;
					_frSkel.y -= _cbob;
					
					for(var j = 0; j < 2; j++)
					{
						var _ckn = _crot * 0.2;
						if(_ckn > 0) _ckn = _ckn * 15;
						
						_frSkel.bones.leg[j].rot += _crot;
						_frSkel.bones.leg_lk[j].rot  += _ckn;
						
						var _armr = ((j == 0) ? (2) : (4));
						
						_frSkel.bones.arm[j].rot -= _armr * _crot * 2;
						_frSkel.bones.arm_lk[j].rot -= _armr * _ckn * 2;
					}
					
					return _frSkel;
				}
			},
			'run': {
				dur: 1000,
				loop: true,
				trans: function (_frSkel, _ap, _ac) {
				
					var _crot = Math.sin(Math.PI * 2 * _ap); // legs & arms rotation
					var _crotk = Math.sin(-Math.PI * 0.5 + Math.PI * 2 * _ap); // knees rotation - 90 deg out of phase
					
					_crot *= _ac;
					_crotk *= _ac;
					
					var _cbob = Math.abs(_crot) * _pbs * 0.05;
					
					_frSkel.rot += Math.abs(_crot) * 0.2;
					
					_frSkel.x +=  _cbob;
					_frSkel.y +=  _cbob;
					
					for(var j = 0; j < 2; j++)
					{
						if(j == 1) { // the other leg/arm
							_crot = - _crot;
							_crotk = - _crotk;
						}
						
						_frSkel.bones.leg[j].rot = _crot;
						_frSkel.bones.leg_lk[j].rot = 0.5 + _crotk * ((_crotk > 0) ? (1.2) : (0.5));
						
						_frSkel.bones.arm[j].rot = Math.PI -_crot; // arm moves opposite to the leg
						_frSkel.bones.arm_lk[j].rot = -0.7;
					}
					
					return _frSkel;
				}
			},
			'jump': {
				dur: 1000,
				loop: 0.5,
				trans: function (_frSkel, _ap) {
					
					var _crot = Math.sin(Math.PI * 0.5 * Math.min(1, _ap * 2)) * 0.1;
		
					for(var j = 0; j < 2; j++)
					{ // first part (not looping)
						var _lrot = ((j == 0) ? _crot * 2 : -_crot * 10);
						
						var _ckn = _crot * 0.5;
						if(_ckn > 0) _ckn = _ckn * 15;
						
						_frSkel.bones.leg[j].rot += _lrot;
						_frSkel.bones.leg_lk[j].rot += _ckn;
						
						var _armr = ((j == 0) ? (1) : (1.5));
						
						_frSkel.bones.arm[j].rot -= _armr * _crot * 4;
						_frSkel.bones.arm_lk[j].rot -= _armr * _ckn;
					}
					
					if(_ap > 0.5)
					{ // second part (looping)
						var _crot = Math.sin(Math.PI * 2 * (_ap - 0.5) * 2) * 0.015;
						var _cbob = _crot * _pbs * 0.5;
						
						_frSkel.x -=  _cbob;
						
						for(var j = 0; j < 2; j++)
						{
							var _lrot = ((j == 0) ? _crot * 2 : -_crot * 5);
							
							var _ckn = _crot * 0.5;
							if(_ckn > 0) _ckn = _ckn * 15;
							
							_frSkel.bones.leg[j].rot += _lrot;
							_frSkel.bones.leg_lk[j].rot += _ckn;
							
							var _armr = ((j == 0) ? (-1) : (1));
							
							_frSkel.bones.arm[j].rot -= _armr * _crot * 4;
							_frSkel.bones.arm_lk[j].rot -= _armr * _ckn;
						}
					}
					
					return _frSkel;
				}
			},
			'attack': {
				dur: 600,
				loop: false,
				reset: true,
				layer: 1,
				chain: { split: [ 0.5, 0.5 ], trans: [ // everybody loves parallel arrays <3
					function (_frSkel, _ap, _ac) { // first part of attack is charging
						var _endpos = this[1](_13Skeleton.Clone(_frSkel), 0, _ac);
						_frSkel = _13Skeleton.Average(_frSkel, _endpos, 1 - _ap);
				
						return _frSkel;
					}, function (_frSkel, _ap, _ac) {
						var _crot = Math.sin(_ap * Math.PI * 0.5);
						
						for(var i = 0; i < 3; i++) _frSkel.bones.body[i].rot += Math.PI * 0.1 * _crot;
						
						_frSkel.bones.arm[1].rot = (1 + _crot * 0.15) * Math.PI;
						
						// middle thrust: -0.2 < _ac < 0.25 for angle
						var _cshrot = 4.6 - _crot * 3.5 + _ac * 3; // shoulder
						var _ckrot = _crot * 2 - 2; // arm
						var _cwrot = (_crot - 1) * 1.5; // weapon
						
						if(_ac == 1) // high swing
						{
							_cshrot = _crot * 0.6 + 0.5;
							_ckrot = _crot - 1;
							_cwrot = Math.PI * 0.3 * _ckrot;
						}
						/*else if(_ac == -1) // low swing, removed
						{
							_cshrot = 3.7 - _crot;
							_ckrot = -_crot;
							_cwrot = Math.PI * 0.15 * _ckrot;
						}*/
						
						_frSkel.bones.arm[0].rot = _cshrot * Math.PI * 0.3;
						
						_frSkel.bones.arm_lk[0].rot =  Math.PI * 0.3 * _ckrot;
						_frSkel.bones.weapon[0].rot = _cwrot;
					
						return _frSkel;
					}
				] }
			},
			'block': {
				dur: 250,
				loop: false,
				layer: 1,
				trans: function (_frSkel, _ap, _ac) {
					var _crot = Math.sin(_ap * Math.PI * 0.5);
					
					_ac *= (_ac < 0) ? (3) : (0.5);
					
					for(var i = 0; i < 3; i++) _frSkel.bones.body[i].rot += _ac * Math.PI * 0.03 * _crot;
					
					_frSkel.bones.arm[1].rot = 2.4 - 0.7 * _crot + _ac;
					_frSkel.bones.arm_lk[1].rot = - 0.1 * _crot;
					_frSkel.bones.arm_lk[1].scale = { y: 1 - 0.8 * _crot, x: 1 };
					
					if(_crot > 0.9) {
						_frSkel.bones.shield[0].alpha = 0;
						_frSkel.bones.shieldside[0].alpha = 1;
						_frSkel.bones.arm_lk[1].scale = { y: 0.3, x: 1 };
					}

					return _frSkel;
				}
			}
		}
	};
	 
	/************** 
	 * PLAYER END *
	 **************/
	 
	// PLAYER REVERSE
	
	var _skelRev = _13Skeleton.Clone(_cSkel);

	_13Skeleton.AllBones(_skelRev, function (tb) {
	 	
	 	_13Each(tb.path, function(_cp) {
			switch(_cp.c) {
				case _platec:
				{
					_cp.c = '#222233';
				}
				break;
				case _goldc:
				case 'black':
				{
					_cp.c = '#990000';
				}
				break;
				
			}
			
			if(_cp.b != null)
			{
				_cp.b = -_cp.b;
			}
		});
	});
	 
	var _skelObjRev = {
		skel: _skelRev,
		anim: _skelObj.anim,
		w: _fw,
		h: _fh,
		trail: '#770000'
	};
	 
	_13Skeleton.Init(_skelRev);
	
	_retObj.rev_player = _skelObjRev;
	 
	 // SKELETONS
	 for(var k = 0; k < 2; k++)
	 {
		var _skelSkel = _13Skeleton.Clone(_cSkel);
		
		_13Skeleton.AllBones(_skelSkel, function (tb) {
			if(tb.path != null) 
			{
				switch(tb.name)
				{
					case 'head':
					{
						tb.path[0].p = [
							{ x: 0.3, y: 0 },
							{ form: 'arc', x: 0, y: 0, r: 0.3, as: 0, ae: Math.PI * 0.8, rev: true  },
							{ x: 0.1, y: 0.25 },
							{ x: 0.2, y: 0.4 },
							{ x: 0.4, y: 0.4 }
						]
						
						tb.path[1].p = [ 
							{ x: 0.05, y: -0.07 },
							{ x: 0.25, y: -0.07 },
							{ x: 0.3, y: 0.04 }
						]
					}
					break;
					case 'body':
					{					
						tb.path[0].p = [
							{ x: 0.1, y: 1 },
							{ 'form': 'arc', x: 0.05, y: 0, r: 0.15, as: Math.PI * 0.4, ae: Math.PI * 2.2 },
							{ x: 0.2, y: 0.2 },
							{ x: 0.2, y: 1 }
						]
						
						tb.path[3].c = _chainc;
						tb.path[3].p = [
							{ x: -0.1, y: 0.9 },
							{ 'form': 'rect', x: -0.05, y: 1.2, w: 0.1, h: 0.3 }
						]
					}
					break;
					case 'arm':
					{
						if(k < 1) tb.path.splice(2, 1);

					} // break;
					case 'leg': 
					{
						if(k < 1) tb.path.splice(1, 1);
						
						tb.path[0].p = [
							{ x: -0.13, y: 0.5 },
							{ 'form': 'arc', x: 0, y: 0, r: 0.1, as: Math.PI * 0.8, ae: Math.PI * 2.2 },
							{ 'form': 'arc', x: 0, y: 1, r: 0.1, as: -Math.PI * 0.3, ae: -Math.PI * 0.7 }
						]
					}
					break;
					case 'leg_lk':
					case 'arm_lk':
					{
						tb.path[0].p = [
							{ x: -0.1, y: 0.5 },
							{ 'form': 'arc', x: 0, y: 0, r: 0.1, as: Math.PI * 0.6, ae: Math.PI * 2.4 },
							{ 'form': 'arc', x: 0, y: 1, r: 0.1, as: -Math.PI * 0.4, ae: -Math.PI * 0.6 }
						]
					}
					break;
					case 'shield':
					{
						if(k < 1)
						{
							tb.path = [];
						}
						else{
							tb.path[0].p = [
								{ x: 0.6, y: 0.5 },
								{ 'form': 'arc', x: 0, y: 0.5, r: 0.6, as: 0, ae: Math.PI * 2 }
							]
							
							tb.path[1].p = [
								{ x: 0.5, y: 0.5 },
								{ 'form': 'arc', x: 0, y: 0.5, r: 0.5, as: 0, ae: Math.PI * 2 }
							]
						}
					}
					break;
					case 'shieldside':
					{
						tb.path[0].p = [
							{ x: -0.1, y: -0.1 },
							{ x: 0.2, y: -0.1 },
							{ x: 0.2, y: 1.1 },
							{ x: -0.1, y: 1.1 }
						]
					}
					break;
				}
					
				_13Each(tb.path, function(_cp) 
				{
					switch(_cp.c) {
						case _platec:
						{
							_cp.c = _ironc;
						}
						break;
						case _chainc:
						{
							_cp.c = _bonec;
							_cp.b = 1;
						}
						break;
						case _goldc:
						{
							_cp.c = _rustc;
						}
						break;	 				
					}
				})
			}
		 });
		
		var _skelObjSkel = {
			skel: _skelSkel,
			anim: _skelObj.anim,
			w: _fw,
			h: _fh
		};
		
		_13Skeleton.Init(_skelSkel);
		
		_retObj['enemy_skel_' + k] = _skelObjSkel;
	}
	
	// player initialized at the end (the other clone the skeleton)
	_13Skeleton.Init(_cSkel);
	
	_retObj.player = _skelObj;
	
	/******************* 
	 * LANDSCAPE START *
	 *******************/
	 
	var _fw = 1920; // anim width
	var _fh = 1080; // anim height
	 
	var _canvas = _13Canv(_fw, _fh);
	
	_ctx = _canvas.getContext('2d');
	
	_ctx.fillStyle = '#020408'; // sky - night
	
	_ctx.fillRect(0, 0, _fw, _fh);
		
	_ctx.fillStyle = 'white'; // sky - night: stars

	_13Rep(50, function() {
		_ctx.beginPath();
		_ctx.arc(Math.random() * _fw, Math.random() * _fh, Math.random() * _fh * 0.003, 0, Math.PI * 2);
		_ctx.fill();
		_ctx.closePath();
	});
	
	var _hillsrnd = [];
	for(var i = 0; i < 1; i+=0.5)
	{
		_hillsrnd.push({
			x: -0.3 + i, y: 1,
			x1: 0.1 + i + 0.2 * Math.random(), y1: 0.2 + 0.3 * Math.random(),
			x2: 0.1 + i + 0.2 * Math.random(), y2: 0.2 + 0.3 * Math.random(),
			x3: 0.8 + i, y3: 1
		})
	}
	
	var _hillsc = ['#04091a', '#050b21'];

	for(var j = 0; j < 2; j++)
	{
		_ctx.beginPath();
		
		_ctx.fillStyle = _hillsc[j];
		
		var _crnd = _hillsrnd[j];
		
		_ctx.moveTo(_crnd.x * _fw, _crnd.y * _fh);
		_ctx.bezierCurveTo(_crnd.x1 * _fw, _crnd.y1 * _fh, _crnd.x2 * _fw, _crnd.y2 * _fh, _crnd.x3 * _fw, _crnd.y3 * _fh);
		
		_ctx.closePath();
		_ctx.fill();
	}
	
	_retObj.landscape = _canvas;
	
	/*****************
	 * LANDSCAPE END *
	 *****************/
	 
	// BONE PILES
	 
	var _bls = 400;
	
	for(var i = 0; i < 2; i++)
	{
		var _canvas = _13Canv(_bls, _bls);
		
		var _ctx = _canvas.getContext('2d');
		
		var _blist = [];
		
		for(var j = 0; j < 2; j++)
		{
			_13Skeleton.AllBones(_retObj['enemy_skel_' + j].skel, function(tb) {
				if(tb.texture != null && tb.alpha != 0)
				{
					_blist.push(tb.texture);
				}
			});
		}
		
		_ctx.translate(_bls * 0.5, _bls * 0.07);
		
		for(var j = 0; j < 13; j++)
		{
			for(var k = -j * 1.5; k < j * 1.5; k++)
			{
				var _cbt = _13Random.pick(_blist);
				_ctx.save();
				_ctx.translate(k * 10, j * 25);
				_ctx.rotate(Math.PI * 2 * Math.random());
				_ctx.drawImage(_cbt, - _cbt.width / 2, - _cbt.height / 2);
				_ctx.restore();
			}
		}
		
		_retObj['bone_pile_' + i] = _canvas;
	}
	
	return _retObj;
}

function _13SoundGen() {	
	var _retObj = {};
	
	for(var _i in SBData)
	{
		var _player = new CPlayer();
		var _song = SBData[_i]
		_player.init(_song);
		while(_player.generate() < 1) {};
	
		_retObj[_i] = new Audio(URL.createObjectURL(new Blob([_player.createWave()], {type: "audio/wav"})));
		if(_i == 'music') _retObj[_i].loop = true
	}
	
	return _retObj;
}


var SBData = {
	'music': {
      songData: [
        { // Instrument 0
          i: [
          3, // OSC1_WAVEFORM
          192, // OSC1_VOL
          116, // OSC1_SEMI
          0, // OSC1_XENV
          3, // OSC2_WAVEFORM
          192, // OSC2_VOL
          128, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          7, // ENV_ATTACK
          12, // ENV_SUSTAIN
          22, // ENV_RELEASE
          0, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          2, // FX_FILTER
          255, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          61, // FX_PAN_AMT
          3, // FX_PAN_FREQ
          29, // FX_DELAY_AMT
          4 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1,2,1,2,,,,,1,2,1,2],
          // Columns
          c: [
            {n: [147,150,154,147,150,154,147,150,154,147,150,154,142,145,147,154,142,145,149,142,145,149,142,145,149,142,145,149,137,140,142,149,135,,,,147,,,,135,,,,147,,,,130,,,,142,,,,130,,,,142],
             f: []},
            {n: [145,149,152,145,149,152,145,149,152,145,149,152,140,142,145,152,140,144,147,140,144,147,140,144,147,140,144,147,135,140,144,147,133,,,,145,,,,133,,,,145,,,,128,,,,140,,,,128,,,,140],
             f: []}
          ]
        },
        { // Instrument 1
          i: [
          2, // OSC1_WAVEFORM
          128, // OSC1_VOL
          116, // OSC1_SEMI
          0, // OSC1_XENV
          2, // OSC2_WAVEFORM
          127, // OSC2_VOL
          116, // OSC2_SEMI
          15, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          83, // ENV_ATTACK
          35, // ENV_SUSTAIN
          129, // ENV_RELEASE
          3, // LFO_WAVEFORM
          130, // LFO_AMT
          4, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          40, // FX_FREQ
          167, // FX_RESONANCE
          2, // FX_DIST
          32, // FX_DRIVE
          89, // FX_PAN_AMT
          5, // FX_PAN_FREQ
          91, // FX_DELAY_AMT
          7 // FX_DELAY_TIME
          ],
          // Patterns
          p: [,,1,2,1,2,1,2,,,1,2,1,2,3],
          // Columns
          c: [
            {n: [135,,,,,,,,,,,,,,,,130,,,,,,,,,,,,,,,,123,,,,,,,,,,,,,,,,,118],
             f: []},
            {n: [133,,,,,,,,,,,,,,,,128,,,,,,,,,,,,,,,,121,,,,,,,,,,,,,,,,,116],
             f: []},
            {n: [135,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,123],
             f: []}
          ]
        },
        { // Instrument 2
          i: [
          2, // OSC1_WAVEFORM
          96, // OSC1_VOL
          116, // OSC1_SEMI
          0, // OSC1_XENV
          2, // OSC2_WAVEFORM
          96, // OSC2_VOL
          116, // OSC2_SEMI
          13, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          97, // ENV_ATTACK
          50, // ENV_SUSTAIN
          124, // ENV_RELEASE
          1, // LFO_WAVEFORM
          138, // LFO_AMT
          7, // LFO_FREQ
          1, // LFO_FX_FREQ
          3, // FX_FILTER
          37, // FX_FREQ
          84, // FX_RESONANCE
          2, // FX_DIST
          32, // FX_DRIVE
          135, // FX_PAN_AMT
          4, // FX_PAN_FREQ
          92, // FX_DELAY_AMT
          3 // FX_DELAY_TIME
          ],
          // Patterns
          p: [,,1,2,1,2,1,2,,,1,2,1,2,3],
          // Columns
          c: [
            {n: [154,,,,,,,,,,,,,,,,154,,,,,,,,,,,,,,,,159,,,,,,,,,,,,,,,,157,,,,,,,,,,,,,,,,162,,,,,,,,,,,,,,,,161],
             f: []},
            {n: [152,,,,,,,,,,,,,,,,152,,,,,,,,,,,,,,,,157,,,,,,,,,,,,,,,,156,,,,,,,,,,,,,,,,161,,,,,,,,,,,,,,,,159],
             f: []},
            {n: [154,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,159,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,162],
             f: []}
          ]
        },
        { // Instrument 3
          i: [
          3, // OSC1_WAVEFORM
          250, // OSC1_VOL
          140, // OSC1_SEMI
          0, // OSC1_XENV
          3, // OSC2_WAVEFORM
          55, // OSC2_VOL
          128, // OSC2_SEMI
          3, // OSC2_DETUNE
          0, // OSC2_XENV
          17, // NOISE_VOL
          3, // ENV_ATTACK
          16, // ENV_SUSTAIN
          41, // ENV_RELEASE
          0, // LFO_WAVEFORM
          83, // LFO_AMT
          4, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          242, // FX_FREQ
          164, // FX_RESONANCE
          1, // FX_DIST
          69, // FX_DRIVE
          77, // FX_PAN_AMT
          6, // FX_PAN_FREQ
          25, // FX_DELAY_AMT
          6 // FX_DELAY_TIME
          ],
          // Patterns
          p: [,,,,1,2,1,2,,,1,2,1,2],
          // Columns
          c: [
            {n: [123,,,,130,,,126,,126,125,,123,,126,,118,,,,125,,,121,,121,120,,118,,121],
             f: []},
            {n: [121,,,,128,,,125,,125,123,,121,,125,,116,,,,123,,,120,,120,118,,116,,120],
             f: []}
          ]
        },
        { // Instrument 4
          i: [
          0, // OSC1_WAVEFORM
          255, // OSC1_VOL
          116, // OSC1_SEMI
          1, // OSC1_XENV
          0, // OSC2_WAVEFORM
          255, // OSC2_VOL
          116, // OSC2_SEMI
          0, // OSC2_DETUNE
          1, // OSC2_XENV
          0, // NOISE_VOL
          4, // ENV_ATTACK
          6, // ENV_SUSTAIN
          35, // ENV_RELEASE
          0, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          2, // FX_FILTER
          14, // FX_FREQ
          1, // FX_RESONANCE
          1, // FX_DIST
          32, // FX_DRIVE
          0, // FX_PAN_AMT
          0, // FX_PAN_FREQ
          0, // FX_DELAY_AMT
          0 // FX_DELAY_TIME
          ],
          // Patterns
          p: [,,,,1,1,1,1,,2,1,1,1,1],
          // Columns
          c: [
            {n: [147,,,,147,,,147,,,147,,147,,,,147,,,,147,,,147,,,147,,147,,,147],
             f: []},
            {n: [,,,,,,,,,,,,,,,,,,,,,,,,147,,,,147,,147,147],
             f: []}
          ]
        },
        { // Instrument 5
          i: [
          0, // OSC1_WAVEFORM
          0, // OSC1_VOL
          128, // OSC1_SEMI
          0, // OSC1_XENV
          0, // OSC2_WAVEFORM
          0, // OSC2_VOL
          128, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          60, // NOISE_VOL
          4, // ENV_ATTACK
          10, // ENV_SUSTAIN
          34, // ENV_RELEASE
          0, // LFO_WAVEFORM
          187, // LFO_AMT
          5, // LFO_FREQ
          0, // LFO_FX_FREQ
          1, // FX_FILTER
          239, // FX_FREQ
          135, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          108, // FX_PAN_AMT
          5, // FX_PAN_FREQ
          16, // FX_DELAY_AMT
          4 // FX_DELAY_TIME
          ],
          // Patterns
          p: [,,,,1,1,1,1,1,1,1,1,1,1],
          // Columns
          c: [
            {n: [,147,147,,,147,147,,,147,147,,,147,147,147,,147,147,,,147,147,,,147,147,,,147,147,147],
             f: []}
          ]
        },
        { // Instrument 6
          i: [
          2, // OSC1_WAVEFORM
          128, // OSC1_VOL
          116, // OSC1_SEMI
          0, // OSC1_XENV
          2, // OSC2_WAVEFORM
          128, // OSC2_VOL
          128, // OSC2_SEMI
          15, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          7, // ENV_ATTACK
          14, // ENV_SUSTAIN
          39, // ENV_RELEASE
          0, // LFO_WAVEFORM
          97, // LFO_AMT
          4, // LFO_FREQ
          1, // LFO_FX_FREQ
          3, // FX_FILTER
          49, // FX_FREQ
          154, // FX_RESONANCE
          0, // FX_DIST
          109, // FX_DRIVE
          107, // FX_PAN_AMT
          4, // FX_PAN_FREQ
          79, // FX_DELAY_AMT
          4 // FX_DELAY_TIME
          ],
          // Patterns
          p: [,,,,,,1,2,1,2,,,1,2],
          // Columns
          c: [
            {n: [147,150,154,147,150,154,147,150,154,147,150,154,142,145,147,154,142,145,149,142,145,149,142,145,149,142,145,149,137,140,142,149,135,,,,147,,,,135,,,,147,,,,130,,,,142,,,,130,,,,142],
             f: []},
            {n: [145,149,152,145,149,152,145,149,152,145,149,152,140,142,145,152,140,144,147,140,144,147,140,144,147,140,144,147,135,140,144,147,133,,,,145,,,,133,,,,145,,,,128,,,,140,,,,128,,,,140],
             f: []}
          ]
        },
        { // Instrument 7
          i: [
          0, // OSC1_WAVEFORM
          192, // OSC1_VOL
          116, // OSC1_SEMI
          0, // OSC1_XENV
          0, // OSC2_WAVEFORM
          192, // OSC2_VOL
          116, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          7, // ENV_ATTACK
          22, // ENV_SUSTAIN
          71, // ENV_RELEASE
          0, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          2, // FX_FILTER
          255, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          0, // FX_PAN_AMT
          0, // FX_PAN_FREQ
          0, // FX_DELAY_AMT
          0 // FX_DELAY_TIME
          ],
          // Patterns
          p: [],
          // Columns
          c: [
          ]
        }
      ],
      rowLen: 6014,   // In sample lengths
      patternLen: 32,  // Rows per pattern
      endPattern: 16  // End pattern
    }
}
