# PiTagServer
A node.js? server for running the PiTag game.

### What is this?
This is a server, which should run on a raspberry pi, to drive the PiTag game, about which you can find out more on the main PiTag repo.

### Setting Up
In order to run this server, you will need to install node js on the Pi, and set up an access point.
#### Install Node
    $ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    $ sudo apt install nodejs
#### Set up access point
Follow the guide [here][access-point], but stop before you reach the step entitled _USING THE RASPBERRY PI AS AN ACCESS POINT TO SHARE AN INTERNET CONNECTION_

### Support/questions
 - To report what you **think** is a bug, please use github issue tracker.

### Acknowledgements/Credits
 - Developed by Joe Bell and Atto Allas
 - [ExpressJS](http://expressjs.com/)
 - [Websockets](https://github.com/websockets/ws)
 - [PiBlaster](https://github.com/sarfata/pi-blaster.js) (Not working)


[access-point]: https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md