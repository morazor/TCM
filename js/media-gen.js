var _13MediaTextures = {};
var _13MediaLights = {};
var _13MediaSounds = {};

function _13MediaGen() {
	var _lights = {
		player: { c: '#ffff77', r: 350 },
		enemy_wotw_0: { c: '#64a0ff', r: 250 },
		enemy_wotw_1: { c: '#e164ff', r: 250 },
		rev_player: { c: '#ff0000', r: 350 }
	}
	
	for(var _i in _lights)
	{
		_lights['bullet_' + _i] = {
			c: _lights[_i].c,
			r: _lights[_i].r * 0.6
		}
	}
	
	_lights.rev_bullet_player = _lights.bullet_rev_player;
	_lights.sparks = { c: 'yellow', r: 30 }
	
	_13MediaTextures = _13TextureGen();
	_13MediaLights = _lights;
	_13MediaSounds =_13SoundGen();
}

function _13TextureGen() {
	var _retObj =  {};
	
	/*** COLORS AND PATTERNS ***/
	
	var _pw = 4; // pattern size

	var _chainc = _13Canv(_pw, _pw);

	_13Path(_chainc, { c: '#444444', p: [ [ 'rect', 0, 0, _pw, _pw ] ]});
	_13Path(_chainc, { c: '#aaaadd', l: 1, p: [ [ 'arc', _pw / 2, _pw / 2, _pw / 2 - 1 / 2, 0, Math.PI * 2 ] ]});

	var _platec = '#f5f5ff';
	var _goldc = '#ffdd77';
	var _ironc = '#c0c0c0'; 
	var _bonec = '#ffffee'; 
	var _rustc = '#dd9977';
	
	// MIRROR
	var _bls = 250;
	
	var _canvas = _13Canv(_bls, _bls);
	
	var _ctx = _canvas.getContext('2d');
	
	_ctx.translate(_bls / 2, _bls / 2);
	_ctx.scale(0.7, 1);
	
	_13Path(_ctx, { c: 'rgba(127,127,127,0.25)', p: [
		[ 'arc', 0, 0, _bls / 2 - 15, 0, Math.PI * 2 ]
	]});
	
	_13Path(_ctx, { c: '#777777', p: [
		[ _bls / 2, 0],
		[ 'arc', 0, 0, _bls / 2 - 1, 0, Math.PI * 2 ],
		[ 'arc', 0, 0, _bls / 2 - 15, 0, Math.PI * 2, true ]
	]});
	
	_ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	_13Rep(3, function(i) { // BROKEN MIRROR
		_ctx.save();
		_ctx.rotate(Math.random() / 2 + Math.PI * 1.5 * i); // Math.PI * 2 / 3
		
		var _mstep = -_bls / 2 + 15;
		
		_ctx.translate(0, -_mstep);
		
		_13Path(_ctx, { l: 1, p: [
			[ 0, 0 ],
			[ 0, _mstep ]
		]});
		
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

	_13Path(_ctx, { c: '#333333', p: [
		[ _bls / 2, 0 ],
		[ 'arc', 0, 0, _bls / 2 - 15, 0, Math.PI * 2 ]
	]});
	
	_retObj.mirror_inner = _canvas;
	
	// BLOOD PLAYER
	
	var _bls = 25;
	
	var _canvas = _13Canv(_bls, _bls);
	
	var _ctx = _canvas.getContext('2d');
	
	_ctx.translate(0, _bls / 2);

	_13Path(_ctx, { c: '#ee0000', b: 1, p: [
		[ 0, 0 ],
		[ 'arc', _bls * 0.7, 0, _bls * 0.3 - 1, -1.4, 1.4 ]
	]});

	_retObj.blood_player = _canvas;
	_retObj.blood_rev_player = _canvas;
	
	// BLOOD SKELETONS
	
	var _bls = 25;
	
	var _canvas = _13Canv(_bls, _bls);
	
	var _ctx = _canvas.getContext('2d');
	_ctx.translate(_bls / 2, 0);

	_13Path(_ctx, { c: _bonec, b: 1, p: [
		[ 1, 1 ],
		[ - _bls / 3 + 1, _bls - 1 ],
		[ _bls / 3 - 1, _bls - 1 ]
	]})

	_retObj.blood_enemy_skel_0 = _canvas;
	_retObj.blood_enemy_skel_1 = _canvas;
	
	// SPARK
	var _canvas = _13Canv(4, 4);
	
	_13Path(_canvas, { c: 'yellow', b: 1, p: [
		[ 'arc', 2, 2, 2, 0, Math.PI * 2 ]
	]});
	
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
	
	_13Path(_canvas, { c: '#261f1f', p: [
		[ 0, 300 ],
		[ 'arc', 25, 25, 25, Math.PI, Math.PI * 1.5 ],
		[ 'arc', 275, 25, 25, Math.PI * 1.5, Math.PI * 2 ],
		[ 300, 300 ]
	]});

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
					[ 0.25, 1 ],
					[ 'arc', 0, 1, 0.25, 0, Math.PI ],
					[ 'arc', 0, 0, 0.2, Math.PI, 0 ]
				] },
				{ c: _platec, b: 1, p: [ // chest - back
					[ 0.25, 1 ],
					[ 'arc', 0, 1, 0.25, 0, Math.PI * 0.5 ],
					[ 0, 1 ],
					[ 0.1, 1 ],
					[ -0.05, 0.45 ],
					[ 0.25, 0.45 ]
				] },
				{ c: _platec, b: 1, p: [ // chest - front
					[ 0, 1.25 ],
					[ 'arc', 0, 1, 0.25, Math.PI * 0.5, Math.PI * 0.9 ],
					[ -0.3, 0.9 ],
					[ -0.3, 0.6 ],
					[ -0.2, 0.15 ],
					[ -0.1, 0.25 ],
					[ 0, 0.4 ],
					[ 0.1, 0.45 ],
					[ 0.1, 0.5 ],
					[ 0, 0.55 ],
					[ -0.1, 1 ],
					[ 0, 1 ]
				] },
				{ c: _platec, b: 1, p: [ // neck
					[ -0.15, 1.2 ],
					[ -0.15, 1.5 ],
					[ 0.07, 1.5 ],
					[ 0.1, 1.2 ]
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
						[ 0.3, 0 ],
						[ 'arc', 0, 0, 0.3, 0, Math.PI, true  ],
						[ -0.3, 0.3 ],
						[ 0.4, 0.35 ]
					] },
					{ c: 'black', p: [ // eye 
						[ 0.1, -0.04 ],
						[ 0.25, -0.04 ],
						[ 0.3, 0.02 ],
						[ 0.1, 0.02 ]
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
					[ 0.35, 0 ],
					[ 'arc', 0, 0, 0.35, -Math.PI * 0.8, Math.PI * 0.8, true ],
					[ 'arc', 0, 1, 0.2, Math.PI, 0, true ]
				] },
				{ c: _platec, b: 1, p: [
					[ -0.05, 0.1 ],
					[ 0.38, -0.1 ],
					[ 0.38, 0.15 ],
					[ 0.25, 1 ],
					[ -0.05, 0.8 ]
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
							[ 0.2, 0 ],
							[ 'arc', 0, 0, 0.2, 0, Math.PI, true ],
							[ 0, 1 ],
							[ 0.15, 1 ]
						] },
						{ c: _platec, b: 1, p: [ // calf
							[ -0.05, 0 ],
							[ 0.15, -0.1 ],
							[ 0.3, -0.3 ],
							[ 0.2, 1 ],
							[ 0.1, 1 ]
						] },
						{ c: _platec, b: 1, p: [ // feet
							[ 0.2, 0.9 ],
							[ -0.05, 1 ],
							[ -0.05, 1.15 ],
							[ 0.65, 1.15 ],
							[ 0.65, 1.1 ]
						] }
					]
				}
			]
		}]
	}

	// FAKE BODY avoids layers handling
	var _farm = _13Skel.Clone(_cSkel.link[0]);
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
				[ 0.35, 0 ],
				[ 'arc', 0, 0, 0.35, 0, Math.PI, true ],
				[ 'arc', 0, 1, 0.2, Math.PI, 0, true ]
			] },
			{ c: _platec, b: 1, p: [
				[ -0.35, 0.15 ],
				[ 0.35, 0.15 ],
				[ 0.25, 0.8 ],
				[ -0.25, 0.8 ]
			] },
			{ c: _platec, b: 1, p: [
				[ 0.38, 0 ],
				[ 'arc', 0, 0, 0.38, 0, Math.PI, true ],
				[ 0, 0.3 ]
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
						[ 0.2, 0 ],
						[ 'arc', 0, 0, 0.2, 0, Math.PI, true ],
						[ 0, 1 ],
						[ 0.15, 1 ]
					] },
					{ c: _platec, b: 1, p: [ // hand
						[ -0.1, 0.9 ],
						[ 0.2, 0.9 ],
						[ 0.25, 1.2 ],
						[ 0.20, 1.3 ],
						[ -0.05, 1.3 ],
						[ -0.1, 1.2 ]
					] },
					{ c: _platec, b: 1, p: [ // vanbrace
						[ -0.22, 0.15 ],
						[ 0, -0.1 ],
						[ 0.22, 0.15 ],
						[ 0.22, 0.9 ],
						[ 0.12, 1.1 ],
						[ -0.12, 0.9 ]
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
							[ 0.05, 0 ],
							[ -0.05, 0 ],
							[ -0.05, 0.85 ],
							[ 0, 1 ],
							[ 0.05, 0.85 ]
						] },
						{ c: _goldc, b: 1, p: [ // hilt
							[ 0.07, 0.1 ],
							[ -0.07, 0.1 ],
							[ -0.14, 0.17 ],
							[ 0.14, 0.17 ]
						] }
					]
				} ]
			}
		]
	}

	_cSkel.link.push(_farm);

	// other leg
	var _bleg = _13Skel.Clone(_cSkel.link[1])
	_bleg.rot = -_bleg.rot;
	_bleg.under = true;
	_bleg.z = 4;
	_bleg.link[0].z = 4;

	_cSkel.link.splice(0, 0, _bleg);

	// other arm
	var _barm = _13Skel.Clone(_farm)
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
				[ 0.4, 0 ],
				[ 'bez', 0.4, 0.6, 0.5, 1, 0, 1.4 ],
				[ 'bez', -0.5, 1, -0.4, 0.6, -0.4, 0 ]
			] },
			{ c: _goldc, b: 1, p: [ // cross
				[ 0, 0.1 ],
				[ 0.05, 0.45 ],
				[ 0.35, 0.5 ],
				[ 0.05, 0.55 ],
				[ 0, 1.3 ],
				[ -0.05, 0.55 ],
				[ -0.35, 0.5 ],
				[ -0.05, 0.45 ]
			] }
		]
	};

	var _cshield2 = _13Skel.Clone(_cshield);
	_cshield2.name = 'shieldside';
	_cshield2.alpha = 0;
	_cshield2.path = [{ c: _platec, b: 1, p: [ // sideways
		[ -0.1, 0 ],
		[ 0.2, 0 ],
		[ 0.2, 1.4 ],
		[ -0.1, 1.4 ]
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
				dur: 800,
				loop: true,
				trans: function (_frSkel, _ap, _ac) {
				
					var _crot = Math.sin(Math.PI * 2 * _ap); // legs & arms rotation
					var _crotk = Math.sin(-Math.PI * 0.5 + Math.PI * 2 * _ap); // knees rotation - 90 deg out of phase
					
					_crot *= _ac;
					_crotk *= _ac;
					
					var _cbob = Math.abs(_crot) * _pbs * 0.04;
					
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
						var _endpos = this[1](_13Skel.Clone(_frSkel), 0, _ac);
						_frSkel = _13Skel.Average(_frSkel, _endpos, 1 - _ap);
				
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
	
	var _skelRev = _13Skel.Clone(_cSkel);

	_13Skel.AllBones(_skelRev, function (tb) {
	 	
	 	_13Each(tb.path, function(_cp) {
			switch(_cp.c) {
				case _platec:
				{
					_cp.c = 'black';
				}
				break;
				case _goldc:
				case 'black':
				{
					_cp.c = '#990000';
				}
				break;
				
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
	 
	_13Skel.Init(_skelRev);
	
	_retObj.rev_player = _skelObjRev;
	 
	 // SKELETONS
	 for(var k = 0; k < 2; k++)
	 {
		var _skelSkel = _13Skel.Clone(_cSkel);

		_13Skel.AllBones(_skelSkel, function (tb) {
			if(tb.path != null) 
			{
				switch(tb.name)
				{
					case 'head':
					{
						tb.path[0].p = [
							[ 0.3, 0 ],
							[ 'arc', 0, 0, 0.3, 0, Math.PI * 0.8, true  ],
							[ 0.1, 0.25 ],
							[ 0.2, 0.4 ],
							[ 0.4, 0.4 ]
						]
						
						tb.path[1].p = [ 
							[ 0.05, -0.07 ],
							[ 0.25, -0.07 ],
							[ 0.3, 0.04 ]
						]
					}
					break;
					case 'body':
					{					
						tb.path[0].p = [
							[ 0.1, 1 ],
							[ 'arc', 0.05, 0, 0.15, Math.PI * 0.4, Math.PI * 2.2 ],
							[ 0.2, 0.2 ],
							[ 0.2, 1 ]
						]
						
						tb.path[3].c = _chainc;
						tb.path[3].p = [
							[ -0.1, 0.9 ],
							[ 'rect', -0.05, 1.2, 0.1, 0.3 ]
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
							[ -0.13, 0.5 ],
							[ 'arc', 0, 0, 0.1, Math.PI * 0.8, Math.PI * 2.2 ],
							[ 'arc', 0, 1, 0.1, -Math.PI * 0.3, -Math.PI * 0.7 ]
						]
					}
					break;
					case 'leg_lk':
					case 'arm_lk':
					{
						tb.path[0].p = [
							[ -0.1, 0.5 ],
							[ 'arc', 0, 0, 0.1, Math.PI * 0.6, Math.PI * 2.4 ],
							[ 'arc', 0, 1, 0.1, -Math.PI * 0.4, -Math.PI * 0.6 ]
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
								[ 0.6, 0.5 ],
								[ 'arc', 0, 0.5, 0.6, 0, Math.PI * 2 ]
							]
							
							tb.path[1].p = [
								[ 0.5, 0.5 ],
								[ 'arc', 0, 0.5, 0.5, 0, Math.PI * 2 ]
							]
						}
					}
					break;
					case 'shieldside':
					{
						tb.path[0].p = [
							[ -0.1, -0.1 ],
							[ 0.2, -0.1 ],
							[ 0.2, 1.1 ],
							[ -0.1, 1.1 ]
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
		
		_13Skel.Init(_skelSkel);
		
		_retObj['enemy_skel_' + k] = _skelObjSkel;
	}
	
	// player initialized at the end (the other clone the skeleton)
	_13Skel.Init(_cSkel);
	
	_retObj.player = _skelObj;
	
	/******************* 
	 * LANDSCAPE START *
	 *******************/
	 
	var _fw = 1920; // anim width
	var _fh = 1080; // anim height
	 
	var _canvas = _13Canv(_fw, _fh);
	
	_13Path(_canvas, { c: '#020408', p: [
		[ 'rect', 0, 0, _fw, _fh ]
	]});

	_13Rep(50, function() {
		_13Path(_canvas, { c: 'white', p: [
			[ 'arc', Math.random() * _fw, Math.random() * _fh, Math.random() * _fh * 0.003, 0, Math.PI * 2 ]
		]});
	});
	
	var _hillsc = ['#050b21', '#04091a'];

	for(var j = 0; j < 2; j++)
	{
		var i = j / 2;

		_13Path(_canvas, { c: _hillsc[j], p: [
			[ 0.3 - i, 0.6 ],
			[
				'bez',
				0.8 - i, 0.1 + 0.3 * i,
				0.8 - i, 0.1 + 0.3 * i,
				1.3 - i, 0.6
			]
		]}, _fw);
	}
	
	_retObj.landscape = _canvas;
	
	/*****************
	 * LANDSCAPE END *
	 *****************/
	 
	// BONE PILES
	 
	var _bls = 450;
	
	for(var i = 0; i < 2; i++)
	{
		var _canvas = _13Canv(_bls * 1.2, _bls);
		
		var _ctx = _canvas.getContext('2d');
		
		var _blist = [];
		
		for(var j = 0; j < 2; j++)
		{
			_13Skel.AllBones(_retObj['enemy_skel_' + j].skel, function(tb) {
				if(tb.texture != null && tb.alpha != 0)
				{
					_blist.push(tb.texture);
				}
			});
		}
		
		_ctx.translate(_bls * 0.6, _bls * 0.07);
		
		for(var j = 0; j < 14; j++)
		{
			for(var k = -j * 1.5; k < j * 1.5; k++)
			{
				var _cbt = _13RandPick(_blist);
				_ctx.save();
				_ctx.translate(k * 10, j * 25);
				_ctx.rotate(Math.PI * 2 * Math.random());
				_ctx.drawImage(_cbt, - _cbt.width / 2, - _cbt.height / 2);
				_ctx.restore();
			}
		}
		
		_retObj['bone_pile_' + i] = _canvas;
	}
	
	// TREES
	
	var _bls = 400;
		
	function _treebr(_ctx, j)
	{
		_ctx.save();
		_ctx.rotate(_13RandBetween(-0.1, 0.1));
		_ctx.beginPath();
		_ctx.arc(0, 0, 2 * j, 0, Math.PI);
		_ctx.translate(0, - 10 - _13RandBetween(15, 25) * j);
		_ctx.lineTo(- 2 * (j - 1), 0);
		_ctx.lineTo(2 * (j - 1), 0);
		_ctx.closePath();
		_ctx.fill();
		
		if(j > 1) {
			var _spn = (Math.random() < j * 0.18 ? 2 : 1)
			_ctx.rotate(0.5 * (_spn - 1));
			for(var i = 0; i < _spn; i++)
			{
				_ctx.rotate(_13RandBetween(-0.3, 0.3) - i); 
				_treebr(_ctx, j - 1);
			}
		}
		
		_ctx.restore();
	}
	
	for(var i = 0; i < 7; i++) {
		var _canvas = _13Canv(_bls, _bls);
		
		var _ctx = _canvas.getContext('2d');
		
		_ctx.translate(_bls / 2, _bls);
		_ctx.fillStyle = '#443322';
		_treebr(_ctx, 5);
		
		_retObj['tree_' + i] = _canvas;
	}
	
	// GRAVES
	
	var _bls = 100;
	
	for(var i = 0; i < 7; i++) {
		var _canvas = _13Canv(_bls, _bls);
		
		var _ctx = _canvas.getContext('2d');
		
		_ctx.translate(_bls / 2, _bls);

		_ctx.rotate(_13RandBetween(-0.2, 0.2));
		
		_13Path(_ctx, { c: '#444444', p: [
			[ -25, 25 ],
			[ 25, 25 ],
			[ 'arc', 0, -40, 25, 0, Math.PI, true ]
		]});
		
		_ctx.fillStyle = 'rgba(0,0,0,0.5)';
		
		for(var j = 0; j < 3; j++)
		{
			_ctx.translate(0, -10);
			if(Math.random() > 0.4) {
				var _splt = _13RandPick([1,2,3]);
				var _sx = -18;
				
				for(var k = 0; k < _splt; k++)
				{
					if(k >= _splt - 1) var _cspl = 18 - _sx;
					else var _cspl = 36 / _splt * _13RandBetween(0.7, 1);
					_ctx.fillRect(_sx, 0, _cspl, 2);
					_sx += _cspl + 4;
				}
			}
		}
		
		_ctx.translate(0, -20);
		
		if(i % 2 == 0)
		{
			_ctx.globalCompositeOperation = 'destination-out';
			_ctx.fillStyle = 'black';
			_ctx.beginPath();
			_ctx.moveTo(-25, 0);
			var _splt = _13RandPick([2,3]);
			for(var j = 0; j < _splt;j++)
			{
				_ctx.lineTo((j + 1) * 50 / _splt - 25, _13RandBetween(-20, 20))
			}
			_ctx.lineTo(35, -50);
			_ctx.lineTo(-35, -50);
			_ctx.closePath();
			_ctx.fill();
		}
		else {
			_ctx.fillRect(-5, 0, 10, 2);
			_ctx.fillRect(-1, -5, 2, 15);
		}

		_retObj['grave_' + i] = _canvas;
	}
	
	return _retObj;
}
	
function _13SoundGen() {	
	var _retObj = {};
	
	for(var i in SBData)
	{
		var _player = new CPlayer();
		var _song = SBData[i]
		
		for(var j = _song.songData.length; j < 8; j++)
		{
			_song.songData.push(_song.songData[0]);
		}
		
		_player.init(_song);
		while(_player.generate() < 1) {};
		
		var _src = URL.createObjectURL(new Blob([_player.createWave()], {type: "audio/wav"}));
	
		var _audioarr = [];
		
		_13Rep(10, function () {
			_audioarr.push(new Audio(_src));
		})
		
		_retObj[i] = {
			arr: _audioarr,
			ind: 0,
			play: function() {
				this.arr[this.ind].play();
				this.ind = (this.ind + 1) % 10;
			}
		}
	}
	
	return _retObj;
}


var SBData = {
	'swing': {
      songData: [
        { // Instrument 0
          i: [
		  0, // OSC1_WAVEFORM
          0, // OSC1_VOL
          92, // OSC1_SEMI
          0, // OSC1_XENV
          0, // OSC2_WAVEFORM
          0, // OSC2_VOL
          92, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          140, // NOISE_VOL
          28, // ENV_ATTACK
          0, // ENV_SUSTAIN
          39, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          24, // FX_FREQ
          157, // FX_RESONANCE
          0, // FX_DIST
          255 // FX_DRIVE
          //0, // FX_PAN_AMT
          //0, // FX_PAN_FREQ
          //0, // FX_DELAY_AMT
          //0 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1],
          // Columns
          c: [
            {n: [147],
             f: []}
          ]
        }
      ],
      rowLen: 5513,   // In sample lengths
      patternLen: 3,  // Rows per pattern
      endPattern: 2  // End pattern
    },
	'hit': {
	  songData: [
        { // Instrument 0
          i: [
          0, // OSC1_WAVEFORM
          50, // OSC1_VOL
          92, // OSC1_SEMI
          0, // OSC1_XENV
          0, // OSC2_WAVEFORM
          0, // OSC2_VOL
          92, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          255, // NOISE_VOL
          0, // ENV_ATTACK
          17, // ENV_SUSTAIN
          44, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          2, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          2, // FX_FILTER
          18, // FX_FREQ
          100, // FX_RESONANCE
          0, // FX_DIST
          255 // FX_DRIVE
          //0, // FX_PAN_AMT
          //0, // FX_PAN_FREQ
          //0, // FX_DELAY_AMT
          //0 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1],
          // Columns
          c: [
            {n: [99],
             f: []}
          ]
        }
      ],
      rowLen: 5513,   // In sample lengths
      patternLen: 3,  // Rows per pattern
      endPattern: 2  // End pattern
    },
	'block': {
	  songData: [
        { // Instrument 0
          i: [
		  3, // OSC1_WAVEFORM
          30, // OSC1_VOL
          128, // OSC1_SEMI
          0, // OSC1_XENV
          3, // OSC2_WAVEFORM
          30, // OSC2_VOL
          89, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          120, // NOISE_VOL
          0, // ENV_ATTACK
          5, // ENV_SUSTAIN
          47, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          0, // FX_FILTER
          25, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          255 // FX_DRIVE
          //0, // FX_PAN_AMT
          //0, // FX_PAN_FREQ
          //0, // FX_DELAY_AMT
          //0 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1],
          // Columns
          c: [
            {n: [180],
             f: []}
          ]
        }
      ],
      rowLen: 5513,   // In sample lengths
      patternLen: 6,  // Rows per pattern
      endPattern: 5  // End pattern
    },
	'shoot': {
	  songData: [
        { // Instrument 0
          i: [
          0, // OSC1_WAVEFORM
          0, // OSC1_VOL
          92, // OSC1_SEMI
          0, // OSC1_XENV
          0, // OSC2_WAVEFORM
          0, // OSC2_VOL
          92, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          255, // NOISE_VOL
          0, // ENV_ATTACK
          0, // ENV_SUSTAIN
          61, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          131, // LFO_AMT
          10, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          24, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          194 // FX_DRIVE
          //0, // FX_PAN_AMT
          //0, // FX_PAN_FREQ
          //0, // FX_DELAY_AMT
          //0 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1],
          // Columns
          c: [
            {n: [206],
             f: []}
          ]
        }
      ],
      rowLen: 5513,   // In sample lengths
      patternLen: 3,  // Rows per pattern
      endPattern: 2  // End pattern
    },
	'miss': {
	  songData: [
        { // Instrument 0
          i: [
		  0, // OSC1_WAVEFORM
          0, // OSC1_VOL
          128, // OSC1_SEMI
          0, // OSC1_XENV
          0, // OSC2_WAVEFORM
          0, // OSC2_VOL
          119, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          150, // NOISE_VOL
          20, // ENV_ATTACK
          0, // ENV_SUSTAIN
          64, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          2, // FX_FILTER
          39, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          39 // FX_DRIVE
          //0, // FX_PAN_AMT
          //0, // FX_PAN_FREQ
          //0, // FX_DELAY_AMT
          //0 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1],
          // Columns
          c: [
            {n: [123],
             f: []}
          ]
        }
      ],
      rowLen: 5513,   // In sample lengths
      patternLen: 3,  // Rows per pattern
      endPattern: 2  // End pattern
    },
	'rev': {
	  songData: [
        { // Instrument 0
          i: [
		  0, // OSC1_WAVEFORM
          150, // OSC1_VOL
          97, // OSC1_SEMI
          0, // OSC1_XENV
          0, // OSC2_WAVEFORM
          150, // OSC2_VOL
          118, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          0, // ENV_ATTACK
          0, // ENV_SUSTAIN
          90, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          1, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          2, // FX_FILTER
          50, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          255 // FX_DRIVE
          //0, // FX_PAN_AMT
          //0, // FX_PAN_FREQ
          //0, // FX_DELAY_AMT
          //0 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1],
          // Columns
          c: [
            {n: [120],
             f: []}
          ]
        }
      ],
      rowLen: 5513,   // In sample lengths
      patternLen: 6,  // Rows per pattern
      endPattern: 5  // End pattern
    }
}

