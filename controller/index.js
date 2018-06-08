exports.front = function(app) {
    app.db.query("SELECT * FROM `content`;", function (error, results, fields) {
        app.view(results);
    });
};
