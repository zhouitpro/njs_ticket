exports.addto = function(app) {
    var post = app.pre._POST;

    app.db.conn().query('INSERT INTO `tickets` (`tid`, `time`, `type`, `status`, `priority`, `description`) VALUES (NULL, NOW(), ?, ?, ?, ?)', [
        post.type,
        'open',
        post.priority,
        post.body
    ], (error, results, fields) => {
        console.log(error);
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
        app.db.query(q, (error, results, fields) => app.res.end('success'));
    }
};

/**
 * Upload files.
 *
 * @bind /upload_file
 * @param app
 */
exports.uploadfile = function(app) {
    var formidable = require('formidable');
    var fs = require('fs');
    var res = app.res;
    var req = app.req;

    var form = new formidable.IncomingForm();
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = global.__basedir + '/theme/assets/uploads';

    var fullname = '';

    form.on('file', (field, file) => {
        var fname = file.name.split('.');
        var newname = Math.floor(Date.now() / 1000) + '.' + fname[fname.length-1];
        fullname = 'http://' + req.headers.host + '/assets/uploads/' + newname;
        fs.rename(file.path, form.uploadDir + '/' + newname);
    });

    // log any errors that occur
    form.on('error', (err) => {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', () => {
        res.end(fullname);
    });

    // parse the incoming request containing the form data
    form.parse(req);
};
