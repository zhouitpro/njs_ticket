exports.get = function() {
    return {
        db: {
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'ticket'
        },
        basepath: __dirname
    };
};
