var schema = require('../../schema');
var Artist = schema.Artist;
var ArtistImage = schema.ArtistImage;
var db = schema.sequelize;
var primaryTable = 'artists_images';

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};
Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}





exports.findByArtist = function(artistId, callback){
   var sql = "SELECT * FROM " + primaryTable + " WHERE artistId = '"+artistId+"' ";
   console.log(sql);
   db.query(sql)
   .error(function(err){
       console.log(err);
       callback(false);
   })
   .success(function(data) {
    callback(data);
  });
}



exports.findById = function(id, callback){
    ArtistImage.find({ where: {id: id}}).success(function(data){ 
        callback(data);
      }); 
}

exports.publicadd = function(param, callback){
    var sql = "insert into " + primaryTable + " ";
        sql     += " set artistId='"+param.artistId+"', ";
        sql     += " title='"+param.title+"', ";
        sql     += " image='"+param.image+"', ";
        sql     += " profilepic='"+param.profilepic+"', ";
        sql     += " createdAt=NOW(), ";
        sql     += " updatedAt=NOW() ";
        console.log(sql);
        db.query(sql)
        .error(function(err){
            console.log(err);
        })
        .success(function() {
            callback("success");	
        });
    
}

exports.publicedit = function(param, callback){
    
    var sql = "update " + primaryTable + " ";
    sql     += " title='"+param.title+"', ";
    sql     += " image='"+param.image+"', ";
    sql     += " updatedAt=NOW() where id = '"+param.id+"' ";
    console.log(sql);
    db.query(sql)
    .error(function(err){
        console.log(err);
    })
    .success(function() {
        callback("success");	
    });
    
}

exports.clearAllProfilePic = function(artistId, callback){
    var Sql = "update " + primaryTable + " set profilepic = '0' where artistId = '"+artistId+"' ";
    db.query(Sql)
    .error(function(err){
        console.log(err);
        callback(false);	
    })
    .success(function() {
        callback(true);	
    });
}





exports.del = function(id, callback){
    ArtistImage.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Artist deleted"+info);
        });
    });
}