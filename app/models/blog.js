var schema = require('../../schema');
var Blog = schema.Blog;
var BlogComment = schema.BlogComment;
var BlogRating = schema.BlogRating;
var userModel = require('./user.js');
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

exports.showDetails = function(url, callback){
    var urlArr = url.split("_");
    var urlCnt = urlArr.length;
    var lastIndex = (urlCnt - 1);
    var modelId = urlArr[lastIndex];
    db.query("SELECT b.*, u.first_name, u.last_name FROM blogs as b, users as u WHERE b.userId = u.id AND b.id = '"+modelId+"' ").success(function(blog) {
        callback(blog[0]); 
      });
}



exports.loadAll = function(callback){
   db.query("SELECT b.*, u.first_name, u.last_name FROM blogs as b, users as u WHERE b.userId = u.id AND b.status = '1' order by b.id desc").success(function(myTableRows) {
    callback(myTableRows); 
  });
}

exports.loadSample = function(callback){
   db.query("SELECT b.*, u.first_name, u.last_name FROM blogs as b, users as u WHERE b.userId = u.id AND b.status = '1' order by b.id desc").success(function(myTableRows) {
    callback(myTableRows); 
  });
}

exports.publicadd = function(param, userId, callback){
    
    var sql = "insert into blogs ";
    sql     += " set title='"+param.title+"', ";
    sql     += " content='"+param.content+"', ";
    sql     += " userId='"+userId+"', ";
    sql     += " createdAt=NOW(), ";
    sql     += " updatedAt=NOW() ";
    db.query(sql)
    .error(function(err){
        console.log(err+" "+sql);
        callback(false);
    })
    .success(function() {
        callback('Blog added');
        //callback('Blog added');	
    });
}

exports.publicedit = function(param, callback){
    
    var sql = "update blogs ";
    sql     += " set title='"+param.title+"', ";
    sql     += " content='"+param.content+"', ";
    sql     += " updatedAt=NOW() where id = '"+param.blogId+"' ";
    console.log(sql);
    db.query(sql).success(function() {
	callback('success');
    });
}

exports.showReview = function(id, callback){
     
    db.query("SELECT bc.*, u.first_name, u.last_name FROM blog_comments as bc, users as u WHERE bc.userId = u.id AND bc.blogId = '"+id+"' order by bc.id desc")
    .success(function(reviews) {
        callback(reviews); 
      });
}

exports.addReview = function(userId, param, callback){
    //var insert = "INSERT INTO blog_comments WHERE ";
    var add = BlogComment.build({
        comments: param.review,
        blogId: param.id,
        userId: userId,
        active: '1',
        rate: '0'
    });
    add.save()
    .error(function(err){
        console.log(err);
        db.query("SELECT bc.*, u.first_name, u.last_name FROM blog_comments as bc, users as u WHERE bc.userId = u.id AND bc.blogId = '"+param.id+"' order by bc.id desc")
        .success(function(reviews) {
                callback(reviews); 
              });
    })
    .success(function(){
        
        
        var Sql = "UPDATE blogs SET total_comments = total_comments + 1 WHERE id = '"+param.id+"'";
        db.query(Sql)
        .success(function(){
           db.query("SELECT bc.*, u.first_name, u.last_name FROM blog_comments as bc, users as u WHERE bc.userId = u.id AND bc.blogId = '"+param.id+"' order by bc.id desc")
           .success(function(reviews) {
                callback(reviews); 
              }); 
        });
         
    });
}

exports.addRating = function(param, userId, callback){
   //check data
   //console.log(userId);
   BlogRating.count({where : {blogId: param.extraP, userId: userId}}).success(function(c){
       var returnVal = 0;
       if(c == 0){
           //add rating
           var add = BlogRating.build({
                blogId: param.extraP,
                userId: userId,
                vote: (param.rate/4)
            });
            add.save()
            .error(function(err){
                console.log(err);
            })
            .success(function(){
                //little calculation
                BlogRating.find({
                    attributes: ['id', ['AVG(`vote`)', 'totalRate']], 
                    where: {blogId: param.extraP }
                }).success(function(rating){ 
                    
                    var Sql = "UPDATE blogs SET total_rate = '"+rating.totalRate+"' WHERE id = '"+param.extraP+"' ";
                    db.query(Sql).success(function(){
                        callback(rating.totalRate);
                    })
                    
                        
                }); 
                /*var returnVal = 1;
                callback(returnVal);*/
            });
           
       }else{
           //do not add
           callback(returnVal);
       }
   });
}
