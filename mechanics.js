// Populate a list with keys
function getList(obj) {
    var list = []
    for (item in obj) {
        if (obj.hasOwnProperty(item)) {
            list.push(obj[item])
        }
    }
    return list;
}


module.exports = {
    isGameOver: function(players, timeElapsed) {
        // The no. of players in a team.
        var playerteams = {
            red: 0,
            blue: 0
        }
        // Loop through all non-eliminated players.
        getList(players).forEach(function(player) {
            if (!player.eliminated) {
                playerteams[player.colour]++
            }
        }, this);
        // If all red players are eliminated.
        if (playerteams.red == 0) {
            return true;
        } else if (playerteams.blue == 0) {
            return true;
        } else {
            return false;
        }
    },
    getWinner: function(players) {
        // Does pretty much the same thing.
        var playerteams = {
            red: 0,
            blue: 0
        }
        getList(players).forEach(function(player) {
            if (!player.eliminated) {
                playerteams[player.colour]++
            }
        }, this);
        if (playerteams.red == 0) {
            return "blue";
        } else if (playerteams.blue == 0) {
            return "red";
        } else {
            return false;
        }
    },
    isPlayerEliminated: function(player){
        // Player is eliminated if tagged 3 times.
        if(player.hits >= 3) {
            return true;
        } else {
            return false;
        }
    }
}