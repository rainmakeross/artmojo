var schema = require('../../schema');
var JobType = schema.JobType;

// CRUD CODE

exports.list = function(callback){
    JobType.findAll().success(function(data) {
         callback(data);
    }); 
} 

exports.add = function(param, callback){
    var add = JobType.build({
        name: param.name
    });
    add.save()
    .error(function(err){
        callback("Job Type not added"+err);
    })
    .success(function(){
        callback('Job Type added');
    });
}

exports.edit = function(param, callback){
    JobType.find({where : {id: param.id}}).success(function(edit){
        edit.name = param.name;
        edit.save()
        .error(function(err){
            callback("Job Type is not edited"+err);
        })
        .success(function(){
            callback("Job Type edited successfully");
        });
    });
}

exports.del = function(id, callback){
    JobType.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Job Type deleted"+info);
        });
    });
}

