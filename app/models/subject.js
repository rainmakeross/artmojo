var schema = require('../../schema');
var Subject = schema.Subject;
var utility = require('../helpers/utils');
var db = schema.sequelize;

exports.getSubjects = function(param, callback){
    var course_name = param.term;
    
    Subject.findAll({ where: ["subject_name like ?", '%' + course_name + '%'] }).success(function(subjects) {
        //console.log(subjects);
        callback(subjects);
      });
};


// CRUD CODE

exports.list = function(callback){
    Subject.findAll().success(function(data) {
         callback(data);
    }); 
} 

exports.listall = function(callback){
    var Sql = "select * from subjects order by createdAt desc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.fetchDatabyId = function(id, callback){
    Subject.find({ where: {id: id}}).success(function(data){ 
        callback(data);
      }); 
}

exports.checkSubjectByTitle = function(param, subjectId, callback){
  var subject_name  = param.subject_name;
  var courseId = param.course;
  var subject_name = param.subject_name;
    utility.mysql_real_escape_string(param.subject_name, function(returnTitle){
        subject_name = returnTitle;
    });
  var q = "select * from subjects where subject_name = '"+subject_name+"' and courseId = '"+courseId+"'  ";
  if(subjectId > 0){
      q += " and id <> '"+subjectId+"' ";
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
    
    var add = Subject.build({
        courseId: param.course,
        subject_name: param.subject_name
    });
    add.save()
    .error(function(err){
        callback("Subject not added"+err);
    })
    .success(function(){
        callback('Subject added');
    });
}

exports.edit = function(param, callback){
    
    Subject.find({where : {id: param.subjectId}}).success(function(edit){
        edit.courseId = param.course;
        edit.subject_name = param.subject_name;
        edit.save()
        .error(function(err){
            callback("Subject is not edited"+err);
        })
        .success(function(){
            callback("Subject edited successfully");
        });
    });
}

exports.del = function(id, callback){
    Subject.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Subject deleted"+info);
        });
    });
}