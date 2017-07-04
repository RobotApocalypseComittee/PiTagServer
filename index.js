const WebSocket = require("ws");
const PiBlaster = require("pi-blaster.js");
const path = require("path");

// Things to calculate game state.
const gameMechanics = require("./mechanics.js");

// The server to control from browser.
const webInterface = require("./webinterface.js");


// Initialises WebSocket Server
wss = new WebSocket.Server({
    port: 8080
});

// RGB led pins(not working yet)
var pins = {
    red: 17,
    green: 18,
    blue: 22
}

// A utility function to loop through JS object
function loopme(obj, callback) {
    for (thing in obj) {
        if (obj.hasOwnProperty(thing)) {
            callback(thing)
        }
    }
}

// The data for the game.
var data = {
    players: {

    },
    game: "running"
}

// A list of sockets connected.
var socketlist = {

}

// The colour of each team.
const teamColours = {
    "blue": [0, 0, 255],
    "red": [255, 0, 0]
}
// Converts colour string to colour value.
function convertColourString(colourString) {
    return teamColours[colourString];
}

// Sets the RGB led colour(not working)
function setRGBLed(colourString) {
    var [red, green, blue] = convertColourString(colourString)
    // Set RGB led to specified colour.
    PiBlaster.setPwm(pins.red, red / 255)
    PiBlaster.setPwm(pins.green, green / 255)
    PiBlaster.setPwm(pins.blue, blue / 255)
}

// Broadcasts to all sockets connected.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

// Initiatlised web interface.
var app = webInterface(function () {
    // Reset Function
    data.players = {}
    data.game = "running";
    wss.clients.forEach(function (client) {
        client.close()
    })
    console.log("[Server] Resetting");
}, () => {
    // Gets data
    return data;
})

// Set up LED
PiBlaster.setPwm(pins.red, 1)
PiBlaster.setPwm(pins.green, 1)
PiBlaster.setPwm(pins.blue, 1)

// Initialise server
app.listen(3000, function () {
    console.log('Control app listening on port 3000!')
})

// When someone connects
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
                // If they are on different teams... and the scorer is not eliminated.
                if ((data.players[scored].colour != data.players[scorer].colour) && !(data.players[scorer].eliminated)) {
                    // Add a point to scorer
                    data.players[scorer].points++;
                    data.players[scored].hits++;

                    // Checks if player is eliminated.
                    if (gameMechanics.isPlayerEliminated(data.players[scored])) {
                        data.players[scored].eliminated = true;
                        var client = socketlist[scored]
                        if (client.readyState === WebSocket.OPEN) {
                            client.send("eliminated");
                        }

                    }
                    // Checks if game is over.
                    if (gameMechanics.isGameOver(data.players, 0)) {
                        wss.broadcast("gameover");
                        console.log("[Server] Game Over")
                        data.game = "over"; // Fix me
                        setRGBLed(gameMechanics.getWinner(data.players))
                    }
                    console.log("[Player] " + scorer + " tagged " + scored)
                }

                break;
            case "addplayer":
                // The system is submitting its ID.
                var id = dat.split(",")[0];
                var teamcolour = dat.split(",")[1];
                // Add the player to the list.
                data.players[id] = { colour: teamcolour, id: id, hits: 0, points: 0, eliminated: false }
                socketlist[id] = ws
                console.log("[Player] Added " + id)
                break;
            default:
                break;
        }
    })
})