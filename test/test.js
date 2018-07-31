'use strict';

const assert = require('chai').assert;
let cacherole = require('../index.js');

describe('cacherole', function() {
	it('should be an instance of the Cacherole constructor', function() {
		assert.instanceOf(cacherole, cacherole.Cacherole);
	});

	it('should expose the Cacherole constructor', function() {
		assert.exists(cacherole.Cacherole);

		let newInstance = new cacherole.Cacherole();
		assert.instanceOf(newInstance, cacherole.Cacherole);
		assert.exists(newInstance.Cacherole);
		assert.strictEqual(newInstance.Cacherole, cacherole.Cacherole);
	});

	it('should expose the cache interface', function() {
		assert.exists(cacherole.cache);
	});

	it('should expose the cache interface as read-only', function() {
		const obj = {};
		
		assert.throws(() => cacherole.cache = obj, TypeError);
		assert.notStrictEqual(cacherole.cache, obj);
	});

	it('should create a new cache instance when created via the Cacherole constructor', function() {
		const newInstance = new cacherole.Cacherole();

		assert.exists(newInstance.cache);
		assert.notStrictEqual(newInstance.cache, cacherole.cache);
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
			// Toss testing function - always returns a new object based on args from call
			let toss;
			function tossValues(...values) {
				return values;
			};

			describe('toss testing function tests', function() {
				it('should return new objects on each call', function() {
					assert.notStrictEqual(tossValues(), tossValues());
					assert.deepEqual(tossValues(), tossValues());
				});

				it('should return unique new objects based on given arguments', function() {
					assert.notStrictEqual(tossValues(1, 2, 3, 4), tossValues(true, false, {}));
					assert.notDeepEqual(tossValues(1, 2, 3, 4), tossValues(true, false, {}));
				});
			});

			beforeEach(function() {
				cacherole = new cacherole.Cacherole();
				toss = cacherole.put(tossValues);
			});

			it('should return a function value', function() {
				const fnValue = cacherole.put(() => {});
				const optnValue = cacherole.put({
					action: () => {}
				});
	
				assert.typeOf(toss, 'function');
				assert.typeOf(fnValue, 'function');
				assert.typeOf(optnValue, 'function');
			});

			it('should return a function value which returns a function value', function() {
				const firstFn = cacherole.put(() => {});
				const secondFn = firstFn();

				assert.typeOf(secondFn, 'function');
			});

			it('should cache function calls with a valid property key value', function() {
				const val0 = toss('0')();
				const val1 = toss('1')(0);
				const val2 = toss('2')(0, 1);

				assert.strictEqual(val0, toss('0')());
				assert.strictEqual(val1, toss('1')(0));
				assert.strictEqual(val2, toss('2')(0, 1));
			});

			it('should cache function calls with an undefined key value', function() {
				const val1 = toss()(0);

				assert.strictEqual(val1, toss()(0));
			});
			
			it('should execute the action provided by the caller when called', function() {
				const val0 = toss('0')();
				const val1 = toss('1')(0);
				const val2 = toss('2')(0, 1);

				assert.deepEqual(val0, tossValues());
				assert.deepEqual(val1, tossValues(0));
				assert.deepEqual(val2, tossValues(0, 1));
			});

			it('should store each key entry as its own even when values are identical', function() {
				const truth = toss('true')(true, 1, {}, 'true');
				const lie = toss('false')(true, 1, {}, 'true');

				assert.notStrictEqual(truth, lie);
			});

			it('should not overwrite a cached key value on future calls after the first call', function() {
				const val1 = toss('key')(1, 2, 3, 4, 5);
				const val2 = toss('key')(1);
				const val3 = toss('key')();

				assert.strictEqual(val1, val2);
				assert.strictEqual(val2, val3);
			});

		});
	});
});


