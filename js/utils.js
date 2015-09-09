var PI = Math.PI;
var PI2 = PI * 2;

function _13Rep(repnum, onrep) {
	for(var i = 0; i < repnum; i++)
	{
		if(onrep(i)) break;
	}
}

function _13Each(arr, oneach)
{
	if(arr != null)
	{
		for(var i = 0; i < arr.length; i++)
		{
			if(oneach(arr[i], i)) break;
		}
	}
}

function _13ObjClone (cobj, deep)
{
	if(cobj.length != null) {
		var _retVal = [];

		for(var i = 0; i < cobj.length; i++) {
			if(deep && typeof cobj[i] == 'object')
			{
				_retVal[i] = _13Obj.clone(cobj[i], deep);
			}
			else _retVal[i] = cobj[i];
		}
	}
	else {
		var _retVal = {};

		for(var i in cobj) {
			if(deep && cobj[i] != null && typeof cobj[i] == 'object')
			{
				_retVal[i] = _13ObjClone(cobj[i], deep);
			}
			else _retVal[i] = cobj[i];
		}
	}
	
	return _retVal;
}

function _13ObjExtend(bobj, eobj)
{
	if(eobj != null) for(var i in eobj) bobj[i] = eobj[i];
	return bobj;
}


function _13RectInters(r1, r2) {
	return !(r2.left > r1.right || 
		   r2.right < r1.left || 
		   r2.top > r1.bottom ||
		   r2.bottom < r1.top);
}

function _13Dist(p1, p2) {
	return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}
function _13Ang(p1, p2) {
	return Math.atan2(p1[1] - p2[1], p1[0] - p2[0]);
}

var _13Sin = Math.sin;
var _13Cos = Math.cos;
var _13Min = Math.min;
var _13Max = Math.max;

var _13Rand = Math.random;

function _13RandBetween(minV, maxV) {
	return minV + _13Rand() * (maxV - minV);
}

function _13RandPick(listV) {
	return listV[Math.floor(_13Rand() * listV.length)];
}

function _13Canv(w, h) {
	var _canvas = document.createElement('canvas');
	_canvas.width = w;
	_canvas.height = h;
	return _canvas;
}

function _13Path(_ctx, _cPath, size)
{
	if(size == null) size = 1;
	if(_ctx.getContext != null) _ctx = _ctx.getContext('2d');
	
	_ctx.save();
	_ctx.beginPath();

	if(typeof _cPath.c == 'object') {
		_cPath.c = _ctx.createPattern(_cPath.c, 'repeat');
	}
	
	_ctx.fillStyle = _cPath.c;
	_ctx.strokeStyle = _cPath.c;
	
	_13Each(_cPath.p, function(_ca, _ci) {
		_ca = _13ObjClone(_ca);
		var _cform = null;
		
		if(typeof _ca[0] == 'string') {
			_cform = _ca[0];
			_ca.splice(0, 1);
		}
		
		var _prm = [];

		_13Each(_ca, function(_p, _pi) 
		{
			if(_cform != 'arc' || _pi < 3)
			{
				_p *= size;
			}
			
			_prm.push(_p);
		});
		
		switch(_cform)
		{
			case 'arc': _ctx.arc(_prm[0], _prm[1], _prm[2], _prm[3] || 0, _prm[4] || PI2, _prm[5]); break;
			case 'rect': _ctx.rect(_prm[0], _prm[1], _prm[2], _prm[3]); break;
			case 'bez': _ctx.bezierCurveTo(_prm[0], _prm[1], _prm[2], _prm[3], _prm[4], _prm[5]); break;
			default: 
				if(_ci == 0) _ctx.moveTo(_prm[0], _prm[1]); 
				else _ctx.lineTo(_prm[0], _prm[1]); 
				break;
		}
	});
	
	_ctx.closePath();
	if(_cPath.l != null) {
		_ctx.lineWidth = _cPath.l;
		_ctx.stroke();
	}
	else _ctx.fill();
	
	if(_cPath.b != null)
	{
		var _bcol = _cPath.b * 127;
		_ctx.strokeStyle = 'rgba(' + _bcol + ',' + _bcol + ',' + _bcol + ',0.5)';
		_ctx.lineWidth = 1;
		_ctx.stroke();
	}
	
	_ctx.restore();
}

function _13Gradient(rad, cola, colb, basea, ppow, offset) {
	if(colb == null) colb = cola;
	
	var _rad2 = rad * 2;
	var _canvas = _13Canv(_rad2, _rad2);
			
	var _baseColA = [];
	var _baseColB = [];
			
	for(var j = 0; j < 6; j += 2)
	{
		_baseColA.push(parseInt(cola.substr(1 + j, 2), 16));
		_baseColB.push(parseInt(colb.substr(1 + j, 2), 16));
	}
	
	var _ctx = _canvas.getContext('2d');
	var _imgData = _ctx.createImageData(_rad2, _rad2);

	_13Rep(_rad2, function (j) {
		_13Rep(_rad2, function (k) {
			var _bi = (j + k * _rad2) * 4;
			
			var _cDist = _13Max(0, _13Dist([j, k], [rad, rad]) - offset);
			
			var _cDistPerc = Math.pow(1 - _13Min(1, _cDist / (rad - offset)), ppow);
			
			_13Rep(3, function (l) {
				_imgData.data[_bi + l] = _baseColA[l] * _cDistPerc + _baseColB[l] * (1 - _cDistPerc);
			});
			
			_imgData.data[_bi + 3] = basea * _cDistPerc;
		});
	});
	
	_ctx.putImageData(_imgData, 0, 0);
	
	return _canvas;
}