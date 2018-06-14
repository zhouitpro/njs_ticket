var url = require('url');

exports.list = function(app) {
    if (app.pre._POST.tid) {
        let post = app.pre._POST;
        let q = "INSERT INTO `comments` (`cid`, `tid`, `description`, `time`) VALUES (NULL, '"+post.tid+"', '"+post.body+"', NOW())";
        app.db.query(q, function(error, results, fields) {
            if (error) {
               console.log(error);
            }
        });
    }

    var id = url.parse(app.req.url).pathname.split('/')[2];
    app.db.query("SELECT * FROM `tickets` WHERE tid=" + id, function (error, results, fields) {
        var md = require('markdown-it')();
        var res = results[0];
        res.description = md.render(res.description);

        app.db.query("SELECT * FROM `comments` WHERE tid=" + id + " ORDER BY time DESC", function (error, results, fields) {
            res.comments = results;
            app.view(res);
        });
    });
};
