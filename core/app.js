var http = require('http');
var url = require('url');

exports.ejs = require('ejs');
exports.db = require(global.__basedir + '/core/includes/database');
exports.initreq = require(global.__basedir + '/core/includes/initreq');
exports.config = require(global.__basedir + '/config/config.js');

/**
 * get controller.
 *
 * @param req
 * @param pre
 * @param cb
 *
 * @returns {*|boolean}
 */
exports.initRouter = function(req) {
    var self = this;
    self.routerConfig = require(global.__basedir + '/config/router.js');

    var pathname = url.parse(req.url).pathname,
        routers = self.routerConfig.routers();

    self.controller = routers[pathname] || false;

    if (!self.controller) {
       self.view();
    }

    var basename = self.controller.split('.')[0];
    var func = self.controller.split('.')[1];

    // set template.
    self.template = './theme/templates/' + basename + '.html';

    // run controller.
    var c = require(global.__basedir + '/controller/'+basename);
    c[func](self);
};

/**
 * View.
 *
 * @param data
 */
exports.view = function(data) {
    var data = data || {},
        self = this;

    if(!self.controller) {
        self.res.writeHead(404, 'page not found.');
        self.res.end('404 Page Not Found.');
    }

    self.ejs.renderFile(self.template, {'results': data}, {}, function (err, str) {
        self.res.end(str);
    });
};

exports.createServer = function() {
    var self = this;
    return http.createServer(function (req, res) {
        self.req = req;
        self.res = res;
        self.pre = {};
        self.initreq.initREQUEST(req, self.pre, function() {
            self.initRouter(req);
        });
    });
};
