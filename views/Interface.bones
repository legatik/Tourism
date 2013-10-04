/**
 * Draw the main user interface.
 */
view = views.Main.extend({
    initialize: function () {
        views.Main.prototype.initialize.apply(this, arguments);

        //this.model.on('change:activeFacet', this.showFacet, this);

        // we render the ui on initialization, because there
        // should only ever be one of it
        this.render();

        /*
        this.glossary = new views.Glossary({
            model : this.model.glossary,
            el    : this.$el.find('.glossary-wrapper')
        });
        */
    },
    render: function(options) {
        //this.$el.empty().html(templates.Interface());
        return this;
    },
    attach: function(options) {
        //this.glossary.attach();
        return this;
    },


    sync: function(opts) {
        this.trigger('sync');
        return this;
    }
});

// These methods override the base view, and need to call the super.
view.augment({
    remove: function(parent) {
       // this.glossary.remove();
       // this.facetView.remove();
        parent.apply(this, arguments);
    }
});

