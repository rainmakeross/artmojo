
/*
 * Artists controller uses artist model
 */
var job = require('../models/job');
var city = require('../models/city');
var template = "jobs/";
var imageHelper = require('../helpers/image_helper');
var email_template = "emailtpl/"
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');

/*dbutil.findUser( 'xx@gmail.com', function( err, data ) {
    if ( err ) throw err;
    // Handle the datas returned "data"
} );*/

exports.testjoin = function(req, res){
    job.testjoin(function(data){
        res.send(data);
    })
}

exports.all = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- Jobs. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}
exports.listall = function(req, res){
    job.listall(function(data){
        res.send(data);
    });
}

exports.index = function(req, res){
    var jobTitle = "";
    var location = "";
    var category = "";
    //console.log(req.query);
    if(req.query){
        //console.log(req.query.jobTitle);
        if(req.query.jobTitle){
            if(req.query.jobTitle.length > 0){
                jobTitle = req.query.jobTitle;
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
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    res.render(template + '/index', { 
        title: 'ArtMojo -- Jobs. ',
        meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
        meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
        loggedUser: loggedUser,
        jobTitle: jobTitle,
        location: location,
        category: category
   }); 
		
}

exports.loadJobList = function(req, res){
    var jobTitle = "";
    var location = "";
    var category = "";
    
    if(req.query){
            //console.log(req.query.jobTitle);
            if(req.query.jobTitle){
                if(req.query.jobTitle.length > 0){
                    jobTitle = req.query.jobTitle;
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
    job.loadall(jobTitle, location, category, function(data){
       res.send(data);
    });
}

exports.publicadd = function(req, res){
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
    
    res.render(template + '/publicadd', { 
        title: 'Post Job', 
        loggedUser: loggedUser, 
        userId: userId, 
        operator: operator, 
        userEmail: userEmail  
    });
    
}





exports.loadjobs = function(req, res){
    var city = "";
    if(req.cookies){
        if(req.cookies.userCity){
            city = req.cookies.userCity;
        }    
    }
    //console.log(city);
    job.loadjobs(city, function(data){
        res.send(data);
    })
}

exports.view = function(req, res){
    var url = req.query.url;
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    job.fetchDatabyUrl(url, function(data){
        if(data){
            var evDateObj = new Date(data.createdAt);
            var evDate = evDateObj.getDate();
            var evMonth = (evDateObj.getMonth()+1);
            var evYear = evDateObj.getFullYear();
            var fullDate = evYear+"/"+evMonth+"/"+evDate;
            var fullExpDate = "N/A";
            if(data.closingDate != '0000-00-00 00:00:00 Z'){
                var expDateObj = new Date(data.closingDate);
                var expDate = expDateObj.getDate();
                var expMonth = (expDateObj.getMonth()+1);
                var expYear = expDateObj.getFullYear();
                var fullExpDate = expYear+"/"+expMonth+"/"+expDate;
            }
            var website = "No data found";
            if(data.applicationWebsite){
                website = data.applicationWebsite;
                var urlInt = website.substr(0,4);
                if(urlInt != 'http'){
                    website = 'http://'+website;
                }
            }
            var phone = "No data found";
            if(data.applicationPhone){
                phone = data.applicationPhone;
            }

            //res.send(website);
            res.render(template + '/view', { 
                title: data.jobTitle,
                meta_keyword: data.jobTitle,
                meta_description: data.description, 
                job: data,
                website: website,
                phone: phone,
                loggedUser: loggedUser,
                fullDate: fullDate,
                expDate: fullExpDate
            });
        }else{
            res.redirect("/jobs");
        }
        
        
    });
}


exports.list = function(req, res){
    var param = req.query;
    job.list(param, function(data){
        res.send(data);
    });
}



exports.doaddjob = function(req, res){
    var param = req.body;
    var userId = param.userId;
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        var inPath = imgParam.path;
        var job_image = "Resized"+randomNum+".jpg";
        var outPath = "./public/images/jobs/thumb/"+job_image;
        param["job_image"] = job_image;

        imageHelper.resize(inPath, outPath, function(status){
            console.log(status);
        });
    }else{
        if(param.job_image){
            var url =  param.job_image;
            var id = 1;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var folderPath = './public/images/jobs/';
                var cropFolder = './public/images/jobs/thumb/';
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
                        var job_image = "Resized"+randomNum+".jpg";
                        var dstPath = folderPath+"Resized"+imageName;                    
                        var cropPath = cropFolder+job_image; 
                        param["job_image"] = job_image;
                        console.log(url);
                        imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                            if(status == 0){                            
                               param["job_image"] = null;
                            }
                        }); 
                    }
                }
            }
        }else{
            param["job_image"] = null;
        }
    }
     if(userId>0){
         job.publicadd(param, function(data){
             console.log(data);
                 if(data == "Job added"){
                     var txtStr = req.user.email+' has added an job to the site. <br > Details:<br /><br />';
                     txtStr += 'Title:'+param.jobTitle+'<br />';
                     txtStr += 'Description:'+param.description+'<br />';
                     txtStr += 'Email:'+param.applicationEmail+'<br />';
                     txtStr += 'Website:'+param.applicationWebsite+'<br />';
                     res.mailer.send(email_template + 'adminalert-etpl', {
                             to: 'info@artmojo.co',
                             subject: 'Hello Admin - A job is added',
                             textMsg: txtStr,
                             image: config.routeUrl + "images/logo.png"
                           }, function (err) {
                             if (err) {
                                 // handle error
                                 console.log(err);
                             }else{
                                 console.log(req.user.user_typeId);
                                 if(req.user){
                                     if(req.user.user_typeId == 3){
                                         res.redirect('/myjobs');
                                     }else if(req.user.user_typeId == 1){
                                         res.redirect('/alljobs');
                                     }else{
                                         res.redirect('/jobs');
                                     }

                                 }
                             }

                           });


                 }              
         });    
     }else{
         job.tempadd(param, function(data){
             if(data == "Job added"){
                 res.redirect('/jobs');
             }              
         });
     }
          
    
    //res.send(param);
    
		
}

exports.doeditjob = function(req, res){
    var param = req.body;
    var userId = param.userId;    
    var jobId = param.jobId;
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        var inPath = imgParam.path;
        var job_image = "Resized"+jobId+randomNum+".jpg";
        var outPath = "./public/images/jobs/thumb/"+job_image;
        param["job_image"] = job_image;

        imageHelper.resize(inPath, outPath, function(status){
            console.log(status);            
        });
    }else{
        if(param.job_image){
            var url =  param.job_image;
            var id = jobId;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var folderPath = './public/images/jobs/';
                var cropFolder = './public/images/jobs/thumb/';
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
                        var job_image = "Resized"+jobId+randomNum+".jpg";
                        var dstPath = folderPath+"Resized"+jobId+imageName;                    
                        var cropPath = cropFolder+job_image; 
                        param["job_image"] = job_image;
                        imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                            if(status == 0){                            
                                param["job_image"] = null;
                            }
                        }); 
                    }
                }
            }
        }else{
            param["job_image"] = null;
        }
    }
    job.publicedit(param, function(data){
        console.log(data);
            if(data == "success"){
                if(req.user){
                    if(req.user.user_typeId == 1){
                        res.redirect('/alljobs');
                    }else if(req.user.user_typeId == 1){
                        res.redirect('/myjobs');
                    }else{
                        res.redirect('/opjobs');
                    }

                }
            }              
    });
          
    
    //res.send(param);
    
		
}



exports.remove = function(req, res){
    var id = req.query.id;
    job.del(id, function(data){
        if(data == 'success')
        	res.render(template + '/index', { title: 'Job Title', email: req.user.dataValues.email, id: req.user.dataValues.id});
    });
}



exports.results = function(req, res){
    var param = req.query;    
    /*job.dosearch(param, function(data){
        res.send(data);
    });*/
    job.fetchData(param, function(data){
        res.send(data);
    });
}

exports.filterResults = function(req, res){
    var param = req.body;
    job.fetchData(param, function(data){
        res.send(data);
    })
}

exports.fetchImages = function(req, res){
    job.fetchImages(function(data){
        if(data){
            var id = 0;
            var job_image = "";
            for(var i=0; i < data.length; i++){
                var url =  data[i].image_url;
                var id = data[i].id;
                var urlInt = url.substr(0,4);
                if(urlInt == 'http'){
                    var folderPath = './public/images/jobs/';
                    var cropFolder = './public/images/jobs/thumb/';
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
                            var job_image = "Resized"+id+".jpg";
                            var dstPath = folderPath+"Resized"+id+"-"+imageName;                    
                            var cropPath = cropFolder+job_image; 
                            
                            var sqlStatement = "update jobs set job_image = '"+job_image+"', localImg = '1' where id = '"+id+"' ";
                            var rejectStatement = "update jobs set job_image = null, localImg = '0' where id = '"+id+"' ";
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

exports.mylist = function(req, res){
    
    
    if(req.user){
        res.render(template + '/mylist', { 
            title: 'ArtMojo -- Jobs. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }
     
		
}

exports.opjobs = function(req, res){
    
    
    if(req.user){
        res.render(template + '/opjobs', { 
            title: 'ArtMojo -- Jobs. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }
     
		
}

exports.alllist = function(req, res){
    
    
    if(req.user){
        res.render(template + '/mylist', { 
            title: 'ArtMojo -- Jobs. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }
     
		
}

//operators jobs
exports.loadMyJobs = function(req, res){
    var userId = req.user.id;
    job.loadMyJobs(userId, function(data){
       res.send(data);
    });
}

exports.loadAllJobs = function(req, res){
    job.loadAllJobs(function(data){
       res.send(data);
    });
}



exports.publicedit = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    var userEmail = "";
    var operator = "";
    
    if(req.query){
        if(req.query.id.length){
            var jobId = req.query.id; 
            loggedUser = 1;
            userId = req.user.id;
            operator = req.user.first_name; 
            userEmail = req.user.email; 
            job.fetchDatabyId(jobId, function(data){
                var cityId = data.cityId;
                city.getState(cityId, function(state){
                    if(state){
                        res.render(template + '/publicedit', { 
                            title: 'Post Job', 
                            loggedUser: loggedUser, 
                            userId: userId, 
                            operator: operator, 
                            userEmail: userEmail,
                            job: data,
                            country: state.countryId,
                            state: state.id
                        });
                    }
                
                });
            });
        }
        
    }
}

exports.operatoredit = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    var userEmail = "";
    var operator = "";
    
    if(req.query){
        if(req.query.id.length){
            var jobId = req.query.id; 
            loggedUser = 1;
            userId = req.user.id;
            operator = req.user.first_name; 
            userEmail = req.user.email; 
            job.fetchDatabyId(jobId, function(data){
                var cityId = data.cityId;
                city.getState(cityId, function(state){
                    if(state){
                        res.render(template + '/operatoredit', { 
                            title: 'Post Job', 
                            loggedUser: loggedUser, 
                            userId: userId, 
                            operator: operator, 
                            userEmail: userEmail,
                            job: data,
                            country: state.countryId,
                            state: state.id
                        });
                    }
                
                });
            });
        }
        
    }
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
        title: 'Post Job', 
        loggedUser: loggedUser, 
        userId: userId, 
        operator: operator, 
        userEmail: userEmail  
    });
    
}

exports.doaddjobop = function(req, res){
    var param = req.body;
    var userId = param.userId;
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        var inPath = imgParam.path;
        var job_image = "Resized"+randomNum+".jpg";
        var outPath = "./public/images/jobs/thumb/"+job_image;
        param["job_image"] = job_image;

        imageHelper.resize(inPath, outPath, function(status){
            console.log(status);
        });
    }else{
        if(param.job_image){
            var url =  param.job_image;
            var id = 1;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var folderPath = './public/images/jobs/';
                var cropFolder = './public/images/jobs/thumb/';
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
                        var job_image = "Resized"+randomNum+".jpg";
                        var dstPath = folderPath+"Resized"+imageName;                    
                        var cropPath = cropFolder+job_image; 
                        param["job_image"] = job_image;
                        imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                            if(status == 0){                            
                               param["job_image"] = null;
                            }
                        }); 
                    }
                }
            }
        }else{
            param["job_image"] = null;
        }
    }
    job.operatoradd(param, function(data){
                    console.log(data);
                        if(data == "Job added"){
                            if(req.user){
                                if(req.user.user_typeId == 1){
                                    res.redirect('/alljobs');
                                }else if(req.user.user_typeId == 1){
                                    res.redirect('/myjobs');
                                }else{
                                    res.redirect('/opjobs');
                                }

                            }
                        }              
                });   
          
    
    //res.send(param);
    
		
}

exports.doeditjobop = function(req, res){
    var param = req.body;
    var userId = param.userId;    
    var jobId = param.jobId;
    var randomNum = "Abcd12";
    utils.randomString(6, function(rdStr){
        randomNum = rdStr;
    });
    if(req.files.picture.name){
        var imgParam = req.files.picture;
        var inPath = imgParam.path;
        var job_image = "Resized"+jobId+randomNum+".jpg";
        var outPath = "./public/images/jobs/thumb/"+job_image;
        param["job_image"] = job_image;

        imageHelper.resize(inPath, outPath, function(status){
            console.log(status);            
        });
    }else{
        if(param.job_image){
            var url =  param.job_image;
            var id = jobId;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var folderPath = './public/images/jobs/';
                var cropFolder = './public/images/jobs/thumb/';
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
                        var job_image = "Resized"+jobId+randomNum+".jpg";
                        var dstPath = folderPath+"Resized"+jobId+imageName;                    
                        var cropPath = cropFolder+job_image; 
                        param["job_image"] = job_image;
                        console.log(url+"/////"+cropPath);
                        imageHelper.captureImageNResize(url, dstPath, cropPath, function(status){
                            if(status == 0){                            
                                param["job_image"] = null;
                            }
                        }); 
                    }
                }
            }
        }else{
            param["job_image"] = null;
        }
    }
    job.operatoredit(param, function(data){
        console.log(data);
            if(data == "success"){

                if(req.user.user_typeId == 1){
                    res.redirect('/alljobs');
                }else if(req.user.user_typeId == 1){
                    res.redirect('/myjobs');
                }else{
                    res.redirect('/opjobs');
                }
            }              
    });  
		
}