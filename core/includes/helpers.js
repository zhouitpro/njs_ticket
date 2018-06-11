exports.helper = function(app) {
    return {
        assets: function(path) {
            return 'http://' + app.req.headers.host + '/assets/' + path;
        }
    }
};
