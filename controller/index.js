var dateFormat = require('dateformat');

exports.front = function(app) {
    let q = "SELECT * FROM `tickets` ORDER BY " +
        "FIELD(status, 'inprogress', 'open', 'close') ASC," +
        "FIELD(priority, 'immediately', 'high', 'medium') ASC," +
        "FIELD(type, 'task', 'tmp', 'feature') ASC, time ASC Limit 0,100";

    app.db.query(q, (error, results) => {
        for (var i=0;i<results.length; ++i) {
            results[i].time = dateFormat(new Date(results[i].time), "yyyy-mm-dd h:mm:ss")
        }
        app.view(results);
    });
};
