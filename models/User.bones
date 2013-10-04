// a mockup user model to contain the BIO information for the CPP forms.

model = Backbone.Model.extend({
    url: function () {
        return '/api/User/' + this.id;
    },
    defaults: {
    	email: '',
        firstName: '',
        lastName: '',
        password: '',
        registered_on: null
    },

    initialize: function () {

    },


    loadUser: function () {
        this.$user = this._load();
    },



    toClient: function () {
        return this;//this.toJSON();
    },
    isLoaded: function() {
        return $.when(this.$user)
            .pipe(_.f.functionize(this));
    },
    _load: function() {
        var defer = jQuery.Deferred();

        // We resolveWith and rejectWith here so that the events will always
        // be bound with the schema model set.
        var doneFn = _.bind(function(m) {
            //console.log('++++++++++++++=done', m);
            defer.resolveWith(this, [this]);
        }, this);

        var failFn = _.bind(function(m) {
            defer.rejectWith(this, ["Could not load the user"]);
        }, this);

        this.fetch({
            success: function () {doneFn.apply(this, arguments);},
            error: function () {failFn.apply(this, arguments);}
        })

        return defer.promise();
    }

});




model.augment({
    fetch: function(parent, options) {
        return $.when(parent.apply(this, [options]))
            .pipe(_.f.functionize(this));
    }
});

