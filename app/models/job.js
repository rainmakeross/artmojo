var schema = require('../../schema')
, db = schema.sequelize
, utility = require('../helpers/utils')
, Job = schema.Job
, jobImage = require('./jobimage.js')
, primaryTable = 'jobs';



exports.listall = function(callback){
    var Sql = "select j.*, ji.image as job_image, ";
    Sql += " concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as j ";
    Sql += " inner join cities as c on (c.id = j.cityId) ";
    Sql += " left join " + primaryTable + "_images as ji on ji.jobId = j.id and ji.profilepic = '1' ";
    Sql += " ORDER BY id DESC ";
    console.log(Sql);
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.publicadd = function(param, callback){
    var closingDate = param.from_year + '-' + param.from_month + '-' + param.from_date;
    
    
    var jobTitle = param.jobTitle;
    utility.mysql_real_escape_string(param.jobTitle, function(returnTitle){
        jobTitle = returnTitle;
    });
    var sql = "insert into " + primaryTable + " set ";
    sql     += " jobTitle='"+jobTitle+"', ";
    sql     += " closingDate='"+closingDate+"', ";
    sql     += " categoryId='"+param.category+"', ";
    sql     += " job_typeId='"+param.job_typeId+"', ";
    sql     += " userId='"+param.userId+"', ";
    if(param.operator){
        sql     += " `operator`='"+param.operator+"', ";
    }else{
        sql     += " `operator`= null, "; 
    }
    sql     += " applicationEmail='"+param.applicationEmail+"', ";
    
    if(param.description){
        var jobDesc = param.description;
        utility.mysql_real_escape_string(param.description, function(returnDesc){
            jobDesc = returnDesc;
        });
        sql     += " `description`='"+jobDesc+"', ";
    }else{
        sql     += " `description`= null, "; 
    }
    if(param.salary){
        var jobSalary = param.salary;
        utility.mysql_real_escape_string(param.salary, function(returnSalary){
            jobSalary = returnSalary;
        });
        sql     += " `salary`='"+jobSalary+"', ";        
    }else{
        sql     += " `salary`= null, "; 
    }    
    if(param.applicationWebsite){
        var jobWebsite = param.applicationWebsite;
        utility.mysql_real_escape_string(param.applicationWebsite, function(returnWebsite){
            jobWebsite = returnWebsite;
        });
        sql     += " `applicationWebsite`='"+jobWebsite+"', ";
    }
    if(param.applicationAddress){
        var jobAddress = param.applicationAddress;
        utility.mysql_real_escape_string(param.applicationAddress, function(returnAddress){
            jobAddress = returnAddress;
        });
        sql     += " `applicationAddress`='"+jobAddress+"', ";
    }else{
        sql     += " `applicationAddress`= null, "; 
    }
    if(param.applicationPhone){
        var jobPhone = param.applicationPhone;
        utility.mysql_real_escape_string(param.applicationPhone, function(returnPhone){
            jobPhone = returnPhone;
        });
        sql     += " `applicationPhone`='"+jobPhone+"', ";
    }else{
        sql     += " `applicationPhone`= null, "; 
    }
    sql     += " cityId='"+param.city+"', ";
    sql     += " `localImg`= '1', "; 
    sql     += " createdAt=NOW(), ";
    sql     += " updatedAt=NOW() ";
    db.query(sql)
    .error(function(err){
        console.log(err+" "+sql);
    })
    .success(function() {
        var q = "SELECT LAST_INSERT_ID() as id;";
        db.query(q).success(function(data){ 
            var jobId = data[0].id;
            if(param.job_image){
                param.title = jobTitle;
                param.image = param.job_image;
                param.profilepic = 1;
                param.jobId = jobId;
                jobImage.publicadd(param, function(data){
                    callback('Job added');
                });   
            }else{
               callback('Job added');
            }
                        	
        });
        
	
    });
}

exports.tempadd = function(param, callback){
    var closingDate = param.from_year + '-' + param.from_month + '-' + param.from_date;
    
    var jobTitle = param.jobTitle;
    utility.mysql_real_escape_string(param.jobTitle, function(returnTitle){
        jobTitle = returnTitle;
    });
    var sql = "insert into temp_" + primaryTable + " ";
    sql     += " set `jobTitle`='"+jobTitle+"', ";
    sql     += " `closingDate`='"+closingDate+"', ";
    sql     += " `categoryId`='"+param.categoryId+"', ";
    sql     += " `job_typeId`='"+param.job_typeId+"', ";
    if(param.salary){
        var jobSalary = param.salary;
        utility.mysql_real_escape_string(param.salary, function(returnSalary){
            jobSalary = returnSalary;
        });
        sql     += " `salary`='"+jobSalary+"', ";        
    }else{
        sql     += " `salary`= null, "; 
    }
    if(param.description){
        var jobDesc = param.description;
        utility.mysql_real_escape_string(param.description, function(returnDesc){
            jobDesc = returnDesc;
        });
        sql     += " `description`='"+jobDesc+"', ";
    }else{
        sql     += " `description`= null, "; 
    }
    sql     += " `applicationEmail`='"+param.applicationEmail+"', ";
    
    
    if(param.applicationWebsite){
        var jobWebsite = param.applicationWebsite;
        utility.mysql_real_escape_string(param.applicationWebsite, function(returnWebsite){
            jobWebsite = returnWebsite;
        });
        sql     += " `applicationWebsite`='"+jobWebsite+"', ";
    }
    if(param.applicationAddress){
        var jobAddress = param.applicationAddress;
        utility.mysql_real_escape_string(param.applicationAddress, function(returnAddress){
            jobAddress = returnAddress;
        });
        sql     += " `applicationAddress`='"+jobAddress+"', ";
    }else{
        sql     += " `applicationAddress`= null, "; 
    }
    if(param.applicationPhone){
        var jobPhone = param.applicationPhone;
        utility.mysql_real_escape_string(param.applicationPhone, function(returnPhone){
            jobPhone = returnPhone;
        });
        sql     += " `applicationPhone`='"+jobPhone+"', ";
    }else{
        sql     += " `applicationPhone`= null, "; 
    }
    
    sql     += " `cityId`='"+param.city+"', ";
    sql     += " `createdAt`=NOW(), ";
    sql     += " `updatedAt`=NOW() ";
    db.query(sql)
    .error(function(err){
        console.log(err+" "+sql);
    })
    .success(function() {
        callback('Job added');
	
    });
}

exports.publicedit = function(param, callback){
    var closingDate = param.from_year + '-' + param.from_month + '-' + param.from_date;
    
    var jobTitle = param.jobTitle;
    utility.mysql_real_escape_string(param.jobTitle, function(returnTitle){
        jobTitle = returnTitle;
    });
    
    var sql = "update " + primaryTable + " set ";
    sql     += " jobTitle='"+jobTitle+"', ";
    sql     += " closingDate='"+closingDate+"', ";
    sql     += " categoryId='"+param.category+"', ";
    sql     += " job_typeId='"+param.job_typeId+"', ";
    sql     += " userId='"+param.userId+"', ";
    if(param.operator){
        sql     += " `operator`='"+param.operator+"', ";
    }else{
        sql     += " `operator`= null, "; 
    }
    sql     += " applicationEmail='"+param.applicationEmail+"', ";
    
    if(param.salary){
        var jobSalary = param.salary;
        utility.mysql_real_escape_string(param.salary, function(returnSalary){
            jobSalary = returnSalary;
        });
        sql     += " `salary`='"+jobSalary+"', ";        
    }else{
        sql     += " `salary`= null, "; 
    }
    if(param.description){
        var jobDesc = param.description;
        utility.mysql_real_escape_string(param.description, function(returnDesc){
            jobDesc = returnDesc;
        });
        sql     += " `description`='"+jobDesc+"', ";
    }else{
        sql     += " `description`= null, "; 
    }
    if(param.applicationWebsite){
        var jobWebsite = param.applicationWebsite;
        utility.mysql_real_escape_string(param.applicationWebsite, function(returnWebsite){
            jobWebsite = returnWebsite;
        });
        sql     += " `applicationWebsite`='"+jobWebsite+"', ";
    }
    if(param.applicationAddress){
        var jobAddress = param.applicationAddress;
        utility.mysql_real_escape_string(param.applicationAddress, function(returnAddress){
            jobAddress = returnAddress;
        });
        sql     += " `applicationAddress`='"+jobAddress+"', ";
    }else{
        sql     += " `applicationAddress`= null, "; 
    }
    if(param.applicationPhone){
        var jobPhone = param.applicationPhone;
        utility.mysql_real_escape_string(param.applicationPhone, function(returnPhone){
            jobPhone = returnPhone;
        });
        sql     += " `applicationPhone`='"+jobPhone+"', ";
    }else{
        sql     += " `applicationPhone`= null, "; 
    }
    sql     += " cityId='"+param.city+"', ";
    sql     += " `localImg`= '1', "; 
    sql     += " updatedAt=NOW() ";
    sql     += " where id = '"+param.jobId+"' ";
    
    db.query(sql)
    .error(function(err){
        console.log(err+" "+sql);
        callback(false);
    })
    .success(function() {
	var jobId = param.jobId;
        if(param.job_image){
            param.title = jobTitle;
            param.image = param.job_image;
            param.profilepic = 1;
            param.jobId = jobId;
            jobImage.clearAllProfilePic(jobId, function(status){
                if(status){
                   jobImage.publicadd(param, function(data){
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




exports.loadjobs = function(city, callback){
  var PrimarySql = "select j.*, ji.image as job_image, concat(c.name, ', ', c.stateAbbr) as location ";
    PrimarySql += " from " + primaryTable + " as j ";
    PrimarySql += " inner join cities as c on (c.id = j.cityId) ";
    PrimarySql += " left join " + primaryTable + "_images as ji on ji.jobId = j.id and ji.profilepic = '1' ";
    PrimarySql += " where j.status = '1' ";
  var Sql = PrimarySql;
  
  if(city){
      Sql += " AND concat(c.name, ', ', c.stateAbbr) LIKE '%"+city+"%'  ";
  }
  Sql += "  ORDER BY j.closingDate DESC LIMIT 0, 8 ";
  console.log(Sql);
  db.query(Sql).success(function(jobs) {
        if(jobs){
            if(jobs.length > 0){
                callback(jobs);
            }else{
                var Sql2 = PrimarySql + " AND concat(c.name, ', ', c.stateAbbr) LIKE '%International%'   ORDER BY rand() LIMIT 0,8 ";
                console.log(Sql2);
                db.query(Sql2)
                .error(function(err2){
                    console.log(err2+" "+Sql2)
                })
                .success(function(datas){
                    callback(datas);
                })    
            }
        }else{
            var Sql2 = PrimarySql + " AND concat(c.name, ', ', c.stateAbbr) LIKE '%International%'   ORDER BY rand() LIMIT 0,8 ";
            console.log(Sql2);
            db.query(Sql2)
            .error(function(err2){
                console.log(err2+" "+Sql2)
            })
            .success(function(datas){
                callback(datas);
            })
        }
  });
} 

exports.loadall = function(jobTitle, location, category, callback){
  var PrimarySql = "select j.*, ji.image as job_image, ";
    PrimarySql += " concat(c.name, ', ', c.stateAbbr) as location ";
    PrimarySql += " from " + primaryTable + " as j ";
    PrimarySql += " inner join cities as c on (c.id = j.cityId) ";
    PrimarySql += " left join " + primaryTable + "_images as ji on ji.jobId = j.id and ji.profilepic = '1' ";
    PrimarySql += " WHERE j.status = '1' ";
  var Sql = PrimarySql;
  if(jobTitle && (typeof jobTitle != 'undefined')){
        Sql += " AND j.jobTitle LIKE '%"+jobTitle+"%' ";
    }
    if(location && (typeof location != 'undefined')){
        Sql += " AND concat(c.name, ', ', c.stateAbbr) LIKE '%"+location+"%' ";
    }
    if(category && (typeof category != 'undefined')){
        Sql += " AND j.categoryId = '"+category+"' ";
    }
  Sql += " ORDER BY j.createdAt ASC ";
  console.log(Sql);
  db.query(Sql)
  .error(function(err){
      console.log(err+" "+Sql);
  })
  .success(function(jobs) {
        if(jobs){
            if(jobs.length > 0){
                callback(jobs);
            }else{
                var Sql2 = PrimarySql + " j.status = '1' AND concat(c.name, ', ', c.stateAbbr) LIKE '%International%' ORDER BY createdAt ASC  ";
                console.log(Sql2);
                db.query(Sql2)
                .error(function(err2){
                    console.log(err2+" "+Sql2)
                })
                .success(function(datas){
                    callback(datas);
                })    
            }
        }else{
            var Sql2 = PrimarySql + " j.status = '1' AND concat(c.name, ', ', c.stateAbbr) LIKE '%International%' ORDER BY createdAt ASC  ";
            console.log(Sql2);
            db.query(Sql2)
            .error(function(err2){
                console.log(err2+" "+Sql2)
            })
            .success(function(datas){
                callback(datas);
            })
        }
  });
} 

exports.loadMyJobs = function(userId, callback){
  var Sql = "select j.*, ji.image as job_image, ";
    Sql += " concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as j ";
    Sql += " inner join cities as c on (c.id = j.cityId) ";
    Sql += " left join " + primaryTable + "_images as ji on ji.jobId = j.id and ji.profilepic = '1' ";
    Sql += " WHERE userId = '"+userId+"'  ORDER BY id DESC ";
  console.log(Sql);
  db.query(Sql)
  .error(function(err){
      console.log(err+" "+Sql);
  })
  .success(function(jobs) {
        if(jobs){
            if(jobs.length > 0){
                callback(jobs);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
  });
} 

exports.loadAllJobs = function(callback){
  var Sql = "select j.*, ji.image as job_image, ";
    Sql += " concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as j ";
    Sql += " inner join cities as c on (c.id = j.cityId) ";
    Sql += " left join " + primaryTable + "_images as ji on ji.jobId = j.id and ji.profilepic = '1' ";
    Sql += " ORDER BY id DESC ";
  console.log(Sql);
  db.query(Sql)
  .error(function(err){
      console.log(err+" "+Sql);
  })
  .success(function(jobs) {
        if(jobs){
            if(jobs.length > 0){
                callback(jobs);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
  });
} 



exports.list = function(param, callback){
  var Sql = "select j.*, ji.image as job_image, ";
    Sql += " concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as j ";
    Sql += " inner join cities as c on (c.id = j.cityId) ";
    Sql += " left join " + primaryTable + "_images as ji on ji.jobId = j.id and ji.profilepic = '1' ";
    Sql += " WHERE j.id = '" + param.id + "' ";
  db.query(Sql).success(function(jobs) {
		callback(jobs[0]);
  });
} 

exports.fetchDatabyId = function(id, callback){
  var Sql = "select j.* from " + primaryTable + " as j WHERE j.id = '" + id + "' ";
  db.query(Sql).success(function(jobs) {
		callback(jobs[0]);
  }); 
}

exports.fetchDatabyUrl = function(url, callback){
  var urlArr = url.split("_");
  var urlCnt = urlArr.length;
  var lastIndex = (urlCnt - 1);
  var modelId = urlArr[lastIndex];
  var Sql = "select j.*, ji.image as job_image, ";
    Sql += " concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as j ";
    Sql += " inner join cities as c on (c.id = j.cityId) ";
    Sql += " left join " + primaryTable + "_images as ji on ji.jobId = j.id and ji.profilepic = '1' ";
    Sql += " WHERE j.id = '" + modelId + "' ";
  db.query(Sql)
  .error(function(err){
      console.log(err);
  })
  .success(function(jobs) {
		callback(jobs[0]);
  }); 
}



exports.del = function(id, callback){
	Job.find({where: {id: id}}).success(function(remove){
		remove.destroy().on('success', function(info){
			callback("success");
		});
	});
}



exports.showUrl = function(callback){
    var Sql = "SELECT * FROM " + primaryTable + " WHERE status = '1' ";
    db.query(Sql).success(function(courses) {
        callback(courses);
      }); 
} 

exports.fetchData = function(param, callback){
    var Sql = "select j.*, ji.image as job_image, ";
    Sql += " concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as j ";
    Sql += " inner join cities as c on (c.id = j.cityId) ";
    Sql += " left join " + primaryTable + "_images as ji on ji.jobId = j.id and ji.profilepic = '1' ";
    Sql += " WHERE j.jobTitle IS NOT NULL  and  (j.closingDate > date_add(now(), INTERVAL -1 DAY) or j.closingDate = 0) ";
    if(param.courseName){
         Sql += " AND `jobTitle` LIKE '%"+param.courseName+"%' ";
        
    }
    if(param.location){
        if(param.location != "%"){
            Sql += " AND concat(c.name, ', ', c.stateAbbr) LIKE '%"+param.location+"%' ";  
        }
        
    }
    if(param.categoryId){
        Sql += " AND `categoryId` = '"+param.categoryId+"' ";
    }
    Sql += " ORDER BY `closingDate` ASC LIMIT 0, 200";
    //console.log(Sql);
    db.query(Sql).success(function(jobs) {
        callback(jobs);
      });
};

exports.fetchImages = function(callback){
    var sql = "select * from " + primaryTable + " where image_url is not null and localImg = '0' and status = 1 order by id asc limit 0, 100";
    
    db.query(sql)
    .error(function(err){
        console.log(err);
    })
    .success(function(data) {
        callback(data);	
    });
}

exports.updateImages = function(id, job_image, callback){
    var q = "update " + primaryTable + " set job_image = '"+job_image+"', localImg = '1' where id = '"+id+"' ";
    //console.log(q);
    db.query(q).success(function() {
        callback(true);	
    });
    
}

exports.checkJobByEmail = function(param, jobId, callback){
  var email = param.applicationEmail;
  var jobTitle = param.jobTitle;
    utility.mysql_real_escape_string(param.jobTitle, function(returnTitle){
        jobTitle = returnTitle;
        //console.log(jobTitle);
    });
  var cityId = param.city;
  var categoryId = param.category;
  var q = "select * from " + primaryTable + " where applicationEmail = '"+email+"' and jobTitle = '"+jobTitle+"' and cityId = '"+cityId+"' and categoryId = '"+categoryId+"'  ";
  if(jobId > 0){
      q += " and id <> '"+jobId+"' ";
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

exports.operatoradd = function(param, callback){
    var closingDate = param.from_year + '-' + param.from_month + '-' + param.from_date;
    var jobUrl = param.jobTitle;
    
    var jobTitle = param.jobTitle;
    utility.mysql_real_escape_string(param.jobTitle, function(returnTitle){
        jobTitle = returnTitle;
    });
    var sql = "insert into " + primaryTable + " set ";
    sql     += " jobTitle='"+jobTitle+"', ";
    sql     += " closingDate='"+closingDate+"', ";
    sql     += " categoryId='"+param.category+"', ";
    sql     += " job_typeId='"+param.job_typeId+"', ";
    sql     += " userId='"+param.userId+"', ";
    if(param.operator){
        sql     += " `operator`='"+param.operator+"', ";
    }else{
        sql     += " `operator`= null, "; 
    }
    if(param.description){
        var jobDesc = param.description;
        utility.mysql_real_escape_string(param.description, function(returnDesc){
            jobDesc = returnDesc;
        });
        sql     += " `description`='"+jobDesc+"', ";
    }else{
        sql     += " `description`= null, "; 
    }
    if(param.salary){
        var jobSalary = param.salary;
        utility.mysql_real_escape_string(param.salary, function(returnSalary){
            jobSalary = returnSalary;
        });
        sql     += " `salary`='"+jobSalary+"', ";        
    }else{
        sql     += " `salary`= null, "; 
    }    
    if(param.applicationWebsite){
        var jobWebsite = param.applicationWebsite;
        utility.mysql_real_escape_string(param.applicationWebsite, function(returnWebsite){
            jobWebsite = returnWebsite;
        });
        sql     += " `applicationWebsite`='"+jobWebsite+"', ";
    }
    if(param.applicationAddress){
        var jobAddress = param.applicationAddress;
        utility.mysql_real_escape_string(param.applicationAddress, function(returnAddress){
            jobAddress = returnAddress;
        });
        sql     += " `applicationAddress`='"+jobAddress+"', ";
    }else{
        sql     += " `applicationAddress`= null, "; 
    }
    if(param.applicationPhone){
        var jobPhone = param.applicationPhone;
        utility.mysql_real_escape_string(param.applicationPhone, function(returnPhone){
            jobPhone = returnPhone;
        });
        sql     += " `applicationPhone`='"+jobPhone+"', ";
    }else{
        sql     += " `applicationPhone`= null, "; 
    }
    sql     += " cityId='"+param.city+"', ";
    sql     += " `localImg`= '1', "; 
    sql     += " createdAt=NOW(), ";
    sql     += " updatedAt=NOW() ";
    db.query(sql)
    .error(function(err){
        console.log(err+" "+sql);
    })
    .success(function() {
        var q = "SELECT LAST_INSERT_ID() as id;";
        db.query(q).success(function(data){ 
            var jobId = data[0].id;
            if(param.job_image){
                param.title = jobTitle;
                param.image = param.job_image;
                param.profilepic = 1;
                param.jobId = jobId;
                jobImage.publicadd(param, function(data){
                    callback('Job added');
                });   
            }else{
               callback('Job added');
            }
                        	
        });
	
    });
}

exports.operatoredit = function(param, callback){
    var closingDate = param.from_year + '-' + param.from_month + '-' + param.from_date;
    
    var jobTitle = param.jobTitle;
    utility.mysql_real_escape_string(param.jobTitle, function(returnTitle){
        jobTitle = returnTitle;
        
    });
    var sql = "update " + primaryTable + " set ";
    sql     += " jobTitle='"+jobTitle+"', ";
    sql     += " closingDate='"+closingDate+"', ";
    sql     += " categoryId='"+param.category+"', ";
    sql     += " job_typeId='"+param.job_typeId+"', ";
    sql     += " userId='"+param.userId+"', ";
    if(param.operator){
        sql     += " `operator`='"+param.operator+"', ";
    }else{
        sql     += " `operator`= null, "; 
    }
    if(param.description){
        var jobDesc = param.description;
        utility.mysql_real_escape_string(param.description, function(returnDesc){
            jobDesc = returnDesc;
        });
        sql     += " `description`='"+jobDesc+"', ";
    }else{
        sql     += " `description`= null, "; 
    }
    if(param.salary){
        var jobSalary = param.salary;
        utility.mysql_real_escape_string(param.salary, function(returnSalary){
            jobSalary = returnSalary;
        });
        sql     += " `salary`='"+jobSalary+"', ";        
    }else{
        sql     += " `salary`= null, "; 
    }    
    if(param.applicationWebsite){
        var jobWebsite = param.applicationWebsite;
        utility.mysql_real_escape_string(param.applicationWebsite, function(returnWebsite){
            jobWebsite = returnWebsite;
        });
        sql     += " `applicationWebsite`='"+jobWebsite+"', ";
    }
    if(param.applicationAddress){
        var jobAddress = param.applicationAddress;
        utility.mysql_real_escape_string(param.applicationAddress, function(returnAddress){
            jobAddress = returnAddress;
        });
        sql     += " `applicationAddress`='"+jobAddress+"', ";
    }else{
        sql     += " `applicationAddress`= null, "; 
    }
    if(param.applicationPhone){
        var jobPhone = param.applicationPhone;
        utility.mysql_real_escape_string(param.applicationPhone, function(returnPhone){
            jobPhone = returnPhone;
        });
        sql     += " `applicationPhone`='"+jobPhone+"', ";
    }else{
        sql     += " `applicationPhone`= null, "; 
    }
    sql     += " cityId='"+param.city+"', ";
    sql     += " `localImg`= '0', "; 
    sql     += " updatedAt=NOW() ";
    sql     += " where id = '"+param.jobId+"' ";
    
    db.query(sql)
    .error(function(err){
        console.log(err+" "+sql);
        callback(false);
    })
    .success(function() {
	var jobId = param.jobId;
        if(param.job_image){
            param.title = jobTitle;
            param.image = param.job_image;
            param.profilepic = 1;
            param.jobId = jobId;
            jobImage.clearAllProfilePic(jobId, function(status){
                if(status){
                   jobImage.publicadd(param, function(data){
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