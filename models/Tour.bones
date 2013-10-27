// a mockup user model to contain the BIO information for the CPP forms.

model = Backbone.Model.extend({
    url: function () {
        return '/api/Tour/' + this.id;
    },
    defaults: {
    	dayNight: '',
		deeplink: '',
		discription: '',
		images: [],
		installmentPlan: '',
		nameHotel: '',
		nutrition: '',
		price: '',
		roomsType: '',
		settlement: '',
		tour: '',
		transport: '',
		typePrice: ''
    },

    initialize: function () {

    }
});

