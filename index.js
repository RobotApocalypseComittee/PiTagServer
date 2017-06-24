const WebSocket = require("ws");
const PiBlaster = require("pi-blaster.js");
const path = require("path");

const gameMechanics = require("./mechanics.js");

const webInterface = require("./webinterface.js");


// Initialises WebSocket Server
wss = new WebSocket.Server({
    port: 8080
});

// The score required for someone to win.
var score_to_win;

var pins = {
    red: 17,
    green: 18,
    blue: 22
}


// The data for the game.
var data = {
    players: {

    },
    game: "running"
}

const teamColours = {
    "blue": [0, 0, 255],
    "red": [255, 0, 0]
}

function convertColourString(colourString) {
    return teamColours[colourString];
}

function setRGBLed(colourString) {
    red, green, blue = convertColourString(colourString)
    // Set RGB led to specified colour.
    PiBlaster.setPwm(pins.red, red / 255)
    PiBlaster.setPwm(pins.green, green / 255)
    PiBlaster.setPwm(pins.blue, blue / 255)
}
// A broadcast function.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

var app = webInterface(function () {
    data.players = {}
    data.game = "running";
    wss.clients.forEach(function (client) {
        client.close()
    })
    console.log("Resetting");
}, ()=>{
    return data;
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

wss.on("connection", function (ws) {
    ws.on("message", function (mydata) {
        // Recieves a message
        var x = mydata.split(":")
        // Event Name
        var evt = x[0];
        // Event data
        var dat = x[1];

        switch (evt) {
            case "pointscore":
                // A point has been scored.
                var scorer = dat.split(",")[0];
                var scored = dat.split(",")[1];

                data.players[scorer].points++;
                data.players[scorer].hits++;

                if (gameMechanics.isGameOver(data.players, 0)) {
                    wss.broadcast("gameover");
                    data.game = "over"; // Fix me
                    data.winner = gameMechanics.getWinner(players);

                    setRGBLed(data.winner.colour);
                }
                console.log("[Player] Tagged "+scored)
                break;
            case "addplayer":
                // The system is submitting its ID.
                var id = dat.split(",")[0];
                var teamcolour = dat.split(",")[1];
                data.players[id] = { sock: ws, colour: teamcolour, id: id, hits: 0, points: 0 }
                console.log("[Player] Added "+id)
                break;
            default:
                break;
        }
    })
})