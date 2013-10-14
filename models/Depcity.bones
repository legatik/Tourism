// a mockup user model to contain the BIO information for the CPP forms.

model = Backbone.Model.extend({
    url: function () {
        return '/api/Depcity/' + this.id;
    },
    defaults: {
    	title: 'Ростов',
    	arr_cities: []
    },

    initialize: function () {

    }


});

