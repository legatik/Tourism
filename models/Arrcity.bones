// a mockup user model to contain the BIO information for the CPP forms.

model = Backbone.Model.extend({
    url: function () {
        return '/api/Arrcity/' + this.id;
    },
    defaults: {
    	title: '',
    	hotels: [],
    	operators: []
    },

    initialize: function () {

    }


});

