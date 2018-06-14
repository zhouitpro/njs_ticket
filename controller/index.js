exports.front = function(app) {
    let q = "SELECT * FROM `tickets` ORDER BY " +
        "FIELD(status, 'inprogress', 'open', 'close') ASC," +
        "FIELD(priority, 'immediately', 'high', 'medium') ASC," +
        "FIELD(type, 'task', 'tmp', 'feature') ASC, time DESC Limit 0,100";
    app.db.query(q, function (error, results, fields) {
        app.view(results);
    });
};
