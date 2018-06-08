var qs = require('querystring');

exports.initGET = function(req, pre, cb) {
    pre._GET = {};
    var urlparts = req.url.split('?');
    if (urlparts.length >= 2) {
        var query = urlparts[urlparts.length-1].split('&');
        for(var p=0;p<query.length; ++p) {
            var pair = query[p].split('=');
            pre._GET[pair[0]] = pair[1];
        }
    }
    cb();
};

exports.initPOST = function(req, pre, cb) {
    pre._POST = {};
    var body = '';
    req.on('data', function(dataBuffer) {
        body += dataBuffer;
        if(body.length > 1e6) {
            req.writeHead(413, {'Content-Type': 'text/plain'}).end();
            req.connection.destroy();
        }
    });
    req.on('end', function () {
        pre._POST = qs.parse(body);
        cb();
    });
};

exports.initCOOKIE = function(req, pre, cb) {
    pre._COOKIE = {};
    if (req.headers.cookie) {
        var cookie = req.headers.cookie.split('&');
        for(var p=0;p<cookie.length; ++p) {
            var pair = cookie[p].split('=');
            pre._COOKIE[pair[0]] = pair[1];
        }
    }
    cb();
};

exports.initSESSION = function(req, pre, cb) {
    var sessions = {};
    if((typeof pre._COOKIE['NODESESSID']) == 'undefined') {
        var pool = '0123456789abcdefghijklmnopqrstuvwxyzQWERTYUIOPADSFGHJKLZXVBNM';
        var newid = '';
        for(var i=0; i<26; ++i) {
            var r=Math.floor(Math.random() * pool.length);
            newid += pool.charAt(r);
        }
        pre._COOKIE['NODESESSID'] = newid;
        sessions[pre._COOKIE['NODESESSID']] = {};
    }
    var id = pre._COOKIE['NODESESSID'];
    if((typeof sessions[id]) == 'undefined') {
        sessions[id] = {};
    }
    pre._SESSION = sessions[id];
    cb();
};

// Init get,post,cookie,session.
exports.initREQUEST = function(req, pre, cb) {
    var self = this;
    self.initGET(req, pre, function () {
        self.initPOST(req, pre, function () {
            self.initCOOKIE(req, pre, function () {
                self.initSESSION(req, pre, function () {
                    cb();
                });
            });
        });
    });
};
