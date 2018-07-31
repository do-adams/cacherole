'use strict';

const cache = require('memory-cache');

class Cacherole {
	constructor() {
		this.Cacherole = Cacherole;
		Object.defineProperty(this, 'cache', {
			value: new cache.Cache(),
			configurable: false,
			writable: false
		});
	}

	put(options) {
		// Extract parameters from options object
		let action, time, binding;
		if (typeof options === 'function') { 
			action = options; 
		} else if (typeof options === 'object' && options !== null) {
			({ action, time, binding } = options);
			if (typeof action !== 'function') {
				throw new TypeError('No valid function argument provided for cacherole put method call');
			} 
			if (binding !== undefined) {
				action = action.bind(binding);
			}
		} else {
			throw new TypeError('Invalid options argument in cacherole put method call');
		}

		// Set up the cache wrapper for the action
		const wrapper = (key, timeoutCallback) => {
			const value = this.cache.get(key);
			if (value !== null) {
				return () => value;
			} else {
				return (...params) => this.cache.put(key, action(...params), time, timeoutCallback);
			}
		};

		return wrapper;
	}
}

module.exports = new Cacherole();