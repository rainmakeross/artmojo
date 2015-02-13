
/*
 * Courses controller uses course model
 */
var course = require('../models/course');
var courseImg = require('../models/courseimage');
var template = "courses/";
var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');

exports.myimages = function(req, res){
    if(req.user){
        res.render(template + '/myimages', { 
            title: "ArtMojo -- Course Images ",
            meta_keyword: "Course, Course, School, Search, Listings",
            meta_description: "Easiest and most convenient way to reach thousands of local courses.",
            courseId: req.user.courseId,
            loggedUser: 1
        });
    }else{
        res.redirect("/login")
    }
}

exports.showAll = function(req, res){
    var courseId = req.session.courseId;
    courseImg.findByCourse(courseId, function(data){
        res.send(data);
    });
    
}

exports.publicAll = function(req, res){
    var url = req.query.url;
    var urlArr = url.split("_");
    var lastIndex = (urlArr.length - 1);
    var courseId = urlArr[lastIndex];
    courseImg.findByCourse(courseId, function(data){
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
    param["courseId"] = req.session.courseId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var image = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["image"] = image;
        var inPath = imgParam.path;
        var outPath = "./public/images/courses/additional_images/"+image;
        imageHelper.resize(inPath, outPath, function(status){
            if(status){
              
            }
        });
    }else{
        param["image"] = "";
    }        
    //res.send(param);
    courseImg.publicadd(param, function(data){
            if(data)
              res.redirect('/courses/myimages');
    });
		
}

exports.doeditimage = function(req, res){
    var param = req.body;
    param["courseId"] = req.session.courseId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var image = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["event_image"] = image;
        var inPath = imgParam.path;
        var outPath = "./public/images/courses/additional_images/"+image;
        imageHelper.resize(inPath, outPath, function(status){
            if(status){
              //param["event_image"] = event_image;
              if(req.body.prevImg){
                    if(req.body.prevImg != image){
                        var file = "./public/images/courses/additional_images/"+param.oldImage;
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
    courseImg.publicedit(param, function(data){
		if(data)
                    res.redirect('/courses/myimages');
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    courseImg.del(id, function(data){
        res.send(data);
    });
}