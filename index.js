var version = '0.0.4';

var jade = require('jade');
var program = require('commander');
var fs = require('fs');
var read = require('fs-readdir-recursive');
var path = require('path');
var clc = require('cli-color');
var pd = require('pretty-data').pd;

var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.yellow;
var good = clc.green;

program
    .version(version)
    .option('-e, --extension [extension]', 'output filename extension (default: html)', 'html')
    .option('-b, --beautify', 'beautify output')
    .option('-o, --out [out]', 'relative output path for each file')
    .parse(process.argv);


var files = read('.');
(function (err, files) {
    if (err) { console.log(err); return; }
    var jadeFiles = [];
    var i;

    for (i=0;i<files.length;i++) {
        if (path.extname(files[i]) === ".jade") {
            jadeFiles.push(files[i]);
        }
    }

    if (jadeFiles.length===0) { console.log("no jade files found"); return; }

    var callback = function (event, jadefilename) {
        if (!jadefilename) { return; }
        fs.readFile(jadefilename, function (err, data) {
            if (err) { console.log(err); return; }
            var outputfilename = path.dirname(jadefilename) + '/' + program.out + path.basename(jadefilename, ".jade") + "." + program.extension;
            var time = new Date();
            var compliedData;
            try {
                compliedData = jade.compile(data)({development:true});
            } catch (err) {
                console.warn(error(jadefilename), err, time.toTimeString());
                console.dir(Object.keys(err));
                console.log(compliedData);
                return;
            }
            if (program.beautify) {
                compliedData = pd.xml(compliedData);
            }
            fs.writeFile(outputfilename, compliedData, function (err) {
                if (err) { console.log(err); }
                console.log(good(jadefilename+" > "+outputfilename), time.toTimeString());
            });
        });
    };

    for (i=0;i<jadeFiles.length;i++) {
        var jadefilename = jadeFiles[i];
        fs.watch(jadefilename, (function (file, callback) {
            var file = file;
            var callback = callback;
            return function (event) {
                callback(event, file);
            };
        }(jadefilename, callback)));
    }

    console.log("watching", jadeFiles.length, "jade files for changes.", notice("(jadewatch "+version+")"));
})(!files, files);

// var name  = path.basename(p, ".jade")