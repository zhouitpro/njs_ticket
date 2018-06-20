var mysql = require('mysql');
var config = require(global.__basedir + '/config/config');

exports.conn = function() {
    var connection = mysql.createConnection(config.get().db);
    connection.connect( (err) => {
        if (err) throw err;
    });
    return connection;
};

exports.query = (query, cb) => {
    this.conn().query(query, function(error, results, fields) {
        if (error) {
            if (error) throw error;
            console.log("Result: " + results);
        }
        cb(error, results, fields);
    });
};
