//var im = require('imagemagick');
var fs     = require("fs");
var gm     = require("gm");
var httpget = require('http-get');
var schema = require('../../schema');
var db = schema.sequelize;

/* 
 * Function to capture remote images and store in disk by resizing
 * and execute a custom query
 * This function Captures a remote image by http get method
 * Saves it to disk, resizes it and Crops it to a particulart dimension.
 * An extra plugin is also added that we can attach an SQL statement along with it for processing.
 */

exports.captureImageNCropNUpdate = function(sql, url, dstPath, cropPath, callback){
    var options = {url: url};
    var returnVal = 1; //means success
    //folderPath = '/public/images/artists/';
    httpget.get(options, dstPath, function (error, result) {
        if (error) {
            console.error(error);
            returnVal = 0; //means failure;
            callback(returnVal)
        } else {
            console.error(result.file);
            var inFile = result.file;
            var outPath = cropPath;
            var writeStream = fs.createWriteStream(outPath);
            gm(inFile)
            .resize('380', '380')
            .crop('250', '250')
            .stream()
            .pipe(writeStream);
            console.log(sql);
            db.query(sql).success(function() {
                callback(returnVal);	
            });
            
        }
    }); 
}

/**
 * Replica of the captureImageNCropNUpdate method but without the SQL processor.
 */

exports.captureImageNCrop = function(url, dstPath, cropPath, callback){
    var options = {url: url};
    var returnVal = true; //means success
    //folderPath = '/public/images/artists/';
    httpget.get(options, dstPath, function (error, result) {
        if (error) {
            console.error(error);
            returnVal = false; //means failure;
            //callback(returnVal);
        } else {
            console.error(result.file);
            var inFile = result.file;
            var outPath = cropPath;
            var writeStream = fs.createWriteStream(outPath);
            gm(inFile)
            .resize('380', '380')
            .crop('250', '250')
            .stream()
            .pipe(writeStream);
            callback(returnVal);            
        }
    }); 
}

/* 
 * Similar function like captureImageNCropNUpdate, but here it does not crop. Additional it does a size
 * checking. Any image below 200px from dimension is not considered.
 * 
 * For the query we hv extra param here as reject query which fires when image is rejected.
 * 
 * 
 */

exports.captureImageNResizeNUpdate = function(sql, url, dstPath, cropPath, callback){
    var options = {url: url};
    var returnVal = 1; //means success
    //folderPath = '/public/images/artists/';
    httpget.get(options, dstPath, function (error, result) {
        if (error) {
            console.error(error);
            returnVal = 0;
            callback(returnVal);
        } else {
            console.log(result.file);
            var inFile = result.file;
            var outPath = cropPath;            
            gm(inFile)
            .size(function (err, size) {
                if (!err){
                    var imgWdth = size.width;
                    var imgHght = size.height;
                    console.log('width = ' + imgWdth);
                    console.log('height = ' + imgHght);
                    if((imgWdth >= '70') && (imgHght >= '70')){
                        resizeNExecute(sql, inFile, outPath, function(returnVal){
                            callback(returnVal);
                        });    
                    }else{
                        ///reject the image
                        fs.unlinkSync(inFile);
                        returnVal = 0;
                        callback(returnVal);
                    }
                }
              });
            
            
        }
    }); 
}

var resizeNExecute = function(sql, inFile, outPath, callback){
    
    var returnVal = 1; //means success
    
    var writeStream = fs.createWriteStream(outPath);
    gm(inFile)
    .resize('250', '250')
    .gravity('Center')
    .extent('250', '250')
    .stream()
    .pipe(writeStream);
    db.query(sql).success(function() {
        console.log(sql);
        callback(returnVal);	
    });
}

/**
 * Replica of the captureImageNCropNUpdate method but without the SQL processor.
 */

exports.captureImageNResize = function(url, dstPath, cropPath, callback){
    var options = {url: url};
    var returnVal = true; //means success
    //folderPath = '/public/images/artists/';
    httpget.get(options, dstPath, function (error, result) {
        if (error) {
            console.error(error);
            returnVal = false; //means failure;
            //callback(returnVal);
        } else {
            console.error(result.file);
            var inFile = result.file;
            var outPath = cropPath;
            var writeStream = fs.createWriteStream(outPath);
            gm(inFile)
            .resize('250', '250')
            .gravity('Center')
            .extent('250', '250')
            .stream()
            .pipe(writeStream);
            callback(returnVal);            
        }
    }); 
}

/**
 * Crops an image by resizing it.
 */

exports.crop = function(inFile, outPath, callback){
    var returnVal = 1; // success
    gm(inFile)
    .resize('300', '300')
    .crop('250', '250')
    .write(outPath, function (err) {
        if(err){
            returnVal = 0;
            console.log(err);            
        }
        callback(returnVal);
    })
}

/**
 * Resizes an image by its aspect ratio
 */

exports.resize = function(inFile, outPath, callback){
    var returnVal = 1; // success
    console.log(inFile);
    console.log(outPath);
    gm(inFile)
    .resize('250', '250')
    .gravity('Center')
    .extent('250', '250')
    .write(outPath, function (err) {
        if(err){
            returnVal = 0;
            console.log(err);            
        }
        callback(returnVal);
    })
}

