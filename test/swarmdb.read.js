process.env.NODE_ENV = "test";

require("./swarmdb.write.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('read a row', function() {

    it('swarmdb.get', function (done) {
        swarmdb.get("bertie@gmail.com", function (err, result) {
            // result: {"data":[{"email":"bertie@gmail.com","name":"Bertie Basset","age":7}]}
            result = JSON.parse(result);
            assert(result.data[0].email === "bertie@gmail.com");
            assert(result.data[0].name === "Bertie Basset");
            assert(result.data[0].age === 7);
            done();
        });
    });

    
    it('swarmdb.select', function (done) {
        var query = "select email, age, name from contacts where email = 'paul@gmail.com'";
        swarmdb.query(query, function (err, result) {
            // result: {"data":[{"email":"paul@gmail.com","name":"Paul","age":8}]}
            result = JSON.parse(result);
            assert(result.data[0].email === "paul@gmail.com");
            assert(result.data[0].name === "Paul");
            assert(result.data[0].age === 8);
            done();
        });
    });
    
});