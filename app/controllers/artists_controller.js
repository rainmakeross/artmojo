
/*
 * Artists controller uses artist model
 */
var artist = require('../models/artist');
var artistVid = require('../models/artistvideo');
var template = "artists/";
var courseTemplate = "courses/";
var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');
var city = require('../models/city');

exports.all = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- Artists. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}

exports.listall = function(req, res){
    artist.listall(function(data){
        res.send(data);
    });
}
exports.index = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    
    res.render(courseTemplate + '/search', { 
        title: "ArtMojo -- Artists ",
        meta_keyword: "Artist, Course, School, Search, Listings",
        meta_description: "Easiest and most convenient way to reach thousands of local artists.", 
        courseName: req.body.courseName,
        location: req.body.location,
        loggedUser: loggedUser,
        tabVal: 'artist'
    });
}

exports.loadmentors = function(req, res){
    var city = "";
    if(req.cookies){
        if(req.cookies.userCity){
            city = req.cookies.userCity;
        }    
    }
    artist.loadMentors(city, function(data){
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



exports.view = function(req, res){
    var url = req.query.url;
    var loggedIn = 0;
    var loggedUser = 0;
    if(req.user){
        loggedIn = 1;
        loggedUser = 1;
    }
    artist.showDetails(url, function(data){
        if(data){
            var desc = data.full_name;
            if(data.description){
                desc = data.description;
            }
            var keyword = "Artmojo";
            if(data.first_name){
                keyword += ","+data.first_name;
            }
            if(data.last_name){
                keyword += ","+data.last_name;
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
            var totalRate = (data.total_rate * 4);
            var img = '/images/dummy_user.gif';
            var website = "";
            if(data.website){
                website = data.website;
                var urlInt = website.substr(0,4);
                if(urlInt != 'http'){
                    website = 'http://'+website;
                }
            }
            data.url = url;

            res.render(template + '/view', { 
                title: data.first_name+" "+data.last_name+" @ "+data.location,
                meta_keyword: keyword,
                meta_description: desc, 
                artist: data,
                website: website,
                totalRate: totalRate,
                logStatus : loggedIn,
                loggedUser: loggedUser
            });
        }else{
            res.redirect("/artists");
        }
    });
}

exports.showcourses = function(req, res){
    var id = req.query.id;
    artist.showTeachingCourse(id, function(data){
        res.send(data);
    });
}

exports.showinterests = function(req, res){
    var id = req.query.id;
    artist.showInterestCourse(id, function(data){
        res.send(data);
    });
}

exports.showschools = function(req, res){
    var id = req.query.id;
    artist.showSchool(id, function(data){
        res.send(data);
    });
}

exports.showreviews = function(req, res){
    var id = req.query.id;
    artist.showReview(id, function(data){
        res.send(data);
    });
}

exports.makePrivate = function(req, res){
    var userId = req.user.id;
    artist.makePrivate(userId, function(data){
        res.redirect("/profile");
    });
    
}

exports.makePublic = function(req, res){
    var userId = req.user.id;
    artist.makePublic(userId, function(data){
        res.redirect("/profile");
    });
}

exports.addreview = function(req, res){
    var param = req.body;
    var userId = req.user.id;
    artist.addReview(userId, param, function(data){
        res.send(data);
    });
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
    /*artist.dosearch(param, function(data){
        res.send(data);
    });*/
    artist.fetchData(param, function(data){
        res.send(data);
    })
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
    artist.fetchData(param, function(data){
        res.send(data);
    });
}

exports.rateArtist = function(req, res){
    var param = req.body;
    if(req.user){
        var userId = req.user.id;
        
        artist.addRating(param, userId, function(data){
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

exports.addtolist = function(req, res){
    if(req.user){
        var artistId = req.query.id;
        var userId = req.user.id;
        artist.addtolist(artistId, userId, function(data){
            if(data == 0){
                res.send("Artist is already in your list");
            }else{
                res.send("Artist added in your list");
            }
        });    
    }else{
        res.send("Please login to use this action.");
    }
    
}

exports.viewlist = function(req, res){
    if(req.user){
        var userId = req.user.id;
        artist.viewlist(userId, function(data){
            if(data){
                res.send(data);
            }
        });    
    }else{
        res.redirect("/login");
    }
    
}

//CRUD methods



exports.edit = function(req, res){
    var param = req.body;
    var artistId = param.id;
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    var courseArr = new Array();
    courseArr = param.course;
    //console.log(courseArr);
    
    var interestArr = new Array();
    interestArr = param.interest
    //console.log(interestArr);
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        var inPath = imgParam.path;
        var artist_image = "Resized"+artistId+randomNum+".jpg";
        var outPath = "./public/images/artists/thumb/"+artist_image;
        param["artist_image"] = artist_image;
        
        imageHelper.resize(inPath, outPath, function(status){
            console.log(status);            
        });
    }else{
        if(param.artist_image){
            var url =  param.artist_image;
            var id = artistId;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var folderPath = './public/images/artists/';
                var cropFolder = './public/images/artists/thumb/';
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
                        var artist_image = "Resized"+artistId+randomNum+".jpg";
                        var dstPath = folderPath+"Resized"+artistId+imageName;                    
                        var cropPath = cropFolder+artist_image; 
                        param["artist_image"] = artist_image;
                        imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                            if(status == 1){                            
                                //need some code?
                            }
                        }); 
                    }
                }
            }
        }else{
            param["artist_image"] = null;
        }
    }
    artist.edit(param, function(data){
        courseArr = [].concat( param.course );
        if(courseArr){
            if(courseArr.length > 0){
               //console.log(courseArr.length);
                if(courseArr.length > 1){
                    var cArr = courseArr.join("','");
                }else{
                    var cArr = courseArr;
                }
                artist.saveCourse(artistId, cArr, function(Tdata){
                    if(Tdata == 'success'){
                        //res.redirect("/profile");
                        //console.log(interestArr);
                        interestArr = [].concat( param.interest );
                        if(interestArr){
                            if(interestArr.length > 0){                              
                              
                              if(interestArr.length > 1){
                                  var iArr = interestArr.join("','");
                              }else{
                                  var iArr = interestArr;
                              }

                                artist.saveInterest(artistId, iArr, function(data){
                                            if(data == 'success'){
                                                //res.redirect("/profile");
                                                if(req.user.user_typeId == 1){
                                                    res.redirect('/allartists');
                                                }else if(req.user.user_typeId == 3){
                                                    res.redirect('/myartists');
                                                }else{
                                                   res.redirect("/profile"); 
                                                }
                                            }
                                        });

                            }
                        }else{
                            artist.delInterest(artistId, function(data){
                                        if(req.user.user_typeId == 1){
                                                    res.redirect('/allartists');
                                                }else if(req.user.user_typeId == 3){
                                                    res.redirect('/myartists');
                                                }else{
                                                   res.redirect("/profile"); 
                                                }
                                    });
                        }
                    }
                });

            }    
        }else{
            artist.delTeaching(artistId, function(Tdata){
                if(Tdata){
                    if(interestArr){
                        if(interestArr.length > 0){
                           //console.log(interestArr);
                          if(interestArr.length > 1){
                              var iArr = interestArr.join("','");
                          }else{
                              var iArr = interestArr;
                          }

                            artist.saveInterest(artistId, iArr, function(data){
                                        if(data == 'success'){
                                            if(req.user.user_typeId == 1){
                                                    res.redirect('/allartists');
                                                }else if(req.user.user_typeId == 3){
                                                    res.redirect('/myartists');
                                                }else{
                                                   res.redirect("/profile"); 
                                                }
                                        }
                                    });

                        }
                    }else{
                        artist.delInterest(artistId, function(data){
                                    if(req.user.user_typeId == 1){
                                                    res.redirect('/allartists');
                                                }else if(req.user.user_typeId == 3){
                                                    res.redirect('/myartists');
                                                }else{
                                                   res.redirect("/profile"); 
                                                }
                                });
                    }
                }
            });
        }
        
        
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    artist.del(id, function(data){
        res.send(data);
    });
}

exports.getArtistCourses = function(req, res){
    var id = req.query.id;
    artist.getArtistCourses(id, function(data){
        res.send(data);
    });
}

exports.getArtistInterests = function(req, res){
    var id = req.query.id;
    artist.getArtistInterests(id, function(data){
        res.send(data);
    });
}

exports.fetchImages = function(req, res){
    artist.fetchImages(function(data){
        if(data){
            var id = 0;
            var artist_image = "";
            for(var i=0; i < data.length; i++){
                var url =  data[i].image_url;
                var id = data[i].id;
                var urlInt = url.substr(0,4);
                if(urlInt == 'http'){
                    var folderPath =  './public/images/artists/';
                    var cropFolder = './public/images/artists/thumb/';
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
                        var inArray = true;
                        utils.in_array(ext, utils.imgExt, '', function(inDataArr){
                            inArray = inDataArr;
                        });
                        if(inArray){
                            var imageName = id+fileName;
                            var artist_image = "Resized"+id+".jpg";
                            var dstPath = folderPath+"Resized"+id+"-"+imageName;                    
                            var cropPath = cropFolder+artist_image; 
                            
                            var sqlStatement = "update artists set artist_image = '"+artist_image+"', image_url = NULL, localImg = '1' where id = '"+id+"' ";
                            var rejectStatement = "update artists set artist_image = NULL, localImg = '0' where id = '"+id+"' ";
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



exports.chooseaction = function(req, res){
    var url = req.query.url;
    res.render(template + '/chooseaction', { 
                    title: 'Edit Listing',
                    meta_keyword: 'Artmojo, Edit Listing',
                    meta_description: 'Artmojo Edit Listing',
                    url: url
                });
}



exports.media = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    if(req.query){
        if(req.query.url){
            var url = req.query.url;
            var urlArr = url.split("_");
            var lastIndex = (urlArr.length - 1);
            var artistId = urlArr[lastIndex];
            artistVid.findByArtist(artistId, function(data){
                res.render(template + '/media', { 
                    title: "ArtMojo -- Media ",
                    meta_keyword: "Artist, Course, School, Search, Listings",
                    meta_description: "Easiest and most convenient way to reach thousands of local artists.", 
                    loggedUser: loggedUser,
                    url: url,
                    videos: JSON.stringify(data)
                });
            });
            
        }else{
            res.redirect("/");
        }
    }
    
}


exports.mylist = function(req, res){
    
    
    if(req.user){
        res.render(template + '/mylist', { 
            title: 'ArtMojo -- Artists. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }
     
		
}

exports.loadMyArtists = function(req, res){
    var userId = req.user.id;
    artist.loadMyArtists(userId, function(data){
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
        title: 'Post Artist', 
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
        var artistId = req.query.id;
        //check whether artist is associated with user
        artist.fetchDatabyId(artistId, function(data){
            if(data){
                var pasteUrl = data.artist_image;
                if(data.localImg == 1){
                    pasteUrl = "";
                }
                var cityId = data.cityId;
                city.getState(cityId, function(state){
                    if(state){
                       res.render(template + '/operatoredit', { 
                            title: 'Edit Artist',
                            meta_keyword: 'Artmojo, Profile',
                            meta_description: 'Artmojo Profile page',
                            loggedUser: "1",
                            artist: data,
                            pasteUrl: pasteUrl,
                            country: state.countryId,
                            state: state.id
                        }); 
                    }
                });
            }
        });   
    }else{
       res.redirect('/myartists'); 
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
    artist.checkArtistByEmail(email, 0, function(data){
        if(data){
            param["operator"] = operator;  
            param["operatorId"] = operatorId;
            if(req.files.picture.name){
                var imgParam = req.files.picture;
                var inPath = imgParam.path;
                var artist_image = "Resized"+randomNum+".jpg";
                var outPath = "./public/images/artists/thumb/"+artist_image;
                param["artist_image"] = artist_image;

                imageHelper.resize(inPath, outPath, function(status){
                    console.log(status);
                });
            }else{
                if(param.artist_image){
                    var url =  param.artist_image;
                    var id = 1;
                    var urlInt = url.substr(0,4);
                    if(urlInt == 'http'){
                        var folderPath = './public/images/artists/';
                        var cropFolder = './public/images/artists/thumb/';
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
                                var artist_image = "Resized"+randomNum+".jpg";
                                var dstPath = folderPath+"Resized"+imageName;                    
                                var cropPath = cropFolder+artist_image; 
                                param["artist_image"] = artist_image;
                                imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                                    if(status == 0){                            
                                       param["artist_image"] = null;
                                    }
                                }); 
                            }
                        }
                    }
                }else{
                    param["artist_image"] = null;
                }
            }
            artist.doadd(param, function(data){
                if(data){
                    //var artistId = data.id;
                    var artistId = data;
                    courseArr = [].concat( param.course );
                    if(courseArr){
                        if(courseArr.length > 0){
                           //console.log(courseArr.length);
                            if(courseArr.length > 1){
                                var cArr = courseArr.join("','");
                            }else{
                                var cArr = courseArr;
                            }
                            artist.saveCourse(artistId, cArr, function(Tdata){
                                if(Tdata == 'success'){
                                    res.redirect("/myartists");
                                }
                            });

                        }    
                    }else{
                        artist.delTeaching(artistId, function(Tdata){
                            if(Tdata){
                                res.redirect("/myartists");
                            }
                        });
                    }    
                }

            });
            
        }else{
            res.redirect("/artists/operator/add");
        }
    });
    //console.log(interestArr);
    
}

exports.doedit = function(req, res){
    var param = req.body;
    var artistId = param.id;
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    var courseArr = new Array();
    courseArr = param.course;
    var email = param.email;
    var operatorId = req.user.id;
    var operator = req.user.first_name;
    artist.checkArtistByEmail(email, artistId, function(data){
        if(data){
            param["operator"] = operator;  
            param["operatorId"] = operatorId;
            if(req.files.picture.name){
                var imgParam = req.files.picture;
                var inPath = imgParam.path;
                var artist_image = "Resized"+artistId+randomNum+".jpg";
                var outPath = "./public/images/artists/thumb/"+artist_image;
                param["artist_image"] = artist_image;

                imageHelper.resize(inPath, outPath, function(status){
                    console.log(status);            
                });
            }else{
                if(param.artist_image){
                    var url =  param.artist_image;
                    var id = artistId;
                    var urlInt = url.substr(0,4);
                    if(urlInt == 'http'){
                        var folderPath = './public/images/artists/';
                        var cropFolder = './public/images/artists/thumb/';
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
                                var artist_image = "Resized"+artistId+randomNum+".jpg";
                                var dstPath = folderPath+"Resized"+artistId+imageName;                    
                                var cropPath = cropFolder+artist_image; 
                                param["artist_image"] = artist_image;
                                imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                                    if(status == 0){                            
                                        param["artist_image"] = null;
                                    }
                                }); 
                            }
                        }
                    }
                }else{
                    param["artist_image"] = null;
                }
            }
            artist.doedit(param, function(result){
                courseArr = [].concat( param.course );
                if(courseArr){
                    if(courseArr.length > 0){
                       //console.log(courseArr.length);
                        if(courseArr.length > 1){
                            var cArr = courseArr.join("','");
                        }else{
                            var cArr = courseArr;
                        }
                        artist.saveCourse(artistId, cArr, function(Tdata){
                            if(Tdata == 'success'){
                                if(req.user.user_typeId == 1){
                                    res.redirect('/allartists');
                                }else if(req.user.user_typeId == 3){
                                    res.redirect('/myartists');
                                }else{
                                   res.redirect("/profile"); 
                                }

                            }
                        });

                    }    
                }else{
                    artist.delTeaching(artistId, function(Tdata){
                        if(Tdata){
                            if(req.user.user_typeId == 1){
                                res.redirect('/allartists');
                            }else if(req.user.user_typeId == 3){
                                res.redirect('/myartists');
                            }else{
                               res.redirect("/profile"); 
                            }
                        }
                    });
                }


            });        
        }else{
            res.redirect("/artists/operator/edit?id="+artistId);
        }
    });
    
}
