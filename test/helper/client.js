var swarmdbAPI = require('../../index');

var Client = swarmdbAPI.createConnection({
    host: "localhost", 
    port: 2001
}); 

module.exports = Client;