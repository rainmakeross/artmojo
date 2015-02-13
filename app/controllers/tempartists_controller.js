var tempartist = require('../models/tempartist');
var artist = require('../models/artist');
var template = "tempartists/";

var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');

exports.list = function(req, res){
    tempartist.list(function(data){
        res.send(data);
    });
}

exports.publicadd = function(req, res){
    res.render(template + '/publicadd', { 
                    title: 'Add Listing',
                    meta_keyword: 'Artmojo, Add Listing',
                    meta_description: 'Artmojo Add Listing'
                });
}




exports.publicedit = function(req, res){
    //console.log(req.user);
    var url = req.query.url;
    artist.fetchDatabyUrl(url, function(data){
            if(data){
                var pasteUrl = data.artist_image;
                if(data.localImg == 1){
                    pasteUrl = "";
                }
                res.render(template + '/publicedit', { 
                    title: 'Edit Listing',
                    meta_keyword: 'Artmojo, Edit Listing',
                    meta_description: 'Artmojo Edit Listing',
                    loggedUser: "1",
                    artist: data,
                    pasteUrl: pasteUrl
                });
            }else{
               res.redirect("/") ;
            }
        });
};

exports.add = function(req, res){
    var param = req.body;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //res.send(req.files.picture);
        //param["your_email"] = "";
        var artist_image = imgParam.path.split("/")[2] + "-" + imgParam.name;
        var inPath = imgParam.path;
        var outPath = config.webroot + "public/images/artists/temp_artist/"+param["artist_image"];
        imageHelper.crop(inPath, outPath, function(status){
            if(status){
              param["artist_image"] = artist_image;
            }
        });
    }else{
        
        
        if(param.artist_image){
            var url =  param.artist_image;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var folderPath = config.webroot + 'public/images/artists/temp_artist/';
                var cropFolder = config.webroot + 'public/images/artists/temp_artist/';
                var urlChunk = url.split("/");
                var lastIndex = (urlChunk.length - 1);
                var fileName = urlChunk[lastIndex]; 
                //work for filenames having query string attached
                if(utils.findQueryString(fileName)){
                    var fArr = fileName.split("?");
                    fileName = fArr[0];
                }

                //check if file is a valid image file
                var splitFile = fileName.split(".");
                if(splitFile[1]){
                    var ext = splitFile[1];
                    if(utils.in_array(ext, utils.imgExt)){
                        var imageName = fileName;
                        var artist_image = "Cropped"+fileName+".jpg";
                        var dstPath = folderPath+imageName;                    
                        var cropPath = cropFolder+artist_image; 
                        
                        imageHelper.captureImageNCrop(url, dstPath, cropPath, function(status){
                            if(status == 1){                            
                                param["artist_image"] = artist_image;

                            }
                        }); 
                    }
                }
            }
        }
    }
    if(param.course){
        param["course"] = param.course.join(",");
    }
    tempartist.add(param, function(data){
      res.redirect("/tempartists/public/add");
    });
}

exports.edit = function(req, res){
    var param = req.body;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //res.send(req.files.picture);
        //param["your_email"] = "";
        var artist_image = imgParam.path.split("/")[2] + "-" + imgParam.name;
        var inPath = imgParam.path;
        var outPath = config.webroot + "public/images/artists/temp_artist/"+param["artist_image"];
        imageHelper.crop(inPath, outPath, function(status){
            if(status){
              param["artist_image"] = artist_image;
            }
        });
    }else{
        if(param.artist_image){
           var url =  param.artist_image;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var folderPath = config.webroot + 'public/images/artists/temp_artist/';
                var cropFolder = config.webroot + 'public/images/artists/temp_artist/';
                var urlChunk = url.split("/");
                var lastIndex = (urlChunk.length - 1);
                var fileName = urlChunk[lastIndex]; 
                //work for filenames having query string attached
                if(utils.findQueryString(fileName)){
                    var fArr = fileName.split("?");
                    fileName = fArr[0];
                }

                //check if file is a valid image file
                var splitFile = fileName.split(".");
                if(splitFile[1]){
                    var ext = splitFile[1];
                    if(utils.in_array(ext, utils.imgExt)){
                        var imageName = fileName;
                        var artist_image = "Cropped"+fileName+".jpg";
                        var dstPath = folderPath+imageName;                    
                        var cropPath = cropFolder+artist_image; 
                        
                        imageHelper.captureImageNCrop(url, dstPath, cropPath, function(status){
                            if(status == 1){                            
                                param["artist_image"] = artist_image;

                            }
                        }); 
                    }
                }
            }
        }else{
            param["artist_image"] = param.oldImage;
        }
    }
    if(param.course){
        param["course"] = param.course.join(",");
    }
    tempartist.addByArtist(param, function(data){
        res.redirect("/tempartists/public/edit?url="+param.url);
    });
}



exports.remove = function(req, res){
    var id = req.query.id;
    tempartist.del(id, function(data){
        res.send(data);
    });
}
