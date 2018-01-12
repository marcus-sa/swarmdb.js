var swarmdbAPI = require('../../index');

var Client = swarmdbAPI.createConnection({
    host: "localhost", 
    port: 2000
}); 

module.exports = Client;