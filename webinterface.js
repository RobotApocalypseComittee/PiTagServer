module.exports = function (reset, get_data) {
  const express = require('express')
  const app = express()
  const path = require('path')

  // Resources such as css files.
  app.use(express.static(path.join(__dirname, 'public')))

  // Home route
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
  })

  // Called when user presses reset button.
  app.get("/reset", function(req, res) {
    reset()
    res.end()
  })

  // Called when user presses update button.
  app.get("/update", function(req, res){
    res.json(get_data());
  })

return app;


}