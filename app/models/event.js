var schema = require('../../schema');
var db = schema.sequelize;
var Event = schema.Event;
var utility = require('../helpers/utils');
var eventImage = require('./eventimage.js');
var primaryTable = 'events';


exports.listall = function(callback){
    var PrimarySql = "select e.*, ei.image as event_image, concat(c.name, ', ', c.stateAbbr) as location ";
    PrimarySql += " from " + primaryTable + " as e ";
    PrimarySql += " inner join cities as c on (c.id = e.cityId) ";
    PrimarySql += " inner join " + primaryTable + "_images as ei on ei.eventId = e.id and ei.profilepic = '1' ";
    PrimarySql += " where e.status = '1' order by e.createdAt desc ";
    console.log(PrimarySql);
    db.query(PrimarySql).success(function(data) {
      callback(data);
    });
} 

exports.publicadd = function(param, userId, callback){
    var fromDate = param.from_year + '-' + param.from_month + '-' + param.from_date;
    var toDate = param.to_year + '-' + param.to_month + '-' + param.to_date;
    
    
    var sql = "insert into " + primaryTable + " ";
    var eventTitle = param.title;
    utility.mysql_real_escape_string(param.title, function(returnTitle){
        eventTitle = returnTitle;
    });
    sql     += " set title='"+eventTitle+"', ";
    
    if(param.description){
        var eventDesc = param.description;
        utility.mysql_real_escape_string(param.description, function(returnDesc){
            eventDesc = returnDesc;
        });
        sql     += " `description`='"+eventDesc+"', ";
    }else{
        sql     += " `description`= null, "; 
    }
    sql     += " from_date='"+fromDate+"', ";
    sql     += " to_date='"+toDate+"', ";
    sql     += " contact_email='"+param.contact_email+"', ";
    if(param.contact_phone){
        var eventPhone = param.contact_phone;
        utility.mysql_real_escape_string(param.contact_phone, function(returnPhone){
            eventPhone = returnPhone;
        });
        sql     += " `contact_phone`='"+eventPhone+"', ";
    }else{
        sql     += " `contact_phone`= null, "; 
    }
    if(param.event_website){
        var eventWeb = param.event_website;
        utility.mysql_real_escape_string(param.event_website, function(returnWeb){
            eventWeb = returnWeb;
        });
        sql     += " `event_website`='"+eventWeb+"', ";
    }else{
        sql     += " `event_website`= null, "; 
    }
    if(param.contact_address){
        var eventAddress = param.contact_address;
        utility.mysql_real_escape_string(param.contact_address, function(returnAddress){
            eventAddress = returnAddress;
        });
        sql     += " `contact_address`='"+eventAddress+"', ";
    }else{
        sql     += " `contact_address`= null, "; 
    }
    sql     += " operator='"+param.operator+"', ";
    sql     += " userId='"+userId+"', ";
    sql     += " cityId='"+param.city+"', ";
    sql     += " categoryId='"+param.category+"', ";
    sql     += " `localImg`= '0', "; 
    sql     += " createdAt=NOW(), ";
    sql     += " updatedAt=NOW() ";
    console.log(sql);
    db.query(sql)
    .error(function(err){
        console.log(err);
    })
    .success(function() {
        var q = "SELECT LAST_INSERT_ID() as id;";
        db.query(q).success(function(data){ 
            var eventId = data[0].id;
            if(param.event_image){
                param.title = eventTitle;
                param.image = param.event_image;
                param.profilepic = 1;
                param.eventId = eventId;
                eventImage.publicadd(param, function(data){
                    callback('Event added');
                });   
            }else{
               callback('Event added');
            }
                        	
        });
        
	
    });
}

exports.publicedit = function(param, callback){
    var fromDate = param.from_year + '-' + param.from_month + '-' + param.from_date;
    var toDate = param.to_year + '-' + param.to_month + '-' + param.to_date;
    var sql = "update " + primaryTable + " ";
    var eventTitle = param.title;
    utility.mysql_real_escape_string(param.title, function(returnTitle){
        eventTitle = returnTitle;
    });
    sql     += " set title='"+eventTitle+"', ";
    
    if(param.description){
        var eventDesc = param.description;
        utility.mysql_real_escape_string(param.description, function(returnDesc){
            eventDesc = returnDesc;
        });
        sql     += " `description`='"+eventDesc+"', ";
    }else{
        sql     += " `description`= null, "; 
    }
    sql     += " from_date='"+fromDate+"', ";
    sql     += " to_date='"+toDate+"', ";
    sql     += " contact_email='"+param.contact_email+"', ";
    if(param.contact_phone){
        var eventPhone = param.contact_phone;
        utility.mysql_real_escape_string(param.contact_phone, function(returnPhone){
            eventPhone = returnPhone;
        });
        sql     += " `contact_phone`='"+eventPhone+"', ";
    }else{
        sql     += " `contact_phone`= null, "; 
    }
    if(param.event_website){
        var eventWeb = param.event_website;
        utility.mysql_real_escape_string(param.event_website, function(returnWeb){
            eventWeb = returnWeb;
        });
        sql     += " `event_website`='"+eventWeb+"', ";
    }else{
        sql     += " `event_website`= null, "; 
    }
    if(param.contact_address){
        var eventAddress = param.contact_address;
        utility.mysql_real_escape_string(param.contact_address, function(returnAddress){
            eventAddress = returnAddress;
        });
        sql     += " `contact_address`='"+eventAddress+"', ";
    }else{
        sql     += " `contact_address`= null, "; 
    }
    sql     += " operator='"+param.operator+"', ";
    sql     += " userId='"+ param.userId+"', ";
    sql     += " cityId='"+param.city+"', ";
    sql     += " categoryId='"+param.category+"', ";
    sql     += " `localImg`= '0', "; 
    sql     += " updatedAt=NOW() ";
    sql     += " where id = '"+param.eventId+"' ";
    
    db.query(sql)
    .error(function(err){
        console.log(err);
        console.log(sql);
        callback(false);
    })
    .success(function() {
	var eventId = param.eventId;
        if(param.event_image){
            param.title = eventTitle;
            param.image = param.event_image;
            param.profilepic = 1;
            param.eventId = eventId;
            eventImage.clearAllProfilePic(eventId, function(status){
                if(status){
                   eventImage.publicadd(param, function(data){
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




exports.loadevents = function(city, callback){
  var PrimarySql = "select e.*, ei.image as event_image, concat(c.name, ', ', c.stateAbbr) as location ";
    PrimarySql += " from " + primaryTable + " as e ";
    PrimarySql += " inner join cities as c on (c.id = e.cityId) ";
    PrimarySql += " inner join " + primaryTable + "_images as ei on ei.eventId = e.id and ei.profilepic = '1' ";
    PrimarySql += " where e.status = '1' and e.from_date >= NOW() ";
    var Sql = PrimarySql;
  if(city){
      Sql += " AND concat(c.name, ', ', c.stateAbbr) LIKE '%"+city+"%'  ";
  }
  Sql += "  ORDER BY e.from_date ASC LIMIT 0, 8 ";
  console.log(Sql);
  db.query(Sql).success(function(events) {
        if(events){
            if(events.length > 0){
                callback(events);
            }else{
                var Sql2 = PrimarySql + " AND concat(c.name, ', ', c.stateAbbr) LIKE '%International%'   ORDER BY e.from_date ASC LIMIT 0,8 ";
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
            var Sql2 = PrimarySql + " AND concat(c.name, ', ', c.stateAbbr) LIKE '%International%'   ORDER BY from_date ASC LIMIT 0,8 ";
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



exports.list = function(param, callback){
    var PrimarySql = "select e.*, ei.image as event_image, concat(c.name, ', ', c.stateAbbr) as location ";
    PrimarySql += " from " + primaryTable + " as e ";
    PrimarySql += " inner join cities as c on (c.id = e.cityId) ";
    PrimarySql += " inner join " + primaryTable + "_images as ei on ei.eventId = e.id and ei.profilepic = '1' ";
    PrimarySql += " where e.id = '" + param.id + "' ";
  db.query(PrimarySql).success(function(events) {
		callback(events[0]);
  });
} 

exports.fetchDatabyId = function(id, callback){
  var Sql = "select e.* from " + primaryTable + " as e where e.id = '" + id + "' ";
  db.query(Sql).success(function(events) {
		callback(events[0]);
  });
}

exports.fetchDatabyUrl = function(url, callback){
  var urlArr = url.split("_");
    var urlCnt = urlArr.length;
    var lastIndex = (urlCnt - 1);
    var modelId = urlArr[lastIndex];
  var PrimarySql = "select e.*, ei.image as event_image, concat(c.name, ', ', c.stateAbbr) as location ";
    PrimarySql += " from " + primaryTable + " as e ";
    PrimarySql += " inner join cities as c on (c.id = e.cityId) ";
    PrimarySql += " inner join " + primaryTable + "_images as ei on ei.eventId = e.id and ei.profilepic = '1' ";
    PrimarySql += " where e.id = '" + modelId + "' ";
  db.query(PrimarySql).success(function(events) {
		callback(events[0]);
  });
}

exports.listEvents = function(id, eventTitle, location, category, callback){
  var PrimarySql = "select e.*, ei.image as event_image, concat(c.name, ', ', c.stateAbbr) as location ";
    PrimarySql += " from " + primaryTable + " as e ";
    PrimarySql += " inner join cities as c on (c.id = e.cityId) ";
    PrimarySql += " inner join " + primaryTable + "_images as ei on ei.eventId = e.id and ei.profilepic = '1' ";
    PrimarySql += " where e.status = '1' ";
    var Sql = PrimarySql;
	if(eventTitle.length > 0){
            Sql += " AND e.title LIKE '%"+eventTitle+"%' ";
        }
        if(location.length > 0){
            Sql += " AND concat(c.name, ', ', c.stateAbbr) LIKE '%"+location+"%' ";
        }
        if(category.length > 0){
            Sql += " AND e.categoryId ='"+category+"' ";
        }
        Sql += " ORDER BY from_date, id DESC LIMIT 0, 100";
        //console.log(Sql);
        db.query(Sql).success(function(events) {
		var resdata = [], count = 0;
		if(events.length > 0) {
			events.forEach(function(event){
				var from = event.from_date.toString().split(' ');
				var to = event.to_date.toString().split(' ');
                                var url1 = "";
                                url1 = event.title;
                                url1 = url1.replace(/ /g, '_');
                                url1 = url1.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                                url1 += "_"+event.id;
                                url1 = url1.toLowerCase();
                                var url = '/events/view/?url='+url1;
                                if(id == event.userId){
                                    url = '/events/public/edit/?id='+event.id;
                                }
                                var image = event.event_image;
                                if(!event.event_image){
                                    image = "dummy_user.gif";
                                }
				var data = {
					"title": event.title,
					"start": from[3] + '-' + from[1] + '-' + from[2],
					"end": to[3] + '-' + to[1] + '-' + to[2],
					"id": event.id,
                                        "url": url,
                                        "image": image,
                                        "location": event.location
				};
				resdata.push(data);
				count ++;
				if(count == events.length)
					callback(resdata);
			});
		} else {
                   var Sql2 = PrimarySql + " AND concat(c.name, ', ', c.stateAbbr) LIKE '%International%' ORDER BY from_date, id DESC LIMIT 0, 100 ";
                    console.log(Sql2);
                    db.query(Sql2)
                    .error(function(err2){
                        console.log(err2+" "+Sql2)
                    })
                    .success(function(datas){
                        datas.forEach(function(data){
				var from = data.from_date.toString().split(' ');
				var to = data.to_date.toString().split(' ');
                                var url1 = "";
                                url1 = data.title;
                                url1 = url1.replace(/ /g, '_');
                                url1 = url1.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                                url1 += "_"+data.id;
                                url1 = url1.toLowerCase();
                                var url = '/events/view/?url='+url1;
                                if(id == data.userId){
                                    url = '/events/public/edit/?id='+data.id;
                                }
                                var image = data.event_image;
                                if(!data.event_image){
                                    image = "dummy_user.gif";
                                }
				var data = {
					"title": data.title,
					"start": from[3] + '-' + from[1] + '-' + from[2],
					"end": to[3] + '-' + to[1] + '-' + to[2],
					"id": data.id,
                                        "url": url,
                                        "image": image,
                                        "location": data.location
				};
				resdata.push(data);
				count ++;
				if(count == datas.length)
					callback(resdata);
			});
                    }) 
                }			
         }); 
} 



exports.del = function(id, callback){
	Event.find({where: {id: id}}).success(function(remove){
		remove.destroy().on('success', function(info){
			callback("success");
		});
	});
}

exports.fetchImages = function(callback){
    var sql = "select * from " + primaryTable + " where image_url is not null and localImg = '0' and status = 1 order by id asc limit 0, 100";
    
    db.query(sql).success(function(data) {
        callback(data);	
    });
}



exports.showUrl = function(callback){
    var Sql = "SELECT * FROM " + primaryTable + " WHERE status = '1' ";
    db.query(Sql).success(function(courses) {
        callback(courses);
      }); 
} 



exports.fetchData = function(param, callback){
    var Sql = "select e.id, e.title, e.from_date, e.to_date, e.localImg, ei.image as event_image, e.categoryId, ";
    Sql += " concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as e ";
    Sql += " inner join cities as c on (c.id = e.cityId) ";
    Sql += " inner join " + primaryTable + "_images as ei on ei.eventId = e.id and ei.profilepic = '1' ";
    Sql += " WHERE e.title IS NOT NULL and e.from_date > date_add(now(), INTERVAL -1 DAY) ";
    if(param.courseName.length > 0){
        if(param.courseName != "%"){
            Sql += " AND e.title LIKE '%"+param.courseName+"%' ";
        }
        
    }
    if(param.location){
        if(param.location != "%"){
            Sql += " AND concat(c.name, ', ', c.stateAbbr) LIKE '%"+param.location+"%' ";  
        }
        
    }
    if(param.categoryId){
        Sql += " AND e.categoryId = '"+param.categoryId+"' ";
    }
    
    
    Sql += " ORDER BY e.from_date ASC LIMIT 0, 200";
    //console.log(Sql);
    db.query(Sql)
    .error(function(err){
        console.log(err);
        callback(false);
    })
    .success(function(events) {
        callback(events);
      });
};

exports.loadMyEvents = function(userId, callback){
  var Sql = "select e.*, ei.image as event_image, concat(c.name, ', ', c.stateAbbr) as location ";
    Sql += " from " + primaryTable + " as e ";
    Sql += " inner join cities as c on (c.id = e.cityId) ";
    Sql += " left join " + primaryTable + "_images as ei on ei.eventId = e.id and ei.profilepic = '1' ";
    Sql += " where e.userId = '"+userId+"'  ORDER BY e.id DESC ";
   console.log(Sql);
  db.query(Sql)
  .error(function(err){
      console.log(err+" "+Sql);
  })
  .success(function(events) {
        if(events){
            if(events.length > 0){
                callback(events);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
  });
}

exports.checkEventByEmail = function(param,eventId, callback){
  var email = param.contact_email;
  var cityId = param.city;
  var categoryId = param.category;
  var eventTitle = param.title;
    utility.mysql_real_escape_string(param.title, function(returnTitle){
        eventTitle = returnTitle;
    });
  var q = "select * from " + primaryTable + " where contact_email = '"+email+"' and title = '"+eventTitle+"' and cityId = '"+cityId+"' and categoryId = '"+categoryId+"'  ";
  if(eventId > 0){
      q += " and id <> '"+eventId+"' ";
  }
  console.log(q);
  db.query(q)
  .error(function(err){
      console.log(err);
  })
  .success(function(data){
      console.log(data);
      if(data.length){
          callback(0);
      }else{
          callback(1);
      }
  })
}

exports.operatoradd = function(param, userId, callback){
    var fromDate = param.from_year + '-' + param.from_month + '-' + param.from_date;
    var toDate = param.to_year + '-' + param.to_month + '-' + param.to_date;
    var sql = "insert into " + primaryTable + " ";
    var eventTitle = param.title;
    utility.mysql_real_escape_string(param.title, function(returnTitle){
        eventTitle = returnTitle;
    });
    sql     += " set title='"+eventTitle+"', ";
    
    if(param.description){
        var eventDesc = param.description;
        utility.mysql_real_escape_string(param.description, function(returnDesc){
            eventDesc = returnDesc;
        });
        sql     += " `description`='"+eventDesc+"', ";
    }else{
        sql     += " `description`= null, "; 
    }
    sql     += " from_date='"+fromDate+"', ";
    sql     += " to_date='"+toDate+"', ";
    sql     += " contact_email='"+param.contact_email+"', ";
    if(param.contact_phone){
        var eventPhone = param.contact_phone;
        utility.mysql_real_escape_string(param.contact_phone, function(returnPhone){
            eventPhone = returnPhone;
        });
        sql     += " `contact_phone`='"+eventPhone+"', ";
    }else{
        sql     += " `contact_phone`= null, "; 
    }
    if(param.event_website){
        var eventWeb = param.event_website;
        utility.mysql_real_escape_string(param.event_website, function(returnWeb){
            eventWeb = returnWeb;
        });
        sql     += " `event_website`='"+eventWeb+"', ";
    }else{
        sql     += " `event_website`= null, "; 
    }
    if(param.contact_address){
        var eventAddress = param.contact_address;
        utility.mysql_real_escape_string(param.contact_address, function(returnAddress){
            eventAddress = returnAddress;
        });
        sql     += " `contact_address`='"+eventAddress+"', ";
    }else{
        sql     += " `contact_address`= null, "; 
    }
    sql     += " operator='"+param.operator+"', ";
    sql     += " userId='"+userId+"', ";
    sql     += " cityId='"+param.city+"', ";
    sql     += " categoryId='"+param.category+"', ";
    sql     += " `localImg`= '0', "; 
    sql     += " createdAt=NOW(), ";
    sql     += " updatedAt=NOW() ";
    console.log(sql);
    db.query(sql)
    .error(function(err){
        console.log(err);
    })
    .success(function() {
        var q = "SELECT LAST_INSERT_ID() as id;";
        db.query(q).success(function(data){ 
            var eventId = data[0].id;
            if(param.event_image){
                param.title = eventTitle;
                param.image = param.event_image;
                param.profilepic = 1;
                param.eventId = eventId;
                eventImage.publicadd(param, function(data){
                    callback('Event added');
                });   
            }else{
               callback('Event added');
            }
                        	
        });
	
    });
}

exports.operatoredit = function(param, callback){
    var fromDate = param.from_year + '-' + param.from_month + '-' + param.from_date;
    var toDate = param.to_year + '-' + param.to_month + '-' + param.to_date;
    
    var sql = "update " + primaryTable + " ";
    sql     += " set title='"+utility.mysql_real_escape_string(param.title)+"', ";
    
    if(param.description){
        var eventDesc = param.description;
        utility.mysql_real_escape_string(param.description, function(returnDesc){
            eventDesc = returnDesc;
        });
        sql     += " `description`='"+eventDesc+"', ";
    }else{
        sql     += " `description`= null, "; 
    }
    sql     += " from_date='"+fromDate+"', ";
    sql     += " to_date='"+toDate+"', ";
    sql     += " contact_email='"+param.contact_email+"', ";
    if(param.contact_phone){
        var eventPhone = param.contact_phone;
        utility.mysql_real_escape_string(param.contact_phone, function(returnPhone){
            eventPhone = returnPhone;
        });
        sql     += " `contact_phone`='"+eventPhone+"', ";
    }else{
        sql     += " `contact_phone`= null, "; 
    }
    if(param.event_website){
        var eventWeb = param.event_website;
        utility.mysql_real_escape_string(param.event_website, function(returnWeb){
            eventWeb = returnWeb;
        });
        sql     += " `event_website`='"+eventWeb+"', ";
    }else{
        sql     += " `event_website`= null, "; 
    }
    if(param.contact_address){
        var eventAddress = param.contact_address;
        utility.mysql_real_escape_string(param.contact_address, function(returnAddress){
            eventAddress = returnAddress;
        });
        sql     += " `contact_address`='"+eventAddress+"', ";
    }else{
        sql     += " `contact_address`= null, "; 
    }
    sql     += " operator='"+param.operator+"', ";
    sql     += " userId='"+ param.userId+"', ";
    sql     += " cityId='"+param.city+"', ";
    sql     += " categoryId='"+param.category+"', ";
    sql     += " `localImg`= '0', "; 
    sql     += " updatedAt=NOW() ";
    sql     += " where id = '"+param.eventId+"' ";
    
    db.query(sql)
    .error(function(err){
        console.log(err);
        console.log(sql);
        callback(false);
    })
    .success(function() {
	var eventId = param.eventId;
        if(param.event_image){
            param.title = eventTitle;
            param.image = param.event_image;
            param.profilepic = 1;
            param.eventId = eventId;
            eventImage.clearAllProfilePic(eventId, function(status){
                if(status){
                   eventImage.publicadd(param, function(data){
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