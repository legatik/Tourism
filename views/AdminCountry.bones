view = views.Main.extend({
	template: 'AdminCountry',

	initialize: function (options) {
		_.bindAll(this, 'render');
		console.log('options',options);

		this.country = options.country
		this.operator = options.operator
		this.operator_name = options.operator_name
		Bones.router.navigate('/admin/country')
	},

	events: {
		'click #save-country': 'saveCountry'

	},

	saveCountry: function() {
		var opid = $('.id-oper').val()
		var opname = $('.id-country').val()
		var count = this.country.toJSON()
		count[this.operator] = opid
		count[this.operator_name] = opname
		var c = new models.Country(count)
		console.log('c',c.toJSON());
		c.save()


	},



	render: function () {
		var self = this;
		var json = this.country.toJSON()
		json.operator = this.operator
		$(this.el).html(templates[this.template](json))
		return this;
	},

	attach: function () {
		var self = this;
		var id = this.country.get(this.operator)
		var opname = this.country.get(this.operator_name)
		if (id) {
			$('.id-oper').val(id)
		}
		if (opname) {
			$('.id-country').val(opname)
		}
		return this;
	}



});

