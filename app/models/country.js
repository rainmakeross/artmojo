var schema = require('../../schema');
var Country = schema.Country;
var db = schema.sequelize;

// CRUD CODE

exports.listall = function(callback){
    var Sql = "select * from countries order by createdAt desc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.fetchDatabyId = function(id, callback){
    Country.find({ where: {id: id}}).success(function(data){ 
        callback(data);
      }); 
}

exports.list = function(callback){
    var Sql = "select * from countries order by name asc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.add = function(param, callback){
    var add = Country.build({
        name: param.name
    });
    add.save()
    .error(function(err){
        callback("Country not added"+err);
    })
    .success(function(){
        callback('Country added');
    });
}

exports.edit = function(param, callback){
    Country.find({where : {id: param.id}}).success(function(edit){
        edit.name = param.name;
        edit.save()
        .error(function(err){
            callback("Country is not edited"+err);
        })
        .success(function(){
            callback("Country edited successfully");
        });
    });
}

exports.del = function(id, callback){
    Country.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Country deleted"+info);
        });
    });
}

