'use strict';
var PATH = require('path'),
    FS = require('fs'),
    VM = require('vm'),
    requireLike = require('require-like'),
    seprator = PATH.sep || (process.platform === 'win32' ? '\\' : '/');


function isAbsolutePath(path) {
    if (process.platform === 'win32') {
        return !!path.substring(0, 3).match(/[A-Z]:\\/);
    }
    return path[0] === seprator;
}

function MockedLoader(modulePath, opts) {
    opts = opts || {};
    this.modulePath = modulePath;
    this.mocks = opts.mocks || {};
    this.ignoreMocks = opts.ignoreMocks || [];
    this.resolves = opts.resolves || [];
    this.cache = {};
}

MockedLoader.prototype.load = function() {
    this.createContext();
    return this.loadMockedModule(this.modulePath).exports;
};

MockedLoader.prototype.createContext = function() {
    var sandbox = {
        Buffer: Buffer,
        setTimeout: setTimeout,
        setInterval: setInterval,
        clearTimeout: clearTimeout,
        clearInterval: clearInterval,
        process: process,
        console: console
    };

    this.context = VM.createContext(sandbox);
};

MockedLoader.prototype.loadMockedModule = function(path) {
    var exports = {},
        module = {exports: exports},
        require = this.createFakeRequire(path);

    this.cache[path] = module;
    var runModule = this.createModuleFunc(path);

    runModule.call(this.context, require, module, exports, path, PATH.dirname(path));

    return module;
};

MockedLoader.prototype.createFakeRequire = function(parentPath) {
    var self = this;
    var moduleRequire = requireLike(parentPath);

    var fakeRequire = function fakeRequire(modulePath) {
        if (self.mocks[modulePath]) {
            return self.mocks[modulePath];
        }

        if (self.ignoreMocks.indexOf(modulePath) !== -1) {
            return moduleRequire(modulePath);
        }

        modulePath = moduleRequire.resolve(modulePath);

        if (isAbsolutePath(modulePath) && PATH.extname(modulePath) === '.js') {
            if (!self.cache[modulePath]) {
                self.loadMockedModule(modulePath);
            }
            return self.cache[modulePath].exports;
        }

        // loading non-mocked core or non-js module
        return require(modulePath);
    };

    fakeRequire.extensions = moduleRequire.extensions;
    fakeRequire.resolve = function(id) {
        return self.resolves[id] || moduleRequire.resolve(id);
    };
    fakeRequire.cache = self.cache;

    return fakeRequire;
};

MockedLoader.prototype.createModuleFunc = function(path) {
    return VM.runInContext(this.getModuleSource(path), this.context, path);
};

MockedLoader.prototype.getModuleSource = function(path) {
    return [
        '(function (require, module, exports, __filename, __dirname) {',
        FS.readFileSync(path),
        '});'
    ].join('\n');
};

module.exports = function requireMocked(path, opts) {
    return new MockedLoader(path, opts).load();
};

