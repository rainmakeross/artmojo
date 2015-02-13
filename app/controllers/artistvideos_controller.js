
/*
 * Artists controller uses artist model
 */
var artist = require('../models/artist');
var artistVid = require('../models/artistvideo');
var template = "artists/";
var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');

exports.myvideos = function(req, res){
    if(req.user){
        res.render(template + '/myvideos', { 
            title: "ArtMojo -- Artist Videos ",
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
    artistVid.findByArtist(artistId, function(data){
        res.send(data);
    });
    
}

exports.publicAll = function(req, res){
    var url = req.query.url;
    var urlArr = url.split("_");
    var lastIndex = (urlArr.length - 1);
    var artistId = urlArr[lastIndex];
    artistVid.findByArtist(artistId, function(data){
        res.send(data);
    });
    
}

exports.publicadd = function(req, res){
    if(req.user){
        res.render(template + '/videoadd', { title: 'Add Videos', loggedUser: 1 });
    }else{
        res.redirect("/login")
    }
    
}

exports.doaddvideo = function(req, res){
    var param = req.body;
    param["artistId"] = req.session.artistId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var videoCover = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["videoCover"] = videoCover;
        var inPath = imgParam.path;
        var outPath = "./public/videos/artists/additional_videos/cover/"+videoCover;
        imageHelper.resize(inPath, outPath, function(status){
            if(status){
              
            }
        });
    }  
    if(req.files.video.name){
        var imgParam = req.files.video;
        //param["your_email"] = "";
        var video = imgParam.path.split("/")[2] + "-" + imgParam.name;
        var newPath = "./public/videos/artists/additional_videos/"+video;
        param["video"] = video;
        fs.rename(imgParam.path, newPath, function(err){
           console.log(err);
        });     

    }  
    //res.send(param);
    artistVid.publicadd(param, function(data){
            if(data)
              res.redirect('/artists/myvideos');
    });
		
}

exports.doeditvideo = function(req, res){
    var param = req.body;
    param["artistId"] = req.session.artistId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var videoCover = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["videoCover"] = videoCover;
        var inPath = imgParam.path;
        var outPath = "./public/videos/artists/additional_videos/cover/"+videoCover;
        imageHelper.resize(inPath, outPath, function(status){
            
        });
    }else{
        param["videoCover"] = req.body.prevImg;
    }
    if(req.files.video.name){
        var imgParam = req.files.video;
        //param["your_email"] = "";
        var video = imgParam.path.split("/")[2] + "-" + imgParam.name;
        var newPath = "./public/videos/artists/additional_videos/"+video;
        param["video"] = video;
        fs.rename(imgParam.path, newPath, function(err){
           console.log(err);
        });     

    }else{
        param["video"] = req.body.prevVid;
    }
    artistVid.publicedit(param, function(data){
		if(data)
                    res.redirect('/artists/myvideos');
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    artistVid.del(id, function(data){
        res.send(data);
    });
}