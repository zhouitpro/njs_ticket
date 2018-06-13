exports.addto = function(app) {
    var post = app.pre._POST;
    var q = "INSERT INTO `tickets` (`tid`, `type`, `status`, `priority`, `description`, `time`) VALUES (NULL, '"+post.type+"', 'open', '"+post.priority+"', '" + post.body + "', NOW())";
    app.db.query(q, function (error, results, fields) {
        // app.res.end('Success');
        app.res.writeHead(302, {
            'Location': '/'
        });
        app.res.end();
    });
};

exports.changestatus = function(app) {
    var post = app.pre._POST;
    if (post.tid) {
        let tid = post.tid;
        let status = post.status;
        var q = "UPDATE `tickets` SET `status` = '"+status+"' WHERE `tickets`.`tid` = '"+tid+"';";
        app.db.query(q, function (error, results, fields) {
            // app.res.end('Success');
            app.res.end('success');
        });
    }
};
