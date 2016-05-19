'use strict';

var expect      = require('chai').expect,
    gulp        = require('gulp'),
//    gutils      = require('gulp-util'),
//    PassThrough = require('stream').PassThrough,
    path        = require("path"),
    ui5uploader = require('../index');

require('mocha');


var fixtures = function (glob) { return path.join(__dirname, 'webapp', glob); }

describe("gulp-nwabap-ui5uploader", function () {
    var opts;

    beforeEach(function() {
        opts = {
            conn: {server: "htpp://example.intra" },
            auth: {user: "user", pwd: "password" },
            ui5: {
                package: "package",
                bspcontainer: "bspcontainer",
                bspcontainer_text: "bspcontainer_text",
                transportno: "ABCDEF"
            }
        };
    });

    describe("when calling with invalid options", function () {
        it("should throw if no options given", function () {
            expect(function () {
                return ui5uploader();
            }).to.throw("options must be an object");
        });

        it("should throw if options are not of type object", function () {
            expect(function () {
                return ui5uploader("not_an_object");
            }).to.throw("options must be an object");
        });

        describe("auth", function() {
            it("should throw if no auth parameters given", function () {
                opts.auth = null;
                expect(function () {
                    return ui5uploader(opts);
                }).to.throw('"auth" option not (fully) specified (check user name and password).');
            });

            it("should throw if no user is given", function () {
                opts.auth.user = null;
                expect(function () {
                    return ui5uploader(opts);
                }).to.throw('"auth" option not (fully) specified (check user name and password).');
            });

            it("should throw if no password is given", function () {
                opts.auth.pwd = null;
                expect(function () {
                    return ui5uploader(opts);
                }).to.throw('"auth" option not (fully) specified (check user name and password).');

            });
        });

        describe("ui5", function() {
            it("should throw if no auth parameters given", function () {
                opts.ui5 = null;
                expect(function () {
                    return ui5uploader(opts);
                }).to.throw('"ui5" option not (fully) specified (check package, BSP container, BSP container text information).');
            });

            it("should throw if no package given", function () {
                opts.ui5.package = null;
                expect(function () {
                    return ui5uploader(opts);
                }).to.throw('"ui5" option not (fully) specified (check package, BSP container, BSP container text information).');

            });
            it("should throw if no bspcontainer given", function () {
                opts.ui5.bspcontainer = null;
                expect(function () {
                    return ui5uploader(opts);
                }).to.throw('"ui5" option not (fully) specified (check package, BSP container, BSP container text information).');
            });
            it("should throw if no bspcontainer_text given", function () {
                opts.ui5.bspcontainer_text = null;
                expect(function () {
                    return ui5uploader(opts);
                }).to.throw('"ui5" option not (fully) specified (check package, BSP container, BSP container text information).');
            });

            it("should throw if bspcontainer longer than 15 chars", function () {
                opts.ui5.bspcontainer = "bspcontainer_is_very_long_more_than_15_chars";

                expect(function () {
                    return ui5uploader(opts);
                }).to.throw('"ui5.bspcontainer" option must not be longer than 15 characters.');
            });

            it("should throw if no transportno given for non-local packages", function () {
                opts.ui5.transportno = null;

                expect(function () {
                    return ui5uploader(opts);
                }).to.throw('For packages <> "$TMP" a transport number is necessary.');
            });
        });

        describe("conn", function() {
            it("should throw if no connection parameters given", function () {
                opts.conn = null;
                expect(function () {
                    return ui5uploader(opts);
                }).to.throw('"conn" option not (fully) specified (check server).');

            });

            it("should throw if no server given", function () {
                opts.conn.server = null;
                expect(function () {
                    return ui5uploader(opts);
                }).to.throw('"conn" option not (fully) specified (check server).');

            });
        });
    });

    describe("when calling with valid parameters", function () {
        it("should emit on streamed files", function(done) {
            gulp.src(fixtures('**/*'), { buffer: false })
                .pipe(ui5uploader(opts))
                .on('error', function (err) {
                    expect(err.message).to.equal('Streams are not supported!');
                    done();
                });
        });

        it("should not throw any exception", function (done) {
            gulp.src(fixtures('**/*'))
            //var file = gutils.File( {path:"./test.txt", contents: new Buffer("some content")} );
                .pipe(ui5uploader(opts))
                .on('end', function(){done();})
             //   .end();
            //done();
            //expect(function() { stream.write(file); }).to.not.throw();
        });
    });
});

