/* global global, require */
/* jshint expr: true, camelcase: false, unused: vars */

/* This is code that we would typically need to include at the top of every one of our test files,
 but by including it in a single file we can instruct Mocha to automatically require this file for every
  test file that is run.

 The command then, to run our tests:
 */
//   mocha -r tests/testhelper.js -R spec tests/**/*.test.js
// or if you look at package.json, then just npm test

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

global.expect = chai.expect;
global.sinon = sinon;
chai.use(sinonChai);