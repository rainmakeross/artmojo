var schema = require('../../schema');
var Artist = schema.Artist;
var Course = schema.Course;
var School = schema.School;
var ArtistCourse = schema.ArtistCourse;
var ArtistSchool = schema.ArtistSchool;
var ArtistComment = schema.ArtistComment;
var ArtistRating = schema.ArtistRating;
var ArtistQuicklist = schema.ArtistQuicklist;
var userModel = require('./user.js');
var artistImage = require('./artistimage.js');
var db = schema.sequelize;
var utility = require('../helpers/utils');
var primaryTable = 'artists';

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

//list all artists for admin review

exports.listall = function(callback){
    var Sql = "select a.*, ai.image as artist_image, a.localImg, ";
    Sql += " concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as a ";
    Sql += " inner join cities as c on (c.id = a.cityId) ";
    Sql += " inner join " + primaryTable + "_images as ai on ai.artistId = a.id and ai.profilepic = '1' ";
    Sql += " order by createdAt desc limit 0, 1000 ";
    console.log(Sql);
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

//list all artists for sitemap

exports.showUrl = function(callback){
    var Sql = "SELECT id, first_name, last_name, full_name FROM " + primaryTable + " WHERE status = '1' ";
    //console.log(Sql);
    db.query(Sql)
    .error(function(err) {
        console.log(err);
    })
    .success(function(courses) {
        callback(courses);
      });  
} 

////list 3 artists for index random display

exports.loadMentors = function(city, callback){
    var PrimarySql = "select a.full_name, a.id, a.email, a.website, a.phone, ai.image as artist_image, a.localImg, ";
    PrimarySql += " concat(c.name, ', ', c.stateAbbr) as location ";
    PrimarySql += " from " + primaryTable + " as a ";
    PrimarySql += " inner join cities as c on (c.id = a.cityId) ";
    PrimarySql += " inner join " + primaryTable + "_images as ai on ai.artistId = a.id and ai.profilepic = '1' ";
    PrimarySql += " where a.profile_status = '1' ";
    
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
    .success(function(artists) {
         if(artists){
             if(artists.length > 0){
                 callback(artists);
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

/********** ARTIST FUNCTIONALITY STARTS *******************/

//List artists id with full name searches

var fetchArtist = function(param, callback){
    
    var Sql = "select distinct a.id from " + primaryTable + " as a ";
    Sql += " where a.active = '1' AND a.profile_status = '1' ";  
    if(param.courseName.length){
        if(param.courseName != "%"){
            Sql += " and a.full_name REGEXP '"+param.reg_exp_name+"' ";
        }
    }
    
    //console.log(Sql);
    db.query(Sql)
    .error(function(err){
        callback(err, null);
    })
    .success(function(artists) {
        callback(null, artists);
        
    });
};

//list artists ids with course matches, only teaching courses are counted

var fetchArtistCourses = function(param, callback){
    
    var Sql = "select distinct a.id from " + primaryTable + " as a ";
    Sql += " inner join " + primaryTable + "_courses as ac on a.id = ac.artistId and ac.teaches = '1' ";
    Sql += " inner join courses as c on c.id = ac.courseId ";  
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
    .success(function(artists) {
        callback(null, artists);
        
    });
};

//list artist ids with school matches

var fetchArtistSchools = function(param, callback){
    var Sql = "select distinct a.id from " + primaryTable + " as a ";
    Sql += " inner join " + primaryTable + "_schools as aSch on a.id = aSch.artistId ";
    Sql += " inner join schools as sc on sc.id = aSch.schoolId ";  
    if(param.courseName.length){
        if(param.courseName != "%"){
            Sql += " and sc.school_name REGEXP '"+param.reg_exp_name+"' ";
        }
    }
    //console.log(Sql);
    db.query(Sql)
    .error(function(err){
        console.log(err);
        callback(err, null);
    })
    .success(function(artists) {
        callback(null, artists);
        
    });
};

//list all artists from the above accumulated artist ids and various search params

var fetchArtistByParams = function(param, callback){
    
    var Sql = "SELECT a.id, a.full_name, a.description, a.email, a.website, a.phone, ai.image as artist_image, a.total_rate, a.total_comments, a.localImg, ";
    Sql += " concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as a ";
    Sql += " inner join cities as c on (c.id = a.cityId) ";
    Sql += " inner join " + primaryTable + "_images as ai on ai.artistId = a.id and ai.profilepic = '1' ";
    Sql += " WHERE a.active = '1' AND a.profile_status = '1' ";  
    if(param.artistIds){
        Sql += " AND a.id IN ("+param.artistIds+") ";
    }
    /*if(param.courseName.length){
        if(param.courseName != "%"){
            Sql += " AND a.full_name REGEXP '"+param.reg_exp_name+"' ";
        }
    }*/
    if(param.location.length){
        if(param.location != "%"){
            Sql += " AND concat(c.name, ', ', c.stateAbbr) REGEXP '"+param.reg_exp_city+"' ";  
        }
        
    }
    if(param.ratingVal){
        Sql += " AND a.total_rate >= '"+param.ratingVal+"' ";
    }
    if(param.reviewVal){
        if(param.reviewVal == 1){
            Sql += " AND a.total_comments > 0 ";
        }
        if(param.reviewVal == 0){
            Sql += " AND a.total_comments = 0 ";
        }
    }
    
    if(param.phoneVal){
        Sql += " AND a.phone IS NOT NULL ";
    }
    if(param.emailVal){
        Sql += " AND a.email IS NOT NULL ";
    }
    if(param.websiteVal){
        Sql += " AND a.website IS NOT NULL ";
    }
    Sql += " GROUP BY a.id ";
    Sql += " ORDER BY artist_image DESC LIMIT 0, 200";
    console.log(Sql);
    db.query(Sql)
    .error(function(err){
        console.log(err);
        callback(err, null);
    })
    .success(function(artists) {
        callback(null, artists);
        
    });
};

//final fetch data fires on main search submission and filter submissions

exports.fetchData = function(param, callback){
    var artistArr       = new Array();
    var artistCourseArr = new Array();
    var artistSchoolArr = new Array();
    var finalArr = new Array();
    fetchArtist(param, function(err, artists) {
        if(err){
            console.log(err);
            callback(false);
        }else{
            
            if(artists.length){
                Object.keys(artists).forEach(function(key) {
                    artistArr[key] = artists[key]["id"]; 
                });
            }
            fetchArtistCourses(param, function(err1, artists_courses) {
                if(err1){
                    console.log(err1);
                    callback(false); 
                }else{
                    
                    if(artists_courses.length){
                        Object.keys(artists_courses).forEach(function(key) {
                            artistCourseArr[key] = artists_courses[key]["id"]; 
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
                                artistSchoolArr[key] = artists_schools[key]["id"]; 
                            });
                        }
                        finalArr = artistArr.concat(artistCourseArr, artistSchoolArr);
                        
                        if(finalArr){
                            //finalArr = finalArr.unique;
                            //console.log(finalArr);
                            //var finalStr = finalArr.join("','");
                            param['artistIds'] = finalArr;
                            fetchArtistByParams(param, function(err, artistList){
                                if(err){
                                    callback(false);
                                }else{
                                    callback(artistList);
                                }
                            });
                        }
                    }
                });          
                
            });
        }  
        
    });
};

//used to show artist view pages

exports.showDetails = function(url, callback){
  var urlArr = url.split("_");
  var urlCnt = urlArr.length;
  var lastIndex = (urlCnt - 1);
  var modelId = urlArr[lastIndex];
  var Sql = "select a.*, ai.image as artist_image, concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as a ";
    Sql += " inner join cities as c on (c.id = a.cityId) ";
    Sql += " inner join " + primaryTable + "_images as ai on ai.artistId = a.id and ai.profilepic = '1' ";
    Sql += " where a.id = '"+modelId+"' ";
  //console.log(Sql);
  db.query(Sql)
  .error(function(err){
      console.log(err + " " + Sql);
  })
  .success(function(artists) {
		callback(artists[0]);
  });
}

//fetch full artist data by id

exports.fetchDatabyId = function(id, callback){
  var Sql = "select * from " + primaryTable + " as a where a.id = '"+id+"' ";
  db.query(Sql).success(function(events) {
		callback(events[0]);
  }); 
}

//fetch full artist data by userId

exports.fetchDatabyUser = function(userId, callback){
  var Sql = "select a.*, ai.image as artist_image, concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as a ";
    Sql += " inner join cities as c on (c.id = a.cityId) ";
    Sql += " left outer join " + primaryTable + "_images as ai on ai.artistId = a.id and ai.profilepic = '1' ";
    Sql += " where a.userId = '" + userId + "' ";

    //console.log(Sql);
  db.query(Sql).success(function(events) {
		callback(events[0]);
  });
}

//fetch full artist data by generic url

exports.fetchDatabyUrl = function(url, callback){
  var urlArr = url.split("_");
  var urlCnt = urlArr.length;
  var lastIndex = (urlCnt - 1);
  var modelId = urlArr[lastIndex];
  var Sql = "select a.*, ai.image as artist_image, concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as a ";
    Sql += " inner join cities as c on (c.id = a.cityId) ";
    Sql += " inner join " + primaryTable + "_images as ai on ai.artistId = a.id and ai.profilepic = '1' ";
    Sql += " where a.id = '"+modelId+"' ";
  db.query(Sql).success(function(events) {
		callback(events[0]);
  });
}

//show all teaching courses for artists

exports.showTeachingCourse = function(artistId, callback){
    
      ArtistCourse.findAll({
        attributes: ["courseId"], where: {artistId: artistId, teaches: "1" } 
    }).success(function(courseIds) {
        //callback(courses);
        //console.log(artistIds);
        if(courseIds.length){
            //crteate comma separated
            var course_arr = new Array();
            for(var i = 0; i<courseIds.length; i++){
                course_arr[i] = courseIds[i].courseId
            }
            var finalArr = course_arr.unique();
            
            //callback(artist_str);
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

//show all interest courses for artists

exports.showInterestCourse = function(artistId, callback){
    
      ArtistCourse.findAll({
        attributes: ["courseId"], where: {artistId: artistId, interested: "1" } 
    }).success(function(courseIds) {
        //callback(courses);
        //console.log(artistIds);
        if(courseIds.length){
            //crteate comma separated
            var course_arr = new Array();
            for(var i = 0; i<courseIds.length; i++){
                course_arr[i] = courseIds[i].courseId
            }
            var finalArr = course_arr.unique();
            
            //callback(artist_str);
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
//show all scools for artists

exports.showSchool = function(artistId, callback){
    //console.log(courseId);
    
    /*db.query(sql).success(function(artists) {
        callback(artists);
      });*/
      ArtistSchool.findAll({
        attributes: ["schoolId"], where: {artistId: artistId } 
    }).success(function(schoolIds) {
        //callback(artists);
        //console.log(schoolIds);
        if(schoolIds){
            //console.log(schoolIds);
            if(schoolIds.length > 0){
                //crteate comma separated
                var school_arr = new Array();
                for(var i = 0; i<schoolIds.length; i++){
                    school_arr[i] = schoolIds[i].schoolId
                }
                var finalArr = school_arr.unique();

                //callback(school_str);
                School.findAll({ 
                    where: { id: [finalArr] }, 
                    group: 'school_name', 
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

//shows artist reviews

exports.showReview = function(id, callback){
    db.query("SELECT ac.*, u.first_name, u.last_name FROM artist_comments as ac, users as u WHERE ac.userId = u.id AND ac.artistId = '"+id+"' order by ac.id desc")
            .success(function(reviews) {
                    callback(reviews); 
                  });
}

//inserts artist reviews

exports.addReview = function(userId, param, callback){
    var add = ArtistComment.build({
        comments: param.review,
        artistId: param.id,
        userId: userId,
        active: '1',
        rate: '0'
    });
    add.save()
    .error(function(err){
        db.query("SELECT ac.*, u.first_name, u.last_name FROM artist_comments as ac, users as u WHERE ac.userId = u.id AND ac.artistId = '"+param.id+"' order by ac.id desc")
            .success(function(reviews) {
                    callback(reviews); 
                  });
    })
    .success(function(){
        
        
        var Sql = "UPDATE " + primaryTable + " SET total_comments = total_comments + 1 WHERE id = '"+param.id+"'";
        db.query(Sql)
        .success(function(){
            db.query("SELECT ac.*, u.first_name, u.last_name FROM artist_comments as ac, users as u WHERE ac.userId = u.id AND ac.artistId = '"+param.id+"' order by ac.id desc")
            .success(function(reviews) {
                    callback(reviews); 
                  });
        });
         
    });
}

//insert artist rating

exports.addRating = function(param, userId, callback){
   //check data
   //console.log(userId);
   ArtistRating.count({where : {artistId: param.extraP, userId: userId}}).success(function(c){
       var returnVal = 0;
       if(c == 0){
           //add rating
           var add = ArtistRating.build({
                artistId: param.extraP,
                userId: userId,
                vote: (param.rate/4)
            });
            add.save()
            .error(function(err){
                console.log(err);
            })
            .success(function(){
                //little calculation
                ArtistRating.find({
                    attributes: ['id', ['AVG(`vote`)', 'totalRate']], 
                    where: {artistId: param.extraP }
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

//view quicklist for artists

exports.viewlist = function(userId, callback){
    var Sql = "select aq.*, a.full_name as full_name, ai.image as artist_image ";
    Sql += " from artist_quicklists as aq ";
    Sql += " inner join " + primaryTable + " as a on a.id = aq.artistId ";
    Sql += " inner join " + primaryTable + "_images as ai on ai.artistId = a.id and ai.profilepic = '1' ";
    Sql += " where aq.userId = '"+userId+"' ";
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

exports.addtolist = function(artistId, userId, callback){
   //check data
   //console.log(userId);
   ArtistQuicklist.count({where : {artistId: artistId, userId: userId}}).success(function(c){
       var returnVal = 0;
       if(c == 0){
           //add rating
           var add = ArtistQuicklist.build({
                artistId: artistId,
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

//artist registration function

exports.registerArtist = function(param, callback){
    var email = param.semail;
    userModel.checkEmail(email, function(data){
        var userId = data.id;
        var first_name = param.first_name;
        utility.mysql_real_escape_string(param.first_name, function(returnfirst_name){
            first_name = returnfirst_name;
        });
        var last_name = param.last_name;


        utility.mysql_real_escape_string(param.last_name, function(returnlast_name){
            last_name = returnlast_name;
        });
        var sql = "insert into " + primaryTable + " ";
        sql     += " set first_name='"+first_name+"', ";
        sql     += " last_name='"+last_name+"', ";
        sql     += " full_name='"+first_name+" "+last_name+"', ";
        sql     += " email='"+param.semail+"', ";
        sql     += " userId='"+userId+"', ";
        sql     += " cityId='6', ";
        sql     += " number_of_views='1', ";
        sql     += " total_rate='0', ";
        sql     += " email_sent='0', ";
        sql     += " total_comments='0', ";
        sql     += " localImg='0', ";
        sql     += " profile_status='0', ";
        sql     += " createdAt=NOW(), ";
        sql     += " updatedAt=NOW() ";
        //console.log(sql);
        db.query(sql).success(function() {
            var q = "select * from " + primaryTable + " where email='"+param.email+"' order by id desc limit 0, 1";
            db.query(q).success(function(data){ 
                callback(data);	
            })	
        });
    });
    
}

//push an user to a already present artist

exports.updateArtist = function(param, callback){
    var email = param.semail;
    userModel.checkEmail(email, function(data){
        var userId = data.id;
        var sql = "update " + primaryTable + " ";
        sql     += " set userId='"+userId+"', ";
        sql     += " updatedAt=NOW() where id = '"+param.artistId+"' ";
        console.log(sql);
        db.query(sql).success(function() {
            callback("success");	
        });
    });
    
}

//public edit artist data

exports.edit = function(param, callback){
    var sql = "update " + primaryTable + " ";
    var first_name = param.first_name;
    utility.mysql_real_escape_string(param.first_name, function(returnfirst_name){
        first_name = returnfirst_name;
    });
    var last_name = param.last_name;
    utility.mysql_real_escape_string(param.last_name, function(returnlast_name){
        last_name = returnlast_name;
    });
    sql     += " set first_name='"+first_name+"', ";
    sql     += " last_name='"+last_name+"', ";
    sql     += " full_name='"+first_name+" "+last_name+"', ";
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
        sql     += " address1='"+address1+"', ";
    }else{
        sql     += " address1='NULL', ";
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
        var artistId = param.id;
        if(param.artist_image){
            param.title = first_name + " " + last_name;
            param.image = param.artist_image;
            param.profilepic = 1;
            param.artistId = artistId;
            artistImage.clearAllProfilePic(artistId, function(status){
                if(status){
                   artistImage.publicadd(param, function(data){
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
    var first_name = param.first_name;
    utility.mysql_real_escape_string(param.first_name, function(returnfirst_name){
        first_name = returnfirst_name;
    });
    var last_name = param.last_name;
    utility.mysql_real_escape_string(param.last_name, function(returnlast_name){
        last_name = returnlast_name;
    });
    sql     += " set first_name='"+first_name+"', ";
    sql     += " last_name='"+last_name+"', ";
    sql     += " full_name='"+first_name+" "+last_name+"', ";
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
        sql     += " address1='"+address1+"', ";
    }else{
        sql     += " address1='NULL', ";
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
            var artistId = data[0].id;
            if(param.artist_image){
                param.title = first_name + " " + last_name;
                param.image = param.artist_image;
                param.profilepic = 1;
                param.artistId = artistId;
                artistImage.publicadd(param, function(data){
                    callback(artistId);
                });   
            }else{
               callback(artistId); 
            }
                        	
        });
    });
}



exports.doedit = function(param, callback){
    var sql = "update " + primaryTable + " ";
    var first_name = param.first_name;
    utility.mysql_real_escape_string(param.first_name, function(returnfirst_name){
        first_name = returnfirst_name;
    });
    var last_name = param.last_name;
    utility.mysql_real_escape_string(param.last_name, function(returnlast_name){
        last_name = returnlast_name;
    });
    sql     += " set first_name='"+first_name+"', ";
    sql     += " last_name='"+last_name+"', ";
    sql     += " full_name='"+first_name+" "+last_name+"', ";
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
        sql     += " address1='"+address1+"', ";
    }else{
        sql     += " address1='NULL', ";
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
        var artistId = param.id;
        if(param.artist_image){
            param.title = first_name + " " + last_name;
            param.image = param.artist_image;
            param.profilepic = 1;
            param.artistId = artistId;
            artistImage.clearAllProfilePic(artistId, function(status){
                if(status){
                   artistImage.publicadd(param, function(data){
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

exports.del = function(id, callback){
    Artist.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Artist deleted"+info);
        });
    });
}

exports.delCourse = function(artistId, courseId, callback){ 
    var sql = "update " + primaryTable + " set teaches = '0' where artistId = '"+artistId+"' and courseId = '"+courseId+"' ";
    db.query(sql).success(function() {
        var delQ = "delete from " + primaryTable + "_courses where artistId = '"+artistId+"' and teaches = '0' and interested = '0' ";
        db.query(delQ).success(function(){
            callback("success");
        })
    });
}

exports.delTeaching = function(artistId, callback){
    var sql = "update " + primaryTable + "_courses set teaches = '0' where artistId = '"+artistId+"' ";
    db.query(sql).success(function(){
        var delQ = "delete from " + primaryTable + "_courses where artistId = '"+artistId+"' and teaches = '0' and interested = '0' ";
        
        db.query(delQ).success(function(){
            callback(true);
        });
    });
}

exports.delInterest = function(artistId, callback){
    var sql = "update " + primaryTable + "_courses set interested = '0' where artistId = '"+artistId+"' ";
    db.query(sql).success(function(){
        var delQ = "delete from " + primaryTable + "_courses where artistId = '"+artistId+"' and teaches = '0' and interested = '0' ";
        
        db.query(delQ).success(function(){
            callback(true);
        });
    });
}

var insertCourses = function(statement){
    db.query(statement).success(function(){
        //callback(true);
    })
}

exports.saveCourse = function(artistId, courseIdStr, callback){
    var delQ = "delete from " + primaryTable + "_courses where artistId = '"+artistId+"' and teaches = '1' ";
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
            var insert = "insert into " + primaryTable + "_courses set artistId = '"+artistId+"', courseId = '"+courseArr[i]+"', teaches = '1', interested = '0' ";
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
            var insert = "insert into " + primaryTable + "_courses set artistId = '"+artistId+"', courseId = '"+courseArr[i]+"', teaches = '1', interested = '0' ";
            insertCourses(insert);
        }
        callback('success');
            
    })
}

exports.saveInterest = function(artistId, courseIdStr, callback){
    var delQ = "delete from " + primaryTable + "_courses where artistId = '"+artistId+"' and interested = '1' ";
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
            var insert = "insert into " + primaryTable + "_courses set artistId = '"+artistId+"', courseId = '"+courseArr[i]+"', teaches = '0', interested = '1' ";
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
            var insert = "insert into " + primaryTable + "_courses set artistId = '"+artistId+"', courseId = '"+courseArr[i]+"', teaches = '0', interested = '1' ";
            insertCourses(insert);
        }
        callback('success');
            
    })
}



exports.getArtistCourses = function(artistId, callback){ 
    
    ArtistCourse.findAll({ where: {artistId: artistId, teaches: "1" } 
    }).success(function(courses) {        
       callback(courses); 
    });
        
}

exports.getCourses = function(artistId, callback){ 
    var Sql = "SELECT GROUP_CONCAT(DISTINCT(courseId)) AS courses from " + primaryTable + "_courses WHERE artistId = '"+artistId+"'";
    db.query(Sql)
    .error(function(err){
        console.log(err+" "+Sql);
    })
    .success(function(data){
        callback(data);
    });
}

exports.getArtistInterests = function(artistId, callback){ 
    
    ArtistCourse.findAll({ where: {artistId: artistId, interested: "1" } 
    }).success(function(courses) {        
       callback(courses); 
    });
        
}

exports.fetchImages = function(callback){
    var sql = "select * from " + primaryTable + " where image_url is not null and localImg = 0 and status = 1 order by id asc limit 0, 100";
    
    db.query(sql).success(function(data) {
        callback(data);	
    });
}

exports.fetchExistingImages = function(callback){
    var sql = "select * from " + primaryTable + " where artist_image is not null order by id asc limit 0, 100";
    
    db.query(sql).success(function(data) {
        callback(data);	
    });
}

exports.updateImages = function(id, artist_image, callback){
    var q = "update " + primaryTable + " set artist_image = '"+artist_image+"', localImg = '1' where id = '"+id+"' ";
    //console.log(q);
    db.query(q).success(function() {
        callback(true);	
    });
    
}

exports.makePrivate = function(userId, callback){
    var q = "update " + primaryTable + " set profile_status = '0' where userId = '"+userId+"' ";
    //console.log(q);
    db.query(q)
    .error(function(err){
        console.log(err+ " "+q);
        callback(false);
    })
    .success(function() {
        callback(true);	
    });
    
}

exports.makePublic = function(userId){
    var q = "update " + primaryTable + " set profile_status = '1' where userId = '"+userId+"' ";
    //console.log(q);
    db.query(q)
    .error(function(err){
        console.log(err+ " "+q);
        callback(false);
    })
    .success(function() {
        callback(true);	
    });
    
}

exports.loadMyArtists = function(userId, callback){
  
  var Sql  = "select a.*, concat(c.name, ', ', c.stateAbbr) as location, ai.image as artist_image ";
      Sql += " from " + primaryTable + " as a ";
      Sql += " inner join cities as c on a.cityId = c.id ";
      Sql += " left join " + primaryTable + "_images as ai on ai.artistId = a.id and ai.profilepic = '1' ";
      Sql += " where  a.operatorId = '"+userId+"'  order by a.id DESC ";
  //console.log(Sql);
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

exports.checkArtistByEmail = function(email, id, callback){
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