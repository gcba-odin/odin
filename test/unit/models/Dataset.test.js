"use strict";

const assert = require('chai').assert;
const Model = require('../../../api/models/Dataset');
const chakram = require('chakram');
const expect = chakram.expect;
const sails = require('sails');

var getAllDatasets;

describe('Dataset Endpoint', () => {
  before(function() {
    getAllDatasets = chakram.get('http://localhost:3000/datasets');
  });
});