var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('mime-types');
var helper = require(global.__basedir + '/core/includes/helpers');

exports.ejs = require('ejs');
exports.db = require(global.__basedir + '/core/includes/database');
exports.initreq = require(global.__basedir + '/core/includes/initreq');
exports.config = require(global.__basedir + '/config/config.js');

function to404page() {

}

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

    let pathname = url.parse(req.url).pathname,
        res = self.res,
        routers = self.routerConfig.routers();

    // this is assets.
    if (pathname.split('/')[1] == 'assets' && pathname.split('/')[2]) {
        let assets_path = self.theme_path + pathname;
        if (fs.existsSync(assets_path)) {
            fs.readFile(assets_path, (err, data) => {

                if (err) {
                   throws(err);
                }

                // get mime type.
                let type = mime.lookup(assets_path);
                res.writeHead(200, {'Content-Type': type});
                res.write(data);
                res.end();
            });
        } else {
            res.writeHead(404, 'page not found.');
            res.end('404 Page Not Found.');
        }
        return;
    }

    let match_routers = [
        pathname,
        pathname + '/',
        pathname.replace(/(\/[0-9]+)(\/?)/, '/%$2')
    ];

    self.controller = false;

    for(let i=0; i<match_routers .length; ++i) {
        if((typeof routers[match_routers[i]]) !== undefined) {
            self.controller = routers[match_routers[i]];
        }
    }

    // 404 page.
    if (!self.controller) {
       return self.view();
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

    // init data.
    var results = {
        basedir: global.__basedir,
        baseurl: 'http://' + self.req.headers.host,
        fullpath: data.baseurl + url.parse(self.req.url).pathname,
        helper: helper.helper(self),
        data: data
    };

    // render templates.
    self.ejs.renderFile(self.template, results, {debug: false}, function (err, str) {
        if (err) {
            self.res.end(err.toString());
        } else {
            self.res.end(str);
        }
    });
};

/**
 * Create server and bind event.
 *
 * @returns {server.Server}
 */
exports.createServer = function() {
    var self = this;

    self.theme_path = global.__basedir + '/theme';
    return http.createServer(function (req, res) {
        self.req = req;
        self.res = res;
        self.pre = {};

        process.on('uncaughtException', err => {
            console.log('has error: ' + err.message);
            process.exit(1);
        });

        self.initreq.initREQUEST(req, self.pre, function() {
            try {
                self.initRouter(req);
            } catch (err) {
                console.log(err);
                res.writeHead(500, 'text/html');
                res.write('Server Error, Pleasce check log file.');
                res.end();
            }
        });
    });
};
