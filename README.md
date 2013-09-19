require-mocked
==============

Node.js library that allows you to inject your mocks into your modules code.

## Installation

```
npm install require-mocked
```

## Usage

Suppose you want to test some module that uses `fs` (eiser directly, or throught one of its dependencies) but
you want it to use some stub instead of the real FS.

```javascript
var requireMocked = require('require-mocked')(__filename);

var moduleUnderTest = requireMocked('./path/to/your/module', {
    mocks: {
        fs: {
            //your stub code
        }
    }
});
```

To create `requireMocked` function you need to pass your module's file name. It will be used to resolve
paths the same way as original `require` for your module.
`requireMocked` accepts following parameters:

* `path` - path to the module you want to load;
* `opts` - loading options:
    * `opts.mocks` - mocks to use when loading module or its dependencies. Keys of the object represents module
    ids, values - the object to use instead of real module.
    * `opts.resolves` - stub `require.resolve` for the loaded module so it will return given path for
    instead of original. Format is `{"moduleId": "stub/path"}`.
    * `opts.ignoreMocks` - array of the module id that will always load real modules instead of mocks.

## Similar projects

* [SandboxedModule](https://github.com/felixge/node-sandboxed-module) - doesn't support recursive mocking, but
may be more functional in other areas.

## License

Licensed under MIT license.
