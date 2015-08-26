var _13Obj = {
	clone: function (cobj, deep)
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

			for(var _i in cobj) {
				if(deep && typeof cobj[_i] == 'object')
				{
					_retVal[_i] = _13Obj.clone(cobj[_i], deep);
				}
				else _retVal[_i] = cobj[_i];
			}
		}
		
		return _retVal;
	},
	extend: function (bobj, eobj)
	{
		if(eobj != null) for(var _i in eobj) bobj[_i] = eobj[_i];
		return bobj;
	}
};

var _13Geom = {
	inters: function(r1, r2) {
		return !(r2.left > r1.right || 
			   r2.right < r1.left || 
			   r2.top > r1.bottom ||
			   r2.bottom < r1.top);
	},
	dist: function(p1, p2) {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
	}
}

var _13Random = {
	between: function(minV, maxV) {
		return minV + Math.random() * (maxV - minV);
	},
	pick: function(listV) {
		return listV[Math.floor(Math.random() * listV.length)];
	}
};