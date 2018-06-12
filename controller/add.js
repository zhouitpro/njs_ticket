exports.addto = function(app) {
    var post = app.pre._POST;
    var q = "INSERT INTO `tickets` (`tid`, `type`, `status`, `priority`, `description`) VALUES (NULL, '"+post.type+"', 'open', '"+post.priority+"', '" + post.body + "')";
    app.db.query(q, function (error, results, fields) {
        // app.res.end('Success');
        app.res.writeHead(302, {
            'Location': '/'
        });
        app.res.end();
    });
};
