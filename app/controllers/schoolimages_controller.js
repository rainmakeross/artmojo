
/*
 * Schools controller uses school model
 */
var school = require('../models/school');
var schoolImg = require('../models/schoolimage');
var template = "schools/";
var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');

exports.myimages = function(req, res){
    if(req.user){
        res.render(template + '/myimages', { 
            title: "ArtMojo -- School Images ",
            meta_keyword: "School, Course, School, Search, Listings",
            meta_description: "Easiest and most convenient way to reach thousands of local schools.",
            schoolId: req.user.schoolId,
            loggedUser: 1
        });
    }else{
        res.redirect("/login")
    }
}

exports.showAll = function(req, res){
    var schoolId = req.session.schoolId;
    schoolImg.findBySchool(schoolId, function(data){
        res.send(data);
    });
    
}

exports.publicAll = function(req, res){
    var url = req.query.url;
    var urlArr = url.split("_");
    var lastIndex = (urlArr.length - 1);
    var schoolId = urlArr[lastIndex];
    schoolImg.findBySchool(schoolId, function(data){
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
    param["schoolId"] = req.session.schoolId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var image = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["image"] = image;
        var inPath = imgParam.path;
        var outPath = "./public/images/schools/thumb/"+image;
        imageHelper.resize(inPath, outPath, function(status){
            if(status){
              
            }
        });
    }else{
        param["image"] = "";
    }        
    //res.send(param);
    schoolImg.publicadd(param, function(data){
            if(data)
              res.redirect('/schools/myimages');
    });
		
}

exports.doeditimage = function(req, res){
    var param = req.body;
    param["schoolId"] = req.session.schoolId;
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        //param["your_email"] = "";
        var image = imgParam.path.split("/")[2] + "-" + imgParam.name;
        param["event_image"] = image;
        var inPath = imgParam.path;
        var outPath = "./public/images/schools/thumb/"+image;
        imageHelper.resize(inPath, outPath, function(status){
            if(status){
              //param["event_image"] = event_image;
              if(req.body.prevImg){
                    if(req.body.prevImg != image){
                        var file = "./public/images/schools/thumb/"+param.oldImage;
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
    schoolImg.publicedit(param, function(data){
		if(data)
                    res.redirect('/schools/myimages');
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    schoolImg.del(id, function(data){
        res.send(data);
    });
}