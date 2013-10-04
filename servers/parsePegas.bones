var phantom = require("node-phantom"),
request = require('request'),
cheerio = require('cheerio');

var server = Bones.Server.extend({

	options: {},
	initialize: function (app) {
		var self = this;



		this.get('/pegas', function (req, res) {
				Bones.socket.emit('test')

			phantom.create(function(err,ph) {
//				console.log("heare")
				ph.createPage(function(err,page) {
					page.open("http://agency.pegast.ru/top/turkey/nhotels?id=709", function(err,status) {
						console.log("opened site? ", status);


						page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(err) {
							//jQuery Loaded.
							//Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
							setTimeout(function() {
								page.evaluate(function() {
								//Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object
									console.log('evaluate',arguments);
									var h2Arr = [],
									pArr = [];
									$('h2').each(function() {
										h2Arr.push($(this).html());
									});
									$('p').each(function() {
										pArr.push($(this).html());
									});
									$('img').each(function() {
										pArr.push($(this).html());
									});


									return pArr;
								}, function(err,result) {
									console.log(result);
									ph.exit();
									res.send('OK')
									});
							}, 1000);
						});
					});
				});
			});
		});
	}

});

