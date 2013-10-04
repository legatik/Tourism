var moment = require('moment');


var server = Bones.Server.extend({

	options: {},
	initialize: function (app) {
		var self = this;


		this.post('/getEvents', function (req, res) {
			console.log('getEvents', req.body);
			var year = req.body.year,
				month = req.body.month,
				mode = req.body.mode

			var filter = {};
			if (mode=='dayly') {
				var start = new Date(moment('05'+'-'+2013,'MM-YYYY'))
				var finish = moment(month*1+1+'-'+year,'MM-YYYY')
				console.log(finish);
				filter.dateStart = {
					$gte: start

				}
			}

////			last_view: {
////					$gte: bot,
////					$lte: top
////				}

			console.log('filter',filter);


			var events = new models.Events


			events.fetch({
				filter: {
					dateStart: new Date(2013, 4, 15)
				},
				success: function() {
					console.log('eventsSERVER', events);

//					console.log(events.first);

					res.send({events: events})
				},
				error: function() {
					console.log('error--------',arguments);

				}
			})




		});
	}

});

