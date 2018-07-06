function Helper(app) {
    this.App = app;
}

Helper.prototype.assets = function(path) {
    return 'http://' + this.App.req.headers.host + '/assets/' + path;
};

module.exports = Helper;
