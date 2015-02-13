var schema = require('../../schema');
var Course = schema.Course;
var CourseImage = schema.CourseImage;
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





exports.findByCourse = function(courseId, callback){
   var sql = "SELECT * FROM courses_images WHERE courseId = '"+courseId+"' ";
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

exports.makeImageNull = function(id){
   var sql = "UPDATE courses SET course_image = NULL WHERE id = '"+id+"'";
   db.query(sql).success(function() {
    //do nothing
  });
}

exports.findById = function(id, callback){
    CourseImage.find({ where: {id: id}}).success(function(data){ 
        callback(data);
      }); 
}

exports.publicadd = function(param, callback){
    var sql = "insert into courses_images ";
        sql     += " set courseId='"+param.courseId+"', ";
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
    
    var sql = "update courses_images ";
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





exports.del = function(id, callback){
    CourseImage.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Course deleted"+info);
        });
    });
}