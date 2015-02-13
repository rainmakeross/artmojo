var schema = require('../../schema');
var Region = schema.Region;



// CRUD CODE

exports.list = function(callback){
    Region.findAll().success(function(data) {
         callback(data);
    }); 
} 

exports.add = function(param, callback){
    var add = Region.build({
        cityId: param.cityId,
        name: param.name,
        region: param.region
    });
    add.save()
    .error(function(err){
        callback("Region not added"+err);
    })
    .success(function(){
        callback('Region added');
    });
}

exports.edit = function(param, callback){
    Region.find({where : {id: param.id}}).success(function(edit){
        edit.cityId = param.cityId;
        edit.name = param.name;
        edit.region = param.region;
        edit.save()
        .error(function(err){
            callback("Region is not edited"+err);
        })
        .success(function(){
            callback("Region edited successfully");
        });
    });
}

exports.del = function(id, callback){
    Region.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Region deleted"+info);
        });
    });
}

