var version = '0.0.1';

var jade = require('jade');
var program = require('commander');
var fs = require('fs');
var path = require('path');
var clc = require('cli-color');

var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.yellow;
var good = clc.green;

program
    .version(version)
    .option('-e, --extension [extension]', 'output filename extension (default: html)', 'html')
    .parse(process.argv);


fs.readdir(".", function (err, files) {
    if (err) { console.log(err); return; }
    var jadeFiles = [];
    var i;

    for (i=0;i<files.length;i++) {
        if (path.extname(files[i]) === ".jade") {
            jadeFiles.push(files[i]);
        }
    }

    if (jadeFiles.length===0) { console.log("no jade files found"); return; }

    for (i=0;i<jadeFiles.length;i++) {
        var jadefilename = jadeFiles[i];
        fs.watch(jadefilename, function (event) {
            if (!jadefilename) { return; }
            fs.readFile(jadefilename, function (err, data) {
                if (err) { console.log(err); return; }
                //jade.compile(data)();
                var outputfilename = path.basename(jadefilename, ".jade")+"."+program.extension;
                var time = new Date();
                try {
                    var compliedData = jade.compile(data)();
                } catch (err) {
                    console.warn(error(jadefilename), err, time.toTimeString());
                    return;
                }
                fs.writeFile(outputfilename, compliedData, function (err) {
                    if (err) { console.log(err); }
                    
                    console.log(good(jadefilename+" > "+outputfilename), time.toTimeString());
                });
            });
        });
    }

    console.log("watching", jadeFiles.length, "jade files for changes.", notice("(jadewatch "+version+")"));
});

// var name  = path.basename(p, ".jade")