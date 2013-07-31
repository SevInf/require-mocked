'use strict';
var expect = require('chai').expect,
    requireMocked = require('..');

describe('mocked-module', function () {
    var mockFS = {
        isMock: true,
    };

    describe('direct require', function() {
        it('loads mock', function() {
            var module = requireMocked(require.resolve('./fixtures/direct'), {
                mocks: {
                    fs: mockFS
                }
            });

            expect(module.fs).to.equal(mockFS);
        });

        it('loads original module if mock is not specified', function() {
            var module = requireMocked(require.resolve('./fixtures/direct'));
            expect(module.fs).to.equal(require('fs'));
        });

    });

    describe('nested require', function() {
        it('loads mock', function() {
            var module = requireMocked(require.resolve('./fixtures/nested'), {
                mocks: {
                    fs: mockFS
                }
            });

            expect(module.fs).to.equal(mockFS);
        });

    });

    describe('require from node_modules', function() {
        it('loads mock', function() {
            var module = requireMocked(require.resolve('./fixtures/from-node-modules'), {
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
});
