exports.addto = function(app) {
    var post = app.pre._POST;
    app.db.query("INSERT INTO `content` (`tid`, `type`, `content`) VALUES (NULL, 'task', '" + post.body + "');", function (error, results, fields) {
        // app.res.end('Success');
        app.res.setHeader('Location', '/');
        // console.dir('test');
        //
        // app.res.redirect('/');
    });
};
