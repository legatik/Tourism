model = Backbone.Model.extend({
    url: function () {
        return '/api/Categories/' + this.id;
    },
    defaults: {
        id: 'categories',
        list_categories: [],
        list_tags: []

    },

    initialize: function () {
//        this.set({
//            list_categories: ['Amateur', 'Anal', 'Ass', 'Big Dick', 'Blonde', 'Blowjob', 'Bondage', 'Brunette', 'Celebrity', 'Compilation'],
//            list_tags: ['yong', 'ripped', 'teen', 'blonde', 'girl', 'boy', 'stupped']
//            
//        });


    },

    loadCategories: function () {
        $categories = this._load();
    },


    isLoaded: function () {
        return $.when($categories).pipe(_.f.functionize(this));
    },


    _load: function () {
        var defer = jQuery.Deferred();

        // We resolveWith and rejectWith here so that the events will always
        // be bound with the schema model set.
        var doneFn = _.bind(function (m) {
            //console.log('done', m);
            defer.resolveWith(this, [this]);
        }, this);

        var failFn = _.bind(function (m) {
            defer.rejectWith(this, ["Could not load the user"]);
        }, this);

        this.fetch({
            success: function () {
                doneFn.apply(this, arguments);
            },
            error: function () {
                failFn.apply(this, arguments);
            }
        }) //.done(doneFn).fail(failFn);

        return defer.promise();
    }

});




model.augment({
    fetch: function (parent, options) {
        return $.when(parent.apply(this, [options])).pipe(_.f.functionize(this));
    }
});

