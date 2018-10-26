const http = require('http');

const { server } = require('../config');

module.exports = app => {
    http.Server(app)
        .listen(server.port, () => {
            console.log(`Server start on port ${ server.port }`)
        });
};