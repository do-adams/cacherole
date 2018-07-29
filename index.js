'use strict';

const cache = require('memory-cache');

class Cacherole {
	constructor() {
		this.cache = new cache.Cache();
	}

	put(options) {}
}

module.exports = new Cacherole();
module.exports.Cacherole = Cacherole;