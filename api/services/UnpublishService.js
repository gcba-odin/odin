"use strict";


module.exports = {
    unpublish: function(attributes) {
        View.destroy({
            file: attributes.id
        }).exec(function(err) {
            if (err)
                console.error('There was an error deleting the view!', err);
        });

        _Map.destroy({
            file: attributes.id
        }).exec(function(err) {
            if (err) console.error('There was an error deleting the map!', err);
        });

        Chart.destroy({
            file: attributes.id
        }).exec(function(err) {
            if (err) console.error('There was an error deleting the chart!', err);
        });
    }
};
