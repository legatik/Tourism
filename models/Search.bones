// a mockup user model to contain the BIO information for the CPP forms.

model = Backbone.Model.extend({
    url: function () {
        return '/api/Search/' + this.id;
    },

    defaults: {
    	start: 'Москва',
    	finish: 'Турция',
    	type: '',
    	date_start: new Date(),
    	date_finish: new Date(),
    	night_min: 1,
    	night_max: 1,
    	resort_town: [],
    	category: [],
    	food: [],
    	hotel: [],
    	operator: [],
    	is_flight: false,
    	is_places: false,
    	is_tickets: false,
    	format_price: 'RUB',
    	min_price: 0,
    	max_price: 0,
    	number_adult: 1,
    	number_child: 0
    },

    initialize: function () {

    }


});

