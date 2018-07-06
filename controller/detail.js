var dateFormat = require('dateformat');
var url = require('url');

exports.list = function(app) {
    if (app.pre._POST.tid) {
        let post = app.pre._POST;

        app.db.conn().query('INSERT INTO comments (`cid`, `time`, `tid`, `description`) VALUES (NULL, NOW(), ?, ?)', [
            post.tid,
            post.body
        ], function() {
            app.res.writeHead(302, {
                'Location': '/detail/' + post.tid
            });
            app.res.end();
        });
    }

    var id = url.parse(app.req.url).pathname.split('/')[2];
    app.db.query("SELECT * FROM `tickets` WHERE tid=" + id, function (error, results, fields) {
        var res = results[0];

        app.db.query("SELECT * FROM `comments` WHERE tid=" + id + " ORDER BY time DESC", function (error, results, fields) {
            for (var i=0;i<results.length; ++i) {
                results[i].time = dateFormat(new Date(results[i].time), "yyyy-mm-dd h:mm:ss")
            }
            res.comments = results;
            app.view(res);
        });
    });
};
