
/*
 * Artists controller uses artist model
 */
var artist = require('../models/artist');
var artistCredential = require('../models/artistcredential');
var template = "artists/";
var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');

exports.mycredentials = function(req, res){
    if(req.user){
        res.render(template + '/mycredentials', { 
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
exports.credentials = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    if(req.query){
        if(req.query.url){
            res.render(template + '/credentials', { 
                title: "ArtMojo -- Artist Images ",
                meta_keyword: "Artist, Course, School, Search, Listings",
                meta_description: "Easiest and most convenient way to reach thousands of local artists.",
                url: req.query.url,
                loggedUser: loggedUser
            });
        }else{
            res.redirect("/");
        }
    }
}
exports.getcredentials = function(req, res){
    artistCredential.getcredentials(function(data){
        res.send(data);
    })
}

exports.showAll = function(req, res){
    var artistId = req.session.artistId;
    var credentialId = req.query.cat;
    artistCredential.findByArtist(artistId, credentialId, function(data){
        res.send(data);
    });
    
}

exports.publicAll = function(req, res){
    var url = req.query.url;
    var urlArr = url.split("_");
    var lastIndex = (urlArr.length - 1);
    var artistId = urlArr[lastIndex];
    var credentialId = req.query.cat;
    artistCredential.findByArtist(artistId, credentialId, function(data){
        res.send(data);
    });
    
}


exports.publicadd = function(req, res){
    if(req.user){
        res.render(template + '/credentialadd', { title: 'Add Images', loggedUser: 1 });
    }else{
        res.redirect("/login")
    }
    
}

exports.doaddcredential = function(req, res){
    var param = req.body;
    param["artistId"] = req.session.artistId;
           
    //res.send(param);
    artistCredential.publicadd(param, function(data){
            if(data)
              res.redirect('/artists/mycredentials');
    });
		
}

exports.doeditcredential = function(req, res){
    var param = req.body;
    param["artistId"] = req.session.artistId;
    
    artistCredential.publicedit(param, function(data){
		if(data)
                    res.redirect('/artists/mycredentials');
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    artistCredential.del(id, function(data){
        res.send(data);
    });
}