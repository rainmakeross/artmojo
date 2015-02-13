var schema = require('../../schema');
var Subscriber = schema.Subscriber;

// CRUD CODE

exports.list = function(callback){
    Subscriber.findAll().success(function(data) {
         callback(data);
    }); 
} 

exports.add = function(param, callback){
    console.log(param);
    var add = Subscriber.build({
        email: param.nltext
    });
    add.save()
    .error(function(err){
        callback("Subscriber not added"+err);
    })
    .success(function(){
        callback('You are successfully added to our mailing lists.');
    });
}

exports.edit = function(param, callback){
    Subscriber.find({where : {id: param.id}}).success(function(edit){
        edit.email = param.email;
        edit.save()
        .error(function(err){
            callback("Subscriber is not edited"+err);
        })
        .success(function(){
            callback("Subscriber edited successfully");
        });
    });
}

exports.del = function(id, callback){
    Subscriber.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Subscriber deleted"+info);
        });
    });
}

