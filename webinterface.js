module.exports = function (reset, get_data) {
  const express = require('express')
  const app = express()
  const path = require('path')


  app.use(express.static(path.join(__dirname, 'public')))

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
  })

  app.get("/reset", function(req, res) {
    reset()
    res.end()
  })

  app.get("/update", function(req, res){
    res.json(get_data());
  })

return app;


}