'use strict';
var restify = require('restify');
var config = require('./config');
var router = require('./common/router');
var auth = require('./common/auth');
var logger = require('./common/logger');
var socketio = require('socket.io');
var server = restify.createServer(config.server);
var io = socketio.listen(server.server);
restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');
server.use(restify.CORS());
server.opts(/.*/, function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
    res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
    res.send(200);
    return next();
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.dateParser());
server.use(restify.queryParser({
    mapParams: false
}));
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(logger());
server.use(auth());
router.route(server);
server.on("uncaughtException", function (req, res, route, err) {
    res.send(err);
});
server.listen(config.server.port, config.server.host, function () {
    console.log('%s listening at %s', server.name, server.url);
});

io.sockets.on('connect', function (socket) {
    return socket.emit('message', {message: 'message', date: new Date()});
});

