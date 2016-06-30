//-- test/unit/controllers/FileController.test.json

require("sails-test-helper");

const sails = require('sails');

describe('All Files', function() {
    describe("GET /files", function() {
        it("should get all files", function(done) {
            request.get("/files")
                .set('Accept', 'application/json')
                .expect(200)
                .end(done);
        });
    });
});

describe('Single File', function() {
    // CSV upload
    describe("POST /file [csv]", function() {
        it("should upload a new file [csv]", function(done) {
            request.post("/files")
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
                .attach('uploadFile', 'test/assets/example.csv')
                .expect(201)
                .end(done);
        });
    });

    // XLS upload
    describe("POST /file [xls]", function() {
        it("should upload a new file [xls]", function(done) {
            request.post("/files")
                .set('Accept', 'application/json')
                .field('name', 'XLS File')
                .field('description', 'An example file')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('type', 'sWRhpRV')
                .field('status', 'pWRhpRV')
                .field('dataset', 'sWRhpRkh')
                .field('organization', 'hWRhpRV')
                .field('updateFrequency', 'zWRhpR8')
                .field('owner', 'dogPzIz9')
                .field('createdBy', 'dogPzIz9')
                .attach('uploadFile', 'test/assets/example.xls')
                .expect(201)
                .end(done);
        });
    });

    // XLSX upload
    describe("POST /file [xlsx]", function() {
        it("should upload a new file [xlsx]", function(done) {
            request.post("/files")
                .set('Accept', 'application/json')
                .field('name', 'XLSX File')
                .field('description', 'An example file')
                .field('notes', 'Lorem ipsum dolor sit amet...')
                .field('type', 'sWRhpRV')
                .field('status', 'pWRhpRV')
                .field('dataset', 'sWRhpRkh')
                .field('organization', 'hWRhpRV')
                .field('updateFrequency', 'zWRhpR8')
                .field('owner', 'dogPzIz9')
                .field('createdBy', 'dogPzIz9')
                .attach('uploadFile', 'test/assets/example.xlsx')
                .expect(201)
                .end(done);
        });
    });
});