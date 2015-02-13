
/*
 * Artists controller uses artist model
 */
var artist = require('../models/artist');
var artistImg = require('../models/artistimage');
var template = "artists/";
var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');

exports.myimages = function(req, res){
    if(req.user){
        res.render(template + '/myimages', { 
            title: "ArtMojo -- Artist Images ",
            meta_keyword: "Artist, Course, School, Search, Listings",
            meta_description: "Easiest and most convenient way to reach thousands of local artists.",
            artistId: req.user.artistId,
            loggedUser: 1
        });
    }else{
        res.redirect("/login")
    }
}

exports.showAll = function(req, res){
    var artistId = req.session.artistId;
    artistImg.findByArtist(artistId, function(data){
        res.send(data);
    });
    
}

exports.publicAll = function(req, res){
    var url = req.query.url;
    var urlArr = url.split("_");
    var lastIndex = (urlArr.length - 1);
    var artistId = urlArr[lastIndex];
    artistImg.findByArtist(artistId, function(data){
        res.send(data);
    });
    
}


exports.publicadd = function(req, res){
    if(req.user){
        res.render(template + '/imageadd', { title: 'Add Images', loggedUser: 1 });
    }else{
        res.redirect("/login")
    }
    
}

exports.doaddimage = function(req, res){
    var param = req.body;
    param["artistId"] = req.session.artistId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var image = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["image"] = image;
        var inPath = imgParam.path;
        var outPath = "./public/images/artists/thumb/"+image;
        imageHelper.resize(inPath, outPath, function(status){
            if(status){
              
            }
        });
    }else{
        param["image"] = "";
    }        
    //res.send(param);
    artistImg.publicadd(param, function(data){
            if(data)
              res.redirect('/artists/myimages');
    });
		
}

exports.doeditimage = function(req, res){
    var param = req.body;
    param["artistId"] = req.session.artistId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var image = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["event_image"] = image;
        var inPath = imgParam.path;
        var outPath = "./public/images/artists/thumb/"+image;
        imageHelper.resize(inPath, outPath, function(status){
            if(status){
              //param["event_image"] = event_image;
              if(req.body.prevImg){
                    if(req.body.prevImg != image){
                        var file = "./public/images/artists/thumb/"+param.oldImage;
                        if(fs.existsSync(file)){
                            fs.unlinkSync(file);
                        }
                    }                
                }
            }
        });
    }else{
        param["image"] = req.body.prevImg;
    }
    artistImg.publicedit(param, function(data){
		if(data)
                    res.redirect('/artists/myimages');
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    artistImg.del(id, function(data){
        res.send(data);
    });
}