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

		return () => {};
	}
}

module.exports = new Cacherole();