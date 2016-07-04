//-- test/unit/controllers/FileController.test.json
'use strict';

require('sails-test-helper');

const sails = require('sails');
const config = require('../../../config/env/test');
const assert = chai.assert;

chai.use(require('chai-fs'));
chai.use(require('chai-string'));


/*
 * All Maps
 */

describe('All Maps', function() {
    describe('- GET /maps', function() {
        it('- Should get all maps', function(done) {
            request.get('/maps')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    // Meta
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'OK');

                    assert.property(result.body.meta, 'count');
                    assert.isNumber(result.body.meta.count);

                    assert.property(result.body.meta, 'limit');
                    assert.isNumber(result.body.meta.limit);

                    assert.property(result.body.meta, 'start');
                    assert.isNumber(result.body.meta.start);

                    assert.property(result.body.meta, 'end');
                    assert.isNumber(result.body.meta.end);

                    assert.property(result.body.meta, 'page');
                    assert.isNumber(result.body.meta.page);

                    assert.property(result.body.meta, 'pages');
                    assert.isNumber(result.body.meta.pages);

                    assert.isAtMost(result.body.meta.page, result.body.meta.pages);

                    // Data
                    assert.property(result.body, 'data');
                    assert.isArray(result.body.data);

                    // Links
                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'firstItem');
                    assert.isString(result.body.links.firstItem);
                    assert.endsWith(element.url, `/datasets/first`);

                    assert.property(result.body.links, 'lastItem');
                    assert.isString(result.body.links.lastItem);
                    assert.endsWith(element.url, `/datasets/last`);

                    if (result.body.data.length > 0) {
                        result.body.data.forEach(function(element) {
                            assert.property(element, 'id');
                            assert.isString(element.id);

                            assert.property(element, 'name');
                            assert.isString(element.name);

                            assert.property(element, 'description');
                            if (element.description) assert.isString(element.description);

                            assert.property(element, 'notes');
                            if (element.notes) assert.isString(element.notes);

                            assert.property(element, 'basemap');
                            assert.isString(element.basemap);
                            assert.oneOf(element.basemap, ['roadmap', 'satellite', 'hybrid', 'terrain']);

                            assert.property(element, 'url');
                            if (element.url) assert.isString(element.url);

                            assert.property(element, 'embedCode');
                            if (element.embedCode) assert.isString(element.embedCode);

                            assert.property(element, 'latitudeKey');
                            assert.isString(element.latitudeKey);

                            assert.property(element, 'longitudeKey');
                            assert.isString(element.longitudeKey);

                            assert.property(element, 'geojson');
                            assert.isObject(element.geojson);

                            assert.property(element, 'file');
                            assert.isObject(element.file);

                            assert.property(element, 'createdBy');
                            // assert.isObject(element.createdBy);

                            assert.property(element, 'createdAt');
                            assert.property(element, 'updatedAt');

                            // assert.startsWith(element.url, `http://127.0.0.1`);
                            // assert.endsWith(element.url, `/files/${element.id}/download`);
                        }, this);
                    }

                    err ? done(err) : done();
                });
        });
    });

    // 501 Not Implemented Errors

    describe('- DELETE /maps', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.del('/maps')
                .set('Accept', 'application/json')
                .expect(501)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'E_NOT_IMPLEMENTED');

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    err ? done(err) : done();
                });
        });
    });

    describe('- PATCH /maps', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.patch('/maps')
                .set('Accept', 'application/json')
                .expect(501)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'E_NOT_IMPLEMENTED');

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    err ? done(err) : done();
                });
        });
    });

    describe('- PUT /maps', function() {
        it('- Should get 501 Method Not Implemented error', function(done) {
            request.put('/maps')
                .set('Accept', 'application/json')
                .expect(501)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'E_NOT_IMPLEMENTED');

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    err ? done(err) : done();
                });
        });
    });
});


/*
 * Single Map
 */

describe('Single Map', function() {
    var fileId, mapId;

    // Upload geodata CSV file
    describe('- POST /files [csv]', function() {
        it('- Should upload a new file [csv]', function(done) {
            request.post('/files')
                .set('Accept', 'application/json')
                .field('name', 'CSV File')
                .field('description', 'An example file')
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
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    if (!err) {
                        fileId = result.body.data.id;
                        done();
                    } else done(err);
                });
        });
    });

    // Create map
    describe('- POST /maps', function() {
        it('- Should create a new map from the geodata file', function(done) {
            request.post('/maps')
                .set('Accept', 'application/json')
                .field('name', 'Example Map')
                .field('description', 'An example map')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('basemap', 'roadmap')
                .field('latitudeKey', 'LATITUDE')
                .field('longitudeKey', 'LONGITUDE')
                .field('file', fileId)
                .field('createdBy', 'dogPzIz9')
                .expect(201)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body, 'data');
                    assert.isObject(result.body.data);

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    assert.property(result.body.links, 'record');
                    assert.isString(result.body.links.record);

                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);

                    assert.property(result.body.data, 'name');
                    assert.isString(result.body.data.name);

                    assert.property(result.body.data, 'description');
                    if (result.body.data.description) assert.isString(result.body.data.description);

                    assert.property(result.body.data, 'notes');
                    if (result.body.data.notes) assert.isString(result.body.data.notes);

                    assert.property(result.body.data, 'latitudeKey');
                    assert.isString(result.body.links.latitudeKey);

                    assert.property(result.body.data, 'longitudeKey');
                    assert.isString(result.body.links.longitudeKey);

                    assert.property(result.body.data, 'geojson');
                    assert.isObject(result.body.geojson);

                    assert.equal(result.body.data.name, 'Example Map');
                    assert.equal(result.body.data.description, 'An example map');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');

                    if (!err) {
                        mapId = result.body.data.id;
                        done();
                    } else done(err);
                });
        });
    });

    // Get map
    describe('- GET /maps/:id', function() {
        it('- Should get the map', function(done) {
            request.get(`/maps/${mapId}`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body, 'data');
                    assert.isObject(result.body.data);

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);

                    assert.property(result.body.data, 'name');
                    assert.isString(result.body.data.name);
                    assert.equal(result.body.data.name, 'Example Map');

                    assert.property(result.body.data, 'description');
                    assert.isString(result.body.data.description);
                    assert.equal(result.body.data.description, 'An example map');

                    assert.property(result.body.data, 'notes');
                    assert.isString(result.body.data.notes);
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');

                    assert.property(result.body.data, 'latitudeKey');
                    assert.isString(result.body.links.latitudeKey);

                    assert.property(result.body.data, 'longitudeKey');
                    assert.isString(result.body.links.longitudeKey);

                    assert.property(result.body.data, 'geojson');
                    assert.isObject(result.body.geojson);

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
                            assert.isNumber(element.id);

                            assert.property(element, 'geometry');
                            assert.property(element.geometry, 'type');
                            assert.equal(element.geometry.type, 'Point');

                            assert.property(element.geometry, 'coordinates');
                            assert.isArray(element.geometry.coordinates);
                            assert.isNumber(element.geometry.coordinates[0]);
                            assert.isNumber(element.geometry.coordinates[1]);

                            assert.property(element, 'properties');
                        }, this);
                    }

                    err ? done(err) : done();
                });
        });
    });

    // Edit map
    describe('- PATCH /maps', function() {
        it('- Should edit the map', function(done) {
            request.patch(`/maps/${mapId}`)
                .set('Accept', 'application/json')
                .field('name', 'Edited Map')
                .field('description', 'An edited map')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('basemap', 'terrain')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body, 'data');
                    assert.isObject(result.body.data);

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);

                    assert.property(result.body.data, 'name');
                    assert.isString(result.body.data.name);

                    assert.property(result.body.data, 'description');
                    assert.isString(result.body.data.description);

                    assert.property(result.body.data, 'notes');
                    assert.isString(result.body.data.notes);

                    assert.property(result.body.data, 'latitudeKey');
                    assert.isString(result.body.links.latitudeKey);

                    assert.property(result.body.data, 'longitudeKey');
                    assert.isString(result.body.links.longitudeKey);

                    assert.property(result.body.data, 'geojson');
                    assert.isObject(result.body.geojson);

                    assert.equal(result.body.data.name, 'Edited Map');
                    assert.equal(result.body.data.description, 'An edited map');
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');

                    if (!err) {
                        mapId = result.body.data.id;
                        done();
                    } else done(err);
                });
        });
    });

    // Get map
    describe('- GET /maps/:id', function() {
        it('- Should get the edited map', function(done) {
            request.get(`/maps/${mapId}`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body, 'data');
                    assert.isObject(result.body.data);

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    assert.property(result.body.data, 'id');
                    assert.isString(result.body.data.id);

                    assert.property(result.body.data, 'name');
                    assert.isString(result.body.data.name);
                    assert.equal(result.body.data.name, 'Edited Map');

                    assert.property(result.body.data, 'description');
                    assert.isString(result.body.data.description);
                    assert.equal(result.body.data.description, 'An edited map');

                    assert.property(result.body.data, 'notes');
                    assert.isString(result.body.data.notes);
                    assert.equal(result.body.data.notes, 'Lorem ipsum dolor sit amet...');

                    assert.property(result.body.data, 'latitudeKey');
                    assert.isString(result.body.links.latitudeKey);

                    assert.property(result.body.data, 'longitudeKey');
                    assert.isString(result.body.links.longitudeKey);

                    assert.property(result.body.data, 'geojson');
                    assert.isObject(result.body.geojson);

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
                            assert.isNumber(element.id);

                            assert.property(element, 'geometry');
                            assert.property(element.geometry, 'type');
                            assert.equal(element.geometry.type, 'Point');

                            assert.property(element.geometry, 'coordinates');
                            assert.isArray(element.geometry.coordinates);
                            assert.isNumber(element.geometry.coordinates[0]);
                            assert.isNumber(element.geometry.coordinates[1]);

                            assert.property(element, 'properties');
                        }, this);
                    }

                    err ? done(err) : done();
                });
        });
    });

    // Delete map
    describe('- DELETE /maps/:id', function() {
        it('- Should delete the map', function(done) {
            request.del(`/maps/${mapId}`)
                .expect(204)
                .end(function(err, result) {
                    err ? done(err) : done();
                });
        });
    });

    // Check deleted map
    describe('- GET /map/:id [xlsx]', function() {
        it('- Should get error 404', function(done) {
            request.get(`/maps/${mapId}`)
                .set('Accept', 'application/json')
                .expect(404)
                .expect('Content-Type', /json/)
                .end(function(err, result) {
                    assert.property(result.body, 'meta');
                    assert.isObject(result.body.meta);

                    assert.property(result.body.meta, 'code');
                    assert.isString(result.body.meta.code);
                    assert.equal(result.body.meta.code, 'E_NOT_FOUND');

                    assert.property(result.body, 'links');
                    assert.isObject(result.body.links);

                    assert.property(result.body.links, 'all');
                    assert.isString(result.body.links.all);

                    err ? done(err) : done();
                });
        });
    });
});