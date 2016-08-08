# elephant
A geolocation-based question-and-answer platform designed to combat trolling and promote the development of a laid back tight knit network which promotes the sharing of information amoung a community.

Presentation: https://docs.google.com/presentation/d/1282BPS6B9_xtl11t6Lepab4-5JBeDi7Jq2MPI-LF1yg/edit?usp=sharing


Visit: http://elephant.mywikis.net:8008


Created by Christian Duffee, Joshua Kim, Trevor Nguyen, Sammy Shin, and Jeffrey Wang. Logo by Justin Potts.

## Setup
### Prerequisites
* Latest versions of Node.js, Express, Socket.IO, and MySQL as of August 6, 2016 (2016-08-06).
### Installation
* If not already, install Node.js, and then use npm to install the rest (i.e. `npm install express`, etc.)
* Run `node server.js` to start it up. It should start on port 80. If not, change the const on the first few lines of `server.js`.

## Usage
You can try using the Node service called Forever (install via `npm install forever`) then run this Node program using `forever start server.js` when in the directory `server` of elephant. This will continue running this Node program in the background.
