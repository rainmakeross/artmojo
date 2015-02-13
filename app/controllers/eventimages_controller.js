
/*
 * Events controller uses event model
 */
var event = require('../models/event');
var eventImg = require('../models/eventimage');
var template = "events/";
var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');

exports.myimages = function(req, res){
    if(req.user){
        res.render(template + '/myimages', { 
            title: "ArtMojo -- Event Images ",
            meta_keyword: "Event, Course, School, Search, Listings",
            meta_description: "Easiest and most convenient way to reach thousands of local events.",
            eventId: req.user.eventId,
            loggedUser: 1
        });
    }else{
        res.redirect("/login")
    }
}

exports.showAll = function(req, res){
    var eventId = req.session.eventId;
    eventImg.findByEvent(eventId, function(data){
        res.send(data);
    });
    
}

exports.publicAll = function(req, res){
    var url = req.query.url;
    var urlArr = url.split("_");
    var lastIndex = (urlArr.length - 1);
    var eventId = urlArr[lastIndex];
    eventImg.findByEvent(eventId, function(data){
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
    param["eventId"] = req.session.eventId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var image = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["image"] = image;
        var inPath = imgParam.path;
        var outPath = "./public/images/events/thumb/"+image;
        imageHelper.resize(inPath, outPath, function(status){
            if(status){
              
            }
        });
    }else{
        param["image"] = "";
    }        
    //res.send(param);
    eventImg.publicadd(param, function(data){
            if(data)
              res.redirect('/events/myimages');
    });
		
}

exports.doeditimage = function(req, res){
    var param = req.body;
    param["eventId"] = req.session.eventId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var image = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["event_image"] = image;
        var inPath = imgParam.path;
        var outPath = "./public/images/events/thumb/"+image;
        imageHelper.resize(inPath, outPath, function(status){
            if(status){
              //param["event_image"] = event_image;
              if(req.body.prevImg){
                    if(req.body.prevImg != image){
                        var file = "./public/images/events/thumb/"+param.oldImage;
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
    eventImg.publicedit(param, function(data){
		if(data)
                    res.redirect('/events/myimages');
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    eventImg.del(id, function(data){
        res.send(data);
    });
}