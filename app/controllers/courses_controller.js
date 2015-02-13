
/*
 * Courses controller uses course model
 */
var course = require('../models/course');
var subject = require('../models/subject');
var artist = require('../models/artist');
var template = "courses/";
var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');



exports.full = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- Courses. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}

exports.listall = function(req, res){
    course.listall(function(data){
        res.send(data);
    });
}

exports.publicadd = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    if(req.user){
        loggedUser = 1;
        userId = req.user.id;
    }
    
    res.render(template + '/add', { 
        title: 'Post Course', 
        loggedUser: loggedUser, 
        userId: userId  
    });
    
}

exports.publicedit = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    
    if(req.query){
        if(req.query.id.length){
            var jobId = req.query.id; 
            loggedUser = 1;
            userId = req.user.id; 
            course.fetchDatabyId(jobId, function(data){
                res.render(template + '/edit', { 
                            title: 'Edit Course', 
                            loggedUser: loggedUser, 
                            userId: userId,
                            course: data
                        });
            });
        }
        
    }
}

exports.doadd = function(req, res){
    var param = req.body;
    course.checkCourseByTitle(param, 0, function(data){
        //console.log(data);
        if(data){            
            if(req.files.picture.name){
                var imgParam = req.files.picture;
                //param["your_email"] = "";
                var course_image = imgParam.path.split("/")[2] + "-" + imgParam.name;
                param["course_image"] = course_image;
                var inPath = imgParam.path;
                var outPath = "./public/images/courses/"+course_image;
                imageHelper.resize(inPath, outPath, function(status){
                    if(status){
                        console.log(status);
                    }
                });
            }else{
                param["course_image"] = "";
            }
            course.add(param, function(data){
                console.log(data);
                res.redirect('/allcourses');
            }); 
        }else{
            req.session.coursesavemsg = "Name has to be unique.";
            res.redirect('/courses/public/add');
        }
    })
          
    
    //res.send(param);
    
		
}

exports.doedit = function(req, res){
    var param = req.body;
    
    var courseId = param.courseId;
    course.checkCourseByTitle(param, courseId, function(data){
        if(data){
            if(req.files.picture.name){
                var imgParam = req.files.picture;
                //param["your_email"] = "";
                var course_image = imgParam.path.split("/")[2] + "-" + imgParam.name;
                param["course_image"] = course_image;
                var inPath = imgParam.path;
                var outPath = "./public/images/courses/"+course_image;
                imageHelper.resize(inPath, outPath, function(status){
                    if(status){

                    }
                });
            }else{
                param["course_image"] = param.prevImg;
            }
            
            course.edit(param, function(data){
                    console.log(data);
                    res.redirect('/allcourses');
                            
                });
        }else{
            req.session.coursesavemsg = "Name has to be unique.";
            res.redirect('/courses/public/edit?id='+courseId);
        }
    })
          
    
    //res.send(param);
    
		
}



exports.index = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    
    res.render(template + '/search', { 
        title: "ArtMojo -- Artists ",
        meta_keyword: "Artist, Course, School, Search, Listings",
        meta_description: "Easiest and most convenient way to reach thousands of local courses.", 
        courseName: req.body.courseName,
        location: req.body.location,
        loggedUser: loggedUser,
        tabVal: 'course'
    });
}

exports.list = function(req, res){
    course.showList(function(data){
        res.send(data);
    });
    
};

exports.all = function(req, res){
    course.showAll(function(data){
        res.send(data);
    });
    
};

exports.search = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    
    res.render(template + '/search', { 
        title: "ArtMojo -- Search ",
        meta_keyword: "Artists, Courses, Schools, Events, Jobs, Search, Listings",
        meta_description: "Easiest and most convenient way to reach thousands of local artists, art classes and schools and stay updated with the latest and upcoming events and jobs.", 
        courseName: req.body.courseName,
        location: req.body.location,
        loggedUser: loggedUser
    });
};



exports.results = function(req, res){
    var param = req.query;
    var regExpStr = "%";
    if(param.courseName){
        param.courseName = param.courseName.replace(/^\s+|\s+$/g, "");
        var regExpStr = param.courseName.replace('-', '|');
        regExpStr = regExpStr.replace(' ', '|');
        regExpStr = regExpStr.replace(',', '|');
        regExpStr = regExpStr+"|1";
        var strArr = regExpStr.split("|");
        //console.log(strArr[0]);
        var regCStr = "1";
        if(strArr.length){
            if(strArr.length > 0){
                for(var i=0; i<strArr.length; i++){
                    //console.log(strArr[i]);
                    if(strArr[i]){                
                        if(i > 0){
                            if((strArr[i] == 'artist') || (strArr[i] == 'artists') || (strArr[i] == 'school') || (strArr[i] == 'schools')){
                                console.log(strArr[i]);
                                //skip
                            }else{
                                regCStr += "|" +strArr[i];
                            }
                        }else{
                            regCStr += "|" +strArr[i];
                        }

                    }

                }
            }
        }
        
        regExpStr = regCStr;
        
    }
    
    var regExpCityStr = "%";
    if(param.location){
        param.location = param.location.replace(/^\s+|\s+$/g, "");
        regExpCityStr = param.location.replace(',', '|');
        regExpCityStr = regExpCityStr.replace(' ', '|');
        regExpCityStr = regExpCityStr.replace(',', '|');
        regExpCityStr = regExpCityStr+"|1";
        var strArr = regExpCityStr.split("|");
        var regCtStr = "1";
        for(var i=0; i<strArr.length; i++){
            if(strArr[i]){
               regCtStr += "|" +strArr[i];
            }
        }
        regExpCityStr = regCtStr;
    }
    param['reg_exp_name'] = regExpStr;
    param['reg_exp_city'] = regExpCityStr;
    course.fetchData(param, function(data){
        res.send(data);
    });
}

exports.show = function(req, res){
    var categoryid = req.query.categoryId;
    course.show(categoryid, function(data){
        res.send(data);
    });
}

exports.showListByCategory = function(req, res){
    var categoryid = req.query.cid;
    course.showListByCategory(categoryid, function(data){
        res.send(data);
    });
}

exports.autocomplete = function(req, res){
    var param = req.query;
    
    course.getCourses(param, function(data){
        var obj = {};
        
        if(data.length){            
            for(var i=0; i<data.length;i++){
                obj[data[i].course_name] = data[i].course_name;
            }
            //res.send(obj);
        }
        subject.getSubjects(param, function(subjects){
                
                if(subjects.length){
                    for(var j=0; j<subjects.length; j++){
                        obj[subjects[j].subject_name+"-("+subjects[j].courseName+")"] = subjects[j].subject_name+"-("+subjects[j].courseName+")";
                    }
                }
                res.send(obj);
            });
         
    });
}

exports.loadcourses = function(req, res){
    
    course.loadCourses(function(data){
        res.send(data);
    });
}

exports.view = function(req, res){
    var url = req.query.url;
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    course.showDetails(url, function(data){
        var keyword = data.course_name;
        if(data.citytag){
            keyword += ","+data.citytag;
        }
        if(data.artist_tag){
            keyword += ","+data.artist_tag;
        }
        if(data.school_tag){
            keyword += ","+data.school_tag;
        }
        res.render(template + '/view', { 
            title: data.course_name,
            meta_keyword: keyword,
            meta_description: data.course_description, 
            course: data,
            loggedUser: loggedUser
        });
    });
}

exports.showartists = function(req, res){
    var id = req.query.id;
    course.showArtist(id, function(data){
        res.send(data);
    });
}

exports.showschools = function(req, res){
    var id = req.query.id;
    course.showSchool(id, function(data){
        res.send(data);
    });
}

exports.getsubject = function(req, res){
    var id = req.query.id;
    course.loadSubject(id, function(data){
        res.send(data);
    });
}

exports.filterartists = function(req, res){
    var param = req.body;
    course.loadArtistByFilter(param, function(data){
        res.send(data);
    });
}

exports.filterschools = function(req, res){
    var param = req.body;
    course.loadSchoolByFilter(param, function(data){
        res.send(data);
    });
}

exports.filterResults = function(req, res){
    var param = req.body;
    var regExpStr = param.courseName.replace('-', '|');
    regExpStr = regExpStr.replace(' ', '|');
    regExpStr = regExpStr.replace(',', '|');
    var regExpCityStr = param.location.replace(',', '|');
    param['reg_exp_name'] = regExpStr;
    param['reg_exp_city'] = regExpCityStr;
    course.fetchData(param, function(data){
        res.send(data);
    })
}


exports.artistCourses = function(req, res){
    if(req.query){
       if(req.query.artistId.length) {
           var artistId = req.query.artistId;
           artist.getCourses(artistId, function(data){
               console.log(data);
               if(data.length){
                  var courses = data[0].courses;
                  course.getCoursesBIds(courses, function(data){
                      res.send(data);
                  })
               }
           })
       }
    }
}