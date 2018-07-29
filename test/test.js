'use strict';

const assert = require('chai').assert,
	cacherole = require('../index.js');

describe('cacherole', function() {

	it('should be an instance of the Cacherole constructor', function() {
		assert.instanceOf(cacherole, cacherole.Cacherole);
	});

	it('should expose the Cacherole constructor', function() {
		assert.exists(cacherole.Cacherole);
	});

	it('should expose the cache interface', function() {
		assert.exists(cacherole.cache);
	});

	describe('put()', function() {

	});

});


