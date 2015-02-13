
/*
 * Artists controller uses artist model
 */
var artist = require('../models/artist');
var artistAud = require('../models/artistaudio');
var template = "artists/";
var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');

exports.myaudios = function(req, res){
    if(req.user){
        res.render(template + '/myaudios', { 
            title: "ArtMojo -- Artist Audios ",
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
    artistAud.findByArtist(artistId, function(data){
        res.send(data);
    });
    
}

exports.publicAll = function(req, res){
    var url = req.query.url;
    var urlArr = url.split("_");
    var lastIndex = (urlArr.length - 1);
    var artistId = urlArr[lastIndex];
    artistAud.findByArtist(artistId, function(data){
        res.send(data);
    });
    
}


exports.publicadd = function(req, res){
    if(req.user){
        res.render(template + '/audioadd', { title: 'Add Audios', loggedUser: 1 });
    }else{
        res.redirect("/login")
    }
    
}

exports.doaddaudio = function(req, res){
    var param = req.body;
    param["artistId"] = req.session.artistId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var audioCover = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["audioCover"] = audioCover;
        var inPath = imgParam.path;
        var outPath = "./public/audios/artists/additional_audios/cover/"+audioCover;
        imageHelper.resize(inPath, outPath, function(status){
            if(status){
              
            }
        });
    }  
    if(req.files.audio.name){
        var imgParam = req.files.audio;
        //param["your_email"] = "";
        var audio = imgParam.path.split("/")[2] + "-" + imgParam.name;
        var newPath = "./public/audios/artists/additional_audios/"+audio;
        param["audio"] = audio;
        fs.rename(imgParam.path, newPath, function(err){
           console.log(err);
        });     

    }  
    //res.send(param);
    artistAud.publicadd(param, function(data){
            if(data)
              res.redirect('/artists/myaudios');
    });
		
}

exports.doeditaudio = function(req, res){
    var param = req.body;
    param["artistId"] = req.session.artistId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var audioCover = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["audioCover"] = audioCover;
        var inPath = imgParam.path;
        var outPath = "./public/audios/artists/additional_audios/cover/"+audioCover;
        imageHelper.resize(inPath, outPath, function(status){
            
        });
    }else{
        param["audioCover"] = req.body.prevImg;
    }
    if(req.files.audio.name){
        var imgParam = req.files.audio;
        //param["your_email"] = "";
        var audio = imgParam.path.split("/")[2] + "-" + imgParam.name;
        var newPath = "./public/audios/artists/additional_audios/"+audio;
        param["audio"] = audio;
        fs.rename(imgParam.path, newPath, function(err){
           console.log(err);
        });     

    }else{
        param["audio"] = req.body.prevAud;
    }
    artistAud.publicedit(param, function(data){
		if(data)
                    res.redirect('/artists/myaudios');
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    artistAud.del(id, function(data){
        res.send(data);
    });
}