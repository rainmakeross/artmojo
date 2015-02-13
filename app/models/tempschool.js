var schema = require('../../schema');
var TempSchool = schema.TempSchool;
var db = schema.sequelize;
// CRUD CODE

exports.list = function(callback){
    TempSchool.findAll().success(function(schools) {
         callback(schools);
    }); 
} 

exports.addBySchool = function(param, callback){
    var q = "insert into temp_schools set ";
    q    += " schoolId = '"+param.schoolId+"', ";
    q    += " mylisting = '"+param.mylisting+"', ";
    q    += " your_email = '"+param.your_email+"', ";
    q    += " notes = '"+param.notes+"', ";
    q    += " school_name = '"+param.school_name+"', ";
    q    += " description = '"+param.description+"', ";
    q    += " school_image = '"+param.school_image+"', ";
    q    += " address = '"+param.address1+"', ";
    q    += " cityId = '"+param.cityId+"', ";
    q    += " stateId = '"+param.stateId+"', ";
    q    += " countryId = '"+param.countryId+"', ";
    q    += " phone = '"+param.phone+"', ";
    q    += " email = '"+param.id_email+"', ";
    q    += " facebook = '"+param.facebook+"', ";
    q    += " twitter = '"+param.twitter+"', ";
    q    += " tumblr = '"+param.address1+"', ";
    q    += " youtube = '"+param.youtube+"', ";
    q    += " website = '"+param.website+"', ";
    q    += " courses = '"+param.course+"' ";
    console.log(q);
    db.query(q).success(function() {
	callback('School added');
    });
}

exports.add = function(param, callback){
    var q = "insert into temp_schools set ";
    q    += " schoolId = '0', ";
    q    += " mylisting = '"+param.mylisting+"', ";
    q    += " your_email = '"+param.your_email+"', ";
    q    += " notes = '"+param.notes+"', ";
    q    += " school_name = '"+param.school_name+"', ";
    q    += " description = '"+param.description+"', ";
    q    += " school_image = '"+param.school_image+"', ";
    q    += " address = '"+param.address1+"', ";
    q    += " cityId = '"+param.cityId+"', ";
    q    += " stateId = '"+param.stateId+"', ";
    q    += " countryId = '"+param.countryId+"', ";
    q    += " phone = '"+param.phone+"', ";
    q    += " email = '"+param.id_email+"', ";
    q    += " facebook = '"+param.facebook+"', ";
    q    += " twitter = '"+param.twitter+"', ";
    q    += " tumblr = '"+param.address1+"', ";
    q    += " youtube = '"+param.youtube+"', ";
    q    += " website = '"+param.website+"', ";
    q    += " courses = '"+param.course+"' ";
    console.log(q);
    db.query(q).success(function() {
	callback('School added');
    });
}

exports.del = function(id, callback){
    TempSchool.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("TempSchool deleted"+info);
        });
    });
}