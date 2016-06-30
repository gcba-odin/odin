//-- test/unit/controllers/FileController.test.js
require("sails-test-helper");

describe(TEST_NAME, function() {
    describe("GET /files", function() {
        it("should be successful", function(done) {
            request.get("/files")
                .expect(200)
                .end(done);
        });
    });
});