// a mockup user model to contain the BIO information for the CPP forms.

model = Backbone.Model.extend({
    url: function () {
        return '/api/Country/' + this.id;
    },
    defaults: {
    	title: '',
		id_pegas: null,
    },

    initialize: function () {

    }


});

