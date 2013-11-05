view = views.Main.extend({
	template: 'Admin',

	initialize: function (options) {
		_.bindAll(this, 'render');
		this.operator = 'id_pegas'
		this.operator_name = 'name_pegas'
		this.mode = 'country'

	},

	events: {
		'change .select-country': 'attach',
		'click .sel-operator': 'dddd',
		'click .show-cities': 'showcities'
	},

	dddd: function(e) {
		console.log($(e.target));
		console.log($('.sel-operator > option:contains('+$(e.target).val()+')'));
		this.operator = $('.sel-operator > option:contains('+$(e.target).val()+')').attr('operator_id')
		this.operator_name =  $('.sel-operator > option:contains('+$(e.target).val()+')').attr('operator_name')

		this.attach()
	},

	showcities: function() {
		var self=this;
		self.cities = new views.AdminCities({
				country: self.country,
				operator: self.operator,
				el: $('#cityes_cont', self.el),
				operator_name: self.operator_name
			})
		self.cities.render().attach()
	},

	fetchCountry: function(country, cb) {
		var self = this;
		countries = new models.Countries
		countries.fetch({
			filter: {
				title: country
			},
			success: function() {
				self.country = countries.first()
				console.log('self.country', self.country);
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
		this.fetchCountry($('.select-country', this.el).val(), function() {
			if (self.mode =='country') {
				self.ids && self.ids.remove() && $('.help-c', self.el).append($('<div id="country_cont"></div>'))

				self.ids = new views.AdminCountry({
					country: self.country,
					operator: self.operator,
					el: $('#country_cont', self.el),
					operator_name: self.operator_name
				})


				self.ids.render().attach()
			}



		})
		return this;
	}



});

