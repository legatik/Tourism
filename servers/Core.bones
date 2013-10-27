var io = require('socket.io');
var http = require('http')


servers.Core.prototype.start = function (callback) {

	var self = this;
	//this.port && this.listen(this.port, callback);
	if (this.port) {
		var self=this;
		var server = this.listen(this.port, callback);



		this.enable('view cache')
		setTimeout(function() {
			io = require('socket.io').listen(server);
			Bones.Core = self;
			self.connectionSockets(io)
		},100)
	}

	return this;
}


servers.Core.prototype.connectionSockets = function (io) {
	var self = this;
	io.sockets.on('connection', function (socket) {
		self.socket = socket;

	});
}

