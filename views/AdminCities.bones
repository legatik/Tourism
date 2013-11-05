view = views.Main.extend({
	template: 'AdminCities',

	initialize: function (options) {
		_.bindAll(this, 'render');
		console.log('options',options);
		var self = this;
		this.country = options.country
		this.operator = options.operator
		this.operator_name = options.operator_name
		Bones.router.navigate('/admin/cities')
	},

	events: {

	},


	fetchCities: function(cb) {
		var self = this;
		this.cities = new models.Arrcities
		this.cities.fetch({
			filter: {
				title: {
					$in: this.country.get('cities')
				}
			},
			success: function() {
				console.log('!!!!!!!!!!!!', self.cities.toJSON());
				cb && cb()
			}
		})

	},




	render: function () {
		var self = this;
		$(this.el).html(templates[this.template])
		return this;
	},

	attach: function () {
		var self = this;
		this.fetchCities()
		return this;
	}

});

