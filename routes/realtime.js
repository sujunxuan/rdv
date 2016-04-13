var socketio = require('socket.io');
var business = require(__base + 'core/business');

var realtime = {
    prepareSocketIO: function (server) {
        var io = socketio.listen(server);
        io.sockets.on('connection', function (socket) {
            setInterval(function () {
                socket.emit('uv', business.getRealTimeUV());
            }, 1000)
        });
    }
};

module.exports = realtime;
