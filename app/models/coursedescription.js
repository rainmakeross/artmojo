var schema = require('../../schema');
var CourseDescription = schema.CourseDescription;

// CRUD CODE

exports.list = function(callback){
    CourseDescription.findAll().success(function(data) {
         callback(data);
    }); 
} 

exports.add = function(param, callback){
    var add = CourseDescription.build({
        name: param.name,
        description: param.description
    });
    add.save()
    .error(function(err){
        callback("CourseDescription not added"+err);
    })
    .success(function(){
        callback('CourseDescription added');
    });
}

exports.edit = function(param, callback){
    CourseDescription.find({where : {id: param.id}}).success(function(edit){
        edit.name = param.name;
        edit.description = param.description;
        edit.save()
        .error(function(err){
            callback("CourseDescription is not edited"+err);
        })
        .success(function(){
            callback("CourseDescription edited successfully");
        });
    });
}

exports.del = function(id, callback){
    CourseDescription.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("CourseDescription deleted"+info);
        });
    });
}

