var schema = require('../../schema');
var UserType = schema.UserType;



// CRUD CODE

exports.list = function(callback){
    UserType.findAll().success(function(data) {
         callback(data);
    }); 
} 

exports.add = function(param, callback){
    var add = UserType.build({
        name: param.name
    });
    add.save()
    .error(function(err){
        callback("UserType not added"+err);
    })
    .success(function(){
        callback('UserType added');
    });
}

exports.edit = function(param, callback){
    UserType.find({where : {id: param.id}}).success(function(edit){
        edit.name = param.name;
        edit.save()
        .error(function(err){
            callback("UserType is not edited"+err);
        })
        .success(function(){
            callback("UserType edited successfully");
        });
    });
}

exports.del = function(id, callback){
    UserType.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("UserType deleted"+info);
        });
    });
}

