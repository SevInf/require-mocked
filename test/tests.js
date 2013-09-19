'use strict';
var expect = require('chai').expect,
    requireMocked = require('..')(__filename);

describe('mocked-module', function () {
    var mockFS = {
        isMock: true,
    };

    describe('direct require', function() {
        it('loads mock', function() {
            var module = requireMocked('./fixtures/direct', {
                mocks: {
                    fs: mockFS
                }
            });

            expect(module.fs).to.equal(mockFS);
        });

        it('loads original module if mock is not specified', function() {
            var module = requireMocked('./fixtures/direct');
            expect(module.fs).to.equal(require('fs'));
        });

    });

    describe('nested require', function() {
        it('loads mock', function() {
            var module = requireMocked('./fixtures/nested', {
                mocks: {
                    fs: mockFS
                }
            });

            expect(module.fs).to.equal(mockFS);
        });

    });

    describe('require from node_modules', function() {
        it('loads mock', function() {
            var module = requireMocked('./fixtures/from-node-modules', {
                mocks: {
                    fs: mockFS
                }
            });

            expect(module.fs).to.equal(mockFS);
        });

    });

    describe('ignoreMocks option', function () {
        it('loads specified packages without mocks', function () {
            var module = requireMocked(require.resolve('./fixtures/nested'), {
                mocks: {
                    fs: mockFS
                },
                ignoreMocks: [
                    './direct'
                ]
            });

            expect(module.fs).to.equal(require('fs'));
        });
    });

    describe('resolves option', function () {
        it('resolves to a given path instead of original', function() {
            var module = requireMocked(require.resolve('./fixtures/resolves'), {
                resolves: {
                    './direct': '/not/a/real/direct.js'
                }
            });

            expect(module.directPath).to.equal('/not/a/real/direct.js');
        });
    });
});
