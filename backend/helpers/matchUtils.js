

function calculateMatchAverages(matches){

    var leftOverGold = 0;
    var dmgToPlayers = 0;
    var pLevel = 0;
    var placement = 0;
    var champList = {};
    var traitList = {};
    var augList = {};
    for(var i = 0; i < matches.length; i++){
        leftOverGold += matches[i].gold_left;
        dmgToPlayers += matches[i].total_damage_to_players;
        pLevel += matches[i].level;
        placement += matches[i].placement;


        // Want to process traits here
        for(var j = 0; j < matches[i].traits.length; j++){
            if(matches[i].traits[j].tier_current > 0){
                traitList[matches[i].traits[j].name] = (traitList[matches[i].traits[j].name] || 0) + 1;
            }
        }
        // Want to process units here
        for(var j = 0; j < matches[i].units.length; j++){
            champList[matches[i].units[j].character_id] = (champList[matches[i].units[j].character_id] || 0) + 1;
        }
        // Want to process augments here
        for(var j = 0; j < matches[i].augments.length; j++){
            // Change this line if they ever make augment string more than 3 fields separated by '_'
            let augment = matches[i].augments[j].split('_')[2].replace(/[0-9]/g, '');
            // augList[matches[i].augments[j]] = (augList[matches[i].augments[j]] || 0) + 1;
            augList[augment] = (augList[augment] || 0 ) + 1;
        }

        
    }
    var topChamp = [];
    var topTrait = [];
    var topAugment = [];

    topChamp = getTopCounts(champList);
    topTrait = getTopCounts(traitList);
    topAugment = getTopCounts(augList);

    return {
        "avgGold": leftOverGold/matches.length,
        "avgDmgToPlayers": dmgToPlayers/matches.length,
        "avgLevel": pLevel/matches.length,
        "avgPlacement": placement/matches.length,
        "traits": traitList,
        "champs" : champList,
        "augments" : augList,
        "topChamps" : topChamp,
        "topTrait" : topTrait,
        "topAugment" : topAugment
    }
}

function getTopCounts(list){

    var keys = Object.keys(list);
    keys.sort(function(a,b){
        return list[b] - list[a];
    })

    return keys.length >=3 ? keys.slice(0, 3) : keys;

}

module.exports.calculateMatchAverages = calculateMatchAverages