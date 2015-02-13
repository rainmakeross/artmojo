var schema = require('../../schema');
var Course = schema.Course;
var Artist = schema.Artist;
var School = schema.School;
var ArtistCourse = schema.ArtistCourse;
var SchoolCourse = schema.SchoolCourse;
var utility = require('../helpers/utils');
var db = schema.sequelize;


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



exports.showArtist = function(courseId, callback){
    //console.log(courseId);
    
    /*db.query(sql).success(function(artists) {
        callback(artists);
      });*/
    ArtistCourse.findAll({
        attributes: ["artistId"], where: ["courseId = ? AND teaches = '1' ", courseId] 
    }).success(function(artistIds) {
        //callback(courses);
        //console.log(artistIds);
        if(artistIds.length){
            //crteate comma separated
            var artist_arr = new Array();
            for(var i = 0; i<artistIds.length; i++){
                artist_arr[i] = artistIds[i].artistId
            }
            var finalArr = artist_arr.unique();
            var finalStr = finalArr.join("','");
            var Sql = "select a.*, ai.image as artist_image, concat(c.name, ', ', c.stateAbbr) as location ";
            Sql += " from artists as a ";
            Sql += " inner join cities as c on (c.id = a.cityId) ";
            Sql += " inner join artists_images as ai on ai.artistId = a.id and ai.profilepic = '1' ";
            Sql += " where a.id IN ('"+finalStr+"') GROUP BY a.full_name ORDER BY rand() LIMIT 0,150";
            //console.log(Sql);
            db.query(Sql)
            .success(function(artists) {
                callback(artists);
            })
            .error(function(err){
                console.log(err);
                callback(false);
            });
            /*Artist.findAll({ 
                where: { id: [finalArr] }, 
                group: 'full_name', 
                order: 'rand()',
                limit: 150                
            }).success(function(artists) {
                callback(artists);
            }).error(function(err){
                console.log(err);
            });*/
            
        }else{
            console.log("Here");
            callback("");
        }
        
    });
}

exports.showSchool = function(courseId, callback){
    //console.log(courseId);
    
    /*db.query(sql).success(function(artists) {
        callback(artists);
      });*/
      SchoolCourse.findAll({
        attributes: ["schoolId"], where: {courseId: courseId } 
    }).success(function(schoolIds) {
        //callback(courses);
        //console.log(schoolIds);
        if(schoolIds.length){
            //crteate comma separated
            var school_arr = new Array();
            for(var i = 0; i<schoolIds.length; i++){
                school_arr[i] = schoolIds[i].schoolId
            }
            var finalArr = school_arr.unique();
            var finalStr = finalArr.join("','");
            var Sql = "select s.*, si.image as school_image, concat(c.name, ', ', c.stateAbbr) as location ";
            Sql += " from schools as s ";
            Sql += " inner join cities as c on (c.id = s.cityId) ";
            Sql += " inner join schools_images as si on si.schoolId = s.id and si.profilepic = '1' ";
            Sql += " where s.id IN ('"+finalStr+"') GROUP BY s.school_name ORDER BY rand() LIMIT 0,150";
            //console.log(Sql);
            db.query(Sql)
            .success(function(schools) {
                callback(schools);
            })
            .error(function(err){
                console.log(err);
                callback(false);
            });
        }else{
            console.log("Here");
            callback("");
        }
        
    });
}

exports.showList = function(callback){
    var Sql = "select c.*, ci.image as course_image ";
    Sql += " from courses as c ";
    Sql += " inner join courses_images as ci on ci.courseId = c.id and ci.profilepic = '1' ";
    Sql += " where c.active = '1' order by c.course_name asc ";
    db.query(Sql)
    .error(function(err){
      console.log(err+"  "+Sql);
    })
    .success(function(courses) {
            callback(courses);
    });
} 

exports.showAll = function(callback){
    var Sql = "select c.*, ci.image as course_image ";
    Sql += " from courses as c ";
    Sql += " inner join courses_images as ci on ci.courseId = c.id and ci.profilepic = '1' ";
    Sql += " where c.active = '1' order by c.course_name asc ";
    db.query(Sql)
    .error(function(err){
      console.log(err+"  "+Sql);
    })
    .success(function(courses) {
            callback(courses);
    });
} 

exports.showListByCategory = function(id, callback){
    var Sql = "select * from `courses` where `categoryId` = '" + id + "' order by `course_name` asc ";
    db.query(Sql)
    .error(function(err){
      console.log(err+"  "+Sql);
    })
    .success(function(courses) {
            callback(courses);
    });
} 

exports.show = function(id, callback){
	var Sql = "select course_name from courses where categoryId = '" + id + "'";
	db.query(Sql)
        .error(function(err){
            console.log(err+"  "+Sql);
          })
        .success(function(courses) {
		callback(courses);
	});		
} 

exports.showAll = function(callback){
    var Sql = "select c.*, ci.image as course_image ";
    Sql += " from courses as c ";
    Sql += " inner join courses_images as ci on ci.courseId = c.id and ci.profilepic = '1' ";
    Sql += " where c.active = '1' order by c.course_name asc ";
    db.query(Sql)
    .error(function(err){
      console.log(err+"  "+Sql);
    })
    .success(function(courses) {
            callback(courses);
    });
    
    
} 
exports.showUrl = function(callback){
    var Sql = "SELECT * FROM courses WHERE active = '1' ORDER BY `course_name` ASC  ";
    db.query(Sql)
    .error(function(err){
      console.log(err+"  "+Sql);
    })
    .success(function(courses) {
        callback(courses);
      }); 
    
    
} 



/*
 * getCourses - function to fetch course name for autocomplete
 */
exports.getCourses = function(param, callback){
    var course_name = param.term;
    var Sql = "SELECT * FROM courses WHERE course_name like '%" + course_name + "%' AND active = '1'  ORDER BY course_name ASC ";
    db.query(Sql)
    .error(function(err){
        console.log(err);
    })
    .success(function(courses) {
        callback(courses);
      }); 
};

exports.getCoursesBIds = function(courses, callback){
    var Sql = "SELECT * FROM courses WHERE id IN ("+courses+")  ORDER BY course_name ASC ";
    db.query(Sql)
    .error(function(err){
        console.log(err+" "+Sql);
    })
    .success(function(courses) {
        callback(courses);
      }); 
};
/*
 * load courses for index page display
 */
exports.loadCourses = function(callback){
    var Sql = "select c.course_name, c.course_description, c.id, ci.image as course_image ";
    Sql += " from courses as c ";
    Sql += " inner join courses_images as ci on ci.courseId = c.id and ci.profilepic = '1' ";
    Sql += " where c.active = '1' order by rand() limit 0,3 ";
    console.log(Sql);
    db.query(Sql)
    .error(function(err){
        console.log(err);
    })
    .success(function(courses) {
        callback(courses);
      });
       
}

/*
 * View course by url
 */

exports.showDetails = function(url, callback){
    var urlArr = url.split("_");
    var urlCnt = urlArr.length;
    var lastIndex = (urlCnt - 1);
    var modelId = urlArr[lastIndex];
    var urlArr = url.split("_");
    var urlCnt = urlArr.length;
    var lastIndex = (urlCnt - 1);
    var modelId = urlArr[lastIndex];
  var PrimarySql = "select c.*, ci.image as course_image ";
    PrimarySql += " from courses as c ";
    PrimarySql += " inner join courses_images as ci on ci.courseId = c.id and ci.profilepic = '1' ";
    PrimarySql += " where c.id = '" + modelId + "' ";
  db.query(PrimarySql)
  .error(function(err){
      console.log(err+"  "+PrimarySql);
  })
  .success(function(courses) {
    callback(courses[0]);
  }); 
}

exports.loadSubject = function(id, callback){
    var sql = "SELECT * FROM  subjects WHERE courseId = '"+id+"' ORDER BY subject_name ASC";
    db.query(sql)
    .error(function(err){
      console.log(err+"  "+sql);
  })
    .success(function(subjects) {
        callback(subjects);
    });  
}

exports.loadArtistByFilter = function(param, callback){
    //collect the filters
    var courseId = param.aCourseId;
    var rateArtist = param.rateArtist;
    var reviewArtist = param.reviewArtist;
    var innerLocArtistArr = param.innerLocArtist.split(",");
    var contactArtist = param.contactArtist;
    //master query
    ArtistCourse.findAll({
        attributes: ["artistId"], where: {courseId: courseId } 
    }).success(function(artistIds) {
        //callback(courses);
        //console.log(artistIds);
        if(artistIds.length){
            //crteate comma separated
            var artist_arr = new Array();
            for(var i = 0; i<artistIds.length; i++){
                artist_arr[i] = artistIds[i].artistId
            }
            var finalArr = artist_arr.unique();
            var finalStr = finalArr.join("','");
            var sql = "select a.*, ai.image as artist_image, concat(c.name, ', ', c.stateAbbr) as location ";
            sql += " from artists as a ";
            sql += " inner join cities as c on (c.id = a.cityId) ";
            sql += " inner join artists_images as ai on ai.artistId = a.id and ai.profilepic = '1' ";
            sql += " WHERE a.id IN ('"+finalStr+"') ";
            if(rateArtist){
                sql += " AND a.total_rate >= '"+rateArtist+"' ";
            }
            if(reviewArtist){
                if(reviewArtist == 1){
                    sql += " AND a.total_comments > 0 ";
                }
                if(reviewArtist == 0){
                    sql += " AND a.total_comments = 0 ";
                }
                
            }
            if(innerLocArtistArr[0]){
                sql += " AND concat(c.name, ', ', c.stateAbbr) LIKE '%"+innerLocArtistArr[0]+"%' ";
            }
            if(contactArtist){
                if(contactArtist == 1){
                    sql += " AND a.phone IS NOT NULL ";
                }
                if(contactArtist == 2){
                    sql += " AND a.email IS NOT NULL ";
                }
                if(contactArtist == 3){
                    sql += " AND a.website IS NOT NULL ";
                }
                if(contactArtist == 4){
                    sql += " AND a.phone IS NOT NULL AND `email` IS NOT NULL AND a.website IS NOT NULL ";
                }
                
            }
            sql += " GROUP BY a.full_name ORDER BY rand() LIMIT 0, 150";
            console.log(sql);
            db.query(sql)
            .success(function(artists) {
                callback(artists);
            })
            .error(function(err){
                console.log(err);
            });
            
        }
        
    });
}

exports.loadSchoolByFilter = function(param, callback){
    //collect the filters
    var courseId = param.sCourseId;
    var rateSchool = param.rateSchool;
    var reviewSchool = param.reviewSchool;
    var innerLocSchoolArr = param.innerLocSchool.split(",");
    var contactSchool = param.contactSchool;
    //master query
    SchoolCourse.findAll({
        attributes: ["schoolId"], where: {courseId: courseId } 
    }).success(function(schoolIds) {
        //callback(courses);
        //console.log(schoolIds);
        if(schoolIds.length){
            //crteate comma separated
            var school_arr = new Array();
            for(var i = 0; i<schoolIds.length; i++){
                school_arr[i] = schoolIds[i].schoolId
            }
            var finalArr = school_arr.unique();
            var finalStr = finalArr.join("','");
            var Sql = "select s.*, si.image as school_image, concat(c.name, ', ', c.stateAbbr) as location ";
            Sql += " from schools as s ";
            Sql += " inner join cities as c on (c.id = s.cityId) ";
            Sql += " inner join schools_images as si on si.schoolId = s.id and si.profilepic = '1' ";
            Sql += " where s.id IN ('"+finalStr+"') ";
            if(rateSchool){
                sql += " AND s.total_rate >= '"+rateSchool+"' ";
            }
            if(reviewSchool){
                if(reviewSchool == 1){
                    sql += " AND s.total_comments > 0 ";
                }
                if(reviewSchool == 0){
                    sql += " AND s.total_comments = 0 ";
                }
                
            }
            if(innerLocSchoolArr[0]){
                sql += " AND concat(c.name, ', ', c.stateAbbr) LIKE '%"+innerLocSchoolArr[0]+"%' ";
            }
            if(contactSchool){
                if(contactSchool == 1){
                    sql += " AND s.phone IS NOT NULL ";
                }
                if(contactSchool == 2){
                    sql += " AND s.email IS NOT NULL ";
                }
                if(contactSchool == 3){
                    sql += " AND s.website IS NOT NULL ";
                }
                if(contactSchool == 4){
                    sql += " AND s.phone IS NOT NULL AND s.email IS NOT NULL AND s.website IS NOT NULL ";
                }
                
            }
            sql += " GROUP BY s.school_name ORDER BY rand() LIMIT 0, 150";
            //console.log(sql);
            db.query(sql)
            .success(function(schools) {
                callback(schools);
            })
            .error(function(err){
                console.log(err);
            });
            
        }
        
    });
}



// CRUD CODE

exports.list = function(callback){
    Course.findAll().success(function(courses) {
         callback(courses);
    }); 
} 

exports.listall = function(callback){
    var Sql = "select c.*, ci.image as course_image ";
    Sql += " from courses as c ";
    Sql += " inner join courses_images as ci on ci.courseId = c.id and ci.profilepic = '1' ";
    Sql += " where c.active = '1' order by c.createdAt desc ";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.fetchDatabyId = function(id, callback){
    var PrimarySql = "select c.*, ci.image as course_image ";
    PrimarySql += " from courses as c ";
    PrimarySql += " inner join courses_images as ci on ci.courseId = c.id and ci.profilepic = '1' ";
    PrimarySql += " where c.id = '" + id + "' ";
  db.query(PrimarySql)
  .error(function(err){
      console.log(err+"  "+PrimarySql);
  })
  .success(function(courses) {
    callback(courses[0]);
  }); 
}

exports.checkCourseByTitle = function(param, courseId, callback){
  var course_name  = param.course_name;
  var categoryId = param.category;
  var course_name = param.course_name;
    utility.mysql_real_escape_string(param.course_name, function(returnTitle){
        course_name = returnTitle;
    });
  var q = "select * from courses where course_name = '"+course_name+"' and categoryId = '"+categoryId+"'  ";
  if(courseId > 0){
      q += " and id <> '"+courseId+"' ";
  }
  //console.log(q);
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
}

exports.add = function(param, callback){
    var add = Course.build({
        categoryId: param.category,
        course_name: param.course_name,
        course_description: param.course_description,
        course_image: param.course_image
    });
    add.save()
    .error(function(err){
        callback("Course not added"+err);
    })
    .success(function(){
        callback('Course added');
    });
}

exports.edit = function(param, callback){
    Course.find({where : {id: param.courseId}}).success(function(edit){
        edit.categoryId = param.category;
        edit.course_name = param.course_name;
        edit.custom_description = param.custom_description;
        edit.course_image = param.course_image;
        edit.save()
        .error(function(err){
            callback("Course is not edited"+err);
        })
        .success(function(){
            callback("Course edited successfully");
        });
    });
}

exports.del = function(id, callback){
    Course.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Course deleted"+info);
        });
    });
}

var fetchCourse = function(param, callback){
    
    var Sql = "select distinct c.id from courses as c ";
    Sql += " where c.active = '1' ";  
    if(param.courseName.length){
        if(param.courseName != "%"){
            Sql += " and c.course_name REGEXP '"+param.reg_exp_name+"' ";
        }
    }
    
    //console.log(Sql);
    db.query(Sql)
    .error(function(err){
        callback(err, null);
    })
    .success(function(courses) {
        //console.log(courses);
        callback(null, courses);
        
    });
};

var fetchCourseByParams = function(param, callback){
    
    var Sql = "SELECT c.id, c.course_name, c.course_description, ci.image as course_image ";
    Sql += " from courses as c ";
    Sql += " inner join courses_images as ci on ci.courseId = c.id and ci.profilepic = '1' ";
    Sql += " WHERE c.active = '1' ";  
    if(param.courseIds){
        Sql += " AND c.id IN ("+param.courseIds+") ";
    }
    /*if(param.courseName.length){
        if(param.courseName != "%"){
            Sql += " AND s.school_name REGEXP '"+param.reg_exp_name+"' ";
        }
    }*/
    if(param.categoryId){
        Sql += " AND `categoryId` = '"+param.categoryId+"' ";
    }   
    
    Sql += " GROUP BY c.id ";
    Sql += " ORDER BY course_image DESC LIMIT 0, 200";
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

var fetchSchoolCourses = function(param, callback){
    
    var Sql = "select distinct c.id from courses as c ";
    Sql += " inner join schools_courses as sc on c.id = sc.courseId ";
    Sql += " inner join schools as s on s.id = sc.schoolId "; 
    if(param.courseName.length){
        if(param.courseName != "%"){
            Sql += " and s.school_name REGEXP '"+param.reg_exp_name+"' ";
        }
    }
    Sql += " inner join cities as ci on ci.id = s.cityId ";    
    if(param.location.length){
        if(param.location != "%"){
            Sql += " AND concat(ci.name, ', ', ci.stateAbbr) REGEXP '"+param.reg_exp_city+"' ";  
        }
        
    }
    console.log(Sql);
    db.query(Sql)
    .error(function(err){
        console.log(err);
        callback(err, null);
    })
    .success(function(courses) {
        console.log(courses);
        callback(null, courses);
        
    });
};

var fetchCourseArtists = function(param, callback){
    var Sql = "select distinct c.id from courses as c ";
    Sql += " inner join artists_courses as ac on c.id = ac.courseId ";
    Sql += " inner join artists as a on a.id = ac.artistId ";
    if(param.courseName.length){
        if(param.courseName != "%"){
            Sql += " and a.full_name REGEXP '"+param.reg_exp_name+"' ";
        }
    }
    Sql += " inner join cities as ci on ci.id = a.cityId ";    
    if(param.location.length){
        if(param.location != "%"){
            Sql += " AND concat(ci.name, ', ', ci.stateAbbr) REGEXP '"+param.reg_exp_city+"' ";  
        }
        
    }
    console.log(Sql);
    db.query(Sql)
    .error(function(err){
        console.log(err);
        callback(err, null);
    })
    .success(function(courses) {
        console.log(courses);
        callback(null, courses);
        
    });
};



exports.fetchData = function(param, callback){
    var courseArr       = new Array();
    var schoolCourseArr = new Array();
    var artistCourseArr = new Array();
    var finalArr = new Array();
    fetchCourse(param, function(err, courses) {
        if(err){
            console.log(err);
            callback(false);
        }else{
            
            if(courses.length){
                Object.keys(courses).forEach(function(key) {
                    courseArr[key] = courses[key]["id"]; 
                });
                param['courseIds'] = courseArr;
                fetchCourseByParams(param, function(err, courseList){
                    if(err){
                        callback(false);
                    }else{
                        callback(courseList);
                    }
                });
            }else{
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
                    fetchCourseArtists(param, function(err2, artists_courses) {
                        if(err2){
                            console.log(err2);
                            callback(false); 
                        }else{
                            if(artists_courses.length){
                                Object.keys(artists_courses).forEach(function(key) {
                                    artistCourseArr[key] = artists_courses[key]["id"]; 
                                });
                            }
                            finalArr = courseArr.concat(schoolCourseArr, artistCourseArr);

                            if(finalArr){
                                //finalArr = finalArr.unique;
                                //console.log(finalArr);
                                //var finalStr = finalArr.join("','");
                                param['courseIds'] = finalArr;
                                fetchCourseByParams(param, function(err, courseList){
                                    if(err){
                                        callback(false);
                                    }else{
                                        callback(courseList);
                                    }
                                });
                            }
                        }
                    });          

                });    
            }
            
        }  
        
    });
};

