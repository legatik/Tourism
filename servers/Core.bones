var io = require('socket.io');

servers.Core.prototype.start = function (callback) {
	var self = this;
	//this.port && this.listen(this.port, callback);
	if (this.port) {
		var self=this;
		var server = this.listen(this.port, callback);
		this.enable('view cache')
		setTimeout(function() {
			io = require('socket.io').listen(server);
			io.sockets.on('connection', function (socket) {
				Bones.socket = socket;
			});

		},1000)
	}


	return this;
}

