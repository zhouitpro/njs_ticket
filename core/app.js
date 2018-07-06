var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('mime-types');

function App() {
    let Helper = require(global.__basedir + '/core/includes/helpers');

    this.routerConfig = require(global.__basedir + '/config/router.js');
    this.theme_path = global.__basedir + '/theme';
    this.ejs = require('ejs');
    this.db = require(global.__basedir + '/core/includes/database');
    this.initreq = require(global.__basedir + '/core/includes/initreq');
    this.config = require(global.__basedir + '/config/config.js');
    this.Helper = new Helper(this);
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
App.prototype.initRouter = function(req) {
    var self = this;

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

    // 生成可以匹配的路由Map.
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
App.prototype.view = function(data) {
    var data = data || {},
        self = this;

    if(!self.controller) {
        self.res.writeHead(404, 'page not found.');
        self.res.end('404 Page Not Found.');
    }

    // init data.
    let results = {
        basedir: global.__basedir,
        baseurl: 'http://' + self.req.headers.host,
        fullpath: data.baseurl + url.parse(self.req.url).pathname,
        helper: this.Helper,
        data: data
    };

    // render templates.
    self.ejs.renderFile(self.template, results, {debug: false}, (err, str) => {
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
App.prototype.createServer = function() {

    var self = this;
    return http.createServer(function (req, res) {
        self.req = req;
        self.res = res;
        self.pre = {};

        // 错误处理.
        process.on('uncaughtException', err => {
            console.log('has error: ' + err.message);
            console.log(err);
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

module.exports = new App();
