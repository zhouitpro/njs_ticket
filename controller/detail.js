exports.list = function(app) {
    app.db.query("SELECT * FROM `tickets` WHERE tid=14", function (error, results, fields) {
        var md = require('markdown-it')();
        var res = results[0];
        res.description = md.render(res.description);
        app.view(res);
    });
};
