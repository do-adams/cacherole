'use strict';

const assert = require('chai').assert;
let cacherole = require('../index.js');

describe('cacherole', function() {
	it('should be an instance of the Cacherole constructor', function() {
		assert.instanceOf(cacherole, cacherole.Cacherole);
	});

	it('should expose the Cacherole constructor', function() {
		assert.exists(cacherole.Cacherole);
		assert.instanceOf(new cacherole.Cacherole(), cacherole.Cacherole);
	});

	it('should expose the cache interface', function() {
		assert.exists(cacherole.cache);
	});

	it('should create a new cache instance when created via the Cacherole constructor', function() {
		const newInstance = new cacherole.Cacherole();

		assert.exists(newInstance.cache);
		assert.notStrictEqual(cacherole.cache, newInstance.cache);
	});

	describe('put()', function() {
		describe('argument interface', function() {
			it('should throw a TypeError if no arguments are provided', function() {
				assert.throws(function() {
					cacherole.put();
				}, TypeError);
			});

			it('should throw a TypeError if invalid falsy or truthy arguments are provided', function() {
				// Numbers
				assert.throws(function() {
					cacherole.put(0);
				}, TypeError);
				assert.throws(function() {
					cacherole.put(1);
				}, TypeError);
				// Strings
				assert.throws(function() {
					cacherole.put('');
				}, TypeError);
				assert.throws(function() {
					cacherole.put('a');
				}, TypeError);
				// Booleans
				assert.throws(function() {
					cacherole.put(false);
				}, TypeError);
				assert.throws(function() {
					cacherole.put(true);
				}, TypeError);
				// Null and Object
				assert.throws(function() {
					cacherole.put(null);
				}, TypeError);
				assert.throws(function() {
					cacherole.put({});
				}, TypeError);
				// Undefined
				assert.throws(function() {
					cacherole.put(undefined);
				}, TypeError);
				// Symbol
				assert.throws(function() {
					cacherole.put(Symbol());
				}, TypeError);
			});

			it('should accept a function value as an argument', function() {
				assert.doesNotThrow(function() {
					cacherole.put(function() {});
				}, TypeError);
				assert.doesNotThrow(function() {
					cacherole.put(() => {});
				}, TypeError);
			});

			it('should accept an async function value as an argument', function() {
				assert.doesNotThrow(function() {
					cacherole.put(async function() {});
				}, TypeError);
				assert.doesNotThrow(function() {
					cacherole.put(async () => {});
				}, TypeError);
			});

			it('should accept an options object as an argument', function() {
				assert.doesNotThrow(function() {
					cacherole.put({
						action: () => {},
						time: 100,
						binding: this
					});
				}, TypeError);
			});

			it('should expect the action property as a required value in the options argument', function() {
				assert.throws(function() {
					cacherole.put({});
				}, TypeError);
				assert.throws(function() {
					cacherole.put({
						time: 100,
						binding: null
					});
				}, TypeError);
			});

			it('should require the action property to be a function type', function() {
				// Numbers
				assert.throws(function() {
					cacherole.put({
						action: 0
					});
				}, TypeError);
				assert.throws(function() {
					cacherole.put({
						action: 1
					});
				}, TypeError);
				// Strings
				assert.throws(function() {
					cacherole.put({
						action: ''
					});
				}, TypeError);
				assert.throws(function() {
					cacherole.put({
						action: 'a'
					});
				}, TypeError);
				// Booleans
				assert.throws(function() {
					cacherole.put({
						action: false
					});
				}, TypeError);
				assert.throws(function() {
					cacherole.put({
						action: true
					});
				}, TypeError);
				// Null
				assert.throws(function() {
					cacherole.put({
						action: null
					});
				}, TypeError);
				// Undefined
				assert.throws(function() {
					cacherole.put({
						action: undefined
					});
				}, TypeError);
				// Symbol
				assert.throws(function() {
					cacherole.put({
						action: Symbol()
					});
				}, TypeError);
			});

			it('should treat the time and binding values as optional', function() {
				assert.doesNotThrow(function() {
					cacherole.put({
						action: () => {}
					});
				}, TypeError);
			});

			it('should ignore irrelevant properties in the options argument', function() {
				assert.doesNotThrow(function() {
					cacherole.put({
						action: () => {},
						foo: 1,
						bar: false
					});
				}, TypeError);
				assert.doesNotThrow(function() {
					const obj = new Boolean(false);
					obj.action = () => {};
					cacherole.put(obj);
				}, TypeError);
			});
		});

		describe('behavior', function() {



			it('should return a function value', function() {
				const fnValue = cacherole.put(() => {});
				const optnValue = cacherole.put({
					action: () => {}
				});
	
				assert.typeOf(fnValue, 'function');
				assert.typeOf(optnValue, 'function');
			});

			it('should cache function calls with a valid property key value', function() {
				
			});

			it('should cache results from the function', function() {
				
			});
		});
	});
});


