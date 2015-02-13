var schema = require('../../schema');
var Artist = schema.Artist;
var ArtistVideo = schema.ArtistVideo;
var db = schema.sequelize;

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
   var sql = "SELECT * FROM artist_videos WHERE artistId = '"+artistId+"' ";
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

exports.makeImageNull = function(id){
   var sql = "UPDATE artists SET artist_video = NULL WHERE id = '"+id+"'";
   db.query(sql).success(function() {
    //do nothing
  });
}

exports.findById = function(id, callback){
    ArtistVideo.find({ where: {id: id}}).success(function(data){ 
        callback(data);
      }); 
}



// CRUD CODE





exports.publicadd = function(param, callback){
    var sql = "insert into artist_videos ";
        sql     += " set artistId='"+param.artistId+"', ";
        sql     += " title='"+param.title+"', ";
        sql     += " videoCover='"+param.videoCover+"', ";
        sql     += " video='"+param.video+"', ";
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
    
    var sql = "update artist_videos ";
    sql     += " title='"+param.title+"', ";
    sql     += " videoCover='"+param.videoCover+"', ";
    sql     += " video='"+param.video+"', ";
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





exports.del = function(id, callback){
    ArtistVideo.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Artist deleted"+info);
        });
    });
}