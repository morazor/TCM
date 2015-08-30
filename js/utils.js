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
	return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function _13RandBetween(minV, maxV) {
	return minV + Math.random() * (maxV - minV);
}

function _13RandPick(listV) {
	return listV[Math.floor(Math.random() * listV.length)];
}

function _13Canv(w, h) {
	var _canvas = document.createElement('canvas');
	_canvas.width = w;
	_canvas.height = h;
	return _canvas;
}