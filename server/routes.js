"use strict";
var formidable = require('formidable');
var fs = require('fs-extra');
var gm = require('gm');
var config = require('../config');
var small = config.small.width;
var medium = config.medium.width;
var large = config.large.width;
module.exports = function(app) {
    app.post('/upload', function(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {});
        form.on('end', function(fields, files) {
            var temp_path = this.openedFiles[0].path;
            var file_name = this.openedFiles[0].name;
            console.log(file_name);
            var arr = file_name.split('.');
            //console.log(arr);[ 'a', 'png' ]
            var upload_file_location = 'uploads/' + file_name;
            var download_file_location_sm = ['public/downloads/', arr[0], '_', small, '.', arr[1]].join('');
            var download_file_location_md = ['public/downloads/', arr[0], '_', medium, '.', arr[1]].join('');
            var download_file_location_lg = ['public/downloads/', arr[0], '_', large, '.', arr[1]].join('');
            console.log(download_file_location_sm);
            console.log(download_file_location_md);
            console.log(download_file_location_lg);
            fs.copy(temp_path, upload_file_location, function(err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("copied file to new location");
                    resize(small, upload_file_location, download_file_location_sm);
                    resize(medium, upload_file_location, download_file_location_md);
                    resize(large, upload_file_location, download_file_location_lg);
                    res.status(200).send({
                        small: ['/downloads/', arr[0], '_', small, '.', arr[1]].join(''),
                        medium: ['/downloads/', arr[0], '_', medium, '.', arr[1]].join(''),
                        large: ['/downloads/', arr[0], '_', large, '.', arr[1]].join('')
                    });
                }
            });
        });
    });
};

function resize(width, upload_file_location, download_file_location) {
    gm(upload_file_location).resize(width, width).write(download_file_location, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Resized file to width - ' + width);
        }
    });
}
