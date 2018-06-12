exports.helper = function(app) {

    var helpers = {};

    helpers.assets = function(path) {
        return 'http://' + app.req.headers.host + '/assets/' + path;
    };
    return helpers;
};
