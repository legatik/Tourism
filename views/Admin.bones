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
		'click .sel-operator': 'dddd'
	},

	dddd: function(e) {
		console.log($(e.target));
		console.log($('.sel-operator > option:contains('+$(e.target).val()+')'));
		this.operator = $('.sel-operator > option:contains('+$(e.target).val()+')').attr('operator_id')
		this.operator_name =  $('.sel-operator > option:contains('+$(e.target).val()+')').attr('operator_name')

		this.attach()
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
				console.log('sssssssssss', self.mode);
				self.ids && self.ids.remove() && $('.help-c', self.el).append($('<div id="country_cont"></div>'))

				self.ids = new views.AdminCountry({
					country: self.country,
					operator: self.operator,
					el: $('#country_cont', self.el),
					operator_name: self.operator_name
				})

				console.log('ddd', self.ids);

				self.ids.render().attach()
			}



		})
		return this;
	}



});

