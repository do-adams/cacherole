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
			let toss, tossValues;
			beforeEach(function() {
				tossValues = function tossValues(...values) {
					return values;
				};
				cacherole = new cacherole.Cacherole();
				toss = cacherole.put(tossValues);
			});

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

			describe('cache wrapper object', function() {
				it('should return a function value', function() {
					const fnValue = cacherole.put(() => {});
					const optnValue = cacherole.put({
						action: () => {}
					});
		
					assert.typeOf(toss, 'function');
					assert.typeOf(fnValue, 'function');
					assert.typeOf(optnValue, 'function');
				});
	
				it('should return a function value which is called to return a function value', function() {
					const firstFn = cacherole.put(() => {});
					assert.doesNotThrow(() => firstFn('test'), TypeError);
	
					const secondFn = firstFn('test');
					assert.typeOf(secondFn, 'function');
					assert.doesNotThrow(() => secondFn(), TypeError);
				});

				describe('general use', function() {
					it('should cache function calls with a valid property key value', function() {
						const val0 = toss('0')();
						const val1 = toss('1')(0);
						const val2 = toss('2')(0, 1);
		
						assert.strictEqual(val0, toss('0')());
						assert.strictEqual(val1, toss('1')(0));
						assert.strictEqual(val2, toss('2')(0, 1));
					});

					it('should throw an error when called with a non-string type key value', function() {
						assert.throws(() => toss(), TypeError);
						assert.throws(() => toss()(), TypeError);
						assert.throws(() => toss(0)(), TypeError);
						assert.throws(() => toss(0, () => {})(), TypeError);
						assert.throws(() => toss(1)(), TypeError);
						assert.throws(() => toss(false)(), TypeError);
						assert.throws(() => toss(true)(), TypeError);
						assert.throws(() => toss(null)(), TypeError);
						assert.throws(() => toss({})(), TypeError);
						assert.throws(() => toss(undefined)(), TypeError);
						assert.throws(() => toss(function() {})(), TypeError);
						assert.throws(() => toss(() => {})(), TypeError);
						assert.throws(() => toss(Symbol())(), TypeError);
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
				
				describe('this action binding', function() {
					let obj, fn;
					beforeEach(function() {
						obj = {};
						fn = function() {
							return this === obj;
						};
					});

					it('should preserve a function\'s binding when it is an undefined argument', function() {
						assert.isNotTrue(fn());

						let wrappedFn = cacherole.put(fn);
						assert.isNotTrue(wrappedFn('not true')());

						wrappedFn = cacherole.put({
							action: fn
						});
						assert.isNotTrue(wrappedFn('should not be true')());

						wrappedFn = cacherole.put({
							action: fn,
							binding: undefined
						});
						assert.isNotTrue(wrappedFn('def not true')());

						let boundFn = fn.bind(obj);
						assert.isTrue(boundFn());

						wrappedFn = cacherole.put(boundFn);
						assert.isTrue(wrappedFn('true')());

						wrappedFn = cacherole.put({
							action: boundFn
						});
						assert.isTrue(wrappedFn('should be true')());

						wrappedFn = cacherole.put({
							action: boundFn,
							binding: undefined
						});
						assert.isTrue(wrappedFn('definitely true')());
					});

					it('should change a function\'s binding when provided as an argument', function() {
						assert.isNotTrue(fn());

						let wrappedFn = cacherole.put({
							action: fn,
							binding: obj
						});
						assert.isTrue(wrappedFn('must be true')());
					});
				});

				describe('optional cache features', function() {
					let ttl = 10;
					beforeEach(function() {
						toss = cacherole.put({
							action: tossValues,
							time: ttl
						});
					});

					describe('time to live for cached values', function() {
						it('should remove a value from the cache after the specified amount of time', function(done) {
							const key = '0';
							const stored = toss(key)();
							const notRemoved = cacherole.cache.get(key);
							assert.strictEqual(stored, notRemoved);
	
							setTimeout(() => {
								const removed = cacherole.cache.get(key);
								assert.notExists(removed);
								assert.notStrictEqual(stored, removed);
								done();
							}, ttl);
						});
	
						it('should not remove a value from the cache before the specified amount of time', function(done) {
							const key = '0';
							const stored = toss(key)();
							let notRemoved = cacherole.cache.get(key);
							assert.strictEqual(stored, notRemoved);
	
							setImmediate(() => {
								notRemoved = cacherole.cache.get(key);
								assert.exists(notRemoved);
								assert.strictEqual(stored, notRemoved);
								done();
							});
						});
					});

					describe('timeout callbacks', function() {
						it('should run a timeout callback when a cached value expires', function(done) {
							const cb = function() {
								done();
							};
							toss('0', cb)();
						});

						it('should run an arrow function timeout callback when a cached value expires', function(done) {
							const cb = () => done();
							toss('0', cb)();
						});

						it('should expose a key and a value to the timeout callback', function(done) {
							const zero = '0';
							const cb = function(key, value) {
								assert.exists(key);
								assert.strictEqual(key, zero);
								assert.exists(value);
								assert.strictEqual(value, stored);
								done();
							};
							const stored = toss(zero, cb)();
						});

						it('should not overwrite the timeout callbacks on future calls for the same key', function(done) {
							const cb = () => done();
							toss('0', cb)();

							const newCb = () => assert.fail();
							toss('0', newCb)();
						});
					});
				});

				describe('update method', function() {
					let ttl = 10;
					beforeEach(function() {
						toss = cacherole.put({
							action: tossValues,
							time: ttl
						});
					});
					
					it('should expose an update method', function() {
						assert.exists(toss.update);
						assert.typeOf(toss.update, 'function');
					});

					it('should update a stored value in the cache', function() {
						const key = 'update';
						const stored = toss(key)();
						const notUpdated = toss(key)(1);

						assert.strictEqual(stored, notUpdated);

						const updated = toss.update(key)(1, 2);
						assert.notStrictEqual(stored, updated);
					});

					it('should overwrite an earlier timeoutCallback value', function(done) {
						const key = '0';
						const cb = () => assert.fail();
						toss(key, cb)();

						const newCb = () => done();
						toss.update(key, newCb)();
					});

					it('should create a new entry for uncached keys', function() {
						const key = '0';
						const missing = cacherole.cache.get(key);
						assert.notExists(missing);

						const stored = toss.update(key)();
						const found = cacherole.cache.get(key);
						assert.exists(found);
						assert.strictEqual(stored, found);
					});
				});
			});
		});
	});
});


