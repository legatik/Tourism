var io = require('socket.io');
var http = require('http'),
httpProxy = require('http-proxy')


servers.Core.prototype.start = function (callback) {
	var self = this;
	//this.port && this.listen(this.port, callback);
	if (this.port) {
		var self=this;
		var server = this.listen(this.port, callback);


//		httpProxy.createServer(9000, 'localhost').listen(8000);


//		var proxy = new httpProxy.RoutingProxy();

//		http.createServer(function (req, res) {
//		  proxy.proxyRequest(req, res, {
//			host: 'localhost',
//			port: 3000
//		  });
//		}).listen(8001);


//		var server = this.listen(9000, callback);
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

