var fs = require('fs');

var server = Bones.Server.extend({

	options: {},
	initialize: function (app) {
		var self = this;
		this.post('/saveImage', function (req, res) {
			fs.readFile(req.files.file.path, function (err, data) {
				if (err) throw err;
				fs.writeFile(req.body.link, data, function (err) {
					if (err) throw err;
					console.log('It\'s saved!');
				});
			});
		});
	}

});

