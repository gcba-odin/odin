var hooks = require('hooks');

// Recursively add null as acceptable type if there is string
// "#nullable" present in the property description
var patchPropertiesWithNullable = function(schema) {
    if (typeof(schema['properties']) === 'object' && !Array.isArray(schema['properties'])) {
        for (property in schema['properties']) {
            if (schema['properties'].hasOwnProperty(property)) {

                var partialSchemaToPatch = schema['properties'][property];
                schema['properties'][property] = patchPropertiesWithNullable(partialSchemaToPatch);
            }
        }
    }

    if (schema['description'] !== undefined) {
        if (schema['description'].indexOf("#nullable") > -1) {
            if (schema['type'] === undefined) {
                schema['type'] = 'null';

            } else if (typeof(schema['type']) === 'string') {
                schema['type'] = [schema['type'], 'null'];

            } else if (Array.isArray(schema['type'])) {
                schema['type'].push('null');

            }
        }
    }

    return (schema);
};

hooks.beforeAll(function(transactions, callback) {
    for (index in transactions) {
        if (transactions.hasOwnProperty(index)) {

            var transaction = transactions[index];
            if (transaction['expected']['bodySchema'] !== undefined) {
                var schema = JSON.parse(transaction['expected']['bodySchema']);
                schema = patchPropertiesWithNullable(schema);
                transactions[index]['expected']['bodySchema'] = JSON.stringify(schema, null, 2);
            }
        }
    }

    callback();
});