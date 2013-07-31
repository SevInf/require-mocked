require-mocked
==============

Node.js library that allows you to inject your mocks into your modules code.

## Installation

```
npm install require-mocked
```

## Usage

Suppose you want to test some module that uses `fs` (eiser directly, or throught one of its dependencies) but 
you want it to use some stun instead of the real FS.

```javascript
var requireMocked = require('require-mocked');

var moduleUnderTest = requireMocked(require.resolve('./path/to/your/module'), {
    mocks: {
        fs: {
            //your stub code
        }
    }
});
```

Module exposes single function - `requireMocked`. It accepts following parameters:

* `path` - absolute path to the module you want to load. Use `require.resolve` to get it from relative path;
* `opts` - loading options:
    * `opts.mocks` - mocks to use when loading module or its dependencies. Keys of the object represents module
    ids, values - the object to use instead of real module.
    * `opts.ignoreMocks` - array of the module id that will always load real modules instead of mocks.

## Similar projects

* [SandboxedModule](https://github.com/felixge/node-sandboxed-module) - doesn't support recursive mocking, but
may be more functional in other areas.

## License

Licensed under MIT license.
