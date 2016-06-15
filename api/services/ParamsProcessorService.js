"use strict";

class ParamsProcessor {
    constructor(req) {
        this.req = req;
    }

    parse() {

    }

    toString() {
        return this.req.query;
    }
}

module.exports = {
    ParamsProcessor
};