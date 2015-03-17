"use strict";

var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');
var gm = require('gm');
var config = require('../config');

var sm = config.SM.width;
var md = config.MD.width;
var lg = config.LG.width;

module.exports = function (app) {
    app.post('/upload', function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            /*res.writeHead(200, {
                'content-type': 'text/plain'
            });
            res.write('received upload:\n\n');

            res.end(util.inspect({
             fields: fields,
             files: files
             }));*/
        });
        form.on('end', function (fields, files) {
            var temp_path = this.openedFiles[0].path;
            var file_name = this.openedFiles[0].name;
            var upload_file_location = 'uploads/' + file_name;

            var download_file_location_sm = 'public/downloads/' + sm + '/' + file_name;
            var download_file_location_md = 'public/downloads/' + md + '/' + file_name;
            var download_file_location_lg = 'public/downloads/' + lg + '/' + file_name;

            fs.copy(temp_path, upload_file_location, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("copied file to new location");
                    gm(upload_file_location).resize(sm, sm).write(download_file_location_sm, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Resized file to width - 240');
                        }
                    });

                    gm(upload_file_location).resize(md, md).write(download_file_location_md, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Resized file to width - 540');
                        }
                    });

                    gm(upload_file_location).resize(lg, lg).write(download_file_location_lg, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Resized file to width - 740');
                        }
                    });

                    res.status(200).send({
                        small: '/downloads/' + sm + '/' + file_name,
                        medium: '/downloads/' + md + '/' + file_name,
                        large: '/downloads/' + lg + '/' + file_name
                    });
                }
            });
        });
    });
};


