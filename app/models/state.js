var schema = require('../../schema');
var State = schema.State;
var db = schema.sequelize;


// CRUD CODE

exports.listall = function(callback){
    var Sql = "select * from states order by createdAt desc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.fetchDatabyId = function(id, callback){
    State.find({ where: {id: id}}).success(function(data){ 
        callback(data);
      }); 
}

exports.list = function(callback){
    State.findAll().success(function(data) {
         callback(data);
    }); 
} 

exports.show = function(countryId, callback){
	var Sql = "Select * from states where countryId='" + countryId + "'";
  db.query(Sql).success(function(states) {
    callback(states);
  });
} 

exports.add = function(param, callback){
    var add = State.build({
        countryId: param.country,
        name: param.name,
        abbr: param.abbr
    });
    add.save()
    .error(function(err){
        callback("State not added"+err);
    })
    .success(function(){
        callback('State added');
    });
}

exports.edit = function(param, callback){
    State.find({where : {id: param.id}}).success(function(edit){
        edit.countryId = param.country;
        edit.name = param.name;
        edit.abbr = param.abbr;
        edit.save()
        .error(function(err){
            callback("State is not edited"+err);
        })
        .success(function(){
            callback("State edited successfully");
        });
    });
}

exports.del = function(id, callback){
    State.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("State deleted"+info);
        });
    });
}

