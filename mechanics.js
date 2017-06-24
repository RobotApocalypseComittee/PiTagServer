module.exports = {
    isGameOver: function(players, timeElapsed) {
        players.forEach(function(player) {
            if ((player.points - player.hits) > 3) {
                return true;
            }
        }, this);
        return false;
    },
    getWinner: function(players) {
        players.forEach(function(player) {
            if ((player.points - player.hits) > 3) {
                return player;
            }
        }, this);
        return false;
    }
}