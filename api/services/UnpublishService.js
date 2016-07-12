"use strict";


module.exports = {
    unpublish: function(attributes) {
        View.update({
            file: attributes.id
        }, {
            publishedAt: null
        }).exec(function(err) {
            if (err)
                console.error('There was an error updating the view!', err);
        });

        _Map.update({
            file: attributes.id
        }, {
            publishedAt: null
        }).exec(function(err) {
            if (err) console.error('There was an error updating the map!', err);
        });

        Chart.update({
            file: attributes.id
        }, {
            publishedAt: null
        }).exec(function(err) {
            if (err) console.error('There was an error updating the chart!', err);
        });
    }
};
