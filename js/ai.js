function _13AI(mob, player, timePassed)
{
	if(mob != player && !mob.dead)
	{
		mob.lastai -= timePassed;
		
		var _act = mob.action;
		
		var _mpos = [];

		_13Rep(2, function(i) {
			_mpos[i] = player.pos[i] + player.vel[i] / 2;
			_act.watch[i] = player.pos[i] - mob.pos[i];
		});
		
		if(mob.lastai < 0)
		{
			var _pldist = Math.abs(_mpos[0] - mob.pos[0]);
				
			if(_pldist < 400) {
				// awaking mobs in a certain distance. happens only with the final boss
				mob.awake = true;
			}
			
			if(mob.type == 'ranged')
			{
				// RANGED AI

				if(mob.awake && !player.dead) {
					var _toofar = _pldist > 700;
					if(mob.didatk > 500 / mob.revmult || _toofar) // attack cooling down
					{
						if(_act.move == null || _toofar) _act.move = [ // moving at the back of the player
							_mpos[0] + (player.facing ? -1 : 1) * (375 + _13RandBetween(0, 100)), 
							player.lastgy + _13RandBetween(-275, -230)
						]
						_act.attack = false;
					}
					else 
					{
						_act.move = null;
						_act.attack = true;
					}
				}
				else {
					_act.move = null;
					_act.attack = false;
				}
			}
			else {
				// MELEE AI
				
				_13ObjExtend(_act, {
					move: 0,
					shield: false,
					attack: false,
					jump: false
				});

				if(mob.awake && !player.dead) {
					var _pldir = (_mpos[0] < mob.pos[0]) ? (-1) : (1);
			
					if(_pldist > 200) _act.move = _pldir;
					else if(_pldist < 150) _act.move = -_pldir;
					
					// big block chance if ahead

					if(_pldist < 350) {
						if(mob.canshield && player.facing != mob.facing) {  
							//if mob can use shield and player is facing mob
							var _basech = (mob.revmult > 1.1 ? 0.85 : 0.93) - mob.shnrg.c * 0.15;
							// base chance based on revmult and shield energy left
							if((player.isattack && mob.isshield) || // shield already up and player attacking
								(player.isattack && _13Rand() > _basech) || // extra chance if player is attacking
								(mob.isshield && _13Rand() > 0.4) || // extra change to keep shield up if already blocking
								_13Rand() > _basech) _act.shield = true; // chance to raise shield at any time
						}
						
						if(!_act.shield && _13Rand() > 0.7) _act.attack = true;
					}
					
					if(_act.move == -1 && mob.block.l || _act.move == 1 && mob.block.r) {
						_act.jump = true;
						_act.move = 0;
					}
				}
			}
			
			mob.lastai = 150 / mob.revmult;
		}
	}
}