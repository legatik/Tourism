view = views.Main.extend({

	template: 'City',

	tagName: 'div',

	initialize: function (options) {
		_.bindAll(this, 'render');
		this.model = options.model
		this.parrent = options.parrent

	},

	events: {
		'click input': 'click'
	},

	click: function(e) {
		var self=this
		var par = $(e.target).parent()
		var city = $('span', par).text()
		if (e.target.checked) {
			self.parrent.cities_checked.push(this.model)
		}
		else {
			_.each(self.parrent.cities_checked, function(cat, num) {
				if (cat.get('title')==city) {
					self.parrent.cities_checked.splice(num,1)
				}
			})
		}
		this.parrent.changeHotels()
	},

	attach: function() {



		return this;
	},


	render: function () {
		$(this.el).html(templates[this.template](this.model.toJSON()));
		return this;
	}


});

