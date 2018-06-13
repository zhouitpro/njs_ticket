exports.front = function(app) {
    let q = "SELECT * FROM `tickets` ORDER BY " +
        "FIELD(status, 'inprogress', 'open', 'close') ASC," +
        "FIELD(priority, 'immediately', 'high', 'medium') ASC," +
        "FIELD(type, 'task', 'tmp', 'feature') ASC, time DESC Limit 0,100";
    app.db.query(q, function (error, results, fields) {
        for(var i=0; i<results.length; ++i) {
            var md = require('markdown-it')();
            results[i].description = md.render(results[i].description);
        }
        app.view(results);
    });
};
