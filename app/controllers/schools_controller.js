
/*
 * Schools controller uses school model
 */
var school = require('../models/school');
var template = "schools/";
var courseTemplate = "courses/";
var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');
var city = require('../models/city');

exports.all = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- Schools. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}
exports.listall = function(req, res){
    school.listall(function(data){
        res.send(data);
    });
}

exports.index = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    
    res.render(courseTemplate + '/search', { 
        title: "ArtMojo -- Schools ",
        meta_keyword: "Artist, Course, School, Search, Listings",
        meta_description: "Easiest and most convenient way to reach thousands of local schools.", 
        courseName: req.body.courseName,
        location: req.body.location,
        loggedUser: loggedUser,
        tabVal: 'school'
    });
}

exports.loadmentors = function(req, res){
    
    school.loadMentors(function(data){
        res.send(data);
    });
}
exports.publicadd = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    res.render(template + '/publicadd', { title: 'Add Listing', loggedUser: loggedUser });
}
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
    school.fetchData(param, function(data){
        res.send(data);
    });
}
exports.getNames = function(req, res){
    school.getNames(function(data){
        res.send(data);
    });
}

exports.view = function(req, res){
    var url = req.query.url;
    var loggedIn = 0;
    if(req.user){
        loggedIn = 1;
    }
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    school.showDetails(url, function(data){
        if(data){
            var desc = data.school_name;
            if(data.description){
                desc = data.description;
            }
            var keyword = "Artmojo";
            if(data.school_name){
                keyword += ","+data.school_name;
            }
            if(data.location){
                keyword += ","+data.location;
            }
            if(data.phone){
                keyword += ","+data.phone;
            }
            if(data.email){
                keyword += ","+data.email;
            }
            if(data.website){
                keyword += ","+data.website;
            }
            var website = "";
            if(data.website){
                website = data.website;
                var urlInt = website.substr(0,4);
                if(urlInt != 'http'){
                    website = 'http://'+website;
                }
            }
            var totalRate = (data.total_rate * 4);
            res.render(template + '/view', {             
                title: data.school_name+" @ "+data.location,
                meta_keyword: keyword,
                meta_description: desc, 
                school: data,
                website: website,
                totalRate: totalRate,
                logStatus : loggedIn,
                loggedUser: loggedUser

            });
        }else{
            res.redirect("/schools");
        }
        
    });
}

exports.showcourses = function(req, res){
    var id = req.query.id;
    school.showCourse(id, function(data){
        res.send(data);
    });
}

exports.showartists = function(req, res){
    var id = req.query.id;
    school.showArtist(id, function(data){
        res.send(data);
    });
}


exports.showreviews = function(req, res){
    var id = req.query.id;
    school.showReview(id, function(data){
        res.send(data);
    });
}

exports.addreview = function(req, res){
    var param = req.body;
    var userId = req.user.id;
    school.addReview(userId, param, function(data){
        res.send(data);
    });
}

exports.filterResults = function(req, res){
    var param = req.body;
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
    school.fetchData(param, function(data){
        res.send(data);
    })
}

exports.rateSchool = function(req, res){
    var param = req.body;
    if(req.user){
        var userId = req.user.id;
        
        school.addRating(param, userId, function(data){
            if(data == 0){
                var obj = { "message": "You have already voted", "avgRate": 0 };
                res.send(obj); 
            }else{
                var obj = { "message": "Vote successfully saved", "avgRate": data };
                res.send(obj); 
            }
        });        
    }else{
        var obj = { "message": "Please login to vote" };
        res.send(obj);
    }
}

exports.viewlist = function(req, res){
    if(req.user){
        var userId = req.user.id;
        school.viewlist(userId, function(data){
            if(data){
                res.send(data);
            }
        });    
    }else{
        res.redirect("/login");
    }
    
}

exports.addtolist = function(req, res){
    if(req.user){
        var schoolId = req.query.id;
        var userId = req.user.id;
        school.addtolist(schoolId, userId, function(data){
            if(data == 0){
                res.send("School is already in your list");
            }else{
                res.send("School added in your list");
            }
        });    
    }else{
        res.send("Please login to use this action.");
    }
}

exports.getcourses = function(req, res){
    var id = req.query.id;
    school.getCourses(id, function(data){
        res.send(data);
    });
}

exports.fetchImages = function(req, res){
    school.fetchImages(function(data){
        if(data){
            var id = 0;
            var school_image = "";
            for(var i=0; i < data.length; i++){
                var url =  data[i].image_url;
                var id = data[i].id;
                var urlInt = url.substr(0,4);
                if(urlInt == 'http'){
                    var folderPath = './public/images/schools/';
                    var cropFolder = './public/images/schools/thumb/';
                    var urlChunk = url.split("/");
                    var lastIndex = (urlChunk.length - 1);
                    var fileName = urlChunk[lastIndex]; 
                    //work for filenames having query string attached
                    var intFilename = false;
                    utils.findQueryString(fileName, function(inDataFile){
                        intFilename = inDataFile;
                    });
                    if(intFilename){
                        var fArr = fileName.split("?");
                        fileName = fArr[0];
                    }
                    //check if file is a valid image file
                    var splitFile = fileName.split(".");
                    var lastIndexS = (splitFile.length - 1);
                    if(splitFile[lastIndexS]){
                        var ext = splitFile[lastIndexS];
                        if(utils.in_array(ext, utils.imgExt)){
                            
                            var imageName = id+fileName;
                            var school_image = "Resized"+id+".jpg";
                            var dstPath = folderPath+"Resized"+id+"-"+imageName;                    
                            var cropPath = cropFolder+school_image; 
                            
                            var sqlStatement = "update schools set school_image = '"+school_image+"', localImg = '1' where id = '"+id+"' ";
                            var rejectStatement = "update schools set school_image = null, localImg = '0' where id = '"+id+"' ";
                            imageHelper.captureImageNResizeNUpdate(sqlStatement, rejectStatement, url, dstPath, cropPath, function(status){
                                if(status == 1){                            
                                    
                                }
                            });
                        }
                    }
                }
            }
            res.send(i+" images updated");
        }
    });
}



exports.loadschools = function(req, res){
    //console.log("here");
    var city = "";
    if(req.cookies){
        if(req.cookies.userCity){
            city = req.cookies.userCity;
        }    
    }
    school.loadSchools(city, function(data){
        res.send(data);
    });
}

exports.mylist = function(req, res){
    
    
    if(req.user){
        res.render(template + '/mylist', { 
            title: 'ArtMojo -- Schools. ',
            meta_keyword: "Artmojo, Search, Schools, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }
     
		
}
exports.loadMySchools = function(req, res){
    var userId = req.user.id;
    school.loadMySchools(userId, function(data){
       res.send(data);
    });
}

exports.operatoradd = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    var userEmail = "";
    var operator = "";
    if(req.user){
        loggedUser = 1;
        userId = req.user.id;
        operator = req.user.first_name; 
        userEmail = req.user.email; 
    }
    
    res.render(template + '/operatoradd', { 
        title: 'Post School', 
        loggedUser: loggedUser, 
        userId: userId, 
        operator: operator, 
        userEmail: userEmail  
    });
    
}

exports.operatoredit = function(req, res){
    //console.log(req.user);
    if(req.query.id){   
        var userId = req.user.id;
        var schoolId = req.query.id;
        //check whether school is associated with user
        school.fetchDatabyId(schoolId, function(data){
            if(data){
                var pasteUrl = data.school_image;
                if(data.localImg == 1){
                    pasteUrl = "";
                }
                var cityId = data.cityId;
                city.getState(cityId, function(state){
                    if(state){
                       res.render(template + '/operatoredit', { 
                            title: 'Edit School',
                            meta_keyword: 'Artmojo, Profile',
                            meta_description: 'Artmojo Profile page',
                            loggedUser: "1",
                            school: data,
                            pasteUrl: pasteUrl,
                            country: state.countryId,
                            state: state.id
                        }); 
                    }
                });
            }
        });   
    }else{
       res.redirect('/myschools'); 
    }
    
    
};

exports.doadd = function(req, res){
    var param = req.body;
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    var courseArr = new Array();
    courseArr = param.course;
    var email = param.email;
    var operatorId = req.user.id;
    var operator = req.user.first_name;
    school.checkSchoolByEmail(email, 0, function(data){
        if(data){
            param["operator"] = operator;  
            param["operatorId"] = operatorId;
            if(req.files.picture.name){
                var imgParam = req.files.picture;
                var inPath = imgParam.path;
                var school_image = "Resized"+randomNum+".jpg";
                var outPath = "./public/images/schools/thumb/"+school_image;
                param["school_image"] = school_image;

                imageHelper.resize(inPath, outPath, function(status){
                    console.log(status);
                });
            }else{
                if(param.school_image){
                    var url =  param.school_image;
                    var id = 1;
                    var urlInt = url.substr(0,4);
                    if(urlInt == 'http'){
                        var folderPath = './public/images/schools/';
                        var cropFolder = './public/images/schools/thumb/';
                        var urlChunk = url.split("/");
                        var lastIndex = (urlChunk.length - 1);
                        var fileName = urlChunk[lastIndex]; 
                        //work for filenames having query string attached
                        var intFilename = false;
                        utils.findQueryString(fileName, function(inDataFile){
                            intFilename = inDataFile;
                        });
                        if(intFilename){
                            var fArr = fileName.split("?");
                            fileName = fArr[0];
                        }

                        //check if file is a valid image file
                        var splitFile = fileName.split(".");
                        if(splitFile[1]){
                            var ext = splitFile[1];
                            var inArray = true;
                            utils.in_array(ext, utils.imgExt, '', function(inDataArr){
                                inArray = inDataArr;
                            });
                            if(inArray){
                                var imageName = id+fileName;
                                var school_image = "Resized"+randomNum+".jpg";
                                var dstPath = folderPath+"Resized"+imageName;                    
                                var cropPath = cropFolder+school_image; 
                                param["school_image"] = school_image;
                                imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                                    if(status == 0){                            
                                       param["school_image"] = null;
                                    }
                                }); 
                            }
                        }
                    }
                }else{
                    param["school_image"] = null;
                }
            }
            school.doadd(param, function(data){
                if(data){
                    var schoolId = data.id;
                    courseArr = [].concat( param.course );
                    if(courseArr){
                        if(courseArr.length > 0){
                           //console.log(courseArr.length);
                            if(courseArr.length > 1){
                                var cArr = courseArr.join("','");
                            }else{
                                var cArr = courseArr;
                            }
                            school.saveCourse(schoolId, cArr, function(Tdata){
                                if(Tdata == 'success'){
                                    res.redirect("/myschools");
                                }
                            });

                        }    
                    }else{
                        school.delTeaching(schoolId, function(Tdata){
                            if(Tdata){
                                res.redirect("/myschools");
                            }
                        });
                    }    
                }

            });
        }else{
            res.redirect("/schools/operator/add");
        }
    });
}

exports.doedit = function(req, res){
    var param = req.body;
    var schoolId = param.id;
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    var courseArr = new Array();
    courseArr = param.course;
    var email = param.email;
    var operatorId = req.user.id;
    var operator = req.user.first_name;
    param["operator"] = operator;  
    param["operatorId"] = operatorId;
    school.checkSchoolByEmail(email, schoolId, function(data){
        if(data){
            if(req.files.picture.name){
                var imgParam = req.files.picture;
                var inPath = imgParam.path;
                var school_image = "Resized"+schoolId+randomNum+".jpg";
                var outPath = "./public/images/schools/thumb/"+school_image;
                param["school_image"] = school_image;

                imageHelper.resize(inPath, outPath, function(status){
                    console.log(status);            
                });
            }else{
                if(param.school_image){
                    var url =  param.school_image;
                    var id = schoolId;
                    var urlInt = url.substr(0,4);
                    if(urlInt == 'http'){
                        var folderPath = './public/images/schools/';
                        var cropFolder = './public/images/schools/thumb/';
                        var urlChunk = url.split("/");
                        var lastIndex = (urlChunk.length - 1);
                        var fileName = urlChunk[lastIndex]; 
                        //work for filenames having query string attached
                        var intFilename = false;
                        utils.findQueryString(fileName, function(inDataFile){
                            intFilename = inDataFile;
                        });
                        if(intFilename){
                            var fArr = fileName.split("?");
                            fileName = fArr[0];
                        }

                        //check if file is a valid image file
                        var splitFile = fileName.split(".");
                        if(splitFile[1]){
                            var ext = splitFile[1];
                            var inArray = true;
                            utils.in_array(ext, utils.imgExt, '', function(inDataArr){
                                inArray = inDataArr;
                            });
                            if(inArray){
                                var imageName = id+fileName;
                                var school_image = "Resized"+schoolId+randomNum+".jpg";
                                var dstPath = folderPath+"Resized"+schoolId+imageName;                    
                                var cropPath = cropFolder+school_image; 
                                param["school_image"] = school_image;
                                imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                                    if(status == 0){                            
                                        param["school_image"] = null;
                                    }
                                }); 
                            }
                        }
                    }
                }else{
                    param["school_image"] = null;
                }
            }
            school.edit(param, function(result){
                courseArr = [].concat( param.course );
                if(courseArr){
                    if(courseArr.length > 0){
                       //console.log(courseArr.length);
                        if(courseArr.length > 1){
                            var cArr = courseArr.join("','");
                        }else{
                            var cArr = courseArr;
                        }
                        school.saveCourse(schoolId, cArr, function(Tdata){
                            if(Tdata == 'success'){
                                if(req.user.user_typeId == 1){
                                    res.redirect('/allschools');
                                }else if(req.user.user_typeId == 3){
                                    res.redirect('/myschools');
                                }

                            }
                        });

                    }    
                }else{
                    school.delTeaching(schoolId, function(Tdata){
                        if(Tdata){
                            if(req.user.user_typeId == 1){
                                res.redirect('/allschools');
                            }else if(req.user.user_typeId == 3){
                                res.redirect('/myschools');
                            }
                        }
                    });
                }


            });         
        }else{
            res.redirect("/schools/operator/edit?id="+schoolId);
        }
    });
    
}