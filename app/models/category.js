var schema = require('../../schema');
var db = schema.sequelize;
var Category = schema.Category;

// CRUD CODE

exports.listall = function(callback){
    var Sql = "select * from categories order by createdAt desc";
    console.log(Sql);
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.fetchDatabyId = function(id, callback){
    Category.find({ where: {id: id}}).success(function(data){ 
        callback(data);
      }); 
}

exports.list = function(callback){
    Category.findAll().success(function(data) {
         callback(data);
    }); 
} 

exports.add = function(param, callback){
    var add = Category.build({
        name: param.name
    });
    add.save()
    .error(function(err){
        callback("Category not added"+err);
    })
    .success(function(){
        callback('Category added');
    });
}

exports.edit = function(param, callback){
    Category.find({where : {id: param.id}}).success(function(edit){
        edit.name = param.name;
        edit.save()
        .error(function(err){
            callback("Category is not edited"+err);
        })
        .success(function(){
            callback("Category edited successfully");
        });
    });
}

exports.del = function(id, callback){
    Category.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Category deleted"+info);
        });
    });
}

