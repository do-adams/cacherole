# cacherole

A fluid interface for automagical in-memory caching. 

## Installation

```
npm install cacherole
```

## Usage

cacherole is an abstraction over the `get` and `put` functionality of a traditional cache. It expects to do work in the form of an `action` and takes care of the caching behind-the-scenes. 

You only need to provide a key and your typical arguments in the form of: **cachedAction(key)(actionArguments)**

```javascript
const cacherole = require('cacherole');

// Let's define an action

const list = (...items) => {
  console.log('listing!');
  return items;
};

list('hello', 'there');
//=> 'listing!'
//=> ['hello', 'there']

// Put the action function in the cacherole!

let cachedList = cacherole.put(list);

// Storing values in the cache with a key

cachedList('fruits')('apple', 'mango', 'banana');
//=> 'listing!'
//=> ['apple', 'mango', 'banana']

// Retrieving values from the cache with a key

cachedList('fruits')('apple', 'mango', 'banana');
//=> ['apple', 'mango', 'banana']

// or if you're sure...

cachedList('fruits')();
//=> ['apple', 'mango', 'banana']

// it's okay to make mistakes!

cachedList('fruits')('a-apple', 'ummm... tomato!', 'broccoli?');
//=> ['apple', 'mango', 'banana']

// your action executes only when the key is not in the cache

// Updating a stored value in the cache

cachedList.update('fruits')('melon', 'blueberries', 'passionfruit');
//=> 'listing!'
//=> ['melon', 'blueberries', 'passionfruit']
```

### More Features

```javascript
// More features with object syntax!
// action - function to cache
// time - time until each item is removed, default is forever
// binding - object for binding to the action function if needed

cachedList = cacherole.put({
  action: list,
  time: 1000, // time to live in milliseconds
  binding: null
});

// Setting a timeout callback to execute when the new value is removed from the cache

const alert = (key, value) => console.log('the ' + key + ' have spoiled!');

cachedList('perishables', alert)('meat', 'fish', 'dairy');
//=> 'listing!'
//=> ['meat', 'fish', 'dairy']

// ...after a "while"
//=> 'the perishables have spoiled!'

// Using the internal cache

const internal = cacherole.cache;

internal.get('perishables');
//=> null

internal.put('fats', ['olive oil', 'coconut oil']);
//=> ['olive oil', 'coconut oil']

internal.del('fats');
//=> true

internal.get('fats');
//=> null

internal.clear(); // clears the cache

// Creating a new instance with the Cacherole constructor

const newCacherole = new cacherole.Cacherole();

newCacherole.cache !== cacherole.cache;
//=> true
```

For more documentation, see the unit tests under the `test` directory.

## Notes

For the full internal cache API see the [memory-cache](https://github.com/ptarjan/node-cache/blob/master/README.md) documentation, as it is the cache implementation used in cacherole.

For development make sure to run all unit tests via Mocha with `npm test` after cloning the repo and installing all dependencies.

## License

cacherole is licensed under the MIT license.