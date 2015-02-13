var schema = require('../../schema');
var TempArtist = schema.TempArtist;
var db = schema.sequelize;

// CRUD CODE

exports.list = function(callback){
    TempArtist.findAll().success(function(artists) {
         callback(artists);
    }); 
} 

exports.add = function(param, callback){
    var add = TempArtist.build({
        artistId: "0",
        mylisting: param.mylisting,
        your_email: param.your_email,
        notes: param.notes,
        first_name: param.first_name,
        last_name: param.last_name,
        description: param.description,
        artist_image: param.artist_image,
        address1: param.address1,
        cityId: param.cityId,
        stateId: param.stateId,
        countryId: param.countryId,
        zipcode: param.zipcode,
        phone: param.phone,
        email: param.id_email,
        facebook: param.facebook,
        twitter: param.twitter,
        tumblr: param.tumblr,
        youtube: param.youtube,
        website: param.website,
        courses: param.courses
    });
    add.save()
    .error(function(err){
        callback("TempArtist not added"+err);
    })
    .success(function(){
        callback('TempArtist added');
    });
}

exports.addByArtist = function(param, callback){
    var add = TempArtist.build({
        artistId: param.artistId,
        mylisting: param.mylisting,
        your_email: param.your_email,
        notes: param.notes,
        first_name: param.first_name,
        last_name: param.last_name,
        description: param.description,
        artist_image: param.artist_image,
        address1: param.address1,
        cityId: param.cityId,
        stateId: param.stateId,
        countryId: param.countryId,
        zipcode: param.zipcode,
        phone: param.phone,
        email: param.id_email,
        facebook: param.facebook,
        twitter: param.twitter,
        tumblr: param.tumblr,
        youtube: param.youtube,
        website: param.website,
        courses: param.courses
    });
    add.save()
    .error(function(err){
        callback("TempArtist not added"+err);
    })
    .success(function(){
        callback('TempArtist added');
    });
}



exports.del = function(id, callback){
    TempArtist.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("TempArtist deleted"+info);
        });
    });
}

