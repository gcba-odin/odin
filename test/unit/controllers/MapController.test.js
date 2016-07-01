//-- test/unit/controllers/FileController.test.json
"use strict";

require("sails-test-helper");

const sails = require('sails');
const config = require('../../../config/env/test');
const assert = chai.assert;

chai.use(require('chai-fs'));
chai.use(require('chai-string'));

describe('All Maps', function() {
    describe("GET /maps", function() {
        it("should get all maps", function(done) {
            request.get("/maps")
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');

                    err ? done(err) : done();
                });
        });
    });
});

describe('Single Map', function() {
    var fileId;

    before(function() {
        request.post("/files")
            .set('Accept', 'application/json')
            .field('name', 'CSV File With Geodata')
            .field('description', 'An example geodata file')
            .field('notes', 'Lorem ipsum dolor sit amet...')
            .field('type', 'sWRhpRV')
            .field('status', 'pWRhpRV')
            .field('dataset', 'sWRhpRkh')
            .field('organization', 'hWRhpRV')
            .field('updateFrequency', 'zWRhpR8')
            .field('owner', 'dogPzIz9')
            .field('createdBy', 'dogPzIz9')
            .attach('uploadFile', 'test/assets/geodata.csv')
            .expect(201)
            .expect('Content-Type', /json/).end(function(err, result) {
                fileId = result.body.data.id;
            });
    });

    describe("POST /maps", function() {
        it("should create a new map from a geodata file", function(done) {
            request.post("/maps")
                .set('Accept', 'application/json')
                .field('name', 'Example Map')
                .field('description', 'An example map')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('basemap', 'roadmap')
                .field('latetitudeKey', 'latitude')
                .field('longitudeKey', 'longitude')
                .field('file', fileId)
                .expect(201)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.property(result.body, 'data');
                    assert.property(result.body, 'links');

                    assert.equal(result.body.data.name, 'Example Map');
                    assert.equal(result.body.data.description, 'An example map');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');

                    assert.property(result.body.data, 'latitudeKey');
                    assert.property(result.body.data, 'longitudeKey');

                    assert.property(result.body.data, 'geojson');
                    assert.property(result.body.data.geojson, 'type');

                    if (result.body.data.geojson.type === 'Feature') {
                        assert.property(result.body.data.geojson, 'id');
                        assert.property(result.body.data.geojson, 'geometry');

                        assert.property(result.body.data.geojson.geometry, 'type');
                        assert.equal(result.body.data.geojson.geometry.type, 'Point');

                        assert.property(result.body.data.geojson.geometry, 'coordinates');
                        assert.isArray(result.body.data.geojson.geometry.coordinates);

                        assert.property(result.body.data.geojson, 'properties');
                    } else {
                        assert.equal(result.body.data.geojson.type, 'FeatureCollection');

                        assert.property(result.body.data.geojson, 'features');
                        assert.isArray(result.body.data.geojson.features);

                        result.body.data.geojson.features.forEach(function(element) {
                            assert.property(element, 'id');
                            assert.property(element, 'geometry');

                            assert.property(element.geometry, 'type');
                            assert.equal(element.geometry.type, 'Point');

                            assert.property(element.geometry, 'coordinates');
                            assert.isArray(element.geometry.coordinates);

                            assert.property(element, 'properties');
                        }, this);
                    }

                    err ? done(err) : done();
                });
        });
    });
});