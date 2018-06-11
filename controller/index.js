exports.front = function(app) {
    app.db.query("SELECT * FROM `content` Limit 1,10;", function (error, results, fields) {
        app.view(results);
    });
};
