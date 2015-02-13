var schema = require('../../schema');
var Course = schema.Course;
var Artist = schema.Artist;
var School = schema.School;
var ArtistSchool = schema.ArtistSchool;
var SchoolCourse = schema.SchoolCourse;
var SchoolComment = schema.SchoolComment;
var SchoolRating = schema.SchoolRating;
var SchoolQuicklist = schema.SchoolQuicklist;
var db = schema.sequelize;
var schoolImage = require('./schoolimage.js');
var utility = require('../helpers/utils');
var primaryTable = 'schools';

///arrat prototypes

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};
Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

//list all schools for admin review

exports.listall = function(callback){
    var Sql = "select s.*, si.image as school_image, s.localImg, ";
    Sql += " concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as s ";
    Sql += " inner join cities as c on (c.id = s.cityId) ";
    Sql += " inner join " + primaryTable + "_images as si on si.schoolId = s.id and si.profilepic = '1' ";
    Sql += " order by createdAt desc limit 0, 1000 ";
    console.log(Sql);
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

//list all schools for sitemap

exports.showUrl = function(callback){
    var Sql = "SELECT * FROM " + primaryTable + " WHERE status = '1' ";
    db.query(Sql).success(function(courses) {
        callback(courses);
      });  
} 

////list 3 schools for index random display

exports.loadSchools = function(city, callback){
    var PrimarySql = "select s.school_name, s.id, s.email, s.website, s.phone, si.image as school_image, s.localImg, ";
    PrimarySql += " concat(c.name, ', ', c.stateAbbr) as location ";
    PrimarySql += " from " + primaryTable + " as s ";
    PrimarySql += " inner join cities as c on (c.id = s.cityId) ";
    PrimarySql += " inner join " + primaryTable + "_images as si on si.schoolId = s.id and si.profilepic = '1' ";
    PrimarySql += " where s.active = '1' ";
    
    var Sql = PrimarySql;
    if(city){
        //var regExpCityStr = city.replace(',', '|');
        Sql += " AND concat(c.name, ', ', c.stateAbbr) LIKE '%"+city+"%' ";
    }
    Sql += " ORDER BY rand() LIMIT 0,3 ";
    
    db.query(Sql)
    .error(function(err){
       console.log(err); 
    })
    .success(function(schools) {
         if(schools){
             if(schools.length > 0){
                 callback(schools);
             }else{
                var Sql2 = PrimarySql + " AND concat(c.name, ', ', c.stateAbbr) LIKE '%International%' ORDER BY rand() LIMIT 0,3  ";
                console.log(Sql2);
                db.query(Sql2)
                .error(function(err2){
                    console.log(err2+" "+Sql2)
                })
                .success(function(datas) {
                    callback(datas);
                });
             }            
         }else{
             var Sql2 = PrimarySql + " AND concat(c.name, ', ', c.stateAbbr) LIKE '%International%' ORDER BY rand() LIMIT 0,3  ";
             console.log(Sql2);
             db.query(Sql2)
             .error(function(err2){
                 console.log(err2+" "+Sql2)
             })
             .success(function(datas) {
                 callback(datas);
             });
         }
    });  
}

/********** SCHOOL SEARCH FUNCTIONALITY STARTS *******************/

//List schools id with full name searches

var fetchSchool = function(param, callback){
    
    var Sql = "select distinct s.id from " + primaryTable + " as s ";
    Sql += " where s.active = '1' ";  
    if(param.courseName.length){
        if(param.courseName != "%"){
            Sql += " and s.school_name REGEXP '"+param.reg_exp_name+"' ";
        }
    }
    
    //console.log(Sql);
    db.query(Sql)
    .error(function(err){
        callback(err, null);
    })
    .success(function(schools) {
        callback(null, schools);
        
    });
};

//list schools ids with course matches, only teaching courses are counted

var fetchSchoolCourses = function(param, callback){
    
    var Sql = "select distinct s.id from " + primaryTable + " as s ";
    Sql += " inner join " + primaryTable + "_courses as sc on s.id = sc.schoolId  ";
    Sql += " inner join courses as c on c.id = sc.courseId ";  
    if(param.courseName.length){
        if(param.courseName != "%"){
            Sql += " and c.course_name REGEXP '"+param.reg_exp_name+"' ";
        }
    }
    //console.log(Sql);
    db.query(Sql)
    .error(function(err){
        console.log(err);
        callback(err, null);
    })
    .success(function(schools) {
        callback(null, schools);
        
    });
};

//list school ids with school matches

var fetchArtistSchools = function(param, callback){
    var Sql = "select distinct s.id from " + primaryTable + " as s ";
    Sql += " inner join artists_schools as aSch on s.id = aSch.schoolId ";
    Sql += " inner join artists as a on a.id = aSch.artistId ";  
    if(param.courseName.length){
        if(param.courseName != "%"){
            Sql += " and a.full_name REGEXP '"+param.reg_exp_name+"' ";
        }
    }
    //console.log(Sql);
    db.query(Sql)
    .error(function(err){
        console.log(err);
        callback(err, null);
    })
    .success(function(schools) {
        callback(null, schools);
        
    });
};

//list all schools from the above accumulated school ids and various search params

var fetchSchoolByParams = function(param, callback){
    
    var Sql = "SELECT s.id, s.school_name, s.description, s.email, s.website, s.phone, si.image as school_image, s.total_rate, s.total_comments, s.localImg, ";
    Sql += " concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as s ";
    Sql += " inner join cities as c on (c.id = s.cityId) ";
    Sql += " inner join " + primaryTable + "_images as si on si.schoolId = s.id and si.profilepic = '1' ";
    Sql += " WHERE s.active = '1' ";  
    if(param.schoolIds){
        Sql += " AND s.id IN ("+param.schoolIds+") ";
    }
    /*if(param.courseName.length){
        if(param.courseName != "%"){
            Sql += " AND s.school_name REGEXP '"+param.reg_exp_name+"' ";
        }
    }*/
    if(param.location.length){
        if(param.location != "%"){
            Sql += " AND concat(c.name, ', ', c.stateAbbr) REGEXP '"+param.reg_exp_city+"' ";  
        }
        
    }
    if(param.ratingVal){
        Sql += " AND s.total_rate >= '"+param.ratingVal+"' ";
    }
    if(param.reviewVal){
        if(param.reviewVal == 1){
            Sql += " AND s.total_comments > 0 ";
        }
        if(param.reviewVal == 0){
            Sql += " AND s.total_comments = 0 ";
        }
    }
    
    if(param.phoneVal){
        Sql += " AND s.phone IS NOT NULL ";
    }
    if(param.emailVal){
        Sql += " AND s.email IS NOT NULL ";
    }
    if(param.websiteVal){
        Sql += " AND s.website IS NOT NULL ";
    }
    Sql += " GROUP BY s.id ";
    Sql += " ORDER BY school_image DESC LIMIT 0, 200";
    console.log(Sql);
    db.query(Sql)
    .error(function(err){
        console.log(err);
        callback(err, null);
    })
    .success(function(schools) {
        callback(null, schools);
        
    });
};

//final fetch data fires on main search submission and filter submissions

exports.fetchData = function(param, callback){
    var schoolArr       = new Array(); 
    var schoolCourseArr = new Array();
    var schoolArtistArr = new Array();
    var finalArr = new Array();
    fetchSchool(param, function(err, schools) {
        if(err){
            console.log(err);
            callback(false);
        }else{
            
            if(schools.length){
                Object.keys(schools).forEach(function(key) {
                    schoolArr[key] = schools[key]["id"]; 
                });
            }
            fetchSchoolCourses(param, function(err1, schools_courses) {
                if(err1){
                    console.log(err1);
                    callback(false); 
                }else{
                    
                    if(schools_courses.length){
                        Object.keys(schools_courses).forEach(function(key) {
                            schoolCourseArr[key] = schools_courses[key]["id"]; 
                        });
                    }
                }
                fetchArtistSchools(param, function(err2, artists_schools) {
                    if(err2){
                        console.log(err2);
                        callback(false); 
                    }else{
                        if(artists_schools.length){
                            Object.keys(artists_schools).forEach(function(key) {
                                schoolArtistArr[key] = artists_schools[key]["id"]; 
                            });
                        }
                        finalArr = schoolArr.concat(schoolCourseArr, schoolArtistArr);
                        
                        if(finalArr){
                            //finalArr = finalArr.unique;
                            //console.log(finalArr);
                            //var finalStr = finalArr.join("','");
                            param['schoolIds'] = finalArr;
                            fetchSchoolByParams(param, function(err, schoolList){
                                if(err){
                                    callback(false);
                                }else{
                                    callback(schoolList);
                                }
                            });
                        }
                    }
                });          
                
            });
        }  
        
    });
};

//used to show school view pages

exports.showDetails = function(url, callback){
  var urlArr = url.split("_");
  var urlCnt = urlArr.length;
  var lastIndex = (urlCnt - 1);
  var modelId = urlArr[lastIndex];
  var Sql = "select s.*, si.image as school_image, concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as s ";
    Sql += " inner join cities as c on (c.id = s.cityId) ";
    Sql += " inner join " + primaryTable + "_images as si on si.schoolId = s.id and si.profilepic = '1' ";
    Sql += " where s.id = '"+modelId+"' ";
  console.log(Sql);
  db.query(Sql).success(function(schools) {
		callback(schools[0]);
  });
}

//fetch full school data by id

exports.fetchDatabyId = function(id, callback){
  var Sql = "select * from " + primaryTable + " as s where s.id = '"+id+"' ";
  db.query(Sql).success(function(events) {
		callback(events[0]);
  }); 
}

//fetch full school data by userId

exports.fetchDatabyUser = function(userId, callback){
  var Sql = "select s.*, si.image as school_image, concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as s ";
    Sql += " inner join cities as c on (c.id = s.cityId) ";
    Sql += " inner join " + primaryTable + "_images as si on si.schoolId = s.id and si.profilepic = '1' ";
    Sql += " where s.userId = '" + userId + "' ";
  db.query(Sql).success(function(events) {
		callback(events[0]);
  });
}

//fetch full school data by generic url

exports.fetchDatabyUrl = function(url, callback){
  var urlArr = url.split("_");
  var urlCnt = urlArr.length;
  var lastIndex = (urlCnt - 1);
  var modelId = urlArr[lastIndex];
  var Sql = "select s.*, si.image as school_image, concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as s ";
    Sql += " inner join cities as c on (c.id = s.cityId) ";
    Sql += " inner join " + primaryTable + "_images as si on si.schoolId = s.id and si.profilepic = '1' ";
    Sql += " where s.id = '"+modelId+"' ";
  db.query(Sql).success(function(events) {
		callback(events[0]);
  });
}

//show all teaching courses for schools

exports.showCourse = function(schoolId, callback){
    
      SchoolCourse.findAll({
        attributes: ["courseId"], where: {schoolId: schoolId } 
    }).success(function(courseIds) {
        //callback(courses);
        //console.log(schoolIds);
        if(courseIds.length){
            //crteate comma separated
            var course_arr = new Array();
            for(var i = 0; i<courseIds.length; i++){
                course_arr[i] = courseIds[i].courseId
            }
            var finalArr = course_arr.unique();
            
            //callback(school_str);
            //var sql = "SELECT * FROM courses WHERE id IN ('"+course_str+"') ORDER BY rand() LIMIT 0,150";
            Course.findAll({ 
                where: { id: [finalArr] }, 
                group: 'course_name', 
                order: 'rand()',
                limit: 150                
            }).success(function(courses) {
                callback(courses);
              });
        }
        
    });
}

//show all interest courses for schools


//show all scools for schools

exports.showArtist = function(schoolId, callback){
    //console.log(courseId);
    
    /*db.query(sql).success(function(schools) {
        callback(schools);
      });*/
      ArtistSchool.findAll({
        attributes: ["artistId"], where: {schoolId: schoolId } 
    }).success(function(artistIds) {
        //callback(schools);
        //console.log(schoolIds);
        if(artistIds){
            //console.log(schoolIds);
            if(artistIds.length > 0){
                //crteate comma separated
                var artist_arr = new Array();
                for(var i = 0; i<artistIds.length; i++){
                    artist_arr[i] = artistIds[i].schoolId
                }
                var finalArr = artist_arr.unique();

                //callback(school_str);
                Artist.findAll({ 
                    where: { id: [finalArr] }, 
                    group: 'full_name', 
                    order: 'rand()',
                    limit: 150                
                }).success(function(schools) {
                    callback(schools);
                }).error(function(err){
                    console.log(err);
                });

            }else{
                console.log("Here");
                callback("");
            }   
        }else{
            console.log("Here");
            callback("");
        }
        
        
    })
}

//shows school reviews

exports.showReview = function(id, callback){
    db.query("SELECT sc.*, u.first_name, u.last_name FROM school_comments as sc, users as u WHERE sc.userId = u.id AND sc.schoolId = '"+id+"' order by sc.id desc")
            .success(function(reviews) {
                    callback(reviews); 
                  });
}

//inserts school reviews

exports.addReview = function(userId, param, callback){
    var add = SchoolComment.build({
        comments: param.review,
        schoolId: param.id,
        userId: userId,
        active: '1',
        rate: '0'
    });
    add.save()
    .error(function(err){
        db.query("SELECT sc.*, u.first_name, u.last_name FROM school_comments as sc, users as u WHERE sc.userId = u.id AND sc.schoolId = '"+param.id+"' order by sc.id desc")
            .success(function(reviews) {
                    callback(reviews); 
                  });
    })
    .success(function(){
        
        
        var Sql = "UPDATE " + primaryTable + " SET total_comments = total_comments + 1 WHERE id = '"+param.id+"'";
        db.query(Sql)
        .success(function(){
            db.query("SELECT sc.*, u.first_name, u.last_name FROM school_comments as sc, users as u WHERE sc.userId = u.id AND sc.schoolId = '"+param.id+"' order by sc.id desc")
            .success(function(reviews) {
                    callback(reviews); 
                  });
        });
         
    });
}

//insert school rating

exports.addRating = function(param, userId, callback){
   //check data
   //console.log(userId);
   SchoolRating.count({where : {schoolId: param.extraP, userId: userId}}).success(function(c){
       var returnVal = 0;
       if(c == 0){
           //add rating
           var add = SchoolRating.build({
                schoolId: param.extraP,
                userId: userId,
                vote: (param.rate/4)
            });
            add.save()
            .error(function(err){
                console.log(err);
            })
            .success(function(){
                //little calculation
                SchoolRating.find({
                    attributes: ['id', ['AVG(`vote`)', 'totalRate']], 
                    where: {schoolId: param.extraP }
                }).success(function(rating){ 
                    
                    var Sql = "UPDATE " + primaryTable + " SET total_rate = '"+rating.totalRate+"' WHERE id = '"+param.extraP+"' ";
                    db.query(Sql).success(function(){
                        callback(rating.totalRate);
                    })
                    
                        
                }); 
                /*var returnVal = 1;
                callback(returnVal);*/
            });
           
       }else{
           //do not add
           callback(returnVal);
       }
   });
}

//view quicklist for schools

exports.viewlist = function(userId, callback){
    var Sql = "select sq.*, s.school_name as school_name, si.image as school_image ";
    Sql += " from school_quicklists as sq ";
    Sql += " inner join " + primaryTable + " as s on s.id = sq.schoolId ";
    Sql += " inner join " + primaryTable + "_images as si on si.schoolId = s.id and si.profilepic = '1' ";
    Sql += " where sq.userId = '"+userId+"' ";
    //console.log(sql);
    db.query(Sql)
    .error(function(err){
        console.log(err);
        callback(false);
    })
    .success(function(data){
        callback(data);
    });
}

//add to quicklist

exports.addtolist = function(schoolId, userId, callback){
   //check data
   //console.log(userId);
   SchoolQuicklist.count({where : {schoolId: schoolId, userId: userId}}).success(function(c){
       var returnVal = 0;
       if(c == 0){
           //add rating
           var add = SchoolQuicklist.build({
                schoolId: schoolId,
                userId: userId
            });
            add.save()
            .error(function(err){
                console.log(err);
            })
            .success(function(){
                returnVal = 1;
                callback(returnVal);
            });
           
       }else{
           //do not add
           callback(returnVal);
       }
   });
}



//public edit school data

exports.edit = function(param, callback){
    var sql = "update " + primaryTable + " ";
    var school_name = param.school_name;
    utility.mysql_real_escape_string(param.school_name, function(returnschool_name){
        school_name = returnschool_name;
    });
    sql     += " set school_name='"+school_name+"', ";
    sql     += " cityId='"+param.city+"', ";
    sql     += " email='"+param.email+"', ";
    if(param.description){
        var description = param.description;
        utility.mysql_real_escape_string(param.description, function(returndescription){
            description = returndescription;
        });
        sql     += " description='"+description+"', ";
    }else{
        sql     += " description=NULL, ";
    }
    if(param.website){
        var website = param.website;
        utility.mysql_real_escape_string(param.website, function(returnwebsite){
            website = returnwebsite;
        });
        sql     += " website='"+website+"', ";
    }else{
        sql     += " website=NULL, ";
    }
    if(param.address1){
        var address1 = param.address1;
        utility.mysql_real_escape_string(param.address1, function(returnaddress1){
            address1 = returnaddress1;
        });
        sql     += " address='"+address1+"', ";
    }else{
        sql     += " address='NULL', ";
    }
    if(param.phone){
        var phone = param.phone;
        utility.mysql_real_escape_string(param.phone, function(returnphone){
            phone = returnphone;
        });
        sql     += " phone='"+phone+"', ";
    }else{
        sql     += " phone=NULL, ";
    }
    if(param.facebook){
        var facebook = param.facebook;
        utility.mysql_real_escape_string(param.facebook, function(returnfacebook){
            facebook = returnfacebook;
        });
        sql     += " facebook='"+facebook+"', ";
    }else{
        sql     += " facebook=NULL, ";
    }
    if(param.twitter){
        var twitter = param.twitter;
        utility.mysql_real_escape_string(param.twitter, function(returntwitter){
            twitter = returntwitter;
        });
        sql     += " twitter='"+twitter+"', ";
    }else{
        sql     += " twitter=NULL, ";
    }
    if(param.youtube){
        var youtube = param.youtube;
        utility.mysql_real_escape_string(param.youtube, function(returnyoutube){
            youtube = returnyoutube;
        });
        sql     += " youtube='"+youtube+"', ";
    }else{
        sql     += " youtube=NULL, ";
    }
    if(param.tumblr){
        var tumblr = param.tumblr;
        utility.mysql_real_escape_string(param.tumblr, function(returntumblr){
            tumblr = returntumblr;
        });
        sql     += " tumblr='"+tumblr+"', ";
    }else{
        sql     += " tumblr=NULL, ";
    }
    
    sql     += " updatedAt=NOW() ";
    sql     += " where id = '"+param.id+"' ";
    console.log(sql);
    db.query(sql)
    .error(function(err){
        console.log(err+"   "+sql);
        callback(false);
    })
    .success(function() {
        var schoolId = param.id;
        if(param.school_image){
            param.title = school_name;
            param.image = param.school_image;
            param.profilepic = 1;
            param.schoolId = schoolId;
            schoolImage.clearAllProfilePic(schoolId, function(status){
                if(status){
                   schoolImage.publicadd(param, function(data){
                        callback("success");
                    }); 
                }else{
                    callback("success");
                }
            })
               
        }else{
           callback("success"); 
        }
        
        	
    });
}


exports.doadd = function(param, callback){
    
    var sql = "insert " + primaryTable + " ";
    var school_name = param.school_name;
    utility.mysql_real_escape_string(param.school_name, function(returnschool_name){
        school_name = returnschool_name;
    });
    sql     += " set school_name='"+school_name+"', ";
    sql     += " cityId='"+param.city+"', ";
    sql     += " email='"+param.email+"', ";
    sql     += " `localImg`= '1', ";     
    if(param.description){
        var description = param.description;
        utility.mysql_real_escape_string(param.description, function(returndescription){
            description = returndescription;
        });
        sql     += " description='"+description+"', ";
    }else{
        sql     += " description=NULL, ";
    }
    if(param.website){
        var website = param.website;
        utility.mysql_real_escape_string(param.website, function(returnwebsite){
            website = returnwebsite;
        });
        sql     += " website='"+website+"', ";
    }else{
        sql     += " website=NULL, ";
    }
    if(param.address1){
        var address1 = param.address1;
        utility.mysql_real_escape_string(param.address1, function(returnaddress1){
            address1 = returnaddress1;
        });
        sql     += " address='"+address1+"', ";
    }else{
        sql     += " address='NULL', ";
    }
    if(param.phone){
        var phone = param.phone;
        utility.mysql_real_escape_string(param.phone, function(returnphone){
            phone = returnphone;
        });
        sql     += " phone='"+phone+"', ";
    }else{
        sql     += " phone=NULL, ";
    }
    if(param.facebook){
        var facebook = param.facebook;
        utility.mysql_real_escape_string(param.facebook, function(returnfacebook){
            facebook = returnfacebook;
        });
        sql     += " facebook='"+facebook+"', ";
    }else{
        sql     += " facebook=NULL, ";
    }
    if(param.twitter){
        var twitter = param.twitter;
        utility.mysql_real_escape_string(param.twitter, function(returntwitter){
            twitter = returntwitter;
        });
        sql     += " twitter='"+twitter+"', ";
    }else{
        sql     += " twitter=NULL, ";
    }
    if(param.youtube){
        var youtube = param.youtube;
        utility.mysql_real_escape_string(param.youtube, function(returnyoutube){
            youtube = returnyoutube;
        });
        sql     += " youtube='"+youtube+"', ";
    }else{
        sql     += " youtube=NULL, ";
    }
    if(param.tumblr){
        var tumblr = param.tumblr;
        utility.mysql_real_escape_string(param.tumblr, function(returntumblr){
            tumblr = returntumblr;
        });
        sql     += " tumblr='"+tumblr+"', ";
    }else{
        sql     += " tumblr=NULL, ";
    }
    sql     += " operator='"+param.operator+"',  ";
    sql     += " operatorId='"+param.operatorId+"',  ";
    sql     += " createdAt=NOW() ";
    console.log(sql);
    db.query(sql)
    .error(function(err){
        console.log(err+"   "+sql);
        callback(false);
    })
    .success(function() {
        var q = "SELECT LAST_INSERT_ID() as id;";
        db.query(q).success(function(data){ 
            var schoolId = data[0].id;
            if(param.school_image){
                param.title = school_name;
                param.image = param.school_image;
                param.profilepic = 1;
                param.schoolId = schoolId;
                schoolImage.publicadd(param, function(data){
                    callback(schoolId);
                });   
            }else{
               callback(schoolId); 
            }
                        	
        });
    });
}





exports.del = function(id, callback){
    School.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("School deleted"+info);
        });
    });
}

exports.delCourse = function(schoolId, courseId, callback){ 
    var delQ = "delete from " + primaryTable + "_courses where schoolId = '"+schoolId+"' ";
        db.query(delQ).success(function(){
            callback("success");
        })
}

exports.delTeaching = function(schoolId, callback){
    var delQ = "delete from " + primaryTable + "_courses where schoolId = '"+schoolId+"' ";
        
    db.query(delQ).success(function(){
        callback(true);
    });
}



var insertCourses = function(statement){
    db.query(statement).success(function(){
        //callback(true);
    })
}

exports.saveCourse = function(schoolId, courseIdStr, callback){
    var delQ = "delete from " + primaryTable + "_courses where schoolId = '"+schoolId+"' ";
    console.log(delQ);
    db.query(delQ)
    .error(function(err){
        console.log(err);
        var courseArr = new Array();
        if(courseIdStr.length > 1){
            courseArr = courseIdStr.split("','");
        }else{
            courseArr = courseIdStr;
        }
        console.log(courseArr);
        for(var i=0; i<=courseArr.length;i++){
            var insert = "insert into " + primaryTable + "_courses set schoolId = '"+schoolId+"', courseId = '"+courseArr[i]+"' ";
            insertCourses(insert);
        }
        callback('success');
    })
    .success(function(){
        var courseArr = new Array();
        if(courseIdStr.length > 1){
            courseArr = courseIdStr.split("','");
        }else{
            courseArr = courseIdStr;
        }
        console.log(courseArr);
        for(var i=0; i<=courseArr.length;i++){
            var insert = "insert into " + primaryTable + "_courses set schoolId = '"+schoolId+"', courseId = '"+courseArr[i]+"' ";
            insertCourses(insert);
        }
        callback('success');
            
    })
}




exports.getSchoolCourses = function(schoolId, callback){ 
    
    SchoolCourse.findAll({ where: {schoolId: schoolId } 
    }).success(function(courses) {        
       callback(courses); 
    });
        
}

exports.getCourses = function(schoolId, callback){ 
    var Sql = "SELECT GROUP_CONCAT(DISTINCT(courseId)) AS courses from " + primaryTable + "_courses WHERE schoolId = '"+schoolId+"'";
    db.query(Sql)
    .error(function(err){
        console.log(err+" "+Sql);
    })
    .success(function(data){
        callback(data);
    });
}



exports.fetchImages = function(callback){
    var sql = "select * from " + primaryTable + " where image_url is not null and localImg = 0 and status = 1 order by id asc limit 0, 100";
    
    db.query(sql).success(function(data) {
        callback(data);	
    });
}







exports.loadMySchools = function(userId, callback){
  
  var Sql  = "select s.*, concat(c.name, ', ', c.stateAbbr) as location, si.image as school_image ";
      Sql += " from " + primaryTable + " as s ";
      Sql += " inner join cities as c on s.cityId = c.id ";
      Sql += " left join " + primaryTable + "_images as si on si.schoolId = s.id and si.profilepic = '1' ";
      Sql += " where  s.operatorId = '"+userId+"'  order by s.id DESC ";
  console.log(Sql);
  db.query(Sql)
  .error(function(err){
      console.log(err+" "+Sql);
  })
  .success(function(data) {
      //console.log(data);
        if(data){
            if(data.length > 0){
                callback(data);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
  });
} 

exports.checkSchoolByEmail = function(email, id, callback){
  if(email){
      if(email.length > 0){
            var q = "select * from " + primaryTable + " where email = '"+email+"' ";
            if(id > 0){
                q += " and id <> '"+id+"' ";
            }
            db.query(q)
            .error(function(err){
                console.log(err);
            })
            .success(function(data){
                if(data.length){
                    callback(0);
                }else{
                    callback(1);
                }
            })
      }else{
        callback(1);
      }
  }else{
      callback(1);
  }
}