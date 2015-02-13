var schema = require('../../schema');
var Event = schema.Event;
var EventImage = schema.EventImage;
var db = schema.sequelize;
var primaryTable = 'events_images';

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





exports.findByEvent = function(eventId, callback){
   var sql = "SELECT * FROM " + primaryTable + " WHERE eventId = '"+eventId+"' ";
   console.log(sql);
   db.query(sql)
   .error(function(err){
       console.log(err);
       callback(false);
   })
   .success(function(data) {
    callback(data);
  });
}



exports.findById = function(id, callback){
    EventImage.find({ where: {id: id}}).success(function(data){ 
        callback(data);
      }); 
}

exports.publicadd = function(param, callback){
    var sql = "insert into " + primaryTable + " ";
        sql     += " set eventId='"+param.eventId+"', ";
        sql     += " title='"+param.title+"', ";
        sql     += " image='"+param.image+"', ";
        sql     += " profilepic='"+param.profilepic+"', ";
        sql     += " createdAt=NOW(), ";
        sql     += " updatedAt=NOW() ";
        console.log(sql);
        db.query(sql)
        .error(function(err){
            console.log(err);
        })
        .success(function() {
            callback("success");	
        });
    
}

exports.publicedit = function(param, callback){
    
    var sql = "update " + primaryTable + " ";
    sql     += " title='"+param.title+"', ";
    sql     += " image='"+param.image+"', ";
    sql     += " updatedAt=NOW() where id = '"+param.id+"' ";
    console.log(sql);
    db.query(sql)
    .error(function(err){
        console.log(err);
    })
    .success(function() {
        callback("success");	
    });
    
}

exports.clearAllProfilePic = function(eventId, callback){
    var Sql = "update " + primaryTable + " set profilepic = '0' where eventId = '"+eventId+"' ";
    db.query(Sql)
    .error(function(err){
        console.log(err);
        callback(false);	
    })
    .success(function() {
        callback(true);	
    });
}





exports.del = function(id, callback){
    EventImage.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Event deleted"+info);
        });
    });
}