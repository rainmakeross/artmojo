var schema = require('../../schema');
var City = schema.City;
var State = schema.State;
var db = schema.sequelize;

exports.getCities = function(param, callback){
    var name = param.term;
    
    City.findAll({ where: ["name like ?", '%' + name + '%'] }).success(function(cities) {
        callback(cities);
      });
};

exports.getState = function(id, callback){
    City.find({ where: {id: id}}).success(function(city){
        if(city){
            var stateId = city.stateId;
            State.find({ where: {id: stateId}}).success(function(state){
                callback(state);
            })
        }
    });
}



exports.show = function(stateId, callback){
  var Sql = "Select * from cities where stateId='" + stateId + "'";
  db.query(Sql).success(function(cities) {
    callback(cities);
  });
};

// CRUD CODE

exports.list = function(callback){
    City.findAll().success(function(data) {
         callback(data);
    }); 
} 

exports.fetchDatabyId = function(id, callback){
    City.find({ where: {id: id}}).success(function(data){ 
        //console.log(data.name);
        callback(data);
      }); 
}

exports.fetchDatabyGeoip = function(geo_cities, callback){
    City.find({ where: {geo_cities: geo_cities}}).success(function(data){ 
        //console.log(data.name);
        callback(data);
      }); 
}


exports.add = function(param, callback){
    var add = City.build({
        stateId: param.stateId,
        name: param.name
    });
    add.save()
    .error(function(err){
        callback("City not added"+err);
    })
    .success(function(){
        callback('City added');
    });
}

exports.edit = function(param, callback){
    City.find({where : {id: param.id}}).success(function(edit){
        edit.stateId = param.stateId;
        edit.name = param.name;
        edit.save()
        .error(function(err){
            callback("City is not edited"+err);
        })
        .success(function(){
            callback("City edited successfully");
        });
    });
}

exports.del = function(id, callback){
    City.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("City deleted"+info);
        });
    });
}

