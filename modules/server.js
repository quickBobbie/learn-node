const http = require('http');

const { server } = require('../config');

module.exports.start = app => {
    http.Server(app)
        .listen(server.port, console.log(app._router));
};