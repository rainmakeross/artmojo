
/*
 * Artists controller uses artist model
 */
var event = require('../models/event');
var city = require('../models/city');
var template = "events/";
//var eventImageManager = require('../helpers/events_image_manager');
var imageHelper = require('../helpers/image_helper');
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');
var email_template = "emailtpl/"

exports.testjoin = function(req, res){
    event.testjoin(function(data){
        res.send(data);
    })
}

exports.all = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- Events. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}
exports.listall = function(req, res){
    event.listall(function(data){
        res.send(data);
    });
}


exports.index = function(req, res){
        var eventTitle = "";
        var location = "";
        var category = "";
        //console.log(req.query);
        if(req.query){
            //console.log(req.query.eventTitle);
            if(req.query.eventTitle){
                if(req.query.eventTitle.length > 0){
                    eventTitle = req.query.eventTitle;
                }
            }
            if(req.query.location){
                if(req.query.location.length > 0){
                    location = req.query.location;
                }
            }
            if(req.query.categorySrch){
                if(req.query.categorySrch.length > 0){
                    category = req.query.categorySrch;
                }
            }
            
        }
	if(req.user) {
            res.render(template + '/index', { 
                title: 'ArtMojo -- Events. ', 
                meta_keyword: "Events, concerts, art bashes, free classes, parties.",
                meta_description: "Latest Art Events including concerts, free classes, art bashes and parties.",         
                email: req.user.dataValues.email, 
                id: req.user.dataValues.id, 
                loggedUser: "1",
                eventTitle: eventTitle,
                location: location,
                category: category
            });
	}
	else{
           res.render(template + '/index', { 
                title: 'ArtMojo -- Events. ',
                meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
                meta_description: "Latest Art Events including concerts, free classes, art bashes and parties.",         
                eventTitle: eventTitle,
                location: location,
                category: category
           }); 
        }
		
}

exports.publicadd = function(req, res){
	if(req.user) {
    res.render(template + '/publicadd', { 
        title: 'Event Add', 
        email: req.user.dataValues.email, 
        id: req.user.dataValues.id, 
        loggedUser: 1,
    category: ""});
	}
	else
		res.render(template + '/index', { title: 'Event Title', login: 'nouser', category: '' });
}

exports.publicedit = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    var userEmail = "";
    var operator = "";
    
    if(req.query){
        if(req.query.id.length){
            var eventId = req.query.id; 
            loggedUser = 1;
            userId = req.user.id;
            operator = req.user.first_name; 
            userEmail = req.user.email; 
            event.fetchDatabyId(eventId, function(data){
                var cityId = data.cityId;
                city.getState(cityId, function(state){
                    if(state){
                        res.render(template + '/publicedit', { 
                            title: 'Edit Event', 
                            loggedUser: loggedUser, 
                            userId: userId, 
                            operator: operator, 
                            userEmail: userEmail,
                            event: data,
                            country: state.countryId,
                            state: state.id
                        });
                    }
                
                });
            });
        }
        
    }
    
}

exports.loadevents = function(req, res){
    var city = "";
    if(req.cookies){
        if(req.cookies.userCity){
            city = req.cookies.userCity;
        }    
    }
    
    event.loadevents(city, function(data){
        res.send(data);
    })
}

exports.view = function(req, res){
    var url = req.query.url;
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    event.fetchDatabyUrl(url, function(data){
        if(data){
            var evDateObj = new Date(data.from_date);
                var evDate = evDateObj.getDate();
                var evMonth = (evDateObj.getMonth()+1);
                var evYear = evDateObj.getFullYear();
                var fullDate = evYear+"/"+evMonth+"/"+evDate;
                var website = "";
                if(data.event_website){
                    website = data.event_website;
                    var urlInt = website.substr(0,4);
                    if(urlInt != 'http'){
                        website = 'http://'+website;
                    }
                }
                //res.send(website);
                res.render(template + '/view', { 
                    title: data.title,
                    meta_keyword: data.title,
                    meta_description: data.course_description, 
                    event: data,
                    website: website,
                    loggedUser: loggedUser,
                    fullDate: fullDate,
                    category: ''
                });   
        }else{
            res.redirect("/events");
        }
        
        
    });
}


exports.list = function(req, res){
    var param = req.query;
    event.list(param, function(data){
        res.send(data);
    });
}

exports.listEvents = function(req, res){
    var id = "0";
    var eventTitle = "";
    var location = "";
    var category = "";
        //console.log(req.query);
        
    if(req.user){
        id = req.user.id;
    }
    console.log(req.query);
    if(req.query){
            //console.log(req.query.eventTitle);
            if(req.query.eventTitle){
                if(req.query.eventTitle.length > 0){
                    eventTitle = req.query.eventTitle;
                }
            }
            if(req.query.location){
                if(req.query.location.length > 0){
                    location = req.query.location;
                }
            }
            if(req.query.categorySrch){
                if(req.query.categorySrch.length > 0){
                    category = req.query.categorySrch;
                }
            }
            
        }
    event.listEvents(id, eventTitle, location, category, function(data){
            res.send(data);
    });
}

exports.doaddevent = function(req, res){
    var param = req.body;
    var userId = req.user.id;
    var operator = req.user.first_name;
    var email = param.contact_email;
    param["operator"] = operator;  
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        var inPath = imgParam.path;
        var event_image = "Resized"+randomNum+".jpg";
        var outPath = "./public/images/events/thumb/"+event_image;
        param["event_image"] = event_image;

        imageHelper.resize(inPath, outPath, function(status){
            console.log(status);
        });
    }else{
        if(param.event_image){
            var url =  param.event_image;
            var id = 1;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var folderPath = './public/images/events/';
                var cropFolder = './public/images/events/thumb/';
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
                        var event_image = "Resized"+randomNum+".jpg";
                        var dstPath = folderPath+"Resized"+imageName;                    
                        var cropPath = cropFolder+event_image; 
                        param["event_image"] = event_image;
                        imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                            if(status == 0){                            
                               param["event_image"] = null;
                            }
                        }); 
                    }
                }
            }
        }else{
            param["event_image"] = null;
        }
    }
    event.publicadd(param, userId, function(data){
            console.log(data);
            if(data == "Event added"){
                var txtStr = req.user.email+' has added an event to the site. <br > Details:<br /><br />';
                txtStr += 'Title:'+param.title+'<br />';
                txtStr += 'Description:'+param.description+'<br />';
                txtStr += 'Email:'+param.contact_email+'<br />';
                txtStr += 'Website:'+param.contact_website+'<br />';
                res.mailer.send(email_template + 'adminalert-etpl', {
                            to: 'info@artmojo.co',
                            subject: 'Hello Admin - An event is added',
                            textMsg: txtStr,
                            image: config.routeUrl + "images/logo.png"
                          }, function (err) {
                            if (err) {
                                // handle error
                                console.log(err);
                            }else{
                                if(req.user){
                                    res.redirect('/myevents');
                                }
                            }

                          });
            }
    });
		
}

exports.doeditevent = function(req, res){
    var param = req.body;
    var userId = req.user.id;
    var operator = req.user.first_name;
    var email = param.contact_email;
    var eventId = param.eventId;   
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        var inPath = imgParam.path;
        var event_image = "Resized"+eventId+randomNum+".jpg";
        var outPath = "./public/images/events/thumb/"+event_image;
        param["event_image"] = event_image;

        imageHelper.resize(inPath, outPath, function(status){
            console.log(status);            
        });
    }else{
        if(param.event_image){
            var url =  param.event_image;
            var id = eventId;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var folderPath = './public/images/events/';
                var cropFolder = './public/images/events/thumb/';
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
                        var event_image = "Resized"+eventId+randomNum+".jpg";
                        var dstPath = folderPath+"Resized"+eventId+imageName;                    
                        var cropPath = cropFolder+event_image; 
                        param["event_image"] = event_image;
                        imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                            if(status == 0){                            
                                param["event_image"] = null;
                            }
                        }); 
                    }
                }
            }
        }else{
            param["event_image"] = null;
        }
    }
    param["operator"] = operator;  
    param["userId"] = userId; 
    event.publicedit(param, function(data){
        console.log(data);
        if(data == 'success'){
            if(req.user){
                res.redirect('/myevents');
            }
        }

    });
}


exports.remove = function(req, res){
    var id = req.query.id;
    event.del(id, function(data){
        if(data == 'success')
        	res.render(template + '/index', { title: 'Event Title', email: req.user.dataValues.email, id: req.user.dataValues.id});
    });
}

exports.fetchImages = function(req, res){
    event.fetchImages(function(data){
        if(data){
            var id = 0;
            var event_image = "";
            for(var i=0; i < data.length; i++){
                var url =  data[i].image_url;
                var id = data[i].id;
                var urlInt = url.substr(0,4);
                if(urlInt == 'http'){
                    var folderPath = './public/images/events/';
                    var cropFolder = './public/images/events/thumb/';
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
                            var event_image = "Resized"+id+".jpg";
                            var dstPath = folderPath+"Resized"+id+"-"+imageName;                    
                            var cropPath = cropFolder+event_image; 
                            
                            var sqlStatement = "update events set event_image = '"+event_image+"', localImg = '1' where id = '"+id+"' ";
                            var rejectStatement = "update events set event_image = null, localImg = '0' where id = '"+id+"' ";
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

exports.results = function(req, res){
    var param = req.query;
    
    event.fetchData(param, function(data){
        res.send(data);
    });
}

exports.filterResults = function(req, res){
    var param = req.body;
   
    event.fetchData(param, function(data){
        res.send(data);
    })
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

exports.opevents = function(req, res){
    
    
    if(req.user){
        res.render(template + '/opevents', { 
            title: 'ArtMojo -- Artists. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }
     
		
}

exports.loadMyEvents = function(req, res){
    var userId = req.user.id;
    event.loadMyEvents(userId, function(data){
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
        title: 'Post Event', 
        loggedUser: loggedUser, 
        userId: userId, 
        operator: operator, 
        userEmail: userEmail  
    });
    
}

exports.operatoradd = function(req, res){
	if(req.user) {
    res.render(template + '/operatoradd', { 
        title: 'Event Add', 
        email: req.user.dataValues.email, 
        id: req.user.dataValues.id, 
        loggedUser: 1,
    category: ""});
	}
	else
		res.render(template + '/index', { title: 'Event Title', login: 'nouser', category: '' });
}

exports.operatoredit = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    var userEmail = "";
    var operator = "";
    
    if(req.query){
        if(req.query.id.length){
            var eventId = req.query.id; 
            loggedUser = 1;
            userId = req.user.id;
            operator = req.user.first_name; 
            userEmail = req.user.email; 
            event.fetchDatabyId(eventId, function(data){
                var cityId = data.cityId;
                city.getState(cityId, function(state){
                    if(state){
                        res.render(template + '/operatoredit', { 
                            title: 'Edit Event', 
                            loggedUser: loggedUser, 
                            userId: userId, 
                            operator: operator, 
                            userEmail: userEmail,
                            event: data,
                            country: state.countryId,
                            state: state.id
                        });
                    }
                
                });
            });
        }
        
    }
    
}

exports.doaddeventop = function(req, res){
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    var param = req.body;
    var userId = req.user.id;
    var operator = req.user.first_name;
    param["operator"] = operator;  
            //res.send(param);
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        var inPath = imgParam.path;
        var event_image = "Resized"+randomNum+".jpg";
        var outPath = "./public/images/events/thumb/"+event_image;
        param["event_image"] = event_image;

        imageHelper.resize(inPath, outPath, function(status){
            console.log(status);
        });
    }else{
        if(param.event_image){
            var url =  param.event_image;
            var id = 1;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var folderPath = './public/images/events/';
                var cropFolder = './public/images/events/thumb/';
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
                        var event_image = "Resized"+randomNum+".jpg";
                        var dstPath = folderPath+"Resized"+imageName;                    
                        var cropPath = cropFolder+event_image; 
                        param["event_image"] = event_image;
                        imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                            if(status == 0){                            
                               param["event_image"] = null;
                            }
                        }); 
                    }
                }
            }
        }else{
            param["event_image"] = null;
        }
    }
    event.operatoradd(param, userId, function(data){
            console.log(data);
            if(data == "Event added"){
                if(req.user){
                    if(req.user.user_typeId == 1){
                        res.redirect('/allevents');
                    }else if(req.user.user_typeId == 2){
                        res.redirect('/opevents');
                    }else{
                        res.redirect('/myevents');
                    }
                }
                
            }
    });
    
    
		
}

exports.doediteventop = function(req, res){
    var param = req.body;
    var userId = req.user.id;
    var operator = req.user.first_name;
    var email = param.contact_email;
    var eventId = param.eventId;  
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    param["operator"] = operator;  
    param["userId"] = userId;  
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        var inPath = imgParam.path;
        var event_image = "Resized"+eventId+randomNum+".jpg";
        var outPath = "./public/images/events/thumb/"+event_image;
        param["event_image"] = event_image;

        imageHelper.resize(inPath, outPath, function(status){
            console.log(status);            
        });
    }else{
        if(param.event_image){
            var url =  param.event_image;
            var id = eventId;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var folderPath = './public/images/events/';
                var cropFolder = './public/images/events/thumb/';
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
                        var event_image = "Resized"+eventId+randomNum+".jpg";
                        var dstPath = folderPath+"Resized"+eventId+imageName;                    
                        var cropPath = cropFolder+event_image; 
                        param["event_image"] = event_image;
                        imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                            if(status == 0){                            
                                param["event_image"] = null;
                            }
                        }); 
                    }
                }
            }
        }else{
            param["event_image"] = null;
        }
    }
    event.operatoredit(param, function(data){
        console.log(data);
        if(data == 'success'){
            if(req.user){
                if(req.user.user_typeId == 1){
                    res.redirect('/allevents');
                }else if(req.user.user_typeId == 2){
                    res.redirect('/opevents');
                }else{
                    res.redirect('/myevents');
                }
            }
        }

    });
}