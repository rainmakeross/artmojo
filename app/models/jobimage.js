var schema = require('../../schema');
var Job = schema.Job;
var JobImage = schema.JobImage;
var db = schema.sequelize;
var primaryTable = 'jobs_images';

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





exports.findByJob = function(jobId, callback){
   var sql = "SELECT * FROM " + primaryTable + " WHERE jobId = '"+jobId+"' ";
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
    JobImage.find({ where: {id: id}}).success(function(data){ 
        callback(data);
      }); 
}

exports.publicadd = function(param, callback){
    var sql = "insert into " + primaryTable + " ";
        sql     += " set jobId='"+param.jobId+"', ";
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

exports.clearAllProfilePic = function(jobId, callback){
    var Sql = "update " + primaryTable + " set profilepic = '0' where jobId = '"+jobId+"' ";
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
    JobImage.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Job deleted"+info);
        });
    });
}