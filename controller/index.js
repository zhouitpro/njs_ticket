exports.front = function(app) {
    app.db.query("SELECT * FROM `tickets` Limit 0,10;", function (error, results, fields) {
        for(var i=0; i<results.length; ++i) {
            var md = require('markdown-it')();
            results[i].description = md.render(results[i].description);
        }
        app.view(results);
    });
};
